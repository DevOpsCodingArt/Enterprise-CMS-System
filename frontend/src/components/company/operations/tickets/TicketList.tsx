"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { FullTroubleTicket } from "./TicketDetailPane";
import { RichEmptyState } from "@/components/ui/shared/RichEmptyState";
import { EttrLiveCountdown } from "./EttrLiveCountdown";
import { useAuthStore } from "@/stores/useAuthStore";
import { DEFAULT_TENANT_TIMEZONE } from "@/lib/timezone";

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: {
  tickets: FullTroubleTicket[];
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}) {
  const currentCompanyTz = useAuthStore((s) => s.company?.timezone) || DEFAULT_TENANT_TIMEZONE;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critical":
      case "Urgent":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "High":
        return "bg-warning/10 text-warning border-warning/20";
      case "Normal":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <RichEmptyState
          icon={Ticket}
          title="No Tickets Found"
          description="There are no active trouble tickets matching your filter criteria."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-border custom-scrollbar bg-card">
      {tickets.map((t) => {
        const isSelected = t.id === selectedTicketId;
        const isClosed = t.status === "Closed" || t.status === "closed" || t.status === "resolved";

        return (
          <div
            key={t.id}
            onClick={() => onSelectTicket(t.id)}
            className={`p-4 cursor-pointer transition-colors flex flex-col gap-2 ${
              isSelected
                ? "bg-muted/50 border-l-2 border-l-primary"
                : "hover:bg-muted/30 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="truncate">
                <h3
                  className={`font-sans font-semibold text-sm truncate ${
                    isSelected ? "text-foreground" : "text-foreground/90"
                  }`}
                >
                  {t.customerName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {t.ticketNo || t.id}
                  </span>
                  <span className="text-muted-foreground text-[10px]">•</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {t.type ? t.type.split(" - ")[0] : "Complaint"}
                  </span>
                </div>
              </div>
              <div
                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getPriorityStyle(
                  t.priority
                )}`}
              >
                {t.priority.toUpperCase()}
              </div>
            </div>

            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isClosed
                      ? "bg-success"
                      : t.status === "Expired"
                      ? "bg-destructive"
                      : t.status === "In Progress" || t.status === "in_progress"
                      ? "bg-primary"
                      : "bg-warning"
                  }`}
                />
                <span className="text-xs font-medium text-foreground/80 font-mono">
                  {t.status.replace("_", " ")}
                </span>
              </div>

              <EttrLiveCountdown
                compact
                ettrUtc={t.ettr}
                companyTimezone={t.companyTimezone || currentCompanyTz}
                isResolved={isClosed}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
