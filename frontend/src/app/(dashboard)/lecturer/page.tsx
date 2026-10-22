"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Users, 
  Edit3, 
  PlusCircle, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Star,
  Activity,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function LecturerDashboardPage() {
  const { tenant, user } = useTenant();

  const teachingCourses = [
    {
      id: "ict-3101",
      code: "ICT 3101",
      title: "Distributed Systems & Cloud Computing Architectures",
      students: 145,
      pendingGrades: 14,
      avgAttendance: 92.8,
      status: "Midterm Exam Active"
    },
    {
      id: "ict-3102",
      code: "ICT 3102",
      title: "Advanced Database Architectures & Optimization",
      students: 130,
      pendingGrades: 0,
      avgAttendance: 95.0,
      status: "On Schedule"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            {tenant.shortName} Academic Faculty Workspace (SRS §10)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Instructor Teaching & Assessment Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Welcome, <strong>{user.name}</strong> • {tenant.facultyName} (Semester 1 — 2026).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lecturer/assessments">
            <Button className="gap-2 text-xs text-white" style={{ backgroundColor: tenant.primaryColor }}>
              <PlusCircle size={15} /> Create Assessment / Exam
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
              <div className="text-2xl font-bold mt-1 text-foreground">2 Modules</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">275 Total Students</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Pending Review</span>
              <div className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-400">14 Submissions</div>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">Assignment 1 (Raft Go)</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <CheckSquare size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Average Attendance</span>
              <div className="text-2xl font-bold mt-1 text-green-600">93.9%</div>
              <div className="text-[11px] text-green-600 font-medium mt-0.5">High Student Engagement</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Student Rating</span>
              <div className="text-2xl font-bold mt-1 text-foreground">4.8 / 5.0</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">42 Anonymous Reviews</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Star size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/lecturer/grading" className="block">
          <Button variant="outline" className="w-full h-14 justify-start text-xs font-medium gap-3 hover:border-primary">
            <CheckSquare className="text-primary" size={18} />
            <div className="text-left">
              <div className="font-bold">Grading Hub</div>
              <div className="text-[10px] text-muted-foreground">Score with Rubrics</div>
            </div>
          </Button>
        </Link>

        <Link href="/lecturer/attendance" className="block">
          <Button variant="outline" className="w-full h-14 justify-start text-xs font-medium gap-3 hover:border-primary">
            <Clock className="text-primary" size={18} />
            <div className="text-left">
              <div className="font-bold">Mark Attendance</div>
              <div className="text-[10px] text-muted-foreground">Lecture Session Log</div>
            </div>
          </Button>
        </Link>

        <Link href="/lecturer/at-risk" className="block">
          <Button variant="outline" className="w-full h-14 justify-start text-xs font-medium gap-3 hover:border-primary">
            <AlertTriangle className="text-amber-500" size={18} />
            <div className="text-left">
              <div className="font-bold">At-Risk Students</div>
              <div className="text-[10px] text-muted-foreground">Academic Interventions</div>
            </div>
          </Button>
        </Link>

        <Link href="/lecturer/reviews" className="block">
          <Button variant="outline" className="w-full h-14 justify-start text-xs font-medium gap-3 hover:border-primary">
            <Star className="text-amber-400" size={18} />
            <div className="text-left">
              <div className="font-bold">Feedback Analytics</div>
              <div className="text-[10px] text-muted-foreground">Student Evaluations</div>
            </div>
          </Button>
        </Link>
      </div>

      {/* Teaching Courses */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Active Teaching Modules</h2>
        <div className="grid gap-4">
          {teachingCourses.map((c) => (
            <Card key={c.id} className="border hover:border-primary/40 transition-colors shadow-xs">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{c.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono pt-1">
                    <span className="flex items-center gap-1.5"><Users size={13} /> {c.students} Enrolled Students</span>
                    <span className="flex items-center gap-1.5 text-amber-600 font-bold"><CheckSquare size={13} /> {c.pendingGrades} to Grade</span>
                    <span className="flex items-center gap-1.5 text-green-600"><Clock size={13} /> {c.avgAttendance}% Attendance</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/courses/${c.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Course Content
                    </Button>
                  </Link>
                  <Link href="/lecturer/grading">
                    <Button size="sm" className="text-xs gap-1.5 text-white" style={{ backgroundColor: tenant.primaryColor }}>
                      <CheckSquare size={14} /> Open Grading Desk
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
