export interface ExamAttempt {
  startedAt: number | null;
  expiresAt: number | null;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  submittedAt: string | null;
  receipt: string;
}

export const EMPTY_ATTEMPT: ExamAttempt = {
  startedAt: null, expiresAt: null, answers: {}, flagged: {}, submittedAt: null, receipt: "",
};

export function isExamAttempt(value: unknown): value is ExamAttempt {
  if (!value || typeof value !== "object") return false;
  const attempt = value as Partial<ExamAttempt>;
  const validTimestamp = (timestamp: unknown) => timestamp === null || (typeof timestamp === "number" && Number.isFinite(timestamp));
  return validTimestamp(attempt.startedAt) && validTimestamp(attempt.expiresAt)
    && (attempt.startedAt === null) === (attempt.expiresAt === null)
    && Boolean(attempt.answers && typeof attempt.answers === "object" && !Array.isArray(attempt.answers) && Object.values(attempt.answers).every(answer => typeof answer === "string"))
    && Boolean(attempt.flagged && typeof attempt.flagged === "object" && !Array.isArray(attempt.flagged) && Object.values(attempt.flagged).every(flag => typeof flag === "boolean"))
    && (attempt.submittedAt === null || (typeof attempt.submittedAt === "string" && Number.isFinite(Date.parse(attempt.submittedAt))))
    && typeof attempt.receipt === "string";
}

export function isSupportedExam(courseId: string, examId: string) {
  return ["ic-3101", "ic-3204"].includes(courseId) && examId === "exam-midterm";
}

export function remainingSeconds(expiresAt: number, now: number) {
  return Math.max(0, Math.ceil((expiresAt - now) / 1000));
}

export function finishAttempt(attempt: ExamAttempt, timestamp: number, receipt: string): ExamAttempt {
  if (attempt.startedAt === null || attempt.submittedAt) return attempt;
  return { ...attempt, submittedAt: new Date(timestamp).toISOString(), receipt };
}

export function validateFile(file: { name: string; size: number }, extensions: readonly string[]) {
  if (!extensions.some(extension => file.name.toLowerCase().endsWith(extension))) {
    return `Choose a ${extensions.join(", ")} file.`;
  }
  if (file.size > 50 * 1024 * 1024) return "The file must be 50 MB or smaller.";
  if (file.size === 0) return "The selected file is empty.";
  return null;
}
