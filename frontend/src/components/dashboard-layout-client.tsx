"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  Calendar, 
  BarChart, 
  Settings, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Clock,
  Award,
  Layers,
  FileCheck2,
  CheckSquare,
  Activity,
  FileQuestion,
  Users,
  Palette,
  FolderTree,
  FileText
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { AIChatbotDrawer } from "@/components/ai-chatbot";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant, user, logout, editMode, setEditMode } = useTenant();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-[#212529] flex flex-col font-sans">
      {/* Top Academic Navigation Bar (Authentic UOC FOT LMS Boost Theme) */}
      <header className="h-[60px] bg-white border-b border-[#e9ecef] sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between shadow-2xs">
        {/* Left: Brand + Real Role-Based Academic Tabs */}
        <div className="flex items-center gap-8 h-full">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-[#212529] tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-xl">🏛️</span>
            <span>{tenant.shortName}</span>
          </Link>

          {/* Role-Specific Horizontal Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {/* 1. Home Tab (Faculty Announcements & Categories - Moodle Frontpage) */}
            <Link 
              href="/home" 
              className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                pathname === "/home" 
                  ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                  : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
              }`}
            >
              Home
            </Link>

            {/* 2. Common Dashboard Tab */}
            <Link 
              href="/" 
              className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                pathname === "/" 
                  ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                  : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
              }`}
            >
              Dashboard
            </Link>

            {/* STUDENT SPECIFIC TABS */}
            {user.role === "student" && (
              <>
                <Link 
                  href="/courses" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname.startsWith("/courses") && !pathname.includes("exams")
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  My courses
                </Link>

                <Link 
                  href="/assignments" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/assignments"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Assignments
                </Link>

                <Link 
                  href="/exams" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname.includes("exams")
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Examinations
                </Link>
              </>
            )}

            {/* LECTURER SPECIFIC TABS */}
            {user.role === "lecturer" && (
              <>
                <Link 
                  href="/courses" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/courses"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  My courses
                </Link>

                <Link 
                  href="/lecturer/grading" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/lecturer/grading"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Grading Desk
                </Link>

                <Link 
                  href="/lecturer/assessments" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/lecturer/assessments"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Assessments Creator
                </Link>

                <Link 
                  href="/lecturer/attendance" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/lecturer/attendance"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Mark Attendance
                </Link>
              </>
            )}

            {/* ADMINISTRATOR SPECIFIC TABS */}
            {user.role === "admin" && (
              <>
                <Link 
                  href="/admin" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/admin"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Site administration
                </Link>

                <Link 
                  href="/courses" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/courses"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Courses
                </Link>

                <Link 
                  href="/admin/users" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/admin/users"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Users & RBAC
                </Link>

                <Link 
                  href="/admin/reports" 
                  className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                    pathname === "/admin/reports"
                      ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                      : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
                  }`}
                >
                  Reports
                </Link>
              </>
            )}

            {/* SRS Audit Trail Tab */}
            <Link 
              href="/srs" 
              className={`h-full flex items-center px-3 text-xs font-mono font-medium transition-colors border-b-3 ${
                pathname === "/srs"
                  ? "border-[#0f6cbf] text-[#0f6cbf] font-semibold" 
                  : "border-transparent text-[#6c757d] hover:text-[#0f6cbf]"
              }`}
            >
              SRS 2026 Audit
            </Link>
          </nav>
        </div>

        {/* Right: Notifications, Messaging, Edit Mode, User Menu */}
        <div className="flex items-center gap-3">
          {/* Edit mode toggle switch (for Staff / Admins) */}
          {(user.role === "lecturer" || user.role === "admin") && (
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-[#dee2e6]">
              <span className="text-xs text-[#6c757d] font-medium select-none">Edit mode</span>
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  editMode ? "bg-[#0f6cbf]" : "bg-[#ced4da]"
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    editMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Notifications Icon with Red Badge (matching lms.tech.cmb.ac.lk count 23) */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 text-[#495057] hover:text-[#0f6cbf] hover:bg-[#f8f9fa] rounded-full transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 bg-[#dc3545] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">
                23
              </span>
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#dee2e6] rounded-xl shadow-lg z-50 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#e9ecef]">
                  <span className="font-bold text-[#212529]">Notifications</span>
                  <span className="text-[#0f6cbf] text-[11px] cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                    <div className="font-semibold text-[#212529]">IC 3204: Assignment 1 Released</div>
                    <div className="text-[#6c757d] text-[11px] mt-0.5">Software Quality Assurance Assignment 1 is due next week.</div>
                    <div className="text-[10px] text-[#0f6cbf] mt-1 font-mono">10 mins ago</div>
                  </div>
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                    <div className="font-semibold text-[#212529]">Semester 1 Exam Schedule</div>
                    <div className="text-[#6c757d] text-[11px] mt-0.5">End-Semester Examination timetable draft available on noticeboard.</div>
                    <div className="text-[10px] text-[#0f6cbf] mt-1 font-mono">1 hour ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messaging Bubble */}
          <Link href="/feedback" className="p-2 text-[#495057] hover:text-[#0f6cbf] hover:bg-[#f8f9fa] rounded-full transition-colors cursor-pointer" title="Messaging">
            <MessageSquare size={18} />
          </Link>

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#f8f9fa] rounded-lg transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#0f6cbf] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user.avatarInitials}
              </div>
              <div className="hidden lg:block leading-tight">
                <div className="text-xs font-semibold text-[#212529]">{user.displayName}</div>
                <div className="text-[10px] text-[#6c757d] font-mono">{user.indexNo || user.role}</div>
              </div>
              <ChevronDown size={14} className="text-[#6c757d]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#dee2e6] rounded-xl shadow-xl z-50 py-2 text-xs">
                <div className="px-4 py-2 border-b border-[#e9ecef] bg-[#f8f9fa]">
                  <div className="font-bold text-[#212529]">{user.name}</div>
                  <div className="text-[11px] text-[#6c757d] font-mono">{user.email}</div>
                  <div className="text-[10px] text-[#0f6cbf] font-semibold uppercase mt-0.5">{user.role} Account</div>
                </div>

                {/* ROLE SPECIFIC USER MENU LINKS */}
                <div className="py-1">
                  {user.role === "student" && (
                    <>
                      <Link href="/grades" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <BarChart size={14} className="text-[#0f6cbf]" /> Grades & Transcripts
                      </Link>
                      <Link href="/calendar" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Calendar size={14} className="text-[#0f6cbf]" /> Calendar & Timetable
                      </Link>
                      <Link href="/attendance" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Clock size={14} className="text-[#0f6cbf]" /> Attendance Records
                      </Link>
                      <Link href="/progress" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <ShieldCheck size={14} className="text-[#0f6cbf]" /> Progress & At-Risk Status
                      </Link>
                      <Link href="/certificates" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Award size={14} className="text-[#0f6cbf]" /> Certificates & Badges
                      </Link>
                    </>
                  )}

                  {user.role === "lecturer" && (
                    <>
                      <Link href="/lecturer/grading" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <CheckSquare size={14} className="text-[#0f6cbf]" /> Grading & Submissions
                      </Link>
                      <Link href="/lecturer/attendance" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Clock size={14} className="text-[#0f6cbf]" /> Session Attendance
                      </Link>
                      <Link href="/lecturer/at-risk" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Activity size={14} className="text-[#0f6cbf]" /> At-Risk Student Cases
                      </Link>
                      <Link href="/lecturer/reviews" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <BarChart size={14} className="text-[#0f6cbf]" /> Course Feedback Trends
                      </Link>
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Link href="/admin" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Activity size={14} className="text-[#0f6cbf]" /> Analytics Dashboard
                      </Link>
                      <Link href="/admin/branding" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Palette size={14} className="text-[#0f6cbf]" /> White-Label Studio
                      </Link>
                      <Link href="/admin/academic" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <FolderTree size={14} className="text-[#0f6cbf]" /> Academic Structure
                      </Link>
                      <Link href="/admin/audit" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <ShieldCheck size={14} className="text-[#0f6cbf]" /> System Audit Logs
                      </Link>
                      <Link href="/admin/tenants" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f8f9fa] text-[#495057]">
                        <Layers size={14} className="text-[#0f6cbf]" /> Institutional Tenants
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-[#e9ecef] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 font-medium text-left cursor-pointer"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Clean University Footer (FR-012) */}
      <footer className="border-t border-[#dee2e6] bg-white py-6 text-xs text-[#6c757d] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-semibold text-[#212529]">{tenant.name}</span>
            <p className="text-[11px] text-[#6c757d] mt-0.5">{tenant.footerText || `${tenant.shortName} • Multi-Tenant Academic Platform`}</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/srs" className="text-[#0f6cbf] hover:underline">SRS Baseline Verification</Link>
            <Link href="#" className="hover:underline">Cookies notice</Link>
            <Link href="#" className="hover:underline">Data retention</Link>
            <Link href="#" className="hover:underline">Contact site support</Link>
          </div>
        </div>
      </footer>

      {/* Discreet AI Academic Assistant Drawer */}
      <AIChatbotDrawer />
    </div>
  );
}
