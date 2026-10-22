"use client";

import React, { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  Video, 
  ExternalLink, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Award,
  ChevronLeft,
  FolderTree,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  X,
  UploadCloud,
  Calendar,
  Send,
  HelpCircle,
  FileCheck,
  Copy
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface ActivityItem {
  id: string;
  type: "file" | "forum" | "assignment" | "quiz" | "url" | "zoom";
  title: string;
  typeLabel: string;
  completed: boolean;
  dueDate?: string;
  link?: string;
  hidden?: boolean;
  submissionsCount?: number;
  description?: string;
  maxScore?: number;
}

interface CourseSection {
  id: string;
  title: string;
  description?: string;
  activities: ActivityItem[];
}

function CourseDetailContent() {
  const params = useParams();
  const { tenant, user, editMode, setEditMode } = useTenant();

  const isInstructor = user.role === "lecturer" || user.role === "admin";

  const [courseTab, setCourseTab] = useState<"course" | "participants" | "grades" | "competencies">("course");
  const [courseIndexOpen, setCourseIndexOpen] = useState(true);

  // Course sections state
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: "sec-general",
      title: "General",
      description: "Course syllabus, lecture meeting links, and faculty announcements.",
      activities: [
        { id: "act-1", type: "forum", title: "Announcements & Lecture Notices", typeLabel: "Forum", completed: true },
        { id: "act-2", type: "file", title: "IC 3204 Course Syllabus & Examination Bylaws (2025/2026)", typeLabel: "File (1.4 MB PDF)", completed: true },
        { id: "act-3", type: "zoom", title: "Weekly Online Lecture Link (Wednesdays 08:30 AM)", typeLabel: "Zoom Meeting URL", completed: false, link: "https://zoom.us/j/9482019482" }
      ]
    },
    {
      id: "sec-1",
      title: "Session 1 — Introduction to Software Quality & Verification Principles",
      description: "Overview of software quality dimensions, verification vs validation, and testing lifecycle.",
      activities: [
        { id: "act-4", type: "file", title: "Session 1 Slide Deck: Quality Attributes & V-Model", typeLabel: "File (4.2 MB PDF)", completed: true },
        { id: "act-5", type: "zoom", title: "Session 1 Recorded Lecture Video", typeLabel: "Recording Link", completed: true, link: "https://zoom.us/rec/play/xyz" },
        { id: "act-6", type: "quiz", title: "Knowledge Check 1: V-Model & Testing Levels", typeLabel: "Quiz (10 Questions)", completed: true, link: "/exams" }
      ]
    },
    {
      id: "sec-2",
      title: "Session 2 — Black-Box & Specification-Based Test Design Techniques",
      description: "Equivalence partitioning, boundary value analysis, decision tables, and state transition testing.",
      activities: [
        { id: "act-7", type: "file", title: "Session 2 Handout: Boundary Value Analysis Mathematical Proofs", typeLabel: "File (2.8 MB PDF)", completed: false },
        { id: "act-8", type: "assignment", title: "Assignment 1: Equivalence Partitioning Case Study", typeLabel: "Assignment • Due 16 Oct 2026, 11:59 PM", completed: false, link: "/assignments", submissionsCount: 89 }
      ]
    },
    {
      id: "sec-3",
      title: "Session 3 — Formal Midterm Online Examination & Code Coverage",
      description: "Continuous assessment test covering sessions 1 and 2.",
      activities: [
        { id: "act-9", type: "quiz", title: "Mid-Semester Formal Online Examination", typeLabel: "Online Examination • 60 Mins", completed: false, link: "/courses/ic-3204/exams/exam-midterm" }
      ]
    }
  ]);

  // Modal State for Adding Activities / Resources
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [selectedResourceType, setSelectedResourceType] = useState<"file" | "assignment" | "zoom" | "forum" | "quiz">("file");

  // Form states
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDesc, setResourceDesc] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceDueDate, setResourceDueDate] = useState("2026-10-25");

  // Section Add / Edit states
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");

  // Modal State for Editing Activities
  const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);
  const [editingActivitySecId, setEditingActivitySecId] = useState<string>("");
  const [editingActivityId, setEditingActivityId] = useState<string>("");
  const [editTargetSectionId, setEditTargetSectionId] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<"file" | "forum" | "assignment" | "quiz" | "url" | "zoom">("file");
  const [editLink, setEditLink] = useState("");
  const [editDueDate, setEditDueDate] = useState("2026-10-25");
  const [editDescription, setEditDescription] = useState("");
  const [editHidden, setEditHidden] = useState(false);
  const [editMaxScore, setEditMaxScore] = useState<number>(100);

  // Quick inline title editing state
  const [inlineEditingActId, setInlineEditingActId] = useState<string | null>(null);
  const [inlineEditingActTitle, setInlineEditingActTitle] = useState("");

  // Notification feedback banner
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleOpenAddModal = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setResourceTitle("");
    setResourceDesc("");
    setResourceLink("");
    setAddModalOpen(true);
  };

  const handleSaveNewResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;

    let typeLabel = "Resource";
    let generatedLink = resourceLink || "#";

    if (selectedResourceType === "file") {
      typeLabel = "File (PDF Handout)";
    } else if (selectedResourceType === "assignment") {
      typeLabel = `Assignment • Due ${resourceDueDate}`;
      generatedLink = "/assignments";
    } else if (selectedResourceType === "zoom") {
      typeLabel = "Live Zoom Lecture Link";
    } else if (selectedResourceType === "forum") {
      typeLabel = "Discussion Forum Topic";
    } else if (selectedResourceType === "quiz") {
      typeLabel = "Timed Online Examination / Quiz";
      generatedLink = "/exams";
    }

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: selectedResourceType,
      title: resourceTitle,
      typeLabel: typeLabel,
      completed: false,
      link: generatedLink
    };

    setSections(prev => prev.map(sec => {
      if (sec.id !== activeSectionId) return sec;
      return {
        ...sec,
        activities: [...sec.activities, newActivity]
      };
    }));

    setAddModalOpen(false);
    setNotificationMsg(`Activity "${resourceTitle}" added to course.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleOpenEditActivity = (secId: string, act: ActivityItem) => {
    setEditingActivitySecId(secId);
    setEditingActivityId(act.id);
    setEditTargetSectionId(secId);
    setEditTitle(act.title);
    setEditType(act.type);
    setEditLink(act.link || "");
    setEditDueDate(act.dueDate || "2026-10-25");
    setEditDescription(act.description || "");
    setEditHidden(!!act.hidden);
    setEditMaxScore(act.maxScore || 100);
    setEditActivityModalOpen(true);
  };

  const handleSaveEditedActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    let typeLabel = "Resource";
    let generatedLink = editLink.trim() || "#";

    if (editType === "file") {
      typeLabel = editLink ? `File (${editLink.split("/").pop() || "Handout PDF"})` : "File (PDF Handout)";
    } else if (editType === "assignment") {
      typeLabel = `Assignment • Due ${editDueDate}`;
      if (!editLink || editLink === "#") generatedLink = "/assignments";
    } else if (editType === "zoom") {
      typeLabel = "Live Zoom Meeting Link";
    } else if (editType === "forum") {
      typeLabel = "Discussion Forum Topic";
    } else if (editType === "quiz") {
      typeLabel = "Online Examination / Quiz";
      if (!editLink || editLink === "#") generatedLink = "/exams";
    } else if (editType === "url") {
      typeLabel = "External Web Resource";
    }

    setSections(prev => {
      let updatedAct: ActivityItem | null = null;
      // Step 1: Update in original section or remove if moving to another section
      const updatedSections = prev.map(sec => {
        if (sec.id === editingActivitySecId) {
          const original = sec.activities.find(a => a.id === editingActivityId);
          if (original) {
            updatedAct = {
              ...original,
              title: editTitle.trim(),
              type: editType,
              typeLabel: typeLabel,
              link: generatedLink,
              dueDate: editDueDate,
              description: editDescription.trim(),
              hidden: editHidden,
              maxScore: editMaxScore
            };
          }
          if (editingActivitySecId !== editTargetSectionId) {
            return {
              ...sec,
              activities: sec.activities.filter(a => a.id !== editingActivityId)
            };
          } else {
            return {
              ...sec,
              activities: sec.activities.map(a => a.id === editingActivityId ? updatedAct! : a)
            };
          }
        }
        return sec;
      });

      // Step 2: If moved to different section, append to that target section
      if (editingActivitySecId !== editTargetSectionId && updatedAct) {
        return updatedSections.map(sec => {
          if (sec.id === editTargetSectionId) {
            return {
              ...sec,
              activities: [...sec.activities, updatedAct!]
            };
          }
          return sec;
        });
      }

      return updatedSections;
    });

    setEditActivityModalOpen(false);
    setNotificationMsg(`Activity "${editTitle.trim()}" settings saved successfully.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleQuickSaveInlineTitle = (secId: string, actId: string) => {
    if (!inlineEditingActTitle.trim()) {
      setInlineEditingActId(null);
      return;
    }
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return {
        ...s,
        activities: s.activities.map(a => a.id === actId ? { ...a, title: inlineEditingActTitle.trim() } : a)
      };
    }));
    setInlineEditingActId(null);
    setNotificationMsg("Activity title updated.");
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDuplicateActivity = (secId: string, act: ActivityItem) => {
    const duplicated: ActivityItem = {
      ...act,
      id: `act-${Date.now()}`,
      title: `${act.title} (Copy)`,
      completed: false
    };
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const index = s.activities.findIndex(a => a.id === act.id);
      const newActs = [...s.activities];
      newActs.splice(index + 1, 0, duplicated);
      return { ...s, activities: newActs };
    }));
    setNotificationMsg(`Duplicated "${act.title}".`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSec: CourseSection = {
      id: `sec-${Date.now()}`,
      title: newSectionTitle,
      description: "Added by course coordinator.",
      activities: []
    };
    setSections(prev => [...prev, newSec]);
    setNewSectionTitle("");
    setShowAddSectionModal(false);
    setNotificationMsg(`Added section "${newSectionTitle}".`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDeleteSection = (secId: string) => {
    if (confirm("Are you sure you want to delete this course section and all its contents?")) {
      setSections(prev => prev.filter(s => s.id !== secId));
      setNotificationMsg("Course section deleted.");
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleDeleteActivity = (secId: string, actId: string) => {
    if (confirm("Are you sure you want to delete this course material?")) {
      setSections(prev => prev.map(s => {
        if (s.id !== secId) return s;
        return {
          ...s,
          activities: s.activities.filter(a => a.id !== actId)
        };
      }));
      setNotificationMsg("Activity deleted.");
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleToggleHide = (secId: string, actId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return {
        ...s,
        activities: s.activities.map(a => a.id === actId ? { ...a, hidden: !a.hidden } : a)
      };
    }));
  };

  const handleSaveSectionTitle = (secId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return { ...s, title: editingTitleVal };
    }));
    setEditingSectionId(null);
  };

  const toggleDone = (secId: string, actId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return {
        ...s,
        activities: s.activities.map(a => a.id === actId ? { ...a, completed: !a.completed } : a)
      };
    }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "file":
        return (
          <div className="w-8 h-8 rounded-lg bg-[#008080] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="File Resource">
            <FileText size={16} />
          </div>
        );
      case "forum":
        return (
          <div className="w-8 h-8 rounded-lg bg-[#6f42c1] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="Forum / Announcements">
            <MessageSquare size={16} />
          </div>
        );
      case "assignment":
        return (
          <div className="w-8 h-8 rounded-lg bg-[#d63384] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="Coursework Assignment">
            <CheckSquare size={16} />
          </div>
        );
      case "quiz":
        return (
          <div className="w-8 h-8 rounded-lg bg-[#59359a] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="Online Quiz / Examination">
            <Clock size={16} />
          </div>
        );
      case "zoom":
        return (
          <div className="w-8 h-8 rounded-lg bg-[#0d6efd] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="Zoom Online Meeting">
            <Video size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#0aa2c0] text-white flex items-center justify-center flex-shrink-0 shadow-2xs" title="External Learning Link">
            <ExternalLink size={16} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Banner Header */}
      <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6c757d]">
              <span className="font-bold text-[#0f6cbf]">IC 3204</span>
              <span>•</span>
              <span>Semester 1 — 2025/2026</span>
              <span>•</span>
              <span>Department of Information and Communication Technology</span>
            </div>
            <h1 className="text-2xl font-bold text-[#212529] mt-1">
              Introduction to Software Quality Assurance
            </h1>
            <p className="text-xs text-[#6c757d] mt-1">
              Course Coordinator: <strong>Dr. Aruna Pathirana</strong> • Faculty of Technology, University of Colombo
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Instructor Edit Mode Switch */}
            {isInstructor && (
              <div className="flex items-center gap-2 bg-[#f8f9fa] border border-[#ced4da] px-3 py-1.5 rounded-lg text-xs">
                <span className="font-bold text-[#495057]">Edit mode:</span>
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

            <button
              onClick={() => setCourseIndexOpen(!courseIndexOpen)}
              className="px-3 py-1.5 border border-[#ced4da] rounded-md text-xs font-medium text-[#495057] hover:bg-[#f8f9fa] flex items-center gap-1.5 cursor-pointer"
            >
              <FolderTree size={14} />
              <span>{courseIndexOpen ? "Hide Index" : "Show Index"}</span>
            </button>
          </div>
        </div>

        {/* Instructor Banner Notification when Edit Mode is active */}
        {isInstructor && editMode && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-[#0f6cbf] rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Edit2 size={15} />
              <span>
                <strong>Instructor Course Coordinator Mode Enabled:</strong> You can add lecture notes, assignments, Zoom meeting links, quizzes, or edit sessions below.
              </span>
            </div>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="px-2.5 py-1 bg-[#0f6cbf] text-white font-semibold rounded text-[11px] hover:bg-[#0d5ca3] cursor-pointer flex items-center gap-1"
            >
              <Plus size={13} /> Add Topic Section
            </button>
          </div>
        )}

        {/* Notification Feedback Toast Alert */}
        {notificationMsg && (
          <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setNotificationMsg(null)} 
              className="text-green-700 hover:text-green-900 cursor-pointer p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs (Course, Participants, Grades, Competencies) */}
        <div className="flex border-b border-[#dee2e6] -mx-6 px-6 pt-2">
          <button
            onClick={() => setCourseTab("course")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              courseTab === "course"
                ? "border-[#0f6cbf] text-[#0f6cbf]"
                : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
            }`}
          >
            Course
          </button>
          <button
            onClick={() => setCourseTab("participants")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              courseTab === "participants"
                ? "border-[#0f6cbf] text-[#0f6cbf]"
                : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
            }`}
          >
            Participants
          </button>
          <button
            onClick={() => setCourseTab("grades")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              courseTab === "grades"
                ? "border-[#0f6cbf] text-[#0f6cbf]"
                : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
            }`}
          >
            Grades
          </button>
          <button
            onClick={() => setCourseTab("competencies")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              courseTab === "competencies"
                ? "border-[#0f6cbf] text-[#0f6cbf]"
                : "border-transparent text-[#495057] hover:text-[#0f6cbf]"
            }`}
          >
            Competencies
          </button>
        </div>
      </div>

      {/* Main Course Content with Collapsible Left Course Index Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Course Index Drawer (Left Sidebar, 3 cols) */}
        {courseIndexOpen && (
          <div className="lg:col-span-3 bg-white border border-[#dee2e6] rounded-xl p-4 shadow-2xs space-y-3 sticky top-20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6c757d] border-b border-[#e9ecef] pb-2 flex items-center gap-1.5">
              <FolderTree size={14} className="text-[#0f6cbf]" /> Course Index
            </h3>
            <div className="space-y-1 text-xs">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block p-2 rounded hover:bg-[#f8f9fa] text-[#495057] hover:text-[#0f6cbf] font-medium truncate"
                >
                  {sec.title}
                </a>
              ))}
            </div>

            {isInstructor && editMode && (
              <div className="pt-2 border-t border-[#e9ecef]">
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full py-1.5 border border-dashed border-[#0f6cbf] text-[#0f6cbf] bg-blue-50/50 hover:bg-blue-50 rounded text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add new section
                </button>
              </div>
            )}
          </div>
        )}

        {/* Course Sections List (Right Main, 9 cols or 12 cols if index hidden) */}
        <div className={courseIndexOpen ? "lg:col-span-9 space-y-6" : "lg:col-span-12 space-y-6"}>
          {courseTab === "course" && (
            <div className="space-y-6">
              {sections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white border border-[#dee2e6] rounded-xl shadow-2xs overflow-hidden"
                >
                  {/* Section Title Header */}
                  <div className="p-4 bg-[#f8f9fa] border-b border-[#dee2e6] flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                      <ChevronDown size={16} className="text-[#6c757d] flex-shrink-0" />
                      {editingSectionId === sec.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingTitleVal}
                            onChange={(e) => setEditingTitleVal(e.target.value)}
                            className="text-sm font-bold p-1 border rounded bg-white flex-1"
                          />
                          <button
                            onClick={() => handleSaveSectionTitle(sec.id)}
                            className="px-2 py-1 bg-[#0f6cbf] text-white rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="px-2 py-1 bg-white border rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <h2 className="text-sm font-bold text-[#212529] truncate flex items-center gap-2">
                          <span>{sec.title}</span>
                          {isInstructor && editMode && (
                            <button
                              onClick={() => { setEditingSectionId(sec.id); setEditingTitleVal(sec.title); }}
                              className="text-[#6c757d] hover:text-[#0f6cbf] p-1 cursor-pointer"
                              title="Edit Section Name"
                            >
                              <Edit2 size={13} />
                            </button>
                          )}
                        </h2>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#6c757d] font-mono whitespace-nowrap">
                        {sec.activities.filter(a => a.completed).length} / {sec.activities.length} completed
                      </span>
                      {isInstructor && editMode && sec.id !== "sec-general" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1 text-[#6c757d] hover:text-red-600 rounded cursor-pointer"
                          title="Delete this course section"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {sec.description && (
                    <div className="p-4 pb-2 text-xs text-[#6c757d]">
                      {sec.description}
                    </div>
                  )}

                  {/* Activity Items List */}
                  <div className="divide-y divide-[#e9ecef]">
                    {sec.activities.map((act) => {
                      if (act.hidden && !isInstructor) return null;

                      return (
                        <div
                          key={act.id}
                          className={`p-4 flex items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors ${
                            act.hidden ? "bg-gray-50/70 opacity-60" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {getActivityIcon(act.type)}
                            <div className="min-w-0 flex-1">
                              {inlineEditingActId === act.id ? (
                                <div className="flex items-center gap-1.5 py-0.5">
                                  <input
                                    type="text"
                                    value={inlineEditingActTitle}
                                    onChange={(e) => setInlineEditingActTitle(e.target.value)}
                                    className="p-1 border border-[#0f6cbf] rounded bg-white text-xs font-semibold text-[#212529] flex-1 focus:outline-hidden"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleQuickSaveInlineTitle(sec.id, act.id);
                                      if (e.key === "Escape") setInlineEditingActId(null);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSaveInlineTitle(sec.id, act.id)}
                                    className="px-2 py-1 bg-[#0f6cbf] text-white rounded text-[11px] font-semibold hover:bg-[#0d5ca3] cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setInlineEditingActId(null)}
                                    className="px-2 py-1 bg-white border border-[#ced4da] rounded text-[11px] text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {act.link ? (
                                    <Link
                                      href={act.link}
                                      className="text-xs font-semibold text-[#0f6cbf] hover:underline block truncate"
                                    >
                                      {act.title}
                                    </Link>
                                  ) : (
                                    <span className="text-xs font-semibold text-[#0f6cbf] hover:underline block truncate cursor-pointer">
                                      {act.title}
                                    </span>
                                  )}

                                  {isInstructor && editMode && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setInlineEditingActId(act.id);
                                        setInlineEditingActTitle(act.title);
                                      }}
                                      className="text-[#adb5bd] hover:text-[#0f6cbf] p-0.5 rounded cursor-pointer transition-colors"
                                      title="Quick rename activity title"
                                    >
                                      <Edit2 size={11} />
                                    </button>
                                  )}

                                  {act.hidden && (
                                    <span className="text-[10px] bg-gray-200 text-gray-700 font-medium px-1.5 py-0.2 rounded font-mono">
                                      Hidden from students
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-[#6c757d]">
                                  {act.typeLabel}
                                </span>
                                {act.submissionsCount !== undefined && isInstructor && (
                                  <Link href="/lecturer/grading" className="text-[11px] text-green-700 font-semibold hover:underline font-mono">
                                    ({act.submissionsCount} submissions received)
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Controls: If Student -> "Mark as done"; If Instructor & Edit Mode -> Edit/Duplicate/Hide/Delete actions */}
                          <div className="flex items-center gap-2">
                            {isInstructor && editMode ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditActivity(sec.id, act)}
                                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#ced4da] hover:border-[#0f6cbf] text-[#0f6cbf] rounded text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                                  title="Edit activity settings"
                                >
                                  <Edit2 size={12} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateActivity(sec.id, act)}
                                  className="p-1.5 hover:bg-gray-100 rounded text-[#495057] cursor-pointer"
                                  title="Duplicate activity"
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHide(sec.id, act.id)}
                                  className={`p-1.5 rounded cursor-pointer ${
                                    act.hidden 
                                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100" 
                                      : "hover:bg-gray-100 text-[#495057]"
                                  }`}
                                  title={act.hidden ? "Unhide for students" : "Hide from students"}
                                >
                                  {act.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteActivity(sec.id, act.id)}
                                  className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-[#6c757d] cursor-pointer"
                                  title="Delete resource"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => toggleDone(sec.id, act.id)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                                  act.completed
                                    ? "bg-green-50 border border-green-300 text-green-700 hover:bg-green-100"
                                    : "border border-[#ced4da] bg-white text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#212529]"
                                }`}
                              >
                                <CheckCircle2 size={13} className={act.completed ? "text-green-600" : "text-[#ced4da]"} />
                                <span>{act.completed ? "Done" : "Mark as done"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Instructor "+ Add an activity or resource" button inside section */}
                    {isInstructor && editMode && (
                      <div className="p-3 bg-[#f8f9fa]/50 text-center border-t border-[#e9ecef]">
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal(sec.id)}
                          className="px-4 py-1.5 bg-white border border-[#ced4da] hover:border-[#0f6cbf] text-[#0f6cbf] rounded-md text-xs font-semibold shadow-2xs hover:bg-blue-50/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Add an activity or resource</span>
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              ))}

              {/* Add New Section Button */}
              {isInstructor && editMode && (
                <div className="p-4 border-2 border-dashed border-[#ced4da] rounded-xl text-center">
                  <button
                    onClick={() => setShowAddSectionModal(true)}
                    className="px-5 py-2 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold rounded-md text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-xs"
                  >
                    <Plus size={15} />
                    <span>Add New Course Section / Week</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {courseTab === "participants" && (
            <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-[#212529]">Course Participants (Level 3 BICT)</h2>
              <div className="divide-y divide-[#e9ecef] text-xs">
                {[
                  { name: "Dr. Aruna Pathirana", role: "Lecturer / Coordinator", email: "aruna.p@tech.cmb.ac.lk" },
                  { name: "K. G. K. Sandaruwan (2023t01855)", role: "Student", email: "2023t01855@tech.cmb.ac.lk" },
                  { name: "Nipuni Wickramasinghe (2022/BST/018)", role: "Student", email: "nipuni@tech.cmb.ac.lk" }
                ].map((p, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-[#212529] block">{p.name}</span>
                      <span className="text-[11px] text-[#6c757d] font-mono">{p.email}</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#f8f9fa] border text-[#495057] font-medium">
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {courseTab === "grades" && (
            <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-[#212529]">Course Gradebook (IC 3204)</h2>
                {isInstructor && (
                  <Link href="/lecturer/grading">
                    <button className="px-3 py-1.5 bg-[#0f6cbf] text-white rounded text-xs font-semibold hover:bg-[#0d5ca3] cursor-pointer">
                      Open Instructor Grading Desk →
                    </button>
                  </Link>
                )}
              </div>
              <div className="border border-[#dee2e6] rounded-lg overflow-hidden text-xs">
                <div className="p-3 bg-[#f8f9fa] font-bold text-[#495057] grid grid-cols-4">
                  <span>Assessment Item</span>
                  <span className="text-center">Weight</span>
                  <span className="text-center">Grade</span>
                  <span className="text-right">Action</span>
                </div>
                <div className="p-3 border-t border-[#e9ecef] grid grid-cols-4 items-center">
                  <span className="font-semibold text-[#0f6cbf]">Assignment 1 (Black-Box Testing)</span>
                  <span className="text-center font-mono">20.0 %</span>
                  <span className="text-center font-mono font-bold text-amber-600">89 Submissions</span>
                  <span className="text-right">
                    <Link href="/lecturer/grading" className="text-[#0f6cbf] hover:underline font-semibold">Grade submissions</Link>
                  </span>
                </div>
                <div className="p-3 border-t border-[#e9ecef] grid grid-cols-4 items-center">
                  <span className="font-semibold text-[#0f6cbf]">Mid-Semester Examination</span>
                  <span className="text-center font-mono">20.0 %</span>
                  <span className="text-center font-mono font-bold text-[#212529]">Exam Window Open</span>
                  <span className="text-right">
                    <Link href="/courses/ic-3204/exams/exam-midterm" className="text-[#0f6cbf] hover:underline font-semibold">View exam hall</Link>
                  </span>
                </div>
              </div>
            </div>
          )}

          {courseTab === "competencies" && (
            <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#212529]">Course Learning Competencies (IC 3204)</h2>
                <p className="text-xs text-[#6c757d] mt-0.5">Competency frameworks mapped to the BICT curriculum and IEEE/ISTQB standard.</p>
              </div>
              <div className="divide-y divide-[#e9ecef] border border-[#dee2e6] rounded-lg overflow-hidden text-xs">
                {[
                  { code: "COMP-QA-01", title: "Specification-Based Black-Box Test Design", level: "Proficient", status: "Mastered" },
                  { code: "COMP-QA-02", title: "White-Box Control Flow & Cyclomatic Complexity", level: "Intermediate", status: "In Progress" },
                  { code: "COMP-QA-03", title: "Automated Continuous Integration Test Pipelines", level: "Foundational", status: "Scheduled" }
                ].map((c, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center bg-white hover:bg-[#f8f9fa] transition-colors">
                    <div>
                      <span className="font-mono font-bold text-[#0f6cbf]">{c.code}</span>
                      <h4 className="font-bold text-[#212529] mt-0.5">{c.title}</h4>
                      <span className="text-[11px] text-[#6c757d]">Curriculum Level: {c.level}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD AN ACTIVITY OR RESOURCE (Moodle 4 Style)      */}
      {/* ======================================================== */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95 text-xs text-[#212529]">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#212529]">Add an activity or resource</h3>
                <p className="text-[11px] text-[#6c757d]">Add course content to {sections.find(s => s.id === activeSectionId)?.title}</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-[#6c757d] hover:text-[#212529]">
                <X size={18} />
              </button>
            </div>

            {/* Select Resource Type Chips */}
            <div className="space-y-2">
              <label className="font-bold text-[#495057] block">Select Content / Activity Type:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: "file", label: "Lecture Notes / File", icon: FileText, color: "text-[#dc3545]" },
                  { type: "assignment", label: "Assignment", icon: CheckSquare, color: "text-[#198754]" },
                  { type: "zoom", label: "Zoom Lecture Link", icon: Video, color: "text-[#0d6efd]" },
                  { type: "forum", label: "Discussion Forum", icon: MessageSquare, color: "text-[#0f6cbf]" },
                  { type: "quiz", label: "Quiz / Examination", icon: Clock, color: "text-[#6f42c1]" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedResourceType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setSelectedResourceType(item.type as any)}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                        isSel 
                          ? "border-[#0f6cbf] bg-blue-50/50 shadow-2xs font-semibold text-[#0f6cbf]" 
                          : "border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057]"
                      }`}
                    >
                      <Icon size={18} className={item.color} />
                      <span className="text-xs leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form based on Type */}
            <form onSubmit={handleSaveNewResource} className="space-y-4 pt-2 border-t border-[#e9ecef]">
              <div className="space-y-1">
                <label className="font-semibold text-[#495057] block">
                  {selectedResourceType === "file" ? "Document / Lecture Note Title" :
                   selectedResourceType === "assignment" ? "Assignment Title" :
                   selectedResourceType === "zoom" ? "Online Lecture Topic" : "Activity Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedResourceType === "file" ? "e.g. Session 3 - CI/CD Automation Slide Deck" :
                    selectedResourceType === "assignment" ? "e.g. Lab Assignment 2 - Cypress End-to-End Tests" :
                    selectedResourceType === "zoom" ? "e.g. Wednesday Live Practical Demonstration" : "Title"
                  }
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs focus:outline-hidden focus:border-[#0f6cbf]"
                />
              </div>

              {selectedResourceType === "zoom" && (
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Zoom / Video Conference URL</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/9482019482?pwd=..."
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                </div>
              )}

              {selectedResourceType === "assignment" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#495057] block">Submission Due Date</label>
                    <input
                      type="date"
                      value={resourceDueDate}
                      onChange={(e) => setResourceDueDate(e.target.value)}
                      className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#495057] block">Max Marks</label>
                    <input
                      type="number"
                      defaultValue={100}
                      className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedResourceType === "file" && (
                <div className="p-4 border-2 border-dashed border-[#ced4da] rounded-lg text-center bg-[#f8f9fa] space-y-1">
                  <UploadCloud size={24} className="mx-auto text-[#0f6cbf]" />
                  <span className="font-semibold block text-[#212529]">Drop PDF handout or presentation file</span>
                  <span className="text-[10px] text-[#6c757d]">Simulates immediate course file distribution</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e9ecef]">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold rounded text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Save and display in course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW SECTION / WEEK TOPIC                      */}
      {/* ======================================================== */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs text-[#212529]">
            <h3 className="text-base font-bold text-[#212529]">Add New Course Section / Week</h3>
            <div className="space-y-1">
              <label className="font-semibold text-[#495057] block">Section Title</label>
              <input
                type="text"
                placeholder="e.g. Session 4 — Test Automation with Selenium & Playwright"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs focus:outline-hidden focus:border-[#0f6cbf]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#e9ecef]">
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="px-3 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-1.5 bg-[#0f6cbf] text-white font-semibold rounded text-xs hover:bg-[#0d5ca3]"
              >
                Add section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT ACTIVITY SETTINGS (Moodle 4 Boost Style)     */}
      {/* ======================================================== */}
      {editActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 text-xs text-[#212529]">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#212529] flex items-center gap-2">
                  <Edit2 size={16} className="text-[#0f6cbf]" />
                  <span>Edit Activity Settings</span>
                </h3>
                <p className="text-[11px] text-[#6c757d] mt-0.5">
                  Updating in {sections.find(s => s.id === editTargetSectionId)?.title || "Course"}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditActivityModalOpen(false)} 
                className="text-[#6c757d] hover:text-[#212529] p-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Select Resource Type Chips (allows switching type if needed) */}
            <div className="space-y-2">
              <label className="font-bold text-[#495057] block">Activity / Resource Type:</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { type: "file", label: "File / PDF", icon: FileText, color: "text-[#dc3545]" },
                  { type: "assignment", label: "Assignment", icon: CheckSquare, color: "text-[#198754]" },
                  { type: "zoom", label: "Zoom Video", icon: Video, color: "text-[#0d6efd]" },
                  { type: "forum", label: "Forum", icon: MessageSquare, color: "text-[#0f6cbf]" },
                  { type: "quiz", label: "Quiz / Exam", icon: Clock, color: "text-[#6f42c1]" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = editType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setEditType(item.type as any)}
                      className={`p-2 rounded-lg border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSel 
                          ? "border-[#0f6cbf] bg-blue-50/60 font-semibold text-[#0f6cbf] ring-1 ring-[#0f6cbf]" 
                          : "border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057]"
                      }`}
                    >
                      <Icon size={16} className={item.color} />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditedActivity} className="space-y-4 pt-2 border-t border-[#e9ecef]">
              {/* Activity Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#495057] block">
                  Activity Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs focus:outline-hidden focus:border-[#0f6cbf] font-medium"
                />
              </div>

              {/* Move to Section & Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Course Section / Week Placement</label>
                  <select
                    value={editTargetSectionId}
                    onChange={(e) => setEditTargetSectionId(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs text-[#495057]"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Availability / Visibility</label>
                  <select
                    value={editHidden ? "hidden" : "visible"}
                    onChange={(e) => setEditHidden(e.target.value === "hidden")}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs text-[#495057]"
                  >
                    <option value="visible">Show on course page</option>
                    <option value="hidden">Hide from students</option>
                  </select>
                </div>
              </div>

              {/* Type-Specific fields */}
              {editType === "zoom" && (
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Zoom / Meeting URL</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/9482019482"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                </div>
              )}

              {editType === "assignment" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#495057] block">Submission Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#495057] block">Target Assignment Route</label>
                    <input
                      type="text"
                      placeholder="/assignments"
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {editType === "quiz" && (
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Exam / Quiz Link URL</label>
                  <input
                    type="text"
                    placeholder="/courses/ic-3204/exams/exam-midterm"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                </div>
              )}

              {editType === "file" && (
                <div className="space-y-2">
                  <label className="font-semibold text-[#495057] block">File Handout Attachment</label>
                  <div className="p-3 border-2 border-dashed border-[#ced4da] rounded-lg text-center bg-[#f8f9fa] space-y-1">
                    <UploadCloud size={20} className="mx-auto text-[#0f6cbf]" />
                    <span className="font-medium block text-[#212529]">Replace Handout / PDF File</span>
                    <span className="text-[10px] text-[#6c757d]">Drag new file or click to update resource file</span>
                  </div>
                </div>
              )}

              {/* Description / Instructions */}
              <div className="space-y-1">
                <label className="font-semibold text-[#495057] block">Lecturer Description & Guidance (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional guidance, reading instructions, or submission guidelines..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs focus:outline-hidden focus:border-[#0f6cbf]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e9ecef]">
                <button
                  type="button"
                  onClick={() => setEditActivityModalOpen(false)}
                  className="px-3 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold rounded text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck size={13} />
                  <span>Save changes and return to course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#6c757d]">Loading course...</div>}>
      <CourseDetailContent />
    </Suspense>
  );
}
