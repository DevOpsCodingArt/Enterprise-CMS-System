"use client";

import React from "react";
import { OperationsDeskView } from "@/components/company/OperationsDeskView";

export default function TroubleTicketsPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <OperationsDeskView initialSubTab="tickets" />
    </div>
  );
}
