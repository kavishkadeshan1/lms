# LMS frontend

The frontend is a Next.js demo with sample student, lecturer, and administrator workspaces.

## Run locally

Use Node.js 24 or newer.

```powershell
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000. A fresh browser opens the login page. The login screen lists the available demo accounts. Successful sign-in opens the correct role dashboard or restores an allowed deep link. Logout ends the demo session and closes dashboard access.

Development and production use Webpack with the official Tailwind PostCSS plugin. This avoids the Turbopack CSS worker startup failure observed on Windows.

## Check changes

```powershell
npm test
npx tsc --noEmit
npm run lint
npm run build
```

The regression tests cover sessions (including blocked storage), safe login redirects, role navigation, course routing, exam deadlines and completion, file validation, calendar alignment, saved-state recovery, and CSV escaping.

## Demo data and persistence

No frontend page currently calls the backend or a database. Demo sign-in uses the sample accounts in `src/lib/tenant-context.tsx`; browser-stored usernames are not production authentication.

Course enrolments, created courses, course sections, practice exam answers/deadlines, assignment metadata/notes, selected branding, and some administration lists are saved in browser storage. They do not synchronize to other devices or change institutional records. Other preview controls, including calendar events and sample evaluations, last for the current visit.

File selectors validate real selections, but only filenames and metadata are retained. File contents are not uploaded. Practice completion references are local identifiers, not official submission receipts or grades. Report and attendance exports contain sample data; assessment exports are drafts.

Production account registration, password recovery, authorization, official submissions, grade publication, and staff messages require backend services and server-verified authentication.

## Vercel

Set the Vercel project's Root Directory to `frontend`, use the Next.js framework preset, and build with `npm run build`. Redeploy after reviewing these changes; local edits do not update an existing deployment.
