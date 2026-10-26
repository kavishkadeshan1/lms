"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function LecturerFeedbackTrendsPage() {
  const { tenant } = useTenant();

  const feedbackList = [
    {
      course: "ICT 3101: Distributed Systems",
      rating: 5,
      date: "Oct 06, 2026",
      comment: "Dr. Aruna's breakdown of the Raft leader election algorithm was one of the clearest lectures this semester. The Go simulator lab task was very practical.",
      isAnonymous: true
    },
    {
      course: "ICT 3101: Distributed Systems",
      rating: 4,
      date: "Oct 04, 2026",
      comment: "Great content and slides. Would appreciate if the deadline for the Docker orchestration task had a 1-day extension during exam week.",
      isAnonymous: true
    },
    {
      course: "ICT 3101: Distributed Systems",
      rating: 5,
      date: "Sep 29, 2026",
      comment: "The LMS 2026 AI chatbot is super helpful when checking lecture slides late at night. Grounded references save so much search time.",
      isAnonymous: true
    }
  ];

  return (
    <div className="p-0 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-6">
        <span className="text-xs font-mono font-bold text-primary uppercase">
          Quality Assurance & Student Evaluation (SRS §6.15, FR-121)
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
          Course Feedback & Quality Analytics
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Aggregated student feedback and ratings for courses taught by <strong>Dr. Aruna Pathirana</strong> in {tenant.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <span className="text-xs text-muted-foreground">Overall Instructor Rating</span>
            <div className="text-4xl font-extrabold text-foreground flex items-center justify-center gap-2">
              4.8 <Star size={28} className="text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xs text-green-600 font-medium">Top 5% in Faculty of Technology</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <span className="text-xs text-muted-foreground">Total Responses Recorded</span>
            <div className="text-4xl font-extrabold text-primary">42</div>
            <div className="text-xs text-muted-foreground">93% student participation rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <span className="text-xs text-muted-foreground">Positive Sentiment</span>
            <div className="text-4xl font-extrabold text-green-600">95.2%</div>
            <div className="text-xs text-muted-foreground">High praise for practical labs</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Student Reviews (SRS FR-116, FR-119)</CardTitle>
          <CardDescription>Anonymized feedback entries reviewed by the Faculty Quality Assurance Cell.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y text-xs">
            {feedbackList.map((fb, idx) => (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= fb.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}
                      />
                    ))}
                    <span className="font-bold text-foreground ml-1.5">{fb.rating}.0 / 5.0</span>
                  </div>
                  <span className="text-muted-foreground font-mono">{fb.date}</span>
                </div>
                <p className="text-foreground leading-relaxed italic">
                  &ldquo;{fb.comment}&rdquo;
                </p>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Submitted as: Anonymous Student • Course: {fb.course}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
