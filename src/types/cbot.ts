/**
 * Type Definitions per Trading Chatbot (CBOT)
 */

export interface TradingStatus {
  running: boolean;
  last_update?: string;
  balance: number;
  equity: number;
  positions_count: number;
  strategies_active: number;
  uptime_seconds?: number;
  message?: string;
}

export interface Position {
  id: string;
  symbol: string;
  position_type: 'LONG' | 'SHORT' | 'FLAT';
  entry_price: number;
  current_price: number;
  quantity: number;
  entry_time: string;
  stop_loss: number;
  take_profit: number;
  strategy: string;
  unrealized_pnl: number;
  realized_pnl: number;
}

export interface Portfolio {
  balance: number;
  equity: number;
  unrealized_pnl: number;
  realized_pnl: number;
  positions: Position[];
  total_value: number;
}

export interface RiskMetrics {
  var_1d: number;
  max_drawdown: number;
  current_drawdown: number;
  sharpe_ratio: number;
  win_rate: number;
  profit_factor: number;
  exposure: number;
  expected_shortfall?: number;
  volatility_1d?: number;
}

export interface Strategy {
  name: string;
  active: boolean;
  signals_count: number;
  performance: number;
}

export interface ChatMessage {
  timestamp: string;
  role: 'user' | 'assistant';
  message: string;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  command?: string;
  data?: any;
}

export interface WebSocketMessage {
  type: 'connected' | 'chat_message' | 'chat_response' | 'trading_update' | 
        'status_update' | 'command_executed' | 'error' | 'pong';
  timestamp?: string;
  message?: string;
  sender?: string;
  response?: ChatResponse;
  data?: any;
  status?: TradingStatus;
  client_id?: string;
  error?: string;
}

export interface BacktestParams {
  start_date?: string;
  end_date?: string;
  initial_capital?: number;
  symbols?: string[];
}

export interface BacktestResults {
  success: boolean;
  message?: string;
  results?: {
    total_return: number;
    sharpe_ratio: number;
    max_drawdown: number;
    win_rate: number;
    total_trades: number;
  };
}

export interface RiskSettings {
  max_risk_per_trade?: number;
  drawdown_limit?: number;
  max_positions?: number;
  circuit_breaker?: number;
}

export interface EquityDataPoint {
  timestamp: string;
  value: number;
  drawdown?: number;
}
