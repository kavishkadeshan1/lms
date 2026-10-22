"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Clock, 
  Calendar, 
  Search, 
  FileText, 
  File, 
  Folder, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  CheckSquare,
  Activity,
  Award,
  BookOpen,
  PlusCircle,
  AlertTriangle,
  Star,
  Settings,
  ShieldCheck,
  Building2,
  Palette,
  FolderTree,
  FileSpreadsheet
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function DashboardPage() {
  const { tenant, user } = useTenant();

  // Student specific timeline state
  const [timelineFilter, setTimelineFilter] = useState("next7");
  const [timelineSearch, setTimelineSearch] = useState("");

  // ==========================================
  // 1. STUDENT VIEW DATA (2023t01855)
  // ==========================================
  const studentCourses = [
    {
      id: "ic-3204",
      code: "IC 3204",
      title: "Introduction to Software Quality Assurance",
      category: "22/23",
      gradient: "from-purple-600 via-indigo-600 to-blue-700",
      progress: 44,
      link: "/courses/ic-3204"
    },
    {
      id: "ic-3101",
      code: "IC 3101",
      title: "Advanced Web Application Architectures",
      category: "22/23",
      gradient: "from-blue-600 via-teal-600 to-cyan-700",
      progress: 75,
      link: "/courses/ic-3101"
    },
    {
      id: "ic-3102",
      code: "IC 3102",
      title: "Distributed Database Systems & Cloud Sharding",
      category: "22/23",
      gradient: "from-slate-700 via-gray-800 to-zinc-900",
      progress: 88,
      link: "/courses/ic-3102"
    }
  ];

  const studentTimeline = [
    {
      id: "t-1",
      title: "Assignment 1: Equivalence Partitioning & Boundary Value Analysis",
      course: "IC 3204 - Introduction to Software Quality Assurance",
      dueFormatted: "Sunday, 16 October 2026, 11:59 PM",
      timeRemaining: "Due in 8 days",
      action: "Add submission",
      link: "/assignments"
    },
    {
      id: "t-2",
      title: "Mid-Semester Online Examination: Distributed Systems",
      course: "IC 3101 - Advanced Web Application Architectures",
      dueFormatted: "Tomorrow, 11:59 PM",
      timeRemaining: "Due tomorrow",
      action: "Attempt quiz now",
      link: "/exams"
    }
  ];

  // ==========================================
  // 2. LECTURER VIEW DATA (lec.pathirana)
  // ==========================================
  const teachingCourses = [
    {
      id: "ic-3101",
      code: "IC 3101",
      title: "Advanced Web Application Architectures",
      students: 145,
      pendingGrades: 14,
      avgAttendance: 92.8,
      status: "Midterm Active",
      gradient: "from-blue-600 via-teal-600 to-cyan-700"
    },
    {
      id: "ic-3204",
      code: "IC 3204",
      title: "Introduction to Software Quality Assurance",
      students: 130,
      pendingGrades: 0,
      avgAttendance: 95.0,
      status: "Assignment 1 Ongoing",
      gradient: "from-purple-600 via-indigo-600 to-blue-700"
    }
  ];

  const pendingSubmissions = [
    {
      student: "K. G. K. Sandaruwan (2023t01855)",
      task: "Assignment 1: Raft Consensus Go Implementation",
      course: "IC 3101",
      submittedAt: "Yesterday at 10:15 PM"
    },
    {
      student: "Nipuni Wickramasinghe (2022/BST/018)",
      task: "Assignment 1: Raft Consensus Go Implementation",
      course: "IC 3101",
      submittedAt: "Yesterday at 07:40 PM"
    }
  ];

  // ==========================================
  // 3. ADMIN VIEW DATA (admin.tech)
  // ==========================================
  const adminKPIs = [
    { label: "Total Active Users", val: "14,250", change: "+180 this month", icon: Users, color: "text-blue-600" },
    { label: "Active Academic Modules", val: "112", change: "Semester 1 2026", icon: BookOpen, color: "text-purple-600" },
    { label: "Average Session Time", val: "42m", change: "Telemetry Normal", icon: Clock, color: "text-green-600" },
    { label: "Storage Consumed (S3)", val: "4.2 TB / 10 TB", change: "42% Quota", icon: Activity, color: "text-amber-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Greeting Header (Matches lms.tech.cmb.ac.lk) */}
      <div className="border-b border-[#dee2e6] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#212529]">Dashboard</h1>
          <p className="text-base text-[#495057] mt-0.5 font-normal">
            Hi, {user.displayName}! 👋
          </p>
        </div>

        <div className="text-xs text-[#6c757d] font-mono bg-white px-3 py-1.5 rounded-md border border-[#dee2e6]">
          Logged in as: <strong className="text-[#0f6cbf] uppercase">{user.role}</strong> ({user.username})
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. STUDENT DASHBOARD VIEW                                */}
      {/* ======================================================== */}
      {user.role === "student" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Main Area, 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Recently accessed courses (Moodle 4 Card Carousel) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#212529]">
                  Recently accessed courses
                </h2>
                <div className="flex items-center gap-1">
                  <button className="p-1 border border-[#dee2e6] rounded bg-white text-[#6c757d] hover:bg-[#f8f9fa] cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="p-1 border border-[#dee2e6] rounded bg-white text-[#6c757d] hover:bg-[#f8f9fa] cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studentCourses.map((c) => (
                  <Link key={c.id} href={c.link} className="block group">
                    <div className="bg-white border border-[#dee2e6] rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all h-full flex flex-col justify-between">
                      <div className={`h-24 bg-gradient-to-tr ${c.gradient} p-3 flex flex-col justify-between text-white relative`}>
                        <span className="text-[11px] font-mono font-medium bg-black/20 px-2 py-0.5 rounded w-fit backdrop-blur-xs">
                          {c.category}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-xs text-[#6c757d] block font-mono">{c.code}</span>
                          <h3 className="text-sm font-semibold text-[#0f6cbf] group-hover:underline line-clamp-2 mt-0.5 leading-snug">
                            {c.title}
                          </h3>
                        </div>

                        <div className="pt-2 border-t border-[#f1f3f5] text-[11px] text-[#6c757d] flex justify-between items-center">
                          <span>{c.progress}% complete</span>
                          <div className="w-16 bg-[#e9ecef] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#0f6cbf] h-1.5 rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Timeline Block */}
            <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-4">
                <h2 className="text-base font-bold text-[#212529]">Timeline</h2>

                <div className="flex flex-wrap items-center gap-2">
                  <select 
                    value={timelineFilter} 
                    onChange={(e) => setTimelineFilter(e.target.value)}
                    className="text-xs border border-[#ced4da] rounded-md px-2.5 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden"
                  >
                    <option value="all">All</option>
                    <option value="overdue">Overdue</option>
                    <option value="next7">Next 7 days</option>
                    <option value="next30">Next 30 days</option>
                  </select>

                  <select className="text-xs border border-[#ced4da] rounded-md px-2.5 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden">
                    <option>Sort by dates</option>
                    <option>Sort by courses</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-[#adb5bd]" />
                <input
                  type="text"
                  placeholder="Search by activity type or name"
                  value={timelineSearch}
                  onChange={(e) => setTimelineSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#ced4da] rounded-md bg-[#f8f9fa] focus:bg-white focus:outline-hidden focus:border-[#0f6cbf]"
                />
              </div>

              <div className="space-y-4 pt-1">
                {studentTimeline.map((item) => (
                  <div key={item.id} className="p-4 border border-[#e9ecef] rounded-lg bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#0f6cbf] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#dc3545] font-semibold">
                        <Clock size={14} />
                        <span>{item.dueFormatted}</span>
                        <span className="text-[#6c757d] font-normal">({item.timeRemaining})</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#212529]">{item.title}</h3>
                      <p className="text-xs text-[#6c757d]">{item.course}</p>
                    </div>

                    <Link href={item.link}>
                      <button className="px-4 py-2 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap">
                        {item.action}
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column Drawer (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#e9ecef] pb-2">
                Recently accessed items
              </h3>
              <div className="space-y-2.5">
                {[
                  { name: "IC3204_Session02_BlackBoxTesting.pdf", course: "IC 3204" },
                  { name: "Assignment 1 Submission Brief", course: "IC 3204" },
                  { name: "Distributed Raft Consensus Handout", course: "IC 3101" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded hover:bg-[#f8f9fa] transition-colors cursor-pointer">
                    <div className="p-1.5 rounded bg-blue-50 text-[#0f6cbf] mt-0.5">
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-[#0f6cbf] hover:underline block truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#6c757d]">{item.course}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private files Block (Authentic UOC FOT LMS block) */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-[#e9ecef] pb-2">
                <h3 className="text-sm font-bold text-[#212529]">Private files</h3>
                <span className="text-[11px] font-mono text-[#6c757d]">5 files (18.4 MB)</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: "dcmths.pdf", size: "3.2 MB" },
                  { name: "dmths.txt", size: "48 KB" },
                  { name: "Lesson 2.pdf", size: "4.1 MB" },
                  { name: "NNT L8 Class diagrams.pdf", size: "2.8 MB" },
                  { name: "ref book.pdf", size: "8.2 MB" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 rounded hover:bg-[#f8f9fa] group cursor-pointer">
                    <div className="flex items-center gap-2 min-w-0">
                      <File size={14} className="text-[#0f6cbf] flex-shrink-0" />
                      <span className="truncate text-[#495057] group-hover:text-[#0f6cbf] font-medium">{f.name}</span>
                    </div>
                    <span className="text-[10px] text-[#adb5bd] font-mono">{f.size}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#f1f3f5]">
                <button
                  type="button"
                  onClick={() => alert("Private files manager: Cloud storage capacity is 100 MB per student.")}
                  className="w-full py-1.5 px-3 bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#0f6cbf] border border-[#ced4da] rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  Manage private files...
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-[#e9ecef] pb-2">
                <h3 className="text-sm font-bold text-[#212529]">Calendar</h3>
                <Link href="/calendar" className="text-xs text-[#0f6cbf] hover:underline">Full calendar →</Link>
              </div>
              <div className="text-center space-y-2">
                <div className="text-xs font-bold text-[#495057]">October 2026</div>
                <div className="grid grid-cols-7 gap-1 text-[11px] text-[#6c757d] font-medium pt-1">
                  <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs font-mono pt-1">
                  <span className="text-[#adb5bd]">29</span><span className="text-[#adb5bd]">30</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  <span>6</span><span className="bg-red-500 text-white font-bold rounded-full">7</span><span className="bg-red-500 text-white font-bold rounded-full">8</span><span>9</span><span>10</span><span>11</span><span>12</span>
                  <span>13</span><span>14</span><span className="bg-[#0f6cbf] text-white font-bold rounded-full">15</span><span className="bg-[#0f6cbf] text-white font-bold rounded-full">16</span><span>17</span><span>18</span><span>19</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#e9ecef] pb-2 flex items-center justify-between">
                <span>Online users</span>
                <span className="text-[11px] text-[#6c757d] font-normal">(last 5 mins: 4)</span>
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Dr. Aruna Pathirana", role: "Lecturer" },
                  { name: "K. G. K. Sandaruwan", role: "You" },
                  { name: "Nipuni Wickramasinghe", role: "Student" }
                ].map((u, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="font-medium text-[#212529]">{u.name}</span>
                    <span className="text-[10px] text-[#6c757d]">({u.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LECTURER DASHBOARD VIEW                               */}
      {/* ======================================================== */}
      {user.role === "lecturer" && (
        <div className="space-y-8">
          {/* Quick Action Teaching Desk */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/lecturer/grading" className="block">
              <div className="bg-white border border-[#dee2e6] hover:border-[#0f6cbf] p-4 rounded-xl shadow-2xs transition-colors flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#212529]">Grading Desk</div>
                  <div className="text-[11px] text-amber-700 font-semibold font-mono">14 to review</div>
                </div>
              </div>
            </Link>

            <Link href="/lecturer/attendance" className="block">
              <div className="bg-white border border-[#dee2e6] hover:border-[#0f6cbf] p-4 rounded-xl shadow-2xs transition-colors flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-[#0f6cbf]">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#212529]">Mark Attendance</div>
                  <div className="text-[11px] text-[#6c757d]">Session records</div>
                </div>
              </div>
            </Link>

            <Link href="/lecturer/assessments" className="block">
              <div className="bg-white border border-[#dee2e6] hover:border-[#0f6cbf] p-4 rounded-xl shadow-2xs transition-colors flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#212529]">Create Exam</div>
                  <div className="text-[11px] text-[#6c757d]">Timed Quizzes</div>
                </div>
              </div>
            </Link>

            <Link href="/lecturer/at-risk" className="block">
              <div className="bg-white border border-[#dee2e6] hover:border-[#0f6cbf] p-4 rounded-xl shadow-2xs transition-colors flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#212529]">At-Risk Cases</div>
                  <div className="text-[11px] text-red-600 font-semibold font-mono">2 Flagged &lt;80%</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Assigned Teaching Courses */}
          <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <h2 className="text-base font-bold text-[#212529]">Assigned Teaching Modules (Semester 1)</h2>
              <span className="text-xs text-[#6c757d] font-mono">2 Active Modules • 275 Students</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachingCourses.map((c) => (
                <div key={c.id} className="border border-[#dee2e6] rounded-lg p-5 hover:border-[#0f6cbf] transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-[#0f6cbf] bg-blue-50 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-[11px] text-[#6c757d] font-mono">{c.status}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#212529]">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#6c757d] font-mono pt-2 border-t border-[#f1f3f5]">
                    <span>{c.students} Enrolled</span>
                    <span className="text-amber-700 font-semibold">{c.pendingGrades} to Grade</span>
                    <span className="text-green-700 font-semibold">{c.avgAttendance}% Attendance</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link href={`/courses/${c.id}`} className="flex-1">
                      <button className="w-full py-1.5 border border-[#ced4da] rounded text-xs font-semibold text-[#495057] hover:bg-[#f8f9fa] cursor-pointer">
                        Course Materials
                      </button>
                    </Link>
                    <Link href="/lecturer/grading" className="flex-1">
                      <button className="w-full py-1.5 bg-[#0f6cbf] text-white rounded text-xs font-semibold hover:bg-[#0d5ca3] cursor-pointer">
                        Grade Submissions
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submissions Pending Grading */}
          <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <h2 className="text-base font-bold text-[#212529]">Submissions Awaiting Grading (IC 3101)</h2>
              <Link href="/lecturer/grading" className="text-xs text-[#0f6cbf] hover:underline font-semibold">
                Open Full Grading Desk →
              </Link>
            </div>

            <div className="divide-y divide-[#e9ecef] text-xs">
              {pendingSubmissions.map((s, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#212529] block">{s.student}</span>
                    <span className="text-[#6c757d]">{s.task} ({s.course})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[#6c757d] text-[11px]">{s.submittedAt}</span>
                    <Link href="/lecturer/grading">
                      <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium text-xs cursor-pointer">
                        Grade Rubric
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ADMINISTRATOR DASHBOARD VIEW                           */}
      {/* ======================================================== */}
      {user.role === "admin" && (
        <div className="space-y-8">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {adminKPIs.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white border border-[#dee2e6] p-5 rounded-xl shadow-2xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#6c757d]">{kpi.label}</span>
                    <Icon size={18} className={kpi.color} />
                  </div>
                  <div className="text-2xl font-bold text-[#212529]">{kpi.val}</div>
                  <div className="text-[11px] text-[#6c757d] font-mono">{kpi.change}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Administration Hub */}
          <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#212529] border-b border-[#e9ecef] pb-3">
              Faculty Site Administration Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Link href="/admin/users" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <Users size={16} className="text-[#0f6cbf]" /> User Directory & RBAC
                  </div>
                  <p className="text-[#6c757d]">Manage students, lecturers, account states, and bulk CSV enrollment.</p>
                </div>
              </Link>

              <Link href="/admin/academic" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <FolderTree size={16} className="text-[#0f6cbf]" /> Academic Structure
                  </div>
                  <p className="text-[#6c757d]">Faculty departments (DICT, DBST, DET, DIAT), degree cohorts, and semesters.</p>
                </div>
              </Link>

              <Link href="/admin/reports" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-[#0f6cbf]" /> Reports & Exports
                  </div>
                  <p className="text-[#6c757d]">Examination attendance rosters, grade audit slips, and telemetry exports.</p>
                </div>
              </Link>

              <Link href="/admin/branding" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <Palette size={16} className="text-[#0f6cbf]" /> White-Label Studio
                  </div>
                  <p className="text-[#6c757d]">Customize colors, logos, login branding, and portal headers with live preview.</p>
                </div>
              </Link>

              <Link href="/admin/audit" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#0f6cbf]" /> System Audit Logs
                  </div>
                  <p className="text-[#6c757d]">Forensic security events, grade releases, and examination attempts audit.</p>
                </div>
              </Link>

              <Link href="/admin" className="block">
                <div className="p-4 border border-[#dee2e6] rounded-lg hover:border-[#0f6cbf] transition-colors space-y-1 bg-[#f8f9fa]">
                  <div className="font-bold text-sm text-[#212529] flex items-center gap-2">
                    <Activity size={16} className="text-[#0f6cbf]" /> Live Telemetry Charts
                  </div>
                  <p className="text-[#6c757d]">Multi-dimensional DAU/MAU time series, passing curves, and server health.</p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
