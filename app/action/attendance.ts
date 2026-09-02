"use server";
import { supabaseAdmin, todayIST } from "@/lib/supabase-server";
import type { DayStatus } from "@/lib/payroll-math";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function getAttendanceForMonth(month: number, year: number): Promise<Record<string, DayStatus>> {
  const { data, error } = await supabaseAdmin
    .from("attendance")
    .select("staff_name, day, status")
    .eq("month", month)
    .eq("year", year);
  if (error) throw new Error(`Failed to load attendance: ${error.message}`);
  const map: Record<string, DayStatus> = {};
  (data || []).forEach((r) => {
    const s: DayStatus = r.status === "present" || r.status === "half" ? r.status : "absent";
    map[`${r.staff_name}_${r.day}`] = s;
  });
  return map;
}

/**
 * Sets one worker's attendance for one day. Rejects future dates here as a
 * fast, friendly first check — the database trigger (enforce_attendance_rules
 * in migration-v2.sql) independently re-checks the same rule plus the
 * joining-date rule, so this is never the only line of defense.
 */
export async function setAttendanceStatus(
  staffName: string,
  day: number,
  month: number,
  year: number,
  status: DayStatus
): Promise<ActionResult> {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const today = todayIST();
  if (dateStr > today) return { ok: false, error: "Can't mark attendance for a future date" };

  const { data: prior } = await supabaseAdmin
    .from("attendance")
    .select("status")
    .eq("staff_name", staffName)
    .eq("day", day)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from("attendance")
    .upsert(
      { staff_name: staffName, day, month, year, status, present: status !== "absent" },
      { onConflict: "month,year,staff_name,day" }
    );
  if (error) {
    // Surface the trigger's own message directly if it fired (future date /
    // before joining date) — it's already written to be readable.
    return { ok: false, error: error.message };
  }

  if (prior?.status !== status) {
    await supabaseAdmin.from("change_log").insert({
      entity: "attendance",
      entity_key: `${staffName}_${dateStr}`,
      field: "status",
      old_value: prior?.status ?? null,
      new_value: status,
    });
  }
  return { ok: true };
}

export async function markAllForDay(
  day: number,
  month: number,
  year: number,
  status: "present" | "absent",
  staffNames: string[]
): Promise<ActionResult> {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const today = todayIST();
  if (dateStr > today) return { ok: false, error: "Can't mark attendance for a future date" };

  const rows = staffNames.map((name) => ({ staff_name: name, day, month, year, status, present: status !== "absent" }));
  const { error } = await supabaseAdmin.from("attendance").upsert(rows, { onConflict: "month,year,staff_name,day" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function resetDayAttendance(day: number, month: number, year: number): Promise<ActionResult> {
  const { error } = await supabaseAdmin.from("attendance").delete().eq("day", day).eq("month", month).eq("year", year);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
