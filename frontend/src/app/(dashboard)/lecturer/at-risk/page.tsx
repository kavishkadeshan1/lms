"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  UserCheck, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Send,
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface AtRiskStudent {
  id: string;
  name: string;
  indexNo: string;
  course: string;
  attendancePercent: number;
  missedTasks: number;
  riskFactor: string;
  notes: { date: string; note: string; author: string }[];
}

export default function LecturerAtRiskStudentsPage() {
  const { tenant } = useTenant();

  const [students, setStudents] = useState<AtRiskStudent[]>([
    {
      id: "ars-1",
      name: "Kasun Jayawardena",
      indexNo: "2021/ET/005",
      course: "ICT 3101",
      attendancePercent: 78.5,
      missedTasks: 2,
      riskFactor: "Attendance < 80% (Exam Admittance Risk) & Missed Lab 2",
      notes: [
        { date: "2026-10-02", note: "Sent warning email regarding 78% attendance threshold.", author: "Dr. Aruna Pathirana" }
      ]
    },
    {
      id: "ars-2",
      name: "Chamodi Fonseka",
      indexNo: "2022/ICT/019",
      course: "ICT 3101",
      attendancePercent: 82.0,
      missedTasks: 1,
      riskFactor: "Missed Raft Preliminary submission",
      notes: []
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<AtRiskStudent>(students[0]);
  const [newNote, setNewNote] = useState("");
  const [noteSuccess, setNoteSuccess] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const entry = {
      date: new Date().toISOString().split("T")[0],
      note: newNote,
      author: "Dr. Aruna Pathirana (Course Lecturer)"
    };
    setStudents(prev => prev.map(s => {
      if (s.id !== selectedStudent.id) return s;
      return { ...s, notes: [entry, ...s.notes] };
    }));
    setSelectedStudent(prev => ({ ...prev, notes: [entry, ...prev.notes] }));
    setNewNote("");
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Early Academic Intervention & Retention (SRS §6.13, §14, FR-103, FR-104)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            At-Risk Students & Academic Mentoring Notes
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Detect students vulnerable to examination disqualification or academic probation, and record advisory actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: At-Risk Students List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle size={16} /> Flagged Students (ICT 3101)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {students.map((st) => {
                  const isSelected = selectedStudent.id === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudent(st)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? "bg-amber-500/10 border-l-4 border-amber-500" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-foreground text-sm">{st.name}</div>
                          <div className="text-[11px] font-mono text-muted-foreground">{st.indexNo}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-mono">
                          {st.attendancePercent}% Attendance
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-2 font-medium">
                        {st.riskFactor}
                      </p>
                      <div className="text-[10px] text-muted-foreground mt-2 font-mono">
                        {st.notes.length} Recorded Support Notes
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Intervention Notes & Action Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-base font-bold">
                Student Case: {selectedStudent.name} ({selectedStudent.indexNo})
              </CardTitle>
              <CardDescription className="text-xs">
                Attendance Standing: <strong>{selectedStudent.attendancePercent}%</strong> • Missed Tasks: <strong>{selectedStudent.missedTasks}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6 text-xs">
              {noteSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={16} /> Support note recorded in student academic profile!
                </div>
              )}

              {/* Add Note Box */}
              <div className="space-y-2">
                <label className="font-bold block text-foreground">Log Academic Intervention Action (FR-104)</label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record details of student counseling, makeup assignment arrangement, or medical certificate verification..."
                  className="w-full text-xs p-3 border rounded-xl bg-background focus:ring-1 focus:ring-primary outline-hidden"
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="gap-2 text-xs text-white"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    <Send size={13} /> Save Support Note
                  </Button>
                </div>
              </div>

              {/* Historic Notes List */}
              <div className="space-y-3">
                <div className="font-bold text-sm text-foreground">Recorded Academic Support History</div>
                {selectedStudent.notes.length === 0 ? (
                  <p className="text-muted-foreground italic">No prior notes recorded for this student.</p>
                ) : (
                  <div className="border rounded-xl divide-y">
                    {selectedStudent.notes.map((n, i) => (
                      <div key={i} className="p-4 space-y-1">
                        <div className="flex justify-between items-center text-muted-foreground font-mono text-[10px]">
                          <span>{n.date}</span>
                          <span className="font-semibold text-primary">{n.author}</span>
                        </div>
                        <p className="text-foreground leading-relaxed">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
