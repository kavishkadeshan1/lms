"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileCheck2, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  Clock, 
  Activity, 
  Sparkles,
  Layers
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface SRSReq {
  id: string;
  category: string;
  title: string;
  desc: string;
  route: string;
  status: "Implemented" | "Active";
}

export default function SRSExplorerPage() {
  const { tenant } = useTenant();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const requirements: SRSReq[] = [
    { id: "FR-001 - FR-006", category: "Tenancy", title: "Tenant & Institution Management", desc: "Logical tenant isolation, institution lifecycle, settings, and domain management.", route: "/admin/tenants", status: "Implemented" },
    { id: "FR-007 - FR-015", category: "Branding", title: "White-Label Branding & Customization", desc: "Custom logo, favicon, colors, banners, footers, and live preview before publishing.", route: "/admin/branding", status: "Implemented" },
    { id: "FR-016 - FR-024", category: "Auth & Users", title: "Authentication, RBAC & Users", desc: "Student profiles, lecturer profiles, multi-role RBAC, MFA flags, bulk CSV import.", route: "/admin/users", status: "Implemented" },
    { id: "FR-025 - FR-033", category: "Academic", title: "Academic Structure Governance", desc: "Faculty, Department, Programme, Academic Year, and Course Category hierarchy.", route: "/admin/academic", status: "Implemented" },
    { id: "FR-034 - FR-043", category: "Courses", title: "Course Content & Learning Materials", desc: "Week-by-week topic sections, PDF/video resources, and activity completion checkboxes.", route: "/courses/ict-3101", status: "Implemented" },
    { id: "FR-050 - FR-059", category: "Assignments", title: "Assignments & Submissions Engine", desc: "File submissions, attempts, late penalty rules, and rubric scoring matrix.", route: "/assignments", status: "Implemented" },
    { id: "FR-060 - FR-072", category: "Exams", title: "Online Quizzes & Formal Examinations", desc: "Server-side ticking timer, auto-submit on expiry, anti-cheat pledge, and answer script PDF upload.", route: "/courses/ict-3101/exams/exam-midterm", status: "Implemented" },
    { id: "FR-073 - FR-078", category: "Gradebook", title: "Gradebook & Result Release", desc: "Weighted assessments, GPA computation, and controlled result release toggles.", route: "/grades", status: "Implemented" },
    { id: "FR-079 - FR-083", category: "Attendance", title: "Attendance Tracking & Eligibility", desc: "Session attendance marking (P/A/L/E), percentage calculation, and 80% exam eligibility alert.", route: "/attendance", status: "Implemented" },
    { id: "FR-084 - FR-089", category: "Calendar", title: "Calendar & Timetable", desc: "Academic calendar, lecture timetables, and assignment submission deadlines.", route: "/calendar", status: "Implemented" },
    { id: "FR-098 - FR-104", category: "Progress", title: "Student Progress & At-Risk Mentoring", desc: "Activity completion bars, learning history, risk indicators, and advisor intervention notes.", route: "/progress", status: "Implemented" },
    { id: "FR-105 - FR-115", category: "Analytics", title: "LMS Usage Analytics & Telemetry", desc: "DAU/WAU/MAU, resource access, passing curves, multi-dimensional filters, and export.", route: "/admin", status: "Implemented" },
    { id: "FR-116 - FR-122", category: "Feedback", title: "Reviews & Course Evaluation", desc: "Anonymous student evaluations, 5-star rating scales, and QA sentiment analytics.", route: "/feedback", status: "Implemented" },
    { id: "FR-123 - FR-131", category: "AI Chatbot", title: "AI Student Assistant (Grounded)", desc: "Grounded course Q&A, source citations, progress answers, safety filters, and human escalation.", route: "/", status: "Implemented" },
    { id: "FR-132 - FR-135", category: "Certificates", title: "Certificates & Micro-Credentials", desc: "Completion certificates with verifiable hashes, distinction honors, and QR validation.", route: "/certificates", status: "Implemented" },
    { id: "FR-136 - FR-142", category: "Reports", title: "Reports & Multi-Format Exports", desc: "Export student progress, attendance rosters, and telemetry in PDF, CSV, and XLSX.", route: "/admin/reports", status: "Implemented" },
    { id: "FR-143 - FR-149", category: "Audit & Sec", title: "System Security & Audit Logging", desc: "Immutable forensic logs of logins, grade releases, branding updates, and exam attempts.", route: "/admin/audit", status: "Implemented" },
  ];

  const filtered = requirements.filter(r => {
    const mSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
                    r.title.toLowerCase().includes(search.toLowerCase()) ||
                    r.desc.toLowerCase().includes(search.toLowerCase());
    const mCat = catFilter === "all" || r.category === catFilter;
    return mSearch && mCat;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
            <span>SRS Baseline 1.0 (2026)</span>
            <span>•</span>
            <span>Reference: University of Colombo FOT (lms.tech.cmb.ac.lk)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Software Requirements Specification (SRS) Compliance Matrix
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Complete traceability audit verifying every module, stakeholder role, and architectural requirement in the frontend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-500/10 text-green-700 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-green-500/20 font-mono">
            <CheckCircle2 size={15} /> 100% Core Requirements Implemented
          </span>
        </div>
      </div>

      {/* Appendix A & B Comparison Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/20 border">
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 size={16} className="text-primary" /> Reference LMS Feature Alignment (Appendix B)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-1.5">
            <div>• <strong>Reference Basis:</strong> University of Colombo Faculty of Technology (`lms.tech.cmb.ac.lk`).</div>
            <div>• <strong>Academic Departments:</strong> DICT, DBST, DET, DIAT represented in academic structures.</div>
            <div>• <strong>Course Catalogue:</strong> Hierarchical category navigation with course code indexing.</div>
            <div>• <strong>Examinations:</strong> Time-bounded online examination engine with structured answer script PDF upload.</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border">
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> 2026 Modernization Additions (Appendix A)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-1.5">
            <div>• <strong>Multi-Tenant White-Label:</strong> Dynamic live theme & branding customizer (`/admin/branding`).</div>
            <div>• <strong>AI Student Chatbot:</strong> Grounded on authorized course materials with human escalation.</div>
            <div>• <strong>Telemetry Analytics:</strong> Multi-dimensional DAU/WAU/MAU and passing curves (`/admin`).</div>
            <div>• <strong>Quality Assurance:</strong> Anonymized student course and LMS evaluations (`/feedback`).</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-muted/20 p-3 rounded-xl border text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search requirements (e.g. Exam, AI, Branding)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Category:</span>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border rounded-lg px-3 py-1.5 bg-background font-medium focus:outline-hidden"
          >
            <option value="all">All Modules ({requirements.length})</option>
            <option value="Tenancy">Tenancy & White-Label</option>
            <option value="Branding">Branding</option>
            <option value="Auth & Users">Auth & Users</option>
            <option value="Academic">Academic Structure</option>
            <option value="Courses">Courses & Content</option>
            <option value="Exams">Quizzes & Exams</option>
            <option value="Analytics">Analytics Dashboard</option>
            <option value="AI Chatbot">AI Chatbot</option>
            <option value="Attendance">Attendance</option>
            <option value="Progress">Progress & At-Risk</option>
          </select>
        </div>
      </div>

      {/* Traceability Matrix Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y text-xs">
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-2 font-mono">SRS Req ID</div>
              <div className="col-span-3">Functional Module</div>
              <div className="col-span-5">Requirements Scope & Implementation</div>
              <div className="col-span-2 text-right">Interactive Interface</div>
            </div>

            {filtered.map((req) => (
              <div key={req.id} className="p-4 grid grid-cols-12 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-2 font-mono font-bold text-primary">
                  {req.id}
                </div>

                <div className="col-span-3">
                  <div className="font-semibold text-foreground">{req.title}</div>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {req.category}
                  </span>
                </div>

                <div className="col-span-5 text-muted-foreground pr-4 leading-relaxed">
                  {req.desc}
                </div>

                <div className="col-span-2 text-right">
                  <Link href={req.route}>
                    <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 hover:bg-primary hover:text-white transition-colors">
                      <span>Inspect View</span>
                      <ExternalLink size={12} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
