"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  Download, 
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function StudentAttendancePage() {
  const { tenant, user } = useTenant();

  const coursesAttendance = [
    { code: "ICT 3101", title: "Distributed Systems & Cloud Computing", total: 14, attended: 13, late: 1, percent: 92.8, status: "Eligible" },
    { code: "ICT 3102", title: "Advanced Database Architectures", total: 12, attended: 12, late: 0, percent: 100.0, status: "Eligible" },
    { code: "ICT 3103", title: "Enterprise Application Security", total: 12, attended: 10, late: 1, percent: 83.3, status: "Eligible" },
    { code: "ET 2105", title: "Embedded Systems & Industrial IoT", total: 10, attended: 8, late: 0, percent: 80.0, status: "Threshold Warning (80% Cutoff)" }
  ];

  const recentSessions = [
    { date: "Oct 05, 2026", course: "ICT 3101", slot: "08:30 AM - 11:30 AM", topic: "Lec 5: Multi-Tenant Architecture", status: "Present", badge: "bg-green-500/10 text-green-700 dark:text-green-400" },
    { date: "Oct 04, 2026", course: "ICT 3102", slot: "01:00 PM - 04:00 PM", topic: "Lec 4: B-Tree Index Mechanics", status: "Present", badge: "bg-green-500/10 text-green-700 dark:text-green-400" },
    { date: "Oct 03, 2026", course: "ET 2105", slot: "09:00 AM - 12:00 PM", topic: "Lab 3: FreeRTOS Task Scheduling", status: "Absent", badge: "bg-red-500/10 text-red-700 dark:text-red-400" },
    { date: "Sep 28, 2026", course: "ICT 3101", slot: "08:30 AM - 11:30 AM", topic: "Lec 4: Raft Consensus Protocols", status: "Present", badge: "bg-green-500/10 text-green-700 dark:text-green-400" },
    { date: "Sep 25, 2026", course: "ICT 3103", slot: "10:00 AM - 01:00 PM", topic: "Lec 3: OAuth2 & JWT Security", status: "Late", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { date: "Sep 18, 2026", course: "ET 2105", slot: "09:00 AM - 12:00 PM", topic: "Lab 2: Microcontroller GPIO", status: "Excused", badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400" }
  ];

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Attendance Ledger & Eligibility (SRS §6.10, FR-079 - FR-083)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Student Course Attendance & Examination Eligibility
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official verified attendance records for <strong>{user.name}</strong> ({user.indexNo}). Minimum 80% attendance required for final examination admittance.
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          <Download size={14} /> Download Attendance Slip (FR-083)
        </Button>
      </div>

      {/* Course Attendance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coursesAttendance.map((ca) => (
          <Card key={ca.code} className="border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <span className="font-mono text-xs font-bold text-primary">{ca.code}</span>
              <CardTitle className="text-sm font-semibold truncate">{ca.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex justify-between items-end mt-2">
                <span className="text-3xl font-extrabold text-foreground">{ca.percent}%</span>
                <span className="text-xs text-muted-foreground font-mono">{ca.attended}/{ca.total} Sessions</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${ca.percent >= 80 ? "bg-green-600" : "bg-red-500"}`}
                  style={{ width: `${ca.percent}%` }}
                />
              </div>
              <div className="text-[11px] font-medium flex items-center justify-between">
                <span className={ca.percent >= 80 ? "text-green-600" : "text-red-600"}>
                  {ca.status}
                </span>
                {ca.late > 0 && <span className="text-muted-foreground">({ca.late} Late)</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 80% Rule Academic Policy Alert (FR-082) */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300">
        <ShieldAlert size={20} className="flex-shrink-0" />
        <div>
          <strong className="block font-semibold">Faculty of Technology Examination Admittance Bylaw:</strong>
          <span>
            Students with attendance falling below 80% in any course will be barred from sitting the end-semester final examination and assigned an incomplete grade unless certified medical certificates are approved by the Faculty Board.
          </span>
        </div>
      </div>

      {/* Detailed Session History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session-by-Session Attendance Log (FR-080)</CardTitle>
          <CardDescription>Records marked by course instructors during lecture hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid border rounded-xl divide-y text-xs" role="region" aria-label="Scrollable records" tabIndex={0}>
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Course Code</div>
              <div className="col-span-3">Time Slot</div>
              <div className="col-span-3">Lecture / Lab Topic</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {recentSessions.map((s, idx) => (
              <div key={idx} className="p-3.5 grid grid-cols-12 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-2 font-mono text-muted-foreground">{s.date}</div>
                <div className="col-span-2 font-mono font-bold text-primary">{s.course}</div>
                <div className="col-span-3 text-muted-foreground">{s.slot}</div>
                <div className="col-span-3 font-medium text-foreground truncate">{s.topic}</div>
                <div className="col-span-2 text-right">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${s.badge}`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
