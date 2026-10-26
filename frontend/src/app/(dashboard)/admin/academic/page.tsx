"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderTree, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Layers, 
  Plus, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  MoreVertical,
  X
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { useLocalState } from "@/lib/use-local-state";

export default function AcademicStructurePage() {
  const { tenant, user } = useTenant();

  // Mock academic structure modeled on University of Colombo Faculty of Technology
  const [departments, setDepartments] = useLocalState(`lms:departments:${tenant.id}:${user.username}`, [
    {
      id: "dict",
      code: "DICT",
      name: "Department of Information & Communication Technology",
      head: "Prof. K. A. S. Fernando",
      programmes: ["Bachelor of Information & Communication Technology (BICT Hons)"],
      studentCount: 380,
      courseCount: 32
    },
    {
      id: "dbst",
      code: "DBST",
      name: "Department of Biosystems Technology",
      head: "Dr. S. M. Senanayake",
      programmes: ["Bachelor of Biosystems Technology (BBST Hons)"],
      studentCount: 310,
      courseCount: 28
    },
    {
      id: "det",
      code: "DET",
      name: "Department of Engineering Technology",
      head: "Dr. R. M. Wijesinghe",
      programmes: ["Bachelor of Engineering Technology (BET Hons)"],
      studentCount: 350,
      courseCount: 30
    },
    {
      id: "diat",
      code: "DIAT",
      name: "Department of Instrumentation & Automation Technology",
      head: "Dr. P. L. Perera",
      programmes: ["Bachelor of Technology in Instrumentation & Automation (BTech IAT)"],
      studentCount: 220,
      courseCount: 22
    }
  ]);

  const [semesters, setSemesters] = useLocalState(`lms:semesters:${tenant.id}:${user.username}`, [
    { id: "2026-s1", name: "2025/2026 Academic Year — Semester 1", startDate: "2026-06-01", endDate: "2026-11-30", status: "Active (Teaching & Midterms)" },
    { id: "2026-s2", name: "2025/2026 Academic Year — Semester 2", startDate: "2026-12-15", endDate: "2027-04-30", status: "Upcoming Planning" },
    { id: "2025-s2", name: "2024/2025 Academic Year — Semester 2", startDate: "2025-12-01", endDate: "2026-05-15", status: "Archived / Results Published" }
  ]);

  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [showAddDept, setShowAddDept] = useState(false);

  // Add Semester State (SRS FR-028, FR-029)
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [newSemName, setNewSemName] = useState("");
  const [newSemStart, setNewSemStart] = useState("2026-11-01");
  const [newSemEnd, setNewSemEnd] = useState("2027-04-30");
  const [newSemStatus, setNewSemStatus] = useState("Upcoming Planning");
  const [departmentError, setDepartmentError] = useState("");
  const [semesterError, setSemesterError] = useState("");

  const handleAddDept = () => {
    const name = newDeptName.trim();
    const code = newDeptCode.trim().toUpperCase();
    if (!name || !/^[A-Z0-9-]+$/.test(code)) {
      setDepartmentError("Enter a department name and a code containing letters, numbers, or hyphens.");
      return;
    }
    if (departments.some(department => department.code === code)) {
      setDepartmentError("This department code already exists.");
      return;
    }
    setDepartments(prev => [
      ...prev,
      {
        id: code.toLowerCase(),
        code,
        name,
        head: "Appointed Department Head",
        programmes: [`Bachelor of Technology (${newDeptCode})`],
        studentCount: 0,
        courseCount: 0
      }
    ]);
    setNewDeptName("");
    setDepartmentError("");
    setNewDeptCode("");
    setShowAddDept(false);
  };

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemName.trim() || !newSemStart || !newSemEnd || newSemEnd < newSemStart) {
      setSemesterError("Enter a semester name and an end date on or after the start date.");
      return;
    }
    setSemesters(prev => [
      ...prev,
      {
        id: `sem-${Date.now()}`,
        name: newSemName.trim(),
        startDate: newSemStart,
        endDate: newSemEnd,
        status: newSemStatus
      }
    ]);
    setShowAddSemesterModal(false);
    setSemesterError("");
    setNewSemName("");
  };

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Institutional Hierarchy (SRS §6.4, FR-025 - FR-033)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Academic Structure & Faculty Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage faculties, academic departments, degree programmes, semesters, and course categories for {tenant.name}.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDept(!showAddDept)}
          className="gap-2 text-xs text-white"
          style={{ backgroundColor: tenant.primaryColor }}
        >
          <Plus size={15} /> Add Academic Unit
        </Button>
      </div>

      {/* Add Department Inline Form */}
      {showAddDept && (
        <Card className="border-2 border-primary/20 bg-primary/5 animate-in slide-in-from-top-3">
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-bold">Create New Academic Department (FR-026)</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Department Code</label>
                <Input 
                  placeholder="e.g. DMMT"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium block mb-1">Full Department Name</label>
                <Input 
                  placeholder="e.g. Department of Multidisciplinary Technology"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>
            {departmentError && <p role="alert" className="text-xs text-red-600">{departmentError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddDept(false)} className="text-xs">Cancel</Button>
              <Button size="sm" onClick={handleAddDept} className="text-xs">Save Department</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Hierarchy Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <Building2 size={20} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Faculties</div>
              <div className="text-xl font-bold">1 Primary ({tenant.facultyName})</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <FolderTree size={20} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Departments</div>
              <div className="text-xl font-bold">{departments.length} Units</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Degree Programmes</div>
              <div className="text-xl font-bold">4 Honors Degrees</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active Courses</div>
              <div className="text-xl font-bold">112 Modules</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="bg-background border p-1 rounded-xl h-auto">
          <TabsTrigger value="departments" className="text-xs px-4 py-2 gap-2">
            <FolderTree size={14} /> Departments & Programmes (FR-026, FR-027)
          </TabsTrigger>
          <TabsTrigger value="semesters" className="text-xs px-4 py-2 gap-2">
            <Calendar size={14} /> Academic Years & Semesters (FR-028, FR-029)
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs px-4 py-2 gap-2">
            <Layers size={14} /> Course Categories (FR-030)
          </TabsTrigger>
        </TabsList>

        {/* 1. Departments Tab */}
        <TabsContent value="departments" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="border shadow-xs hover:border-primary/40 transition-colors">
                <CardHeader className="py-4 px-6 border-b bg-muted/20 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                      {dept.code}
                    </span>
                    <CardTitle className="text-base font-bold">{dept.name}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">Head: {dept.head}</span>
                </CardHeader>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-medium">Offered Degree Programmes:</div>
                    <div className="space-y-1">
                      {dept.programmes.map((prog, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <CheckCircle2 size={13} className="text-green-600" />
                          <span>{prog}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
                    <div className="text-center">
                      <div className="text-base font-bold text-foreground">{dept.studentCount}</div>
                      <div>Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-foreground">{dept.courseCount}</div>
                      <div>Courses</div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage Courses →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 2. Semesters Tab */}
        <TabsContent value="semesters" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Configured Academic Periods (FR-028, FR-029)</CardTitle>
                <CardDescription>Defines enrolment windows, teaching terms, and examination deadlines.</CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={() => setShowAddSemesterModal(true)} 
                className="text-xs gap-1.5 text-white" 
                style={{ backgroundColor: tenant.primaryColor }}
              >
                <Plus size={13} /> Add Semester Period
              </Button>
            </CardHeader>
            <CardContent>
              <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid border rounded-xl divide-y text-xs" role="region" aria-label="Scrollable records" tabIndex={0}>
            <div className="p-3.5 grid grid-cols-4 font-bold bg-muted/30">
                  <div>Academic Period</div>
                  <div>Start Date</div>
                  <div>End Date</div>
                  <div>Status</div>
                </div>
                {semesters.map((s) => (
                  <div key={s.id} className="p-3.5 grid grid-cols-4 items-center">
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="font-mono text-muted-foreground">{s.startDate}</div>
                    <div className="font-mono text-muted-foreground">{s.endDate}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                        s.status.includes("Active") 
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : s.status.includes("Upcoming")
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Course Categories Tab */}
        <TabsContent value="categories" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hierarchical Course Categories (FR-030)</CardTitle>
              <CardDescription>Taxonomy structure used for course catalogue filtering and degree auditing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 border rounded-lg bg-muted/10 font-mono">
                <div className="font-bold text-primary">📁 Faculty of Technology</div>
                <div className="pl-4 mt-1 space-y-1 text-muted-foreground">
                  <div>├── 📁 Foundation & General Courses (EN, MA, MS)</div>
                  <div>├── 📁 Department of ICT (Core Computing, Distributed Systems, Software Eng)</div>
                  <div>├── 📁 Department of Biosystems (Bioprocess, Food Technology, Agrotechnology)</div>
                  <div>└── 📁 Department of Engineering Tech (Robotics, Electrical Machines, Materials)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal: Add Semester / Term Period (SRS FR-028, FR-029) */}
      {showAddSemesterModal && (
        <div className="lms-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full animate-in zoom-in-95">
            <CardHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Add Academic Period (FR-029)
                </CardTitle>
                <button 
                  type="button" 
                  onClick={() => setShowAddSemesterModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <CardDescription className="text-xs">
                Configure a new semester or term for teaching, enrolment, and examinations.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-xs">
              <form onSubmit={handleAddSemester} className="space-y-3.5">
                {semesterError && <p role="alert" className="text-red-600">{semesterError}</p>}
                <div className="space-y-1">
                  <label className="font-semibold block">Academic Period Name</label>
                  <Input
                    required
                    placeholder="e.g. 2026/2027 Academic Year — Semester 1"
                    value={newSemName}
                    onChange={(e) => setNewSemName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Start Date</label>
                    <Input
                      type="date"
                      required
                      value={newSemStart}
                      onChange={(e) => setNewSemStart(e.target.value)}
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">End Date</label>
                    <Input
                      type="date"
                      required
                      value={newSemEnd}
                      min={newSemStart}
                      onChange={(e) => setNewSemEnd(e.target.value)}
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Status</label>
                  <select
                    value={newSemStatus}
                    onChange={(e) => setNewSemStatus(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-2 bg-background font-medium focus:outline-hidden text-xs"
                  >
                    <option value="Active (Teaching & Midterms)">Active (Teaching & Midterms)</option>
                    <option value="Upcoming Planning">Upcoming Planning</option>
                    <option value="Archived / Results Published">Archived / Results Published</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddSemesterModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="text-white"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    Save Semester
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
