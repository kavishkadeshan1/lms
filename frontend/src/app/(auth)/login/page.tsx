"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant, DEMO_CREDENTIALS } from "@/lib/tenant-context";
import { CheckCircle2, Lock, User, KeyRound, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useTenant();

  const [username, setUsername] = useState("2023t01855");
  const [password, setPassword] = useState("Kavishka#2003");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    const success = loginWithCredentials(username, password);
    if (success) {
      const u = username.toLowerCase();
      if (u === "admin.tech") {
        router.push("/admin");
      } else if (u === "lec.pathirana") {
        router.push("/lecturer");
      } else {
        router.push("/");
      }
    } else {
      setError("Invalid login credentials. Please check your username and password.");
    }
  };

  const handleFillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
    loginWithCredentials(u, p);
    if (u === "admin.tech") {
      router.push("/admin");
    } else if (u === "lec.pathirana") {
      router.push("/lecturer");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-between items-center p-4 text-[#212529]">
      {/* Top Academic Brand Header */}
      <header className="w-full max-w-4xl py-6 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="text-3xl">🏛️</span>
          <span className="text-xl font-bold tracking-tight text-[#1e293b]">
            Faculty of Technology, University of Colombo
          </span>
        </div>
        <p className="text-xs text-[#64748b]">
          Online Learning Management System • <span className="font-mono">lms.tech.cmb.ac.lk</span>
        </p>
      </header>

      {/* Main Login Card - Authentic Moodle Boost Style */}
      <main className="w-full max-w-md bg-white border border-[#dee2e6] rounded-xl shadow-xs p-8 space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-xl font-bold text-[#212529]">Log in</h1>
          <p className="text-xs text-[#6c757d] mt-1">
            Sign in with your university account credentials
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#495057] block">
              Username
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-[#adb5bd]" />
              <Input
                type="text"
                placeholder="Username (e.g. 2023t01855)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 text-sm h-10 border-[#ced4da] focus-visible:ring-1 focus-visible:ring-[#0f6cbf]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#495057]">
                Password
              </label>
              <Link href="#" className="text-xs text-[#0f6cbf] hover:underline">
                Lost password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-3 text-[#adb5bd]" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-sm h-10 border-[#ced4da] focus-visible:ring-1 focus-visible:ring-[#0f6cbf]"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6c757d]">
            <input type="checkbox" id="remember" className="rounded text-[#0f6cbf]" defaultChecked />
            <label htmlFor="remember">Remember username</label>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Log in
          </Button>
        </form>

        {/* Demo Accounts for Testing as Requested */}
        <div className="pt-4 border-t border-[#e9ecef] space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6c757d] text-center">
            Demo Credentials For Testing (1-Click Login)
          </div>

          <div className="space-y-2">
            {/* Student */}
            <div 
              onClick={() => handleFillDemo("2023t01855", "Kavishka#2003")}
              className="p-3 border border-[#dee2e6] hover:border-[#0f6cbf] rounded-lg cursor-pointer bg-[#f8f9fa] hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#212529] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Student: Kavishka Sandaruwan
                </div>
                <div className="text-[11px] text-[#6c757d] font-mono mt-0.5">
                  User: <strong>2023t01855</strong> • Pass: <strong>Kavishka#2003</strong>
                </div>
              </div>
              <span className="text-[11px] text-[#0f6cbf] font-semibold">Log in →</span>
            </div>

            {/* Lecturer */}
            <div 
              onClick={() => handleFillDemo("lec.pathirana", "Lecturer#2026")}
              className="p-3 border border-[#dee2e6] hover:border-[#0f6cbf] rounded-lg cursor-pointer bg-[#f8f9fa] hover:bg-amber-50/40 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#212529] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Lecturer: Dr. Aruna Pathirana
                </div>
                <div className="text-[11px] text-[#6c757d] font-mono mt-0.5">
                  User: <strong>lec.pathirana</strong> • Pass: <strong>Lecturer#2026</strong>
                </div>
              </div>
              <span className="text-[11px] text-[#0f6cbf] font-semibold">Log in →</span>
            </div>

            {/* Admin */}
            <div 
              onClick={() => handleFillDemo("admin.tech", "Admin#2026")}
              className="p-3 border border-[#dee2e6] hover:border-[#0f6cbf] rounded-lg cursor-pointer bg-[#f8f9fa] hover:bg-purple-50/40 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#212529] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Administrator: Eng. Chathura Silva
                </div>
                <div className="text-[11px] text-[#6c757d] font-mono mt-0.5">
                  User: <strong>admin.tech</strong> • Pass: <strong>Admin#2026</strong>
                </div>
              </div>
              <span className="text-[11px] text-[#0f6cbf] font-semibold">Log in →</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-[#6c757d]">
          <Link href="#" className="hover:underline">Cookies notice</Link> • <Link href="#" className="hover:underline">Contact site support</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl py-6 text-center text-xs text-[#6c757d]">
        <p>© 2026 Faculty of Technology, University of Colombo, Sri Lanka. All Rights Reserved.</p>
        <p className="mt-1 font-mono text-[11px]">Powered by Customizable Academic LMS Core • Reference: lms.tech.cmb.ac.lk</p>
      </footer>
    </div>
  );
}
