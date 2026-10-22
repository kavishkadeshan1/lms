import type { Metadata } from "next";
import "./globals.css";
import { TenantProvider } from "@/lib/tenant-context";

export const metadata: Metadata = {
  title: "LMS 2026 — Customizable Multi-Institution Learning Management System",
  description: "2026 Next-Generation Multi-Tenant Learning Management Platform modeled on University of Colombo Faculty of Technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-screen w-full bg-background">
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
