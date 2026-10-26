import Link from "next/link";

export default function RegisterPage() {
  return <main className="min-h-screen w-full grid place-items-center bg-[#f8f9fa] p-4">
    <section className="w-full max-w-md rounded-xl border bg-white p-5 sm:p-8 space-y-4">
      <h1 className="text-xl font-bold">Account registration</h1>
      <p className="text-sm text-slate-600">University accounts are issued by your institution. Contact your faculty administrator to request access or recover your account.</p>
      <p className="text-sm text-slate-600">This frontend demo does not create university accounts. You can explore the student, lecturer, and administrator views using the demo accounts on the login page.</p>
      <Link href="/login" className="inline-block rounded-lg bg-[#0f6cbf] px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
    </section>
  </main>;
}
