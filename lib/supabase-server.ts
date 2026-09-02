import "server-only";
import { createClient } from "@supabase/supabase-js";

// This file must never be imported from a Client Component or anything that
// ends up in the browser bundle. The `server-only` import above makes the
// build fail loudly if that ever happens, instead of silently shipping the
// service-role key to the browser.

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set these as server-only " +
    "environment variables (NOT prefixed with NEXT_PUBLIC_) — the service-role key " +
    "must never be exposed to the browser."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

/**
 * Resolve "today" server-side, in the business's timezone. Never trust the
 * browser's clock for anything that gets written to the database.
 */
export function todayIST(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}
