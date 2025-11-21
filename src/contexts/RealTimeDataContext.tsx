import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Definizione dei tipi
interface PriceData {
  [ticker: string]: number;
}

interface RealTimeDataContextType {
  prices: PriceData;
  isConnected: boolean;
}

// Creazione del Context
const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

// Provider del Context
export const RealTimeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Dati iniziali realistici per quando WebSocket non è disponibile
  const INITIAL_PRICES: PriceData = {
    EURUSD: 1.0823,
    GBPUSD: 1.2645,
    USDJPY: 149.82,
    GOLD: 2018.45,
    OIL: 78.34,
    US500: 4567.89,
    BITCOIN: 67845.67,
    ETHEREUM: 3789.34,
    AAPL: 178.45,
    AMZN: 156.78,
    GOOGL: 142.67,
    MSFT: 378.23,
    TSLA: 245.67,
  };

  const [prices, setPrices] = useState<PriceData>(INITIAL_PRICES);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ottieni l'URL del backend dalla variabile d'ambiente
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    let wsUrl: string;
    
    if (backendUrl) {
      // Se c'è un URL backend configurato, usa quello (convertendo http/https in ws/wss)
      wsUrl = backendUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    } else {
      // Altrimenti usa localhost (sviluppo locale)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname || 'localhost';
      const port = '3000';
      wsUrl = `${protocol}//${host}:${port}`;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      toast.success('Real-Time Data Feed Connected', { description: 'Asset prices are now updating every second.' });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'INITIAL_DATA' || message.type === 'PRICE_UPDATE') {
          setPrices(prevPrices => ({
            ...prevPrices,
            ...message.data,
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Mantieni i dati iniziali quando WebSocket si disconnette
      toast.error('Real-Time Data Feed Disconnected', { description: 'Using fallback data. Check connection.' });
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
      // Mantieni i dati iniziali quando c'è errore
      toast.error('Real-Time Data Feed Error', { description: 'Using fallback data. Check console for details.' });
    };

    // Fallback timer per aggiornare i prezzi ogni 30 secondi quando WebSocket non disponibile
    const fallbackInterval = setInterval(() => {
      if (!isConnected) {
        setPrices(prevPrices => {
          const updatedPrices: PriceData = {};
          
          Object.entries(prevPrices).forEach(([ticker, oldPrice]) => {
            // Aggiungi piccole variazioni realistiche (0.1% max)
            const variation = (Math.random() - 0.5) * 0.002;
            updatedPrices[ticker] = oldPrice * (1 + variation);
          });
          
          return updatedPrices;
        });
      }
    }, 30000);

    // Cleanup function
    return () => {
      ws.close();
      clearInterval(fallbackInterval);
    };
  }, [isConnected]);

  return (
    <RealTimeDataContext.Provider value={{ prices, isConnected }}>
      {children}
    </RealTimeDataContext.Provider>
  );
};

// Hook personalizzato per l'utilizzo del Context
export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (context === undefined) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};
