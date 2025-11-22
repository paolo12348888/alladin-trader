// Servizio API per XTB
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export interface XTBStatus {
  status: string;
  streamSessionId: string | null;
  connected: boolean;
  timestamp: string;
}

export interface XTBAccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
}

export interface XTBMarketData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  profit: number;
  volume: number;
  timestamp: number;
}

export interface XTBTradingHours {
  symbol: string;
  day: number;
  open: string;
  close: string;
}

// Nuove interfacce per il Portfolio Reale
export interface XTBPosition {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  openTime: string;
  commission: number;
}

export interface XTBSummary {
  totalPositions: number;
  totalProfit: number;
  totalCommission: number;
  totalSwap: number;
  netProfit: number;
  totalVolume: number;
  equity: number;
  balance: number;
  freeMargin: number;
}

export interface XTBBortfolioData {
  positions: XTBPosition[];
  summary: XTBSummary;
}

export interface XTBPositionsResponse {
  positions: XTBPosition[];
  timestamp: string;
}

export interface XTBOrderRequest {
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
  comment?: string;
}

export interface XTBOrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    success: boolean;
    orderId?: number;
    isReal: boolean;
    timestamp: string;
    orderData?: XTBOrderRequest;
    safetyChecks?: {
      isValid: boolean;
      warnings: string[];
      errors: string[];
    };
  };
}

export interface XTBAccountTypeResponse {
  accountType: 'demo' | 'real';
  isReal: boolean;
  description: string;
  timestamp: string;
}

export interface XTBOrderHistory {
  orders: Array<{
    id: number;
    position: number;
    symbol: string;
    type: 'BUY' | 'SELL';
    volume: number;
    openPrice: number;
    closePrice: number;
    profit: number;
    commission: number;
    swap: number;
    openTime: string;
    closeTime: string;
    comment: string;
    isReal: boolean;
  }>;
  total: number;
  isReal: boolean;
  period: { start: number; end: number };
  timestamp: string;
}

export class XTBApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Controlla lo stato della connessione XTB
  async getStatus(): Promise<XTBStatus> {
    const response = await fetch(`${this.baseUrl}/api/xtb/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Ottieni informazioni account
  async getAccountInfo(): Promise<XTBAccountInfo> {
    const response = await fetch(`${this.baseUrl}/api/xtb/balance`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Ottieni dati di mercato per un simbolo
  async getMarketData(symbol: string): Promise<XTBMarketData> {
    const response = await fetch(`${this.baseUrl}/api/xtb/market/${symbol}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Ottieni lista simboli disponibili
  async getSymbols(): Promise<{
    forex: string[];
    stocks: string[];
    crypto: string[];
    all: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/xtb/symbols`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Testa la connessione XTB
  async testConnection(): Promise<boolean> {
    try {
      const status = await this.getStatus();
      return status.connected;
    } catch (error) {
      console.error('XTB connection test failed:', error);
      return false;
    }
  }

  // Ottieni dati di mercato multipli
  async getMultipleMarketData(symbols: string[]): Promise<Record<string, XTBMarketData>> {
    const promises = symbols.map(symbol => 
      this.getMarketData(symbol).catch(error => {
        console.error(`Failed to get data for ${symbol}:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    const marketData: Record<string, XTBMarketData> = {};

    symbols.forEach((symbol, index) => {
      if (results[index]) {
        marketData[symbol] = results[index]!;
      }
    });

    return marketData;
  }

  // Nuovi metodi per il Portfolio Reale
  // Ottieni dati completi del portfolio
  async getPortfolio(): Promise<XTBBortfolioData> {
    const response = await fetch(`${this.baseUrl}/api/xtb/portfolio`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Ottieni solo le posizioni attive
  async getPositions(): Promise<XTBPositionsResponse> {
    const response = await fetch(`${this.baseUrl}/api/xtb/positions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Calcola performance del portfolio
  async getPortfolioPerformance(): Promise<{
    totalReturn: number;
    dailyReturn: number;
    positionsCount: number;
    profitablePositions: number;
    unprofitablePositions: number;
  }> {
    try {
      const portfolioData = await this.getPortfolio();
      const positions = portfolioData.positions;
      
      const profitablePositions = positions.filter(p => p.profit > 0).length;
      const unprofitablePositions = positions.filter(p => p.profit < 0).length;
      
      // Simulazione di rendimenti giornalieri
      const dailyReturn = Math.random() * 2 - 1; // Random tra -1% e +1%
      
      return {
        totalReturn: portfolioData.summary.netProfit,
        dailyReturn: dailyReturn,
        positionsCount: positions.length,
        profitablePositions: profitablePositions,
        unprofitablePositions: unprofitablePositions
      };
    } catch (error) {
      console.error('Error calculating portfolio performance:', error);
      return {
        totalReturn: 0,
        dailyReturn: 0,
        positionsCount: 0,
        profitablePositions: 0,
        unprofitablePositions: 0
      };
    }
  }

  // ===============================
  // METODI PER ORDINI REALI XTB
  // ===============================

  /**
   * Verifica tipo account (demo vs real)
   */
  async getAccountType(): Promise<XTBAccountTypeResponse> {
    const response = await fetch(`${this.baseUrl}/api/xtb/account-type`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Valida ordine senza inviarlo (safety checks)
   */
  async validateOrder(orderData: XTBOrderRequest): Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
    isReal: boolean;
    orderData: XTBOrderRequest;
    timestamp: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/xtb/validate-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Invia ordine a XTB (demo o reale)
   */
  async placeOrder(orderData: XTBOrderRequest): Promise<XTBOrderResponse> {
    const response = await fetch(`${this.baseUrl}/api/xtb/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Errore invio ordine',
        data: errorData.data
      };
    }
    
    return response.json();
  }

  /**
   * Chiudi posizione esistente
   */
  async closePosition(positionId: number, volume?: number): Promise<XTBOrderResponse> {
    const response = await fetch(`${this.baseUrl}/api/xtb/close-position`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positionId, volume }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Errore chiusura posizione',
        data: errorData.data
      };
    }
    
    return response.json();
  }

  /**
   * Modifica ordine esistente (SL/TP)
   */
  async modifyOrder(orderId: number, stopLoss?: number, takeProfit?: number): Promise<XTBOrderResponse> {
    const response = await fetch(`${this.baseUrl}/api/xtb/modify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, stopLoss, takeProfit }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Errore modifica ordine',
        data: errorData.data
      };
    }
    
    return response.json();
  }

  /**
   * Ottieni cronologia ordini
   */
  async getOrderHistory(startDate?: string, endDate?: string): Promise<XTBOrderHistory> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `${this.baseUrl}/api/xtb/order-history${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Istanza singleton del servizio API XTB
export const xtbApi = new XTBApiService();

// Hook React per dati XTB
import { useState, useEffect } from 'react';

export const useXTBData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<XTBAccountInfo | null>(null);
  const [status, setStatus] = useState<XTBStatus | null>(null);
  const [symbols, setSymbols] = useState<{ forex: string[]; stocks: string[]; crypto: string[]; all: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadXTBData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test connessione
        const connectionStatus = await xtbApi.getStatus();
        setStatus(connectionStatus);
        setIsConnected(connectionStatus.connected);

        if (connectionStatus.connected) {
          // Carica informazioni account
          const account = await xtbApi.getAccountInfo();
          setAccountInfo(account);

          // Carica simboli disponibili
          const symbolsData = await xtbApi.getSymbols();
          setSymbols(symbolsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadXTBData();

    // Refresh ogni 30 secondi
    const interval = setInterval(loadXTBData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    accountInfo,
    status,
    symbols,
    loading,
    error,
    refetch: () => window.location.reload()
  };
};

// Hook React per Portfolio Reale con dati XTB
export const usePortfolio = () => {
  const [portfolioData, setPortfolioData] = useState<XTBBortfolioData | null>(null);
  const [positions, setPositions] = useState<XTBPosition[]>([]);
  const [performance, setPerformance] = useState<{
    totalReturn: number;
    dailyReturn: number;
    positionsCount: number;
    profitablePositions: number;
    unprofitablePositions: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verifica connessione XTB
      const isConnected = await xtbApi.testConnection();
      if (!isConnected) {
        throw new Error('XTB non connesso');
      }

      // Carica dati portfolio
      const data = await xtbApi.getPortfolio();
      setPortfolioData(data);

      // Carica posizioni
      const positionsData = await xtbApi.getPositions();
      setPositions(positionsData.positions);

      // Carica performance
      const performanceData = await xtbApi.getPortfolioPerformance();
      setPerformance(performanceData);

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento del portfolio');
      console.error('Portfolio data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();

    // Refresh automatico ogni 30 secondi
    const interval = setInterval(loadPortfolioData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    portfolioData,
    positions,
    performance,
    loading,
    error,
    lastUpdate,
    refetch: loadPortfolioData
  };
};

// Hook React per gestione ordini XTB
export const useXTBOrders = () => {
  const [accountType, setAccountType] = useState<XTBAccountTypeResponse | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica tipo account all'avvio
  useEffect(() => {
    const loadAccountType = async () => {
      try {
        const type = await xtbApi.getAccountType();
        setAccountType(type);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore verifica account type');
      }
    };

    loadAccountType();
  }, []);

  /**
   * Valida ordine prima dell'invio
   */
  const validateOrder = async (orderData: XTBOrderRequest): Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
    isReal: boolean;
  }> => {
    try {
      setError(null);
      return await xtbApi.validateOrder(orderData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore validazione ordine';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Invia ordine con safety checks
   */
  const placeOrder = async (orderData: XTBOrderRequest): Promise<XTBOrderResponse> => {
    try {
      setPlacingOrder(true);
      setError(null);

      // Prima valida l'ordine
      const validation = await validateOrder(orderData);
      
      if (!validation.valid) {
        throw new Error(`Ordine non valido: ${validation.errors.join(', ')}`);
      }

      // Mostra warning se presenti
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Warning ordine:', validation.warnings);
      }

      // Invia ordine
      const result = await xtbApi.placeOrder(orderData);
      
      if (result.success) {
        console.log('✅ Ordine inviato con successo:', result.data);
      } else {
        throw new Error(result.error || 'Errore invio ordine');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore generico invio ordine';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  /**
   * Chiudi posizione
   */
  const closePosition = async (positionId: number, volume?: number): Promise<XTBOrderResponse> => {
    try {
      setPlacingOrder(true);
      setError(null);
      return await xtbApi.closePosition(positionId, volume);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore chiusura posizione';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  /**
   * Modifica ordine
   */
  const modifyOrder = async (orderId: number, stopLoss?: number, takeProfit?: number): Promise<XTBOrderResponse> => {
    try {
      setPlacingOrder(true);
      setError(null);
      return await xtbApi.modifyOrder(orderId, stopLoss, takeProfit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore modifica ordine';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  /**
   * Carica cronologia ordini
   */
  const loadOrderHistory = async (startDate?: string, endDate?: string): Promise<XTBOrderHistory> => {
    try {
      setError(null);
      return await xtbApi.getOrderHistory(startDate, endDate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore caricamento cronologia';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    // Stato
    accountType,
    placingOrder,
    error,
    
    // Metodi
    validateOrder,
    placeOrder,
    closePosition,
    modifyOrder,
    loadOrderHistory,
    
    // Utilità
    isRealAccount: accountType?.isReal || false,
    clearError: () => setError(null),
  };
};

export default XTBApiService;