"use client";

import React, { useState, useMemo } from "react";
import { mockDb, TroubleTicket } from "@/mock/db";
import { TicketFilters } from "./TicketFilters";
import { TicketList } from "./TicketList";
import { TicketDetailPane, FullTroubleTicket, EttrHistoryItem, TransferHistoryItem, TicketNote } from "./TicketDetailPane";
import { GenerateTicketDrawer } from "./GenerateTicketDrawer";
import { useToast } from "@/components/ui/toast";

export function TicketsManagerWorkspace() {
  const toast = useToast();

  // Initial rich seed from mockDb mapped to FullTroubleTicket
  const [tickets, setTickets] = useState<FullTroubleTicket[]>(() =>
    mockDb.tickets.map((t: TroubleTicket, idx: number) => {
      const isClosed = t.status === "Resolved" || t.status === "Closed";
      const isExpired = t.status === "Expired";
      const isPending = t.status === "Open" || t.status === "Assigned";

      const addressList = [
        "House 24, Street 12, Sector F-10/2, Islamabad",
        "House 105, St 4, Sector F-7/1, Islamabad",
        "Flat 4B, Silver Heights, Sector E-11/2, Islamabad",
        "House 18, St 2, Sector F-8/4, Islamabad",
        "House 77, St 19, Sector G-9/3, Islamabad",
        "House 12, St 5, Sector G-11/1, Islamabad",
        "House 43, St 8, Sector F-11/3, Islamabad",
        "House 90, St 14, Sector F-10/4, Islamabad",
        "House 6, St 1, Sector F-6/2, Islamabad",
        "Plaza 5, Mini Commercial, Sector F-10/2, Islamabad",
      ];

      const coords = [
        { lat: 33.6844, lng: 73.0479 },
        { lat: 33.7182, lng: 73.0605 },
        { lat: 33.6938, lng: 73.0163 },
        { lat: 33.7001, lng: 73.0381 },
        { lat: 33.6685, lng: 73.0754 },
        { lat: 33.6702, lng: 72.9984 },
        { lat: 33.7123, lng: 73.0256 },
        { lat: 33.6811, lng: 73.0543 },
        { lat: 33.7290, lng: 73.0812 },
        { lat: 33.6890, lng: 73.0410 },
      ];

      const notesList: TicketNote[] = [
        {
          id: `note-${idx}-1`,
          timestamp: new Date(Date.now() - (idx + 1) * 1800 * 1000).toISOString(),
          author: "System Telemetry (SmartOLT)",
          content: t.opticalRxDbm && t.opticalRxDbm < -30
            ? `OLT GPON port alarm: Optical LOS red fault on ${t.customerName}'s drop.`
            : `Optical status reported: ${t.opticalRxDbm || -19.5} dBm on GPON 0/1/4.`,
        },
        {
          id: `note-${idx}-2`,
          timestamp: new Date(Date.now() - (idx + 1) * 900 * 1000).toISOString(),
          author: "NOC Dispatcher",
          content: isClosed
            ? "Subscriber confirmed link restored and online with full speed."
            : `Work order dispatched to ${t.assignedEngineers[0] || "Field Splicer"}.`,
        },
      ];

      const ettrHistoryList: EttrHistoryItem[] = [
        {
          timestamp: new Date(Date.now() - (idx + 2) * 1800 * 1000).toISOString(),
          changedBy: "NOC Dispatcher",
          change: `Target resolution calibrated to ${t.ettrHours || 2} Hours`,
          reason: "Standard SLA schedule for FTTH operations.",
        },
      ];

      const transferHistoryList: TransferHistoryItem[] = idx % 3 === 1 ? [
        {
          timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
          transferredBy: "Farhan NOC (Remote Desk)",
          transfer: `Transferred to ${t.assignedEngineers[0] || "Usman Ali"}`,
          reason: "Physical OTDR test confirms cable fault requiring field splicer.",
        },
      ] : [];

      return {
        id: t.id,
        ticketNo: t.ticketNo,
        customerName: t.customerName,
        username: t.pppoeUsername || `${t.customerName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_pppoe`,
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
        assignedTo: t.assignedEngineers[0] || (idx % 2 === 0 ? "Usman Ali (Lead Splicer)" : "Bilal Hassan (Technician)"),
        createdBy: "Admin (NOC Command)",
        createdAt: t.createdAt || new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
        creationRemarks: t.description || "Field work order dispatched for optical investigation.",
        staffDetails: {
          closedBy: isClosed ? (t.assignedEngineers[0] || "Usman Ali (Lead Splicer)") : undefined,
          closingDate: isClosed ? new Date(Date.now() - 1800000).toISOString() : undefined,
          closingRemarks: isClosed ? "Issue resolved. Optical drop re-spliced, RX power normalized." : undefined,
        },
        ettr: t.slaExpiresAt || new Date(Date.now() + (idx + 1) * 3600000).toISOString(),
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
      };
    })
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets[0]?.id || null
  );
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
