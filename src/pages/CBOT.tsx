/**
 * CBOT Page - Trading Chatbot Interface
 */
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CbotLeftSidebar } from '@/components/cbot/CbotLeftSidebar';
import { CbotCenterPanel } from '@/components/cbot/CbotCenterPanel';
import { cbotWsService } from '@/services/cbotWebsocket';
import { cbotApiService } from '@/services/cbotApi';
import type {
  ChatMessage,
  TradingStatus,
  Portfolio,
  RiskMetrics,
  WebSocketMessage,
} from '@/types/cbot';

// Initial states
const initialStatus: TradingStatus = {
  running: false,
  balance: 100000,
  equity: 100000,
  positions_count: 0,
  strategies_active: 0,
};

const initialPortfolio: Portfolio = {
  balance: 100000,
  equity: 100000,
  unrealized_pnl: 0,
  realized_pnl: 0,
  positions: [],
  total_value: 100000,
};

const initialRiskMetrics: RiskMetrics = {
  var_1d: 0.005,
  max_drawdown: 0,
  current_drawdown: 0,
  sharpe_ratio: 0,
  win_rate: 0,
  profit_factor: 0,
  exposure: 0,
};

export default function CBOT() {
  const [wsConnected, setWsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<TradingStatus>(initialStatus);
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(initialRiskMetrics);
  const [loading, setLoading] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        await cbotWsService.connect();
        setWsConnected(true);

        // Subscribe to updates
        cbotWsService.subscribeUpdates();

        // Load initial data
        loadInitialData();
      } catch (error) {
        console.error('Failed to connect CBOT WebSocket:', error);
        setWsConnected(false);
        // Still try to load data via REST API
        loadInitialData();
      }
    };

    initWebSocket();

    // WebSocket message handler
    const unsubscribe = cbotWsService.onMessage(handleWebSocketMessage);

    return () => {
      unsubscribe();
      cbotWsService.disconnect();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const [statusData, portfolioData, riskData, chatHistory] = await Promise.all([
        cbotApiService.getStatus(),
        cbotApiService.getPortfolio(),
        cbotApiService.getRiskMetrics(),
        cbotApiService.getChatHistory(50),
      ]);

      setStatus(statusData);
      setPortfolio(portfolioData);
      setRiskMetrics(riskData);
      setMessages(chatHistory.history);
    } catch (error) {
      console.error('Error loading initial CBOT data:', error);
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('CBOT WebSocket message:', message);

    switch (message.type) {
      case 'connected':
        setWsConnected(true);
        break;

      case 'chat_response':
        if (message.response) {
          const assistantMessage: ChatMessage = {
            timestamp: new Date().toISOString(),
            role: 'assistant',
            message: message.response.message,
            metadata: message.response.data,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        setLoading(false);
        break;

      case 'trading_update':
        if (message.data) {
          if (message.data.status) setStatus(message.data.status);
          if (message.data.portfolio) setPortfolio(message.data.portfolio);
          if (message.data.risk_metrics) setRiskMetrics(message.data.risk_metrics);
        }
        break;

      case 'status_update':
        if (message.status) {
          setStatus(message.status);
        }
        break;

      case 'command_executed':
        // Refresh data after command execution
        refreshData();
        break;

      case 'error':
        console.error('CBOT WebSocket error:', message.error);
        setLoading(false);
        break;

      default:
        break;
    }
  };

  const refreshData = async () => {
    try {
      const [statusData, portfolioData, riskData] = await Promise.all([
        cbotApiService.getStatus(),
        cbotApiService.getPortfolio(),
        cbotApiService.getRiskMetrics(),
      ]);

      setStatus(statusData);
      setPortfolio(portfolioData);
      setRiskMetrics(riskData);
    } catch (error) {
      console.error('Error refreshing CBOT data:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      timestamp: new Date().toISOString(),
      role: 'user',
      message,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Try WebSocket first, fallback to REST API
    if (wsConnected) {
      cbotWsService.sendChatMessage(message);
    } else {
      try {
        const response = await cbotApiService.sendChatMessage(message);
        const assistantMessage: ChatMessage = {
          timestamp: new Date().toISOString(),
          role: 'assistant',
          message: response.message,
          metadata: response.data,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);

        // Refresh data after command
        if (response.success) {
          refreshData();
        }
      } catch (error) {
        console.error('Error sending CBOT message:', error);
        const errorMessage: ChatMessage = {
          timestamp: new Date().toISOString(),
          role: 'assistant',
          message: 'Errore nella comunicazione con il server CBOT',
        };
        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] w-full bg-background overflow-hidden -m-8">
        {/* Left Sidebar */}
        <aside className="w-[280px] bg-card border-r border-border flex-shrink-0">
          <CbotLeftSidebar status={status} wsConnected={wsConnected} />
        </aside>

        {/* Center Panel - Full Width (no right sidebar) */}
        <main className="flex-1 bg-background">
          <CbotCenterPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            portfolio={portfolio}
            riskMetrics={riskMetrics}
            status={status}
            wsConnected={wsConnected}
          />
        </main>
      </div>
    </DashboardLayout>
  );
}
