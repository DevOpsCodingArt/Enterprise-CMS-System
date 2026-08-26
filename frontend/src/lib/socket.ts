import { io, Socket } from "socket.io-client";
import type { ConnectionStatus } from "@/types/api.types";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private status: ConnectionStatus = "disconnected";
  private statusListeners: Array<(status: ConnectionStatus) => void> = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.push(callback);
    callback(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter((cb) => cb !== callback);
    };
  }

  private setStatus(newStatus: ConnectionStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((listener) => listener(newStatus));
    }
  }

  /**
   * Connect to WebSocket gateway with token & circuit breaker.
   */
  public connect(token?: string): Socket | null {
    if (typeof window === "undefined") return null;

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.setStatus("connecting");

    try {
      this.socket = io(WS_BASE_URL, {
        auth: {
          token: token || this.getStoredToken(),
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
        reconnectionDelayMax: 10000,
        timeout: 10000,
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        this.setStatus("connected");
      });

      this.socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect" || reason === "transport close") {
          this.setStatus("degraded");
        } else {
          this.setStatus("disconnected");
        }
      });

      this.socket.on("connect_error", () => {
        // Degraded mode: Never crash the frontend if Redis or WebSocket server is unavailable
        this.setStatus("degraded");
      });

      this.socket.on("reconnect_attempt", () => {
        this.setStatus("connecting");
      });

      this.socket.on("reconnect_failed", () => {
        this.setStatus("degraded");
      });
    } catch {
      // Circuit breaker catches any synchronous connection fault silently
      this.setStatus("degraded");
    }

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.setStatus("disconnected");
    }
  }

  public emit(event: string, data: unknown): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("prime-one-auth-storage");
      if (stored) {
        return JSON.parse(stored).state?.accessToken || null;
      }
    } catch {
      // ignore
    }
    return null;
  }
}

export const socketService = SocketService.getInstance();
