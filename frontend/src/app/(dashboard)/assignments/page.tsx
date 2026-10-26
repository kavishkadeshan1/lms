"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  Download,
  Calendar,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckSquare,
  Trash2,
  FileCheck
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { useLocalState } from "@/lib/use-local-state";
import { validateFile } from "@/lib/exam-attempt";
import { downloadFile } from "@/lib/download";

interface AssignmentRecord {
  id: string;
  courseCode: string;
  courseTitle: string;
  sessionTitle: string;
  title: string;
  openedDate: string;
  dueDate: string;
  status: "submitted" | "pending" | "graded";
  gradingStatus: "not_graded" | "graded";
  grade?: string;
  timeRemaining: string;
  description: string[];
  briefFile: string;
  briefSize: string;
  submittedFile?: string;
  submittedTime?: string;
  receiptId?: string;
}

const INITIAL_ASSIGNMENTS: AssignmentRecord[] = [
    {
      id: "asg-1",
      courseCode: "IC 3204",
      courseTitle: "Introduction to Software Quality Assurance",
      sessionTitle: "Session 2 — Black-Box & Specification-Based Test Design Techniques",
      title: "Assignment 1: Equivalence Partitioning & Boundary Value Analysis",
      openedDate: "Monday, 3 October 2026, 12:00 AM",
      dueDate: "Sunday, 16 October 2026, 11:59 PM",
      status: "pending",
      gradingStatus: "not_graded",
      timeRemaining: "Due in 8 days 4 hours",
      description: [
        "Identify valid and invalid equivalence classes for the loan eligibility calculation logic.",
        "Derive precise boundary value analysis test vectors for input age, monthly income, and debt-to-income ratio.",
        "Document test cases according to the IEEE 829 test documentation standard."
      ],
      briefFile: "IC3204_Assignment01_Brief_Specification.pdf",
      briefSize: "1.2 MB"
    },
    {
      id: "asg-2",
      courseCode: "IC 3101",
      courseTitle: "Advanced Web Application Architectures",
      sessionTitle: "Session 3 — Distributed Consensus Protocols",
      title: "Mini-Project 1: Raft Consensus Algorithm in Go",
      openedDate: "Friday, 26 September 2026, 09:00 AM",
      dueDate: "Saturday, 15 October 2026, 11:59 PM",
      status: "submitted",
      gradingStatus: "not_graded",
      timeRemaining: "Submitted 18 hours early",
      submittedFile: "2023t01855_raft_consensus_go.zip",
      submittedTime: "Tuesday, 7 October 2026, 11:15 PM",
      receiptId: "SUB-2026-849102",
      description: [
        "Implement leader election and heartbeat ping mechanism.",
        "Ensure log replication across minimum of 3 simulated cluster nodes.",
        "Handle network partition scenarios and election timeouts gracefully."
      ],
      briefFile: "IC3101_Raft_Consensus_Specification.pdf",
      briefSize: "2.4 MB"
    },
    {
      id: "asg-3",
      courseCode: "IC 3102",
      courseTitle: "Distributed Database Systems & Cloud Sharding",
      sessionTitle: "Session 4 — Query Execution & B-Tree Indexes",
      title: "Practical Lab 2: PostgreSQL Index Profiling & EXPLAIN ANALYZE",
      openedDate: "Wednesday, 1 October 2026, 08:00 AM",
      dueDate: "Friday, 21 October 2026, 11:59 PM",
      status: "pending",
      gradingStatus: "not_graded",
      timeRemaining: "Due in 13 days",
      description: [
        "Profile sequential scan vs index scan on a table with 5,000,000 synthetic records.",
        "Compare GiST vs GIN index performance on JSONB document queries."
      ],
      briefFile: "IC3102_Index_Profiling_Lab_Guide.pdf",
      briefSize: "980 KB"
    }
  ];

export default function AssignmentsPage() {
  const { tenant, user } = useTenant();
  const storageScope = `${tenant.id}:${user.username}`;
  const [assignmentsList, setAssignmentsList] = useLocalState<AssignmentRecord[]>(`lms:assignments:${storageScope}`, INITIAL_ASSIGNMENTS);

  // Selected assignment for detailed submission view
  const [selectedAsgId, setSelectedAsgId] = useState<string>("asg-1");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "submitted">("all");

  // Detailed submission state for active assignment
  const activeAsg = assignmentsList.find(a => a.id === selectedAsgId) || assignmentsList[0];
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | undefined>>({});
  const selectedUploadFile = selectedFiles[selectedAsgId]?.name ?? null;
  const [fileError, setFileError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const commentText = commentDrafts[selectedAsgId] ?? "";
  const setCommentText = (text: string) => setCommentDrafts(previous => ({ ...previous, [selectedAsgId]: text }));
  const [allComments, setAllComments] = useLocalState<Record<string, string[]>>(`lms:assignment-comments:${storageScope}`, {});
  const commentsList = allComments[selectedAsgId] ?? [];
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleSubmitActive = () => {
    if (!selectedUploadFile || activeAsg.status !== "pending") return;
    const now = new Date().toLocaleString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    const receipt = `LOCAL-${crypto.randomUUID()}`;

    setAssignmentsList(prev => prev.map(a => {
      if (a.id !== activeAsg.id) return a;
      return {
        ...a,
        status: "submitted",
        submittedFile: selectedUploadFile,
        submittedTime: now,
        receiptId: receipt,
        timeRemaining: "Practice entry saved locally"
      };
    }));

    setSelectedFiles(previous => ({ ...previous, [selectedAsgId]: undefined }));
    setNotificationMsg(`Practice entry saved in this browser for "${activeAsg.title}". File contents were not uploaded.`);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleRemoveSubmission = () => {
    if (confirm("Are you sure you want to remove your submission? You can upload a revised file before the deadline.")) {
      setAssignmentsList(prev => prev.map(a => {
        if (a.id !== activeAsg.id) return a;
        return {
          ...a,
          status: "pending",
          submittedFile: undefined,
          submittedTime: undefined,
          receiptId: undefined,
          timeRemaining: "Due before deadline"
        };
      }));
      setNotificationMsg("Local practice entry removed.");
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setAllComments(previous => ({ ...previous, [selectedAsgId]: [...(previous[selectedAsgId] ?? []), commentText.trim()] }));
    setCommentText("");
  };

  const filteredAssignments = assignmentsList.filter(a => {
    if (filterStatus === "pending") return a.status === "pending";
    if (filterStatus === "submitted") return a.status === "submitted";
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dee2e6] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#6c757d] font-medium mb-1">
            <Link href="/" className="hover:text-[#0f6cbf]">Dashboard</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-[#0f6cbf]">My courses</Link>
            <span>/</span>
            <span className="text-[#212529]">Coursework Assignments</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#212529]">Assignments & Submissions</h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#6c757d]" />
          <div className="flex bg-[#e9ecef] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                filterStatus === "all" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              All ({assignmentsList.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                filterStatus === "pending" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              Pending ({assignmentsList.filter(a => a.status === "pending").length})
            </button>
            <button
              onClick={() => setFilterStatus("submitted")}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                filterStatus === "submitted" ? "bg-white text-[#0f6cbf] font-semibold shadow-2xs" : "text-[#495057]"
              }`}
            >
              Submitted ({assignmentsList.filter(a => a.status === "submitted").length})
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast Alert */}
      {notificationMsg && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {/* 2-Column Layout: Assignment Selector on Left (4 cols), Detailed Moodle Submission Desk on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: All Assignments Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-mono font-bold text-[#6c757d] uppercase tracking-wider">
            Select Course Assignment
          </h2>

          <div className="space-y-2.5">
            {filteredAssignments.map((asg) => {
              const isSelected = asg.id === activeAsg.id;
              return (
                <div
                  key={asg.id}
                  onClick={() => { setSelectedAsgId(asg.id); setFileError(null); setNotificationMsg(null); setCommentsOpen(false); }}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "border-[#0f6cbf] bg-blue-50/40 shadow-xs" 
                      : "border-[#e9ecef] bg-white hover:border-[#ced4da]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#0f6cbf]">
                      {asg.courseCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      asg.status === "submitted" 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {asg.status === "submitted" ? "SUBMITTED" : "PENDING"}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold mt-1 line-clamp-2 ${isSelected ? "text-[#0f6cbf]" : "text-[#212529]"}`}>
                    {asg.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#6c757d] mt-2 font-mono">
                    <Clock size={12} />
                    <span>{asg.dueDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Authentic Moodle Submission Desk (FR-050 - FR-059) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Assignment Header Card */}
          <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#6c757d]">
                <span className="font-bold text-[#0f6cbf]">{activeAsg.courseCode}</span>
                <span>•</span>
                <span>{activeAsg.courseTitle}</span>
              </div>
              <h2 className="text-xl font-bold text-[#212529] mt-1">
                {activeAsg.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6c757d] mt-2 font-mono">
                <span>Opened: {activeAsg.openedDate}</span>
                <span>•</span>
                <span className="text-[#dc3545] font-semibold">Due: {activeAsg.dueDate}</span>
              </div>
            </div>

            {/* Assignment Brief Description */}
            <div className="pt-3 border-t border-[#e9ecef] text-xs text-[#495057] leading-relaxed space-y-2">
              <p className="font-semibold text-[#212529]">{activeAsg.sessionTitle}</p>
              <ul className="list-disc pl-5 space-y-1">
                {activeAsg.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>

            {/* Brief File Attachment */}
            <div className="p-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#0f6cbf] font-semibold">
                <FileText size={16} />
                <span>{activeAsg.briefFile} ({activeAsg.briefSize})</span>
              </div>
              <button 
                type="button"
                onClick={() => downloadFile(`${activeAsg.id}-practice-brief.txt`, ["SAMPLE ASSIGNMENT BRIEF", activeAsg.courseCode, activeAsg.title, "", ...activeAsg.description, "", "This is sample coursework for the frontend demo."].join("\n"), "text/plain;charset=utf-8")}
                className="px-3 py-1 bg-white border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] flex items-center gap-1 cursor-pointer"
              >
                <Download size={13} /> Download sample brief
              </button>
            </div>
          </div>

          {/* Submission Status Table (Authentic Moodle 4 assign/view.php format) */}
          <div className="bg-white border border-[#dee2e6] rounded-xl p-6 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-[#212529]">Submission status</h3>

            <div className="border border-[#dee2e6] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#e9ecef]">
                  <tr className="bg-[#f8f9fa]/50">
                    <th className="p-3.5 font-semibold text-[#495057] w-1/3">Submission status</th>
                    <td className="p-3.5">
                      {activeAsg.status === "submitted" ? (
                        <span className="font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 inline-flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-green-600" />
                          Submitted for grading
                        </span>
                      ) : (
                        <span className="text-[#6c757d] bg-gray-100 px-2.5 py-1 rounded font-medium">
                          No attempt
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3.5 font-semibold text-[#495057]">Grading status</th>
                    <td className="p-3.5 text-[#6c757d]">
                      {activeAsg.gradingStatus === "graded" ? (
                        <span className="font-bold text-[#0f6cbf]">{activeAsg.grade}</span>
                      ) : (
                        "Not graded"
                      )}
                    </td>
                  </tr>
                  <tr className="bg-[#f8f9fa]/50">
                    <th className="p-3.5 font-semibold text-[#495057]">Time remaining</th>
                    <td className={`p-3.5 font-semibold ${
                      activeAsg.status === "submitted" ? "text-green-700" : "text-[#495057]"
                    }`}>
                      {activeAsg.status === "pending" ? "Past sample deadline · practice allowed" : activeAsg.timeRemaining}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3.5 font-semibold text-[#495057]">Last modified</th>
                    <td className="p-3.5 font-mono text-[#6c757d]">
                      {activeAsg.submittedTime || "-"}
                    </td>
                  </tr>
                  {activeAsg.status === "submitted" && activeAsg.submittedFile && (
                    <tr className="bg-[#f8f9fa]/50">
                      <th className="p-3.5 font-semibold text-[#495057]">File submissions</th>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 font-mono text-[#0f6cbf] font-semibold">
                          <FileText size={16} />
                          <span className="hover:underline cursor-pointer">{activeAsg.submittedFile}</span>
                          <span className="text-[11px] text-[#6c757d] font-normal">({activeAsg.submittedTime})</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {activeAsg.receiptId && (
                    <tr>
                      <th className="p-3.5 font-semibold text-[#495057]">Sample / local reference</th>
                      <td className="p-3.5 font-mono text-green-700 font-bold">
                        {activeAsg.receiptId}
                      </td>
                    </tr>
                  )}
                  {/* Authentic Collapsible Submission Comments Row */}
                  <tr className="bg-[#f8f9fa]/30">
                    <th className="p-3.5 font-semibold text-[#495057] align-top">Submission comments</th>
                    <td className="p-3.5">
                      <div>
                        <button
                          type="button"
                          onClick={() => setCommentsOpen(!commentsOpen)}
                          className="flex items-center gap-1.5 text-xs text-[#0f6cbf] hover:underline font-semibold cursor-pointer"
                        >
                          {commentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          <span>Comments ({commentsList.length})</span>
                        </button>

                        {commentsOpen && (
                          <div className="mt-3 space-y-3 pt-2 border-t border-[#e9ecef]">
                            {commentsList.length > 0 && (
                              <div className="space-y-1.5">
                                {commentsList.map((comm, idx) => (
                                  <div key={idx} className="p-2 bg-white border border-[#ced4da] rounded text-xs text-[#212529]">
                                    <div className="font-semibold text-[10px] text-[#6c757d] font-mono">You:</div>
                                    <div>{comm}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <textarea
                                rows={2}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a practice note (saved only in this browser)..."
                                aria-label="Practice note for this assignment"
                                className="w-full text-xs p-2 border border-[#ced4da] rounded-md bg-white focus:outline-hidden focus:border-[#0f6cbf]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddComment}
                              className="px-3 py-1 bg-[#0f6cbf] text-white rounded text-xs font-semibold hover:bg-[#0d5ca3] cursor-pointer"
                            >
                              Save comment
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons: If Pending -> File Dropzone; If Submitted -> Edit / Remove buttons */}
            {activeAsg.status === "pending" ? (
              <div className="pt-2 space-y-4">
                <div className="border-2 border-dashed border-[#ced4da] rounded-xl p-6 text-center space-y-2 bg-[#f8f9fa]">
                  <UploadCloud size={32} className="mx-auto text-[#0f6cbf]" />
                  <span className="text-xs font-semibold text-[#212529] block">
                    Select a solution file for local practice
                  </span>
                  <span className="text-[11px] text-[#6c757d] block">
                    Maximum file size: 50MB • Accepted: .pdf, .zip, .tar.gz
                  </span>

                  {selectedUploadFile && (
                    <div className="p-2 bg-blue-50 border border-blue-200 text-[#0f6cbf] rounded text-xs font-mono w-fit mx-auto">
                      Ready: {selectedUploadFile}
                    </div>
                  )}
                  <input key={activeAsg.id} type="file" accept=".pdf,.zip,.tar.gz" aria-label="Choose assignment solution file" className="block mx-auto max-w-full text-xs" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const error = validateFile(file, [".pdf", ".zip", ".tar.gz"]);
                    setFileError(error);
                    setSelectedFiles(previous => ({ ...previous, [selectedAsgId]: error ? undefined : file }));
                    event.target.value = "";
                  }} />
                  {fileError && <p role="alert" className="text-xs text-red-600">{fileError}</p>}
                  <p className="text-[11px] text-[#6c757d]">Only file details are saved locally. File contents are not uploaded.</p>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    disabled={!selectedUploadFile}
                    onClick={handleSubmitActive}
                    className="px-6 py-2.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] disabled:opacity-50 text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Send size={14} />
                    <span>Save practice entry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentsList(previous => previous.map(assignment => assignment.id === activeAsg.id ? { ...assignment, status: "pending", submittedFile: undefined, submittedTime: undefined, receiptId: undefined } : assignment));
                    setSelectedFiles(previous => ({ ...previous, [selectedAsgId]: undefined }));
                    setNotificationMsg("Choose a replacement file to save a revised local practice entry.");
                  }}
                  className="px-5 py-2 bg-white border border-[#ced4da] hover:bg-[#f8f9fa] text-[#212529] font-semibold text-xs rounded-md shadow-2xs transition-colors cursor-pointer"
                >
                  Edit submission
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSubmission}
                  className="px-5 py-2 bg-white border border-red-300 hover:bg-red-50 text-red-600 font-semibold text-xs rounded-md shadow-2xs transition-colors cursor-pointer"
                >
                  Remove submission
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
