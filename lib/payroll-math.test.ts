import { describe, it, expect } from "vitest";
import {
  resolveWageForDate,
  earnedForDay,
  dayValue,
  computeBalance,
  splitSettlement,
  type WageHistoryEntry,
  type AttendanceEntry,
  type TransactionEntry,
} from "./payroll-math";

describe("resolveWageForDate", () => {
  const history: WageHistoryEntry[] = [
    { dailyWage: 500, effectiveFrom: "2026-01-01" },
    { dailyWage: 600, effectiveFrom: "2026-08-15" },
  ];

  it("picks the wage effective before a later raise", () => {
    expect(resolveWageForDate(history, "2026-08-14")).toBe(500);
  });
  it("picks the new wage exactly on its effective date (inclusive)", () => {
    expect(resolveWageForDate(history, "2026-08-15")).toBe(600);
  });
  it("picks the new wage well after the change", () => {
    expect(resolveWageForDate(history, "2026-09-01")).toBe(600);
  });
  it("returns 0 before any wage was ever on record", () => {
    expect(resolveWageForDate(history, "2025-12-31")).toBe(0);
  });
  it("returns 0 for a worker with no wage history at all", () => {
    expect(resolveWageForDate([], "2026-01-01")).toBe(0);
  });
  it("is unaffected by the order entries are supplied in", () => {
    const shuffled = [history[1], history[0]];
    expect(resolveWageForDate(shuffled, "2026-08-20")).toBe(600);
    expect(resolveWageForDate(shuffled, "2026-02-01")).toBe(500);
  });
});

describe("earnedForDay", () => {
  it("a full day pays the full wage, no rounding needed", () => {
    expect(earnedForDay("present", 500)).toBe(500);
  });
  it("a half day pays half, rounded to the nearest rupee", () => {
    expect(earnedForDay("half", 500)).toBe(250);
    expect(earnedForDay("half", 400)).toBe(200);
    expect(earnedForDay("half", 320)).toBe(160);
  });
  it("rounds the odd-wage .5 case up", () => {
    expect(earnedForDay("half", 325)).toBe(163); // 162.5 -> 163
    expect(earnedForDay("half", 321)).toBe(161); // 160.5 -> 161
    expect(earnedForDay("half", 301)).toBe(151); // 150.5 -> 151
  });
  it("absent pays nothing regardless of wage", () => {
    expect(earnedForDay("absent", 500)).toBe(0);
    expect(earnedForDay("absent", 0)).toBe(0);
  });
  it("a wage of 0 (never set) never pays anything, present or not", () => {
    expect(earnedForDay("present", 0)).toBe(0);
    expect(earnedForDay("half", 0)).toBe(0);
  });
});

describe("dayValue", () => {
  it("maps each status to its day fraction", () => {
    expect(dayValue("present")).toBe(1);
    expect(dayValue("half")).toBe(0.5);
    expect(dayValue("absent")).toBe(0);
  });
});

describe("computeBalance — acceptance scenarios", () => {
  const wage500: WageHistoryEntry[] = [{ dailyWage: 500, effectiveFrom: "2026-01-01" }];

  it("normal case: 5 present days at 500, one 500 advance -> 2000 due", () => {
    const attendance: AttendanceEntry[] = [
      "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14",
    ].map((date) => ({ date, status: "present" as const }));
    const transactions: TransactionEntry[] = [{ date: "2026-08-12", amount: 500, type: "advance" }];

    const result = computeBalance({ attendance, wageHistory: wage500, transactions, sinceDate: null, asOfDate: "2026-08-16" });

    expect(result.daysPresent).toBe(5);
    expect(result.earnedRupees).toBe(2500);
    expect(result.advancesSince).toBe(500);
    expect(result.salaryPaidSince).toBe(0);
    expect(result.balanceDue).toBe(2000);
  });

  it("half-day: 4 present + 1 half at 500 -> 4.5 days, 2250 earned", () => {
    const attendance: AttendanceEntry[] = [
      { date: "2026-08-10", status: "present" },
      { date: "2026-08-11", status: "present" },
      { date: "2026-08-12", status: "present" },
      { date: "2026-08-13", status: "present" },
      { date: "2026-08-14", status: "half" },
    ];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions: [], sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.daysPresent).toBe(4.5);
    expect(result.earnedRupees).toBe(2250);
  });

  it("multiple advances before any settlement all count individually", () => {
    const transactions: TransactionEntry[] = [
      { date: "2026-08-10", amount: 200, type: "advance" },
      { date: "2026-08-11", amount: 300, type: "advance" },
      { date: "2026-08-12", amount: 100, type: "advance" },
    ];
    const result = computeBalance({ attendance: [], wageHistory: wage500, transactions, sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.advancesSince).toBe(600);
    expect(result.balanceDue).toBe(-600);
  });

  it("advances exceeding earnings show a real negative balance, never floored to 0", () => {
    const attendance: AttendanceEntry[] = [{ date: "2026-08-10", status: "present" }];
    const transactions: TransactionEntry[] = [{ date: "2026-08-11", amount: 1300, type: "advance" }];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions, sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.earnedRupees).toBe(500);
    expect(result.balanceDue).toBe(-800);
  });

  it("excludes attendance/transactions on or before sinceDate (already settled)", () => {
    const attendance: AttendanceEntry[] = [
      { date: "2026-08-05", status: "present" }, // on the settle date itself -> excluded
      { date: "2026-08-06", status: "present" }, // after -> included
    ];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions: [], sinceDate: "2026-08-05", asOfDate: "2026-08-16" });
    expect(result.daysPresent).toBe(1);
    expect(result.earnedRupees).toBe(500);
  });

  it("excludes anything after asOfDate", () => {
    const attendance: AttendanceEntry[] = [
      { date: "2026-08-10", status: "present" },
      { date: "2026-08-20", status: "present" },
    ];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions: [], sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.daysPresent).toBe(1);
  });

  it("a worker uncollected for months keeps accruing correctly across that whole span", () => {
    const attendance: AttendanceEntry[] = [];
    for (let m = 1; m <= 3; m++) {
      for (let d = 1; d <= 10; d++) {
        attendance.push({ date: `2026-0${m}-${String(d).padStart(2, "0")}`, status: "present" });
      }
    }
    const result = computeBalance({ attendance, wageHistory: wage500, transactions: [], sinceDate: null, asOfDate: "2026-03-31" });
    expect(result.daysPresent).toBe(30);
    expect(result.earnedRupees).toBe(15000);
  });

  it("a wage change mid-stretch prices each day at the rate effective on that day, not today's rate", () => {
    const history: WageHistoryEntry[] = [
      { dailyWage: 500, effectiveFrom: "2026-01-01" },
      { dailyWage: 600, effectiveFrom: "2026-08-15" },
    ];
    const attendance: AttendanceEntry[] = [
      { date: "2026-08-14", status: "present" }, // priced at 500
      { date: "2026-08-15", status: "present" }, // priced at 600
      { date: "2026-08-16", status: "present" }, // priced at 600
    ];
    const result = computeBalance({ attendance, wageHistory: history, transactions: [], sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.earnedRupees).toBe(500 + 600 + 600);
  });

  it("a worker who joined mid-week simply has no earlier attendance to count — nothing special needed", () => {
    const attendance: AttendanceEntry[] = [{ date: "2026-08-12", status: "present" }];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions: [], sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.earnedRupees).toBe(500);
  });

  it("a worker with zero activity in the window has a zero balance, not an error", () => {
    const result = computeBalance({ attendance: [], wageHistory: wage500, transactions: [], sinceDate: null, asOfDate: "2026-08-16" });
    expect(result).toEqual({ daysPresent: 0, earnedRupees: 0, advancesSince: 0, salaryPaidSince: 0, balanceDue: 0 });
  });

  it("a prior salary payment reduces the balance the same way an advance does", () => {
    const attendance: AttendanceEntry[] = [
      { date: "2026-08-10", status: "present" },
      { date: "2026-08-11", status: "present" },
    ];
    const transactions: TransactionEntry[] = [{ date: "2026-08-11", amount: 600, type: "salary" }];
    const result = computeBalance({ attendance, wageHistory: wage500, transactions, sinceDate: null, asOfDate: "2026-08-16" });
    expect(result.earnedRupees).toBe(1000);
    expect(result.salaryPaidSince).toBe(600);
    expect(result.balanceDue).toBe(400);
  });
});

describe("splitSettlement — the overpay/underpay carry-forward logic", () => {
  it("exact payment fully settles with nothing carried forward", () => {
    expect(splitSettlement(2000, 2000)).toEqual({
      salaryPortion: 2000, carryForwardAdvance: 0, remainingDue: 0, fullySettled: true,
    });
  });

  it("overpayment (the ₹500-note case): settles what's due, carries the rest as next period's advance", () => {
    expect(splitSettlement(1900, 2000)).toEqual({
      salaryPortion: 1900, carryForwardAdvance: 100, remainingDue: 0, fullySettled: true,
    });
  });

  it("underpayment: records the partial amount, leaves the remainder due, does not settle", () => {
    expect(splitSettlement(1400, 1000)).toEqual({
      salaryPortion: 1000, carryForwardAdvance: 0, remainingDue: 400, fullySettled: false,
    });
  });

  it("paying zero leaves the full amount due and unsettled", () => {
    expect(splitSettlement(1000, 0)).toEqual({
      salaryPortion: 0, carryForwardAdvance: 0, remainingDue: 1000, fullySettled: false,
    });
  });

  it("a very large overpayment still splits correctly", () => {
    expect(splitSettlement(100, 10000)).toEqual({
      salaryPortion: 100, carryForwardAdvance: 9900, remainingDue: 0, fullySettled: true,
    });
  });

  it("refuses to run with nothing due — this must be guarded by the caller, not silently accepted", () => {
    expect(() => splitSettlement(0, 100)).toThrow();
    expect(() => splitSettlement(-50, 100)).toThrow();
  });

  it("refuses a negative or non-finite payment", () => {
    expect(() => splitSettlement(1000, -1)).toThrow();
    expect(() => splitSettlement(1000, NaN)).toThrow();
  });
});
