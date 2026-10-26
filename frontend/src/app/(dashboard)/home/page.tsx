"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Pin,
  X,
  FileArchive,
  FileText,
  MessageSquare,
  Maximize2,
  ZoomIn
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { calendarDateKey, calendarMonthCells } from "@/lib/calendar-dates";

interface AnnouncementItem {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  date: string;
  content: string;
  attachment?: string;
  attachmentSize?: string;
  pinned?: boolean;
  posterUrl?: string;
  posterCaption?: string;
}

export default function HomePage() {
  const { tenant, user, editMode } = useTenant();

  // FR-090: Administrators (or lecturers with edit mode) can manage site-wide announcements
  const canManageAnnouncements = user.role === "admin" || (user.role === "lecturer" && editMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [sidebarOpen] = useState(true);

  // Real announcements matching lms.tech.cmb.ac.lk exactly
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: "ann-1",
      title: "Global Academic Opportunities for Undergraduates - Fall 2026",
      author: "Dr. N. T. Weerawarna",
      authorInitials: "NW",
      date: "Wednesday, 7 October 2026, 10:23 PM",
      content: "Dear Students,\n\nThe International Affairs Division at the University of Colombo announces fully-funded student exchange programs for level 2 and level 3 undergraduates.\n\n🔹 Partner Universities: National University of Singapore (NUS) & Tokyo Institute of Technology.\n⏰ Application Deadline: 31st October 2026.\n📍 Interested students are invited to join the briefing session at the Dean's Office Boardroom.",
      attachment: "Global_Exchange_Guidelines_2026.pdf",
      attachmentSize: "840 KB",
      pinned: true,
      posterUrl: "/posters/faculty_day_poster.jpg",
      posterCaption: "Official Global Exchange & Academic Excellence Flyer"
    },
    {
      id: "ann-2",
      title: "Faculty Day 2026 — General Notice to All Students & Academic Staff",
      author: "Senior Assistant Registrar / Administration",
      authorInitials: "AR",
      date: "Monday, 6 October 2026, 09:30 AM",
      content: "Please be informed that the Faculty of Technology Annual Day celebration will be held at the Main Auditorium, Pitipana Campus.\n\nAll registered students are requested to be seated by 08:45 AM. Normal lectures will be rescheduled accordingly.",
      attachment: "Faculty_Day_2026_Agenda_and_Schedule.pdf",
      attachmentSize: "485 KB",
      pinned: true,
      posterUrl: "/posters/faculty_day_poster.jpg",
      posterCaption: "Faculty Day 2026 Celebration Poster & Schedule"
    },
    {
      id: "ann-3",
      title: "Awarding Mahapola Higher Education Scholarship Scheme — 3rd Installment (2022/2023 Batch)",
      author: "Chathurika Silva",
      authorInitials: "CS",
      date: "Friday, 3 October 2026, 02:15 PM",
      content: "Eligible students for the Mahapola Higher Education Scholarship (Merit and Ordinary) for the academic year 2022/2023 are requested to check the verified bank account list attached.\n\nIn case of any discrepancies with account numbers, contact the welfare division before 14th October 2026.",
      attachment: "fwdmahapola_installment03_october.zip",
      attachmentSize: "1.8 MB",
      pinned: false
    },
    {
      id: "ann-4",
      title: "Call for Submissions — Annual Technology Research Symposium (ATRS 2026)",
      author: "Research & Higher Degrees Committee",
      authorInitials: "RC",
      date: "Wednesday, 1 October 2026, 11:00 AM",
      content: "Undergraduate final year students and postgraduates are cordially invited to submit extended abstracts for the 4th Annual Technology Research Symposium.\n\nThe theme for this year is 'Sustainable Computing and Resilient Agro-Industrial Technologies'.",
      attachment: "ATRS_2026_Call_For_Abstracts_Template.docx",
      attachmentSize: "320 KB",
      pinned: false,
      posterUrl: "/posters/atrs_2026_symposium.jpg",
      posterCaption: "ATRS 2026 Call for Papers & Extended Abstracts Poster"
    }
  ]);

  // Modal states for Admin authoring
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAttachment, setFormAttachment] = useState("");
  const [formAttachmentSize, setFormAttachmentSize] = useState("");
  const [formPosterUrl, setFormPosterUrl] = useState("");
  const [formPosterCaption, setFormPosterCaption] = useState("");
  const [formPinned, setFormPinned] = useState(false);

  // Fullscreen Image Lightbox state
  const [lightboxPosterUrl, setLightboxPosterUrl] = useState<string | null>(null);
  const [lightboxPosterCaption, setLightboxPosterCaption] = useState<string | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const miniCalendarCells = calendarMonthCells(calendarMonth);
  const miniCalendarLabel = calendarMonth.toLocaleDateString("en", { month: "long", year: "numeric" });

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormAuthor(user.displayName || "Senior Assistant Registrar");
    setFormContent("");
    setFormAttachment("");
    setFormAttachmentSize("");
    setFormPosterUrl("");
    setFormPosterCaption("");
    setFormPinned(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ann: AnnouncementItem) => {
    setEditingAnnId(ann.id);
    setFormTitle(ann.title);
    setFormAuthor(ann.author);
    setFormContent(ann.content);
    setFormAttachment(ann.attachment || "");
    setFormAttachmentSize(ann.attachmentSize || "");
    setFormPosterUrl(ann.posterUrl || "");
    setFormPosterCaption(ann.posterCaption || "");
    setFormPinned(!!ann.pinned);
    setIsEditModalOpen(true);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const now = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const initials = formAuthor
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: formTitle.trim(),
      author: formAuthor.trim() || "Senior Assistant Registrar",
      authorInitials: initials,
      date: now,
      content: formContent.trim(),
      attachment: formAttachment.trim() || undefined,
      attachmentSize: formAttachment.trim() ? (formAttachmentSize.trim() || "1.2 MB") : undefined,
      pinned: formPinned,
      posterUrl: formPosterUrl.trim() || undefined,
      posterCaption: formPosterUrl.trim() ? (formPosterCaption.trim() || formTitle.trim()) : undefined
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setIsAddModalOpen(false);
    setNotificationMsg(`Announcement "${newAnn.title}" published to noticeboard.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnId || !formTitle.trim() || !formContent.trim()) return;

    setAnnouncements(prev => prev.map(ann => {
      if (ann.id !== editingAnnId) return ann;
      return {
        ...ann,
        title: formTitle.trim(),
        author: formAuthor.trim() || ann.author,
        content: formContent.trim(),
        attachment: formAttachment.trim() || undefined,
        attachmentSize: formAttachment.trim() ? (formAttachmentSize.trim() || ann.attachmentSize || "1.0 MB") : undefined,
        pinned: formPinned,
        posterUrl: formPosterUrl.trim() || undefined,
        posterCaption: formPosterUrl.trim() ? (formPosterCaption.trim() || formTitle.trim()) : undefined
      };
    }));

    setIsEditModalOpen(false);
    setEditingAnnId(null);
    setNotificationMsg("Announcement updated.");
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDeleteAnnouncement = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      setNotificationMsg("Announcement deleted.");
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id !== id) return ann;
      return { ...ann, pinned: !ann.pinned };
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Authentic Moodle Page Title (matches lms.tech.cmb.ac.lk heading) */}
      <div className="border-b border-[#dee2e6] pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212529] tracking-tight">
          Online Learning Management System, {tenant.name}
        </h1>
      </div>

      {/* 2. Authentic Faculty Building Hero Banner Card */}
      <div className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden shadow-2xs">
        <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden bg-slate-900">
          <img
            src="/images/uoc_fot_campus.jpg"
            alt="Faculty of Technology, University of Colombo Campus"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Moodle Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              Technology for a changing world.
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-2xl font-normal drop-shadow-xs leading-relaxed">
              Multidisciplinary education, research and innovation across agriculture, environment, engineering and digital technology.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-green-700 hover:text-green-900 font-bold p-1">×</button>
        </div>
      )}

      {/* 3. Main 2-Column Moodle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Area: Site Announcements & Course Search (8 cols) */}
        <div className={sidebarOpen ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* Site Announcements Card Container (Standard Moodle mod_forum Layout) */}
          <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-6">
            {/* Header: Title on Left, Actions on Right */}
            <div className="flex items-center justify-between border-b border-[#dee2e6] pb-3">
              <h2 className="text-lg font-bold text-[#212529]">
                Site announcements
              </h2>

              <div className="flex items-center gap-3">
                {canManageAnnouncements && (
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-3 py-1 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add new topic
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setNotificationMsg("Email subscriptions are unavailable in this frontend preview.")}
                  className="text-xs text-[#0f6cbf] hover:underline font-medium cursor-pointer"
                >
                  Subscribe to forum
                </button>
              </div>
            </div>

            {/* Moodle Forum Posts Stream */}
            <div className="space-y-6">
              {announcements.map((ann) => (
                <article
                  key={ann.id}
                  className={`border border-[#dee2e6] rounded-lg p-5 bg-white transition-colors space-y-3 ${
                    ann.pinned ? "border-l-4 border-l-[#0f6cbf]" : ""
                  }`}
                >
                  {/* Post Header: Avatar + Title + Author Metadata Line */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Circular User Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#0f6cbf] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                        {ann.authorInitials}
                      </div>

                      {/* Title & Metadata Line */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {ann.pinned && (
                            <Pin size={12} className="text-[#0f6cbf] flex-shrink-0" />
                          )}
                        <h3 id={`announcement-${ann.id}`} className="text-base font-bold text-[#0f6cbf] leading-snug">
                            {ann.title}
                          </h3>
                        </div>
                        <div className="text-xs text-[#6c757d] mt-0.5">
                          by <span className="font-semibold">{ann.author}</span> - {ann.date}
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Icons */}
                    {canManageAnnouncements && (
                      <div className="flex items-center gap-1 flex-shrink-0 text-[#6c757d]">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(ann.id)}
                          className={`p-1.5 rounded hover:bg-[#f8f9fa] cursor-pointer ${
                            ann.pinned ? "text-[#0f6cbf]" : "text-[#6c757d]"
                          }`}
                          title={ann.pinned ? "Unpin notice" : "Pin notice"}
                        >
                          <Pin size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ann)}
                          className="p-1.5 rounded hover:bg-[#f8f9fa] text-[#0f6cbf] cursor-pointer"
                          title="Edit announcement"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete announcement"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Post Body (Structured Paragraphs & Details) */}
                  <div className="text-xs text-[#212529] leading-relaxed whitespace-pre-line pt-1">
                    {ann.content}
                  </div>

                  {/* Inline Event Poster Flyer */}
                  {ann.posterUrl && (
                    <div className="pt-1">
                      <div
                        onClick={() => {
                          setLightboxPosterUrl(ann.posterUrl!);
                          setLightboxPosterCaption(ann.posterCaption || ann.title);
                        }}
                        className="relative rounded-lg overflow-hidden border border-[#dee2e6] bg-[#f8f9fa] max-w-sm group cursor-pointer hover:border-[#0f6cbf] transition-colors"
                      >
                        <img
                          src={ann.posterUrl}
                          alt={ann.posterCaption || ann.title}
                          className="w-full h-56 object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                          <ZoomIn size={16} /> Click to expand poster
                        </div>
                        <div className="p-2 bg-white border-t border-[#dee2e6] flex items-center justify-between text-[11px] text-[#495057]">
                          <span className="font-semibold truncate">{ann.posterCaption || "Event Flyer"}</span>
                          <span className="text-[#0f6cbf] font-medium flex items-center gap-1 flex-shrink-0 ml-2">
                            <Maximize2 size={11} /> Expand
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Attachment Line (Authentic Moodle mod_forum attachment) */}
                  {ann.attachment && (
                    <div className="pt-1">
                      <div className="inline-flex max-w-full flex-wrap items-center gap-2 p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded text-xs">
                        {ann.attachment.endsWith(".zip") ? (
                          <FileArchive size={15} className="text-[#0f6cbf]" />
                        ) : (
                          <FileText size={15} className="text-[#dc3545]" />
                        )}
                        <span className="font-mono text-xs break-all text-[#0f6cbf] hover:underline cursor-pointer">
                          {ann.attachment}
                        </span>
                        <span className="text-[11px] text-[#6c757d]">({ann.attachmentSize || "PDF"})</span>
                        <span className="text-[11px] text-[#6c757d] flex items-center gap-0.5 ml-2 font-medium">
                          <FileText size={11} /> File unavailable in sample preview
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Post Footer Links (Permalink and Discussion Link) */}
                  <div className="pt-2 border-t border-[#f1f3f5] flex justify-end items-center gap-4 text-xs">
                    <a href={`#announcement-${ann.id}`} className="text-[#0f6cbf] hover:underline">
                      Permalink
                    </a>
                    <Link href="/feedback" className="text-[#0f6cbf] hover:underline font-semibold">Open sample feedback</Link>
                  </div>
                </article>
              ))}
            </div>

            <p className="pt-2 text-left text-xs text-[#6c757d]">All sample notices are shown.</p>
          </section>

          {/* 4. Authentic Course Search Box (Centered below announcements) */}
          <section className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-semibold text-[#495057]">
              Search courses:
            </span>
            <form action="/courses" method="get" className="flex items-center gap-2 w-full max-w-md">
              <input
                type="text"
                name="search"
                placeholder="Search by course name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-[#ced4da] rounded-full text-xs bg-white focus:outline-hidden focus:border-[#0f6cbf]"
              />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white rounded-full text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <Search size={13} />
                  <span>Search</span>
                </button>
            </form>
          </section>
        </div>

        {/* Right Sidebar: Real Moodle Blocks Drawer (4 cols) */}
        {sidebarOpen && (
          <div className="lg:col-span-4 space-y-6">
            {/* Calendar Block (Exact Moodle Calendar Block) */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#dee2e6] pb-2">
                <h3 className="text-sm font-bold text-[#212529]">Calendar</h3>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-1 text-[#6c757d] hover:text-[#212529] cursor-pointer">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-bold text-[#495057]">{miniCalendarLabel}</span>
                  <button type="button" aria-label="Next month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-1 text-[#6c757d] hover:text-[#212529] cursor-pointer">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* 7-Day Calendar Grid Table */}
              <div className="text-center space-y-1">
                <div className="grid grid-cols-7 gap-1 text-[11px] text-[#6c757d] font-semibold pb-1">
                  <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs font-mono">
                  {miniCalendarCells.map(({ date, dayNumber, isCurrentMonth }) => {
                    const isToday = calendarDateKey(date) === calendarDateKey(new Date());
                    return <Link key={calendarDateKey(date)} href="/calendar" aria-current={isToday ? "date" : undefined} className={`rounded py-1 text-center hover:bg-gray-100 ${isToday ? "bg-[#0f6cbf] text-white font-bold hover:bg-[#0d5ca3]" : isCurrentMonth ? "text-[#212529]" : "text-[#adb5bd]"}`}>{dayNumber}</Link>;
                  })}
                </div>
              </div>

              {/* Calendar Footer Links */}
              <div className="pt-2 border-t border-[#dee2e6] text-[11px] text-[#0f6cbf] flex items-center justify-between">
                <Link href="/calendar" className="hover:underline">Full calendar</Link>
                <span>•</span>
                <Link href="/calendar" className="hover:underline">
                  Import or export calendars
                </Link>
              </div>
            </div>

            {/* Latest Badges Block */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#dee2e6] pb-2">
                Latest badges
              </h3>
              <p className="text-xs text-[#6c757d]">
                You have no badges to display
              </p>
            </div>

            {/* Activities Block */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#dee2e6] pb-2">
                Activities
              </h3>
              <div className="space-y-1 text-xs">
                <Link href="/home" className="flex items-center gap-2 text-[#0f6cbf] hover:underline p-1 rounded hover:bg-[#f8f9fa]">
                  <MessageSquare size={14} />
                  <span>Forums</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity Block */}
            <div className="bg-white border border-[#dee2e6] rounded-xl p-5 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-[#212529] border-b border-[#dee2e6] pb-2">
                Recent activity
              </h3>
              <div className="space-y-2 text-xs">
                <div className="text-[11px] text-[#6c757d]">
                  Sample activity feed · preview data only
                </div>
                <div className="pt-1">
                  <div className="font-semibold text-[#212529] text-[11px]">New forum posts:</div>
                  <ul className="list-disc pl-4 space-y-1 text-[#0f6cbf] pt-1">
                    <li className="cursor-pointer hover:underline">
                      Dr. N. T. Weerawarna: Global Academic Opportunities...
                    </li>
                    <li className="cursor-pointer hover:underline">
                      Chathurika Silva: Mahapola 3rd Installment...
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Moodle Help Button '?' */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-30">
        <Link
          href="/help#support"
          className="w-10 h-10 rounded-full bg-white border border-[#ced4da] shadow-md text-[#495057] hover:text-[#0f6cbf] hover:bg-[#f8f9fa] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          title="Help and documentation"
          aria-label="Help and documentation"
        >
          ?
        </Link>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD ANNOUNCEMENT (Moodle Forum Topic Style)     */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="lms-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 text-xs text-[#212529] my-8">
            <div className="flex justify-between items-center border-b border-[#dee2e6] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#212529]">Your new topic</h3>
                <p className="text-[11px] text-[#6c757d]">Adding announcement to Site announcements forum</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#6c757d] hover:text-[#212529] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-Semester Examination Timetable Draft Released"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Author / Division Name</label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write announcement message..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              {/* Flyer Poster */}
              <div className="space-y-1 p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded">
                <label className="font-semibold text-[#495057] block">Event Poster Flyer (JPG or PNG)</label>
                <input
                  type="text"
                  placeholder="Poster path or URL (e.g. /posters/faculty_day_poster.jpg)"
                  value={formPosterUrl}
                  onChange={(e) => setFormPosterUrl(e.target.value)}
                  className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono bg-white"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFormPosterUrl("/posters/faculty_day_poster.jpg");
                      setFormPosterCaption("Faculty Day 2026 Celebration Poster");
                    }}
                    className="text-[10px] text-[#0f6cbf] hover:underline cursor-pointer"
                  >
                    + Use Faculty Day Poster
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormPosterUrl("/posters/atrs_2026_symposium.jpg");
                      setFormPosterCaption("ATRS 2026 Symposium Call for Papers");
                    }}
                    className="text-[10px] text-[#0f6cbf] hover:underline cursor-pointer"
                  >
                    + Use Research Symposium Poster
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Attachment file name</label>
                  <input
                    type="text"
                    placeholder="e.g. guidelines.pdf"
                    value={formAttachment}
                    onChange={(e) => setFormAttachment(e.target.value)}
                    className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Attachment size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2 MB"
                    value={formAttachmentSize}
                    onChange={(e) => setFormAttachmentSize(e.target.value)}
                    className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formPinned}
                  onChange={(e) => setFormPinned(e.target.checked)}
                  className="rounded text-[#0f6cbf]"
                />
                <span className="font-medium text-[#495057]">Pinned (display at top of forum)</span>
              </label>

              <div className="pt-3 border-t border-[#dee2e6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#0f6cbf] text-white rounded text-xs font-semibold hover:bg-[#0d5ca3] cursor-pointer"
                >
                  Post to forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT ANNOUNCEMENT                               */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="lms-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 text-xs text-[#212529] my-8">
            <div className="flex justify-between items-center border-b border-[#dee2e6] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#212529]">Edit topic</h3>
                <p className="text-[11px] text-[#6c757d]">Update forum notice details</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#6c757d] hover:text-[#212529] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Subject *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Author / Division Name</label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded text-xs focus:border-[#0f6cbf] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057]">Event Poster Flyer Path</label>
                <input
                  type="text"
                  value={formPosterUrl}
                  onChange={(e) => setFormPosterUrl(e.target.value)}
                  className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Attachment file name</label>
                  <input
                    type="text"
                    value={formAttachment}
                    onChange={(e) => setFormAttachment(e.target.value)}
                    className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057]">Attachment size</label>
                  <input
                    type="text"
                    value={formAttachmentSize}
                    onChange={(e) => setFormAttachmentSize(e.target.value)}
                    className="w-full p-1.5 border border-[#ced4da] rounded text-xs font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formPinned}
                  onChange={(e) => setFormPinned(e.target.checked)}
                  className="rounded text-[#0f6cbf]"
                />
                <span className="font-medium text-[#495057]">Pinned</span>
              </label>

              <div className="pt-3 border-t border-[#dee2e6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#0f6cbf] text-white rounded text-xs font-semibold hover:bg-[#0d5ca3] cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL: FULL RESOLUTION POSTER FLYER VIEW        */}
      {/* ======================================================== */}
      {lightboxPosterUrl && (
        <div 
          onClick={() => setLightboxPosterUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-[#f8f9fa]">
              <span className="font-bold text-xs text-[#212529] truncate">{lightboxPosterCaption || "Event Flyer"}</span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxPosterUrl}
                  download="announcement_poster.jpg"
                  className="px-2.5 py-1 bg-white border border-[#ced4da] hover:bg-[#f8f9fa] text-[#495057] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download size={13} /> Download
                </a>
                <button 
                  onClick={() => setLightboxPosterUrl(null)}
                  className="p-1 rounded hover:bg-gray-200 text-[#495057] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900/5">
              <img
                src={lightboxPosterUrl}
                alt={lightboxPosterCaption || "Announcement Poster"}
                className="max-h-[72vh] w-auto object-contain rounded-lg shadow-md border"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
