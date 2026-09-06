"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { TroubleTicket } from "@/types/telecom-entities.types";
import { telecomService } from "@/services/telecom.service";
import { TicketFilters } from "./TicketFilters";
import { TicketList } from "./TicketList";
import { TicketDetailPane, FullTroubleTicket, EttrHistoryItem, TransferHistoryItem, TicketNote } from "./TicketDetailPane";
import { GenerateTicketDrawer } from "./GenerateTicketDrawer";
import { useToast } from "@/components/ui/toast";

export function TicketsManagerWorkspace() {
  const toast = useToast();
  const [tickets, setTickets] = useState<FullTroubleTicket[]>([]);

  useEffect(() => {
    telecomService.tickets
      .list()
      .then((rawTickets) => {
        if (!rawTickets) return;
        const BASE_TIME = Date.now();
        const addressList = [
          "House 42, Street 18, Sector F-10/2, Islamabad",
          "Plaza 5, Commercial Zone, Sector F-8 Markaz, Islamabad",
          "House 109, Street 4, Sector E-11/3, Islamabad",
          "Office 201, Sector G-9 Markaz, Islamabad",
        ];
        const coords = [
          { lat: 33.6938, lng: 73.0135 },
          { lat: 33.7077, lng: 73.0366 },
          { lat: 33.6844, lng: 72.9796 },
          { lat: 33.6892, lng: 73.0321 },
        ];

        const mapped: FullTroubleTicket[] = rawTickets.map((t, idx) => {
          const isExpired = t.isSlaBreached;
          const isClosed = t.status === "resolved" || t.status === "closed";
          const isPending = t.status === "open";
          const ettrHistoryList: EttrHistoryItem[] = [
            {
              timestamp: new Date(BASE_TIME - 7200 * 1000).toISOString(),
              changedBy: "System SLA Matrix",
              change: "Initial ETTR calculated from SLA rule",
              reason: "Automatic calculation based on ticket category SLA rule.",
            },
          ];
          const notesList: TicketNote[] = [
            {
              id: `note-${t.id}-1`,
              author: "System Bot (NOC Telemetry)",
              timestamp: t.createdAt || new Date(BASE_TIME - 3600 * 1000).toISOString(),
              content: `Automated fault diagnostics ticket generated. Initial priority: ${t.priority}.`,
            },
          ];
          const transferHistoryList: TransferHistoryItem[] = idx % 3 === 1 ? [
            {
              timestamp: new Date(BASE_TIME - 3600 * 1000).toISOString(),
              transferredBy: "Farhan NOC (Remote Desk)",
              transfer: `Transferred to ${(t.assignedEngineers && t.assignedEngineers[0]) || t.assignedTo || "Usman Ali"}`,
              reason: "Physical OTDR test confirms cable fault requiring field splicer.",
            },
          ] : [];

          return {
            id: t.id,
            ticketNo: t.ticketNo || t.ticketNumber || `TK-${t.id.slice(0, 6)}`,
            customerName: t.customerName || "Valued Subscriber",
            username: t.pppoeUsername || `${(t.customerName || "subscriber").toLowerCase().replace(/[^a-z0-9]/g, "_")}_pppoe`,
            contact: t.customerPhone || "+92 300 1234567",
            type: t.category === "Fiber Break"
              ? "Complaint - Fiber (Red LOS)"
              : t.category === "High Optical Attenuation"
              ? "Complaint - Optical Power Loss"
              : t.category === "Speed Degradation"
              ? "Speed Degradation"
              : t.category === "Router Fault"
              ? "Complaint - Hardware / ONT"
              : "Billing Issue",
            priority: (t.priority === "Critical"
              ? "Urgent"
              : t.priority === "High"
              ? "High"
              : "Normal") as FullTroubleTicket["priority"],
            status: (isExpired
              ? "Expired"
              : isClosed
              ? "Closed"
              : isPending
              ? "Pending"
              : "In Progress") as FullTroubleTicket["status"],
            assignedTo: (t.assignedEngineers && t.assignedEngineers[0]) || t.assignedTo || (idx % 2 === 0 ? "Usman Ali (Lead Splicer)" : "Bilal Hassan (Technician)"),
            createdBy: "Admin (NOC Command)",
            createdAt: t.createdAt || new Date(BASE_TIME - (idx + 1) * 3600000).toISOString(),
            creationRemarks: t.description || "Field work order dispatched for optical investigation.",
            staffDetails: {
              closedBy: isClosed ? ((t.assignedEngineers && t.assignedEngineers[0]) || t.assignedTo || "Usman Ali (Lead Splicer)") : undefined,
              closingDate: isClosed ? new Date(BASE_TIME - 1800000).toISOString() : undefined,
              closingRemarks: isClosed ? "Issue resolved. Optical drop re-spliced, RX power normalized." : undefined,
            },
            ettr: t.slaExpiresAt || new Date(BASE_TIME + (idx + 1) * 3600000).toISOString(),
            ettrHistory: ettrHistoryList,
            transferHistory: transferHistoryList,
            transferredFrom: idx % 3 === 1 ? "Helpdesk Desk 01" : undefined,
            notes: notesList,
            opticalDbm: t.opticalRxDbm || -28.4,
            ontStatus: t.opticalRxDbm && t.opticalRxDbm < -30
              ? "LOS / Offline (No Light)"
              : t.opticalRxDbm && t.opticalRxDbm < -25
              ? "High Attenuation (Degraded)"
              : "Online / Normal Light",
            address: addressList[idx % addressList.length],
            lat: coords[idx % coords.length].lat,
            lng: coords[idx % coords.length].lng,
            vanNo: "Van #04 (OTDR Equipped)",
            slaMinutesLeft: isExpired ? 0 : isClosed ? 0 : 45 + idx * 15,
            description: t.description,
            companyTimezone: (t as any).companyTimezone || "Asia/Karachi",
          };
        });

        setTickets(mapped);
        if (mapped.length > 0) {
          setSelectedTicketId((prev) => prev || mapped[0].id);
        }
      })
      .catch((err) => console.error("Failed to load tickets:", err));
  }, []);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [timeSort, setTimeSort] = useState("Newest");
  const [staffFilter, setStaffFilter] = useState("All");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return tickets
      .filter((t) => {
        // 1. Search Query
        const matchesSearch =
          !q ||
          t.ticketNo.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.contact.includes(q) ||
          t.type.toLowerCase().includes(q);

        // 2. Status Filter
        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Pending" && (t.status === "Pending" || t.status === "open" || t.status === "assigned")) ||
          (statusFilter === "In Progress" && (t.status === "In Progress" || t.status === "in_progress")) ||
          (statusFilter === "Closed" && (t.status === "Closed" || t.status === "closed" || t.status === "resolved")) ||
          (statusFilter === "Expired" && t.status === "Expired");

        // 3. Priority Filter
        const matchesPriority =
          priorityFilter === "All" ||
          (priorityFilter === "Urgent" && (t.priority === "Urgent" || t.priority === "Critical")) ||
          t.priority === priorityFilter;

        // 4. Staff Filter
        const matchesStaff =
          staffFilter === "All" ||
          (staffFilter === "Assigned to Me" && t.assignedTo.includes("Usman")) ||
          t.assignedTo.includes(staffFilter);

        return matchesSearch && matchesStatus && matchesPriority && matchesStaff;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeSort === "Newest" ? timeB - timeA : timeA - timeB;
      });
  }, [tickets, searchQuery, statusFilter, priorityFilter, staffFilter, timeSort]);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  // CRUD Handlers
  const handleCreateTicket = (newTicketData: FullTroubleTicket) => {
    setTickets((prev) => [newTicketData, ...prev]);
    setSelectedTicketId(newTicketData.id);
    toast.success("Ticket Created", `Ticket ${newTicketData.ticketNo} registered and dispatched.`);
  };

  const handleUpdateTicket = (id: string, updates: Partial<FullTroubleTicket>) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (selectedTicketId === id) {
        setSelectedTicketId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background border-0">
      {/* Left Pane: List & Search Filters */}
      <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col border-r border-border bg-card">
        <TicketFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          timeSort={timeSort}
          setTimeSort={setTimeSort}
          staffFilter={staffFilter}
          setStaffFilter={setStaffFilter}
          onOpenGenerate={() => setIsGenerateOpen(true)}
        />
        <TicketList
          tickets={filteredTickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={setSelectedTicketId}
        />
      </div>

      {/* Right Pane: Master Detail View */}
      <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-background">
        <TicketDetailPane
          ticket={selectedTicket}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
      </div>

      {/* Generate Ticket Drawer */}
      <GenerateTicketDrawer
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}
