import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";

export interface ChatMessagePayload {
  id?: string;
  conversationId: string;
  content: string;
  messageType?: "text" | "image" | "voice" | "video" | "document" | "system" | "ticket_created" | "payment_proof";
  isInternalNote?: boolean;
  fileUrl?: string;
  fileName?: string;
  senderType?: "customer" | "staff" | "system";
  senderName?: string;
  createdAt?: string;
  status?: "sent" | "delivered" | "read";
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  userId: string;
  userEmail: string;
  userType: string;
  isOnline: boolean;
  timestamp: string;
}

export interface NocTelemetryAlert {
  id: string;
  oltHostname: string;
  ponPort: string;
  fatBox: string;
  dropDbm: number;
  severity: "warning" | "critical" | "info";
  message: string;
  customerCode: string;
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private messageListeners: Set<(msg: any) => void> = new Set();
  private typingListeners: Set<(data: TypingEvent) => void> = new Set();
  private readListeners: Set<(data: { conversationId: string; messageId: string; readAt: string }) => void> = new Set();
  private presenceListeners: Set<(data: PresenceEvent) => void> = new Set();
  private telemetryListeners: Set<(alert: NocTelemetryAlert) => void> = new Set();
  private conversationUpdateListeners: Set<(data: any) => void> = new Set();

  private getToken(explicitToken?: string): string | null {
    if (explicitToken) return explicitToken;
    if (typeof window === "undefined") return null;

    try {
      const stateToken = useAuthStore.getState().accessToken;
      if (stateToken) return stateToken;
    } catch (e) {
      // Ignore if outside Zustand context
    }

    try {
      const stored = localStorage.getItem("prime-one-auth-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        const token =
          parsed?.state?.accessToken ||
          parsed?.state?.tokens?.accessToken ||
          parsed?.accessToken;
        if (token) return token;
      }
    } catch (e) {
      console.warn("[SocketService] Failed to parse auth token from storage:", e);
    }

    return null;
  }

  private getWsUrl(): string {
    const raw = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";
    if (raw.endsWith("/chat")) return raw;
    return `${raw.replace(/\/+$/, "")}/chat`;
  }

  isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  connect(explicitToken?: string): Socket | null {
    if (typeof window === "undefined") return null;
    if (this.socket?.connected) return this.socket;

    const token = this.getToken(explicitToken);
    if (!token) {
      console.warn("[SocketService] No token found for WebSocket authentication");
      return null;
    }

    const wsUrl = this.getWsUrl();

    if (this.socket && !this.socket.connected) {
      this.socket.auth = { token };
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("[SocketService] Connected to /chat WebSocket namespace with ID:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[SocketService] Disconnected from /chat:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[SocketService] Connection error:", err.message);
    });

    // Inbound server event dispatches
    this.socket.on("chat:new_message", (msg) => {
      this.messageListeners.forEach((fn) => fn(msg));
    });

    this.socket.on("chat:typing", (data: TypingEvent) => {
      this.typingListeners.forEach((fn) => fn(data));
    });

    this.socket.on("chat:message_read", (data) => {
      this.readListeners.forEach((fn) => fn(data));
    });

    this.socket.on("presence:update", (data: PresenceEvent) => {
      this.presenceListeners.forEach((fn) => fn(data));
    });

    this.socket.on("noc:telemetry_alert", (alert: NocTelemetryAlert) => {
      this.telemetryListeners.forEach((fn) => fn(alert));
    });

    this.socket.on("conversation:updated", (data) => {
      this.conversationUpdateListeners.forEach((fn) => fn(data));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    if (!this.socket?.connected) this.connect();
    this.socket?.emit("chat:join_conversation", { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit("chat:leave_conversation", { conversationId });
  }

  sendMessage(payload: ChatMessagePayload): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        this.connect();
      }

      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      let hasHandled = false;
      const ackTimeout = setTimeout(() => {
        if (!hasHandled) {
          hasHandled = true;
          // Optimistically resolve if server does not acknowledge within 1s
          resolve({ status: "sent" });
        }
      }, 1000);

      this.socket.emit("chat:send_message", payload, (response: any) => {
        if (!hasHandled) {
          hasHandled = true;
          clearTimeout(ackTimeout);
          if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    if (!this.socket?.connected) return;
    const event = isTyping ? "chat:typing_start" : "chat:typing_stop";
    this.socket.emit(event, { conversationId });
  }

  markAsRead(conversationId: string, messageId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit("chat:mark_read", { conversationId, messageId });
  }

  triggerTelemetryAlert(alert: Partial<NocTelemetryAlert>) {
    if (!this.socket?.connected) return;
    this.socket.emit("noc:trigger_telemetry_alert", alert);
  }

  simulateNocAlert(alert: Partial<NocTelemetryAlert>) {
    this.triggerTelemetryAlert(alert);
  }

  // Subscription helpers
  onNewMessage(cb: (msg: any) => void) {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  onMessage(cb: (msg: any) => void) {
    return this.onNewMessage(cb);
  }

  onTyping(cb: (data: TypingEvent) => void) {
    this.typingListeners.add(cb);
    return () => this.typingListeners.delete(cb);
  }

  onMessageRead(cb: (data: { conversationId: string; messageId: string; readAt: string }) => void) {
    this.readListeners.add(cb);
    return () => this.readListeners.delete(cb);
  }

  onPresence(cb: (data: PresenceEvent) => void) {
    this.presenceListeners.add(cb);
    return () => this.presenceListeners.delete(cb);
  }

  onTelemetryAlert(cb: (alert: NocTelemetryAlert) => void) {
    this.telemetryListeners.add(cb);
    return () => this.telemetryListeners.delete(cb);
  }

  onConversationUpdated(cb: (data: any) => void) {
    this.conversationUpdateListeners.add(cb);
    return () => this.conversationUpdateListeners.delete(cb);
  }
}

export const socketService = new SocketService();
