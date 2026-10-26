"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Globe, 
  AlertTriangle, 
  FileCode,
  Download,
  CheckCircle2
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: "Security" | "Assessment" | "Academic" | "Configuration";
  ipAddress: string;
  status: "Success" | "Flagged";
  details: string;
}

export default function SystemAuditLogsPage() {
  const { tenant } = useTenant();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const auditEvents: AuditEntry[] = [
    {
      id: "LOG-9821",
      timestamp: "2026-10-07 23:18:42",
      actor: "Kavishka Sandaruwan (2022/ICT/042)",
      role: "Student",
      action: "EXAM_SUBMISSION_COMPLETED",
      category: "Assessment",
      ipAddress: "192.248.45.18 (UOC Campus WiFi)",
      status: "Success",
      details: "Mid-Semester Examination ICT 3101 attempt finished. Receipt: EXAM-REC-849201."
    },
    {
      id: "LOG-9820",
      timestamp: "2026-10-07 22:54:10",
      actor: "Dr. Aruna Pathirana",
      role: "Lecturer",
      action: "GRADES_RELEASED_TO_STUDENTS",
      category: "Academic",
      ipAddress: "192.248.45.92 (Faculty Staff VPN)",
      status: "Success",
      details: "Released Continuous Assessment 1 marks for 45 students in ICT 3101."
    },
    {
      id: "LOG-9819",
      timestamp: "2026-10-07 21:12:05",
      actor: "Eng. Chathura Silva",
      role: "Admin",
      action: "TENANT_BRANDING_UPDATED",
      category: "Configuration",
      ipAddress: "192.248.45.2 (IT Centre)",
      status: "Success",
      details: "Updated primary theme color palette and published active portal header."
    },
    {
      id: "LOG-9818",
      timestamp: "2026-10-07 20:45:33",
      actor: "Unknown / Failed Auth",
      role: "Anonymous",
      action: "AUTH_LOGIN_FAILED_BRUTE_DETECTED",
      category: "Security",
      ipAddress: "185.220.101.5 (External)",
      status: "Flagged",
      details: "Rate limiter triggered after 5 consecutive invalid password attempts for user staff.dean@cmb.ac.lk."
    },
    {
      id: "LOG-9817",
      timestamp: "2026-10-07 18:30:19",
      actor: "Platform Super Administrator",
      role: "SuperAdmin",
      action: "TENANT_BACKUP_SNAPSHOT_CREATED",
      category: "Security",
      ipAddress: "10.0.4.1 (Internal Cluster)",
      status: "Success",
      details: "Automated incremental PostgreSQL database snapshot archived to cold storage."
    }
  ];

  const filtered = auditEvents.filter(e => {
    const matchSearch = 
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Security & Compliance Governance (SRS §6.19, §22, FR-145, FR-146)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Institutional Audit Trails & Security Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Immutable forensic audit records capturing privilege escalation, examination submissions, grade releases, and authentication telemetry.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-muted/20 p-3 rounded-xl border text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search audit events, actors, IPs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-3 py-1.5 bg-background font-medium focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Security">Security</option>
            <option value="Assessment">Assessment</option>
            <option value="Academic">Academic</option>
            <option value="Configuration">Configuration</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid divide-y text-xs font-mono" role="region" aria-label="Scrollable records" tabIndex={0}>
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-3">Actor & Identity</div>
              <div className="col-span-3">Action Event</div>
              <div className="col-span-2">IP Address / Host</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {filtered.map((log) => (
              <div key={log.id} className="p-3.5 grid grid-cols-12 items-start hover:bg-muted/20 transition-colors">
                <div className="col-span-2 text-muted-foreground text-[11px]">
                  {log.timestamp}
                </div>

                <div className="col-span-3">
                  <div className="font-semibold text-foreground truncate">{log.actor}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{log.role}</div>
                </div>

                <div className="col-span-3">
                  <span className="font-bold text-primary block truncate">{log.action}</span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">{log.details}</span>
                </div>

                <div className="col-span-2 text-muted-foreground text-[11px] truncate">
                  {log.ipAddress}
                </div>

                <div className="col-span-2 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === "Success" 
                      ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                      : "bg-red-500/10 text-red-700 dark:text-red-400 animate-pulse"
                  }`}>
                    {log.status}
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
