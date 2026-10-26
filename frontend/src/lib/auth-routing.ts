type SessionRole = "student" | "lecturer" | "admin";

export function getDashboardPath(role: SessionRole) {
  return role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/";
}

export function canAccessRoute(pathname: string, role: SessionRole) {
  try { pathname = decodeURIComponent(pathname); } catch { return false; }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return role === "admin";
  if (pathname === "/lecturer" || pathname.startsWith("/lecturer/")) return role === "lecturer" || role === "admin";
  return true;
}

export function getLoginDestination(next: string | null, role: SessionRole) {
  const fallback = getDashboardPath(role);
  if (next === "/" || next === "/dashboard") return fallback;
  if (!next || !next.startsWith("/") || next.startsWith("//") || /[\\\u0000-\u0020]/.test(next)) return fallback;
  try {
    const url = new URL(next, "https://lms.invalid");
    const pathname = decodeURIComponent(url.pathname);
    if (url.origin !== "https://lms.invalid" || pathname.includes("\\") || pathname.startsWith("//")) return fallback;
    if (/^\/(login|register)(\/|$)/.test(pathname) || !canAccessRoute(pathname, role)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
