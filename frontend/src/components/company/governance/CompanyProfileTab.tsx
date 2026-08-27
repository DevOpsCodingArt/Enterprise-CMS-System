"use client";

import React, { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDb } from "@/mock/db";

export function CompanyProfileTab() {
  const [companyProfile] = useState(mockDb.companyProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSaveProfile} className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Corporate Identity, Regulatory Tax & Third-Party API Integrations
          </h2>
          <p className="text-xs text-muted-foreground">
            Company NTN/STRN tax numbers, PTA ISP license, official support contacts, and API secret keys.
          </p>
        </div>
        <Button type="submit" size="sm">
          <Save className="h-3.5 w-3.5 mr-1" /> Save Profile Settings
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-4">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Company profile and API settings updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Legal Info */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2">
              Legal & Regulatory Information
            </h3>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">Company Legal Registered Name</label>
              <input
                type="text"
                defaultValue={companyProfile.legalName}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">NTN Tax #</label>
                <input
                  type="text"
                  defaultValue={companyProfile.ntnNumber}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">STRN / Sales Tax #</label>
                <input
                  type="text"
                  defaultValue={companyProfile.strnNumber}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">PTA ISP Operator License Number</label>
              <input
                type="text"
                defaultValue={companyProfile.ptaLicenseNumber}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-muted-foreground mb-1">Head Office Address</label>
              <input
                type="text"
                defaultValue={companyProfile.headOfficeAddress}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
              />
            </div>
          </div>

          {/* API Integrations */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs font-mono">
            <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2 font-sans">
              Core OSS/BSS API Integrations
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">SmartOLT GPON API:</span>
                <span className="text-emerald-600 font-bold">✓ {companyProfile.apiIntegrations.smartOltStatus}</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.smartOltUrl}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">MikroTik Radius Server:</span>
                <span className="text-emerald-600 font-bold">✓ {companyProfile.apiIntegrations.mikrotikStatus}</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.mikrotikRadiusIp}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">WhatsApp Cloud API:</span>
                <span className="text-emerald-600 font-bold">✓ Connected</span>
              </div>
              <input
                type="text"
                defaultValue={companyProfile.apiIntegrations.whatsAppCloudApi}
                className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
