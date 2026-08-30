"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertOctagon, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { modalVariants } from "@/lib/motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  consequenceItems?: string[];
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Critical Action",
  description = "Please review the operational impact before proceeding.",
  consequenceItems = [],
  confirmText = "Proceed with Action",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-elevated z-10 space-y-4"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl shrink-0 border ${
                  variant === "danger"
                    ? "bg-destructive/10 text-destructive border-destructive/20 shadow-glow-destructive"
                    : "bg-warning/10 text-warning border-warning/20 shadow-glow-primary"
                }`}
              >
                {variant === "danger" ? (
                  <AlertOctagon className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="font-heading font-extrabold text-base text-foreground tracking-tight leading-heading">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-body">
                  {description}
                </p>
              </div>
            </div>

            {/* Loss Aversion / Consequence Warning Block */}
            {consequenceItems.length > 0 && (
              <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-destructive font-heading font-bold text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Immediate Operational Consequences:</span>
                </div>
                <div className="space-y-1 pl-1">
                  {consequenceItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11.5px] text-foreground leading-tight">
                      <span className="text-destructive font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-medium">
                {cancelText}
              </Button>
              <Button
                variant={variant === "danger" ? "destructive" : "primary"}
                size="sm"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="text-xs font-bold font-heading shadow-xs"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

