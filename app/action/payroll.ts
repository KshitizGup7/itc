"use server";
import { randomUUID } from "crypto";
import { supabaseAdmin, todayIST } from "@/lib/supabase-server";
import {
  computeBalance,
  splitSettlement,
  type AttendanceEntry,
  type TransactionEntry,
  type WageHistoryEntry,
} from "@/lib/payroll-math";

export interface PayrollRow {
  name: string;
  daysPresent: number;
  advancesSince: number;
  salaryPaidSince: number;
  balanceDue: number; // can be negative — the worker owes the business
  since: string | null;
}

async function loadPayrollInputs() {
  const [staffRes, attRes, payRes, wageRes] = await Promise.all([
    supabaseAdmin.from("staff").select("name, last_settled_date").eq("active", true),
    supabaseAdmin.from("attendance").select("staff_name, date, status"),
    supabaseAdmin.from("payments").select("staff_name, date, amount, type"),
    supabaseAdmin.from("wage_history").select("staff_name, daily_wage, effective_from"),
  ]);
  if (staffRes.error) throw new Error(`Failed to load staff: ${staffRes.error.message}`);
  if (attRes.error) throw new Error(`Failed to load attendance: ${attRes.error.message}`);
  if (payRes.error) throw new Error(`Failed to load payments: ${payRes.error.message}`);
  if (wageRes.error) throw new Error(`Failed to load wage history: ${wageRes.error.message}`);
  return {
    staff: staffRes.data || [],
    attendance: attRes.data || [],
    payments: payRes.data || [],
    wages: wageRes.data || [],
  };
}

function buildBalanceInputs(
  staffName: string,
  attendance: { staff_name: string; date: string; status: string }[],
  payments: { staff_name: string; date: string; amount: number | string; type: string | null }[],
  wages: { staff_name: string; daily_wage: number; effective_from: string }[]
) {
  const wageHistory: WageHistoryEntry[] = wages
    .filter((w) => w.staff_name === staffName)
    .map((w) => ({ dailyWage: w.daily_wage, effectiveFrom: w.effective_from }));
  const workerAttendance: AttendanceEntry[] = attendance
    .filter((a) => a.staff_name === staffName)
    .map((a) => ({ date: a.date, status: a.status === "present" || a.status === "half" ? a.status : "absent" }));
  const workerTx: TransactionEntry[] = payments
    .filter((p) => p.staff_name === staffName)
    .map((p) => ({ date: p.date, amount: Number(p.amount), type: p.type === "salary" ? "salary" : "advance" }));
  return { wageHistory, workerAttendance, workerTx };
}

export async function getPayrollRows(): Promise<PayrollRow[]> {
  const { staff, attendance, payments, wages } = await loadPayrollInputs();
  const today = todayIST();

  return staff.map((s) => {
    const { wageHistory, workerAttendance, workerTx } = buildBalanceInputs(s.name, attendance, payments, wages);
    const balance = computeBalance({
      attendance: workerAttendance,
      wageHistory,
      transactions: workerTx,
      sinceDate: s.last_settled_date,
      asOfDate: today,
    });
    return {
      name: s.name,
      daysPresent: balance.daysPresent,
      advancesSince: balance.advancesSince,
      salaryPaidSince: balance.salaryPaidSince,
      balanceDue: balance.balanceDue,
      since: s.last_settled_date,
    };
  });
}

/**
 * Clear a worker's payment. Recomputes the balance fresh, server-side —
 * never trusts a "due" figure passed in from the client, since it could be
 * stale by the time the button is actually pressed. The actual write goes
 * through apply_payroll_settlement (migration-v2.sql), which locks the
 * worker's row, re-checks for a concurrent settlement, and is idempotent
 * against a retried request — so this function can be safely called again
 * if the network drops mid-request without risking a duplicate payment.
 */
export async function clearPayment(
  staffName: string,
  actualPaidRupees: number
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  if (!Number.isFinite(actualPaidRupees) || actualPaidRupees < 0) {
    return { ok: false, error: "Enter a valid amount" };
  }

  const { staff, attendance, payments, wages } = await loadPayrollInputs();
  const worker = staff.find((s) => s.name === staffName);
  if (!worker) return { ok: false, error: "Worker not found" };

  const today = todayIST();
  const { wageHistory, workerAttendance, workerTx } = buildBalanceInputs(staffName, attendance, payments, wages);
  const balance = computeBalance({
    attendance: workerAttendance,
    wageHistory,
    transactions: workerTx,
    sinceDate: worker.last_settled_date,
    asOfDate: today,
  });

  if (balance.balanceDue <= 0) return { ok: false, error: "Nothing is due right now" };

  const split = splitSettlement(balance.balanceDue, Math.round(actualPaidRupees));

  const carryForward = new Date(`${today}T00:00:00Z`);
  carryForward.setUTCDate(carryForward.getUTCDate() + 1);
  const carryForwardDateStr = carryForward.toISOString().split("T")[0];

  const { error } = await supabaseAdmin.rpc("apply_payroll_settlement", {
    p_staff_name: staffName,
    p_expected_last_settled_date: worker.last_settled_date,
    p_salary_portion: split.salaryPortion,
    p_carry_forward_advance: split.carryForwardAdvance,
    p_new_last_settled_date: split.fullySettled ? today : null,
    p_settlement_date: today,
    p_carry_forward_date: carryForwardDateStr,
    p_idempotency_key: randomUUID(),
  });

  if (error) {
    if (error.message.includes("CONCURRENT_MODIFICATION")) {
      return { ok: false, error: "This balance changed since you loaded it — refresh and try again." };
    }
    return { ok: false, error: error.message };
  }

  if (split.fullySettled) {
    return {
      ok: true,
      message:
        split.carryForwardAdvance > 0
          ? `Cleared — ₹${split.carryForwardAdvance.toLocaleString()} extra added as next advance.`
          : `Payment cleared for ${staffName}.`,
    };
  }
  return { ok: true, message: `₹${split.salaryPortion.toLocaleString()} recorded — ₹${split.remainingDue.toLocaleString()} still due.` };
}

/**
 * One-time helper for the migration moment: sets every active worker's
 * last_settled_date to today, without recording any payment. Without this,
 * everyone's balance would count every present day ever recorded.
 */
export async function initializePayrollBaseline(): Promise<{ ok: true } | { ok: false; error: string }> {
  const today = todayIST();
  const { data: staff, error: staffErr } = await supabaseAdmin.from("staff").select("name").eq("active", true);
  if (staffErr) return { ok: false, error: staffErr.message };

  const { error } = await supabaseAdmin
    .from("staff")
    .update({ last_settled_date: today })
    .in("name", (staff || []).map((s) => s.name));
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
