"use client";

import { Transition, Variants } from "framer-motion";

/**
 * Standardized Spring Physics
 * Snappy, responsive, and hardware-accelerated without feeling sluggish
 */
export const springPhysics: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const gentleSpringPhysics: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

/**
 * Fade in + Scale up for Modals, Popovers, and Dialogs
 */
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springPhysics,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.15 },
  },
};

/**
 * Slide over from Right for Drawers and Side-Sheets
 */
export const drawerVariants: Variants = {
  initial: {
    x: "100%",
    opacity: 0.5,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: springPhysics,
  },
  exit: {
    x: "100%",
    opacity: 0.5,
    transition: { duration: 0.2 },
  },
};

/**
 * Stagger Container for Tables, Grid Cards, and Metrics Ribbons
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/**
 * Stagger Child Item for Cards, Rows, and List Items
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: gentleSpringPhysics,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.12 },
  },
};

/**
 * Crossfade Transition for Tab Switching
 */
export const tabContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.12 },
  },
};
