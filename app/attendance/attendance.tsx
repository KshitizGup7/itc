"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const PIN = "1234";
const MONTHLY_SALARY = 15000;
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function AttendanceApp() {
  const now = new Date();
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [staff, setStaff] = useState<string[]>([]);
  const [salaries, setSalaries] = useState<Record<string, number>>({});
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<string>("attendance");
  const [newName, setNewName] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [payments, setPayments] = useState<Record<string, {id: number; date: string; amount: number | string}[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});       // which staff cards are open
  const [downloaded, setDownloaded] = useState<boolean>(false); // shows Clear button after download
  const [clearing, setClearing] = useState<boolean>(false);     // confirm state for clear

  // ─── Load staff ───
  const loadStaff = useCallback(async () => {
    const { data, error } = await supabase.from("staff").select("*").order("name");
    if (error) { console.error("Error loading staff:", error); return; }
    setStaff(data.map((s) => s.name));
    setSalaries(Object.fromEntries(data.map((s) => [s.name, s.monthly_salary])));
  }, []);

  // ─── Load attendance ───
  const loadAttendance = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance").select("staff_name, day, present")
      .eq("month", month).eq("year", year);
    if (error) { console.error("Error loading attendance:", error); setLoading(false); return; }
    const map: Record<string, boolean> = {};
    data.forEach(({ staff_name, day, present }) => { map[`${staff_name}_${day}`] = present; });
    setAttendance(map);
    setLoading(false);
  }, [month, year]);

  // ─── Load payments ───
  const loadPayments = useCallback(async () => {
    const { data, error } = await supabase
      .from("payments").select("id, staff_name, date, amount")
      .eq("month", month).eq("year", year).order("date", { ascending: true });
    if (error) { console.error("Error loading payments:", error); return; }
    const map: Record<string, { id: number; date: string; amount: number | string }[]> = {};
    data.forEach(({ id, staff_name, date, amount }) => {
      if (!map[staff_name]) map[staff_name] = [];
      map[staff_name].push({ id, date, amount });
    });
    setPayments(map);
  }, [month, year]);

  useEffect(() => {
    if (unlocked) { loadStaff(); loadAttendance(); loadPayments(); }
  }, [unlocked, loadStaff, loadAttendance, loadPayments]);

  // reset downloaded flag when month/year changes
  useEffect(() => { setDownloaded(false); setClearing(false); }, [month, year]);

  // ─── Payment actions ───
  async function addPayment(staffName) {
    const dateStr = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("payments")
      .insert({ staff_name: staffName, month, year, date: dateStr, amount: 0 })
      .select().single();
    if (error) { console.error("Add payment error:", error); return; }
    setPayments((prev) => ({
      ...prev,
      [staffName]: [...(prev[staffName] || []), { id: data.id, date: dateStr, amount: "" }],
    }));
    // auto-expand the card when a row is added
    setExpanded((prev) => ({ ...prev, [staffName]: true }));
  }

  async function updatePayment(staffName, id, field, value) {
    setPayments((prev) => ({
      ...prev,
      [staffName]: prev[staffName].map((p) => p.id === id ? { ...p, [field]: value } : p),
    }));
    const { error } = await supabase.from("payments").update({ [field]: value }).eq("id", id);
    if (error) console.error("Update payment error:", error);
  }

  async function deletePayment(staffName, id) {
    setPayments((prev) => ({
      ...prev,
      [staffName]: (prev[staffName] || []).filter((p) => p.id !== id),
    }));
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) { console.error("Delete payment error:", error); loadPayments(); }
  }

  // ─── Clear all payments for the month ───
  async function clearMonthPayments() {
    const { error } = await supabase
      .from("payments").delete().eq("month", month).eq("year", year);
    if (error) { console.error("Clear payments error:", error); return; }
    setPayments({});
    setDownloaded(false);
    setClearing(false);
    setExpanded({});
  }

  function getTotalPaid(staffName) {
    return (payments[staffName] || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }

  function toggleExpand(name) {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  // ─── Attendance actions ───
  async function toggleAttendance(name, day) {
    const key = `${name}_${day}`;
    const newVal = !attendance[key];
    setAttendance((prev) => ({ ...prev, [key]: newVal }));
    const { error } = await supabase.from("attendance")
      .upsert({ month, year, staff_name: name, day, present: newVal }, { onConflict: "month,year,staff_name,day" });
    if (error) { console.error("Toggle error:", error); setAttendance((prev) => ({ ...prev, [key]: !newVal })); }
  }

  async function markAllForDay(day, present) {
    setAttendance((prev) => {
      const updated = { ...prev };
      staff.forEach((name) => { updated[`${name}_${day}`] = present; });
      return updated;
    });
    const rows = staff.map((name) => ({ month, year, staff_name: name, day, present }));
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "month,year,staff_name,day" });
    if (error) { console.error("Bulk mark error:", error); loadAttendance(); }
  }

  // ─── Staff actions ───
  async function addStaff() {
    const trimmed = newName.trim();
    if (!trimmed || staff.includes(trimmed)) return;
    const { error } = await supabase.from("staff").insert({ name: trimmed, monthly_salary: MONTHLY_SALARY });
    if (error) { console.error("Add staff error:", error); return; }
    setNewName(""); loadStaff();
  }

  async function removeStaff(name) {
    const { error } = await supabase.from("staff").delete().eq("name", name);
    if (error) { console.error("Remove staff error:", error); return; }
    loadStaff();
  }

  // ─── Helpers ───
  function isPresent(name, day) { return !!attendance[`${name}_${day}`]; }
  function getDaysPresent(name) { return DAYS.filter((d) => isPresent(name, d)).length; }

  // ─── CSV Download ───
  function downloadCSV() {
    const label = `${MONTHS[month]}_${year}`;
    const daysInM = new Date(year, month + 1, 0).getDate();
    const allDays = Array.from({ length: daysInM }, (_, i) => i + 1);

    const attHeader = ["Staff Name", ...allDays.map((d) => `Day ${d}`), "Total Present", "Total Absent"];
    const attRows = staff.map((name) => {
      const cells = allDays.map((d) => (!!attendance[`${name}_${d}`] ? "P" : "A"));
      const present = cells.filter((c) => c === "P").length;
      return [name, ...cells, present, daysInM - present];
    });

    const payHeader = ["Staff Name", "Payment Date", "Amount (Rs)"];
    const payRows = [];
    staff.forEach((name) => {
      const entries = payments[name] || [];
      if (entries.length === 0) { payRows.push([name, "—", "0"]); }
      else { entries.forEach((p) => payRows.push([name, p.date, p.amount])); }
    });
    const grandTotal = staff.reduce((s, n) => s + getTotalPaid(n), 0);
    payRows.push(["", "", ""]);
    payRows.push(["TOTAL PAID OUT", "", grandTotal]);

    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const toCSV = (rows) => rows.map((r) => r.map(escape).join(",")).join("\n");
    const csv = [
      `ATTENDANCE — ${label}`, toCSV([attHeader, ...attRows]),
      "", "",
      `PAYMENTS — ${label}`, toCSV([payHeader, ...payRows]),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${label}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // unlock the Clear button
    setDownloaded(true);
    setClearing(false);
  }

  function handlePin() {
    if (pin === PIN) { setUnlocked(true); setPinError(false); }
    else {
      setPinError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin("");
    }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = now.getDate();

  // ─── PIN SCREEN ───
  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
          .pin-box { animation: fadeIn 0.4s ease; }
          .shake { animation: shake 0.4s ease; }
          .pin-input { transition: border-color 0.2s, box-shadow 0.2s; }
          .pin-input:focus { outline: none; border-color: #1a6bbf !important; box-shadow: 0 0 0 3px rgba(26,107,191,0.15); }
          .pin-btn { transition: all 0.2s; cursor: pointer; }
          .pin-btn:hover { background: #1a6bbf !important; color: #fff !important; }
        `}</style>
        <div className="pin-box" style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 56px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid #dde3eb" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🗓️</div>
          <div style={{ fontFamily: "Georgia, serif", color: "#1a2a3a", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Attendance System</div>
          <div style={{ color: "#7a8fa6", fontSize: 15, marginBottom: 36 }}>Enter your PIN to continue</div>
          <div className={shake ? "shake" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <input className="pin-input" type="password" placeholder="● ● ● ●" value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePin()} maxLength={6}
              style={{ background: "#f6f9fc", border: `2px solid ${pinError ? "#d93025" : "#cdd5de"}`, borderRadius: 10, padding: "14px 24px", color: "#1a2a3a", fontSize: 22, textAlign: "center", letterSpacing: 10, width: 220, fontFamily: "Georgia, serif" }}
            />
            {pinError && (
              <div style={{ color: "#d93025", fontSize: 14, fontWeight: 600, background: "#fce8e6", padding: "6px 16px", borderRadius: 6 }}>
                ✗ Wrong PIN — try again
              </div>
            )}
            <button className="pin-btn" onClick={handlePin}
              style={{ background: "#fff", border: "2px solid #1a6bbf", color: "#1a6bbf", borderRadius: 10, padding: "13px 44px", fontSize: 16, fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontFamily: "Georgia, serif", marginTop: 4 }}>
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN APP ───
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", color: "#1a2a3a", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #e8edf2; }
        ::-webkit-scrollbar-thumb { background: #b0bcc8; border-radius: 4px; }
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .day-cell { transition: all 0.15s; cursor: pointer; }
        .day-cell:hover { transform: scale(1.12); }
        .mark-btn:hover { opacity: 0.6; }
        .add-btn:hover { background: #1a6bbf !important; color: #fff !important; }
        .remove-btn:hover { color: #d93025 !important; background: #fce8e6 !important; }
        .addpay-btn:hover { background: #145299 !important; }
        .delpay-btn:hover { background: #fce8e6 !important; border-color: #d93025 !important; }
        .expand-btn:hover { background: #edf1f5 !important; }
        .dlbtn:hover { background: #1b5e20 !important; }
        .clearbtn:hover { background: #b71c1c !important; }
        input:focus { outline: none; box-shadow: 0 0 0 2px rgba(26,107,191,0.2); }
        select:focus { outline: none; }
        .row-even { background: #ffffff; }
        .row-odd  { background: #f6f9fc; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .slide-down { animation: slideDown 0.2s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a2a3a", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", color: "#ffffff", fontSize: 24, fontWeight: 700 }}>📋 Attendance Manager</div>
          <div style={{ color: "#8ca0b8", fontSize: 14, marginTop: 2 }}>Track staff attendance &amp; payments</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {loading && <span style={{ color: "#8ca0b8", fontSize: 13, background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: 6 }}>⟳ Syncing…</span>}
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
            style={{ background: "#2a3d52", border: "1px solid #3d5266", color: "#e8f0f8", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            style={{ background: "#2a3d52", border: "1px solid #3d5266", color: "#e8f0f8", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="dlbtn" onClick={downloadCSV}
            style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 700, transition: "background 0.2s" }}>
            ⬇ Download CSV
          </button>
          <button onClick={() => setUnlocked(false)}
            style={{ background: "transparent", border: "1px solid #3d5266", color: "#8ca0b8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            🔒 Lock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#ffffff", borderBottom: "2px solid #dde3eb", padding: "0 24px" }}>
        {[["attendance", "📋  Attendance"], ["salary", "💰  Payments"], ["staff", "👥  Staff"]].map(([key, label]) => (
          <button key={key} className="tab-btn" onClick={() => setTab(key)}
            style={{ padding: "16px 24px", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: 700, background: "transparent", color: tab === key ? "#1a6bbf" : "#7a8fa6", borderBottom: tab === key ? "3px solid #1a6bbf" : "3px solid transparent", marginBottom: -2 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 24px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── ATTENDANCE TAB ── */}
        {tab === "attendance" && (
          <div>
            <div style={{ marginBottom: 16, background: "#fff", borderRadius: 10, padding: "14px 20px", border: "1px solid #dde3eb", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#4a6278", fontWeight: 700 }}>{MONTHS[month]} {year}</span>
              <span style={{ fontSize: 14, color: "#7a8fa6" }}>👤 {staff.length} staff members</span>
              <span style={{ fontSize: 14, color: "#7a8fa6" }}>📅 Today: {today}</span>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #dde3eb", overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #dde3eb" }}>
                    <th style={{ textAlign: "left", padding: "14px 18px", color: "#4a6278", fontSize: 14, fontWeight: 700, position: "sticky", left: 0, background: "#f6f9fc", minWidth: 180, borderRight: "1px solid #dde3eb" }}>Staff Name</th>
                    {DAYS.map((d) => (
                      <th key={d} style={{ padding: "6px 2px", minWidth: 30, textAlign: "center", background: d === today ? "#e8f0fb" : "#f6f9fc" }}>
                        <div style={{ color: d === today ? "#1a6bbf" : "#7a8fa6", fontSize: 11, fontWeight: d === today ? 700 : 400, marginBottom: 3 }}>{d}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                          <div className="mark-btn" title="Mark all Present" onClick={() => markAllForDay(d, true)} style={{ cursor: "pointer", fontSize: 9, color: "#2e7d32", lineHeight: 1, padding: "1px" }}>▲</div>
                          <div className="mark-btn" title="Mark all Absent" onClick={() => markAllForDay(d, false)} style={{ cursor: "pointer", fontSize: 9, color: "#c62828", lineHeight: 1, padding: "1px" }}>▼</div>
                        </div>
                      </th>
                    ))}
                    <th style={{ padding: "14px 12px", color: "#4a6278", fontSize: 13, fontWeight: 700, minWidth: 70, textAlign: "center", background: "#f6f9fc" }}>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((name, idx) => (
                    <tr key={name} className={idx % 2 === 0 ? "row-even" : "row-odd"} style={{ borderTop: "1px solid #edf1f5" }}>
                      <td style={{ padding: "10px 18px", fontSize: 15, color: "#1a2a3a", fontWeight: 600, position: "sticky", left: 0, background: idx % 2 === 0 ? "#ffffff" : "#f6f9fc", whiteSpace: "nowrap", borderRight: "1px solid #dde3eb" }}>{name}</td>
                      {DAYS.map((d) => {
                        const present = isPresent(name, d);
                        return (
                          <td key={d} style={{ textAlign: "center", padding: "6px 2px", background: d === today ? (idx % 2 === 0 ? "#f0f6ff" : "#eaf1fb") : "inherit" }}>
                            <div className="day-cell" onClick={() => toggleAttendance(name, d)}
                              title={present ? "Present — click to mark Absent" : "Absent — click to mark Present"}
                              style={{ width: 24, height: 24, margin: "0 auto", borderRadius: 6, background: present ? "#e6f4ea" : "#fce8e6", border: `1.5px solid ${present ? "#4caf50" : "#f5b8b3"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                              {present ? <span style={{ color: "#2e7d32", fontWeight: 700 }}>✓</span> : <span style={{ color: "#c62828", fontWeight: 700 }}>✗</span>}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ textAlign: "center", padding: "8px 12px" }}>
                        <span style={{ color: "#1a6bbf", fontSize: 15, fontWeight: 700, background: "#e8f0fb", padding: "3px 10px", borderRadius: 6 }}>{getDaysPresent(name)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, color: "#9aabbb", fontSize: 13 }}>▲ / ▼ marks all staff present or absent for that day &nbsp;·&nbsp; Click any cell to toggle</div>
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {tab === "salary" && (
          <div>
            {/* Grand total banner */}
            <div style={{ marginBottom: 24, background: "#1a2a3a", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ color: "#8ca0b8", fontSize: 14 }}>Total paid out — {MONTHS[month]} {year}</div>
                <div style={{ color: "#ffffff", fontSize: 36, fontWeight: 700, fontFamily: "Georgia, serif", marginTop: 4 }}>
                  ₹{staff.reduce((sum, n) => sum + getTotalPaid(n), 0).toLocaleString()}
                </div>
              </div>
              {/* Clear month button — only visible after download */}
              {downloaded && (
                <div className="slide-down">
                  {!clearing ? (
                    <button className="clearbtn" onClick={() => setClearing(true)}
                      style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", transition: "background 0.2s" }}>
                      🗑 Clear {MONTHS[month]} Payments
                    </button>
                  ) : (
                    <div style={{ background: "#7f0000", borderRadius: 10, padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ color: "#ffcdd2", fontSize: 14, marginBottom: 10 }}>
                        Are you sure? This deletes all payment records for {MONTHS[month]} {year}.
                      </div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={clearMonthPayments}
                          style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 7, padding: "8px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                          Yes, clear it
                        </button>
                        <button onClick={() => setClearing(false)}
                          style={{ background: "transparent", border: "1px solid #8ca0b8", color: "#ccc", borderRadius: 7, padding: "8px 20px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Staff cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {staff.map((name) => {
                const entries = payments[name] || [];
                const total = getTotalPaid(name);
                const isOpen = !!expanded[name];

                return (
                  <div key={name} style={{ background: "#fff", borderRadius: 12, border: "1px solid #dde3eb", overflow: "hidden" }}>

                    {/* ── Collapsed header row — always visible ── */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", flexWrap: "wrap", gap: 12 }}>

                      {/* Left: avatar + name + payment pills */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a6bbf", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a2a3a" }}>{name}</div>
                          {/* Payment amount pills shown below name */}
                          {entries.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                              {entries.map((p) => (
                                <span key={p.id} style={{ background: "#e8f0fb", color: "#1a6bbf", borderRadius: 20, padding: "3px 10px", fontSize: 13, fontWeight: 600 }}>
                                  ₹{Number(p.amount).toLocaleString()} <span style={{ color: "#9aabbb", fontWeight: 400, fontSize: 11 }}>{p.date}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: 13, color: "#b0bcc8", marginTop: 4, fontStyle: "italic" }}>No payments this month</div>
                          )}
                        </div>
                      </div>

                      {/* Right: total + buttons */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#9aabbb", marginBottom: 2 }}>Total paid</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: total > 0 ? "#2e7d32" : "#b0bcc8", fontFamily: "Georgia, serif" }}>
                            ₹{total.toLocaleString()}
                          </div>
                        </div>
                        <button className="addpay-btn" onClick={() => addPayment(name)}
                          style={{ background: "#1a6bbf", border: "none", color: "#fff", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", transition: "background 0.2s", whiteSpace: "nowrap" }}>
                          + Add
                        </button>
                        {entries.length > 0 && (
                          <button className="expand-btn" onClick={() => toggleExpand(name)}
                            title={isOpen ? "Collapse" : "Expand to edit"}
                            style={{ background: "#f6f9fc", border: "1px solid #dde3eb", color: "#4a6278", borderRadius: 8, width: 38, height: 38, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transitionProperty: "background, transform" }}>
                            ▾
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Expanded edit rows ── */}
                    {isOpen && entries.length > 0 && (
                      <div className="slide-down" style={{ borderTop: "1px solid #edf1f5" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 48px", padding: "10px 22px", background: "#fafbfc", borderBottom: "1px solid #edf1f5", gap: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Date</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Amount Paid (₹)</div>
                          <div></div>
                        </div>
                        {entries.map((p, i) => (
                          <div key={p.id}
                            style={{ display: "grid", gridTemplateColumns: "200px 1fr 48px", padding: "12px 22px", gap: 12, borderBottom: i < entries.length - 1 ? "1px solid #edf1f5" : "none", alignItems: "center", background: i % 2 === 0 ? "#ffffff" : "#fafcff" }}>
                            <input type="date" value={p.date}
                              onChange={(e) => updatePayment(name, p.id, "date", e.target.value)}
                              style={{ border: "1.5px solid #cdd5de", borderRadius: 7, padding: "8px 12px", fontSize: 15, color: "#1a2a3a", fontFamily: "Georgia, serif", background: "#fff", cursor: "pointer", width: "100%" }}
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#4a6278", fontSize: 18, fontWeight: 700 }}>₹</span>
                              <input type="number" value={p.amount} placeholder="Enter amount"
                                onChange={(e) => updatePayment(name, p.id, "amount", e.target.value === "" ? "" : Number(e.target.value))}
                                onBlur={(e) => { if (e.target.value === "") updatePayment(name, p.id, "amount", 0); }}
                                style={{ border: "1.5px solid #cdd5de", borderRadius: 7, padding: "8px 12px", fontSize: 16, color: "#1a2a3a", fontFamily: "Georgia, serif", fontWeight: 600, background: "#fff", width: "100%", maxWidth: 220 }}
                              />
                            </div>
                            <button className="delpay-btn" onClick={() => deletePayment(name, p.id)}
                              title="Remove this entry"
                              style={{ background: "transparent", border: "1.5px solid #f5b8b3", color: "#c62828", borderRadius: 7, width: 36, height: 36, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {downloaded && (
              <div style={{ marginTop: 16, color: "#9aabbb", fontSize: 13 }}>
                ✓ CSV downloaded — Clear {MONTHS[month]} Payments button is now active above.
              </div>
            )}
          </div>
        )}

        {/* ── STAFF TAB ── */}
        {tab === "staff" && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ marginBottom: 20, color: "#4a6278", fontSize: 15, fontWeight: 700 }}>Manage Staff — {staff.length} members</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
              <input placeholder="Enter full name..." value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStaff()}
                style={{ flex: 1, background: "#fff", border: "2px solid #cdd5de", color: "#1a2a3a", borderRadius: 8, padding: "12px 16px", fontSize: 15, fontFamily: "Georgia, serif" }}
              />
              <button className="add-btn" onClick={addStaff}
                style={{ background: "#fff", border: "2px solid #1a6bbf", color: "#1a6bbf", borderRadius: 8, padding: "12px 22px", fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 700, transition: "all 0.2s" }}>
                + Add
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {staff.map((name) => (
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", borderRadius: 10, border: "1px solid #dde3eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a6bbf", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, color: "#1a2a3a", fontWeight: 700 }}>{name}</div>
                      <div style={{ fontSize: 14, color: "#7a8fa6", marginTop: 3 }}>₹{(salaries[name] || MONTHLY_SALARY).toLocaleString()} base salary</div>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeStaff(name)}
                    style={{ background: "transparent", border: "1px solid #dde3eb", color: "#9aabbb", cursor: "pointer", fontSize: 18, borderRadius: 6, width: 36, height: 36, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}