"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Activity, 
  Download, 
  Filter, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  FileText,
  BarChart2,
  Server
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useTenant } from "@/lib/tenant-context";

// Time series active users data (SRS FR-106, FR-113)
const engagementData = [
  { day: "Mon", dau: 3420, submissions: 420, aiQueries: 180 },
  { day: "Tue", dau: 3890, submissions: 560, aiQueries: 240 },
  { day: "Wed", dau: 4100, submissions: 810, aiQueries: 310 },
  { day: "Thu", dau: 3950, submissions: 720, aiQueries: 290 },
  { day: "Fri", dau: 3620, submissions: 610, aiQueries: 210 },
  { day: "Sat", dau: 2450, submissions: 320, aiQueries: 150 },
  { day: "Sun", dau: 2890, submissions: 450, aiQueries: 190 },
];

const departmentUsageData = [
  { name: "ICT", students: 380, activityIndex: 94 },
  { name: "BST", students: 310, activityIndex: 88 },
  { name: "ET", students: 350, activityIndex: 91 },
  { name: "IAT", students: 220, activityIndex: 84 },
];

const assessmentPassingData = [
  { name: "Pass (Grade ≥ C)", value: 86, color: "#16a34a" },
  { name: "At-Risk (Grade D)", value: 10, color: "#f59e0b" },
  { name: "Fail / Incomplete", value: 4, color: "#dc2626" },
];

export default function AdminAnalyticsDashboard() {
  const { tenant } = useTenant();

  // SRS Section 15.1 Filters
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [exportNotice, setExportNotice] = useState(false);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            {tenant.shortName} Executive Governance Hub (SRS §6.14, §15)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            LMS Usage & Academic Analytics Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time engagement telemetry, student risk indicators, assessment distributions, and AI assistant query volumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {exportNotice && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 size={15} /> Export Dispatched (CSV/PDF)!
            </span>
          )}
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="text-xs gap-2 font-medium"
          >
            <Download size={14} /> Export Report (FR-115)
          </Button>
        </div>
      </div>

      {/* SRS Section 15.1 Mandatory Filter Bar */}
      <Card className="bg-muted/20 border shadow-xs">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Filter size={13} /> Dashboard Multi-Dimensional Filters (SRS §15.1)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1">Time Horizon</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border rounded-lg px-2.5 py-1.5 bg-background font-medium focus:outline-hidden"
              >
                <option value="7d">Last 7 Days (Real-Time)</option>
                <option value="30d">Last 30 Days</option>
                <option value="sem1">Semester 1 (2025/2026)</option>
                <option value="all">Full Academic Year</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Academic Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full border rounded-lg px-2.5 py-1.5 bg-background font-medium focus:outline-hidden"
              >
                <option value="all">{tenant.facultyName} (All)</option>
                <option value="ftech">Faculty of Technology</option>
                <option value="fsci">Faculty of Science</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full border rounded-lg px-2.5 py-1.5 bg-background font-medium focus:outline-hidden"
              >
                <option value="all">All Departments</option>
                <option value="dict">Dept of ICT (DICT)</option>
                <option value="dbst">Dept of Biosystems (DBST)</option>
                <option value="det">Dept of Engineering (DET)</option>
                <option value="diat">Dept of Instrumentation (DIAT)</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Programme</label>
              <select className="w-full border rounded-lg px-2.5 py-1.5 bg-background font-medium focus:outline-hidden">
                <option>All Enrolled Cohorts</option>
                <option>BICT (Hons) Year 3</option>
                <option>BBST (Hons) Year 3</option>
                <option>BET (Hons) Year 3</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Grid (SRS §15) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Daily Active Users (DAU)</span>
              <div className="text-2xl font-extrabold text-foreground mt-1">3,420</div>
              <div className="text-[11px] text-green-600 font-medium mt-0.5">↑ 89% engagement rate</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Course Access Events</span>
              <div className="text-2xl font-extrabold text-foreground mt-1">42,890</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Across 112 active modules</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">AI Queries & Grounding</span>
              <div className="text-2xl font-extrabold text-foreground mt-1">1,820</div>
              <div className="text-[11px] text-green-600 font-medium mt-0.5">96.2% grounded • 3.8% escalated</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">At-Risk Students (FR-103)</span>
              <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">14</div>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">Attendance &lt;80% or 2+ missed tasks</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Trends (8 cols) */}
        <Card className="lg:col-span-8 shadow-xs">
          <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Daily Active Users & Submissions Trend (FR-106, FR-108)</CardTitle>
              <CardDescription className="text-xs">Correlates student logins with assignment submission deadlines.</CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-primary">Live Telemetry</span>
          </CardHeader>
          <CardContent className="p-4 pt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="dau" 
                  name="Daily Active Users" 
                  stroke={tenant.primaryColor} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  name="Assessment Submissions" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="aiQueries" 
                  name="AI Chatbot Queries" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assessment Passing Distribution (4 cols) */}
        <Card className="lg:col-span-4 shadow-xs">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold">Passing & Academic Risk (FR-110)</CardTitle>
            <CardDescription className="text-xs">Based on continuous assessments and exam marks.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentPassingData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {assessmentPassingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-1.5 text-xs pt-2 border-t">
              {assessmentPassingData.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Department Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Usage Comparison (FR-112) */}
        <Card>
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold">Department Engagement Index (FR-112)</CardTitle>
            <CardDescription className="text-xs">Relative platform utilization across Technology Faculty departments.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUsageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="activityIndex" name="Engagement Score (%)" fill={tenant.primaryColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Server & Infrastructure Telemetry (SRS §15, NFR-001) */}
        <Card>
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Server size={16} /> Production Infrastructure Health
            </CardTitle>
            <CardDescription className="text-xs">Cloud hosting, object storage, and database latency metrics.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Tenant Object Storage (S3 / Ceph)</span>
                <span className="font-mono text-muted-foreground">4.2 TB / 10 TB Quota (42%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>PostgreSQL Read/Write Connection Pool</span>
                <span className="font-mono text-muted-foreground">38 of 100 Pools Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "38%" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[11px] text-muted-foreground">
              <div className="p-2.5 bg-muted/40 rounded-lg">
                <span className="block text-foreground font-bold">p95 API Latency</span>
                <span>84ms (NFR-001 Pass)</span>
              </div>
              <div className="p-2.5 bg-muted/40 rounded-lg">
                <span className="block text-foreground font-bold">Monthly Uptime</span>
                <span className="text-green-600 font-bold">99.98% (NFR-003 Pass)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
