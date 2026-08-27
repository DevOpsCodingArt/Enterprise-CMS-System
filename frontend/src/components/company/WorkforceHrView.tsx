"use client";

import React from "react";
import { DepartmentsTab } from "./workforce/DepartmentsTab";
import { StaffDirectoryTab } from "./workforce/StaffDirectoryTab";
import { ShiftRostersTab } from "./workforce/ShiftRostersTab";
import { AttendanceTrackerTab } from "./workforce/AttendanceTrackerTab";
import { TaskAllocationTab } from "./workforce/TaskAllocationTab";

export function WorkforceHrView({ initialSubTab = "departments" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body flex flex-col overflow-hidden">
      {/* 1. DEPARTMENTS */}
      {activeTab === "departments" && <DepartmentsTab />}

      {/* 2. STAFF DIRECTORY */}
      {activeTab === "staff" && <StaffDirectoryTab />}

      {/* 3. SHIFT ROSTERS (24/7 NOC) */}
      {activeTab === "shifts" && <ShiftRostersTab />}

      {/* 4. ATTENDANCE & OVERTIME */}
      {activeTab === "attendance" && <AttendanceTrackerTab />}

      {/* 5. TASK ALLOCATION BOARD */}
      {activeTab === "tasks" && <TaskAllocationTab />}
    </div>
  );
}
