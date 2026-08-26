"use client";

import React, { useState } from "react";
import { SidebarNav } from "@/components/layouts/SidebarNav";
import { Topbar } from "@/components/layouts/Topbar";

export default function CompanyOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* 1. Collapsible Operations Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Workspace Body */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
