"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubscribersDirectoryView } from "./subscribers/crm/SubscribersDirectoryView";
import { TariffPackagesView } from "./subscribers/packages/TariffPackagesView";
import { tabContentVariants } from "@/lib/motion";

export function SubscribersCrmView({ initialSubTab = "customers" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 1. SUBSCRIBER CRM DIRECTORY */}
        {activeTab === "customers" && (
          <motion.div
            key="customers"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <SubscribersDirectoryView />
          </motion.div>
        )}

        {/* 2. TARIFF PACKAGES & SPEEDS */}
        {activeTab === "packages" && (
          <motion.div
            key="packages"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <TariffPackagesView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

