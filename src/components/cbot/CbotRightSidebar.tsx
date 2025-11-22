/**
 * CBOT Right Sidebar Component - Performance Metrics
 */
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { CbotMetricCard } from './CbotMetricCard';
import { Portfolio, RiskMetrics } from '../../types/cbot';

interface RightSidebarProps {
  portfolio: Portfolio;
  riskMetrics: RiskMetrics;
  loading?: boolean;
}

export function CbotRightSidebar({ portfolio, riskMetrics, loading = false }: RightSidebarProps) {
  const profitTrend = portfolio.unrealized_pnl >= 0 ? 'positive' : 'negative';
  const drawdownCritical = riskMetrics.current_drawdown > 0.015;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Performance Riepilogo
        </h3>
        <p className="text-xs text-muted-foreground">
          Aggiornato in tempo reale
        </p>
      </div>

      {/* Portfolio Metrics */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Portfolio
        </div>
        
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
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Metriche Rischio
        </div>

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
  );
}
