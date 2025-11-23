/**
 * Statistical Arbitrage Component
 * Gestisce pair trading, correlation analysis, cointegration e hedge positions
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  Calculator,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Database
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

// Types per Statistical Arbitrage
export interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation_coefficient: number;
  rolling_correlation: number[];
  confidence_interval: {
    lower: number;
    upper: number;
  };
  sample_size: number;
  last_updated: string;
}

export interface CointegrationData {
  symbol1: string;
  symbol2: string;
  is_cointegrated: boolean;
  adf_statistic: number;
  p_value: number;
  critical_values: {
    '1%': number;
    '5%': number;
    '10%': number;
  };
  hedge_ratio: number;
  half_life: number;
  last_updated: string;
}

export interface SpreadAnalysis {
  symbol_pair: string;
  current_spread: number;
  mean_reversion_level: number;
  z_score: number;
  bollinger_upper: number;
  bollinger_lower: number;
  spread_history: number[];
  entry_threshold: number;
  exit_threshold: number;
  volatility: number;
  last_updated: string;
}

export interface HedgePosition {
  id: string;
  symbol_pair: string;
  long_symbol: string;
  short_symbol: string;
  long_quantity: number;
  short_quantity: number;
  hedge_ratio: number;
  entry_spread: number;
  current_spread: number;
  pnl: number;
  entry_time: string;
  status: 'OPEN' | 'CLOSED' | 'HEDGING';
  signal_strength: number;
}

export interface StatisticalArbitrageConfig {
  correlation_lookback: number;
  min_correlation_threshold: number;
  cointegration_p_value: number;
  max_half_life: number;
  entry_z_score: number;
  exit_z_score: number;
  position_size: number;
  max_positions: number;
  stop_loss: number;
  take_profit: number;
}

interface StatisticalArbitrageAlgoProps {
  className?: string;
  correlation_lookback?: number;
  min_correlation_threshold?: number;
  cointegration_p_value?: number;
  max_half_life?: number;
  entry_z_score?: number;
  exit_z_score?: number;
  position_size?: number;
  max_positions?: number;
  stop_loss?: number;
  take_profit?: number;
}

const defaultConfig: StatisticalArbitrageConfig = {
  correlation_lookback: 252,
  min_correlation_threshold: 0.7,
  cointegration_p_value: 0.05,
  max_half_life: 30,
  entry_z_score: 2.0,
  exit_z_score: 0.5,
  position_size: 10000,
  max_positions: 5,
  stop_loss: 0.05,
  take_profit: 0.03
};

export function StatisticalArbitrageAlgo({ className }: StatisticalArbitrageAlgoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<StatisticalArbitrageConfig>(defaultConfig);
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [cointegrationData, setCointegrationData] = useState<CointegrationData | null>(null);
  const [spreadAnalysis, setSpreadAnalysis] = useState<SpreadAnalysis | null>(null);
  const [hedgePositions, setHedgePositions] = useState<HedgePosition[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data per demonstration
  useEffect(() => {
    if (isRunning) {
      loadMockData();
    }
  }, [isRunning]);

  const loadMockData = () => {
    setLoading(true);
    
    setTimeout(() => {
      setCorrelationData({
        symbol1: 'EURUSD',
        symbol2: 'GBPUSD',
        correlation_coefficient: 0.85,
        rolling_correlation: [0.82, 0.84, 0.83, 0.86, 0.85, 0.87, 0.84, 0.83, 0.85, 0.86],
        confidence_interval: {
          lower: 0.79,
          upper: 0.91
        },
        sample_size: 252,
        last_updated: new Date().toISOString()
      });

      setCointegrationData({
        symbol1: 'EURUSD',
        symbol2: 'GBPUSD',
        is_cointegrated: true,
        adf_statistic: -3.45,
        p_value: 0.042,
        critical_values: {
          '1%': -3.43,
          '5%': -2.86,
          '10%': -2.57
        },
        hedge_ratio: 1.12,
        half_life: 18,
        last_updated: new Date().toISOString()
      });

      setSpreadAnalysis({
        symbol_pair: 'EURUSD/GBPUSD',
        current_spread: 0.0023,
        mean_reversion_level: 0.0020,
        z_score: 1.45,
        bollinger_upper: 0.0035,
        bollinger_lower: 0.0005,
        spread_history: [0.0018, 0.0021, 0.0025, 0.0023, 0.0020, 0.0024, 0.0022, 0.0019, 0.0023, 0.0021],
        entry_threshold: 2.0,
        exit_threshold: 0.5,
        volatility: 0.0008,
        last_updated: new Date().toISOString()
      });

      setHedgePositions([
        {
          id: 'hedge_1',
          symbol_pair: 'EURUSD/GBPUSD',
          long_symbol: 'EURUSD',
          short_symbol: 'GBPUSD',
          long_quantity: 100000,
          short_quantity: 112000,
          hedge_ratio: 1.12,
          entry_spread: 0.0032,
          current_spread: 0.0023,
          pnl: 450.75,
          entry_time: '2025-11-19T10:30:00Z',
          status: 'OPEN',
          signal_strength: 78
        },
        {
          id: 'hedge_2',
          symbol_pair: 'AUDUSD/NZDUSD',
          long_symbol: 'AUDUSD',
          short_symbol: 'NZDUSD',
          long_quantity: 50000,
          short_quantity: 52000,
          hedge_ratio: 1.04,
          entry_spread: 0.0015,
          current_spread: 0.0018,
          pnl: -125.30,
          entry_time: '2025-11-18T14:20:00Z',
          status: 'HEDGING',
          signal_strength: 45
        }
      ]);

      setLoading(false);
    }, 1000);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      loadMockData();
    }
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return { label: 'Molto Forte', color: 'bg-green-500' };
    if (abs >= 0.6) return { label: 'Forte', color: 'bg-blue-500' };
    if (abs >= 0.4) return { label: 'Moderata', color: 'bg-yellow-500' };
    return { label: 'Debole', color: 'bg-red-500' };
  };

  const getSignalStrength = (strength: number) => {
    if (strength >= 70) return { label: 'Forte', color: 'text-green-600' };
    if (strength >= 50) return { label: 'Moderata', color: 'text-yellow-600' };
    return { label: 'Debole', color: 'text-red-600' };
  };

  const correlationStrength = correlationData ? getCorrelationStrength(correlationData.correlation_coefficient) : null;
  const signal1 = hedgePositions.length > 0 ? getSignalStrength(hedgePositions[0].signal_strength) : null;
  const signal2 = hedgePositions.length > 1 ? getSignalStrength(hedgePositions[1].signal_strength) : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Statistical Arbitrage Algorithm
              </CardTitle>
              <CardDescription>
                Pair trading avanzato con correlation e cointegration analysis
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRunning ? "default" : "secondary"} className="flex items-center gap-1">
                {isRunning ? <CheckCircle className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                {isRunning ? 'Attivo' : 'In Pausa'}
              </Badge>
              <Button onClick={handleStartStop} variant={isRunning ? "destructive" : "default"}>
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Ferma' : 'Avvia'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Parametri di Configurazione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Correlazione Minima
              </label>
              <Input
                type="number"
                value={config.correlation_lookback}
                onChange={(e) => setConfig({...config, correlation_lookback: Number(e.target.value)})}
                placeholder="0.7"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                P-Value Cointegration
              </label>
              <Input
                type="number"
                value={config.cointegration_p_value}
                onChange={(e) => setConfig({...config, cointegration_p_value: Number(e.target.value)})}
                placeholder="0.05"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Entry Z-Score
              </label>
              <Input
                type="number"
                value={config.entry_z_score}
                onChange={(e) => setConfig({...config, entry_z_score: Number(e.target.value)})}
                placeholder="2.0"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Exit Z-Score
              </label>
              <Input
                type="number"
                value={config.exit_z_score}
                onChange={(e) => setConfig({...config, exit_z_score: Number(e.target.value)})}
                placeholder="0.5"
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Correlation Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {correlationData ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {correlationData.symbol1} / {correlationData.symbol2}
                  </span>
                  <Badge className={`${correlationStrength?.color} text-white`}>
                    {correlationStrength?.label}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coefficiente</span>
                    <span className="font-mono">{correlationData.correlation_coefficient.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Intervallo Confidenza</span>
                    <span className="font-mono">
                      [{correlationData.confidence_interval.lower.toFixed(3)}, {correlationData.confidence_interval.upper.toFixed(3)}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sample Size</span>
                    <span className="font-mono">{correlationData.sample_size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" />
                  <span>Aggiornato: {new Date(correlationData.last_updated).toLocaleTimeString()}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Dati di correlazione non disponibili</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cointegration Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Cointegration Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cointegrationData ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {cointegrationData.symbol1} / {cointegrationData.symbol2}
                  </span>
                  <Badge variant={cointegrationData.is_cointegrated ? "default" : "destructive"}>
                    {cointegrationData.is_cointegrated ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {cointegrationData.is_cointegrated ? 'Cointegrato' : 'Non Cointegrato'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ADF Statistic</span>
                    <span className="font-mono">{cointegrationData.adf_statistic.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">P-Value</span>
                    <span className="font-mono">{cointegrationData.p_value.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hedge Ratio</span>
                    <span className="font-mono">{cointegrationData.hedge_ratio.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Half Life</span>
                    <span className="font-mono">{cointegrationData.half_life} giorni</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" />
                  <span>Aggiornato: {new Date(cointegrationData.last_updated).toLocaleTimeString()}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Dati di cointegr non disponibili</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spread Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Spread Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spreadAnalysis ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{spreadAnalysis.symbol_pair}</span>
                  <Badge variant={Math.abs(spreadAnalysis.z_score) > spreadAnalysis.entry_threshold ? "destructive" : "secondary"}>
                    Z-Score: {spreadAnalysis.z_score.toFixed(2)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Spread Corrente</span>
                    <span className="font-mono">{spreadAnalysis.current_spread.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mean Reversion</span>
                    <span className="font-mono">{spreadAnalysis.mean_reversion_level.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volatilità</span>
                    <span className="font-mono">{(spreadAnalysis.volatility * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>BB Lower: {spreadAnalysis.bollinger_lower.toFixed(4)}</span>
                    <span>BB Upper: {spreadAnalysis.bollinger_upper.toFixed(4)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" />
                  <span>Aggiornato: {new Date(spreadAnalysis.last_updated).toLocaleTimeString()}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Analisi spread non disponibile</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">
                  {hedgePositions.filter(p => p.status === 'OPEN').length}
                </div>
                <div className="text-xs text-muted-foreground">Posizioni Aperte</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {hedgePositions.reduce((sum, p) => sum + p.pnl, 0).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">P&L Totale ($)</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {hedgePositions.map((position) => (
                <div key={position.id} className="flex items-center justify-between text-sm">
                  <span>{position.symbol_pair}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={position.pnl > 0 ? "default" : "destructive"}>
                      ${position.pnl.toFixed(0)}
                    </Badge>
                    <Badge variant="outline" className={getSignalStrength(position.signal_strength).color}>
                      {position.signal_strength}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hedge Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Hedge Positions
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Aggiorna
              </Button>
              <Badge variant="secondary">{hedgePositions.length} posizioni</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hedgePositions.length > 0 ? (
            <div className="space-y-4">
              {hedgePositions.map((position) => (
                <div key={position.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{position.symbol_pair}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(position.entry_time).toLocaleDateString()} - {position.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Signal: {position.signal_strength}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Long {position.long_symbol}</div>
                      <div className="font-mono">{position.long_quantity.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Short {position.short_symbol}</div>
                      <div className="font-mono">{position.short_quantity.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Hedge Ratio</div>
                      <div className="font-mono">{position.hedge_ratio.toFixed(3)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entry vs Current</div>
                      <div className="font-mono">
                        {position.entry_spread.toFixed(4)} → {position.current_spread.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nessuna posizione hedge attiva</p>
              <p className="text-sm">Le posizioni verranno visualizzate qui quando l'algoritmo trova opportunità</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StatisticalArbitrageAlgo;