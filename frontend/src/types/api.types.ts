/**
 * Standard API response envelope and network status types.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "degraded"
  | "disconnected"
  | "offline";

export interface OpticalTelemetry {
  rxPowerDbm: number;
  txPowerDbm: number;
  oltHostname: string;
  ponPort: string;
  onuSerial: string;
  temperatureC: number;
  status: "optimal" | "warning" | "critical" | "offline";
  lastPolledAt: string;
}
