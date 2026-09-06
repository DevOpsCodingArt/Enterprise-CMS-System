"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Globe, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { SUPPORTED_TIMEZONES, formatTenantDateTime, getTimezoneAbbreviation } from "@/lib/timezone";
import { apiClient } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export function CompanyProfileTab() {
  const toast = useToast();
  const company = useAuthStore((s) => s.company);
  const updateCompanyTimezone = useAuthStore((s) => s.updateCompanyTimezone);

  const [companyProfile, setCompanyProfile] = useState({
    companyName: company?.name || "Prime Networks (Pvt) Ltd",
    legalName: "Prime Networks Pakistan (Pvt) Ltd",
    brandColor: (company as any)?.brandColor || "#0284c7",
    supportEmail: (company as any)?.supportEmail || "support@primenetworks.pk",
    supportPhone: (company as any)?.phone || "+92 51 2800100",
    timezone: (company as any)?.timezone || "Asia/Karachi",
    ntnNumber: "7489201-4",
    strnNumber: "32-00-7849-201-19",
    ptaLicenseNumber: "PTA-ISP-CVAS-2024-0089",
    registeredAddress: "Plot 12, Executive Heights, Blue Area, Sector F-10/2, Islamabad, Pakistan",
    headOfficeAddress: "Plot 12, Executive Heights, Blue Area, Sector F-10/2, Islamabad, Pakistan",
    apiIntegrations: {
      smartOltStatus: "Connected (Latency: 12ms)",
      smartOltUrl: "https://primenetworks.smartolt.com/api/v1",
      mikrotikStatus: "Online (14,280 Sessions)",
      mikrotikRadiusIp: "10.240.10.1:1812",
      whatsAppCloudApi: "+92 300 8594021",
    },
  });
  const [selectedTimezone, setSelectedTimezone] = useState(company?.timezone || "Asia/Karachi");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentClock, setCurrentClock] = useState<string>("");

  // Keep live preview clock ticking in the selected timezone
  useEffect(() => {
    const updateClock = () => {
      setCurrentClock(formatTenantDateTime(new Date(), selectedTimezone));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [selectedTimezone]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiClient.patch("/tenant/profile", {
        name: companyProfile.companyName,
        phone: companyProfile.supportPhone,
        supportEmail: companyProfile.supportEmail,
        timezone: selectedTimezone,
      });

      updateCompanyTimezone(selectedTimezone);
      setSavedSuccess(true);
      toast.success(
        "Company Profile Saved",
        `Timezone updated to ${selectedTimezone} (${getTimezoneAbbreviation(selectedTimezone)}).`
      );
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save company profile:", err);
      toast.error("Save Failed", "Could not save profile changes to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentTzMeta = SUPPORTED_TIMEZONES.find((t) => t.value === selectedTimezone) || SUPPORTED_TIMEZONES[0];

  return (
    <form onSubmit={handleSaveProfile} className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Corporate Identity, Operational Timezone & API Integrations
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure ISP timezone, company NTN/STRN tax numbers, PTA ISP license, and OSS/BSS API keys.
          </p>
        </div>
        <Button type="submit" size="sm" disabled={isSaving}>
          <Save className="h-3.5 w-3.5 mr-1" /> {isSaving ? "Saving..." : "Save Profile Settings"}
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-4">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Company profile and operational timezone updated successfully!
          </div>
        )}

        {/* 1. REGIONAL OPERATIONS & TIMEZONE CARD */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-ambient">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-bold text-sm text-foreground">
                Regional Operations & Tenant Timezone
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              <Clock className="h-3 w-3" />
              {currentTzMeta.abbr} ({currentTzMeta.offset})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-timezone-select" className="block font-bold text-xs text-foreground mb-1">
                Operational Timezone (Company Scope)
              </label>
              <select
                id="company-timezone-select"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full bg-card-subtle/60 rounded-xl p-2.5 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-card text-foreground">
                    {tz.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                Determines ticket SLA targets, real-time ETTR countdowns, billing invoice dates, and technician schedules for this ISP company regardless of server location.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-card-subtle/40 border border-border flex flex-col justify-between">
              <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider">
                Live ISP Local Clock Preview
              </span>
              <div className="my-1.5">
                <span className="text-base font-mono font-extrabold text-foreground tracking-tight">
                  {currentClock || "Loading clock..."}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>All timestamps stored in UTC in PostgreSQL and rendered locally.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Legal Info */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-ambient">
            <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2">
              Legal & Regulatory Information
            </h3>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">Company Legal Registered Name</label>
              <input
                type="text"
                defaultValue={companyProfile.legalName}
                onChange={(e) => setCompanyProfile({ ...companyProfile, legalName: e.target.value })}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">NTN Tax #</label>
                <input
                  type="text"
                  defaultValue={companyProfile.ntnNumber}
                  className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">STRN / Sales Tax #</label>
                <input
                  type="text"
                  defaultValue={companyProfile.strnNumber}
                  className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">PTA ISP Operator License Number</label>
              <input
                type="text"
                defaultValue={companyProfile.ptaLicenseNumber}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">Head Office Address</label>
              <input
                type="text"
                defaultValue={companyProfile.headOfficeAddress}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground"
              />
            </div>
          </div>

          {/* API Integrations */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-ambient font-mono">
            <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2 font-sans">
              Core OSS/BSS API Integrations
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">SmartOLT GPON API:</span>
                <span className="text-success font-bold">✓ {companyProfile.apiIntegrations.smartOltStatus}</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.smartOltUrl}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">MikroTik Radius Server:</span>
                <span className="text-success font-bold">✓ {companyProfile.apiIntegrations.mikrotikStatus}</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.mikrotikRadiusIp}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">WhatsApp Cloud API:</span>
                <span className="text-success font-bold">✓ Connected</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.whatsAppCloudApi}
                className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

