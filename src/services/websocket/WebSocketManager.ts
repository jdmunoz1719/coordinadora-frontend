import { io, Socket } from 'socket.io-client';
import { WS_MESSAGE_TYPES } from '@config/ws.config';

type MessageHandler<T = unknown> = (data: T) => void;
type ConnectionHandler = () => void;

const WS_BASE_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:3001';

class WebSocketManager {
  private socket: Socket | null = null;
  private connectionHandlers = new Set<ConnectionHandler>();
  private disconnectionHandlers = new Set<ConnectionHandler>();

  connect(): Promise<void> {
    if (this.socket?.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.socket = io(`${WS_BASE_URL}/dashboard`, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      this.socket.once('connect', () => {
        this.connectionHandlers.forEach((h) => h());
        resolve();
      });

      this.socket.once('connect_error', (err) => {
        reject(err);
      });

      this.socket.on('disconnect', () => {
        this.disconnectionHandlers.forEach((h) => h());
      });

      this.socket.on('connect', () => {
        this.connectionHandlers.forEach((h) => h());
      });
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<T = unknown>(event: string, handler: MessageHandler<T>): void {
    this.socket?.on(event, handler as MessageHandler);
  }

  off<T = unknown>(event: string, handler: MessageHandler<T>): void {
    this.socket?.off(event, handler as MessageHandler);
  }

  emit<T = unknown>(event: string, data?: T): void {
    this.socket?.emit(event, data);
  }

  subscribeToChannel(channel: string): void {
    this.socket?.emit(WS_MESSAGE_TYPES.SUBSCRIBE, channel);
  }

  unsubscribeFromChannel(channel: string): void {
    this.socket?.emit(WS_MESSAGE_TYPES.UNSUBSCRIBE, channel);
  }

  onConnected(handler: ConnectionHandler): void {
    this.connectionHandlers.add(handler);
  }

  onDisconnected(handler: ConnectionHandler): void {
    this.disconnectionHandlers.add(handler);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const wsManager = new WebSocketManager();
