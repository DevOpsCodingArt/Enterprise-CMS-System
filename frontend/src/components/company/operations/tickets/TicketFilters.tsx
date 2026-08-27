"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, SortDesc, ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

function CustomDropdown({
  value,
  options,
  onChange,
  icon: Icon,
  minWidth = "120px",
}: {
  value: string;
  options: DropdownOption[];
  onChange: (val: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  minWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div className="relative" ref={containerRef} style={{ minWidth }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-background hover:bg-muted/50 border ${
          isOpen ? "border-primary ring-1 ring-primary/20" : "border-border"
        } rounded-md text-xs font-medium text-foreground transition-all duration-200 shadow-sm cursor-pointer`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[140px] mt-1 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <span className={value === opt.value ? "font-semibold text-primary" : "text-foreground"}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TicketFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  timeSort,
  setTimeSort,
  staffFilter,
  setStaffFilter,
  onOpenGenerate,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  timeSort: string;
  setTimeSort: (t: string) => void;
  staffFilter: string;
  setStaffFilter: (s: string) => void;
  onOpenGenerate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 border-b border-border bg-card">
      <div className="flex items-center justify-between">
        <h2 className="font-sans font-bold text-lg tracking-tight text-foreground">
          Tickets
        </h2>
        <button
          type="button"
          onClick={onOpenGenerate}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          Generate Ticket
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tickets, customers, mobiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Custom Dropdown Filters Row */}
      <div className="flex flex-wrap gap-2 items-center">
        <CustomDropdown
          icon={Filter}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "All Status", value: "All" },
            { label: "Pending", value: "Pending" },
            { label: "In Progress", value: "In Progress" },
            { label: "Closed", value: "Closed" },
            { label: "Expired", value: "Expired" },
          ]}
        />

        <CustomDropdown
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={[
            { label: "All Priority", value: "All" },
            { label: "Urgent", value: "Urgent" },
            { label: "High", value: "High" },
            { label: "Normal", value: "Normal" },
          ]}
        />

        <CustomDropdown
          value={staffFilter}
          onChange={setStaffFilter}
          options={[
            { label: "All Staff", value: "All" },
            { label: "Assigned to Me", value: "Assigned to Me" },
            { label: "Usman Ali", value: "Usman Ali" },
            { label: "Bilal Hassan", value: "Bilal Hassan" },
          ]}
        />

        <CustomDropdown
          icon={SortDesc}
          value={timeSort}
          onChange={setTimeSort}
          options={[
            { label: "Newest First", value: "Newest" },
            { label: "Oldest First", value: "Oldest" },
          ]}
        />
      </div>
    </div>
  );
}
