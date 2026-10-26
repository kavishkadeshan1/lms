"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShieldAlert, CheckCircle2, FileQuestion, Calendar, AlertCircle } from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function ExamsHubPage() {
  const { tenant } = useTenant();

  const exams = [
    {
      id: "exam-midterm",
      courseCode: "IC 3101",
      courseTitle: "Advanced Web Application Architectures",
      title: "Distributed Systems Practice Examination",
      status: "Practice available",
      window: "Sample examination · available for practice",
      duration: "60 Minutes",
      weight: "Practice only · no official grade",
      link: "/courses/ic-3101/exams/exam-midterm",
      isReady: true,
      badgeColor: "bg-red-500 text-white animate-pulse"
    },
    {
      id: "quiz-2",
      courseCode: "IC 3102",
      courseTitle: "Distributed Database Systems & Cloud Sharding",
      title: "Quiz 2: B-Tree Indexing & Query Optimization",
      status: "Sample schedule",
      window: "Oct 18, 2026 (10:00 AM - 12:00 PM)",
      duration: "30 Minutes",
      weight: "10% of Continuous Assessment",
      link: "#",
      isReady: false,
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400"
    },
    {
      id: "quiz-1",
      courseCode: "IC 3101",
      courseTitle: "Advanced Web Application Architectures",
      title: "Quiz 1: Distributed Foundations Knowledge Check",
      status: "Completed",
      window: "Completed on Sep 30, 2026",
      duration: "15 Minutes",
      weight: "Score: 10/10 (100%)",
      link: "#",
      isReady: false,
      badgeColor: "bg-green-500/10 text-green-700 dark:text-green-400"
    }
  ];

  return (
    <div className="p-0 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            {tenant.shortName} Assessment & Examination Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Online Examinations & Quizzes (SRS §13)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Explore a timed practice exam. Answers are saved in this browser; official submissions and grades require your university service.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-muted-foreground block">Exam Hall Eligibility:</span>
            <span className="text-green-600 font-bold">Sample attendance: 91.5%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {exams.map((ex) => (
          <Card key={ex.id} className="border shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${ex.badgeColor}`}>
                    {ex.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-primary">{ex.courseCode}</span>
                  <span className="text-xs text-muted-foreground">• {ex.courseTitle}</span>
                </div>
                <h3 className="text-base font-bold text-foreground">{ex.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {ex.window}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {ex.duration}</span>
                  <span className="text-foreground font-medium">{ex.weight}</span>
                </div>
              </div>

              <div>
                {ex.isReady ? (
                  <Link href={ex.link}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 font-semibold text-xs h-10 px-5 shadow-sm">
                      <Clock size={15} /> Open Practice Exam
                    </Button>
                  </Link>
                ) : ex.status === "Completed" ? (
                  <div className="text-right">
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1 justify-end">
                      <CheckCircle2 size={14} /> Sample result
                    </span>
                    <span className="text-[11px] text-muted-foreground">Demo record</span>
                  </div>
                ) : (
                  <Button variant="outline" disabled className="text-xs">
                    No practice questions available
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
