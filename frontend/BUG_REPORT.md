# Frontend audit and bug report

**Audit date:** 26 October 2026

**Scope:** Next.js frontend under `frontend/src`; no database or server behavior was changed.

## Fixed

| Priority | Area | Finding | Resolution |
| --- | --- | --- | --- |
| High | Entry and session flow | The requested first screen was not consistently the login page, and dashboard routes could be opened without the expected demo session. | Login-first routing, role-aware redirects, safe deep-link restoration, browser-local session handling, and logout protection are in place. |
| High | Mobile layout | Dashboard shells, tables, cards, forms, dialogs, and tab controls could overflow or be difficult to use on narrow screens. | Shared responsive sizing rules, horizontally scrollable record grids, mobile touch targets, input sizing, and bounded dialogs were added across the shared shell and pages. |
| High | Practice exams | Attempts could be inconsistent around expiry/reload and the interface could imply that a local attempt was an official submission. | Attempt state and deadlines are handled consistently in the browser; completion messaging identifies the result as a local practice record. |
| Medium | Course navigation | Course links and route IDs did not consistently resolve to the matching course. | A shared course catalogue and route mapping now resolve supported course identifiers and aliases. |
| Medium | Calendar and timelines | Calendar layouts and the lecturer attendance form used stale dates; upcoming views could have no current deadlines, and the activity feed showed an old fixed timestamp. | Calendar grids use the selected/current month, sample events are relative to today, the attendance form defaults to today, and the activity feed is clearly labelled as preview data. |
| Medium | Dead controls and misleading feedback | Some controls only raised placeholder alerts, pointed nowhere, nested interactive elements, or implied that unavailable files and records existed. | These were changed to working local navigation/actions, valid links/forms, disabled unavailable actions, or clear preview-state messages. |
| Medium | Certificates and requirements page | Sample certificates looked verifiable, and the requirements matrix implied production/compliance coverage and omitted Gradebook from its category filter. | Certificates are labelled as samples, printing works, and public verification is disabled. The requirements page now describes frontend previews, includes every category in its filter, and explicitly states backend integration is incomplete. |
| Low | Empty and error states | Missing routes or runtime errors could leave users with an unhelpful blank screen. | Shared not-found and route error pages provide recovery navigation. |

## Remaining limitations

- This repository contains no frontend database/API integration. Demo accounts and sample records do not authenticate against or modify an institutional database.
- Password reset, real account registration, server-enforced role permissions, MFA, tenant isolation, official grades, submissions, attendance, notifications, and audit logging require backend services.
- File controls retain selected filenames/metadata locally; they do not upload file contents. Some sample state is stored in this browser only, and other preview state lasts for the current visit.
- Public certificate verification and institutional reports/exports are unavailable. Certificate printing is a browser print action for sample data.
- The deployment at `https://lms-bly1.vercel.app/` is not changed by local source edits. It needs a reviewed redeploy to receive these fixes.

## Verification

- TypeScript: `npx tsc --noEmit` passed.
- ESLint: completed with 0 errors and 157 warnings, mostly unused imports/variables and a few unoptimized `<img>` warnings.
- Production build: webpack compilation and TypeScript completed; Next.js then failed during page prerendering when Windows returned `EPERM` creating a generated nested directory (`.next-mobile-build/server/app/_global-error.segments/_global-error`).
- Browser coverage: code was audited across the auth, student, lecturer, administrator, shared component, and global style routes. Live browser validation was not completed in this pass because the browser's automatic review blocked local navigation after its usage limit.
