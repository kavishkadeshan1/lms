"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Award, 
  Sparkles,
  Lock
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function ReviewsAndFeedbackPage() {
  const { tenant } = useTenant();

  const [courseRatings, setCourseRatings] = useState<Record<string, number>>({
    courseContent: 5,
    lecturerClarity: 5,
    practicalLabs: 4,
    lmsUsability: 5
  });

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [feedbackCategory, setFeedbackCategory] = useState("course");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-6">
        <span className="text-xs font-mono font-bold text-primary uppercase">
          Quality Assurance & Continuous Improvement (SRS §6.15, §16, FR-116 - FR-122)
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
          Course Evaluation & LMS Usability Reviews
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your feedback directly drives curriculum updates, teaching enhancements, and platform upgrades for {tenant.name}.
        </p>
      </div>

      {submitted ? (
        <Card className="border-green-500/30 bg-green-500/5 animate-in zoom-in-95">
          <CardContent className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
              Evaluation Recorded Anonymously
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your evaluation scores and comments have been aggregated into the Faculty Quality Assurance Board dashboard. No personal identifiers are linked.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSubmitted(false); setComments(""); }}
              className="text-xs mt-2"
            >
              Submit Another Evaluation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evaluation Target & Course Selection</CardTitle>
              <CardDescription>Select whether you are evaluating a semester course or the LMS platform itself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1.5">Feedback Focus</label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background font-medium focus:outline-hidden text-xs"
                  >
                    <option value="course">Course Delivery & Lecturer Evaluation (FR-116, FR-117)</option>
                    <option value="lms">LMS Platform Usability & Experience (FR-118)</option>
                  </select>
                </div>

                {feedbackCategory === "course" && (
                  <div>
                    <label className="font-semibold block mb-1.5">Enrolled Course Module</label>
                    <select className="w-full border rounded-lg px-3 py-2 bg-background font-medium focus:outline-hidden text-xs">
                      <option>ICT 3101: Distributed Systems (Dr. Aruna Pathirana)</option>
                      <option>ICT 3102: Advanced Database Systems (Dr. K. A. S. Fernando)</option>
                      <option>ICT 3103: Enterprise Application Security (Eng. Chathura Silva)</option>
                      <option>ET 2105: Embedded Systems & IoT (Dr. R. M. Wijesinghe)</option>
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rating Scales (FR-120) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Standardized 5-Star Rating Criteria (FR-120)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "courseContent", label: "Curriculum Relevance & Course Material Quality" },
                { key: "lecturerClarity", label: "Lecturer Explanation Clarity & Responsiveness" },
                { key: "practicalLabs", label: "Practical Lab Exercises & Real-World Application" },
                { key: "lmsUsability", label: "LMS 2026 Navigation, Speed & AI Assistant Utility" }
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/20 rounded-xl">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setCourseRatings(prev => ({ ...prev, [item.key]: star }))}
                        className="p-1 focus:outline-hidden"
                      >
                        <Star
                          size={18}
                          className={star <= courseRatings[item.key] ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-muted-foreground ml-2 font-mono">
                      {courseRatings[item.key]}/5
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Qualitative Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Constructive Qualitative Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <textarea
                rows={4}
                required
                placeholder="Please share specific suggestions on how the course materials, lecture pace, lab exercises, or LMS tools could be improved..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full text-xs p-3.5 border rounded-xl bg-background focus:ring-1 focus:ring-primary outline-hidden"
              />

              {/* Anonymous Mode Toggle (FR-119) */}
              <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold block text-foreground flex items-center gap-1.5">
                    <Lock size={13} className="text-primary" /> Submit Anonymously (SRS FR-119)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Your student index number and identity will be stripped before saving to institutional reports.
                  </span>
                </div>
              </label>

              <Button
                type="submit"
                className="w-full text-xs font-semibold h-10 gap-2 text-white"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                <Send size={15} /> Submit Quality Evaluation
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
