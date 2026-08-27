"use client";

import React, { useState } from "react";
import { mockDb, NewConnectionLead } from "@/mock/db";
import { LiveChatWorkspace } from "./operations/chat/LiveChatWorkspace";
import {
  TicketsManagerWorkspace,
  TroubleTicketItem,
} from "./operations/tickets/TicketsManagerWorkspace";
import { ConnectionsManagerWorkspace } from "./operations/connections/ConnectionsManagerWorkspace";

export function OperationsDeskView({ initialSubTab = "desk" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  // Global Tickets State
  const [ticketViewMode, setTicketViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedTicket, setSelectedTicket] = useState<TroubleTicketItem | null>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [ticketsList, setTicketsList] = useState<TroubleTicketItem[]>([
    {
      id: "tkt-01",
      ticketNo: "TK-8842",
      customerName: "Ali Hassan",
      phone: "+92 300 8594021",
      address: "House 24, St 12, Sector F-10/2, Islamabad",
      category: "Fiber Drop Cut / Red LOS",
      priority: "Critical",
      status: "in_progress",
      assignedTo: "Usman Ali",
      vanNo: "Van #04",
      opticalDbm: -27.4,
      slaMinutesLeft: 35,
      description: "Optical RX signal lost on Splitter #4. OTDR meter indicates break at 65 meters from pole.",
    },
    {
      id: "tkt-02",
      ticketNo: "TK-8841",
      customerName: "Zainab Bibi",
      phone: "+92 321 9876543",
      address: "Plaza 4, Main Blvd, Gulberg III, Lahore",
      category: "Bandwidth Speed Restriction",
      priority: "Normal",
      status: "open",
      assignedTo: "Bilal Hassan",
      vanNo: "Bike #02",
      opticalDbm: -18.2,
      slaMinutesLeft: 110,
      description: "Subscriber paid bill via 1Link. MikroTik queue rate refresh required to restore 50 Mbps.",
    },
    {
      id: "tkt-03",
      ticketNo: "TK-8840",
      customerName: "Ahmed Malik",
      phone: "+92 300 1234567",
      address: "House 112, St 35, Blue Area, Islamabad",
      category: "High Optical Attenuation",
      priority: "High",
      status: "assigned",
      assignedTo: "Imran Splicer",
      vanNo: "Van #02",
      opticalDbm: -24.8,
      slaMinutesLeft: 75,
      description: "High packet drop on PON-04. Connector cleaning and patch cord replacement required.",
    },
    {
      id: "tkt-04",
      ticketNo: "TK-8839",
      customerName: "Kamran Akmal",
      phone: "+92 333 4567890",
      address: "Block 5, Clifton, Karachi",
      category: "Wi-Fi Router Firmware Fault",
      priority: "Normal",
      status: "resolved",
      assignedTo: "Farhan NOC",
      vanNo: "Van #01",
      opticalDbm: -17.2,
      slaMinutesLeft: 0,
      description: "Dual-band 5GHz SSID broadcasting issue. TR-069 firmware re-flash completed successfully.",
    },
  ]);

  // Global Connections State
  const [connectionsList, setConnectionsList] = useState<NewConnectionLead[]>(mockDb.newConnections);
  const [selectedLead, setSelectedLead] = useState<NewConnectionLead | null>(null);

  return (
    <div className="h-full w-full font-body overflow-hidden">
      {/* 1. LIVE CHAT DESK */}
      {activeTab === "desk" && <LiveChatWorkspace />}

      {/* 2. MANAGE TROUBLE TICKETS */}
      {activeTab === "tickets" && (
        <TicketsManagerWorkspace
          ticketsList={ticketsList}
          setTicketsList={setTicketsList}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          isCreateTicketOpen={isCreateTicketOpen}
          setIsCreateTicketOpen={setIsCreateTicketOpen}
          ticketViewMode={ticketViewMode}
          setTicketViewMode={setTicketViewMode}
        />
      )}

      {/* 3. NEW CONNECTIONS */}
      {activeTab === "connections" && (
        <ConnectionsManagerWorkspace
          connectionsList={connectionsList}
          setConnectionsList={setConnectionsList}
          selectedLead={selectedLead}
          setSelectedLead={setSelectedLead}
        />
      )}
    </div>
  );
}
