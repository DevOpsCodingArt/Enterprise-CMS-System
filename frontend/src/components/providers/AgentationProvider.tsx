"use client";

import React, { useEffect, useState } from "react";
import { Agentation } from "agentation";

/**
 * Agentation visual feedback toolbar for AI coding agents.
 * Renders in the bottom-right corner during development/review sessions.
 */
export function AgentationProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Agentation />;
}
