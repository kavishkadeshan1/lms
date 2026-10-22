"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  Calendar
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function CertificatesPage() {
  const { tenant, user } = useTenant();

  const certificates = [
    {
      id: "cert-1",
      code: "UOC-FOT-2026-ICT3101",
      title: "Certificate of Academic Excellence: Distributed Systems & Cloud",
      issuedTo: user.name,
      indexNo: user.indexNo || "2022/ICT/042",
      institution: tenant.name,
      issueDate: "October 01, 2026",
      grade: "Distinction (Score: 92/100)",
      verificationCode: "VER-9821-4820-UOC",
      qrPreview: "https://lms.tech.cmb.ac.lk/verify/VER-9821-4820-UOC"
    },
    {
      id: "cert-2",
      code: "UOC-FOT-2026-DB3102",
      title: "Honor Roll: Advanced Database Architecture & High-Availability",
      issuedTo: user.name,
      indexNo: user.indexNo || "2022/ICT/042",
      institution: tenant.name,
      issueDate: "September 15, 2026",
      grade: "Honors (Grade A)",
      verificationCode: "VER-5109-1123-UOC",
      qrPreview: "https://lms.tech.cmb.ac.lk/verify/VER-5109-1123-UOC"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-6">
        <span className="text-xs font-mono font-bold text-primary uppercase">
          Credentials & Badges (SRS §6.17, §20, FR-132 - FR-135)
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
          Certificates & Micro-Credentials
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Cryptographically verifiable institutional completion credentials issued by {tenant.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="overflow-hidden border-2 shadow-lg hover:border-primary/50 transition-colors">
            {/* Certificate Header Banner */}
            <div 
              className="p-6 text-white space-y-2 relative"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl">{tenant.crestIcon}</span>
                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase">
                  Verified Credential
                </span>
              </div>
              <h3 className="font-extrabold text-base leading-snug">{cert.title}</h3>
              <p className="text-white/80 text-xs">{cert.institution}</p>
            </div>

            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Awarded to:</span>
                <div className="text-sm font-bold text-foreground">{cert.issuedTo}</div>
                <div className="text-[11px] font-mono text-muted-foreground">Index Number: {cert.indexNo}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Standing:</span>
                  <strong className="text-green-600">{cert.grade}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Issue Date:</span>
                  <strong className="text-foreground">{cert.issueDate}</strong>
                </div>
              </div>

              {/* Unique Verification Code & QR (SRS FR-135) */}
              <div className="p-3 border rounded-xl flex items-center justify-between bg-background">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground block">Verification Hash (FR-135):</span>
                  <span className="font-mono font-bold text-primary text-xs">{cert.verificationCode}</span>
                </div>
                <div className="w-9 h-9 bg-muted rounded flex items-center justify-center text-primary font-bold">
                  <QrCode size={22} />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                  <Download size={14} /> Download PDF
                </Button>
                <Button size="sm" className="w-full text-xs gap-1.5 text-white" style={{ backgroundColor: tenant.primaryColor }}>
                  <ExternalLink size={14} /> Public Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
