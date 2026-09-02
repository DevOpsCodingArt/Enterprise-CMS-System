"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PlatformOverviewView } from "@/components/platform/PlatformOverviewView";

export default function PlatformOverviewPage() {
  const router = useRouter();

  return (
    <PlatformOverviewView
      onNavigateTab={(tab) => router.push(`/platform/${tab}`)}
    />
  );
}
