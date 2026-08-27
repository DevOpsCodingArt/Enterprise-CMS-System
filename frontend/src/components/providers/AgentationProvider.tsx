"use client";

import React, { useSyncExternalStore } from "react";
import { Agentation } from "agentation";

const emptySubscribe = () => () => {};

/**
 * Agentation visual feedback toolbar for AI coding agents.
 * Renders in the bottom-right corner during development/review sessions.
 */
export function AgentationProvider() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) return null;

  return <Agentation />;
}
