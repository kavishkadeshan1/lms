import React, { Suspense } from "react";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

// This demo restores its session in the browser before mounting protected pages.
// It cannot produce those pages in Next's unauthenticated static-shell check.
export const instant = false;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full bg-muted/20 items-center justify-center text-xs text-muted-foreground font-mono">Loading LMS Workspace...</div>}>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </Suspense>
  );
}
