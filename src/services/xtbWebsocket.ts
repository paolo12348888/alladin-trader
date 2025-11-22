/**
 * Servizio WebSocket per connessioni XTB in tempo reale
 * 
 * Questo servizio gestisce le connessioni WebSocket dirette a XTB per:
 * - Streaming di prezzi in tempo reale
 * - Notifiche di esecuzione ordini
 * - Aggiornamenti posizioni in real-time
 * - Dati di mercato live
 * 
 * Nota: Attualmente le funzionalità principali utilizzano API REST,
 * ma questo servizio può essere esteso per funzionalità real-time avanzate.
 */

export interface XTBWebSocketMessage {
  command: string;
  data?: any;
  customTag?: string;
}

export interface XTBStreamData {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface XTBTradeUpdate {
  orderId: number;
  status: 'PLACED' | 'MODIFIED' | 'CLOSED' | 'CANCELLED';
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  price: number;
  profit?: number;
  timestamp: string;
}

export interface XTBPositionUpdate {
  positionId: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  timestamp: string;
}

export class XTBWebSocketService {
  private ws: WebSocket | null = null;
  private baseUrl: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscriptions: Map<string, Set<string>> = new Map();
  private messageHandlers: Map<string, Function[]> = new Map();

  constructor(baseUrl: string = 'wss://ws.xtb.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Connessione WebSocket a XTB
   * 
   * Nota: Attualmente non utilizzato per ordini reali, 
   * ma può essere esteso per streaming dati avanzato
   */
  async connect(sessionId?: string): Promise<void> {
    try {
      if (this.ws && this.isConnected) {
        console.log('WebSocket già connesso');
        return;
      }

      const wsUrl = sessionId 
        ? `${this.baseUrl}/stream?sessionId=${sessionId}`
        : this.baseUrl;

      console.log(`🔌 Connessione WebSocket a: ${wsUrl}`);

      return new Promise((resolve, reject) => {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket XTB connesso');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Avvia heartbeat
          this.startHeartbeat();
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Errore parsing messaggio WebSocket:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Errore WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnesso');
          this.isConnected = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      });
    } catch (error) {
      console.error('Errore connessione WebSocket:', error);
      throw error;
    }
  }

  /**
   * Disconnessione WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.stopHeartbeat();
    this.subscriptions.clear();
    this.messageHandlers.clear();
  }

  /**
   * Invia messaggio WebSocket
   */
  sendMessage(message: XTBWebSocketMessage): boolean {
    if (!this.ws || !this.isConnected) {
      console.warn('WebSocket non connesso, impossibile inviare messaggio');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Errore invio messaggio WebSocket:', error);
      return false;
    }
  }

  /**
   * Iscriviti a dati di mercato per simbolo
   */
  subscribeMarketData(symbol: string): boolean {
    const message: XTBWebSocketMessage = {
      command: 'getTickPrices',
      data: { symbols: [symbol] }
    };

    if (!this.subscriptions.has('marketData')) {
      this.subscriptions.set('marketData', new Set());
    }
    this.subscriptions.get('marketData')!.add(symbol);

    return this.sendMessage(message);
  }

  /**
   * Disiscriviti da dati di mercato
   */
  unsubscribeMarketData(symbol: string): boolean {
    const message: XTBWebSocketMessage = {
      command: 'stopTickPrices',
      data: { symbols: [symbol] }
    };

    const marketDataSubs = this.subscriptions.get('marketData');
    if (marketDataSubs) {
      marketDataSubs.delete(symbol);
    }

    return this.sendMessage(message);
  }

  /**
   * Iscriviti a aggiornamenti posizioni
   */
  subscribePositionUpdates(): boolean {
    const message: XTBWebSocketMessage = {
      command: 'getTrades',
      data: { openedOnly: false }
    };

    if (!this.subscriptions.has('positions')) {
      this.subscriptions.set('positions', new Set());
    }

    return this.sendMessage(message);
  }

  /**
   * Gestisci messaggio ricevuto
   */
  private handleMessage(message: any): void {
    const { command, data } = message;

    switch (command) {
      case 'tickPrices':
        this.handleTickPrices(data);
        break;
      case 'trade':
        this.handleTradeUpdate(data);
        break;
      case 'tradeStatus':
        this.handleTradeStatus(data);
        break;
      case 'balance':
        this.handleBalanceUpdate(data);
        break;
      case 'pong':
        // Risposta al ping, tutto OK
        break;
      default:
        console.log('Messaggio WebSocket non gestito:', command, data);
    }

    // Notifica handler personalizzati
    this.notifyHandlers(command, data);
  }

  /**
   * Gestisci aggiornamenti prezzi
   */
  private handleTickPrices(data: any): void {
    if (data && data.symbol && data.bid && data.ask) {
      const streamData: XTBStreamData = {
        symbol: data.symbol,
        bid: data.bid,
        ask: data.ask,
        timestamp: data.timestamp || Date.now()
      };

      // Notifica subscribers per questo simbolo
      this.notifyHandlers('marketData', streamData);
    }
  }

  /**
   * Gestisci aggiornamenti trade
   */
  private handleTradeUpdate(data: any): void {
    if (data && data.position) {
      const tradeUpdate: XTBTradeUpdate = {
        orderId: data.order,
        status: this.mapTradeStatus(data.status),
        symbol: data.symbol,
        type: data.cmd === 0 ? 'BUY' : 'SELL',
        volume: data.volume,
        price: data.price,
        profit: data.profit,
        timestamp: new Date().toISOString()
      };

      this.notifyHandlers('tradeUpdate', tradeUpdate);
    }
  }

  /**
   * Gestisci stato trade
   */
  private handleTradeStatus(data: any): void {
    if (data && data.order) {
      const tradeUpdate: XTBTradeUpdate = {
        orderId: data.order,
        status: this.mapTradeStatus(data.status),
        symbol: data.symbol || '',
        type: 'BUY', // Default, da migliorare
        volume: data.volume || 0,
        price: data.price || 0,
        timestamp: new Date().toISOString()
      };

      this.notifyHandlers('tradeStatus', tradeUpdate);
    }
  }

  /**
   * Gestisci aggiornamenti balance
   */
  private handleBalanceUpdate(data: any): void {
    this.notifyHandlers('balanceUpdate', data);
  }

  /**
   * Mappa stato trade XTB a nostro formato
   */
  private mapTradeStatus(xtbStatus: string): XTBTradeUpdate['status'] {
    const statusMap: { [key: string]: XTBTradeUpdate['status'] } = {
      'PLACED': 'PLACED',
      'MODIFIED': 'MODIFIED',
      'CLOSED': 'CLOSED',
      'CANCELLED': 'CANCELLED'
    };

    return statusMap[xtbStatus] || 'PLACED';
  }

  /**
   * Registra handler per un tipo di messaggio
   */
  onMessage(messageType: string, handler: Function): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Rimuovi handler
   */
  offMessage(messageType: string, handler: Function): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Notifica handler registrati
   */
  private notifyHandlers(messageType: string, data: any): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Errore nell'handler ${messageType}:`, error);
        }
      });
    }
  }

  /**
   * Avvia heartbeat per mantenere connessione
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.sendMessage({ command: 'ping' });
      }
    }, 30000); // Ping ogni 30 secondi
  }

  /**
   * Ferma heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Tentativo di riconnessione automatica
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max tentativi di riconnessione raggiunti');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Tentativo di riconnessione ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch(error => {
          console.error('Errore riconnessione:', error);
        });
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Ottieni stato connessione
   */
  getConnectionStatus(): {
    isConnected: boolean;
    reconnectAttempts: number;
    subscriptions: number;
  } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptions: this.subscriptions.size
    };
  }
}

// Istanza singleton del servizio WebSocket XTB
export const xtbWebSocket = new XTBWebSocketService();

// Hook React per gestione WebSocket
import { useState, useEffect, useRef } from 'react';

export const useXTBWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<XTBStreamData[]>([]);
  const [tradeUpdates, setTradeUpdates] = useState<XTBTradeUpdate[]>([]);
  const handlersRef = useRef<{ [key: string]: Function }>({});

  useEffect(() => {
    // Registra handlers
    const handleMarketData = (data: XTBStreamData) => {
      setStreamData(prev => {
        const filtered = prev.filter(item => item.symbol !== data.symbol);
        return [...filtered, data];
      });
    };

    const handleTradeUpdate = (data: XTBTradeUpdate) => {
      setTradeUpdates(prev => [...prev.slice(-49), data]); // Mantieni ultime 50 notifiche
    };

    const handleConnectionStatus = () => {
      const status = xtbWebSocket.getConnectionStatus();
      setIsConnected(status.isConnected);
      setReconnectAttempts(status.reconnectAttempts);
    };

    handlersRef.current = {
      marketData: handleMarketData,
      tradeUpdate: handleTradeUpdate,
      connectionStatus: handleConnectionStatus
    };

    // Registra handler al servizio
    xtbWebSocket.onMessage('marketData', handleMarketData);
    xtbWebSocket.onMessage('tradeUpdate', handleTradeUpdate);

    // Tenta connessione
    const connectWebSocket = async () => {
      try {
        setError(null);
        await xtbWebSocket.connect();
        handleConnectionStatus();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore connessione WebSocket');
      }
    };

    connectWebSocket();

    // Status check periodico
    const statusInterval = setInterval(handleConnectionStatus, 5000);

    return () => {
      // Cleanup
      xtbWebSocket.offMessage('marketData', handleMarketData);
      xtbWebSocket.offMessage('tradeUpdate', handleTradeUpdate);
      clearInterval(statusInterval);
    };
  }, []);

  const subscribeSymbol = (symbol: string) => {
    return xtbWebSocket.subscribeMarketData(symbol);
  };

  const unsubscribeSymbol = (symbol: string) => {
    return xtbWebSocket.unsubscribeMarketData(symbol);
  };

  return {
    // Stato
    isConnected,
    reconnectAttempts,
    error,
    streamData,
    tradeUpdates,

    // Metodi
    subscribeSymbol,
    unsubscribeSymbol,
    clearError: () => setError(null)
  };
};

export default XTBWebSocketService;