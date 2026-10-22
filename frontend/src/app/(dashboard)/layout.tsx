import React, { Suspense } from "react";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full bg-muted/20 items-center justify-center text-xs text-muted-foreground font-mono">Loading LMS Workspace...</div>}>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </Suspense>
  );
}
