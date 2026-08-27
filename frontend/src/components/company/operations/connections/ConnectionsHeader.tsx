"use client";

import React from "react";
import { Search, Printer, Plus } from "lucide-react";

export function ConnectionsHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onOpenCreate,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onOpenCreate: () => void;
}) {
  const tabs = ["All Connections", "Pending", "Active", "Inactive", "Cancelled"];

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-background pt-4 px-6 pb-0 shrink-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-semibold hover:bg-muted transition-colors shadow-sm bg-card cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Connection
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-2 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const apiTab = tab === "All Connections" ? "All" : tab;
          const isActive = statusFilter === apiTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(apiTab)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-primary text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
