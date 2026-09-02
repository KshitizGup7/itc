/**
 * Pure payroll calculation logic — no I/O, no Supabase, no `new Date()` with
 * no argument, no reliance on the machine's local timezone. Every function
 * takes its "as of" / "since" dates explicitly, as plain ISO date strings
 * ("YYYY-MM-DD"). Because those strings are zero-padded, plain string
 * comparison (`<`, `<=`, `>`) is chronologically correct without ever
 * constructing a Date object — which sidesteps timezone bugs entirely for
 * this layer. The caller (a Server Action) is responsible for resolving
 * "today" server-side, in Asia/Kolkata, and passing it in.
 *
 * This file has no dependencies and is unit tested exhaustively in
 * payroll-math.test.ts — run `npx vitest run` to verify.
 */

export type DayStatus = "present" | "half" | "absent";

export interface WageHistoryEntry {
  dailyWage: number; // whole rupees, integer, > 0
  effectiveFrom: string; // ISO date "YYYY-MM-DD"
}

export interface AttendanceEntry {
  date: string; // ISO date
  status: DayStatus;
}

export interface TransactionEntry {
  date: string; // ISO date
  amount: number; // whole rupees, integer, >= 0
  type: "advance" | "salary";
}

export interface BalanceResult {
  daysPresent: number; // informational — 1 per present day, 0.5 per half-day
  earnedRupees: number; // whole rupees
  advancesSince: number; // whole rupees
  salaryPaidSince: number; // whole rupees
  balanceDue: number; // whole rupees — CAN be negative, meaning the worker owes the business
}

export interface SettlementSplit {
  salaryPortion: number; // recorded as a salary payment now
  carryForwardAdvance: number; // recorded as a new advance dated the next day (0 if none)
  remainingDue: number; // still owed after this settlement (0 if fully settled)
  fullySettled: boolean; // whether the worker's "last settled" date should move forward
}

/**
 * Resolve the wage in effect on a given date: the entry with the latest
 * effectiveFrom that is on or before `date`. Returns 0 if no entry applies
 * yet (date is before the worker's first recorded wage) — callers should
 * treat 0 as "no wage on record for this date," not a real rate.
 */
export function resolveWageForDate(history: WageHistoryEntry[], date: string): number {
  let best: WageHistoryEntry | null = null;
  for (const entry of history) {
    if (entry.effectiveFrom > date) continue;
    if (best === null || entry.effectiveFrom > best.effectiveFrom) best = entry;
  }
  return best ? best.dailyWage : 0;
}

/**
 * Rupees earned for one day's attendance at a given wage. Rounding happens
 * ONLY here, ONLY for half-days (a full day at an integer wage is already a
 * whole number; absent is always 0). This keeps rounding in exactly one,
 * well-tested place instead of scattered across summed totals.
 */
export function earnedForDay(status: DayStatus, wage: number): number {
  if (status === "present") return wage;
  if (status === "half") return Math.round(wage / 2);
  return 0;
}

/** Day-value for display purposes only (never used directly in money math). */
export function dayValue(status: DayStatus): number {
  if (status === "present") return 1;
  if (status === "half") return 0.5;
  return 0;
}

/**
 * Compute a worker's running balance. Counts attendance/transactions with
 * date > sinceDate (strictly after — sinceDate itself is considered already
 * settled) and <= asOfDate. sinceDate === null means "count everything on
 * record" (a worker who has never been settled).
 */
export function computeBalance(params: {
  attendance: AttendanceEntry[];
  wageHistory: WageHistoryEntry[];
  transactions: TransactionEntry[];
  sinceDate: string | null;
  asOfDate: string;
}): BalanceResult {
  const { attendance, wageHistory, transactions, sinceDate, asOfDate } = params;

  const inWindow = (d: string) => (sinceDate === null || d > sinceDate) && d <= asOfDate;

  const relevantAttendance = attendance.filter((a) => inWindow(a.date));
  const daysPresent = relevantAttendance.reduce((sum, a) => sum + dayValue(a.status), 0);
  const earnedRupees = relevantAttendance.reduce(
    (sum, a) => sum + earnedForDay(a.status, resolveWageForDate(wageHistory, a.date)),
    0
  );

  const relevantTx = transactions.filter((t) => inWindow(t.date));
  const advancesSince = relevantTx.filter((t) => t.type === "advance").reduce((s, t) => s + t.amount, 0);
  const salaryPaidSince = relevantTx.filter((t) => t.type === "salary").reduce((s, t) => s + t.amount, 0);

  const balanceDue = earnedRupees - advancesSince - salaryPaidSince;

  return { daysPresent, earnedRupees, advancesSince, salaryPaidSince, balanceDue };
}

/**
 * Decide how to record an actual payment against what's due.
 * Throws (deliberately, loudly) if misused — due <= 0 means there is
 * nothing to settle, and a negative actualPaid is never valid. Callers
 * (Server Actions) must guard against due <= 0 before offering "Clear
 * Payment" at all, exactly as the UI already does.
 */
export function splitSettlement(due: number, actualPaid: number): SettlementSplit {
  if (due <= 0) {
    throw new Error("splitSettlement: nothing is due — caller must guard against due <= 0");
  }
  if (actualPaid < 0 || !Number.isFinite(actualPaid)) {
    throw new Error("splitSettlement: actualPaid must be a non-negative number");
  }
  if (actualPaid >= due) {
    return { salaryPortion: due, carryForwardAdvance: actualPaid - due, remainingDue: 0, fullySettled: true };
  }
  return { salaryPortion: actualPaid, carryForwardAdvance: 0, remainingDue: due - actualPaid, fullySettled: false };
}
