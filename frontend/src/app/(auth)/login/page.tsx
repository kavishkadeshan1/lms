"use client";

import React, { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant, DEMO_CREDENTIALS } from "@/lib/tenant-context";
import { getLoginDestination } from "@/lib/auth-routing";
import { createSessionStore } from "@/lib/session-store";
import { KeyRound, User, AlertCircle } from "lucide-react";

const rememberedUsername = createSessionStore(() => window.localStorage, "lms_remembered_username");
const noRememberedUsername = () => null;

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen w-full grid place-items-center text-sm" role="status">Loading login…</div>}><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithCredentials, isAuthenticated, sessionReady, user, tenant } = useTenant();
  const remembered = useSyncExternalStore(rememberedUsername.subscribe, rememberedUsername.getSnapshot, noRememberedUsername);
  const [enteredUsername, setEnteredUsername] = useState<string | null>(null);
  const username = enteredUsername ?? remembered ?? "";
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      router.replace(getLoginDestination(searchParams.get("next"), user.role));
    }
  }, [sessionReady, isAuthenticated, searchParams, router, user.role]);

  function signIn(name: string, pass: string) {
    setError(null);
    if (!loginWithCredentials(name, pass)) {
      setError("Invalid username or password. Use one of the demo accounts listed below.");
      return;
    }
    rememberedUsername.setSession(remember ? name.trim().toLowerCase() : null);
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col items-center p-4 text-[#212529]">
      <header className="w-full max-w-4xl py-6 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{tenant.crestIcon}</span>
          <span className="text-lg sm:text-xl font-bold tracking-tight">{tenant.name}</span>
        </div>
        <p className="text-xs text-[#64748b]">Online Learning Management System</p>
      </header>
      <main className="w-full max-w-md bg-white border border-[#dee2e6] rounded-xl shadow-xs p-6 sm:p-8 space-y-6 my-auto">
        <div className="border-b pb-4">
          <h1 className="text-xl font-bold">Log in</h1>
          <p className="text-xs text-[#6c757d] mt-1">Sign in to open your learning dashboard.</p>
        </div>
        {error && <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex gap-2"><AlertCircle size={16} className="shrink-0" /><span>{error}</span></div>}
        <form onSubmit={(event) => { event.preventDefault(); signIn(username, password); }} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold block">Username</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-[#adb5bd]" aria-hidden="true" />
              <Input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Your username" value={username} onChange={(event) => { setEnteredUsername(event.target.value); setError(null); }} className="pl-9 h-10" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold">Password</label>
              <a href="#account-help" className="text-xs text-[#0f6cbf] hover:underline">Login help</a>
            </div>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-3 text-[#adb5bd]" aria-hidden="true" />
              <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(event) => { setPassword(event.target.value); setError(null); }} className="pl-9 h-10" required />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#6c757d]"><input type="checkbox" checked={remember} onChange={(event) => { setEnteredUsername(username); setRemember(event.target.checked); if (!event.target.checked) rememberedUsername.setSession(null); }} />Remember username on this browser</label>
          <Button type="submit" disabled={!sessionReady || isAuthenticated} className="w-full h-10 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold">{isAuthenticated ? "Opening dashboard…" : "Log in"}</Button>
        </form>
        <section aria-label="Demo accounts" className="pt-4 border-t space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#6c757d] text-center">Try a demo account</h2>
          <p className="text-xs text-[#6c757d]">This frontend uses sample accounts and sample academic data.</p>
          <div className="space-y-2">
            {Object.entries(DEMO_CREDENTIALS).map(([name, credential]) => <button key={name} type="button" disabled={!sessionReady || isAuthenticated} onClick={() => signIn(name, credential.pass)} className="w-full p-3 border rounded-lg bg-[#f8f9fa] hover:border-[#0f6cbf] hover:bg-blue-50/40 text-left text-xs disabled:opacity-50">
              <span className="block font-bold capitalize">{credential.user.role}: {credential.user.name}</span>
              <span className="block text-[11px] text-[#6c757d] mt-1 break-all">User: {name} · Password: {credential.pass}</span>
              <span className="block text-[#0f6cbf] font-semibold mt-1">Open {credential.user.role} demo →</span>
            </button>)}
          </div>
        </section>
        <section id="account-help" className="pt-3 border-t text-xs text-[#6c757d] space-y-2">
          <h2 className="font-semibold text-[#212529]">Account help</h2>
          <p>Use a listed demo account. University account creation and password recovery are not connected in this demo; contact your institution for a real account.</p>
          <p>Only the demo username is stored to restore your session. Logging out clears it. If browser storage is blocked, the session lasts until this tab reloads.</p>
          <Link href="/register" className="inline-block text-[#0f6cbf] hover:underline">Account registration information</Link>
        </section>
      </main>
      <footer className="w-full max-w-4xl py-6 text-center text-xs text-[#6c757d]">{tenant.footerText}</footer>
    </div>
  );
}
