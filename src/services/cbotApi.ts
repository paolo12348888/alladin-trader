/**
 * CBOT API Service per REST endpoints
 */
import type {
  TradingStatus,
  Portfolio,
  RiskMetrics,
  Strategy,
  ChatResponse,
  BacktestParams,
  BacktestResults,
  RiskSettings,
  ChatMessage,
} from '../types/cbot';

const API_BASE_URL = import.meta.env.VITE_CBOT_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

class CbotApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Chat
  async sendChatMessage(message: string, userId: string = 'default'): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  async getChatHistory(limit: number = 50): Promise<{ history: ChatMessage[] }> {
    return this.request<{ history: ChatMessage[] }>(`/chat/history?limit=${limit}`);
  }

  // Trading Status
  async getStatus(): Promise<TradingStatus> {
    return this.request<TradingStatus>('/status');
  }

  async startTrading(): Promise<{ success: boolean; message: string }> {
    return this.request('/trading/start', { method: 'POST' });
  }

  async stopTrading(): Promise<{ success: boolean; message: string }> {
    return this.request('/trading/stop', { method: 'POST' });
  }

  // Portfolio
  async getPortfolio(): Promise<Portfolio> {
    return this.request<Portfolio>('/portfolio');
  }

  // Risk Metrics
  async getRiskMetrics(): Promise<RiskMetrics> {
    return this.request<RiskMetrics>('/risk-metrics');
  }

  async updateRiskSettings(settings: RiskSettings): Promise<{ success: boolean; message: string }> {
    return this.request('/risk-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Strategies
  async getStrategies(): Promise<{ strategies: Strategy[] }> {
    return this.request<{ strategies: Strategy[] }>('/strategies');
  }

  // Backtest
  async runBacktest(params: BacktestParams): Promise<BacktestResults> {
    return this.request<BacktestResults>('/backtest', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; trading_active: boolean; connections: number }> {
    const url = `${this.baseUrl}/health`;
    const response = await fetch(url);
    return response.json();
  }
}

export const cbotApiService = new CbotApiService();
