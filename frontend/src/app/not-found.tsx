import Link from "next/link";

export default function NotFound() {
  return <main className="min-h-screen w-full grid place-items-center p-6"><section className="max-w-md space-y-4 rounded-xl border bg-white p-8">
    <h1 className="text-xl font-bold">Page not found</h1>
    <p className="text-sm text-slate-600">This LMS link is unavailable. Choose your dashboard to continue.</p>
    <Link href="/" className="inline-block text-[#0f6cbf] underline">Return to dashboard</Link>
  </section></main>;
}
