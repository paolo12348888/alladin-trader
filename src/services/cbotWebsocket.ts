/**
 * CBOT WebSocket Service per real-time communication
 */
import { WebSocketMessage } from '../types/cbot';

type MessageHandler = (message: WebSocketMessage) => void;

class CbotWebSocketService {
  private ws: WebSocket | null = null;
  private clientId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private handlers: Set<MessageHandler> = new Set();
  private isConnecting = false;

  constructor() {
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  connect(url: string = 'ws://localhost:8000/api/v1/ws'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      const wsUrl = `${url}/${this.clientId}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('CBOT WebSocket connected');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.notifyHandlers(message);
          } catch (error) {
            console.error('Error parsing CBOT WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('CBOT WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('CBOT WebSocket disconnected');
          this.isConnecting = false;
          this.stopHeartbeat();
          this.attemptReconnect(url);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`CBOT attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(url).catch((error) => {
          console.error('CBOT reconnection failed:', error);
        });
      }, this.reconnectDelay);
    } else {
      console.error('CBOT max reconnection attempts reached');
    }
  }

  private heartbeatInterval: number | null = null;

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(data: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    console.warn('CBOT WebSocket not connected');
    return false;
  }

  sendChatMessage(message: string): boolean {
    return this.send({
      type: 'chat',
      message,
    });
  }

  subscribeUpdates(): boolean {
    return this.send({
      type: 'subscribe_updates',
    });
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.handlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in CBOT message handler:', error);
      }
    });
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const cbotWsService = new CbotWebSocketService();
