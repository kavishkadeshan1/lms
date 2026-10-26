import test from "node:test";
import assert from "node:assert/strict";
import { createSessionStore, SESSION_KEY } from "../src/lib/session-store.ts";
import { canAccessRoute, getDashboardPath, getLoginDestination } from "../src/lib/auth-routing.ts";
import { INITIAL_COURSES, findCourse, normalizeCourseId } from "../src/lib/course-catalog.ts";
import { calendarMonthCells, parseCalendarDate, calendarDateKey } from "../src/lib/calendar-dates.ts";
import { EMPTY_ATTEMPT, finishAttempt, isExamAttempt, remainingSeconds, isSupportedExam, validateFile } from "../src/lib/exam-attempt.ts";
import { decodeLocalValue } from "../src/lib/local-state-value.ts";
import { toCsv } from "../src/lib/download.ts";

function storageFixture() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test("a fresh browser has no demo session", () => {
  assert.equal(createSessionStore(storageFixture).getSnapshot(), null);
});

test("sign-in survives a new tab and logout clears the stored session", () => {
  const storage = storageFixture();
  const first = createSessionStore(() => storage);
  first.setSession("lec.pathirana");
  const second = createSessionStore(() => storage);
  assert.equal(second.getSnapshot(), "lec.pathirana");
  first.setSession(null);
  second.refresh();
  assert.equal(second.getSnapshot(), null);
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test("login and logout remain usable when browser storage is blocked", () => {
  const store = createSessionStore(() => { throw new Error("Storage blocked"); });
  assert.equal(store.getSnapshot(), null);
  store.setSession("admin.tech");
  assert.equal(store.getSnapshot(), "admin.tech");
  store.setSession(null);
  assert.equal(store.getSnapshot(), null);
});

test("failed writes do not restore a stale session over the current tab", () => {
  const store = createSessionStore(() => ({ getItem: () => "old", setItem: () => { throw new Error("Quota"); }, removeItem: () => { throw new Error("Blocked"); } }));
  store.setSession("2023t01855");
  assert.equal(store.getSnapshot(), "2023t01855");
  store.setSession(null);
  assert.equal(store.getSnapshot(), null);
});

test("session changes notify subscribers and support cleanup", () => {
  const storage = storageFixture();
  const store = createSessionStore(() => storage);
  let changes = 0;
  const unsubscribe = store.subscribe(() => changes++);
  store.setSession("admin.tech");
  unsubscribe();
  store.setSession(null);
  assert.equal(changes, 1);
});

test("each role gets its own dashboard after login", () => {
  assert.equal(getDashboardPath("student"), "/");
  assert.equal(getLoginDestination("/", "lecturer"), "/lecturer");
  assert.equal(getLoginDestination(null, "admin"), "/admin");
});

test("deep links and search are restored after login", () => {
  assert.equal(getLoginDestination("/courses?search=Software", "student"), "/courses?search=Software");
  assert.equal(getLoginDestination("/courses/ic-3204#sec-2", "student"), "/courses/ic-3204#sec-2");
});

test("return links cannot leave the site or loop through login", () => {
  for (const next of ["https://example.com", "//example.com", "/\\example.com", "/%2f%2fexample.com", "/%5cexample.com", "javascript:alert(1)", "/login?next=/", "/register", "/%6cogin", "/%", "/\n/evil"]) {
    assert.equal(getLoginDestination(next, "student"), "/", next);
  }
});

test("return links cannot open another role's staff screens", () => {
  assert.equal(getLoginDestination("/admin/users", "student"), "/");
  assert.equal(getLoginDestination("/lecturer/grading", "student"), "/");
  assert.equal(canAccessRoute("/admin/users", "lecturer"), false);
  assert.equal(canAccessRoute("/%61dmin/users", "student"), false);
  assert.equal(canAccessRoute("/%", "student"), false);
  assert.equal(canAccessRoute("/admin/users", "admin"), true);
  assert.equal(canAccessRoute("/lecturer/grading", "admin"), true);
});

test("course routes use the requested course and support old ICT links", () => {
  assert.equal(findCourse(INITIAL_COURSES, "ic-3101")?.code, "IC 3101");
  assert.equal(findCourse(INITIAL_COURSES, "ict-3101")?.id, "ic-3101");
  assert.equal(findCourse(INITIAL_COURSES, "missing"), undefined);
  assert.equal(normalizeCourseId("  IC 3101  "), "ic-3101");
});

test("unsupported exam routes do not open another course's exam", () => {
  assert.equal(isSupportedExam("ic-3204", "exam-midterm"), true);
  assert.equal(isSupportedExam("ic-3101", "exam-midterm"), true);
  assert.equal(isSupportedExam("ic-3102", "exam-midterm"), false);
  assert.equal(isSupportedExam("ic-3101", "unknown"), false);
});

test("exam time is based on the deadline, including elapsed time in background tabs", () => {
  assert.equal(remainingSeconds(3600000, 600000), 3000);
  assert.equal(remainingSeconds(3600000, 3600001), 0);
  assert.equal(remainingSeconds(2000, 1001), 1);
});

test("finishing an exam preserves answers and cannot create duplicate submissions", () => {
  const attempt = { ...EMPTY_ATTEMPT, startedAt: 0, expiresAt: 3600000, answers: { 1: "True" } };
  const finished = finishAttempt(attempt, 10000, "LOCAL-1");
  assert.equal(finished.submittedAt, "1970-01-01T00:00:10.000Z");
  assert.deepEqual(finished.answers, attempt.answers);
  assert.equal(finishAttempt(finished, 11000, "LOCAL-2"), finished);
  assert.equal(finishAttempt(EMPTY_ATTEMPT, 10000, "LOCAL-3"), EMPTY_ATTEMPT);
});

test("file selection rejects unsupported, empty, and oversized files", () => {
  assert.equal(validateFile({ name: "answer.PDF", size: 1024 }, [".pdf", ".zip"]), null);
  assert.ok(validateFile({ name: "answer.exe", size: 1024 }, [".pdf"]));
  assert.ok(validateFile({ name: "answer.pdf", size: 0 }, [".pdf"]));
  assert.ok(validateFile({ name: "answer.pdf", size: 50 * 1024 * 1024 + 1 }, [".pdf"]));
});

test("calendar rejects invalid dates and preserves local date keys", () => {
  assert.equal(parseCalendarDate("2026-02-29"), null);
  assert.equal(parseCalendarDate("2026-13-01"), null);
  assert.equal(calendarDateKey(parseCalendarDate("2028-02-29")), "2028-02-29");
});

test("calendar aligns Monday-first and includes every day in the month", () => {
  const october = calendarMonthCells(new Date(2026, 9, 1));
  assert.equal(october[0].date.getDay(), 1);
  assert.equal(october.filter(cell => cell.isCurrentMonth).length, 31);
  assert.equal(october.findIndex(cell => cell.isCurrentMonth && cell.dayNumber === 1), 3);
  const february = calendarMonthCells(new Date(2028, 1, 1));
  assert.equal(february.filter(cell => cell.isCurrentMonth).length, 29);
});

test("report CSV escapes quotes and neutralizes spreadsheet formulas", () => {
  assert.equal(toCsv([["Name", 'A "quote"', "=SUM(A1:A2)"]]), '"Name","A ""quote""","\'=SUM(A1:A2)"');
});

test("incompatible or corrupted saved browser values fall back safely", () => {
  const initial = [{ id: "course" }];
  for (const value of ["{broken", "null", "{}", '"old value"', "[null]"]) {
    assert.equal(decodeLocalValue(value, initial), initial);
  }
  assert.deepEqual(decodeLocalValue('[{"id":"saved"}]', initial), [{ id: "saved" }]);
});

test("invalid saved exam state cannot start or finish a broken attempt", () => {
  assert.equal(isExamAttempt(EMPTY_ATTEMPT), true);
  assert.equal(isExamAttempt({ ...EMPTY_ATTEMPT, expiresAt: 3600000 }), false);
  assert.equal(isExamAttempt({ ...EMPTY_ATTEMPT, answers: null }), false);
  assert.equal(isExamAttempt({ ...EMPTY_ATTEMPT, answers: { 1: 42 } }), false);
  assert.equal(decodeLocalValue('{}', EMPTY_ATTEMPT, isExamAttempt), EMPTY_ATTEMPT);
});
