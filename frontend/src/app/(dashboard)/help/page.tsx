import Link from "next/link";

export default function HelpPage() {
  return <div className="max-w-2xl space-y-6">
    <h1 className="text-2xl font-bold">LMS help</h1>
    <section id="storage" className="bg-white border rounded-xl p-6 space-y-2">
      <h2 className="text-lg font-semibold">Browser data</h2>
      <p className="text-sm text-slate-600">This is a frontend demo with sample academic data. Your demo session and some practice changes are stored in this browser. They are separate from university records and do not sync to another device.</p>
      <p className="text-sm text-slate-600">Log out through the account menu to end your session. Clearing this website’s browser data also removes saved practice data.</p>
    </section>
    <section id="support" className="bg-white border rounded-xl p-6 space-y-2">
      <h2 className="text-lg font-semibold">Account and course support</h2>
      <p className="text-sm text-slate-600">Use the demo accounts on the login page to explore each role. Real account registration, password recovery, official submissions, and university support messages require your institution’s connected service.</p>
      <Link href="/feedback" className="inline-block text-sm text-[#0f6cbf] underline">Open the sample feedback screen</Link>
    </section>
  </div>;
}
