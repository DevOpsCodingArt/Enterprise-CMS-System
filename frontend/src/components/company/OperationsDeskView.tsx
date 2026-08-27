"use client";

import React from "react";
import { LiveChatWorkspace } from "./operations/chat/LiveChatWorkspace";
import { TicketsManagerWorkspace } from "./operations/tickets/TicketsManagerWorkspace";
import { ConnectionsManagerWorkspace } from "./operations/connections/ConnectionsManagerWorkspace";

export function OperationsDeskView({ initialSubTab = "desk" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body overflow-hidden">
      {/* 1. LIVE CHAT DESK */}
      {activeTab === "desk" && <LiveChatWorkspace />}

      {/* 2. MANAGE TROUBLE TICKETS */}
      {activeTab === "tickets" && <TicketsManagerWorkspace />}

      {/* 3. NEW CONNECTIONS */}
      {activeTab === "connections" && <ConnectionsManagerWorkspace />}
    </div>
  );
}
