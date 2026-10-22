"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  X,
  Building2
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface CalendarEventItem {
  id: string;
  day: number;
  month: number; // 9 = October (0-indexed)
  year: number;
  title: string;
  type: "site" | "category" | "course" | "user";
  time: string;
  courseCode?: string;
}

export default function CalendarAndTimetablePage() {
  const { tenant } = useTenant();

  const [activeTab, setActiveTab] = useState<"calendar" | "timetable">("calendar");
  const [viewMode, setViewMode] = useState<"month" | "upcoming">("month");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  // Event Key visibility toggles (FR-084, FR-085, FR-086)
  const [showSiteEvents, setShowSiteEvents] = useState(true);
  const [showCourseEvents, setShowCourseEvents] = useState(true);
  const [showCategoryEvents, setShowCategoryEvents] = useState(true);
  const [showUserEvents, setShowUserEvents] = useState(true);

  // New Event Modal state
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("2026-10-18");
  const [newEventType, setNewEventType] = useState<"site" | "course" | "user">("user");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Calendar events list
  const [events, setEvents] = useState<CalendarEventItem[]>([
    { id: "ev-1", day: 7, month: 9, year: 2026, title: "Mid-Semester Examinations Commencement", type: "site", time: "09:00 AM" },
    { id: "ev-2", day: 8, month: 9, year: 2026, title: "IC 3101: Midterm Online Examination", type: "course", courseCode: "IC 3101", time: "10:00 AM - 11:30 AM" },
    { id: "ev-3", day: 15, month: 9, year: 2026, title: "IC 3101: Raft Go Mini-Project Due", type: "course", courseCode: "IC 3101", time: "11:59 PM" },
    { id: "ev-4", day: 16, month: 9, year: 2026, title: "IC 3204: Assignment 1 Due", type: "course", courseCode: "IC 3204", time: "11:59 PM" },
    { id: "ev-5", day: 21, month: 9, year: 2026, title: "IC 3102: Practical Lab 2 Due", type: "course", courseCode: "IC 3102", time: "11:59 PM" },
    { id: "ev-6", day: 24, month: 9, year: 2026, title: "Study Advisory Consultation Hours", type: "user", time: "02:00 PM - 04:00 PM" }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const parts = newEventDate.split("-");
    const d = parseInt(parts[2], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[0], 10);

    const newEv: CalendarEventItem = {
      id: `ev-${Date.now()}`,
      day: d,
      month: m,
      year: y,
      title: newEventTitle.trim(),
      type: newEventType,
      time: "10:00 AM"
    };

    setEvents(prev => [...prev, newEv]);
    setNewEventTitle("");
    setNewEventModalOpen(false);
    setNotificationMsg(`Event "${newEv.title}" added to calendar.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Filtered events
  const visibleEvents = events.filter(e => {
    if (e.type === "site" && !showSiteEvents) return false;
    if (e.type === "course" && !showCourseEvents) return false;
    if (e.type === "category" && !showCategoryEvents) return false;
    if (e.type === "user" && !showUserEvents) return false;
    if (courseFilter !== "all" && e.courseCode && e.courseCode !== courseFilter) return false;
    return true;
  });

  // October 2026 calendar days generation (Oct 1 starts on Thursday)
  // Calendar days: 31 days. Monday = 1, Thu = 4. Leading days from Sep: 28, 29, 30.
  const daysInMonth = 31;
  const startDayOfWeek = 4; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu
  const calendarCells = [];

  // Leading empty/prior month days
  for (let i = 1; i < startDayOfWeek; i++) {
    calendarCells.push({ dayNumber: 27 + i, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ dayNumber: i, isCurrentMonth: true });
  }
  // Trailing next month days to complete 35 cells
  const remaining = 35 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({ dayNumber: i, isCurrentMonth: false });
  }

  // Lecture Timetable
  const timetable = [
    { day: "Monday", slots: [
      { time: "09:00 AM - 12:00 PM", course: "IC 3102", title: "Distributed Database Systems & Cloud Sharding", venue: "Lab 03 (Tech Tower)", lecturer: "Dr. K. A. S. Fernando" },
      { time: "01:00 PM - 03:00 PM", course: "IC 3103", title: "Enterprise Information Security & Governance", venue: "Lecture Hall 02", lecturer: "Eng. Chathura Silva" }
    ]},
    { day: "Tuesday", slots: [
      { time: "10:00 AM - 01:00 PM", course: "ET 2105", title: "Embedded Systems & IoT Lab", venue: "Hardware Systems Lab", lecturer: "Dr. R. M. Wijesinghe" }
    ]},
    { day: "Wednesday", slots: [
      { time: "08:30 AM - 11:30 AM", course: "IC 3204", title: "Introduction to Software Quality Assurance", venue: "Online Lecture (Zoom)", lecturer: "Dr. Aruna Pathirana" }
    ]},
    { day: "Thursday", slots: [
      { time: "01:00 PM - 04:00 PM", course: "IC 3101", title: "Advanced Web Application Architectures Lab", venue: "Cloud Computing Lab 01", lecturer: "Dr. Aruna Pathirana" }
    ]},
    { day: "Friday", slots: [
      { time: "09:00 AM - 11:00 AM", course: "Advisory", title: "Faculty Consultation & Office Hours", venue: "Department Boardroom", lecturer: "DICT Faculty Mentors" }
    ]}
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dee2e6] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#6c757d] font-medium mb-1">
            <Link href="/" className="hover:text-[#0f6cbf]">Dashboard</Link>
            <span>/</span>
            <span className="text-[#212529]">Academic Calendar & Timetable</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#212529]">Calendar & Lecture Timetable</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-[#e9ecef] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === "calendar" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              <CalendarIcon size={14} /> Month Calendar (FR-084)
            </button>
            <button
              onClick={() => setActiveTab("timetable")}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === "timetable" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              <Clock size={14} /> Weekly Timetable (FR-088)
            </button>
          </div>

          <button
            onClick={() => setNewEventModalOpen(true)}
            className="px-3 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus size={14} /> New event
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-green-700 font-bold">×</button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. INTERACTIVE MOODLE MONTH CALENDAR VIEW (FR-084 - FR-087) */}
      {/* ======================================================== */}
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Month Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-4">
              {/* Calendar Toolbar (Month navigation + Course selector) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-3">
                <div className="flex items-center gap-3">
                  <button className="p-1.5 rounded border border-[#ced4da] hover:bg-[#f8f9fa] text-[#495057] cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <h2 className="text-base font-bold text-[#212529]">
                    October 2026
                  </h2>
                  <button className="p-1.5 rounded border border-[#ced4da] hover:bg-[#f8f9fa] text-[#495057] cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="text-xs border border-[#ced4da] rounded-md px-2.5 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden"
                  >
                    <option value="all">Detailed course: All courses</option>
                    <option value="IC 3204">IC 3204 - Software Quality Assurance</option>
                    <option value="IC 3101">IC 3101 - Web Application Architectures</option>
                    <option value="IC 3102">IC 3102 - Distributed Database Systems</option>
                  </select>

                  <div className="flex bg-[#f8f9fa] border border-[#ced4da] rounded-md p-0.5 text-xs">
                    <button
                      onClick={() => setViewMode("month")}
                      className={`px-2 py-1 rounded cursor-pointer ${
                        viewMode === "month" ? "bg-white font-bold text-[#0f6cbf] shadow-2xs" : "text-[#6c757d]"
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setViewMode("upcoming")}
                      className={`px-2 py-1 rounded cursor-pointer ${
                        viewMode === "upcoming" ? "bg-white font-bold text-[#0f6cbf] shadow-2xs" : "text-[#6c757d]"
                      }`}
                    >
                      Upcoming
                    </button>
                  </div>
                </div>
              </div>

              {/* Month Grid View */}
              {viewMode === "month" ? (
                <div className="border border-[#dee2e6] rounded-lg overflow-hidden">
                  {/* Days Header */}
                  <div className="grid grid-cols-7 bg-[#f8f9fa] border-b border-[#dee2e6] text-center text-xs font-bold text-[#495057] py-2.5">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>

                  {/* Date Cells */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-[#e9ecef] text-xs">
                    {calendarCells.map((cell, idx) => {
                      const dayEvents = cell.isCurrentMonth
                        ? visibleEvents.filter(e => e.day === cell.dayNumber && e.month === 9)
                        : [];
                      const isToday = cell.isCurrentMonth && cell.dayNumber === 8;

                      return (
                        <div
                          key={idx}
                          className={`min-h-[92px] p-1.5 transition-colors ${
                            cell.isCurrentMonth ? "bg-white" : "bg-[#f8f9fa]/60 text-[#adb5bd]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full font-mono text-[11px] ${
                                isToday
                                  ? "bg-[#0f6cbf] text-white font-bold"
                                  : cell.isCurrentMonth ? "text-[#212529] font-medium" : "text-[#adb5bd]"
                              }`}
                            >
                              {cell.dayNumber}
                            </span>
                          </div>

                          {/* Events Bullets / Pills */}
                          <div className="space-y-1">
                            {dayEvents.map(ev => {
                              const badgeBg = 
                                ev.type === "site" ? "bg-green-100 text-green-800 border-green-200" :
                                ev.type === "course" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                "bg-blue-100 text-blue-800 border-blue-200";

                              return (
                                <div
                                  key={ev.id}
                                  className={`p-1 rounded text-[10px] font-medium border leading-tight truncate cursor-pointer hover:opacity-90 ${badgeBg}`}
                                  title={`${ev.title} (${ev.time})`}
                                >
                                  {ev.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Upcoming Events List */
                <div className="divide-y divide-[#e9ecef] border border-[#dee2e6] rounded-lg">
                  {visibleEvents.map(ev => (
                    <div key={ev.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#f8f9fa]">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0f6cbf]">October {ev.day}, 2026</span>
                        <h3 className="text-sm font-bold text-[#212529] mt-0.5">{ev.title}</h3>
                        <span className="text-xs text-[#6c757d]">{ev.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ev.type === "site" ? "bg-green-100 text-green-800" :
                        ev.type === "course" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Events Key Legend (Authentic Moodle Calendar Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#e9ecef] pb-2">
                Events key
              </h3>

              <div className="space-y-3 text-xs">
                {/* Site Event Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[#212529] font-medium">Site event</span>
                  </div>
                  <button
                    onClick={() => setShowSiteEvents(!showSiteEvents)}
                    className="text-[#6c757d] hover:text-[#0f6cbf] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {showSiteEvents ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                  </button>
                </div>

                {/* Course Event Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-[#212529] font-medium">Course event</span>
                  </div>
                  <button
                    onClick={() => setShowCourseEvents(!showCourseEvents)}
                    className="text-[#6c757d] hover:text-[#0f6cbf] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {showCourseEvents ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                  </button>
                </div>

                {/* User Event Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-[#212529] font-medium">User event</span>
                  </div>
                  <button
                    onClick={() => setShowUserEvents(!showUserEvents)}
                    className="text-[#6c757d] hover:text-[#0f6cbf] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {showUserEvents ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                  </button>
                </div>

                {/* Category Event Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-[#212529] font-medium">Category event</span>
                  </div>
                  <button
                    onClick={() => setShowCategoryEvents(!showCategoryEvents)}
                    className="text-[#6c757d] hover:text-[#0f6cbf] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {showCategoryEvents ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Mini Navigator */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#e9ecef] pb-2">
                Monthly Quick View
              </h3>
              <p className="text-xs text-[#6c757d] leading-relaxed">
                Click any highlighted cell to view assessment deadlines or schedule private consultation entries.
              </p>
              <div className="p-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-xs space-y-1.5 font-mono">
                <div>Total Active Deadlines: <strong>4</strong></div>
                <div>Exams Scheduled: <strong>2</strong></div>
                <div>Current Semester: <strong>Semester 1</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. WEEKLY LECTURE TIMETABLE VIEW (FR-088)                  */}
      {/* ======================================================== */}
      {activeTab === "timetable" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {timetable.map((t) => (
              <div key={t.day} className="bg-white border border-[#dee2e6] rounded-xl shadow-2xs overflow-hidden">
                <div className="py-3 px-5 border-b border-[#e9ecef] bg-[#f8f9fa] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#212529]">{t.day}</h3>
                  <span className="text-[11px] font-mono text-[#6c757d]">{t.slots.length} Lecture Sessions</span>
                </div>
                <div className="divide-y divide-[#e9ecef] text-xs">
                  {t.slots.map((s, idx) => (
                    <div key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-[#f8f9fa] transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0f6cbf] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                            {s.course}
                          </span>
                          <span className="font-bold text-sm text-[#212529]">{s.title}</span>
                        </div>
                        <div className="text-[#6c757d] flex items-center gap-4 text-[11px] pt-1">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {s.venue}</span>
                          <span>Lecturer: {s.lecturer}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono font-semibold text-[#495057] text-xs bg-[#f8f9fa] px-3 py-1.5 rounded border border-[#ced4da]">
                        <Clock size={14} className="text-[#0f6cbf]" />
                        <span>{s.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE NEW CALENDAR EVENT                           */}
      {/* ======================================================== */}
      {newEventModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <h3 className="text-sm font-bold text-[#212529]">New event</h3>
              <button onClick={() => setNewEventModalOpen(false)} className="text-[#6c757d] hover:text-[#212529]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Event title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study Group / Practical Consultation"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Type of event</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden"
                  >
                    <option value="user">User event</option>
                    <option value="course">Course event</option>
                    <option value="site">Site event</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e9ecef]">
                <button
                  type="button"
                  onClick={() => setNewEventModalOpen(false)}
                  className="px-4 py-2 border border-[#ced4da] rounded-md font-semibold text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f6cbf] text-white rounded-md font-semibold hover:bg-[#0d5ca3] cursor-pointer"
                >
                  Save event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
