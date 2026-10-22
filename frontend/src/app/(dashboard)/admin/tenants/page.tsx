"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Activity
} from "lucide-react";
import { useTenant, PRESET_TENANTS, TenantInfo } from "@/lib/tenant-context";

export default function TenantsManagementPage() {
  const { tenant, setTenant, allTenants } = useTenant();

  const [tenantsList, setTenantsList] = useState([
    {
      ...PRESET_TENANTS.uoc_fot,
      status: "Active",
      studentsCount: 1420,
      coursesCount: 112,
      storageUsed: "4.2 TB / 10 TB",
      createdDate: "2025-01-10"
    },
    {
      ...PRESET_TENANTS.uom_fit,
      status: "Active",
      studentsCount: 1150,
      coursesCount: 94,
      storageUsed: "3.1 TB / 10 TB",
      createdDate: "2025-03-20"
    },
    {
      ...PRESET_TENANTS.sliit_comp,
      status: "Active",
      studentsCount: 2850,
      coursesCount: 180,
      storageUsed: "7.8 TB / 15 TB",
      createdDate: "2025-06-15"
    }
  ]);

  const [showAddTenant, setShowAddTenant] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");

  const handleCreateTenant = () => {
    if (!newTenantName || !newSubdomain) return;
    const newId = newSubdomain.split(".")[0] || "tenant-new";
    const newT = {
      id: newId,
      name: newTenantName,
      shortName: newTenantName.split(" ")[0] || "NEW",
      subdomain: newSubdomain,
      tagline: "Academic Center of Excellence",
      primaryColor: "#0f766e",
      secondaryColor: "#14b8a6",
      accentColor: "#f59e0b",
      logoText: "ACAD LMS",
      crestIcon: "🏛️",
      facultyName: "Faculty of Applied Sciences",
      footerText: `© 2026 ${newTenantName}. All Rights Reserved.`,
      status: "Active",
      studentsCount: 0,
      coursesCount: 0,
      storageUsed: "0 GB / 5 TB",
      createdDate: new Date().toISOString().split("T")[0]
    };
    setTenantsList(prev => [...prev, newT]);
    setShowAddTenant(false);
    setNewTenantName("");
    setNewSubdomain("");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Multi-Tenant Platform Governance (SRS §6.1, §8, FR-001 - FR-006)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Institutional Tenants & White-Label Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Global management of client universities, dedicated storage quotas, domain routing, and tenant isolation state.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddTenant(!showAddTenant)}
          className="text-xs gap-2 text-white"
          style={{ backgroundColor: tenant.primaryColor }}
        >
          <Plus size={15} /> Provision New Institution (FR-001)
        </Button>
      </div>

      {/* Add Tenant Modal/Form */}
      {showAddTenant && (
        <Card className="border-2 border-primary/20 bg-primary/5 p-4 space-y-3 animate-in slide-in-from-top-2">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-bold">Onboard New University / Training Institution (SRS §26.1)</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-medium block mb-1">Institution Legal Name</label>
              <Input
                placeholder="e.g. Rajarata University of Sri Lanka"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="font-medium block mb-1">Assigned Domain / Subdomain (FR-005)</label>
              <Input
                placeholder="e.g. lms.rjt.ac.lk"
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAddTenant(false)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleCreateTenant} className="text-xs">Provision Tenant Instance</Button>
          </div>
        </Card>
      )}

      {/* Tenants Grid */}
      <div className="grid gap-4">
        {tenantsList.map((t) => {
          const isCurrentActive = t.id === tenant.id;
          return (
            <Card key={t.id} className={`border transition-all ${isCurrentActive ? "border-primary shadow-md" : "hover:border-primary/40"}`}>
              <CardContent className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{t.crestIcon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{t.name}</h3>
                        {isCurrentActive && (
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                            ACTIVE CONTEXT
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <ExternalLink size={12} /> https://{t.subdomain}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono text-muted-foreground">
                    <div>
                      <span>Enrolled Students:</span>
                      <strong className="block text-foreground">{t.studentsCount}</strong>
                    </div>
                    <div>
                      <span>Active Modules:</span>
                      <strong className="block text-foreground">{t.coursesCount}</strong>
                    </div>
                    <div>
                      <span>Storage Quota:</span>
                      <strong className="block text-foreground">{t.storageUsed}</strong>
                    </div>
                    <div>
                      <span>Lifecycle State:</span>
                      <strong className="block text-green-600">{t.status}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isCurrentActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      const found = allTenants.find(item => item.id === t.id);
                      if (found) setTenant(found);
                    }}
                    className="text-xs font-semibold"
                  >
                    {isCurrentActive ? "Current Workspace" : "Switch Context"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
