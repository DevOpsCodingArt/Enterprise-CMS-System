import { create } from "zustand";
import type { ConnectionStatus } from "@/types/api.types";
import { socketService } from "@/lib/socket";

interface SocketState {
  status: ConnectionStatus;
  isDegraded: boolean;
  setStatus: (status: ConnectionStatus) => void;
  initializeSocket: (token?: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  status: "disconnected",
  isDegraded: false,

  setStatus: (status) =>
    set({
      status,
      isDegraded: status === "degraded" || status === "offline",
    }),

  initializeSocket: (token) => {
    socketService.onStatusChange((status) => {
      set({
        status,
        isDegraded: status === "degraded" || status === "offline",
      });
    });
    socketService.connect(token);
  },
}));
