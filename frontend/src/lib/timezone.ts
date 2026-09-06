/**
 * Multi-Tenant Timezone Utilities for Prime One
 * Enforces strict tenant-scoped time formatting (e.g. Asia/Karachi, Asia/Shanghai, Asia/Kolkata)
 * independent of hosting server location or user client browser clock.
 */

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  abbr: string;
}

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  {
    value: "Asia/Karachi",
    label: "Pakistan Standard Time (PKT, UTC+5)",
    offset: "+05:00",
    abbr: "PKT",
  },
  {
    value: "Asia/Shanghai",
    label: "China Standard Time (CST, UTC+8)",
    offset: "+08:00",
    abbr: "CST",
  },
  {
    value: "Asia/Kolkata",
    label: "India Standard Time (IST, UTC+5:30)",
    offset: "+05:30",
    abbr: "IST",
  },
  {
    value: "Asia/Dubai",
    label: "Gulf Standard Time (GST, UTC+4)",
    offset: "+04:00",
    abbr: "GST",
  },
  {
    value: "Asia/Dhaka",
    label: "Bangladesh Standard Time (BST, UTC+6)",
    offset: "+06:00",
    abbr: "BST",
  },
  {
    value: "Asia/Riyadh",
    label: "Arabia Standard Time (AST, UTC+3)",
    offset: "+03:00",
    abbr: "AST",
  },
  {
    value: "Europe/London",
    label: "Greenwich / British Time (GMT/BST, UTC+0/+1)",
    offset: "+00:00",
    abbr: "GMT",
  },
  {
    value: "Europe/Berlin",
    label: "Central European Time (CET, UTC+1/+2)",
    offset: "+01:00",
    abbr: "CET",
  },
  {
    value: "America/New_York",
    label: "Eastern Time (EST, UTC-5/-4)",
    offset: "-05:00",
    abbr: "EST",
  },
  {
    value: "UTC",
    label: "Coordinated Universal Time (UTC)",
    offset: "+00:00",
    abbr: "UTC",
  },
];

export const DEFAULT_TENANT_TIMEZONE = "Asia/Karachi";

/**
 * Formats a UTC date string or Date into a human-readable date and time
 * strictly in the tenant's operational timezone.
 * Example output: "Sep 6, 2026, 05:25 PM PKT"
 */
export function formatTenantDateTime(
  isoString?: string | Date | null,
  timezone: string = DEFAULT_TENANT_TIMEZONE
): string {
  if (!isoString) return "--------";
  const d = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(d.getTime())) return String(isoString);

  try {
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || DEFAULT_TENANT_TIMEZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(d);

    return formatted;
  } catch {
    // Fallback if timezone string is invalid
    return d.toUTCString();
  }
}

/**
 * Formats a UTC date string into just the time in the tenant's timezone.
 * Example output: "05:25 PM PKT"
 */
export function formatTenantTime(
  isoString?: string | Date | null,
  timezone: string = DEFAULT_TENANT_TIMEZONE
): string {
  if (!isoString) return "--:--";
  const d = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(d.getTime())) return String(isoString);

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || DEFAULT_TENANT_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(d);
  } catch {
    return d.toLocaleTimeString();
  }
}

/**
 * Formats a UTC date string into just the date (no time) in tenant's timezone.
 * Example output: "Sep 6, 2026"
 */
export function formatTenantDateOnly(
  isoString?: string | Date | null,
  timezone: string = DEFAULT_TENANT_TIMEZONE
): string {
  if (!isoString) return "--------";
  const d = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(d.getTime())) return String(isoString);

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || DEFAULT_TENANT_TIMEZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/**
 * Returns the short timezone abbreviation (e.g. PKT, CST, IST).
 */
export function getTimezoneAbbreviation(timezone: string = DEFAULT_TENANT_TIMEZONE): string {
  const match = SUPPORTED_TIMEZONES.find((t) => t.value === timezone);
  if (match) return match.abbr;

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : timezone;
  } catch {
    return timezone;
  }
}
