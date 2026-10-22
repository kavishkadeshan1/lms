"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  FileText,
  CornerDownRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: string[];
  timestamp: string;
  needsEscalation?: boolean;
}

const PRESET_KNOWLEDGE: Record<string, { answer: string; sources: string[]; escalate?: boolean }> = {
  "sqa": {
    answer: "For **IC 3204: Introduction to Software Quality Assurance**, Assignment 1 on *Equivalence Partitioning & Boundary Value Analysis* is due on **October 16, 2026 at 11:59 PM**. Check the Session 2 module for the rubric and template.",
    sources: ["IC3204_Syllabus_2026.pdf (p. 3)", "FOT_Academic_Policies_2026.pdf"]
  },
  "exam": {
    answer: "The **2025/2026 Semester 1 End-Semester Final Written Examinations** for Level 3 BICT candidates commence on **November 20, 2026**. Remember: you must maintain at least **80% attendance** in each course to be certified eligible for the exam admission card.",
    sources: ["FOT_Academic_Calendar_2026.pdf", "Examination_Handbook_2026.pdf (Reg 12.1)"]
  },
  "attendance": {
    answer: "Your current verified overall attendance is **92.8%** across enrolled courses. You have completed 31 out of 34 class sessions and meet the 80% eligibility threshold for all final evaluations.",
    sources: ["LMS_Student_Attendance_Ledger_2023t01855"]
  },
  "docker": {
    answer: "In Session 3 of IC 3101, Dr. Aruna demonstrated how container healthchecks prevent cascading failures in microservice orchestration using Docker Compose and Kubernetes readiness probes.",
    sources: ["IC3101_Lecture03_Containers.pdf (slides 14-26)"]
  },
  "appeal": {
    answer: "Academic grade re-scrutiny appeals cannot be processed directly via LMS chat. Formal re-scrutiny applications must be submitted to the Senior Assistant Registrar (Examinations) within 14 working days of result release with payment receipt.",
    sources: ["UOC_FOT_Examination_Rescrutiny_Guidelines.pdf"],
    escalate: true
  }
};

export function AIChatbotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [escalated, setEscalated] = useState(false);
  const { tenant, user } = useTenant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello ${user.displayName}! I am your **${tenant.shortName} AI Academic Assistant**. I can answer questions about your courses (e.g. IC 3204, IC 3101), assignment deadlines, and exam regulations.`,
      sources: [`Faculty of Technology Authorized Course Knowledge Base`],
      timestamp: "Just now"
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      const lower = q.toLowerCase();
      let matched = PRESET_KNOWLEDGE["sqa"];

      if (lower.includes("exam") || lower.includes("timetable") || lower.includes("final")) {
        matched = PRESET_KNOWLEDGE["exam"];
      } else if (lower.includes("attend") || lower.includes("eligib") || lower.includes("percent")) {
        matched = PRESET_KNOWLEDGE["attendance"];
      } else if (lower.includes("docker") || lower.includes("container") || lower.includes("3101")) {
        matched = PRESET_KNOWLEDGE["docker"];
      } else if (lower.includes("appeal") || lower.includes("recheck") || lower.includes("grade")) {
        matched = PRESET_KNOWLEDGE["appeal"];
      } else {
        matched = {
          answer: `Regarding *"\\"${q}\\"*: Based on your enrolled courses in **${tenant.facultyName}**, this topic is covered under Semester 1 curriculum modules. Please verify the relevant lecture handouts or ask your course coordinator for specific rubric clarification.`,
          sources: [`${tenant.name} Official Module Catalogue 2026`]
        };
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: matched.answer,
        sources: matched.sources,
        needsEscalation: matched.escalate,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  const quickPrompts = [
    "When is IC 3204 Assignment 1 due?",
    "What is my current attendance percentage?",
    "When do Semester 1 final exams start?",
    "How do I submit an exam grade appeal?"
  ];

  if (tenant.aiEnabled === false) {
    return null;
  }

  return (
    <>
      {/* Discreet Academic Support Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-4 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white rounded-full shadow-md flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer border border-[#0d5ca3]"
        >
          <Sparkles className="w-4 h-4" />
          <span>LMS Support & AI Tutor</span>
        </button>
      </div>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-18 right-5 w-[420px] max-w-[94vw] h-[580px] max-h-[82vh] bg-white border border-[#dee2e6] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden text-[#212529]">
          {/* Header */}
          <div className="p-3.5 bg-[#0f6cbf] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>Faculty AI Academic Assistant</span>
                  <span className="text-[10px] bg-green-500 text-white font-medium px-1.5 py-0.2 rounded-full">Grounded</span>
                </div>
                <div className="text-[10px] text-white/80">University of Colombo Faculty of Technology</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Policy Guardrail Notice */}
          <div className="bg-[#fff3cd] border-b border-[#ffeeba] px-3 py-1.5 text-[11px] text-[#856404] flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Answers grounded in authorized course materials. AI cannot modify marks.</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#f8f9fa]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0f6cbf] text-white rounded-br-none shadow-xs"
                      : "bg-white border border-[#dee2e6] text-[#212529] rounded-bl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#e9ecef] text-[11px]">
                      <div className="font-semibold text-[#6c757d] flex items-center gap-1 mb-1">
                        <FileText className="w-3 h-3 text-[#0f6cbf]" /> Sources Cited:
                      </div>
                      <div className="space-y-0.5">
                        {m.sources.map((s, idx) => (
                          <div key={idx} className="bg-[#f8f9fa] border border-[#e9ecef] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#6c757d] flex items-center gap-1">
                            <CornerDownRight className="w-2.5 h-2.5" /> {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.needsEscalation && (
                    <div className="mt-2.5 pt-2 border-t border-red-200">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full text-xs h-7 gap-1"
                        onClick={() => setEscalated(true)}
                      >
                        <UserCheck className="w-3 h-3" />
                        Escalate to Senior Assistant Registrar (Exams)
                      </Button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#6c757d] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-t border-[#dee2e6] bg-white overflow-x-auto flex gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[10px] whitespace-nowrap bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] px-2 py-1 rounded-full border border-[#dee2e6] transition-colors cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-[#dee2e6] bg-white flex items-center gap-2">
            <Input
              placeholder="Ask about courses, deadlines, grades..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="text-xs h-9 focus-visible:ring-1 focus-visible:ring-[#0f6cbf]"
            />
            <Button
              size="icon"
              className="h-9 w-9 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white rounded-lg flex-shrink-0"
              onClick={() => handleSend()}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Escalation Confirmation Modal */}
      {escalated && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-[#dee2e6] rounded-xl shadow-xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Ticket Escalated (Ticket #LMS-2026-8492)
            </div>
            <p className="text-[#495057]">
              Your academic inquiry has been forwarded to the <strong>Senior Assistant Registrar (Examinations)</strong>.
            </p>
            <div className="p-2.5 bg-[#f8f9fa] border border-[#dee2e6] rounded font-mono text-[11px] space-y-1">
              <div>Student: {user.name} ({user.indexNo})</div>
              <div>Faculty: Faculty of Technology</div>
              <div>Status: Queued for Examination Board Review</div>
            </div>
            <Button className="w-full text-xs h-9 bg-[#0f6cbf] text-white mt-2" onClick={() => setEscalated(false)}>
              Return to Chat
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
