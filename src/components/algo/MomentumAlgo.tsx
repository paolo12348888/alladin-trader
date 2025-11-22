import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  confidence: number;
  description: string;
}

interface MomentumData {
  timestamp: string;
  price: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  bbUpper: number;
  bbLower: number;
  bbMiddle: number;
  volume: number;
}

interface MomentumAlgoProps {
  symbol?: string;
  data?: MomentumData[];
  isRealTime?: boolean;
  onSignal?: (signal: 'buy' | 'sell' | 'hold') => void;
}

const MomentumAlgo: React.FC<MomentumAlgoProps> = ({
  symbol = 'EURUSD',
  data,
  isRealTime = true,
  onSignal
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [overallSignal, setOverallSignal] = useState<'buy' | 'sell' | 'hold'>('hold');
  const [confidence, setConfidence] = useState(0);

  // Mock data se non fornito
  const mockData: MomentumData[] = useMemo(() => {
    const basePrice = 1.1000;
    return Array.from({ length: 50 }, (_, i) => {
      const timestamp = new Date(Date.now() - (50 - i) * 60000).toISOString();
      const price = basePrice + Math.sin(i * 0.2) * 0.02 + (Math.random() - 0.5) * 0.01;
      const rsi = 30 + Math.random() * 40 + Math.sin(i * 0.3) * 20;
      const macd = Math.sin(i * 0.1) * 0.002;
      const macdSignal = Math.sin(i * 0.1 - 0.5) * 0.002;
      const bbUpper = price + 0.005;
      const bbLower = price - 0.005;
      const bbMiddle = price;
      
      return {
        timestamp,
        price: Number(price.toFixed(5)),
        rsi: Number(rsi.toFixed(2)),
        macd: Number(macd.toFixed(6)),
        macdSignal: Number(macdSignal.toFixed(6)),
        bbUpper: Number(bbUpper.toFixed(5)),
        bbLower: Number(bbLower.toFixed(5)),
        bbMiddle: Number(bbMiddle.toFixed(5)),
        volume: Math.floor(Math.random() * 1000000) + 500000
      };
    });
  }, []);

  const chartData = data || mockData;

  // Calcola gli indicatori tecnici
  useEffect(() => {
    const calculateIndicators = () => {
      const latest = chartData[chartData.length - 1];
      if (!latest) return;

      const indicators: TechnicalIndicator[] = [];

      // RSI Analysis
      const rsiSignal = latest.rsi > 70 ? 'sell' : latest.rsi < 30 ? 'buy' : 'neutral';
      const rsiConfidence = Math.abs(latest.rsi - 50) / 50 * 100;
      indicators.push({
        name: 'RSI',
        value: latest.rsi,
        signal: rsiSignal,
        confidence: Number(rsiConfidence.toFixed(1)),
        description: latest.rsi > 70 ? 'Ipercomprato' : latest.rsi < 30 ? 'Ipervenduto' : 'Neutrale'
      });

      // MACD Analysis
      const macdDiff = latest.macd - latest.macdSignal;
      const macdSignal = macdDiff > 0 ? 'buy' : macdDiff < 0 ? 'sell' : 'neutral';
      const macdConfidence = Math.min(Math.abs(macdDiff) * 100000, 100);
      indicators.push({
        name: 'MACD',
        value: macdDiff,
        signal: macdSignal,
        confidence: Number(macdConfidence.toFixed(1)),
        description: macdDiff > 0 ? 'Momentum rialzista' : 'Momentum ribassista'
      });

      // Bollinger Bands Analysis
      const bbPosition = (latest.price - latest.bbLower) / (latest.bbUpper - latest.bbLower);
      const bbSignal = bbPosition > 0.8 ? 'sell' : bbPosition < 0.2 ? 'buy' : 'neutral';
      const bbConfidence = Math.abs(bbPosition - 0.5) * 200;
      indicators.push({
        name: 'Bollinger',
        value: bbPosition * 100,
        signal: bbSignal,
        confidence: Number(Math.min(bbConfidence, 100).toFixed(1)),
        description: bbPosition > 0.8 ? 'Vicino alla banda superiore' : bbPosition < 0.2 ? 'Vicino alla banda inferiore' : 'Nel range normale'
      });

      setIndicators(indicators);

      // Calcola segnale complessivo
      const buySignals = indicators.filter(i => i.signal === 'buy').length;
      const sellSignals = indicators.filter(i => i.signal === 'sell').length;
      const avgConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;

      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      if (buySignals > sellSignals && buySignals >= 2) {
        signal = 'buy';
      } else if (sellSignals > buySignals && sellSignals >= 2) {
        signal = 'sell';
      }

      setOverallSignal(signal);
      setConfidence(Number(avgConfidence.toFixed(1)));

      if (onSignal) {
        onSignal(signal);
      }
    };

    calculateIndicators();
  }, [chartData, onSignal]);

  // Simula aggiornamenti in tempo reale
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setLastUpdate(new Date());
        setIsAnalyzing(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'bg-green-500';
      case 'sell': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy': return <TrendingUp className="h-4 w-4" />;
      case 'sell': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const chartConfig = {
    price: {
      label: 'Prezzo',
      color: 'hsl(var(--chart-1))',
    },
    rsi: {
      label: 'RSI',
      color: 'hsl(var(--chart-2))',
    },
    macd: {
      label: 'MACD',
      color: 'hsl(var(--chart-3))',
    },
    bbUpper: {
      label: 'BB Superiore',
      color: 'hsl(var(--chart-4))',
    },
    bbLower: {
      label: 'BB Inferiore',
      color: 'hsl(var(--chart-5))',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header con informazioni generali */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Algoritmo Momentum
              </CardTitle>
              <CardDescription>
                Analisi tecnica per {symbol} - Trend Following Strategy
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRealTime ? "default" : "secondary"}>
                {isRealTime ? "Tempo Reale" : "Statico"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastUpdate(new Date())}
                disabled={isAnalyzing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Aggiorna
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Segnali principali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Segnale Principale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getSignalColor(overallSignal)} text-white`}>
                {getSignalIcon(overallSignal)}
              </div>
              <div>
                <div className="text-xl font-bold capitalize">{overallSignal}</div>
                <div className="text-sm text-muted-foreground">
                  Confidenza: <span className={getConfidenceColor(confidence)}>{confidence}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ultimo Aggiornamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-sm">
                {lastUpdate.toLocaleTimeString('it-IT')}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isAnalyzing ? 'Analisi in corso...' : 'Dati aggiornati'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Stato Strategia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="text-sm">Attiva</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Momentum Algo v1.0
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicatori Tecnici */}
      <Card>
        <CardHeader>
          <CardTitle>Indicatori Tecnici</CardTitle>
          <CardDescription>
            Analisi dettagliata degli indicatori momentum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indicators.map((indicator) => (
              <div key={indicator.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{indicator.name}</span>
                  <Badge 
                    variant={indicator.signal === 'buy' ? 'default' : indicator.signal === 'sell' ? 'destructive' : 'secondary'}
                  >
                    {indicator.signal === 'buy' ? 'COMPRA' : indicator.signal === 'sell' ? 'VENDITA' : 'NEUTRO'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  {indicator.value.toFixed(indicator.name === 'RSI' ? 0 : indicator.name === 'Bollinger' ? 1 : 6)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {indicator.description}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${indicator.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {indicator.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grafico Prezzo con Bollinger Bands */}
      <Card>
        <CardHeader>
          <CardTitle>Analisi Prezzo con Bollinger Bands</CardTitle>
          <CardDescription>
            Prezzo corrente e bande di Bollinger per identificare i livelli di supporto/resistenza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString('it-IT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                className="text-muted-foreground"
              />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => new Date(value).toLocaleString('it-IT')}
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(5) : value,
                      chartConfig[name as keyof typeof chartConfig]?.label || name
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="bbUpper"
                stroke={chartConfig.bbUpper.color}
                fill={chartConfig.bbUpper.color}
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="bbLower"
                stroke={chartConfig.bbLower.color}
                fill={chartConfig.bbLower.color}
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartConfig.price.color}
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine 
                y={chartData[chartData.length - 1]?.bbMiddle} 
                stroke="#8884d8" 
                strokeDasharray="3 3" 
                label="BB Media"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Grafico RSI */}
      <Card>
        <CardHeader>
          <CardTitle>RSI (Relative Strength Index)</CardTitle>
          <CardDescription>
            Oscillatore momentum per identificare condizioni di ipercomprato/ipervenduto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString('it-IT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                className="text-muted-foreground"
              />
              <YAxis domain={[0, 100]} className="text-muted-foreground" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => new Date(value).toLocaleString('it-IT')}
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="rsi"
                stroke={chartConfig.rsi.color}
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine y={70} stroke="red" strokeDasharray="5 5" label="Ipercomprato" />
              <ReferenceLine y={30} stroke="green" strokeDasharray="5 5" label="Ipervenduto" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Grafico MACD */}
      <Card>
        <CardHeader>
          <CardTitle>MACD (Moving Average Convergence Divergence)</CardTitle>
          <CardDescription>
            Indicatore trend-following che mostra la relazione tra due medie mobili del prezzo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString('it-IT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                className="text-muted-foreground"
              />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => new Date(value).toLocaleString('it-IT')}
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(6) : value,
                      name
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="macd"
                stroke={chartConfig.macd.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="macdSignal"
                stroke="orange"
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Alertas e Raccomandazioni */}
      {overallSignal !== 'hold' && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              Segnale di Trading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={overallSignal === 'buy' ? 'default' : 'destructive'}>
                  {overallSignal === 'buy' ? 'SEGNALE DI ACQUISTO' : 'SEGNALE DI VENDITA'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Confidenza: {confidence}%
                </span>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {overallSignal === 'buy' 
                  ? 'L\'algoritmo momentum suggerisce una posizione long basata sull\'analisi combinata degli indicatori RSI, MACD e Bollinger Bands.'
                  : 'L\'algoritmo momentum suggerisce una posizione short basata sull\'analisi combinata degli indicatori RSI, MACD e Bollinger Bands.'
                }
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-300">
                ⚠️ Ricorda: Questa è un\'analisi algoritmica. Sempre combinare con analisi fondamentale e gestione del rischio.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MomentumAlgo;