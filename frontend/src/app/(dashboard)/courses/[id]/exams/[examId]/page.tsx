"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { INITIAL_COURSES, findCourse, type CourseItem } from "@/lib/course-catalog";
import { useLocalState } from "@/lib/use-local-state";
import { EMPTY_ATTEMPT, finishAttempt, isExamAttempt, isSupportedExam, remainingSeconds, validateFile } from "@/lib/exam-attempt";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  FileText, 
  Flag,
  Send,
  HelpCircle
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface Question {
  id: number;
  type: "mcq" | "tf" | "short" | "file";
  prompt: string;
  options?: string[];
  points: number;
}

const EXAM_QUESTIONS: Question[] = [
  {
    id: 1,
    type: "mcq",
    prompt: "In the Raft consensus algorithm, which condition MUST be met for a log entry to be considered committed by the leader?",
    options: [
      "The entry has been stored on all follower nodes in the cluster.",
      "The entry has been replicated on a majority (quorum) of nodes in the current term.",
      "The leader node receives approval from the client who dispatched the command.",
      "The heartbeat timer has elapsed without any split-vote trigger."
    ],
    points: 10
  },
  {
    id: 2,
    type: "tf",
    prompt: "True or False: According to the CAP theorem, in the presence of a network partition, a distributed system must sacrifice either Consistency or Availability.",
    options: ["True", "False"],
    points: 5
  },
  {
    id: 3,
    type: "short",
    prompt: "Define 'Logical Multi-Tenant Isolation' as implemented in the LMS 2026 SRS compared to dedicated database-per-tenant isolation.",
    points: 15
  },
  {
    id: 4,
    type: "file",
    prompt: "Formal Architectural Diagram (SRS FR-071): Upload your drawn sequence diagram illustrating the 3-phase commit or Raft leader election failure recovery as a single PDF or PNG answer script.",
    points: 20
  }
];

const SQA_QUESTIONS: Question[] = [
  { id: 1, type: "mcq", prompt: "Which technique tests values at the edges of input ranges?", options: ["Boundary value analysis", "Load testing", "Mutation testing", "Usability testing"], points: 10 },
  { id: 2, type: "tf", prompt: "Verification checks whether a product meets its specified requirements.", options: ["True", "False"], points: 5 },
  { id: 3, type: "short", prompt: "Explain equivalence partitioning and give an example of valid and invalid input classes.", points: 15 },
  { id: 4, type: "file", prompt: "Select a PDF or PNG showing test cases for an age field with an allowed range of 18 to 65.", points: 20 },
];

function ExamHallContent({ course }: { course: CourseItem }) {
  const { tenant, user } = useTenant();

  const questions = course.id === "ic-3204" ? SQA_QUESTIONS : EXAM_QUESTIONS;
  const [attempt, setAttempt] = useLocalState(`lms:exam:${tenant.id}:${user.username}:${course.id}:exam-midterm`, EMPTY_ATTEMPT, isExamAttempt);
  const [hasAgreedIntegrity, setHasAgreedIntegrity] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [fileError, setFileError] = useState<string | null>(null);
  const { answers, flagged } = attempt;
  const examStarted = attempt.startedAt !== null;
  const submitted = attempt.submittedAt !== null;
  const receiptNumber = attempt.receipt;
  const uploadedFileName = answers[4] || null;
  const timeLeft = attempt.expiresAt ? remainingSeconds(attempt.expiresAt, now) : 3600;
  const answeredCount = questions.filter(question => answers[question.id]?.trim()).length;

  // Use an absolute deadline so refreshes and background tabs do not restart the timer.
  useEffect(() => {
    if (!attempt.expiresAt || submitted) return;
    const tick = () => {
      const timestamp = Date.now();
      setNow(timestamp);
      if (remainingSeconds(attempt.expiresAt!, timestamp) === 0) {
        setAttempt(previous => finishAttempt(previous, timestamp, `LOCAL-${crypto.randomUUID()}`));
      }
    };
    const initialTick = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    return () => { window.clearTimeout(initialTick); window.clearInterval(interval); window.removeEventListener("focus", tick); };
  }, [attempt.expiresAt, submitted, setAttempt]);

  const formatTimer = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const handleSelectAnswer = (qId: number, value: string) => {
    setAttempt(previous => {
      if (previous.submittedAt || !previous.expiresAt || remainingSeconds(previous.expiresAt, Date.now()) === 0) return previous;
      return { ...previous, answers: { ...previous.answers, [qId]: value } };
    });
  };
  const toggleFlag = (qId: number) => setAttempt(previous => ({ ...previous, flagged: { ...previous.flagged, [qId]: !previous.flagged[qId] } }));
  const handleSubmitExam = () => setAttempt(previous => finishAttempt(previous, Date.now(), `LOCAL-${crypto.randomUUID()}`));

  // Pre-exam instruction screen with Academic Integrity Declaration (FR-070)
  if (!examStarted) {
    return (
      <div className="p-0 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="border-b pb-4">
          <Link href={`/courses/${course.id}`} className="text-xs text-primary hover:underline font-medium">
            ← Back to {course.code} Course
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            Practice Examination: {course.title} ({course.code})
          </h1>
          <p className="text-sm text-muted-foreground">
            {tenant.name} — {tenant.facultyName}
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Examination Parameters & Regulations
            </CardTitle>
            <CardDescription>
              Please read all rules thoroughly before commencing your examination attempt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-xl font-mono text-xs">
              <div>
                <span className="text-muted-foreground block">Duration:</span>
                <span className="font-bold text-foreground">60 Minutes</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Questions:</span>
                <span className="font-bold text-foreground">4 Items (50 Pts)</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Attempt:</span>
                <span className="font-bold text-foreground">Local practice</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Submission:</span>
                <span className="font-bold text-green-600">Auto-submit enabled</span>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 text-amber-900 dark:text-amber-300 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Practice Attempt Information
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>No unauthorized materials, AI generators, or secondary device lookups are permitted.</li>
                <li>This practice attempt saves answers and timing in this browser. No institutional audit log or server submission is created.</li>
                <li>Answers must be completed and submitted before the countdown clock reaches zero.</li>
              </ul>
            </div>

            {/* Academic Integrity Checkbox */}
            <label className="flex items-start gap-3 p-4 border rounded-xl bg-background cursor-pointer hover:bg-muted/20 transition-colors">
              <input
                type="checkbox"
                checked={hasAgreedIntegrity}
                onChange={(e) => setHasAgreedIntegrity(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs leading-relaxed">
                <strong>Academic Integrity Pledge:</strong> I, <strong>{user.name}</strong> ({user.indexNo || "Candidate"}), affirm on my honor that this examination attempt will be entirely my own work without unauthorized collaboration, plagiarism, or AI generation in compliance with {tenant.shortName} Examination Regulations.
              </span>
            </label>

            <Button
              disabled={!hasAgreedIntegrity}
              onClick={() => {
                const timestamp = Date.now();
                setNow(timestamp);
                setAttempt(previous => previous.startedAt ? previous : { ...EMPTY_ATTEMPT, startedAt: timestamp, expiresAt: timestamp + 3600000 });
              }}
              className="w-full text-sm font-semibold h-11"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              Start Practice Attempt
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Post-submission confirmation screen with audit receipt (FR-055, FR-072)
  if (submitted) {
    return (
      <div className="p-0 md:p-8 max-w-2xl mx-auto space-y-6 text-center">
        <div className="p-8 bg-background border rounded-2xl shadow-xl space-y-4">
          <div className="w-16 h-16 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Practice Attempt Completed</h2>
          <p className="text-xs text-muted-foreground">
            Your practice answers were saved in this browser. This is not an official submission; selected file contents have not been uploaded.
          </p>

          <div className="p-4 bg-muted/40 rounded-xl text-left text-xs font-mono space-y-2 border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Candidate:</span>
              <span className="font-bold">{user.name} ({user.indexNo})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course:</span>
              <span>{course.code}: {course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local Reference:</span>
              <span className="font-bold text-primary">{receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed at:</span>
              <span>{attempt.submittedAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Official Grade:</span>
              <span className="text-green-600 font-bold">Not submitted for grading</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subjective Component (Manual):</span>
              <span className="text-amber-600 font-bold">Local practice only</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button variant="outline" className="w-full text-xs">Return to Course</Button>
            </Link>
            <Link href="/grades" className="flex-1">
              <Button className="w-full text-xs" style={{ backgroundColor: tenant.primaryColor }}>
                View Gradebook
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Hall UI
  const q = questions[currentQIndex];

  return (
    <div className="p-0 md:p-6 max-w-6xl mx-auto space-y-4">
      {/* Top Floating Timer & Status Banner */}
      <div className="bg-background border rounded-xl p-4 shadow-sm flex flex-wrap justify-between items-center gap-4 md:sticky md:top-16 z-20">
        <div>
          <div className="text-xs font-mono font-bold text-primary uppercase">{tenant.shortName} ONLINE EXAMINATION HALL</div>
          <h2 className="text-base font-bold truncate">{course.code}: Practice Examination</h2>
        </div>

        {/* Live Timer Clock (SRS FR-064) */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
            timeLeft < 300 
              ? "bg-red-500/10 text-red-600 border-red-500 animate-pulse" 
              : "bg-muted text-foreground"
          }`}>
            <Clock size={16} />
            <span>Time Remaining: {formatTimer(timeLeft)}</span>
          </div>

          <Button 
            size="sm" 
            onClick={() => handleSubmitExam()}
            className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            <Send size={14} className="mr-1.5" /> Finish Practice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Content Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="min-h-[420px] flex flex-col justify-between">
            <CardHeader className="border-b bg-muted/20 py-3 px-5 flex flex-row items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-primary mr-2">Question {q.id} of {questions.length}</span>
                <span className="text-xs text-muted-foreground font-mono">({q.points} Points)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(q.id)}
                className={`text-xs gap-1.5 h-8 ${flagged[q.id] ? "text-amber-600 bg-amber-500/10" : "text-muted-foreground"}`}
              >
                <Flag size={14} /> {flagged[q.id] ? "Flagged for Review" : "Flag Question"}
              </Button>
            </CardHeader>

            <CardContent className="p-6 flex-1 space-y-6">
              <div className="text-base font-medium leading-relaxed">
                {q.prompt}
              </div>

              {/* MCQ & True/False Options */}
              {(q.type === "mcq" || q.type === "tf") && q.options && (
                <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm cursor-pointer transition-all ${
                        answers[q.id] === opt 
                          ? "bg-primary/10 border-primary font-medium text-primary" 
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        checked={answers[q.id] === opt}
                        onChange={() => handleSelectAnswer(q.id, opt)}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Short Answer Text Box */}
              {q.type === "short" && (
                <div>
                  <textarea
                    rows={5}
                    placeholder="Type your structured academic response here..."
                    value={answers[q.id] || ""}
                    onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                    className="w-full text-sm p-4 border rounded-xl bg-background focus:ring-1 focus:ring-primary outline-hidden"
                  />
                  <div className="text-[11px] text-muted-foreground mt-1 text-right font-mono">
                    Character Count: {(answers[q.id] || "").length}
                  </div>
                </div>
              )}

              {/* Answer Script File Upload (FR-071) */}
              {q.type === "file" && (
                <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-3 bg-muted/10">
                  <UploadCloud size={36} className="mx-auto text-primary opacity-70" />
                  <div>
                    <span className="text-sm font-semibold block">Select an Answer Script</span>
                    <span className="text-xs text-muted-foreground">PDF, PNG or ZIP up to 50 MB. Only the filename is saved locally.</span>
                  </div>
                  {uploadedFileName && <p className="text-sm">Selected locally: {uploadedFileName}</p>}
                  <input type="file" accept=".pdf,.png,.zip" aria-label="Select practice answer file" className="block w-full text-xs" onChange={event => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const error = validateFile(file, [".pdf", ".png", ".zip"]);
                    setFileError(error);
                    if (!error) handleSelectAnswer(q.id, file.name);
                    event.target.value = "";
                  }} />
                  {fileError && <p role="alert" className="text-sm text-red-600">{fileError}</p>}
                </div>
              )}
            </CardContent>

            {/* Bottom Question Navigation Controls */}
            <div className="p-4 border-t bg-muted/10 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="gap-1 text-xs"
              >
                <ChevronLeft size={16} /> Previous
              </Button>

              <span className="text-xs text-muted-foreground font-mono">
                {answeredCount} of {questions.length} Answered
              </span>

              {currentQIndex < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="gap-1 text-xs"
                >
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleSubmitExam()}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1"
                >
                  Finish Attempt <Send size={14} />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {questions.map((item, idx) => {
                  const isAnswered = answers[item.id] !== undefined && answers[item.id] !== "";
                  const isCurrent = currentQIndex === idx;
                  const isFlag = flagged[item.id];

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-lg text-xs font-bold transition-all border relative flex items-center justify-center ${
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 border-primary font-extrabold"
                          : ""
                      } ${
                        isAnswered
                          ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/40"
                          : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {item.id}
                      {isFlag && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-2 border-t space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/40" />
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-muted/40 border" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span>Flagged for Review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 text-xs p-4 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-foreground">
              <HelpCircle size={14} /> Need Help?
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Answers and the deadline are saved in this browser when browser storage is available. File contents are not uploaded, and this practice attempt does not sync with a server.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ExamHallPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading practice examination...</div>}>
      <ExamFromRoute />
    </Suspense>
  );
}

function ExamFromRoute() {
  const params = useParams<{ id: string; examId: string }>();
  const { tenant, user } = useTenant();
  const [courses] = useLocalState<CourseItem[]>(`lms:courses:${tenant.id}:${user.username}`, INITIAL_COURSES);
  const course = findCourse(courses, params.id);
  if (!course || !isSupportedExam(course.id, params.examId)) return <div className="space-y-3 p-6"><h1 className="text-xl font-bold">Examination not found</h1><Link href="/exams">Return to examinations</Link></div>;
  return <ExamHallContent key={`${tenant.id}:${user.username}:${course.id}:${params.examId}`} course={course} />;
}
