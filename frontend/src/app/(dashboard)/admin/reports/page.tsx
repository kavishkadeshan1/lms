"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Filter, 
  FileSpreadsheet, 
  FileCode, 
  Calendar,
  Users,
  Clock,
  Award,
  Sparkles
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface ReportItem {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  lastGenerated: string;
  formats: string[];
}

export default function ReportsHubPage() {
  const { tenant } = useTenant();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successReport, setSuccessReport] = useState<string | null>(null);

  const reports: ReportItem[] = [
    {
      id: "rep-1",
      code: "FR-136",
      title: "Student Progression & Comprehensive Transcript Audit",
      category: "Academic Progress",
      description: "Generates enrolled students' course completion percentages, continuous assessment scores, and cumulative GPA standing.",
      lastGenerated: "Today at 09:30 AM",
      formats: ["PDF", "CSV", "XLSX"]
    },
    {
      id: "rep-2",
      code: "FR-138",
      title: "Semester Examination Attendance Eligibility Roster (80% Cutoff)",
      category: "Attendance & Admittance",
      description: "Official Faculty Examination Board admittance list flagging students who fail to meet the mandatory 80% attendance regulation.",
      lastGenerated: "Oct 05, 2026",
      formats: ["PDF", "CSV"]
    },
    {
      id: "rep-3",
      code: "FR-137",
      title: "Course Delivery & Resource Access Performance Report",
      category: "Teaching Quality",
      description: "Aggregates student resource downloads, lecture video viewing completion, and discussion forum participation per module.",
      lastGenerated: "Oct 01, 2026",
      formats: ["CSV", "XLSX"]
    },
    {
      id: "rep-4",
      code: "FR-139",
      title: "Assessment & Online Examination Statistical Distribution",
      category: "Assessment Analytics",
      description: "Item analysis, difficulty index, standard deviation, and grade curve distributions for midterm and final exams.",
      lastGenerated: "Oct 04, 2026",
      formats: ["PDF", "XLSX"]
    },
    {
      id: "rep-5",
      code: "FR-140",
      title: "Multi-Tenant Platform Telemetry & LMS Usage Audit",
      category: "Platform Administration",
      description: "DAU, WAU, MAU, server compute utilization, S3 file storage consumption, and network transfer volume.",
      lastGenerated: "Yesterday",
      formats: ["CSV", "JSON"]
    },
    {
      id: "rep-6",
      code: "FR-141",
      title: "Student Quality Assurance & Lecturer Evaluation Summary",
      category: "Quality Assurance",
      description: "Aggregated, anonymized student ratings and qualitative feedback regarding teaching effectiveness and LMS usability.",
      lastGenerated: "Sep 28, 2026",
      formats: ["PDF", "XLSX"]
    }
  ];

  const handleSimulateDownload = (report: ReportItem, format: string) => {
    setDownloadingId(`${report.id}-${format}`);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessReport(`${report.title} (${format})`);
      setTimeout(() => setSuccessReport(null), 3000);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Data Governance & Compliance (SRS §6.18, §21)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Institutional Reports & Data Exports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate and export accredited academic records, examination eligibility lists, and LMS engagement data for {tenant.name}.
          </p>
        </div>
      </div>

      {successReport && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Successfully compiled and exported: <strong>{successReport}</strong></span>
        </div>
      )}

      <div className="grid gap-4">
        {reports.map((rep) => (
          <Card key={rep.id} className="hover:border-primary/40 transition-colors shadow-xs">
            <CardContent className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {rep.code}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">• {rep.category}</span>
                </div>
                <h3 className="text-base font-bold text-foreground">{rep.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                  {rep.description}
                </p>
                <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                  <Clock size={12} /> Last generated: {rep.lastGenerated}
                </div>
              </div>

              {/* Export format buttons (SRS FR-142) */}
              <div className="flex flex-wrap items-center gap-2">
                {rep.formats.map((fmt) => {
                  const isDownloading = downloadingId === `${rep.id}-${fmt}`;
                  return (
                    <Button
                      key={fmt}
                      variant="outline"
                      size="sm"
                      disabled={isDownloading}
                      onClick={() => handleSimulateDownload(rep, fmt)}
                      className="text-xs font-mono h-8 px-3 gap-1.5 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Download size={13} />
                      <span>{isDownloading ? "Compiling..." : `Export ${fmt}`}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
