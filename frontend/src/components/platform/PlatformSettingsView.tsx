"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Globe, Clock, CheckCircle2 } from "lucide-react";
import { SUPPORTED_TIMEZONES, formatTenantDateTime } from "@/lib/timezone";

export function PlatformSettingsView() {
  const toast = useToast();
  const [defaultPlatformTz, setDefaultPlatformTz] = useState("Asia/Karachi");
  const [savedTz, setSavedTz] = useState(false);

  const handleSavePlatformTz = () => {
    setSavedTz(true);
    toast.success(
      "Platform Default Timezone Saved",
      `Newly provisioned tenants will default to ${defaultPlatformTz}.`
    );
    setTimeout(() => setSavedTz(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          Global Platform Settings & Feature Flags
        </h2>
        <p className="text-xs text-muted-foreground">
          Multi-tenant cloud configurations, regional timezone defaults, backup schedules, and global maintenance toggles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Global Timezone & Localization Policy Card */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-heading font-bold">
                Global Tenant Timezone & Localization Policy
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Platform-wide default timezone for new ISP tenant provisioning and billing cron alignment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Default Tenant Timezone
              </label>
              <select
                value={defaultPlatformTz}
                onChange={(e) => setDefaultPlatformTz(e.target.value)}
                className="w-full bg-card-subtle/60 rounded-lg p-2.5 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-card text-foreground">
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-lg bg-card-subtle/30 border border-border text-[11px] font-mono flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Current Time in Selection:
              </span>
              <span className="font-bold text-foreground">
                {formatTenantDateTime(new Date(), defaultPlatformTz)}
              </span>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePlatformTz}
                className="text-xs gap-1.5"
              >
                {savedTz && <CheckCircle2 className="h-3.5 w-3.5" />}
                <span>Save Platform Timezone Policy</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Platform Maintenance Mode */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <CardTitle className="text-sm font-heading font-bold">
              Platform Maintenance Mode
            </CardTitle>
            <CardDescription className="text-xs">
              When enabled, non-superadmin users see a temporary maintenance splash screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card-subtle/40">
              <div>
                <span className="font-bold text-xs text-foreground block">
                  Production Maintenance Mode
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Status: Inactive (All 8 Tenants Online)
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  toast.info("Maintenance Mode", "Maintenance mode toggle requires 2FA confirmation.")
                }
                className="text-xs cursor-pointer"
              >
                Enable Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Global Automated Backups */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <CardTitle className="text-sm font-heading font-bold">
              Global Automated Backups
            </CardTitle>
            <CardDescription className="text-xs">
              Multi-tenant PostgreSQL snapshot & S3 cold archive.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card-subtle/40">
              <div>
                <span className="font-bold text-xs text-foreground block">
                  Daily Automated Snapshot
                </span>
                <span className="text-[11px] text-success font-mono">
                  Last successful backup: Today at 04:00 AM (48.2 GB)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success("Backup Triggered", "On-demand snapshot scheduled on DB-SHARD-01.")
                }
                className="text-xs cursor-pointer"
              >
                Trigger Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

