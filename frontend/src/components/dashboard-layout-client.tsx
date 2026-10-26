"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  FileText,
  Menu,
  X
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { AIChatbotDrawer } from "@/components/ai-chatbot";
import { canAccessRoute, getDashboardPath } from "@/lib/auth-routing";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { sessionReady, isAuthenticated, user } = useTenant();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (sessionReady && !isAuthenticated) {
      const query = searchParams.toString();
      const next = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [sessionReady, isAuthenticated, pathname, searchParams, router]);

  // Wait for browser storage before mounting pages or their effects. This also
  // prevents another role's dashboard flashing during a refresh or new tab.
  if (!sessionReady || !isAuthenticated) {
    return <div className="min-h-screen w-full grid place-items-center text-sm text-[#6c757d]" role="status">{sessionReady ? "Opening login…" : "Restoring your session…"}</div>;
  }

  return <DashboardChrome key={`${user.username}:${user.role}:${pathname}`}>
    {canAccessRoute(pathname, user.role) ? children : (
      <section className="rounded-xl border bg-white p-8 space-y-3">
        <h1 className="text-xl font-bold">This page is for a different account role</h1>
        <p className="text-sm text-[#6c757d]">You are signed in as a {user.role}. Choose your dashboard to continue.</p>
        <Link href={getDashboardPath(user.role)} className="inline-block text-[#0f6cbf] underline">Go to my dashboard</Link>
      </section>
    )}
  </DashboardChrome>;
}

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant, user, logout, editMode, setEditMode } = useTenant();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dashboard = getDashboardPath(user.role);
  const navigation = [
    { href: "/home", label: "Home" },
    { href: dashboard, label: "Dashboard" },
    { href: "/courses", label: "My courses" },
    ...(user.role === "student" ? [
      { href: "/assignments", label: "Assignments" }, { href: "/exams", label: "Examinations" },
    ] : user.role === "lecturer" ? [
      { href: "/lecturer/grading", label: "Grading" }, { href: "/lecturer/assessments", label: "Assessments" }, { href: "/lecturer/attendance", label: "Attendance" },
    ] : [
      { href: "/admin/users", label: "Users & roles" }, { href: "/admin/reports", label: "Reports" },
    ]),
  ];
  const mobileNavigation = [...navigation, ...(user.role === "student" ? [
    { href: "/grades", label: "Grades & transcripts" }, { href: "/calendar", label: "Calendar" },
    { href: "/attendance", label: "Attendance" }, { href: "/progress", label: "Progress" },
    { href: "/certificates", label: "Certificates" },
  ] : user.role === "lecturer" ? [
    { href: "/lecturer/at-risk", label: "At-risk students" }, { href: "/lecturer/reviews", label: "Course feedback" },
  ] : [
    { href: "/admin/academic", label: "Academic structure" }, { href: "/admin/branding", label: "Branding" },
    { href: "/admin/tenants", label: "Institutions" }, { href: "/admin/audit", label: "Audit logs" },
  ]), { href: "/feedback", label: "Feedback" }, { href: "/help", label: "Help" }, { href: "/srs", label: "SRS audit" }];

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setUserDropdownOpen(false);
        setNotifDropdownOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        document.querySelector<HTMLButtonElement>('[aria-expanded="true"]')?.focus();
        setUserDropdownOpen(false);
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="lms-shell min-h-screen w-full bg-[#f8f9fa] text-[#212529] flex flex-col font-sans">
      {/* Top Academic Navigation Bar (Authentic UOC FOT LMS Boost Theme) */}
      <header ref={headerRef} className="h-[60px] bg-white border-b border-[#e9ecef] sticky top-0 z-40 px-3 lg:px-6 flex items-center justify-between gap-2 shadow-2xs">
        {/* Left: Brand + Real Role-Based Academic Tabs */}
        <div className="flex items-center gap-4 h-full min-w-0">
          <Link href={dashboard} className="flex items-center gap-2 font-bold text-sm sm:text-lg min-w-0 text-[#212529] tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-xl">🏛️</span>
            <span className="truncate max-w-28 sm:max-w-52">{tenant.shortName}</span>
          </Link>

          {/* Role-Specific Horizontal Navigation Tabs */}
          <nav aria-label="Main navigation" className="hidden 2xl:flex items-center gap-1 h-full">
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
              href={dashboard}
              className={`h-full flex items-center px-3.5 text-sm font-medium transition-colors border-b-3 ${
                pathname === dashboard
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
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Edit mode toggle switch (for Staff / Admins) */}
          {(user.role === "lecturer" || user.role === "admin") && (
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-[#dee2e6]">
              <span className="text-xs text-[#6c757d] font-medium select-none">Edit mode</span>
              <button
                type="button"
                aria-label="Edit mode"
                role="switch"
                aria-checked={editMode}
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
              onClick={() => { setNotifDropdownOpen(!notifDropdownOpen); setUserDropdownOpen(false); }}
              aria-label="Notifications"
              aria-expanded={notifDropdownOpen}
              aria-controls="notifications-panel"
              className="p-2 text-[#495057] hover:text-[#0f6cbf] hover:bg-[#f8f9fa] rounded-full transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              {!notificationsRead && <span className="absolute top-1 right-1 bg-[#dc3545] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">2</span>}
            </button>

            {notifDropdownOpen && (
              <div id="notifications-panel" className="fixed top-16 inset-x-3 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 mt-2 sm:w-72 max-h-[calc(100dvh-6rem)] overflow-y-auto bg-white border border-[#dee2e6] rounded-xl shadow-lg z-50 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#e9ecef]">
                  <span className="font-bold text-[#212529]">Notifications</span>
                  <button onClick={() => setNotificationsRead(true)} disabled={notificationsRead} className="text-[#0f6cbf] text-[11px] hover:underline disabled:text-slate-400">{notificationsRead ? "All read" : "Mark all read"}</button>
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
              onClick={() => { setUserDropdownOpen(!userDropdownOpen); setNotifDropdownOpen(false); }}
              aria-label="Account menu"
              aria-expanded={userDropdownOpen}
              aria-controls="account-panel"
              className="flex items-center gap-2 p-1.5 hover:bg-[#f8f9fa] rounded-lg transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#0f6cbf] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user.avatarInitials}
              </div>
              <div className="hidden xl:block leading-tight">
                <div className="text-xs font-semibold text-[#212529]">{user.displayName}</div>
                <div className="text-[10px] text-[#6c757d] font-mono">{user.indexNo || user.role}</div>
              </div>
              <ChevronDown size={14} className="text-[#6c757d]" />
            </button>

            {userDropdownOpen && (
              <div id="account-panel" className="fixed top-16 inset-x-3 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 mt-2 sm:w-64 max-h-[calc(100dvh-6rem)] overflow-y-auto break-words bg-white border border-[#dee2e6] rounded-xl shadow-xl z-50 py-2 text-xs">
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

      <div className="sm:hidden border-b bg-white px-3 py-2">
        <button type="button" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setUserDropdownOpen(false); setNotifDropdownOpen(false); }} className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold text-[#0f6cbf]">
          <span className="flex items-center gap-2">{mobileMenuOpen ? <X size={18} /> : <Menu size={18} />} Menu</span>
          <span className="text-xs capitalize text-[#6c757d]">{user.role}</span>
        </button>
        {mobileMenuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="grid grid-cols-2 gap-1 pt-2">
          {mobileNavigation.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-blue-50 text-[#0f6cbf] font-semibold" : "text-[#495057] hover:bg-slate-50"}`}>{label}</Link>)}
          {user.role !== "student" && <button type="button" role="switch" aria-checked={editMode} onClick={() => setEditMode(!editMode)} className="col-span-2 rounded-lg border px-3 py-2 text-left text-sm">Edit mode: {editMode ? "On" : "Off"}</button>}
        </nav>}
      </div>
      <nav aria-label="Compact navigation" className="hidden sm:flex 2xl:hidden items-center gap-1 overflow-x-auto border-b bg-white px-3 py-2">
        {navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`shrink-0 rounded-lg px-3 py-2 text-xs ${pathname === href ? "bg-blue-50 text-[#0f6cbf] font-semibold" : "text-[#495057] hover:bg-slate-50"}`}>{label}</Link>)}
      </nav>
      <p className="bg-blue-50 border-b border-blue-100 text-blue-800 text-xs px-4 py-2 text-center">Demo workspace · Sample data. Actions are not sent to a university server.</p>

      {/* Main Page Content */}
      <main className="lms-content flex-1 w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {children}
      </main>

      {/* Clean University Footer (FR-012) */}
      <footer className="border-t border-[#dee2e6] bg-white pt-6 pb-24 sm:pb-6 text-xs text-[#6c757d] mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-semibold text-[#212529]">{tenant.name}</span>
            <p className="text-[11px] text-[#6c757d] mt-0.5">{tenant.footerText || `${tenant.shortName} • Multi-Tenant Academic Platform`}</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-[11px]">
            <Link href="/srs" className="text-[#0f6cbf] hover:underline">SRS Baseline Verification</Link>
            <Link href="/help#storage" className="hover:underline">Browser data</Link>
            <Link href="/help#support" className="hover:underline">Contact site support</Link>
          </div>
        </div>
      </footer>

      {/* Discreet AI Academic Assistant Drawer */}
      <AIChatbotDrawer key={`${user.username}:${tenant.id}`} />
    </div>
  );
}
