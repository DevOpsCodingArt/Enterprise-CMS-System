"use client";

import React, { useState } from "react";
import { PlatformSidebar, PlatformTab } from "@/components/platform/PlatformSidebar";
import { PlatformTopbar } from "@/components/platform/PlatformTopbar";
import { PlatformOverviewView } from "@/components/platform/PlatformOverviewView";
import { PlatformTenantsView } from "@/components/platform/PlatformTenantsView";
import { PlatformBillingView } from "@/components/platform/PlatformBillingView";
import { PlatformInfrastructureView } from "@/components/platform/PlatformInfrastructureView";
import { PlatformAuditView } from "@/components/platform/PlatformAuditView";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function PlatformDashboardPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<PlatformTab>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* 1. Dedicated SaaS Platform Sidebar */}
      <PlatformSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Platform Control Plane Body */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <PlatformTopbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeTab === "overview" && (
            <PlatformOverviewView
              onNavigateTab={(t) => setActiveTab(t as PlatformTab)}
            />
          )}

          {activeTab === "tenants" && <PlatformTenantsView />}

          {activeTab === "billing" && <PlatformBillingView />}

          {(activeTab === "infrastructure" || activeTab === "telemetry") && (
            <PlatformInfrastructureView />
          )}

          {activeTab === "audit" && <PlatformAuditView />}

          {activeTab === "settings" && (
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
                        className="text-xs"
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
                        className="text-xs"
                      >
                        Trigger Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
