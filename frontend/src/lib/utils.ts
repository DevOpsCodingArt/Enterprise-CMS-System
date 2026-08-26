import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatChatTimestamp(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? format(date, "hh:mm a") : format(date, "dd MMM, hh:mm a");
  } catch {
    return dateString;
  }
}

export function formatCurrencyPKR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "PKR 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `PKR ${num.toLocaleString("en-PK")}`;
}

export function getOpticalHealthStatus(rxDbm: number | string | undefined | null): {
  status: "nominal" | "warning" | "critical" | "dead";
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  if (rxDbm === undefined || rxDbm === null) {
    return {
      status: "dead",
      label: "NO SIGNAL",
      colorClass: "text-muted-foreground",
      bgClass: "bg-muted",
      borderClass: "border-border",
    };
  }

  const val = typeof rxDbm === "string" ? parseFloat(rxDbm) : rxDbm;

  if (val >= -23 && val <= -14) {
    return {
      status: "nominal",
      label: "HEALTHY",
      colorClass: "text-success",
      bgClass: "bg-success/10",
      borderClass: "border-success/30",
    };
  } else if (val < -23 && val >= -27) {
    return {
      status: "warning",
      label: "ATTENUATION WARN",
      colorClass: "text-warning",
      bgClass: "bg-warning-light",
      borderClass: "border-warning",
    };
  } else if (val < -27 && val >= -38) {
    return {
      status: "critical",
      label: "CRITICAL LOSS / CUT",
      colorClass: "text-destructive",
      bgClass: "bg-destructive-light",
      borderClass: "border-destructive",
    };
  } else {
    return {
      status: "dead",
      label: "LINK DOWN",
      colorClass: "text-destructive",
      bgClass: "bg-destructive-light",
      borderClass: "border-destructive",
    };
  }
}

export function getInitials(name?: string | null): string {
  if (!name) return "PO";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
