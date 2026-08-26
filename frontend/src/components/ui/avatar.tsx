"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  presence?: "online" | "busy" | "offline";
}

export function Avatar({
  name,
  src,
  size = "md",
  presence,
  className,
  ...props
}: AvatarProps) {
  const [hasImageError, setHasImageError] = React.useState(false);

  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeStyles = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
    xl: "h-14 w-14 text-lg",
  };

  const presenceDotSize = {
    sm: "h-2 w-2 ring-1",
    md: "h-2.5 w-2.5 ring-2",
    lg: "h-3 w-3 ring-2",
    xl: "h-3.5 w-3.5 ring-2",
  };

  const presenceColors = {
    online: "bg-success",
    busy: "bg-warning",
    offline: "bg-muted-foreground",
  };

  const roundedStyles = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center border border-border bg-card-subtle font-heading font-bold text-foreground overflow-hidden select-none",
          sizeStyles[size],
          roundedStyles[size]
        )}
      >
        {src && !hasImageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {presence && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-background",
            presenceDotSize[size],
            presenceColors[presence]
          )}
        />
      )}
    </div>
  );
}
