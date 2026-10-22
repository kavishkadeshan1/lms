"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  Save, 
  Send,
  Sliders,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface Submission {
  id: string;
  studentName: string;
  indexNo: string;
  course: string;
  assignment: string;
  submittedAt: string;
  fileName: string;
  status: "Pending" | "Graded";
  score?: number;
  maxScore: number;
  rubric: {
    architecture: number; // max 30
    codeQuality: number;  // max 30
    tests: number;        // max 20
    documentation: number;// max 20
  };
  feedback?: string;
  isReleased: boolean;
}

export default function LecturerGradingHubPage() {
  const { tenant } = useTenant();

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "sub-1",
      studentName: "Kavishka Sandaruwan",
      indexNo: "2022/ICT/042",
      course: "ICT 3101",
      assignment: "Assignment 1: Distributed Raft Protocol in Go",
      submittedAt: "2026-10-06 22:15:00",
      fileName: "2022_ICT_042_Raft_Go_Project.zip (14.2 MB)",
      status: "Pending",
      maxScore: 100,
      rubric: { architecture: 28, codeQuality: 27, tests: 20, documentation: 18 },
      feedback: "Excellent raft leader election implementation. High test coverage across network split scenarios.",
      isReleased: false
    },
    {
      id: "sub-2",
      studentName: "Nipuni Wickramasinghe",
      indexNo: "2022/BST/018",
      course: "ICT 3101",
      assignment: "Assignment 1: Distributed Raft Protocol in Go",
      submittedAt: "2026-10-06 19:40:00",
      fileName: "2022_BST_018_Raft_Report.pdf (3.8 MB)",
      status: "Graded",
      score: 88,
      maxScore: 100,
      rubric: { architecture: 25, codeQuality: 25, tests: 18, documentation: 20 },
      feedback: "Great report and clear state machine invariants. Need minor improvement on heart-beat timers.",
      isReleased: true
    }
  ]);

  const [selectedSub, setSelectedSub] = useState<Submission>(submissions[0]);
  const [rubricScores, setRubricScores] = useState(selectedSub.rubric);
  const [feedbackText, setFeedbackText] = useState(selectedSub.feedback || "");
  const [releaseToggle, setReleaseToggle] = useState(selectedSub.isReleased);
  const [saveAlert, setSaveAlert] = useState(false);

  const calculatedTotal = 
    rubricScores.architecture + 
    rubricScores.codeQuality + 
    rubricScores.tests + 
    rubricScores.documentation;

  const handleSaveGrade = () => {
    setSubmissions(prev => prev.map(s => {
      if (s.id !== selectedSub.id) return s;
      return {
        ...s,
        status: "Graded",
        score: calculatedTotal,
        rubric: rubricScores,
        feedback: feedbackText,
        isReleased: releaseToggle
      };
    }));
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Instructor Assessment Desk (SRS §10, FR-056, FR-057, FR-058, FR-077)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Grading, Rubric Evaluation & Results Release
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review student code submissions, score against standardized grading rubrics, and publish official grades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Submissions Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Submissions Queue</span>
                <span className="text-xs text-muted-foreground font-mono">ICT 3101</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {submissions.map((sub) => {
                  const isSelected = selectedSub.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSub(sub);
                        setRubricScores(sub.rubric);
                        setFeedbackText(sub.feedback || "");
                        setReleaseToggle(sub.isReleased);
                      }}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-foreground text-sm">{sub.studentName}</div>
                          <div className="text-[11px] font-mono text-muted-foreground">{sub.indexNo}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          sub.status === "Graded" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}>
                          {sub.status === "Graded" ? `${sub.score}/100` : "Needs Review"}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-2 truncate">
                        {sub.assignment}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono mt-2 pt-2 border-t">
                        <span>{sub.fileName}</span>
                        <span>{sub.isReleased ? "Released to Student" : "Draft Score"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Rubric Scoring Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Evaluating: {selectedSub.studentName} ({selectedSub.indexNo})
                </CardTitle>
                <CardDescription className="text-xs">{selectedSub.assignment}</CardDescription>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-primary font-mono">{calculatedTotal}</span>
                <span className="text-xs text-muted-foreground font-mono"> / 100 Pts</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6 text-xs">
              {saveAlert && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={16} /> Marks and qualitative feedback saved successfully!
                </div>
              )}

              {/* Download Submission Archive */}
              <div className="p-3 bg-muted/40 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="text-primary" size={18} />
                  <div>
                    <span className="font-semibold block">{selectedSub.fileName}</span>
                    <span className="text-[10px] text-muted-foreground">Received on {selectedSub.submittedAt}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <Download size={13} /> Download File
                </Button>
              </div>

              {/* Rubric Criteria Sliders (SRS FR-058) */}
              <div className="space-y-4">
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sliders size={15} /> Standardized Rubric Matrix (FR-058)
                </div>

                <div className="space-y-2 p-3 bg-muted/20 rounded-xl border">
                  <div className="flex justify-between font-semibold">
                    <span>1. Distributed Architecture & Decomposition</span>
                    <span className="font-mono text-primary">{rubricScores.architecture} / 30</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={rubricScores.architecture}
                    onChange={(e) => setRubricScores(prev => ({ ...prev, architecture: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2 p-3 bg-muted/20 rounded-xl border">
                  <div className="flex justify-between font-semibold">
                    <span>2. Code Quality, Idiomatic Go & Invariant Safety</span>
                    <span className="font-mono text-primary">{rubricScores.codeQuality} / 30</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={rubricScores.codeQuality}
                    onChange={(e) => setRubricScores(prev => ({ ...prev, codeQuality: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2 p-3 bg-muted/20 rounded-xl border">
                  <div className="flex justify-between font-semibold">
                    <span>3. Unit & Integration Test Coverage</span>
                    <span className="font-mono text-primary">{rubricScores.tests} / 20</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={rubricScores.tests}
                    onChange={(e) => setRubricScores(prev => ({ ...prev, tests: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2 p-3 bg-muted/20 rounded-xl border">
                  <div className="flex justify-between font-semibold">
                    <span>4. Documentation, README & Sequence Diagrams</span>
                    <span className="font-mono text-primary">{rubricScores.documentation} / 20</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={rubricScores.documentation}
                    onChange={(e) => setRubricScores(prev => ({ ...prev, documentation: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Qualitative Lecturer Feedback (FR-057) */}
              <div className="space-y-2">
                <label className="font-bold block text-foreground">Lecturer Written Feedback (FR-057)</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-background focus:ring-1 focus:ring-primary outline-hidden"
                  placeholder="Provide qualitative feedback and constructive suggestions for the candidate..."
                />
              </div>

              {/* Release Grade Toggle (FR-077) */}
              <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={releaseToggle}
                  onChange={(e) => setReleaseToggle(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold block text-foreground">
                    Release Results to Student (SRS FR-077)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    When enabled, marks and rubric breakdown become visible on student transcript.
                  </span>
                </div>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  onClick={handleSaveGrade}
                  className="gap-2 text-xs font-semibold px-5 text-white"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  <Save size={15} /> Save Grade & Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
