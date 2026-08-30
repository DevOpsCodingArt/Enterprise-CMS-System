"use client";

import React from "react";
import { LiveChatWorkspace } from "@/components/company/operations/chat/LiveChatWorkspace";

export default function LiveChatDeskPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <LiveChatWorkspace />
    </div>
  );
}
