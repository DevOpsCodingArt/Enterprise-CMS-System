"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveChatWorkspace } from "./operations/chat/LiveChatWorkspace";
import { TicketsManagerWorkspace } from "./operations/tickets/TicketsManagerWorkspace";
import { ConnectionsManagerWorkspace } from "./operations/connections/ConnectionsManagerWorkspace";
import { tabContentVariants } from "@/lib/motion";

export function OperationsDeskView({ initialSubTab = "desk" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 1. LIVE CHAT DESK */}
        {activeTab === "desk" && (
          <motion.div
            key="desk"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <LiveChatWorkspace />
          </motion.div>
        )}

        {/* 2. MANAGE TROUBLE TICKETS */}
        {activeTab === "tickets" && (
          <motion.div
            key="tickets"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <TicketsManagerWorkspace />
          </motion.div>
        )}

        {/* 3. NEW CONNECTIONS */}
        {activeTab === "connections" && (
          <motion.div
            key="connections"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <ConnectionsManagerWorkspace />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

