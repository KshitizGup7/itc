"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import * as XLSX from "xlsx";

import type { DayStatus } from "@/lib/payroll-math";
import { listStaff, addStaffMember, updateStaffWage, deactivateStaff, reactivateStaff, type StaffSummary } from "@/app/action/staff";
import { getAttendanceForMonth, setAttendanceStatus, markAllForDay as markAllForDayAction, resetDayAttendance } from "@/app/action/attendance";
import { getAdvancesForMonth, addAdvance as addAdvanceAction, updateAdvance, deleteAdvance as deleteAdvanceAction, clearMonthAdvances as clearMonthAdvancesAction, type AdvanceEntry } from "@/app/action/payments";
import { getPayrollRows, clearPayment as clearPaymentAction, initializePayrollBaseline, type PayrollRow } from "@/app/action/payroll";

const PIN = "1234";
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface DraftEntry {
  date: string;
  amount: number | string;
  notes: string;
  type: "advance" | "salary";
}

interface ToastState {
  kind: "success" | "error";
  message: string;
}

type StaffSort = "name" | "advances" | "attendance";

function nextStatus(status: DayStatus | undefined): DayStatus {
  if (status === "present") return "half";
  if (status === "half") return "absent";
  return "present";
}
function dayValueLocal(status: DayStatus | undefined): number {
  if (status === "present") return 1;
  if (status === "half") return 0.5;
  return 0;
}
function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const inputStyle: CSSProperties = {
  border: "1.5px solid #cdd5de", borderRadius: 7, padding: "8px 10px", fontSize: 14,
  color: "#1a2a3a", fontFamily: "Georgia, serif", background: "#fff", width: "100%",
};

export default function AttendanceApp() {
  const now = new Date();
  const [pin, setPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(now.getFullYear());

  const [staffList, setStaffList] = useState<StaffSummary[]>([]);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [staffLoading, setStaffLoading] = useState<boolean>(false);

  const [attendance, setAttendance] = useState<Record<string, DayStatus>>({});
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);

  const [advances, setAdvances] = useState<Record<string, AdvanceEntry[]>>({});
  const [advancesLoading, setAdvancesLoading] = useState<boolean>(false);

  const [tab, setTab] = useState<string>("attendance");
  const [newName, setNewName] = useState<string>("");
  const [newWage, setNewWage] = useState<string>("");
  const [newJoiningDate, setNewJoiningDate] = useState<string>("");
  const [addingStaff, setAddingStaff] = useState<boolean>(false);
  const [removingStaffName, setRemovingStaffName] = useState<string | null>(null);
  const [reactivatingStaffName, setReactivatingStaffName] = useState<string | null>(null);

  const [editingWageName, setEditingWageName] = useState<string | null>(null);
  const [wageDraft, setWageDraft] = useState<string>("");
  const [savingWage, setSavingWage] = useState<boolean>(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  const [drafts, setDrafts] = useState<Record<number, DraftEntry>>({});
  const [savingEntryId, setSavingEntryId] = useState<number | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);
  const [addingAdvanceStaff, setAddingAdvanceStaff] = useState<string | null>(null);

  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);

  const [staffSearch, setStaffSearch] = useState<string>("");
  const [staffSort, setStaffSort] = useState<StaffSort>("name");
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const [payrollRows, setPayrollRows] = useState<PayrollRow[]>([]);
  const [payrollLoading, setPayrollLoading] = useState<boolean>(false);
  const [payClearAmounts, setPayClearAmounts] = useState<Record<string, string>>({});
  const [clearingStaff, setClearingStaff] = useState<string | null>(null);
  const [initializingBaseline, setInitializingBaseline] = useState<boolean>(false);

  const staff = useMemo(() => staffList.map((s) => s.name), [staffList]);
  const wages = useMemo(() => Object.fromEntries(staffList.map((s) => [s.name, s.dailyWage])), [staffList]);

  function showToast(kind: "success" | "error", message: string) {
    setToast({ kind, message });
    if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(null), 3500);
  }

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const rows = await listStaff(showInactive);
      setStaffList(rows);
    } catch (e) {
      console.error("Load staff error:", e);
      showToast("error", "Failed to load staff");
    } finally {
      setStaffLoading(false);
    }
  }, [showInactive]);

  const loadAttendance = useCallback(async () => {
    setAttendanceLoading(true);
    try {
      setAttendance(await getAttendanceForMonth(month, year));
    } catch (e) {
      console.error("Load attendance error:", e);
      showToast("error", "Failed to load attendance");
    } finally {
      setAttendanceLoading(false);
    }
  }, [month, year]);

  const loadAdvances = useCallback(async () => {
    setAdvancesLoading(true);
    try {
      setAdvances(await getAdvancesForMonth(month, year));
    } catch (e) {
      console.error("Load advances error:", e);
      showToast("error", "Failed to load advances");
    } finally {
      setAdvancesLoading(false);
    }
  }, [month, year]);

  const loadPayroll = useCallback(async () => {
    setPayrollLoading(true);
    try {
      setPayrollRows(await getPayrollRows());
    } catch (e) {
      console.error("Load payroll error:", e);
      showToast("error", "Failed to calculate payroll");
    } finally {
      setPayrollLoading(false);
    }
  }, []);

  useEffect(() => { if (unlocked) { loadStaff(); loadAttendance(); loadAdvances(); loadPayroll(); } }, [unlocked, loadStaff, loadAttendance, loadAdvances, loadPayroll]);
  useEffect(() => { setDownloaded(false); setClearing(false); }, [month, year]);

  function getLiveBalance(name: string): number {
    const row = payrollRows.find((r) => r.name === name);
    return row ? row.balanceDue : 0;
  }

  // ─── Advances ───
  async function addAdvance(staffName: string) {
    setAddingAdvanceStaff(staffName);
    const res = await addAdvanceAction(staffName, month, year);
    setAddingAdvanceStaff(null);
    if (!res.ok) { showToast("error", "Failed to add advance"); return; }
    setAdvances((prev) => ({ ...prev, [staffName]: [...(prev[staffName] || []), res.entry] }));
    setExpanded((prev) => ({ ...prev, [staffName]: true }));
    startEditAdvance(res.entry);
    showToast("success", "Advance added");
    loadPayroll();
  }

  function startEditAdvance(entry: AdvanceEntry) {
    setDrafts((prev) => ({ ...prev, [entry.id]: { date: entry.date, amount: entry.amount, notes: entry.notes, type: entry.type } }));
    setEditingRows((prev) => ({ ...prev, [entry.id]: true }));
  }
  function cancelEditAdvance(id: number) {
    setEditingRows((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }
  function updateDraft(id: number, field: keyof DraftEntry, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } as DraftEntry }));
  }

  async function saveAdvance(staffName: string, id: number) {
    const draft = drafts[id];
    if (!draft) return;
    const amountNum = draft.amount === "" ? 0 : Number(draft.amount);
    setSavingEntryId(id);
    const res = await updateAdvance(id, draft.date, amountNum, draft.notes, draft.type);
    setSavingEntryId(null);
    if (!res.ok) { showToast("error", res.error); return; }
    setAdvances((prev) => ({
      ...prev,
      [staffName]: (prev[staffName] || []).map((p) => (p.id === id ? { ...p, date: draft.date, amount: amountNum, notes: draft.notes, type: draft.type } : p)),
    }));
    cancelEditAdvance(id);
    showToast("success", "Advance updated");
    loadPayroll();
  }

  async function deleteAdvance(staffName: string, id: number) {
    if (!confirm("Delete this advance?")) return;
    setDeletingEntryId(id);
    const res = await deleteAdvanceAction(id);
    setDeletingEntryId(null);
    if (!res.ok) { showToast("error", "Failed to delete advance"); return; }
    setAdvances((prev) => ({ ...prev, [staffName]: (prev[staffName] || []).filter((p) => p.id !== id) }));
    showToast("success", "Advance deleted");
    loadPayroll();
  }

  async function clearMonthAdvances() {
    const res = await clearMonthAdvancesAction(month, year);
    if (!res.ok) { showToast("error", "Failed to clear advances"); return; }
    setAdvances({}); setDownloaded(false); setClearing(false); setExpanded({});
    showToast("success", "Advances cleared");
    loadPayroll();
  }

  function getTotalAdvance(name: string): number {
    return (advances[name] || []).filter((p) => p.type === "advance").reduce((s, p) => s + p.amount, 0);
  }
  function getTotalSalaryPaid(name: string): number {
    return (advances[name] || []).filter((p) => p.type === "salary").reduce((s, p) => s + p.amount, 0);
  }
  function toggleExpand(name: string) { setExpanded((prev) => ({ ...prev, [name]: !prev[name] })); }

  // ─── Attendance ───
  const today = now.getDate();
  const isViewingCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  function isFutureDay(d: number): boolean {
    if (year > now.getFullYear()) return true;
    if (year < now.getFullYear()) return false;
    if (month > now.getMonth()) return true;
    if (month < now.getMonth()) return false;
    return d > today;
  }

  async function cycleAttendance(name: string, day: number) {
    if (isFutureDay(day)) return;
    const key = `${name}_${day}`;
    const current = attendance[key];
    const next = nextStatus(current);
    setAttendance((prev) => ({ ...prev, [key]: next }));
    const res = await setAttendanceStatus(name, day, month, year, next);
    if (!res.ok) { showToast("error", res.error); setAttendance((prev) => ({ ...prev, [key]: current || "absent" })); return; }
    loadPayroll();
  }

  async function markAllForDay(day: number, status: "present" | "absent") {
    if (isFutureDay(day)) return;
    setAttendance((prev) => {
      const updated = { ...prev };
      staff.forEach((name) => { updated[`${name}_${day}`] = status; });
      return updated;
    });
    const res = await markAllForDayAction(day, month, year, status, staff);
    if (!res.ok) { showToast("error", res.error); loadAttendance(); return; }
    loadPayroll();
  }

  async function resetTodayAttendance() {
    if (!confirm(`Reset attendance for all staff on ${MONTHS[month]} ${today}?`)) return;
    const res = await resetDayAttendance(today, month, year);
    if (!res.ok) { showToast("error", "Failed to reset today's attendance"); return; }
    setAttendance((prev) => { const u = { ...prev }; staff.forEach((n) => delete u[`${n}_${today}`]); return u; });
    showToast("success", "Today's attendance reset");
    loadPayroll();
  }

  // ─── Staff ───
  async function addStaff() {
    const trimmed = newName.trim();
    const wageNum = Number(newWage);
    if (!trimmed) return;
    const res = await addStaffMember(trimmed, wageNum, newJoiningDate || undefined);
    if (!res.ok) { showToast("error", res.error); return; }
    setAddingStaff(true);
    setAddingStaff(false);
    setNewName(""); setNewWage(""); setNewJoiningDate("");
    showToast("success", `${trimmed} added`);
    loadStaff();
  }

  async function removeStaff(name: string) {
    if (!confirm(`Remove ${name} from active staff? Their history stays on record.`)) return;
    setRemovingStaffName(name);
    const res = await deactivateStaff(name);
    setRemovingStaffName(null);
    if (!res.ok) { showToast("error", "Failed to remove staff"); return; }
    showToast("success", `${name} removed`);
    loadStaff();
  }

  async function undoRemoveStaff(name: string) {
    setReactivatingStaffName(name);
    const res = await reactivateStaff(name);
    setReactivatingStaffName(null);
    if (!res.ok) { showToast("error", "Failed to reactivate"); return; }
    showToast("success", `${name} reactivated`);
    loadStaff();
  }

  function startEditWage(name: string) { setEditingWageName(name); setWageDraft(String(wages[name] ?? "")); }
  function cancelEditWage() { setEditingWageName(null); setWageDraft(""); }
  async function saveWage(name: string) {
    const num = Number(wageDraft);
    setSavingWage(true);
    const res = await updateStaffWage(name, num);
    setSavingWage(false);
    if (!res.ok) { showToast("error", res.error); return; }
    cancelEditWage();
    showToast("success", `${name}'s daily wage updated`);
    loadStaff(); loadPayroll();
  }

  // ─── Payroll ───
  async function clearPayment(name: string, due: number) {
    if (due <= 0) return;
    const raw = payClearAmounts[name];
    const actualPaid = Math.round(Number(raw === undefined || raw === "" ? due : raw));
    if (Number.isNaN(actualPaid) || actualPaid < 0) { showToast("error", "Enter a valid amount"); return; }

    let msg: string;
    if (actualPaid === due) msg = `Pay ₹${actualPaid.toLocaleString()} to ${name} — this settles the ₹${due.toLocaleString()} due.`;
    else if (actualPaid > due) msg = `Pay ₹${actualPaid.toLocaleString()} to ${name} — this settles the ₹${due.toLocaleString()} due and carries ₹${(actualPaid - due).toLocaleString()} forward as their next advance.`;
    else msg = `Pay ₹${actualPaid.toLocaleString()} to ${name} — ₹${(due - actualPaid).toLocaleString()} of the ₹${due.toLocaleString()} due will still remain owed.`;
    if (!confirm(msg)) return;

    setClearingStaff(name);
    const res = await clearPaymentAction(name, actualPaid);
    setClearingStaff(null);
    if (!res.ok) { showToast("error", res.error); loadPayroll(); return; }
    setPayClearAmounts((prev) => { const n = { ...prev }; delete n[name]; return n; });
    showToast("success", res.message);
    loadPayroll(); loadAdvances();
  }

  async function initBaseline() {
    if (!confirm("This starts everyone's running balance from today, without recording any payment. Continue?")) return;
    setInitializingBaseline(true);
    const res = await initializePayrollBaseline();
    setInitializingBaseline(false);
    if (!res.ok) { showToast("error", "Failed to set starting point"); return; }
    showToast("success", "Payroll tracking now starts from today");
    loadPayroll();
  }

  // ─── Helpers ───
  function getDaysPresent(name: string): number { return DAYS.reduce((s, d) => s + dayValueLocal(attendance[`${name}_${d}`]), 0); }

  const filteredSortedStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    let list = q ? staff.filter((n) => n.toLowerCase().includes(q)) : [...staff];
    if (staffSort === "advances") list = list.sort((a, b) => getTotalAdvance(b) - getTotalAdvance(a));
    else if (staffSort === "attendance") list = list.sort((a, b) => getDaysPresent(a) - getDaysPresent(b));
    else list = list.sort((a, b) => a.localeCompare(b));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff, staffSearch, staffSort, advances, attendance]);

  const todaysSummary = useMemo(() => {
    if (!isViewingCurrentMonth || staff.length === 0) return null;
    let present = 0, half = 0;
    staff.forEach((name) => {
      const s = attendance[`${name}_${today}`];
      if (s === "present") present++; else if (s === "half") half++;
    });
    return { present, half, absent: staff.length - present - half, total: staff.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff, attendance, isViewingCurrentMonth, today]);

  const needsBaseline = staffList.length > 0 && staffList.some((s) => !s.lastSettledDate);

  // ─── Exports ───
  function buildExportData() {
    const daysInM = new Date(year, month + 1, 0).getDate();
    const allDays = Array.from({ length: daysInM }, (_, i) => i + 1);

    const attHeader = ["Staff Name", ...allDays.map((d) => `Day ${d}`), "Total Days (P=1,H=0.5)", "Total Absent"];
    const attRows = staff.map((name) => {
      const cells = allDays.map((d) => {
        const s = attendance[`${name}_${d}`];
        return s === "present" ? "P" : s === "half" ? "H" : "A";
      });
      const totalDays = allDays.reduce((sum, d) => sum + dayValueLocal(attendance[`${name}_${d}`]), 0);
      return [name, ...cells, totalDays, cells.filter((c) => c === "A").length];
    });

    const advHeader = ["Staff Name", "Date", "Type", "Amount (Rs)", "Notes"];
    const advRows: (string | number)[][] = [];
    staff.forEach((name) => {
      const entries = advances[name] || [];
      if (entries.length === 0) advRows.push([name, "—", "—", "0", ""]);
      else entries.forEach((p) => advRows.push([name, p.date, p.type === "salary" ? "Salary" : "Advance", p.amount, p.notes || ""]));
    });

    const payrollHeader = ["Staff Name", "Days Present (unpaid)", "Advance Outstanding", "Salary Due (negative = worker owes)"];
    const payrollRowsData = payrollRows.map((r) => [r.name, r.daysPresent, r.advancesSince, r.balanceDue]);

    return { attHeader, attRows, advHeader, advRows, payrollHeader, payrollRowsData, daysInM };
  }

  function downloadCSV() {
    const { attHeader, attRows, advHeader, advRows, payrollHeader, payrollRowsData } = buildExportData();
    const label = `${MONTHS[month]}_${year}`;
    const totalAdvances = staff.reduce((s, n) => s + getTotalAdvance(n), 0);
    const totalSalaryPaid = staff.reduce((s, n) => s + getTotalSalaryPaid(n), 0);
    const advRowsWithTotals = [...advRows, ["", "", "", "", ""], ["TOTAL ADVANCES", "", "", totalAdvances, ""], ["TOTAL SALARY PAID", "", "", totalSalaryPaid, ""]];

    const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const toCSV = (rows: (string | number)[][]) => rows.map((r) => r.map(escape).join(",")).join("\n");
    const csv = [
      `ATTENDANCE — ${label}`, toCSV([attHeader, ...attRows]), "", "",
      `ADVANCES — ${label}`, toCSV([advHeader, ...advRowsWithTotals]), "", "",
      `PAYROLL BALANCE`, toCSV([payrollHeader, ...payrollRowsData]),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Attendance_${label}.csv`; a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true); setClearing(false);
  }

  function downloadExcel() {
    const { attHeader, attRows, advHeader, advRows, payrollHeader, payrollRowsData } = buildExportData();
    const label = `${MONTHS[month]}_${year}`;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([attHeader, ...attRows]), "Attendance");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([advHeader, ...advRows]), "Advances");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([payrollHeader, ...payrollRowsData]), "Payroll Balance");
    XLSX.writeFile(wb, `Attendance_${label}.xlsx`);
    setDownloaded(true); setClearing(false);
  }

  function handlePin() {
    if (pin === PIN) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setShake(true); setTimeout(() => setShake(false), 500); setPin(""); }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const YEARS = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);

  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
          .pin-box { animation: fadeIn 0.4s ease; }
          .shake { animation: shake 0.4s ease; }
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
              style={{ background: "#f6f9fc", border: `2px solid ${pinError ? "#d93025" : "#cdd5de"}`, borderRadius: 10, padding: "14px 24px", color: "#1a2a3a", fontSize: 22, textAlign: "center", letterSpacing: 10, width: 220, fontFamily: "Georgia, serif" }} />
            {pinError && <div style={{ color: "#d93025", fontSize: 14, fontWeight: 600, background: "#fce8e6", padding: "6px 16px", borderRadius: 6 }}>✗ Wrong PIN — try again</div>}
            <button className="pin-btn" onClick={handlePin} style={{ background: "#fff", border: "2px solid #1a6bbf", color: "#1a6bbf", borderRadius: 10, padding: "13px 44px", fontSize: 16, fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontFamily: "Georgia, serif", marginTop: 4 }}>Unlock</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", color: "#1a2a3a", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .day-cell { transition: all 0.15s; cursor: pointer; }
        .day-cell:hover { transform: scale(1.12); }
        .day-cell.disabled { cursor: not-allowed; opacity: 0.35; }
        .day-cell.disabled:hover { transform: none; }
        .mark-btn:hover { opacity: 0.6; }
        .add-btn:hover { background: #1a6bbf !important; color: #fff !important; }
        .remove-btn:hover { color: #d93025 !important; background: #fce8e6 !important; }
        .addpay-btn:hover { background: #145299 !important; }
        .delpay-btn:hover { background: #fce8e6 !important; border-color: #d93025 !important; }
        .editpay-btn:hover, .expand-btn:hover, .cancelpay-btn:hover, .detail-close:hover { background: #edf1f5 !important; }
        .savepay-btn:hover { background: #1b5e20 !important; }
        .dlbtn:hover { background: #1b5e20 !important; }
        .clearbtn:hover { background: #b71c1c !important; }
        .clearpay-btn:not(:disabled):hover { background: #1b5e20 !important; }
        .reset-btn:hover { background: #fce8e6 !important; }
        .baseline-btn:hover { background: #145299 !important; }
        input:focus, select:focus { outline: none; box-shadow: 0 0 0 2px rgba(26,107,191,0.2); }
        .row-even { background: #ffffff; } .row-odd { background: #f6f9fc; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        .slide-down { animation: slideDown 0.2s ease; } .toast-pop { animation: slideIn 0.25s ease; }
        @media (max-width: 640px) { .header-title { font-size: 19px !important; } .header-sub { display: none; } }
      `}</style>

      {toast && (
        <div className="toast-pop" style={{ position: "fixed", top: 18, right: 18, zIndex: 100, background: toast.kind === "success" ? "#e6f4ea" : "#fce8e6", border: `1.5px solid ${toast.kind === "success" ? "#4caf50" : "#f5b8b3"}`, color: toast.kind === "success" ? "#1b5e20" : "#c62828", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, fontFamily: "Georgia, serif", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxWidth: 320 }}>
          {toast.kind === "success" ? "✓ " : "✕ "}{toast.message}
        </div>
      )}

      {selectedStaffDetail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,30,0.45)", zIndex: 90, display: "flex", justifyContent: "flex-end" }} onClick={() => setSelectedStaffDetail(null)}>
          <div className="slide-down" onClick={(e) => e.stopPropagation()} style={{ width: "min(420px, 92vw)", height: "100%", background: "#fff", padding: "28px 26px", overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{selectedStaffDetail}</div>
                <div style={{ fontSize: 13, color: "#9aabbb", marginTop: 2 }}>₹{(wages[selectedStaffDetail] || 0).toLocaleString()} / day</div>
              </div>
              <button className="detail-close" onClick={() => setSelectedStaffDetail(null)} style={{ background: "#f6f9fc", border: "1px solid #dde3eb", color: "#4a6278", borderRadius: 8, width: 34, height: 34, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: "#f6f9fc", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}><span style={{ color: "#7a8fa6" }}>Days present ({MONTHS[month]})</span><span style={{ fontWeight: 700 }}>{getDaysPresent(selectedStaffDetail)} / {daysInMonth}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}><span style={{ color: "#7a8fa6" }}>Advances ({MONTHS[month]})</span><span style={{ fontWeight: 700, color: "#c62828" }}>₹{getTotalAdvance(selectedStaffDetail).toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}><span style={{ color: "#7a8fa6" }}>Salary paid ({MONTHS[month]})</span><span style={{ fontWeight: 700, color: "#2e7d32" }}>₹{getTotalSalaryPaid(selectedStaffDetail).toLocaleString()}</span></div>
              {(() => { const bal = getLiveBalance(selectedStaffDetail); return (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, paddingTop: 8, borderTop: "1px solid #dde3eb" }}>
                  <span style={{ color: "#4a6278", fontWeight: 700 }}>{bal < 0 ? "Worker owes" : "Balance due (live)"}</span>
                  <span style={{ fontWeight: 700, color: bal < 0 ? "#c62828" : "#1a6bbf" }}>₹{Math.abs(bal).toLocaleString()}</span>
                </div>
              ); })()}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6", marginBottom: 10 }}>Entries this month</div>
            {(advances[selectedStaffDetail] || []).length === 0 ? (
              <div style={{ fontSize: 13, color: "#b0bcc8", fontStyle: "italic" }}>No advances or payments recorded</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(advances[selectedStaffDetail] || []).map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#fafbfc", borderRadius: 8, border: "1px solid #edf1f5" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: p.type === "salary" ? "#2e7d32" : "#1a2a3a" }}>₹{p.amount.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: "#9aabbb" }}>{p.date}{p.notes ? ` · ${p.notes}` : ""}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: p.type === "salary" ? "#e6f4ea" : "#e8f0fb", color: p.type === "salary" ? "#2e7d32" : "#1a6bbf" }}>{p.type === "salary" ? "Salary" : "Advance"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: "#1a2a3a", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="header-title" style={{ color: "#ffffff", fontSize: 24, fontWeight: 700 }}>📋 Attendance Manager</div>
          <div className="header-sub" style={{ color: "#8ca0b8", fontSize: 14, marginTop: 2 }}>Track staff attendance, advances &amp; payroll</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {(staffLoading || attendanceLoading || advancesLoading || payrollLoading) && <span style={{ color: "#8ca0b8", fontSize: 13, background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: 6 }}>⟳ Syncing…</span>}
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ background: "#2a3d52", border: "1px solid #3d5266", color: "#e8f0f8", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ background: "#2a3d52", border: "1px solid #3d5266", color: "#e8f0f8", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="dlbtn" onClick={downloadCSV} style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 700 }}>⬇ CSV</button>
          <button className="dlbtn" onClick={downloadExcel} style={{ background: "#1a6bbf", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 700 }}>⬇ Excel</button>
          <button onClick={() => setUnlocked(false)} style={{ background: "transparent", border: "1px solid #3d5266", color: "#8ca0b8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>🔒 Lock</button>
        </div>
      </div>

      <div style={{ display: "flex", background: "#ffffff", borderBottom: "2px solid #dde3eb", padding: "0 24px", overflowX: "auto" }}>
        {[["attendance", "📋  Attendance"], ["salary", "💰  Advances"], ["payroll", "📊  Payroll"], ["staff", "👥  Staff"]].map(([key, label]) => (
          <button key={key} className="tab-btn" onClick={() => setTab(key)} style={{ padding: "16px 24px", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: 700, background: "transparent", color: tab === key ? "#1a6bbf" : "#7a8fa6", borderBottom: tab === key ? "3px solid #1a6bbf" : "3px solid transparent", marginBottom: -2, whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "28px 24px", maxWidth: 1280, margin: "0 auto" }}>

        {tab !== "payroll" && (
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <input placeholder="🔍 Search staff…" value={staffSearch} onChange={(e) => setStaffSearch(e.target.value)} style={{ flex: "1 1 220px", background: "#fff", border: "1.5px solid #cdd5de", borderRadius: 8, padding: "9px 14px", fontSize: 14, fontFamily: "Georgia, serif" }} />
            <select value={staffSort} onChange={(e) => setStaffSort(e.target.value as StaffSort)} style={{ background: "#fff", border: "1.5px solid #cdd5de", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
              <option value="name">Sort: Name</option><option value="advances">Sort: Highest advances</option><option value="attendance">Sort: Lowest attendance</option>
            </select>
            {tab === "staff" && (
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7a8fa6", cursor: "pointer" }}>
                <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} /> Show removed staff
              </label>
            )}
          </div>
        )}

        {tab === "attendance" && (
          <div>
            <div style={{ marginBottom: 16, background: "#fff", borderRadius: 10, padding: "14px 20px", border: "1px solid #dde3eb", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#4a6278", fontWeight: 700 }}>{MONTHS[month]} {year}</span>
              <span style={{ fontSize: 14, color: "#7a8fa6" }}>👤 {staff.length} staff members</span>
              <span style={{ fontSize: 14, color: "#7a8fa6" }}>📅 Today: {now.getDate()}</span>
            </div>
            {todaysSummary && (
              <div style={{ marginBottom: 16, background: "#fff", borderRadius: 10, padding: "14px 20px", border: "1px solid #dde3eb", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "#2e7d32", fontWeight: 700 }}>✓ Present: {todaysSummary.present}</span>
                  <span style={{ fontSize: 14, color: "#e65100", fontWeight: 700 }}>½ Half-day: {todaysSummary.half}</span>
                  <span style={{ fontSize: 14, color: "#c62828", fontWeight: 700 }}>✗ Absent: {todaysSummary.absent}</span>
                  <span style={{ fontSize: 14, color: "#7a8fa6" }}>Total: {todaysSummary.total}</span>
                </div>
                <button className="reset-btn" onClick={resetTodayAttendance} style={{ background: "transparent", border: "1px solid #f5b8b3", color: "#c62828", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>Reset today's attendance</button>
              </div>
            )}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #dde3eb", overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #dde3eb" }}>
                    <th style={{ textAlign: "left", padding: "14px 18px", color: "#4a6278", fontSize: 14, fontWeight: 700, position: "sticky", left: 0, background: "#f6f9fc", minWidth: 180, borderRight: "1px solid #dde3eb" }}>Staff Name</th>
                    {DAYS.map((d) => (
                      <th key={d} style={{ padding: "6px 2px", minWidth: 30, textAlign: "center", background: d === today && isViewingCurrentMonth ? "#e8f0fb" : "#f6f9fc" }}>
                        <div style={{ color: d === today && isViewingCurrentMonth ? "#1a6bbf" : "#7a8fa6", fontSize: 11, fontWeight: d === today ? 700 : 400, marginBottom: 3 }}>{d}</div>
                        {!isFutureDay(d) && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                            <div className="mark-btn" title="Mark all Present" onClick={() => markAllForDay(d, "present")} style={{ cursor: "pointer", fontSize: 9, color: "#2e7d32" }}>▲</div>
                            <div className="mark-btn" title="Mark all Absent" onClick={() => markAllForDay(d, "absent")} style={{ cursor: "pointer", fontSize: 9, color: "#c62828" }}>▼</div>
                          </div>
                        )}
                      </th>
                    ))}
                    <th style={{ padding: "14px 12px", color: "#4a6278", fontSize: 13, fontWeight: 700, minWidth: 70, textAlign: "center", background: "#f6f9fc" }}>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSortedStaff.map((name, idx) => (
                    <tr key={name} className={idx % 2 === 0 ? "row-even" : "row-odd"} style={{ borderTop: "1px solid #edf1f5" }}>
                      <td onClick={() => setSelectedStaffDetail(name)} title="View details" style={{ padding: "10px 18px", fontSize: 15, fontWeight: 600, position: "sticky", left: 0, background: idx % 2 === 0 ? "#ffffff" : "#f6f9fc", whiteSpace: "nowrap", borderRight: "1px solid #dde3eb", cursor: "pointer" }}>{name}</td>
                      {DAYS.map((d) => {
                        const status = attendance[`${name}_${d}`];
                        const future = isFutureDay(d);
                        const look = status === "present" ? { bg: "#e6f4ea", border: "#4caf50", fg: "#2e7d32", icon: "✓" }
                          : status === "half" ? { bg: "#fff3e0", border: "#ffb74d", fg: "#e65100", icon: "½" }
                          : { bg: "#fce8e6", border: "#f5b8b3", fg: "#c62828", icon: "✗" };
                        return (
                          <td key={d} style={{ textAlign: "center", padding: "6px 2px" }}>
                            <div className={`day-cell${future ? " disabled" : ""}`} onClick={() => cycleAttendance(name, d)}
                              title={future ? "Can't mark future dates" : status === "present" ? "Present — click for Half-day" : status === "half" ? "Half-day — click for Absent" : "Absent — click for Present"}
                              style={{ width: 24, height: 24, margin: "0 auto", borderRadius: 6, background: look.bg, border: `1.5px solid ${look.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                              <span style={{ color: look.fg, fontWeight: 700 }}>{look.icon}</span>
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ textAlign: "center", padding: "8px 12px" }}><span style={{ color: "#1a6bbf", fontSize: 15, fontWeight: 700, background: "#e8f0fb", padding: "3px 10px", borderRadius: 6 }}>{getDaysPresent(name)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, color: "#9aabbb", fontSize: 13 }}>▲ / ▼ marks all staff for that day · Click a name for details · Click a cell to cycle Present → Half-day → Absent · Future dates are locked</div>
          </div>
        )}
        {tab === "salary" && (
          <div>
            <div style={{ marginBottom: 24, background: "#1a2a3a", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ color: "#8ca0b8", fontSize: 14 }}>Total advances — {MONTHS[month]} {year}</div>
                <div style={{ color: "#ffffff", fontSize: 36, fontWeight: 700, marginTop: 4 }}>₹{staff.reduce((s, n) => s + getTotalAdvance(n), 0).toLocaleString()}</div>
              </div>
              {downloaded && (
                <div className="slide-down">
                  {!clearing ? (
                    <button className="clearbtn" onClick={() => setClearing(true)} style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>🗑 Clear {MONTHS[month]} Advances</button>
                  ) : (
                    <div style={{ background: "#7f0000", borderRadius: 10, padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ color: "#ffcdd2", fontSize: 14, marginBottom: 10 }}>Are you sure? This deletes all advance and payment records for {MONTHS[month]} {year}.</div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={clearMonthAdvances} style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 7, padding: "8px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>Yes, clear it</button>
                        <button onClick={() => setClearing(false)} style={{ background: "transparent", border: "1px solid #8ca0b8", color: "#ccc", borderRadius: 7, padding: "8px 20px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredSortedStaff.map((name) => {
                const entries = advances[name] || [];
                const liveBalance = getLiveBalance(name);
                const isOpen = !!expanded[name];
                return (
                  <div key={name} style={{ background: "#fff", borderRadius: 12, border: "1px solid #dde3eb", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", flexWrap: "wrap", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "1 1 200px", minWidth: 0, cursor: "pointer" }} onClick={() => setSelectedStaffDetail(name)}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a6bbf", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>{name.charAt(0).toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 17, fontWeight: 700 }}>{name}</div>
                          <div style={{ fontSize: 13, color: entries.length ? "#9aabbb" : "#b0bcc8", marginTop: 4, fontStyle: entries.length ? "normal" : "italic" }}>{entries.length ? `${entries.length} entr${entries.length === 1 ? "y" : "ies"} this month` : "No advances this month"}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "3px 18px", fontSize: 13 }}>
                        <span style={{ color: "#9aabbb" }}>Daily wage</span><span style={{ fontWeight: 700, textAlign: "right" }}>₹{(wages[name] || 0).toLocaleString()}</span>
                        <span style={{ color: "#9aabbb" }}>Advances</span><span style={{ color: "#c62828", fontWeight: 700, textAlign: "right" }}>₹{getTotalAdvance(name).toLocaleString()}</span>
                        <span style={{ color: "#9aabbb" }}>Salary Paid</span><span style={{ color: "#2e7d32", fontWeight: 700, textAlign: "right" }}>₹{getTotalSalaryPaid(name).toLocaleString()}</span>
                        <span style={{ color: "#4a6278", fontWeight: 700 }}>{liveBalance < 0 ? "Worker owes" : "Balance due"}</span>
                        <span style={{ color: liveBalance < 0 ? "#c62828" : "#1a6bbf", fontWeight: 700, textAlign: "right" }}>₹{Math.abs(liveBalance).toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button className="addpay-btn" disabled={addingAdvanceStaff === name} onClick={() => addAdvance(name)} style={{ background: "#1a6bbf", border: "none", color: "#fff", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: addingAdvanceStaff === name ? "wait" : "pointer", fontFamily: "Georgia, serif", opacity: addingAdvanceStaff === name ? 0.6 : 1 }}>{addingAdvanceStaff === name ? "Adding…" : "+ Add"}</button>
                        {entries.length > 0 && <button className="expand-btn" onClick={() => toggleExpand(name)} style={{ background: "#f6f9fc", border: "1px solid #dde3eb", color: "#4a6278", borderRadius: 8, width: 38, height: 38, cursor: "pointer", fontSize: 16, transform: isOpen ? "rotate(180deg)" : "none" }}>▾</button>}
                      </div>
                    </div>
                    {isOpen && entries.length > 0 && (
                      <div className="slide-down" style={{ borderTop: "1px solid #edf1f5", overflowX: "auto" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "130px 110px 1fr 130px 90px", padding: "10px 22px", background: "#fafbfc", borderBottom: "1px solid #edf1f5", gap: 12, minWidth: 700 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Advance Date</div><div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Amount (₹)</div><div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Notes</div><div style={{ fontSize: 13, fontWeight: 700, color: "#7a8fa6" }}>Type</div><div></div>
                        </div>
                        {entries.map((p, i) => {
                          const isEditing = !!editingRows[p.id];
                          const draft = drafts[p.id];
                          return (
                            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "130px 110px 1fr 130px 90px", padding: "12px 22px", gap: 12, borderBottom: i < entries.length - 1 ? "1px solid #edf1f5" : "none", alignItems: "center", background: i % 2 === 0 ? "#fff" : "#fafcff", minWidth: 700 }}>
                              {isEditing && draft ? (
                                <>
                                  <input type="date" value={draft.date} onChange={(e) => updateDraft(p.id, "date", e.target.value)} style={inputStyle} />
                                  <input type="number" min="0" value={draft.amount as number} onChange={(e) => updateDraft(p.id, "amount", e.target.value)} style={inputStyle} />
                                  <input type="text" value={draft.notes} placeholder="e.g. Travel" onChange={(e) => updateDraft(p.id, "notes", e.target.value)} style={inputStyle} />
                                  <select value={draft.type} onChange={(e) => updateDraft(p.id, "type", e.target.value)} style={inputStyle}><option value="advance">Advance</option><option value="salary">Salary Payment</option></select>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button className="savepay-btn" disabled={savingEntryId === p.id} onClick={() => saveAdvance(name, p.id)} style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 6, width: 34, height: 34, cursor: "pointer" }}>✓</button>
                                    <button className="cancelpay-btn" onClick={() => cancelEditAdvance(p.id)} style={{ background: "transparent", border: "1.5px solid #cdd5de", color: "#7a8fa6", borderRadius: 6, width: 34, height: 34, cursor: "pointer" }}>✕</button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ fontSize: 14 }}>{p.date}</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: p.type === "salary" ? "#2e7d32" : "#1a2a3a" }}>₹{p.amount.toLocaleString()}</div>
                                  <div style={{ fontSize: 13, color: "#7a8fa6", fontStyle: p.notes ? "normal" : "italic" }}>{p.notes || "No notes"}</div>
                                  <div><span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: p.type === "salary" ? "#e6f4ea" : "#e8f0fb", color: p.type === "salary" ? "#2e7d32" : "#1a6bbf" }}>{p.type === "salary" ? "Salary" : "Advance"}</span></div>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button className="editpay-btn" onClick={() => startEditAdvance(p)} style={{ background: "#f6f9fc", border: "1px solid #dde3eb", color: "#4a6278", borderRadius: 6, width: 34, height: 34, cursor: "pointer" }}>✎</button>
                                    <button className="delpay-btn" disabled={deletingEntryId === p.id} onClick={() => deleteAdvance(name, p.id)} style={{ background: "transparent", border: "1.5px solid #f5b8b3", color: "#c62828", borderRadius: 6, width: 34, height: 34, cursor: "pointer" }}>✕</button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {downloaded && <div style={{ marginTop: 16, color: "#9aabbb", fontSize: 13 }}>✓ Downloaded — Clear {MONTHS[month]} Advances button is now active above.</div>}
          </div>
        )}

        {tab === "payroll" && (
          <div>
            <div style={{ marginBottom: 16, color: "#7a8fa6", fontSize: 14 }}>A running balance per worker — days present since their last cleared payment (half-days count as 0.5), times their wage on that date, minus advances. Every settlement is recorded atomically and can't be double-submitted.</div>
            {needsBaseline && (
              <div style={{ marginBottom: 20, background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontSize: 13, color: "#7a5c00" }}>Some workers have never had a payday set here — their balance currently counts every present day on record. Set today as the starting point once.</div>
                <button className="baseline-btn" disabled={initializingBaseline} onClick={initBaseline} style={{ background: "#1a6bbf", border: "none", color: "#fff", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: initializingBaseline ? "wait" : "pointer", fontFamily: "Georgia, serif" }}>{initializingBaseline ? "Setting…" : "Start tracking from today"}</button>
              </div>
            )}
            {payrollLoading ? <div style={{ color: "#7a8fa6", fontSize: 14, padding: "20px 0" }}>⟳ Calculating…</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {payrollRows.map((row, idx) => {
                  const due = row.balanceDue;
                  const owesUs = due < 0;
                  const amountVal = payClearAmounts[row.name] ?? String(Math.max(due, 0));
                  return (
                    <div key={row.name} style={{ background: "#fff", borderRadius: 12, border: owesUs ? "1px solid #f5b8b3" : "1px solid #dde3eb", padding: "16px 22px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                      <div style={{ width: 26, color: "#b0bcc8", fontSize: 13, fontWeight: 700 }}>#{idx + 1}</div>
                      <div onClick={() => setSelectedStaffDetail(row.name)} style={{ flex: "1 1 160px", minWidth: 0, cursor: "pointer" }}>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{row.name}</div>
                        <div style={{ fontSize: 12, color: "#9aabbb", marginTop: 2 }}>{row.since ? `Since ${row.since}` : "Since joining"}</div>
                      </div>
                      <div style={{ textAlign: "center", minWidth: 60 }}><div style={{ fontSize: 12, color: "#9aabbb" }}>Days</div><div style={{ fontSize: 16, fontWeight: 700, color: "#4a6278" }}>{row.daysPresent}</div></div>
                      <div style={{ textAlign: "center", minWidth: 90 }}><div style={{ fontSize: 12, color: "#9aabbb" }}>Advance</div><div style={{ fontSize: 16, fontWeight: 700, color: "#c62828" }}>₹{row.advancesSince.toLocaleString()}</div></div>
                      <div style={{ textAlign: "center", minWidth: 110 }}><div style={{ fontSize: 12, color: "#9aabbb" }}>{owesUs ? "Worker Owes" : "Salary Due"}</div><div style={{ fontSize: 18, fontWeight: 700, color: owesUs ? "#c62828" : due > 0 ? "#2e7d32" : "#9aabbb" }}>₹{Math.abs(due).toLocaleString()}</div></div>
                      {due > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14 }}>₹</span>
                          <input type="number" min="0" value={amountVal} onChange={(e) => setPayClearAmounts((prev) => ({ ...prev, [row.name]: e.target.value }))} style={{ ...inputStyle, width: 100 }} />
                          <button className="clearpay-btn" disabled={clearingStaff === row.name} onClick={() => clearPayment(row.name, due)} style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: clearingStaff === row.name ? "wait" : "pointer", fontFamily: "Georgia, serif" }}>{clearingStaff === row.name ? "Saving…" : "Clear Payment"}</button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: owesUs ? "#c62828" : "#b0bcc8", fontStyle: "italic", minWidth: 160 }}>{owesUs ? "Will offset as more days accrue" : "Settled"}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "staff" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ marginBottom: 20, color: "#4a6278", fontSize: 15, fontWeight: 700 }}>Manage Staff — {staffList.filter((s) => s.active).length} active</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
              <input placeholder="Full name…" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: "2 1 180px", background: "#fff", border: "2px solid #cdd5de", borderRadius: 8, padding: "12px 16px", fontSize: 15, fontFamily: "Georgia, serif" }} />
              <input placeholder="Daily wage (₹)" type="number" min="0" value={newWage} onChange={(e) => setNewWage(e.target.value)} style={{ flex: "1 1 140px", background: "#fff", border: "2px solid #cdd5de", borderRadius: 8, padding: "12px 16px", fontSize: 15, fontFamily: "Georgia, serif" }} />
              <input placeholder="Joining date" type="date" value={newJoiningDate} onChange={(e) => setNewJoiningDate(e.target.value)} style={{ flex: "1 1 150px", background: "#fff", border: "2px solid #cdd5de", borderRadius: 8, padding: "12px 16px", fontSize: 15, fontFamily: "Georgia, serif" }} />
              <button className="add-btn" disabled={addingStaff} onClick={addStaff} style={{ background: "#fff", border: "2px solid #1a6bbf", color: "#1a6bbf", borderRadius: 8, padding: "12px 22px", fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 700 }}>{addingStaff ? "Adding…" : "+ Add"}</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredSortedStaff.map((name) => {
                const s = staffList.find((x) => x.name === name);
                if (!s) return null;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", borderRadius: 10, border: "1px solid #dde3eb", flexWrap: "wrap", gap: 10, opacity: s.active ? 1 : 0.6 }}>
                    <div onClick={() => setSelectedStaffDetail(name)} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a6bbf", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{name}{!s.active && <span style={{ fontSize: 12, color: "#c62828", marginLeft: 8 }}>(removed)</span>}</div>
                        <div style={{ fontSize: 14, color: "#7a8fa6", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                          {editingWageName === name ? (
                            <span onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              ₹<input type="number" min="0" value={wageDraft} onChange={(e) => setWageDraft(e.target.value)} autoFocus style={{ ...inputStyle, width: 80, padding: "4px 8px" }} /> / day
                              <button disabled={savingWage} onClick={() => saveWage(name)} style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 5, width: 24, height: 24, cursor: "pointer", fontSize: 11 }}>✓</button>
                              <button onClick={cancelEditWage} style={{ background: "transparent", border: "1px solid #cdd5de", color: "#7a8fa6", borderRadius: 5, width: 24, height: 24, cursor: "pointer", fontSize: 11 }}>✕</button>
                            </span>
                          ) : (
                            <span>₹{(wages[name] || 0).toLocaleString()} / day · joined {s.joiningDate}
                              <button onClick={(e) => { e.stopPropagation(); startEditWage(name); }} style={{ background: "transparent", border: "none", color: "#1a6bbf", cursor: "pointer", fontSize: 12, textDecoration: "underline", padding: 0, marginLeft: 8 }}>edit wage</button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {s.active ? (
                      <button className="remove-btn" disabled={removingStaffName === name} onClick={() => removeStaff(name)} style={{ background: "transparent", border: "1px solid #dde3eb", color: "#9aabbb", cursor: "pointer", fontSize: 18, borderRadius: 6, width: 36, height: 36 }}>✕</button>
                    ) : (
                      <button disabled={reactivatingStaffName === name} onClick={() => undoRemoveStaff(name)} style={{ background: "#e8f0fb", border: "1px solid #1a6bbf", color: "#1a6bbf", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>Restore</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}