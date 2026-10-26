"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ShieldCheck, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Mail,
  GraduationCap,
  BookOpen,
  X
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { useLocalState } from "@/lib/use-local-state";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin" | "superadmin";
  indexOrStaffId: string;
  department: string;
  status: "Active" | "Suspended";
  mfaEnabled: boolean;
  lastLogin: string;
}

export default function UsersManagementPage() {
  const { tenant, user } = useTenant();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkImportSuccess, setBulkImportSuccess] = useState(false);

  // Add User Modal State (SRS FR-016 - FR-019)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "lecturer" | "admin">("student");
  const [newUserIndex, setNewUserIndex] = useState("");
  const [newUserDept, setNewUserDept] = useState("Dept of ICT");
  const [newUserMfa, setNewUserMfa] = useState(true);
  const [userCreationNotice, setUserCreationNotice] = useState<string | null>(null);
  const [userError, setUserError] = useState("");

  const [users, setUsers] = useLocalState<UserRecord[]>(`lms:users:${tenant.id}:${user.username}`, [
    {
      id: "u-1",
      name: "Kavishka Sandaruwan",
      email: "kavishka.2022ict042@tech.cmb.ac.lk",
      role: "student",
      indexOrStaffId: "2022/ICT/042",
      department: "Dept of ICT (BICT Hons)",
      status: "Active",
      mfaEnabled: true,
      lastLogin: "10 mins ago"
    },
    {
      id: "u-2",
      name: "Dr. Aruna Pathirana",
      email: "aruna.p@tech.cmb.ac.lk",
      role: "lecturer",
      indexOrStaffId: "STAFF/FOT/019",
      department: "Dept of ICT",
      status: "Active",
      mfaEnabled: true,
      lastLogin: "1 hour ago"
    },
    {
      id: "u-3",
      name: "Eng. Chathura Silva",
      email: "admin.lms@tech.cmb.ac.lk",
      role: "admin",
      indexOrStaffId: "STAFF/FOT/002",
      department: "Faculty Technology IT Centre",
      status: "Active",
      mfaEnabled: true,
      lastLogin: "Just now"
    },
    {
      id: "u-4",
      name: "Nipuni Wickramasinghe",
      email: "nipuni.2022bst018@tech.cmb.ac.lk",
      role: "student",
      indexOrStaffId: "2022/BST/018",
      department: "Dept of Biosystems Technology",
      status: "Active",
      mfaEnabled: false,
      lastLogin: "Yesterday"
    },
    {
      id: "u-5",
      name: "Kasun Jayawardena",
      email: "kasun.2021et005@tech.cmb.ac.lk",
      role: "student",
      indexOrStaffId: "2021/ET/005",
      department: "Dept of Engineering Technology",
      status: "Suspended",
      mfaEnabled: false,
      lastLogin: "2 weeks ago"
    }
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.indexOrStaffId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      return { ...u, status: u.status === "Active" ? "Suspended" : "Active" };
    }));
  };

  const handleSimulateBulkImport = () => {
    setBulkImportSuccess(true);
    setTimeout(() => {
      setShowBulkModal(false);
      setBulkImportSuccess(false);
    }, 2000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    if (users.some(user => user.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
      setUserError("A user with this email address already exists.");
      return;
    }

    const created: UserRecord = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      indexOrStaffId: newUserIndex.trim() || (newUserRole === "student" ? "2024/ICT/001" : "STAFF/2026/01"),
      department: newUserDept,
      status: "Active",
      mfaEnabled: newUserMfa,
      lastLogin: "Never logged in"
    };

    setUsers(prev => [created, ...prev]);
    setUserError("");
    setShowAddUserModal(false);
    setUserCreationNotice(`Demo user "${created.name}" added to this preview. No login account was created.`);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserIndex("");
    setTimeout(() => setUserCreationNotice(null), 4000);
  };

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Identity & Access Management (SRS §6.3, FR-016 - FR-024)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            User Directory & Role Permissions (RBAC)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage authenticated accounts, student academic profiles, lecturer teaching assignments, and security states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowBulkModal(true)}
            className="text-xs gap-2"
          >
            <FileSpreadsheet size={15} /> Bulk CSV Import (FR-045)
          </Button>
          <Button 
            onClick={() => setShowAddUserModal(true)}
            className="text-xs gap-2 text-white cursor-pointer"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            <UserPlus size={15} /> Add New User
          </Button>
        </div>
      </div>

      {userCreationNotice && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
            <span>{userCreationNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setUserCreationNotice(null)} 
            className="text-green-700 hover:text-green-900 cursor-pointer p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-muted/20 p-3 rounded-xl border">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, index no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter size={14} /> Role:
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border rounded-lg px-3 py-1.5 bg-background font-medium focus:outline-hidden"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <p className="px-4 py-2 text-xs text-muted-foreground md:hidden">Swipe horizontally to view all columns.</p>
          <div className="lms-data-grid divide-y text-xs" role="region" aria-label="Scrollable records" tabIndex={0}>
            <div className="p-3.5 grid grid-cols-12 font-bold bg-muted/40 text-muted-foreground">
              <div className="col-span-4">User Details</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3">Department & Academic Unit</div>
              <div className="col-span-1 text-center">MFA</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {filteredUsers.map((u) => (
              <div key={u.id} className="p-4 grid grid-cols-12 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{u.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{u.indexOrStaffId}</div>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${
                    u.role === "student" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                    u.role === "lecturer" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                    "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="col-span-3 text-muted-foreground">
                  <span className="font-medium text-foreground">{u.department}</span>
                  <div className="text-[10px]">Last login: {u.lastLogin}</div>
                </div>

                <div className="col-span-1 text-center">
                  {u.mfaEnabled ? (
                    <span className="text-green-600 font-bold text-[10px] bg-green-500/10 px-1.5 py-0.5 rounded">Enabled</span>
                  ) : (
                    <span className="text-muted-foreground text-[10px]">Off</span>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  <span className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                    u.status === "Active" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}>
                    {u.status}
                  </span>
                </div>

                <div className="col-span-1 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleStatus(u.id)}
                    className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {u.status === "Active" ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk CSV Import Modal (SRS FR-045) */}
      {showBulkModal && (
        <div className="lms-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full animate-in zoom-in-95">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" /> Bulk Enrolment & User CSV Import (FR-045)
              </CardTitle>
              <CardDescription>
                Preview the CSV format. A connected enrolment service is required to import accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {bulkImportSuccess ? (
                <div className="p-6 text-center space-y-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                  <h4 className="font-bold text-sm text-green-700 dark:text-green-400">Import preview complete</h4>
                  <p className="text-muted-foreground">No accounts were created and no email was sent.</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-muted rounded-lg font-mono text-[11px] space-y-1">
                    <span className="font-bold block text-foreground">Expected CSV Column Header Schema:</span>
                    <div className="text-muted-foreground">fullName, institutionalEmail, role, indexNumber, departmentCode</div>
                  </div>

                  <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2">
                    <span className="font-medium block">CSV upload is unavailable in this preview.</span>
                    <span className="text-[11px] text-muted-foreground">The action below demonstrates the import interface only.</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowBulkModal(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSimulateBulkImport} style={{ backgroundColor: tenant.primaryColor }} className="text-white">
                      Preview import
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add New User Modal (SRS FR-016 - FR-019) */}
      {showAddUserModal && (
        <div className="lms-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full animate-in zoom-in-95">
            <CardHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" /> Create User Account (FR-016)
                </CardTitle>
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)} 
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <CardDescription className="text-xs">
                Add an individual student, lecturer, or administrator account to {tenant.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-xs">
              <form onSubmit={handleCreateUser} className="space-y-3.5">
                {userError && <p role="alert" className="text-red-600">{userError}</p>}
                <div className="space-y-1">
                  <label className="font-semibold block">Full Legal Name</label>
                  <Input
                    required
                    placeholder="e.g. Nipuni Wickramasinghe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Institutional Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. nipuni@tech.cmb.ac.lk"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Role (RBAC FR-019)</label>
                    <select
                      value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as "student" | "lecturer" | "admin")}
                      className="w-full border rounded-lg px-2.5 py-2 bg-background font-medium focus:outline-hidden text-xs"
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer / Instructor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block">Student Index / Staff ID</label>
                    <Input
                      placeholder={newUserRole === "student" ? "e.g. 2023t01899" : "e.g. STAFF/FOT/025"}
                      value={newUserIndex}
                      onChange={(e) => setNewUserIndex(e.target.value)}
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Academic Department</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-2 bg-background font-medium focus:outline-hidden text-xs"
                  >
                    <option value="Dept of ICT (BICT Hons)">Dept of ICT (BICT Hons)</option>
                    <option value="Dept of Biosystems Technology">Dept of Biosystems Technology</option>
                    <option value="Dept of Engineering Technology">Dept of Engineering Technology</option>
                    <option value="Dept of Instrumentation & Automation">Dept of Instrumentation & Automation</option>
                    <option value="Faculty Technology IT Centre">Faculty Technology IT Centre</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg border">
                  <div>
                    <span className="font-semibold block">Require Multi-Factor Authentication (FR-022)</span>
                    <span className="text-[10px] text-muted-foreground">Prompts TOTP authenticator setup on first login</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newUserMfa}
                    onChange={(e) => setNewUserMfa(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddUserModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="text-white"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    Create User Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
