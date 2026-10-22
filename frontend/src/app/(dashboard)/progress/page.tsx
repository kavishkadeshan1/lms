"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  FileCheck,
  ShieldCheck,
  Award
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function StudentProgressPage() {
  const { tenant, user } = useTenant();

  const enrolledProgress = [
    {
      code: "ICT 3101",
      title: "Distributed Systems & Cloud Computing Architectures",
      credits: 3,
      lecturer: "Dr. Aruna Pathirana",
      progress: 75,
      completedActivities: 9,
      totalActivities: 12,
      attendance: 92.8,
      status: "On Track",
      riskLevel: "Low"
    },
    {
      code: "ICT 3102",
      title: "Advanced Database Architectures & Optimization",
      credits: 3,
      lecturer: "Dr. K. A. S. Fernando",
      progress: 90,
      completedActivities: 10,
      totalActivities: 11,
      attendance: 95.0,
      status: "Excellent Standing",
      riskLevel: "Low"
    },
    {
      code: "ICT 3103",
      title: "Enterprise Application Security & Identity Federation",
      credits: 3,
      lecturer: "Eng. Chathura Silva",
      progress: 60,
      completedActivities: 6,
      totalActivities: 10,
      attendance: 87.5,
      status: "On Track",
      riskLevel: "Low"
    },
    {
      code: "ET 2105",
      title: "Embedded Systems, Industrial IoT & Edge Devices",
      credits: 2,
      lecturer: "Dr. R. M. Wijesinghe",
      progress: 45,
      completedActivities: 4,
      totalActivities: 9,
      attendance: 82.0,
      status: "Attention Recommended",
      riskLevel: "Medium (Upcoming Lab Task)"
    }
  ];

  const interventions = [
    {
      date: "2026-10-02",
      course: "ET 2105: Embedded Systems",
      advisor: "Dr. R. M. Wijesinghe (Course Coordinator)",
      note: "Student consulted during office hours regarding Arduino RTOS timing issue. Provided extension for preliminary draft.",
      status: "Resolved"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Academic Performance & Retention (SRS §6.13, §14, FR-098 - FR-104)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Student Learning Progress & Risk Indicators
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official progress tracking for <strong>{user.name}</strong> ({user.indexNo || "Level 3"}) across enrolled semester modules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-500/10 text-green-700 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-green-500/20">
            <ShieldCheck size={16} /> Good Academic Standing
          </span>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Semester Completion</span>
            <div className="text-2xl font-bold mt-1 text-primary">68.5%</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">29 of 42 tasks finished</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Overall Attendance</span>
            <div className="text-2xl font-bold mt-1 text-green-600">91.5%</div>
            <div className="text-[11px] text-green-600 font-medium mt-0.5">&gt; 80% Exam threshold met</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Cumulative GPA</span>
            <div className="text-2xl font-bold mt-1 text-foreground">3.82</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Dean's Honor List Tier</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Active Risk Flags (FR-103)</span>
            <div className="text-2xl font-bold mt-1 text-green-600">0 Flags</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">No critical overdue items</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Breakdown (FR-098, FR-101) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrolled Course Progress Breakdown</CardTitle>
          <CardDescription>Based on completed learning resources, lab submissions, and online exams.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {enrolledProgress.map((cp) => (
              <div key={cp.code} className="p-4 rounded-xl border hover:border-primary/40 transition-colors bg-muted/10 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {cp.code}
                      </span>
                      <h4 className="font-bold text-sm text-foreground">{cp.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Lecturer: {cp.lecturer} • {cp.credits} Credits
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground">Attendance: </span>
                      <strong className={cp.attendance >= 80 ? "text-green-600" : "text-red-600"}>
                        {cp.attendance}%
                      </strong>
                    </div>
                    <span className="font-bold text-foreground">{cp.progress}% Complete</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cp.progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                  <span>{cp.completedActivities} of {cp.totalActivities} learning activities checked</span>
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    cp.riskLevel === "Low" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  }`}>
                    {cp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Advisory & Intervention Notes (SRS FR-104) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Advisory & Support Notes (FR-104)</CardTitle>
          <CardDescription>
            Recorded by authorized academic mentors and course lecturers to support student retention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl divide-y text-xs">
            {interventions.map((inv, idx) => (
              <div key={idx} className="p-4 space-y-1.5">
                <div className="flex justify-between items-center text-muted-foreground font-mono">
                  <span>{inv.date} • {inv.course}</span>
                  <span className="text-green-600 font-bold bg-green-500/10 px-2 py-0.5 rounded">{inv.status}</span>
                </div>
                <div className="font-semibold text-foreground">Advisor: {inv.advisor}</div>
                <p className="text-muted-foreground leading-relaxed">{inv.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
