"use client";

import React from "react";

export function ProfileTabsNavigation({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-6 py-2 overflow-x-auto custom-scrollbar shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? "bg-card text-foreground font-bold shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
