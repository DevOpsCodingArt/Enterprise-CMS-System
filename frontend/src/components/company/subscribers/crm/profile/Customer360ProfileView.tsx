"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

// Modular Sub-Components & Tabs
import { ProfileHeader } from "./ProfileHeader";
import { ProfileMetricsRibbon } from "./ProfileMetricsRibbon";
import { ProfileTabsNavigation } from "./ProfileTabsNavigation";
import { ProfileGrid } from "./ProfileGrid";
import { SessionLogTab } from "./tabs/SessionLogTab";
import { LoginLogTab } from "./tabs/LoginLogTab";
import { CoaLogsTab } from "./tabs/CoaLogsTab";
import { InvoicesTab } from "./tabs/InvoicesTab";
import { LedgersTab } from "./tabs/LedgersTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { MacAddressTab } from "./tabs/MacAddressTab";
import { TicketsTab } from "./tabs/TicketsTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { AttributesTab } from "./tabs/AttributesTab";
import { ActivitiesTab } from "./tabs/ActivitiesTab";

export function Customer360ProfileView({
  subscriber,
  onClose,
}: {
  subscriber: SubscriberRecord;
  onClose: () => void;
}) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>("Profile");

  // Keyboard shortcut: Esc to go back to directory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const tabs = [
    "Profile",
    "Activities",
    "Ledgers",
    "Invoices",
    "Session Log",
    "Tickets",
    "Login Log",
    "MAC Address",
    "Reports",
    "Services",
    "Documents",
    "CoA Logs",
    "Attributes",
  ];

  const handleAction = (label: string) => {
    toast.success("Action Executed", `${label} triggered for ${subscriber.fullName}.`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileGrid subscriber={subscriber} />;
      case "Activities":
        return <ActivitiesTab subscriber={subscriber} />;
      case "Ledgers":
        return <LedgersTab subscriber={subscriber} />;
      case "Invoices":
        return <InvoicesTab subscriber={subscriber} />;
      case "Session Log":
        return <SessionLogTab subscriber={subscriber} />;
      case "Tickets":
        return <TicketsTab subscriber={subscriber} />;
      case "Login Log":
        return <LoginLogTab subscriber={subscriber} />;
      case "MAC Address":
        return <MacAddressTab subscriber={subscriber} />;
      case "Reports":
        return <ReportsTab subscriber={subscriber} />;
      case "Services":
        return <ServicesTab subscriber={subscriber} />;
      case "Documents":
        return <DocumentsTab subscriber={subscriber} />;
      case "CoA Logs":
        return <CoaLogsTab subscriber={subscriber} />;
      case "Attributes":
        return <AttributesTab subscriber={subscriber} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="flex-1 w-full h-full overflow-y-auto custom-scrollbar p-6 bg-background"
    >
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center text-xs font-mono text-muted-foreground mb-4">
        <button
          type="button"
          onClick={onClose}
          className="hover:text-primary transition-colors flex items-center gap-1 font-bold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ChevronLeft size={15} /> Subscribers
        </button>
        <ChevronRight size={13} className="mx-2 text-muted-foreground/60" />
        <span className="text-foreground font-bold flex items-center gap-2">
          {subscriber.fullName} ({subscriber.pppoeUsername})
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live Telemetry
          </span>
        </span>
      </div>

      {/* Profile Header */}
      <ProfileHeader subscriber={subscriber} onAction={handleAction} />

      {/* Metrics Ribbon */}
      <ProfileMetricsRibbon subscriber={subscriber} />

      {/* 12 Tabs Navigation Bar */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <ProfileTabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        <div className="p-6 bg-card/40 min-h-[450px]">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
}
