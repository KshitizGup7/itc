"use server";
import { supabaseAdmin, todayIST } from "@/lib/supabase-server";

export interface StaffSummary {
  name: string;
  dailyWage: number;
  joiningDate: string;
  active: boolean;
  lastSettledDate: string | null;
}

type ActionResult = { ok: true } | { ok: false; error: string };

/** Current wage = the wage_history row with the latest effective_from <= today. */
function resolveCurrentWage(history: { daily_wage: number; effective_from: string }[], today: string): number {
  const applicable = history
    .filter((w) => w.effective_from <= today)
    .sort((a, b) => (a.effective_from < b.effective_from ? 1 : -1));
  return applicable.length ? applicable[0].daily_wage : 0;
}

export async function listStaff(includeInactive = false): Promise<StaffSummary[]> {
  let query = supabaseAdmin.from("staff").select("name, joining_date, active, last_settled_date").order("name");
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load staff: ${error.message}`);

  const names = (data || []).map((s) => s.name);
  const { data: wageRows, error: wageErr } = await supabaseAdmin
    .from("wage_history")
    .select("staff_name, daily_wage, effective_from")
    .in("staff_name", names.length ? names : ["__none__"]);
  if (wageErr) throw new Error(`Failed to load wage history: ${wageErr.message}`);

  const today = todayIST();
  return (data || []).map((s) => ({
    name: s.name,
    dailyWage: resolveCurrentWage((wageRows || []).filter((w) => w.staff_name === s.name), today),
    joiningDate: s.joining_date,
    active: s.active,
    lastSettledDate: s.last_settled_date,
  }));
}

export async function addStaffMember(name: string, dailyWage: number, joiningDate?: string): Promise<ActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Name is required" };
  if (!Number.isFinite(dailyWage) || dailyWage <= 0) return { ok: false, error: "Enter a valid daily wage" };

  const { data: existing, error: findErr } = await supabaseAdmin.from("staff").select("name").ilike("name", trimmed);
  if (findErr) return { ok: false, error: findErr.message };
  if (existing && existing.length > 0) return { ok: false, error: `${trimmed} is already on the list` };

  const today = todayIST();
  const effective = joiningDate || today;

  const { error: staffErr } = await supabaseAdmin
    .from("staff")
    .insert({ name: trimmed, joining_date: effective, active: true, last_settled_date: null });
  if (staffErr) return { ok: false, error: staffErr.message };

  const { error: wageErr } = await supabaseAdmin
    .from("wage_history")
    .insert({ staff_name: trimmed, daily_wage: Math.round(dailyWage), effective_from: effective });
  if (wageErr) return { ok: false, error: wageErr.message };

  return { ok: true };
}

/** Wage changes are append-only — this never overwrites a past rate. */
export async function updateStaffWage(name: string, newDailyWage: number, effectiveFrom?: string): Promise<ActionResult> {
  if (!Number.isFinite(newDailyWage) || newDailyWage <= 0) return { ok: false, error: "Enter a valid daily wage" };
  const effective = effectiveFrom || todayIST();

  const { data: staffRow, error: staffErr } = await supabaseAdmin.from("staff").select("name").eq("name", name).maybeSingle();
  if (staffErr) return { ok: false, error: staffErr.message };
  if (!staffRow) return { ok: false, error: "Worker not found" };

  const { data: currentRows } = await supabaseAdmin
    .from("wage_history")
    .select("daily_wage")
    .eq("staff_name", name)
    .lte("effective_from", effective)
    .order("effective_from", { ascending: false })
    .limit(1);
  const oldWage = currentRows && currentRows.length ? currentRows[0].daily_wage : null;

  const { error } = await supabaseAdmin
    .from("wage_history")
    .insert({ staff_name: name, daily_wage: Math.round(newDailyWage), effective_from: effective });
  if (error) return { ok: false, error: error.message };

  await supabaseAdmin.from("change_log").insert({
    entity: "staff_wage",
    entity_key: name,
    field: "daily_wage",
    old_value: oldWage === null ? null : String(oldWage),
    new_value: String(Math.round(newDailyWage)),
  });

  return { ok: true };
}

/** Soft-delete only — history stays intact and reachable via includeInactive. */
export async function deactivateStaff(name: string): Promise<ActionResult> {
  const { error } = await supabaseAdmin.from("staff").update({ active: false }).eq("name", name);
  if (error) return { ok: false, error: error.message };
  await supabaseAdmin.from("change_log").insert({
    entity: "staff", entity_key: name, field: "active", old_value: "true", new_value: "false",
  });
  return { ok: true };
}

export async function reactivateStaff(name: string): Promise<ActionResult> {
  const { error } = await supabaseAdmin.from("staff").update({ active: true }).eq("name", name);
  if (error) return { ok: false, error: error.message };
  await supabaseAdmin.from("change_log").insert({
    entity: "staff", entity_key: name, field: "active", old_value: "false", new_value: "true",
  });
  return { ok: true };
}
