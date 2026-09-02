"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function PlatformSettingsView() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          Global Platform Settings & Feature Flags
        </h2>
        <p className="text-xs text-muted-foreground">
          Multi-tenant cloud configurations, backup schedules, and global maintenance toggles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
