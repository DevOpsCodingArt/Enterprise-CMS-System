"use client";

import React, { useState } from "react";
import { SidebarNav } from "@/components/layouts/SidebarNav";
import { Topbar } from "@/components/layouts/Topbar";
import { useTenantStore } from "@/stores/useTenantStore";

export default function CompanyOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeCompanyTab, setActiveCompanyTab } = useTenantStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* 1. Collapsible Operations Sidebar */}
      <SidebarNav
        activeTab={activeCompanyTab}
        onTabChange={setActiveCompanyTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Workspace Body */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onOpenNotificationCenter={() => setActiveCompanyTab("audit")} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
