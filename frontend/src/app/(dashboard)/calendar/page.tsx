"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
  X
} from "lucide-react";
import { calendarDateKey, calendarMonthCells, parseCalendarDate } from "@/lib/calendar-dates";

interface CalendarEventItem {
  id: string;
  day: number;
  month: number; // 0-indexed
  year: number;
  title: string;
  type: "site" | "category" | "course" | "user";
  time: string;
  courseCode?: string;
}

function sampleDateOffset(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
}

export default function CalendarAndTimetablePage() {
  const [today] = useState(() => new Date());
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
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
  const [newEventDate, setNewEventDate] = useState(() => calendarDateKey(today));
  const [newEventType, setNewEventType] = useState<"site" | "course" | "user">("user");
  const [newEventCourse, setNewEventCourse] = useState("IC 3204");
  const [newEventError, setNewEventError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Calendar events list
  const [events, setEvents] = useState<CalendarEventItem[]>(() => [
    { id: "ev-1", ...sampleDateOffset(1), title: "Mid-Semester Examinations Commencement", type: "site", time: "09:00 AM" },
    { id: "ev-2", ...sampleDateOffset(2), title: "IC 3101: Midterm Online Examination", type: "course", courseCode: "IC 3101", time: "10:00 AM - 11:30 AM" },
    { id: "ev-3", ...sampleDateOffset(4), title: "IC 3101: Raft Go Mini-Project Due", type: "course", courseCode: "IC 3101", time: "11:59 PM" },
    { id: "ev-4", ...sampleDateOffset(7), title: "IC 3204: Assignment 1 Due", type: "course", courseCode: "IC 3204", time: "11:59 PM" },
    { id: "ev-5", ...sampleDateOffset(10), title: "IC 3102: Practical Lab 2 Due", type: "course", courseCode: "IC 3102", time: "11:59 PM" },
    { id: "ev-6", ...sampleDateOffset(14), title: "Study Advisory Consultation Hours", type: "user", time: "02:00 PM - 04:00 PM" }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const date = parseCalendarDate(newEventDate);
    if (!newEventTitle.trim() || !date) {
      setNewEventError("Enter an event title and a valid date.");
      return;
    }

    const newEv: CalendarEventItem = {
      id: crypto.randomUUID(),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      title: newEventTitle.trim(),
      type: newEventType,
      time: "All day",
      courseCode: newEventType === "course" ? newEventCourse : undefined
    };

    setEvents(prev => [...prev, newEv]);
    setNewEventTitle("");
    setNewEventError("");
    setNewEventModalOpen(false);
    setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setActiveTab("calendar");
    setViewMode("month");
    setCourseFilter("all");
    if (newEv.type === "site") setShowSiteEvents(true);
    if (newEv.type === "course") setShowCourseEvents(true);
    if (newEv.type === "user") setShowUserEvents(true);
    setNotificationMsg(`Event "${newEv.title}" added for this visit. Demo events are not saved to a database.`);
  };

  // Filtered events
  const visibleEvents = events.filter(e => {
    if (e.type === "site" && !showSiteEvents) return false;
    if (e.type === "course" && !showCourseEvents) return false;
    if (e.type === "category" && !showCategoryEvents) return false;
    if (e.type === "user" && !showUserEvents) return false;
    if (courseFilter !== "all" && e.courseCode && e.courseCode !== courseFilter) return false;
    return true;
  }).sort((a, b) => new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime());

  const calendarCells = calendarMonthCells(displayedMonth);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcomingEvents = visibleEvents.filter((event) => new Date(event.year, event.month, event.day) >= startOfToday);
  const monthEvents = visibleEvents.filter((event) => event.month === displayedMonth.getMonth() && event.year === displayedMonth.getFullYear());
  const monthLabel = displayedMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const moveMonth = (offset: number) => {
    setDisplayedMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const openNewEvent = (date: Date) => {
    setNewEventDate(calendarDateKey(date));
    setNewEventError("");
    setNewEventModalOpen(true);
  };

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
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[#6c757d] font-medium mb-1">
            <Link href="/" className="hover:text-[#0f6cbf]">Dashboard</Link>
            <span>/</span>
            <span className="text-[#212529]">Academic Calendar & Timetable</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#212529]">Calendar & Lecture Timetable</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-[#e9ecef] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === "calendar" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              <CalendarIcon size={14} /> Month Calendar
            </button>
            <button
              onClick={() => setActiveTab("timetable")}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === "timetable" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              <Clock size={14} /> Weekly Timetable
            </button>
          </div>

          <button
            onClick={() => openNewEvent(today)}
            className="px-3 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus size={14} /> New event
          </button>
        </div>
      </div>

      <p className="text-xs text-[#6c757d]">Sample academic schedule. New events are kept for this visit only and reset when you leave or refresh this page.</p>

      {/* Notification Toast */}
      {notificationMsg && (
        <div role="status" className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} aria-label="Dismiss notification" className="text-green-700 font-bold">×</button>
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
                  <button onClick={() => moveMonth(-1)} aria-label="Previous month" className="p-1.5 rounded border border-[#ced4da] hover:bg-[#f8f9fa] text-[#495057] cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <h2 className="text-base font-bold text-[#212529]">
                    {viewMode === "month" ? monthLabel : "Upcoming events"}
                  </h2>
                  <button onClick={() => moveMonth(1)} aria-label="Next month" className="p-1.5 rounded border border-[#ced4da] hover:bg-[#f8f9fa] text-[#495057] cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                  <button onClick={() => { setDisplayedMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setViewMode("month"); }} className="text-xs text-[#0f6cbf] hover:underline">Today</button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter calendar by course"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full min-w-0 text-xs border border-[#ced4da] rounded-md px-2.5 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden"
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
                    {calendarCells.map((cell) => {
                      const dayEvents = visibleEvents.filter(e => e.day === cell.dayNumber && e.month === cell.date.getMonth() && e.year === cell.date.getFullYear());
                      const isToday = calendarDateKey(cell.date) === calendarDateKey(today);

                      return (
                        <div
                          key={calendarDateKey(cell.date)}
                          className={`min-w-0 min-h-[92px] p-0.5 sm:p-1.5 transition-colors ${
                            cell.isCurrentMonth ? "bg-white" : "bg-[#f8f9fa]/60 text-[#adb5bd]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <button
                              type="button"
                              onClick={() => openNewEvent(cell.date)}
                              aria-label={`Add event on ${cell.date.toLocaleDateString("en-GB")}`}
                              aria-current={isToday ? "date" : undefined}
                              className={`w-full sm:w-8 h-10 sm:h-8 flex items-center justify-center rounded-full font-mono text-[11px] ${
                                isToday
                                  ? "bg-[#0f6cbf] text-white font-bold"
                                  : cell.isCurrentMonth ? "text-[#212529] font-medium" : "text-[#adb5bd]"
                              }`}
                            >
                              {cell.dayNumber}
                            </button>
                          </div>

                          {/* Events Bullets / Pills */}
                          <div className="space-y-1">
                            {dayEvents.map(ev => {
                              const badgeBg = 
                                ev.type === "site" ? "bg-green-100 text-green-800 border-green-200" :
                                ev.type === "course" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                ev.type === "category" ? "bg-purple-100 text-purple-800 border-purple-200" :
                                "bg-blue-100 text-blue-800 border-blue-200";

                              return (
                                <button
                                  key={ev.id}
                                  type="button"
                                  onClick={() => setSelectedEvent(ev)}
                                  className={`block w-full text-left p-1 rounded text-[10px] font-medium border leading-tight truncate cursor-pointer hover:opacity-90 ${badgeBg}`}
                                  title={`${ev.title} (${ev.time})`}
                                >
                                  {ev.title}
                                </button>
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
                  {upcomingEvents.length === 0 && <p role="status" className="p-6 text-sm text-center text-[#6c757d]">No upcoming events match the selected filters.</p>}
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#f8f9fa]">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0f6cbf]">{new Date(ev.year, ev.month, ev.day).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                        <h3 className="text-sm font-bold text-[#212529] mt-0.5">{ev.title}</h3>
                        <span className="text-xs text-[#6c757d]">{ev.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ev.type === "site" ? "bg-green-100 text-green-800" :
                        ev.type === "course" ? "bg-amber-100 text-amber-800" :
                        ev.type === "category" ? "bg-purple-100 text-purple-800" :
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
                  <div className="flex flex-wrap items-center gap-2">
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
                  <div className="flex flex-wrap items-center gap-2">
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
                  <div className="flex flex-wrap items-center gap-2">
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
                  <div className="flex flex-wrap items-center gap-2">
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
                Select an event to view details, or a date number to add an event for this visit.
              </p>
              <div className="p-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-xs space-y-1.5 font-mono">
                <div>Visible events in {monthLabel}: <strong>{monthEvents.length}</strong></div>
                <div>Upcoming visible events: <strong>{upcomingEvents.length}</strong></div>
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
                        <div className="flex flex-wrap items-center gap-2">
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
        <div className="lms-modal fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="new-event-heading" onKeyDown={(event) => { if (event.key === "Escape") setNewEventModalOpen(false); }} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <h3 id="new-event-heading" className="text-sm font-bold text-[#212529]">New event</h3>
              <button onClick={() => setNewEventModalOpen(false)} aria-label="Close new event" className="text-[#6c757d] hover:text-[#212529]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <p className="text-[#6c757d]">This demo event will be available until you leave or refresh this page.</p>
              {newEventError && <p role="alert" className="text-red-700">{newEventError}</p>}
              <div className="space-y-1">
                <label htmlFor="event-title" className="font-semibold text-[#495057]">Event title</label>
                <input
                  type="text"
                  id="event-title"
                  autoFocus
                  required
                  placeholder="e.g. Study Group / Practical Consultation"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="event-date" className="font-semibold text-[#495057]">Date</label>
                  <input
                    type="date"
                    id="event-date"
                    required
                    min="1900-01-01"
                    max="9999-12-31"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="event-type" className="font-semibold text-[#495057]">Type of event</label>
                  <select
                    id="event-type"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as "site" | "course" | "user")}
                    className="w-full p-2 border border-[#ced4da] rounded-md focus:border-[#0f6cbf] focus:outline-hidden"
                  >
                    <option value="user">User event</option>
                    <option value="course">Course event</option>
                    <option value="site">Site event</option>
                  </select>
                </div>
              </div>

              {newEventType === "course" && (
                <div className="space-y-1">
                  <label htmlFor="event-course" className="font-semibold text-[#495057]">Course</label>
                  <select id="event-course" value={newEventCourse} onChange={(event) => setNewEventCourse(event.target.value)} className="w-full p-2 border border-[#ced4da] rounded-md">
                    <option value="IC 3204">IC 3204 - Software Quality Assurance</option>
                    <option value="IC 3101">IC 3101 - Web Application Architectures</option>
                    <option value="IC 3102">IC 3102 - Distributed Database Systems</option>
                  </select>
                </div>
              )}

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

      {selectedEvent && (
        <div className="lms-modal fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="event-detail-heading" onKeyDown={(event) => { if (event.key === "Escape") setSelectedEvent(null); }} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 id="event-detail-heading" className="font-bold text-[#212529]">{selectedEvent.title}</h3>
            <p className="text-sm text-[#495057]">{new Date(selectedEvent.year, selectedEvent.month, selectedEvent.day).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {selectedEvent.time}</p>
            <p className="text-xs text-[#6c757d]">{selectedEvent.courseCode || `${selectedEvent.type} event`}</p>
            <button autoFocus onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-[#0f6cbf] text-white rounded-md text-xs font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
