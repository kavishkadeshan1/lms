"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileQuestion, 
  Plus, 
  Clock, 
  ShieldAlert, 
  Shuffle, 
  CheckCircle2, 
  Save, 
  Calendar,
  Layers,
  UploadCloud,
  HelpCircle
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function LecturerAssessmentsCreatorPage() {
  const { tenant } = useTenant();

  const [assessmentTitle, setAssessmentTitle] = useState("Mid-Semester Examination: Distributed Systems (ICT 3101)");
  const [assessmentType, setAssessmentType] = useState("exam");
  const [durationMins, setDurationMins] = useState(60);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [requireIntegrityPledge, setRequireIntegrityPledge] = useState(true);
  const [allowAnswerScriptUpload, setAllowAnswerScriptUpload] = useState(true);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Assessment & Examination Engine (SRS §6.8, §13, FR-060 - FR-072)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Online Examination & Quiz Configuration Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create online assessments with strict server-side timers, proctoring declarations, and answer script upload workflows.
          </p>
        </div>
      </div>

      {successSaved && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Examination configured and published to student examination calendar!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Basic Assessment Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold block">Assessment Title</label>
                <Input
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold block">Assessment Type (FR-060)</label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-background font-medium focus:outline-hidden text-xs"
                >
                  <option value="exam">Formal Online Examination</option>
                  <option value="quiz">Continuous Assessment Quiz</option>
                  <option value="lab">Lab Practical Test</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold block">Time Limit (Minutes) (FR-064)</label>
                <Input
                  type="number"
                  min={5}
                  max={240}
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value))}
                  className="text-xs h-9 font-mono"
                />
                <span className="text-[10px] text-muted-foreground">Auto-submits when clock expires (FR-066).</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold block">Attempts Allowed (FR-065)</label>
                <select
                  value={attemptsAllowed}
                  onChange={(e) => setAttemptsAllowed(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 bg-background font-medium focus:outline-hidden text-xs"
                >
                  <option value={1}>1 Attempt (Strict Examination)</option>
                  <option value={2}>2 Attempts (Best Score)</option>
                  <option value={3}>3 Attempts (Average)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold block">Target Course Module</label>
                <select className="w-full border rounded-lg px-3 py-2 bg-background font-medium focus:outline-hidden text-xs">
                  <option>ICT 3101: Distributed Systems</option>
                  <option>ICT 3102: Database Architectures</option>
                  <option>ET 2105: Embedded Systems & IoT</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Integrity Controls (SRS FR-063, FR-070, FR-071) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Anti-Cheat & Examination Integrity Policies (SRS §13)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <label className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={requireIntegrityPledge}
                onChange={(e) => setRequireIntegrityPledge(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold block text-foreground">
                  Enforce Academic Integrity Declaration (FR-070)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Students must explicitly check and sign anti-cheating pledge before starting attempt.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold block text-foreground flex items-center gap-1.5">
                  <Shuffle size={13} className="text-primary" /> Randomize Question Sequence & Options (FR-063)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Shuffles item order and multiple choice distractors for every student session.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={allowAnswerScriptUpload}
                onChange={(e) => setAllowAnswerScriptUpload(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold block text-foreground flex items-center gap-1.5">
                  <UploadCloud size={13} className="text-primary" /> Allow Structured Answer Script PDF Upload (FR-071)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Permits student submission of written mathematical derivations or architectural drawings via single PDF upload.
                </span>
              </div>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button 
            type="submit" 
            className="text-xs font-semibold gap-2 h-10 px-6 text-white"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            <Save size={15} /> Publish Assessment to Course
          </Button>
        </div>
      </form>
    </div>
  );
}
