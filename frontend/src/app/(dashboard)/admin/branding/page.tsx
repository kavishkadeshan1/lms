"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Eye, 
  Upload, 
  Check, 
  RotateCcw, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Laptop,
  Smartphone
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

export default function BrandingStudioPage() {
  const { tenant, setTenant } = useTenant();

  // Local draft state for live preview (SRS FR-013)
  const [draftName, setDraftName] = useState(tenant.name);
  const [draftShortName, setDraftShortName] = useState(tenant.shortName);
  const [draftSubdomain, setDraftSubdomain] = useState(tenant.subdomain);
  const [draftPrimaryColor, setDraftPrimaryColor] = useState(tenant.primaryColor);
  const [draftAccentColor, setDraftAccentColor] = useState(tenant.accentColor);
  const [draftTagline, setDraftTagline] = useState(tenant.tagline);
  const [draftFooterText, setDraftFooterText] = useState(tenant.footerText);
  const [draftCrestIcon, setDraftCrestIcon] = useState(tenant.crestIcon);
  const [draftAiEnabled, setDraftAiEnabled] = useState(tenant.aiEnabled !== false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePublish = () => {
    setTenant({
      ...tenant,
      name: draftName,
      shortName: draftShortName,
      subdomain: draftSubdomain,
      primaryColor: draftPrimaryColor,
      accentColor: draftAccentColor,
      tagline: draftTagline,
      footerText: draftFooterText,
      crestIcon: draftCrestIcon,
      aiEnabled: draftAiEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const presetPalettes = [
    { name: "University of Colombo Maroon", primary: "#800020", accent: "#f59e0b" },
    { name: "Moratuwa Crimson & Gold", primary: "#7f1d1d", accent: "#eab308" },
    { name: "SLIIT Tech Blue & Orange", primary: "#1e40af", accent: "#f97316" },
    { name: "Emerald Academic Green", primary: "#047857", accent: "#10b981" },
    { name: "Imperial Royal Purple", primary: "#581c87", accent: "#a855f7" }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary uppercase">
            Tenant Customization Engine (SRS §6.2, §8)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            White-Label Branding Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure institutional themes, crests, login screens, colors, and footers without modifying source code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={16} /> Theme Published Live!
            </span>
          )}
          <Button 
            onClick={handlePublish}
            className="text-xs font-semibold gap-2 shadow-sm text-white"
            style={{ backgroundColor: draftPrimaryColor }}
          >
            <Check size={16} /> Publish Changes Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 size={16} /> Institution Identity (FR-007, FR-008)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="inst-name">Institution Full Name</Label>
                <Input
                  id="inst-name"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="short-name">Display Short Name</Label>
                  <Input
                    id="short-name"
                    value={draftShortName}
                    onChange={(e) => setDraftShortName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="crest-icon">Crest Emoji / Icon</Label>
                  <Input
                    id="crest-icon"
                    value={draftCrestIcon}
                    onChange={(e) => setDraftCrestIcon(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subdomain">Custom Domain / Subdomain (FR-005)</Label>
                <div className="flex rounded-md shadow-xs">
                  <Input
                    id="subdomain"
                    value={draftSubdomain}
                    onChange={(e) => setDraftSubdomain(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tagline">Institution Tagline / Motto</Label>
                <Input
                  id="tagline"
                  value={draftTagline}
                  onChange={(e) => setDraftTagline(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors (FR-010) */}
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette size={16} /> Institutional Color Palette (FR-010)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <Label className="block mb-2">Preset Sri Lankan University Themes</Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {presetPalettes.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDraftPrimaryColor(p.primary);
                        setDraftAccentColor(p.accent);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/30 text-left transition-colors"
                    >
                      <span className="font-medium text-[11px]">{p.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full border shadow-xs" style={{ backgroundColor: p.primary }} />
                        <span className="w-4 h-4 rounded-full border shadow-xs" style={{ backgroundColor: p.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1.5">
                  <Label>Primary Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftPrimaryColor}
                      onChange={(e) => setDraftPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer p-0.5"
                    />
                    <Input
                      value={draftPrimaryColor}
                      onChange={(e) => setDraftPrimaryColor(e.target.value)}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Accent Highlight Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftAccentColor}
                      onChange={(e) => setDraftAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer p-0.5"
                    />
                    <Input
                      value={draftAccentColor}
                      onChange={(e) => setDraftAccentColor(e.target.value)}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer & Policies (FR-012) */}
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold">Footer & Legal Notices (FR-012)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="footer">Copyright & Footer Text</Label>
                <textarea
                  id="footer"
                  rows={2}
                  value={draftFooterText}
                  onChange={(e) => setDraftFooterText(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Student Chatbot Switch (SRS FR-131) */}
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> AI Student Chatbot Policy (FR-131)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-[#212529]">Enable AI Student Chatbot</span>
                  <span className="text-[11px] text-muted-foreground">Allows students to query authorized course resources & exam bylaws</span>
                </div>
                <input
                  type="checkbox"
                  checked={draftAiEnabled}
                  onChange={(e) => setDraftAiEnabled(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#0f6cbf]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Interactive Preview (FR-013) (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-primary" />
              <span className="text-sm font-bold">Live Portal Preview (FR-013)</span>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">Real-Time Responsive</span>
            </div>

            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPreviewDevice("desktop")}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <Laptop size={13} /> Desktop
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPreviewDevice("mobile")}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <Smartphone size={13} /> Mobile
              </Button>
            </div>
          </div>

          {/* Preview Container Mockup */}
          <div className={`border-4 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 mx-auto bg-background ${
            previewDevice === "mobile" ? "max-w-[360px]" : "w-full"
          }`}>
            {/* Mock Browser Header */}
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              </div>
              <span className="text-[11px] truncate max-w-[200px]">https://{draftSubdomain}</span>
              <span>🔒 TLS 1.3</span>
            </div>

            {/* Mock Page Content using Draft Colors */}
            <div className="p-4 space-y-4 min-h-[460px]">
              {/* Institution Navbar */}
              <div 
                className="p-3 rounded-xl text-white flex items-center justify-between shadow-md"
                style={{ backgroundColor: draftPrimaryColor }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{draftCrestIcon}</span>
                  <div>
                    <div className="font-extrabold text-xs tracking-tight">{draftShortName}</div>
                    <div className="text-[10px] text-white/80">{draftTagline}</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  KS
                </div>
              </div>

              {/* Student Welcome Banner */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  {draftName} • Student Portal
                </span>
                <h3 className="font-bold text-sm text-foreground">Welcome back, Kavishka Sandaruwan</h3>
                <p className="text-[11px] text-muted-foreground">Level 3 Semester 1 • Faculty of Technology</p>
              </div>

              {/* Course Card Preview */}
              <div className="border rounded-xl p-3.5 space-y-2 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: draftPrimaryColor }}
                  >
                    ICT 3101
                  </span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: draftAccentColor }}
                  >
                    Active
                  </span>
                </div>
                <h4 className="font-bold text-xs">Distributed Systems & Cloud Computing</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: "75%", backgroundColor: draftPrimaryColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Mock AI Widget */}
              <div className="p-3 bg-muted/40 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles size={14} style={{ color: draftAccentColor }} />
                  <span className="font-medium text-[11px]">AI Assistant Grounded on {draftShortName}</span>
                </div>
                <span className="text-[10px] font-mono text-green-600 font-bold">Ready</span>
              </div>

              {/* Mock Footer */}
              <div className="pt-4 border-t text-[10px] text-muted-foreground text-center">
                {draftFooterText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
