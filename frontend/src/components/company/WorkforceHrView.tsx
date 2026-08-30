"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DepartmentsTab } from "./workforce/DepartmentsTab";
import { StaffDirectoryTab } from "./workforce/StaffDirectoryTab";
import { ShiftRostersTab } from "./workforce/ShiftRostersTab";
import { AttendanceTrackerTab } from "./workforce/AttendanceTrackerTab";
import { TaskAllocationTab } from "./workforce/TaskAllocationTab";
import { tabContentVariants } from "@/lib/motion";

export function WorkforceHrView({ initialSubTab = "departments" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 1. DEPARTMENTS */}
        {activeTab === "departments" && (
          <motion.div
            key="departments"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <DepartmentsTab />
          </motion.div>
        )}

        {/* 2. STAFF DIRECTORY */}
        {activeTab === "staff" && (
          <motion.div
            key="staff"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <StaffDirectoryTab />
          </motion.div>
        )}

        {/* 3. SHIFT ROSTERS (24/7 NOC) */}
        {activeTab === "shifts" && (
          <motion.div
            key="shifts"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <ShiftRostersTab />
          </motion.div>
        )}

        {/* 4. ATTENDANCE & OVERTIME */}
        {activeTab === "attendance" && (
          <motion.div
            key="attendance"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <AttendanceTrackerTab />
          </motion.div>
        )}

        {/* 5. TASK ALLOCATION BOARD */}
        {activeTab === "tasks" && (
          <motion.div
            key="tasks"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            <TaskAllocationTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

