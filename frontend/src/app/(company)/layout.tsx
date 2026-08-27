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
    <div className="flex h-screen max-h-screen overflow-hidden bg-background text-foreground font-body">
      {/* 1. Collapsible Operations Sidebar */}
      <SidebarNav
        activeTab={activeCompanyTab || "desk"}
        onTabChange={setActiveCompanyTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Workspace Body */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 h-full">
        <Topbar onOpenNotificationCenter={() => setActiveCompanyTab("audit")} />

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
