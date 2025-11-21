/**
 * CBOT Center Chat Panel Component
 */
import { useEffect, useRef } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { CbotChatBubble } from './CbotChatBubble';
import { CbotCommandInput } from './CbotCommandInput';
import { CbotMetricCard } from './CbotMetricCard';
import { CbotStatusIndicator } from './CbotStatusIndicator';
import { ChatMessage, Portfolio, RiskMetrics, TradingStatus } from '../../types/cbot';

interface CenterPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
  portfolio: Portfolio;
  riskMetrics: RiskMetrics;
  status: TradingStatus;
  wsConnected: boolean;
}

export function CbotCenterPanel({ 
  messages, 
  onSendMessage, 
  loading = false, 
  portfolio, 
  riskMetrics,
  status,
  wsConnected
}: CenterPanelProps) {
  const profitTrend = portfolio.unrealized_pnl >= 0 ? 'positive' : 'negative';
  const drawdownCritical = riskMetrics.current_drawdown > 0.015;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">
          Chat Interfaccia Trading
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Controlla l'algoritmo tramite comandi o linguaggio naturale
        </p>
      </div>

      {/* Messages Area - Only Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="text-muted-foreground text-lg">
                Benvenuto nel Trading Chatbot
              </div>
              <div className="text-muted-foreground/70 text-sm">
                Usa /help per vedere i comandi disponibili
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <CbotChatBubble key={index} message={message} />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Status Panel - Above Performance Riepilogo */}
      <div className="border-t border-border bg-card">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Status Sistema
              </div>
              <CbotStatusIndicator
                status={wsConnected ? 'connected' : 'disconnected'}
                label={wsConnected ? 'WebSocket Connesso' : 'WebSocket Offline'}
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Algoritmo
              </div>
              <CbotStatusIndicator
                status={status.running ? 'connected' : 'disconnected'}
                label={status.running ? 'In Esecuzione' : 'Fermo'}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground font-mono">
              Balance: ${status.balance.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Posizioni: {status.positions_count}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Riepilogo Section - Separate, No Scroll */}
      <div className="border-t border-border bg-card">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Performance Riepilogo
            </h3>
            <p className="text-xs text-muted-foreground">
              Aggiornato in tempo reale
            </p>
          </div>

          {/* Portfolio and Risk Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Portfolio Metrics */}
            <CbotMetricCard
              label="Balance"
              value={`$${portfolio.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<DollarSign className="w-4 h-4" />}
              loading={loading}
            />

            <CbotMetricCard
              label="Equity"
              value={`$${portfolio.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<TrendingUp className="w-4 h-4" />}
              loading={loading}
            />

            <CbotMetricCard
              label="P&L Non Realizzato"
              value={`$${portfolio.unrealized_pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              trend={profitTrend}
              changeValue={`${((portfolio.unrealized_pnl / portfolio.balance) * 100).toFixed(2)}%`}
              loading={loading}
            />

            <CbotMetricCard
              label="Valore Totale"
              value={`$${portfolio.total_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              loading={loading}
            />
          </div>

          {/* Risk Metrics */}
          <div className="mt-6">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Metriche Rischio
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <CbotMetricCard
                label="Drawdown Corrente"
                value={`${(riskMetrics.current_drawdown * 100).toFixed(2)}%`}
                icon={<TrendingDown className="w-4 h-4" />}
                trend={drawdownCritical ? 'negative' : 'neutral'}
                critical={drawdownCritical}
                loading={loading}
              />

              <CbotMetricCard
                label="Sharpe Ratio"
                value={riskMetrics.sharpe_ratio.toFixed(2)}
                trend={riskMetrics.sharpe_ratio > 1 ? 'positive' : 'neutral'}
                loading={loading}
              />

              <CbotMetricCard
                label="Win Rate"
                value={`${(riskMetrics.win_rate * 100).toFixed(1)}%`}
                trend={riskMetrics.win_rate > 0.5 ? 'positive' : 'negative'}
                loading={loading}
              />

              <CbotMetricCard
                label="Profit Factor"
                value={riskMetrics.profit_factor.toFixed(2)}
                trend={riskMetrics.profit_factor > 1 ? 'positive' : 'negative'}
                loading={loading}
              />

              <CbotMetricCard
                label="VaR 1D"
                value={`${(riskMetrics.var_1d * 100).toFixed(2)}%`}
                icon={<AlertTriangle className="w-4 h-4" />}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Command Input */}
      <CbotCommandInput onSendMessage={onSendMessage} disabled={loading} />
    </div>
  );
}
