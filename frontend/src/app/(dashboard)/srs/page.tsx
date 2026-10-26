"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  Sparkles
} from "lucide-react";

interface SRSReq {
  id: string;
  category: string;
  title: string;
  desc: string;
  route: string;
  status: "Frontend preview";
}

export default function SRSExplorerPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const requirements: SRSReq[] = [
    { id: "FR-001 - FR-006", category: "Tenancy", title: "Tenant & Institution Management", desc: "Browser-local sample institution list. Server-side tenant isolation, lifecycle controls, and verified domains are not connected.", route: "/admin/tenants", status: "Frontend preview" },
    { id: "FR-007 - FR-015", category: "Branding", title: "White-Label Branding & Customization", desc: "Local theme preview. Logos, favicons, and institutional settings are not published to a server.", route: "/admin/branding", status: "Frontend preview" },
    { id: "FR-016 - FR-024", category: "Auth & Users", title: "Authentication, RBAC & Users", desc: "Role-based demo navigation and sample user list. Accounts, authorization, MFA, and CSV import require backend services.", route: "/admin/users", status: "Frontend preview" },
    { id: "FR-025 - FR-033", category: "Academic", title: "Academic Structure Governance", desc: "Local preview of departments and semesters. Institutional records are not saved to a university service.", route: "/admin/academic", status: "Frontend preview" },
    { id: "FR-034 - FR-043", category: "Courses", title: "Course Content & Learning Materials", desc: "Sample course pages and locally saved activity progress. University course files and enrolment records are not connected.", route: "/courses/ict-3101", status: "Frontend preview" },
    { id: "FR-050 - FR-059", category: "Assignments", title: "Assignments & Submissions Engine", desc: "Browser-local file names and notes. Assignment files, official attempts, late penalties, and grading require backend services.", route: "/assignments", status: "Frontend preview" },
    { id: "FR-060 - FR-072", category: "Exams", title: "Online Quizzes & Formal Examinations", desc: "Local practice timer and answers. Proctoring, official submissions, and result records are not connected.", route: "/courses/ict-3101/exams/exam-midterm", status: "Frontend preview" },
    { id: "FR-073 - FR-078", category: "Gradebook", title: "Gradebook & Result Release", desc: "Sample grade view. Official assessment weights, GPA results, and controlled releases require institutional services.", route: "/grades", status: "Frontend preview" },
    { id: "FR-079 - FR-083", category: "Attendance", title: "Attendance Tracking & Eligibility", desc: "Sample attendance ledger. Verified attendance and exam eligibility are not connected to an institutional record.", route: "/attendance", status: "Frontend preview" },
    { id: "FR-084 - FR-089", category: "Calendar", title: "Calendar & Timetable", desc: "Sample schedule and temporary events. University timetables and notifications are not synchronized.", route: "/calendar", status: "Frontend preview" },
    { id: "FR-098 - FR-104", category: "Progress", title: "Student Progress & At-Risk Mentoring", desc: "Sample activity and risk indicators. Advisor notes do not update academic records.", route: "/progress", status: "Frontend preview" },
    { id: "FR-105 - FR-115", category: "Analytics", title: "LMS Usage Analytics & Telemetry", desc: "Static sample metrics and exports. Live telemetry and analytics queries are not connected.", route: "/admin", status: "Frontend preview" },
    { id: "FR-116 - FR-122", category: "Feedback", title: "Reviews & Course Evaluation", desc: "Local sample evaluation only. No scores or comments are sent to faculty staff.", route: "/feedback", status: "Frontend preview" },
    { id: "FR-123 - FR-131", category: "AI Chatbot", title: "AI Student Assistant (Grounded)", desc: "Preset sample answers only. There is no live model, course grounding, or staff escalation service.", route: "/", status: "Frontend preview" },
    { id: "FR-132 - FR-135", category: "Certificates", title: "Certificates & Micro-Credentials", desc: "Illustrative sample certificate only. Public verification and official credentials are unavailable.", route: "/certificates", status: "Frontend preview" },
    { id: "FR-136 - FR-142", category: "Reports", title: "Reports & Multi-Format Exports", desc: "Sample CSV and JSON summaries only. Institutional reports and PDF/XLSX exports are not connected.", route: "/admin/reports", status: "Frontend preview" },
    { id: "FR-143 - FR-149", category: "Audit & Sec", title: "System Security & Audit Logging", desc: "Static sample audit entries. Security enforcement and immutable server-side audit logs require backend services.", route: "/admin/audit", status: "Frontend preview" },
  ];

  const filtered = requirements.filter(r => {
    const mSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
                    r.title.toLowerCase().includes(search.toLowerCase()) ||
                    r.desc.toLowerCase().includes(search.toLowerCase());
    const mCat = catFilter === "all" || r.category === catFilter;
    return mSearch && mCat;
  });

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
            <span>Frontend Feature Inventory</span>
            <span>•</span>
            <span>Reference: University of Colombo FOT (lms.tech.cmb.ac.lk)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Software Requirements Coverage
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Frontend coverage inventory for the SRS. This demo is not a compliance certification or production backend implementation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-500/10 text-green-700 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-green-500/20 font-mono">
            <CheckCircle2 size={15} /> Frontend preview · backend integration incomplete
          </span>
        </div>
      </div>

      {/* Appendix A & B Comparison Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/20 border">
          <CardHeader className="py-3 px-5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 size={16} className="text-primary" /> Reference feature areas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-1.5">
            <div>• <strong>Academic areas:</strong> sample department and semester screens.</div>
            <div>• <strong>Course areas:</strong> sample catalogue, course pages, and learning activities.</div>
            <div>• <strong>Assessment areas:</strong> practice exams, assignments, and sample grades.</div>
            <div>• These screens demonstrate interface coverage; they do not verify institutional feature parity.</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border">
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> Additional preview areas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-1.5">
            <div>• <strong>Branding:</strong> browser-local theme preview.</div>
            <div>• <strong>Student assistant:</strong> preset sample responses only.</div>
            <div>• <strong>Analytics:</strong> static example metrics and summaries.</div>
            <div>• <strong>Feedback:</strong> local sample evaluation state.</div>
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
            <option value="Gradebook">Gradebook</option>
            <option value="Analytics">Analytics Dashboard</option>
            <option value="AI Chatbot">AI Chatbot</option>
            <option value="Attendance">Attendance</option>
            <option value="Progress">Progress & At-Risk</option>
            <option value="Feedback">Feedback</option>
            <option value="Certificates">Certificates</option>
            <option value="Reports">Reports</option>
            <option value="Audit & Sec">Audit & Security</option>
          </select>
        </div>
      </div>

      {/* Traceability Matrix Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid divide-y text-xs" role="region" aria-label="Scrollable records" tabIndex={0}>
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
                  <span className="mt-1 inline-flex text-[10px] border px-1.5 py-0.5 rounded text-muted-foreground">
                    {req.status}
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
          {filtered.length === 0 && <p role="status" className="p-6 text-center text-sm text-muted-foreground">No requirements match this search and category.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
