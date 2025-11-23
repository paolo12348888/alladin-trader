/**
 * Hedge Fund Algo Trading Page
 * Pagina principale per il controllo degli algoritmi di trading automatico
 */
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Bot,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Pause,
  Play,
  Square,
  RefreshCw,
  Settings,
  Target,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { AlgoStatus, TradingSignal, ExecutionOrder, Portfolio, RiskMetrics } from "@/types/hedgeFund";
import { BudgetConfig } from "@/components/BudgetConfig";
import type { CapitalSettings, CapitalManager } from "@/services/CapitalManager";
import { CapitalManager as CapitalManagerClass } from "@/services/CapitalManager";
import { XTBApiService } from "@/services/xtbApi";

export default function HedgeFundAlgo() {
  const [algoStatuses, setAlgoStatuses] = useState<AlgoStatus[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [recentSignals, setRecentSignals] = useState<TradingSignal[]>([]);
  const [recentOrders, setRecentOrders] = useState<ExecutionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [capitalSettings, setCapitalSettings] = useState<CapitalSettings | null>(null);
  const [capitalManager, setCapitalManager] = useState<CapitalManager | null>(null);

  useEffect(() => {
    // Simulate API call - replace with actual backend integration
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Inizializza CapitalManager con modalità demo automatica
      const demoService = new XTBApiService();
      const manager = new CapitalManagerClass(demoService);
      setCapitalManager(manager);

      // Impostazioni di default per testare con €100
      const defaultSettings: CapitalSettings = {
        totalAvailableCapital: 100,
        riskTolerance: 0.02, // 2% rischio per trade
        maxDrawdown: 0.05, // 5% drawdown massimo
        emergencyStopLevel: 0.10, // stop al 10% di perdita
        algorithmsAllocation: [
          {
            algorithmId: 'momentum',
            algorithmName: 'Momentum Strategy',
            allocatedCapital: 25,
            usedCapital: 0,
            availableCapital: 25,
            maxPositionSize: 10,
            riskPercentage: 25,
            isActive: true
          },
          {
            algorithmId: 'mean-reversion',
            algorithmName: 'Mean Reversion',
            allocatedCapital: 20,
            usedCapital: 0,
            availableCapital: 20,
            maxPositionSize: 10,
            riskPercentage: 20,
            isActive: true
          },
          {
            algorithmId: 'statistical-arbitrage',
            algorithmName: 'Statistical Arbitrage',
            allocatedCapital: 15,
            usedCapital: 0,
            availableCapital: 15,
            maxPositionSize: 8,
            riskPercentage: 15,
            isActive: true
          },
          {
            algorithmId: 'vwap',
            algorithmName: 'VWAP Strategy',
            allocatedCapital: 20,
            usedCapital: 0,
            availableCapital: 20,
            maxPositionSize: 10,
            riskPercentage: 20,
            isActive: true
          },
          {
            algorithmId: 'twap',
            algorithmName: 'TWAP Strategy',
            allocatedCapital: 15,
            usedCapital: 0,
            availableCapital: 15,
            maxPositionSize: 8,
            riskPercentage: 15,
            isActive: true
          },
          {
            algorithmId: 'iceberg',
            algorithmName: 'Iceberg Strategy',
            allocatedCapital: 5,
            usedCapital: 0,
            availableCapital: 5,
            maxPositionSize: 3,
            riskPercentage: 5,
            isActive: false
          }
        ]
      };

      // Inizializza il capitale
      await manager.initializeCapital(defaultSettings);
      setCapitalSettings(defaultSettings);

      // Crea portfolio reale basato sui dati XTB
      const accountInfo = await manager.getCurrentCapital();
      const realPortfolio: Portfolio = {
        balance: accountInfo.balance,
        total_equity: accountInfo.equity,
        unrealized_pnl: 0, // In modalità demo nessuna posizione aperta
        realized_pnl: 0,  // In modalità demo nessun profitto realizzato
        positions: [],
        total_value: accountInfo.equity,
        margin_used: 0,
        margin_available: accountInfo.freeMargin,
        margin_level: 0,
        open_positions_count: 0,
        max_single_position_percent: Math.max(...defaultSettings.algorithmsAllocation.map(a => a.riskPercentage)),
        sector_exposure: {}, // Vuoto in modalità demo
        last_update: new Date().toISOString(),
      };

      setPortfolio(realPortfolio);

      console.log(`💰 Portfolio inizializzato con capitale reale: €${accountInfo.equity.toFixed(2)}`);
      console.log(`✅ Modalità demo attivata con successo!`);

      // Mock algo statuses (manteniamo quelli esistenti per ora)
      const mockAlgoStatuses: AlgoStatus[] = [
        {
          id: "algo-1",
          name: "VWAP Strategy",
          status: "ACTIVE",
          last_execution: new Date().toISOString(),
          total_pnl: 0, // Azzerato per modalità demo
          trades_count: 0,
          success_rate: 0,
          avg_execution_time: 234,
          config: { timeframe: "5m", risk_level: "medium" },
        },
        {
          id: "algo-2", 
          name: "TWAP Strategy",
          status: "ACTIVE",
          last_execution: new Date().toISOString(),
          total_pnl: 0,
          trades_count: 0,
          success_rate: 0,
          avg_execution_time: 156,
          config: { timeframe: "1h", risk_level: "low" },
        },
        {
          id: "algo-3",
          name: "Iceberg Strategy", 
          status: "PAUSED",
          last_execution: new Date(Date.now() - 3600000).toISOString(),
          total_pnl: 0,
          trades_count: 0,
          success_rate: 0,
          avg_execution_time: 189,
          config: { timeframe: "15m", risk_level: "high" },
        },
        {
          id: "algo-4",
          name: "Momentum Strategy",
          status: "ERROR",
          last_execution: new Date(Date.now() - 7200000).toISOString(),
          total_pnl: 0,
          trades_count: 0,
          success_rate: 0,
          avg_execution_time: 98,
          config: { timeframe: "1m", risk_level: "medium" },
          error_message: "Connection timeout with market data provider",
        },
      ];

      // Mock risk metrics
      const mockRiskMetrics: RiskMetrics = {
        var_1d_95: 2.84,
        var_1d_99: 4.12,
        max_drawdown: 8.45,
        current_drawdown: 2.31,
        sharpe_ratio: 1.25,
        sortino_ratio: 1.89,
        win_rate: 67.3,
        profit_factor: 1.45,
        total_exposure: 89.2,
        portfolio_beta: 1.08,
        expected_shortfall: 3.95,
        daily_volatility: 1.23,
        annualized_volatility: 19.5,
        calmar_ratio: 2.34,
        information_ratio: 0.78,
        tracking_error: 4.12,
        last_calculated: new Date().toISOString(),
      };

      // Mock recent signals
      const mockSignals: TradingSignal[] = [
        {
          id: "signal-1",
          symbol: "EURUSD",
          action: "BUY",
          target_price: 1.0845,
          volume: 100000,
          order_type: "MARKET",
          timestamp: new Date().toISOString(),
          confidence: 78.5,
          timeframe: "5m",
          source_algo: "VWAP Strategy",
          stop_loss: 1.0825,
          take_profit: 1.0865,
        },
        {
          id: "signal-2", 
          symbol: "GBPUSD",
          action: "SELL",
          target_price: 1.2678,
          volume: 75000,
          order_type: "LIMIT",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          confidence: 82.1,
          timeframe: "15m",
          source_algo: "TWAP Strategy",
          stop_loss: 1.2698,
          take_profit: 1.2658,
        },
      ];

      // Mock recent orders
      const mockOrders: ExecutionOrder[] = [
        {
          id: "order-1",
          signal_id: "signal-1",
          symbol: "EURUSD",
          side: "BUY",
          quantity: 100000,
          order_type: "MARKET",
          status: "FILLED",
          filled_quantity: 100000,
          average_price: 1.0847,
          commission: 2.50,
          created_at: new Date().toISOString(),
          filled_at: new Date(Date.now() - 120000).toISOString(),
          broker_order_id: "BRK-001-ORD-001",
        },
        {
          id: "order-2",
          signal_id: "signal-2", 
          symbol: "GBPUSD",
          side: "SELL",
          quantity: 75000,
          limit_price: 1.2678,
          order_type: "LIMIT",
          status: "PENDING",
          filled_quantity: 0,
          commission: 2.00,
          created_at: new Date(Date.now() - 300000).toISOString(),
          broker_order_id: "BRK-001-ORD-002",
        },
      ];

      setAlgoStatuses(mockAlgoStatuses);
      setRiskMetrics(mockRiskMetrics);
      setRecentSignals(mockSignals);
      setRecentOrders(mockOrders);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Errore durante il caricamento dei dati:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: AlgoStatus["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500 text-white";
      case "PAUSED":
        return "bg-yellow-500 text-white";
      case "STOPPED":
        return "bg-gray-500 text-white";
      case "ERROR":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: AlgoStatus["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <Play className="h-4 w-4" />;
      case "PAUSED":
        return <Pause className="h-4 w-4" />;
      case "STOPPED":
        return <Square className="h-4 w-4" />;
      case "ERROR":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const handleAlgoAction = (algoId: string, action: "start" | "pause" | "stop") => {
    console.log(`${action} algo ${algoId}`);
    // Implement actual API call here
  };

  const handleEmergencyStop = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      // Stop all algorithms
      setAlgoStatuses(prev => prev.map(algo => ({ ...algo, status: "STOPPED" })));
    }
  };

  const statCards = [
    {
      title: "Total P&L",
      value: portfolio ? `€${(portfolio.realized_pnl + portfolio.unrealized_pnl).toLocaleString()}` : "—",
      icon: DollarSign,
      description: "Realized + Unrealized",
      trend: (portfolio && (portfolio.realized_pnl + portfolio.unrealized_pnl) > 0) ? "up" : "down",
    },
    {
      title: "Active Algorithms",
      value: algoStatuses.filter(a => a.status === "ACTIVE").length.toString(),
      icon: Bot,
      description: "Running strategies",
      trend: "neutral",
    },
    {
      title: "Portfolio VaR (95%)",
      value: riskMetrics ? `${riskMetrics.var_1d_95.toFixed(2)}%` : "—",
      icon: Shield,
      description: "Daily risk exposure",
      trend: "neutral",
    },
    {
      title: "Win Rate",
      value: riskMetrics ? `${riskMetrics.win_rate.toFixed(1)}%` : "—",
      icon: Target,
      description: "Successful trades",
      trend: (riskMetrics && riskMetrics.win_rate > 50) ? "up" : "down",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Hedge Fund Algo Trading
            </h1>
            <p className="text-muted-foreground">
              Controllo centralizzato degli algoritmi di trading automatico
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={emergencyMode ? "destructive" : "outline"}
              size="sm"
              onClick={handleEmergencyStop}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {emergencyMode ? "Emergency Mode Active" : "Emergency Stop"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {emergencyMode && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>MODALITÀ EMERGENZA ATTIVA</strong> - Tutti gli algoritmi sono stati fermati per sicurezza.
            </AlertDescription>
          </Alert>
        )}

        {/* Live Trading Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Algorithm Controls */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Algorithm Controls
            </CardTitle>
            <CardDescription>
              Gestione e controllo degli algoritmi di trading attivi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {algoStatuses.map((algo) => (
                <div key={algo.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(algo.status)}`}>
                      {getStatusIcon(algo.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{algo.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>P&L: €{algo.total_pnl.toLocaleString()}</span>
                        <span>Trades: {algo.trades_count}</span>
                        <span>Success Rate: {algo.success_rate}%</span>
                        <span>Last: {algo.last_execution ? new Date(algo.last_execution).toLocaleTimeString() : "Never"}</span>
                      </div>
                      {algo.error_message && (
                        <p className="text-xs text-red-500 mt-1">{algo.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(algo.status)}>
                      {algo.status}
                    </Badge>
                    {algo.status === "STOPPED" || algo.status === "ERROR" ? (
                      <Button
                        size="sm"
                        onClick={() => handleAlgoAction(algo.id, "start")}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    ) : algo.status === "ACTIVE" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlgoAction(algo.id, "pause")}
                        className="gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAlgoAction(algo.id, "start")}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAlgoAction(algo.id, "stop")}
                      className="gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Risk Metrics
              </CardTitle>
              <CardDescription>
                Analisi del rischio e metriche di performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskMetrics && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">VaR (1 giorno, 95%)</span>
                    <span className="font-medium text-foreground">{riskMetrics.var_1d_95.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">VaR (1 giorno, 99%)</span>
                    <span className="font-medium text-foreground">{riskMetrics.var_1d_99.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium text-foreground">{riskMetrics.sharpe_ratio.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sortino Ratio</span>
                    <span className="font-medium text-foreground">{riskMetrics.sortino_ratio?.toFixed(2) || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium text-foreground">{riskMetrics.max_drawdown.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Drawdown</span>
                    <span className="font-medium text-foreground">{riskMetrics.current_drawdown.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Calmar Ratio</span>
                    <span className="font-medium text-foreground">{riskMetrics.calmar_ratio?.toFixed(2) || "N/A"}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Portfolio Overview
              </CardTitle>
              <CardDescription>
                Stato attuale del portafoglio e delle posizioni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolio && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Equity</span>
                    <span className="font-medium text-foreground">€{portfolio.total_equity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unrealized P&L</span>
                    <span className={`font-medium ${portfolio.unrealized_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      €{portfolio.unrealized_pnl.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Realized P&L</span>
                    <span className={`font-medium ${portfolio.realized_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      €{portfolio.realized_pnl.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Open Positions</span>
                    <span className="font-medium text-foreground">{portfolio.open_positions_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Margin Level</span>
                    <span className="font-medium text-foreground">{portfolio.margin_level.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Exposure</span>
                    <span className="font-medium text-foreground">{riskMetrics?.total_exposure.toFixed(1) || "N/A"}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Signals and Orders */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recent Trading Signals
              </CardTitle>
              <CardDescription>
                Ultimi segnali generati dagli algoritmi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSignals.map((signal) => (
                  <div key={signal.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${signal.action === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {signal.action === 'BUY' ? (
                          <TrendingUp className="h-3 w-3 text-white" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{signal.symbol}</p>
                        <p className="text-xs text-muted-foreground">{signal.source_algo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {signal.action} {signal.volume.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{signal.target_price} • {signal.confidence}% confidence
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Ordini recenti inviati ai broker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${
                        order.status === 'FILLED' ? 'bg-green-500' : 
                        order.status === 'PENDING' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}>
                        {order.status === 'FILLED' ? (
                          <CheckCircle className="h-3 w-3 text-white" />
                        ) : order.status === 'PENDING' ? (
                          <Clock className="h-3 w-3 text-white" />
                        ) : (
                          <XCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.side} {order.quantity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {order.average_price ? `€${order.average_price}` : 'Market'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.status} • {order.broker_order_id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capital Management */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Gestione Capitale
            </CardTitle>
            <CardDescription>
              Configura il budget e i limiti di rischio per ogni algoritmo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetConfig onSettingsChange={setCapitalSettings} />
          </CardContent>
        </Card>

        {/* Sector Exposure */}
        {portfolio?.sector_exposure && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Sector Exposure</CardTitle>
              <CardDescription>
                Distribuzione dell'esposizione per settore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(portfolio.sector_exposure).map(([sector, exposure]) => (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{sector}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${exposure}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-12 text-right">
                        {exposure.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}