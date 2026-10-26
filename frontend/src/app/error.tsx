"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <main className="min-h-screen w-full grid place-items-center p-6"><section className="max-w-md space-y-4 rounded-xl border bg-white p-8">
    <h1 className="text-xl font-bold">This page could not load</h1>
    <p className="text-sm text-slate-600">Try loading it again, or return to your dashboard.</p>
    <button onClick={retry} className="rounded-lg bg-[#0f6cbf] text-white px-4 py-2 text-sm">Try again</button>
    <Link href="/" className="block text-sm text-[#0f6cbf] underline">Return to dashboard</Link>
  </section></main>;
}
