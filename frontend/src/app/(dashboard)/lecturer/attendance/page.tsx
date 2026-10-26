"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Save, 
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { downloadFile, toCsv } from "@/lib/download";
import { calendarDateKey } from "@/lib/calendar-dates";

interface StudentRosterItem {
  id: string;
  name: string;
  indexNo: string;
  status: "P" | "A" | "L" | "E";
  overallPercent: number;
}

export default function LecturerAttendanceSessionPage() {
  const { tenant } = useTenant();

  const [sessionTopic, setSessionTopic] = useState("Lec 6: Microservices Circuit Breaker & Service Mesh");
  const [sessionDate, setSessionDate] = useState(() => calendarDateKey(new Date()));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: "s-1", name: "Kavishka Sandaruwan", indexNo: "2022/ICT/042", status: "P", overallPercent: 92.8 },
    { id: "s-2", name: "Nipuni Wickramasinghe", indexNo: "2022/BST/018", status: "P", overallPercent: 95.0 },
    { id: "s-3", name: "Kasun Jayawardena", indexNo: "2021/ET/005", status: "A", overallPercent: 78.5 },
    { id: "s-4", name: "Dilshan Rathnayake", indexNo: "2022/ICT/011", status: "P", overallPercent: 88.0 },
    { id: "s-5", name: "Chamodi Fonseka", indexNo: "2022/ICT/019", status: "L", overallPercent: 82.0 },
    { id: "s-6", name: "Hasitha Senarath", indexNo: "2022/ICT/034", status: "P", overallPercent: 91.0 }
  ]);

  const updateStatus = (id: string, newStatus: "P" | "A" | "L" | "E") => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status: "P" | "A") => {
    setRoster(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = () => {
    downloadFile("sample-attendance.csv", "\uFEFF" + toCsv([
      ["Sample attendance — not an official academic record"],
      ["Session date", sessionDate, "Topic", sessionTopic],
      ["Name", "Index number", "Status"],
      ...roster.map(student => [student.name, student.indexNo, student.status]),
    ]), "text/csv;charset=utf-8");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const presentCount = roster.filter(s => s.status === "P").length;
  const lateCount = roster.filter(s => s.status === "L").length;
  const absentCount = roster.filter(s => s.status === "A").length;
  const excusedCount = roster.filter(s => s.status === "E").length;

  return (
    <div className="p-0 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Instructor Attendance Roster (SRS §6.10, FR-079 - FR-083)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Class Attendance Session Recording
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Course: <strong>ICT 3101: Distributed Systems</strong> • Department of ICT
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={16} /> Sample attendance CSV downloaded
            </span>
          )}
          <Button 
            onClick={handleSave} 
            className="text-xs gap-2 text-white font-semibold"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            <Save size={15} /> Export session CSV
          </Button>
        </div>
      </div>

      {/* Session Metadata Controls */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-muted-foreground font-medium block mb-1">Session Date</label>
            <Input 
              type="date" 
              value={sessionDate} 
              onChange={(e) => setSessionDate(e.target.value)}
              className="text-xs h-9 font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-muted-foreground font-medium block mb-1">Lecture Topic / Learning Focus</label>
            <Input 
              value={sessionTopic} 
              onChange={(e) => setSessionTopic(e.target.value)}
              className="text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roster Table with Bulk Actions */}
      <Card>
        <CardHeader className="py-4 px-4 sm:px-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-foreground">Enrolled Students ({roster.length})</span>
            <span className="text-muted-foreground">• Present: {presentCount} • Late: {lateCount} • Absent: {absentCount} • Excused: {excusedCount}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => markAll("P")} className="text-xs h-7">
              Mark All Present
            </Button>
            <Button size="sm" variant="ghost" onClick={() => markAll("A")} className="text-xs h-7 text-muted-foreground">
              Mark All Absent
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid divide-y text-xs" role="region" aria-label="Scrollable records" tabIndex={0}>
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-5">Student Identity</div>
              <div className="col-span-3 text-center">Cumulative Attendance</div>
              <div className="col-span-4 text-right">Session Attendance Marking</div>
            </div>

            {roster.map((student) => {
              const isBelowCutoff = student.overallPercent < 80;
              return (
                <div key={student.id} className="p-3.5 grid grid-cols-12 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {student.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">{student.name}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{student.indexNo}</span>
                    </div>
                  </div>

                  <div className="col-span-3 text-center font-mono">
                    <span className={`font-bold ${isBelowCutoff ? "text-red-600" : "text-green-600"}`}>
                      {student.overallPercent}%
                    </span>
                    {isBelowCutoff && (
                      <span className="text-[10px] text-red-600 block">&lt;80% Risk Flag (FR-082)</span>
                    )}
                  </div>

                  {/* Attendance status radio pills: Present, Absent, Late, Excused */}
                  <div className="col-span-4 flex justify-end gap-1.5">
                    {([
                      { code: "P", label: "Present", color: "bg-green-600 text-white" },
                      { code: "L", label: "Late", color: "bg-amber-600 text-white" },
                      { code: "A", label: "Absent", color: "bg-red-600 text-white" },
                      { code: "E", label: "Excused", color: "bg-blue-600 text-white" }
                    ] as const).map((opt) => {
                      const isSelected = student.status === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => updateStatus(student.id, opt.code)}
                          aria-label={`${opt.label}: ${student.name}`}
                          aria-pressed={isSelected}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                            isSelected 
                              ? `${opt.color} shadow-xs border-transparent` 
                              : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {opt.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
