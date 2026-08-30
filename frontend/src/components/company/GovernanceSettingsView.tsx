"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RbacRolesTab } from "./governance/RbacRolesTab";
import { CannedShortcutsTab } from "./governance/CannedShortcutsTab";
import { SlaRulesTab } from "./governance/SlaRulesTab";
import { CompanyProfileTab } from "./governance/CompanyProfileTab";
import { tabContentVariants } from "@/lib/motion";

export function GovernanceSettingsView({ initialSubTab = "roles" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 1. RBAC RIGHTS MATRIX */}
        {activeTab === "roles" && (
          <motion.div
            key="roles"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <RbacRolesTab />
          </motion.div>
        )}

        {/* 2. CANNED SHORTCUTS */}
        {activeTab === "canned" && (
          <motion.div
            key="canned"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <CannedShortcutsTab />
          </motion.div>
        )}

        {/* 3. SLA RULES */}
        {activeTab === "sla" && (
          <motion.div
            key="sla"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <SlaRulesTab />
          </motion.div>
        )}

        {/* 4. COMPANY PROFILE & INTEGRATIONS */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <CompanyProfileTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

