"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { springPhysics } from "@/lib/motion";

interface RichEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tips?: string[];
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function RichEmptyState({
  icon: Icon,
  title,
  description,
  tips = [],
  actionLabel,
  onAction,
  actionIcon: ActionIcon = ArrowRight,
  secondaryActionLabel,
  onSecondaryAction,
}: RichEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springPhysics}
      className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-lg mx-auto rounded-2xl border border-border bg-card shadow-ambient"
    >
      {/* Visual Accent Icon Container */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow-primary">
        <Icon className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-card border border-border text-primary shadow-xs">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      </div>

      {/* Confident Headline & Subtext */}
      <h3 className="font-heading font-extrabold text-base md:text-lg text-foreground tracking-tight mb-1.5 leading-heading">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground leading-body max-w-md mb-5">
        {description}
      </p>

      {/* Actionable Guidance Tips */}
      {tips.length > 0 && (
        <div className="w-full text-left bg-card-subtle rounded-xl p-3.5 border border-border-subtle mb-6 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            Suggested Next Steps:
          </span>
          <div className="space-y-1.5">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-tight">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary & Secondary Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            className="shadow-glow-primary text-xs font-bold font-heading px-4 py-2"
          >
            <span>{actionLabel}</span>
            <ActionIcon className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSecondaryAction}
            className="text-xs font-medium px-3.5 py-2"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
