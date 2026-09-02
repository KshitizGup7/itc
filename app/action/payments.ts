"use server";
import { supabaseAdmin, todayIST } from "@/lib/supabase-server";

export interface AdvanceEntry {
  id: number;
  date: string;
  amount: number;
  notes: string;
  type: "advance" | "salary";
}

type ActionResult = { ok: true } | { ok: false; error: string };

export async function getAdvancesForMonth(month: number, year: number): Promise<Record<string, AdvanceEntry[]>> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("id, staff_name, date, amount, notes, type")
    .eq("month", month)
    .eq("year", year)
    .order("date");
  if (error) throw new Error(`Failed to load advances: ${error.message}`);
  const map: Record<string, AdvanceEntry[]> = {};
  (data || []).forEach((p) => {
    if (!map[p.staff_name]) map[p.staff_name] = [];
    map[p.staff_name].push({
      id: p.id,
      date: p.date,
      amount: Number(p.amount),
      notes: p.notes || "",
      type: p.type === "salary" ? "salary" : "advance",
    });
  });
  return map;
}

export async function addAdvance(
  staffName: string,
  month: number,
  year: number
): Promise<{ ok: true; entry: AdvanceEntry } | { ok: false; error: string }> {
  const date = todayIST();
  const { data, error } = await supabaseAdmin
    .from("payments")
    .insert({ staff_name: staffName, month, year, date, amount: 0, notes: "", type: "advance" })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, entry: { id: data.id, date, amount: 0, notes: "", type: "advance" } };
}

export async function updateAdvance(
  id: number,
  date: string,
  amount: number,
  notes: string,
  type: "advance" | "salary"
): Promise<ActionResult> {
  if (!Number.isFinite(amount) || amount < 0) return { ok: false, error: "Amount can't be negative" };
  const { error } = await supabaseAdmin
    .from("payments")
    .update({ date, amount: Math.round(amount), notes, type })
    .eq("id", id)
    .is("idempotency_key", null); // never allow editing a settlement-generated row through this path
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteAdvance(id: number): Promise<ActionResult> {
  const { error } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("id", id)
    .is("idempotency_key", null); // same protection as above
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function clearMonthAdvances(month: number, year: number): Promise<ActionResult> {
  const { error } = await supabaseAdmin.from("payments").delete().eq("month", month).eq("year", year);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
