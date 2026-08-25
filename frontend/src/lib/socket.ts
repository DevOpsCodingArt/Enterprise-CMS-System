import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(token?: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    let authToken = token;
    if (!authToken && typeof window !== 'undefined') {
      const stored = localStorage.getItem('prime_one_auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          authToken = parsed.state?.tokens?.accessToken;
        } catch {
          // ignore
        }
      }
    }

    this.isConnecting = true;

    this.socket = io(WS_URL, {
      auth: {
        token: authToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log('⚡ Socket.io connected successfully. ID:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      this.isConnecting = false;
      console.warn('Socket connection error:', err.message);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnecting = false;
      console.log('Socket disconnected:', reason);
    });

    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  public joinConversation(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('conversation:join', { conversationId });
    }
  }

  public leaveConversation(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('conversation:leave', { conversationId });
    }
  }
}

export const socketManager = SocketManager.getInstance();
export default socketManager;
