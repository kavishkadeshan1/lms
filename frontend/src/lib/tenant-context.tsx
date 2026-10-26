"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import { createSessionStore, SESSION_KEY } from "@/lib/session-store";
import { useLocalState } from "@/lib/use-local-state";

export type Role = "student" | "lecturer" | "admin";

export interface TenantInfo {
  id: string;
  name: string;
  shortName: string;
  subdomain: string;
  tagline: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  crestIcon: string;
  facultyName: string;
  footerText?: string;
  aiEnabled?: boolean;
}

export const PRESET_TENANTS: Record<string, TenantInfo> = {
  uoc_fot: {
    id: "uoc_fot",
    name: "Faculty of Technology, University of Colombo",
    shortName: "LMS - Technology",
    subdomain: "lms.tech.cmb.ac.lk",
    tagline: "Center of Excellence in Technology Education",
    primaryColor: "#0f6cbf", // Authentic Moodle Blue used on lms.tech.cmb.ac.lk
    secondaryColor: "#0d5ca3",
    accentColor: "#f59e0b",
    crestIcon: "🏛️",
    facultyName: "Faculty of Technology",
    footerText: "© 2026 Faculty of Technology, University of Colombo, Sri Lanka. All Rights Reserved.",
    aiEnabled: true
  },
  uom_fit: {
    id: "uom_fit",
    name: "Faculty of Information Technology, University of Moratuwa",
    shortName: "UOM ITFAC",
    subdomain: "lms.itfac.mrt.ac.lk",
    tagline: "Inspiring Technology, Empowering Futures",
    primaryColor: "#7f1d1d",
    secondaryColor: "#991b1b",
    accentColor: "#eab308",
    crestIcon: "⚙️",
    facultyName: "Faculty of Information Technology",
    footerText: "© 2026 Faculty of Information Technology, University of Moratuwa.",
    aiEnabled: true
  },
  sliit_comp: {
    id: "sliit_comp",
    name: "Faculty of Computing, SLIIT",
    shortName: "SLIIT LMS",
    subdomain: "courseweb.sliit.lk",
    tagline: "Discover Excellence in Computing & Engineering",
    primaryColor: "#1e3a8a",
    secondaryColor: "#2563eb",
    accentColor: "#f97316",
    crestIcon: "🎓",
    facultyName: "Faculty of Computing",
    footerText: "© 2026 Sri Lanka Institute of Information Technology.",
    aiEnabled: true
  }
};

export const UOC_TENANT = PRESET_TENANTS.uoc_fot;

export interface UserProfile {
  username: string;
  name: string;
  displayName: string;
  email: string;
  role: Role;
  indexNo?: string;
  department: string;
  programme: string;
  avatarInitials: string;
}

export const DEMO_CREDENTIALS: Record<string, { pass: string; user: UserProfile }> = {
  "2023t01855": {
    pass: "Kavishka#2003",
    user: {
      username: "2023t01855",
      name: "Kavishka Sandaruwan",
      displayName: "K. G. K. Sandaruwan",
      email: "2023t01855@tech.cmb.ac.lk",
      role: "student",
      indexNo: "2023t01855",
      department: "Department of Information and Communication Technology",
      programme: "Bachelor of Information and Communication Technology (BICT Hons)",
      avatarInitials: "KS",
    }
  },
  "lec.pathirana": {
    pass: "Lecturer#2026",
    user: {
      username: "lec.pathirana",
      name: "Dr. Aruna Pathirana",
      displayName: "Dr. A. Pathirana",
      email: "aruna.p@tech.cmb.ac.lk",
      role: "lecturer",
      department: "Department of Information and Communication Technology",
      programme: "Senior Lecturer (Grade I) • Course Coordinator",
      avatarInitials: "AP",
    }
  },
  "admin.tech": {
    pass: "Admin#2026",
    user: {
      username: "admin.tech",
      name: "Eng. Chathura Silva",
      displayName: "Eng. C. Silva (Admin)",
      email: "admin.lms@tech.cmb.ac.lk",
      role: "admin",
      department: "Faculty Technology IT Centre",
      programme: "Senior System Administrator & Head of LMS Operations",
      avatarInitials: "CS",
    }
  }
};

interface TenantContextType {
  tenant: TenantInfo;
  setTenant: (tenant: TenantInfo) => void;
  allTenants: TenantInfo[];
  user: UserProfile;
  isAuthenticated: boolean;
  sessionReady: boolean;
  loginWithCredentials: (username: string, pass: string) => boolean;
  logout: () => void;
  setRole: (role: Role) => void;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const sessionStore = createSessionStore(() => window.localStorage);
const subscribeSession = (listener: () => void) => {
  const unsubscribe = sessionStore.subscribe(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY || event.key === null) sessionStore.refresh();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    unsubscribe();
    window.removeEventListener("storage", onStorage);
  };
};
const emptySubscribe = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;
const getServerSession = () => null;

function isTenantInfo(value: unknown): value is TenantInfo {
  if (!value || typeof value !== "object") return false;
  const tenant = value as Record<string, unknown>;
  return ["id", "name", "shortName", "subdomain", "tagline", "primaryColor", "crestIcon", "facultyName"].every(key => typeof tenant[key] === "string");
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useLocalState<TenantInfo>("lms:active-tenant", PRESET_TENANTS.uoc_fot, isTenantInfo);
  const username = useSyncExternalStore(subscribeSession, sessionStore.getSnapshot, getServerSession);
  const sessionReady = useSyncExternalStore(emptySubscribe, getClientReady, getServerReady);
  const credential = username && Object.hasOwn(DEMO_CREDENTIALS, username) ? DEMO_CREDENTIALS[username] : null;
  const isAuthenticated = Boolean(credential);
  // Consumers only render inside the session gate. This fallback keeps the
  // profile shape stable during server rendering, before browser storage loads.
  const user = credential?.user ?? DEMO_CREDENTIALS["2023t01855"].user;
  const [editing, setEditing] = useState<{ username: string | null; enabled: boolean }>({ username: null, enabled: false });
  const editMode = isAuthenticated && user.role !== "student" && editing.username === username && editing.enabled;
  const setEditMode = (enabled: boolean) => setEditing({ username, enabled });

  const loginWithCredentials = (username: string, pass: string): boolean => {
    const normalized = username.trim().toLowerCase();
    const cred = Object.hasOwn(DEMO_CREDENTIALS, normalized) ? DEMO_CREDENTIALS[normalized] : null;
    if (cred && cred.pass === pass) {
      setEditMode(false);
      sessionStore.setSession(normalized);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStore.setSession(null);
    setEditMode(false);
  };

  const setRole = (newRole: Role) => {
    const match = Object.values(DEMO_CREDENTIALS).find(c => c.user.role === newRole);
    if (match) {
      sessionStore.setSession(match.user.username);
      setEditMode(false);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenant,
        allTenants: Object.values(PRESET_TENANTS),
        user,
        isAuthenticated,
        sessionReady,
        loginWithCredentials,
        logout,
        setRole,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
