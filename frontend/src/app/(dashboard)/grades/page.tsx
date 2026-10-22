"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Download, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  FileText
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function GradesPage() {
  const { tenant, user } = useTenant();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const semesterGrades = [
    {
      code: "ICT 3101",
      title: "Distributed Systems & Cloud Computing Architectures",
      credits: 3,
      continuousMarks: "38 / 40",
      examMarks: "Pending",
      grade: "A (Projected)",
      gpv: 4.0,
      status: "Released"
    },
    {
      code: "ICT 3102",
      title: "Advanced Database Architectures & Optimization",
      credits: 3,
      continuousMarks: "36 / 40",
      examMarks: "Pending",
      grade: "A- (Projected)",
      gpv: 3.7,
      status: "Released"
    },
    {
      code: "ICT 3103",
      title: "Enterprise Application Security & Identity Federation",
      credits: 3,
      continuousMarks: "35 / 40",
      examMarks: "Pending",
      grade: "A- (Projected)",
      gpv: 3.7,
      status: "Released"
    },
    {
      code: "ET 2105",
      title: "Embedded Systems, Industrial IoT & Edge Devices",
      credits: 2,
      continuousMarks: "32 / 40",
      examMarks: "Pending",
      grade: "B+ (Projected)",
      gpv: 3.3,
      status: "Released"
    }
  ];

  const handleDownloadTranscript = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Official Academic Records (SRS §6.9, FR-073 - FR-078)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Gradebook & Academic Transcript Audit
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Student: <strong>{user.name}</strong> ({user.indexNo || "2022/ICT/042"}) • {user.programme}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {downloadSuccess && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={15} /> Transcript PDF Generated!
            </span>
          )}
          <Button 
            onClick={handleDownloadTranscript}
            variant="outline" 
            className="text-xs gap-2"
          >
            <Download size={14} /> Download Unofficial Transcript (FR-078)
          </Button>
        </div>
      </div>

      {/* GPA Banner Card */}
      <div 
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        <div className="space-y-1">
          <div className="text-xs text-white/80 font-mono uppercase tracking-wider">Academic Honors Standing</div>
          <div className="text-4xl font-extrabold">3.82 GPA</div>
          <div className="text-xs text-white/90">Dean's First Class Honors Range (Cumulative)</div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs font-mono border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-white/70 block">Total Credits Earned:</span>
            <strong className="text-lg">68 / 120</strong>
          </div>
          <div>
            <span className="text-white/70 block">Current Academic Standing:</span>
            <strong className="text-lg text-green-300">Level 3 (Good)</strong>
          </div>
        </div>
      </div>

      {/* Current Semester Grade Breakdown (FR-073 to FR-076) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Level 3 — Semester 1 Modules</CardTitle>
          <CardDescription>
            Continuous Assessments (CA) weight 40% • End-Semester Final Examination weight 60%.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y text-xs">
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-2 font-mono">Course Code</div>
              <div className="col-span-4">Course Module</div>
              <div className="col-span-1 text-center">Credits</div>
              <div className="col-span-2 text-center">Continuous (40%)</div>
              <div className="col-span-1 text-center">Exam (60%)</div>
              <div className="col-span-1 text-center">Projected</div>
              <div className="col-span-1 text-right">GPV</div>
            </div>

            {semesterGrades.map((g) => (
              <div key={g.code} className="p-4 grid grid-cols-12 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-2 font-mono font-bold text-primary">{g.code}</div>
                <div className="col-span-4 font-semibold text-foreground pr-4">{g.title}</div>
                <div className="col-span-1 text-center font-mono">{g.credits}</div>
                <div className="col-span-2 text-center font-mono font-bold text-green-600">{g.continuousMarks}</div>
                <div className="col-span-1 text-center font-mono text-muted-foreground">{g.examMarks}</div>
                <div className="col-span-1 text-center font-bold text-foreground">{g.grade.split(" ")[0]}</div>
                <div className="col-span-1 text-right font-mono font-bold">{g.gpv.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
