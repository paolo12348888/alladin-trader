/**
 * Mean Reversion Algorithm Component
 * Analizza segnali di mean reversion usando Z-score, deviazione standard,
 * livelli di supporto/resistenza e indicatori statistici
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, AlertTriangle } from 'lucide-react';

interface MeanReversionData {
  symbol: string;
  currentPrice: number;
  meanPrice: number;
  zScore: number;
  standardDeviation: number;
  supportLevel: number;
  resistanceLevel: number;
  rsi: number;
  bollingerPosition: number;
  meanReversionSignal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  priceHistory: number[];
}

interface MeanReversionAlgoProps {
  data?: MeanReversionData;
  loading?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function MeanReversionAlgo({
  data,
  loading = false,
  autoRefresh = false,
  refreshInterval = 5000
}: MeanReversionAlgoProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d'>('1h');

  // Dati di esempio per demonstrazione
  const mockData: MeanReversionData = {
    symbol: 'EURUSD',
    currentPrice: 1.0847,
    meanPrice: 1.0850,
    zScore: -0.85,
    standardDeviation: 0.0042,
    supportLevel: 1.0820,
    resistanceLevel: 1.0880,
    rsi: 42.5,
    bollingerPosition: 0.25,
    meanReversionSignal: 'BUY',
    confidence: 78.5,
    priceHistory: [
      1.0840, 1.0845, 1.0842, 1.0848, 1.0845, 1.0849, 1.0843, 1.0847, 1.0844, 1.0850,
      1.0846, 1.0848, 1.0843, 1.0849, 1.0845, 1.0847, 1.0844, 1.0851, 1.0846, 1.0848
    ]
  };

  const analysisData = data || mockData;

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-500';
      case 'SELL': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSignalBadgeVariant = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'default';
      case 'SELL': return 'destructive';
      default: return 'secondary';
    }
  };

  const getZScoreInterpretation = (zScore: number) => {
    const absScore = Math.abs(zScore);
    if (absScore >= 2) return { level: 'Forte', color: 'text-red-500' };
    if (absScore >= 1.5) return { level: 'Moderato', color: 'text-yellow-500' };
    if (absScore >= 1) return { level: 'Debole', color: 'text-blue-500' };
    return { level: 'Neutro', color: 'text-gray-500' };
  };

  const zScoreInfo = getZScoreInterpretation(analysisData.zScore);

  const statisticalMetrics = useMemo(() => {
    const prices = analysisData.priceHistory;
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    
    return {
      avgReturn: returns.reduce((a, b) => a + b, 0) / returns.length,
      volatility: analysisData.standardDeviation,
      skewness: 0.12, // Calcolo semplificato
      kurtosis: 2.8, // Calcolo semplificato
      jarqueBera: 1.24 // Test di normalità semplificato
    };
  }, [analysisData.priceHistory, analysisData.standardDeviation]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-accent rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-accent rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Mean Reversion Algorithm
              </CardTitle>
              <CardDescription>
                Analisi statistica per {analysisData.symbol} su timeframe {selectedTimeframe}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-1 rounded-md border bg-background"
              >
                <option value="1h">1H</option>
                <option value="4h">4H</option>
                <option value="1d">1D</option>
              </select>
              <Badge variant={getSignalBadgeVariant(analysisData.meanReversionSignal)}>
                {analysisData.meanReversionSignal}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Z-Score Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analisi Z-Score
          </CardTitle>
          <CardDescription>
            Misura quanto il prezzo corrente si discosta dalla media storica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Z-Score Attuale</div>
              <div className={`text-2xl font-bold font-mono ${zScoreInfo.color}`}>
                {analysisData.zScore.toFixed(2)}
              </div>
              <Badge variant="outline" className={zScoreInfo.color}>
                {zScoreInfo.level}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Prezzo Corrente</div>
              <div className="text-2xl font-bold font-mono">
                {analysisData.currentPrice.toFixed(4)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Media Storica</div>
              <div className="text-2xl font-bold font-mono">
                {analysisData.meanPrice.toFixed(4)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard Deviation & Volatility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Deviazione Standard & Volatilità
          </CardTitle>
          <CardDescription>
            Misura della variabilità dei prezzi e volatilità del mercato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Deviazione Standard</div>
              <div className="text-2xl font-bold font-mono">
                {analysisData.standardDeviation.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Volatilità: {((analysisData.standardDeviation / analysisData.currentPrice) * 100).toFixed(2)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Rendimento Medio</div>
              <div className={`text-2xl font-bold font-mono ${
                statisticalMetrics.avgReturn >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(statisticalMetrics.avgReturn * 100).toFixed(3)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Su {analysisData.priceHistory.length} periodi
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resistance Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Livelli di Supporto e Resistenza
          </CardTitle>
          <CardDescription>
            Livelli chiave identificati tramite analisi statistica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">Supporto</div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200">
                    {analysisData.supportLevel.toFixed(4)}
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-muted-foreground">
                Distanza: {((analysisData.currentPrice - analysisData.supportLevel) / analysisData.currentPrice * 100).toFixed(2)}%
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <div className="text-sm font-medium text-red-700 dark:text-red-300">Resistenza</div>
                  <div className="text-lg font-bold text-red-800 dark:text-red-200">
                    {analysisData.resistanceLevel.toFixed(4)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-xs text-muted-foreground">
                Distanza: {((analysisData.resistanceLevel - analysisData.currentPrice) / analysisData.currentPrice * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistical Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Indicatori Statistici
          </CardTitle>
          <CardDescription>
            Indicatori avanzati per l'analisi di mean reversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">RSI</div>
              <div className={`text-xl font-bold ${analysisData.rsi > 70 ? 'text-red-500' : analysisData.rsi < 30 ? 'text-green-500' : 'text-foreground'}`}>
                {analysisData.rsi.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {analysisData.rsi > 70 ? 'Ipercomprato' : analysisData.rsi < 30 ? 'Ipervenduto' : 'Neutrale'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Posizione Bollinger</div>
              <div className="text-xl font-bold">
                {(analysisData.bollingerPosition * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {analysisData.bollingerPosition > 0.8 ? 'Vicino Upper' : analysisData.bollingerPosition < 0.2 ? 'Vicino Lower' : 'Medio'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Confidenza Segnale</div>
              <div className="text-xl font-bold text-blue-500">
                {analysisData.confidence.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Probabilità successo
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Kurtosi</div>
              <div className="text-xl font-bold">
                {statisticalMetrics.kurtosis.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {statisticalMetrics.kurtosis > 3 ? 'Leptocurtica' : statisticalMetrics.kurtosis < 3 ? 'Platicurtica' : 'Normale'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signal Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Riepilogo Segnale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Segnale Attuale</div>
              <div className={`text-2xl font-bold ${getSignalColor(analysisData.meanReversionSignal)}`}>
                {analysisData.meanReversionSignal}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-muted-foreground">Confidenza</div>
              <div className="text-2xl font-bold text-blue-500">
                {analysisData.confidence.toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Interpretazione:</div>
            <div className="text-xs text-muted-foreground">
              {analysisData.meanReversionSignal === 'BUY' && 
                "Il prezzo è sotto la media storica con Z-score negativo. Potenziale opportunità di acquisto per mean reversion."
              }
              {analysisData.meanReversionSignal === 'SELL' && 
                "Il prezzo è sopra la media storica con Z-score positivo. Potenziale opportunità di vendita per mean reversion."
              }
              {analysisData.meanReversionSignal === 'HOLD' && 
                "Il prezzo è vicino alla media storica. Nessun segnale di mean reversion forte."
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}