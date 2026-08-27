"use client";

import React from "react";
import { SubscribersDirectoryView } from "./subscribers/crm/SubscribersDirectoryView";
import { TariffPackagesView } from "./subscribers/packages/TariffPackagesView";

export function SubscribersCrmView({ initialSubTab = "customers" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body flex flex-col overflow-hidden">
      {/* 1. SUBSCRIBER CRM DIRECTORY */}
      {activeTab === "customers" && <SubscribersDirectoryView />}

      {/* 2. TARIFF PACKAGES & SPEEDS */}
      {activeTab === "packages" && <TariffPackagesView />}
    </div>
  );
}
