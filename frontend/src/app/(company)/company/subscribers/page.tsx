"use client";

import React from "react";
import { SubscribersDirectoryView } from "@/components/company/subscribers/crm/SubscribersDirectoryView";

export default function SubscribersPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <SubscribersDirectoryView />
    </div>
  );
}
