import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, TrendingUp, TrendingDown, Zap, Clock, CheckCircle2, AlertCircle, Volume2, Activity } from "lucide-react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries } from "lightweight-charts";
import { toast } from "sonner";
import { useXTBData } from "@/services/xtbApi";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { analyzeTradingSignals, isOpenAIConfigured } from "@/services/openaiService";
import { useRealTimeChart } from "@/hooks/useRealTimeChart";

interface Signal {
  id: string;
  asset: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  timestamp: Date;
  status: "pending" | "active" | "closed";
  profitLoss?: number;
  aiModel: string;
  description: string;
}

// XTB Symbol mapping
const symbolMap: Record<string, string> = {
  EURUSD: "EURUSD",
  GBPUSD: "GBPUSD",
  BTC: "BITCOIN",
  ETH: "ETHEREUM",
  AAPL: "APPLE.US_9",
  MSFT: "MICROSOFT.US_9",
  GOOGL: "ALPHABET.US_9",
  TSLA: "TESLA.US_9",
};

// Genera segnali mock
const generateMockSignals = (): Signal[] => {
  const assets = ["EURUSD", "GBPUSD", "BTC", "ETH", "AAPL", "MSFT"];
  const signals: Signal[] = [];

  for (let i = 0; i < 5; i++) {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const direction = Math.random() > 0.5 ? "LONG" : "SHORT";
    const entryPrice = Math.random() * 100 + 50;
    const targetPrice = direction === "LONG" ? entryPrice * 1.05 : entryPrice * 0.95;
    const stopLoss = direction === "LONG" ? entryPrice * 0.97 : entryPrice * 1.03;
    const confidence = Math.floor(Math.random() * 30) + 70;

    signals.push({
      id: `SIG_${Date.now()}_${i}`,
      asset,
      direction,
      entryPrice,
      targetPrice,
      stopLoss,
      confidence,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
      status: i === 0 ? "active" : i < 3 ? "pending" : "closed",
      profitLoss: i >= 3 ? (Math.random() - 0.5) * 500 : undefined,
      aiModel: ["LSTM", "XGBoost", "LightGBM"][Math.floor(Math.random() * 3)],
      description: `${direction} signal based on technical analysis and market sentiment`,
    });
  }

  return signals;
};

export default function SignalRoom() {
  const { t } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [signals, setSignals] = useState<Signal[]>(generateMockSignals());
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(signals[0] || null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [filterDirection, setFilterDirection] = useState<"ALL" | "LONG" | "SHORT">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "pending" | "active" | "closed">("ALL");
  const [enableStreaming, setEnableStreaming] = useState(true);

  // Hook per dati real-time da XTB
  const xtbSymbol = selectedSignal ? (symbolMap[selectedSignal.asset] || "EURUSD") : "EURUSD";
  const { 
    candles, 
    loading: chartLoading, 
    error: chartError,
    lastUpdate,
    isStreaming 
  } = useRealTimeChart({
    symbol: xtbSymbol,
    timeframe: "H1",
    count: 100,
    enableRealTime: enableStreaming,
  });

  // Filtra i segnali
  const filteredSignals = signals.filter((sig) => {
    const directionMatch = filterDirection === "ALL" || sig.direction === filterDirection;
    const statusMatch = filterStatus === "ALL" || sig.status === filterStatus;
    return directionMatch && statusMatch;
  });

  // Genera un nuovo segnale usando OpenAI con indicatori reali da XTB
  const handleGenerateSignal = async () => {
    if (!isOpenAIConfigured()) {
      toast.error("OpenAI API key non configurata. Usa segnali mock.");
      // Fallback to mock signal generation
      generateMockSignal();
      return;
    }

    try {
      toast.info("Generazione segnale AI in corso...");
      
      const assets = ["EURUSD", "GBPUSD", "BTC", "ETH", "AAPL", "MSFT", "GOOGL", "TSLA"];
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const xtbSymbol = symbolMap[asset] || "EURUSD";

      // Recupera indicatori tecnici REALI dal backend XTB
      let technicalIndicators: any;
      let entryPrice: number;
      
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      try {
        const indicatorsResponse = await fetch(`${API_BASE_URL}/api/xtb/indicators/${xtbSymbol}`);
        if (!indicatorsResponse.ok) throw new Error('Backend error');
        
        const indicatorsData = await indicatorsResponse.json();
        technicalIndicators = {
          rsi: indicatorsData.indicators.rsi,
          macd: indicatorsData.indicators.macd.histogram,
          sma_20: indicatorsData.indicators.sma20,
          sma_50: indicatorsData.indicators.sma50,
          volume: indicatorsData.candles[indicatorsData.candles.length - 1]?.volume || 0,
          volatility: indicatorsData.indicators.atr,
          bollinger_upper: indicatorsData.indicators.bollingerBands.upper,
          bollinger_lower: indicatorsData.indicators.bollingerBands.lower,
        };
        entryPrice = indicatorsData.currentPrice;
      } catch (error) {
        console.error('Errore recupero indicatori reali, uso mock:', error);
        // Fallback a indicatori mock se il backend non risponde
        entryPrice = Math.random() * 100 + 50;
        technicalIndicators = {
          rsi: Math.random() * 100,
          macd: (Math.random() - 0.5) * 10,
          sma_20: entryPrice * (1 + (Math.random() - 0.5) * 0.05),
          sma_50: entryPrice * (1 + (Math.random() - 0.5) * 0.08),
          volume: Math.random() * 1000000,
          volatility: Math.random() * 0.05,
        };
      }

      // Determina condizioni di mercato dai dati reali
      const marketConditions = {
        trend: technicalIndicators.sma_20 > technicalIndicators.sma_50 ? "bullish" : "bearish",
        volatility: technicalIndicators.volatility > 0.03 ? "high" : technicalIndicators.volatility > 0.01 ? "medium" : "low",
        volume: "normal",
      };

      // Chiamata REALE all'API OpenAI per l'analisi
      const aiAnalysis = await analyzeTradingSignals(asset, technicalIndicators, marketConditions);

      const direction = aiAnalysis.signal === "buy" ? "LONG" : aiAnalysis.signal === "sell" ? "SHORT" : (Math.random() > 0.5 ? "LONG" : "SHORT");
      const targetPrice = direction === "LONG" ? entryPrice * 1.05 : entryPrice * 0.95;
      const stopLoss = direction === "LONG" ? entryPrice * 0.97 : entryPrice * 1.03;

      const newSignal: Signal = {
        id: `SIG_${Date.now()}`,
        asset,
        direction,
        entryPrice: parseFloat(entryPrice.toFixed(2)),
        targetPrice: parseFloat(targetPrice.toFixed(2)),
        stopLoss: parseFloat(stopLoss.toFixed(2)),
        confidence: Math.round(aiAnalysis.strength),
        timestamp: new Date(),
        status: "pending",
        aiModel: "GPT-4 (OpenAI)",
        description: aiAnalysis.reasoning || `${direction} signal based on AI analysis`,
      };

      setSignals([newSignal, ...signals]);
      setSelectedSignal(newSignal);

      if (notificationsEnabled) {
        toast.success(`🔔 Nuovo segnale AI ${direction} per ${asset}! (Confidence: ${aiAnalysis.strength}%)`);
      }
    } catch (error) {
      console.error("Errore generazione segnale AI:", error);
      toast.error("Errore generazione segnale AI, uso segnale mock");
      generateMockSignal();
    }
  };

  // Funzione di fallback per segnali mock
  const generateMockSignal = () => {
    const assets = ["EURUSD", "GBPUSD", "BTC", "ETH", "AAPL", "MSFT", "GOOGL", "TSLA"];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const direction = Math.random() > 0.5 ? "LONG" : "SHORT";
    const entryPrice = Math.random() * 100 + 50;
    const targetPrice = direction === "LONG" ? entryPrice * 1.05 : entryPrice * 0.95;
    const stopLoss = direction === "LONG" ? entryPrice * 0.97 : entryPrice * 1.03;
    const confidence = Math.floor(Math.random() * 30) + 70;

    const newSignal: Signal = {
      id: `SIG_${Date.now()}`,
      asset,
      direction,
      entryPrice,
      targetPrice,
      stopLoss,
      confidence,
      timestamp: new Date(),
      status: "pending",
      aiModel: ["LSTM", "XGBoost", "LightGBM"][Math.floor(Math.random() * 3)],
      description: `${direction} signal based on technical analysis (mock data)`,
    };

    setSignals([newSignal, ...signals]);
    setSelectedSignal(newSignal);

    if (notificationsEnabled) {
      toast.success(`🔔 Nuovo segnale ${direction} per ${asset}!`);
    }
  };

  // Attiva un segnale
  const handleActivateSignal = (signalId: string) => {
    setSignals(
      signals.map((sig) => {
        if (sig.id === signalId) {
          return { ...sig, status: "active" };
        }
        return sig;
      })
    );
    toast.success("Segnale attivato!");
  };

  // Chiudi un segnale
  const handleCloseSignal = (signalId: string, profitLoss: number) => {
    setSignals(
      signals.map((sig) => {
        if (sig.id === signalId) {
          return { ...sig, status: "closed", profitLoss };
        }
        return sig;
      })
    );
    toast.success(`Segnale chiuso con P&L: ${profitLoss > 0 ? "+" : ""}${profitLoss.toFixed(2)}`);
  };

  // Inizializza il grafico
  useEffect(() => {
    if (!chartContainerRef.current || !selectedSignal) return;

    const isDarkMode = document.documentElement.classList.contains("dark");
    const backgroundColor = isDarkMode ? "#0a0a0a" : "#ffffff";
    const textColor = isDarkMode ? "#e5e5e5" : "#171717";
    const borderColor = isDarkMode ? "#262626" : "#e5e5e5";
    const successColor = "#22c55e";
    const destructiveColor = "#ef4444";

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: backgroundColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: borderColor },
        horzLines: { color: borderColor },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: successColor,
      downColor: destructiveColor,
      borderVisible: false,
      wickUpColor: successColor,
      wickDownColor: destructiveColor,
    });

    seriesRef.current = candlestickSeries;

    // Usa dati reali se disponibili
    if (candles.length > 0) {
      candlestickSeries.setData(candles);
      chart.timeScale().fitContent();
    }

    // Nota: I marker non sono supportati nella nuova API v5 di lightweight-charts
    // Possono essere aggiunti come overlay personalizzati se necessario

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [selectedSignal]);

  // Aggiorna grafico quando arrivano nuovi dati
  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles);
    }
  }, [candles]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" /> {t("Signal Room")}
          </h1>
          <p className="text-muted-foreground">
            {t("Real-time AI trading signals with entry, target, and stop loss levels")}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Signal Controls")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Generate Signal Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleGenerateSignal}>
                <Zap className="h-4 w-4 mr-2" /> Genera Segnale
              </Button>
            </div>

            {/* Filter Direction */}
            <div className="space-y-2">
              <Label htmlFor="direction-filter">{t("Direction")}</Label>
              <div className="flex gap-2">
                {["ALL", "LONG", "SHORT"].map((dir) => (
                  <Button
                    key={dir}
                    size="sm"
                    variant={filterDirection === dir ? "default" : "outline"}
                    onClick={() => setFilterDirection(dir as "ALL" | "LONG" | "SHORT")}
                  >
                    {dir}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filter Status */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">{t("Status")}</Label>
              <div className="flex gap-2">
                {["ALL", "pending", "active", "closed"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status as "ALL" | "pending" | "active" | "closed")}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full"
                variant={notificationsEnabled ? "default" : "outline"}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Volume2 className="h-4 w-4 mr-2" /> {notificationsEnabled ? "On" : "Off"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {selectedSignal?.asset} - {selectedSignal?.direction} Signal Chart
                    {isStreaming && enableStreaming && (
                      <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {chartLoading && "Caricamento dati..."}
                    {!chartLoading && candles.length > 0 && (
                      <>
                        {chartError?.includes('Backend non disponibile') ? (
                          <span className="text-amber-500 font-medium">📊 Dati Dimostrativi (Backend Offline)</span>
                        ) : (
                          <span className="text-green-500">Dati reali XTB</span>
                        )}
                        {selectedSignal?.description && ` • ${selectedSignal.description}`}
                        {lastUpdate && (
                          <span className="text-xs ml-2">• {new Date(lastUpdate).toLocaleTimeString()}</span>
                        )}
                      </>
                    )}
                    {!chartLoading && candles.length === 0 && selectedSignal?.description}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant={enableStreaming ? "default" : "outline"}
                  onClick={() => setEnableStreaming(!enableStreaming)}
                >
                  {enableStreaming ? "Streaming ON" : "Streaming OFF"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {chartLoading && <p className="text-muted-foreground mb-2">Caricamento dati real-time...</p>}
              {chartError && <p className="text-destructive mb-2">Errore: {chartError}</p>}
              <div ref={chartContainerRef} className="w-full h-[400px]" />
            </CardContent>
          </Card>

          {/* Signal Details */}
          {selectedSignal && (
            <Card className={`border-border ${selectedSignal.direction === "LONG" ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  {selectedSignal.direction === "LONG" ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  {selectedSignal.asset}
                </CardTitle>
                <CardDescription className="text-sm">
                  {selectedSignal.status.toUpperCase()} • {selectedSignal.timestamp.toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Signal Info */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Entry Price</span>
                    <span className="font-semibold">{selectedSignal.entryPrice.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <span className="font-semibold text-green-500">{selectedSignal.targetPrice.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stop Loss</span>
                    <span className="font-semibold text-red-500">{selectedSignal.stopLoss.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-blue-500">{selectedSignal.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">AI Model</span>
                    <span className="font-semibold">{selectedSignal.aiModel}</span>
                  </div>
                </div>

                {/* P&L if closed */}
                {selectedSignal.status === "closed" && selectedSignal.profitLoss !== undefined && (
                  <div className={`p-3 rounded-lg ${selectedSignal.profitLoss > 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <p className="text-sm text-muted-foreground">Profit/Loss</p>
                    <p className={`text-xl font-bold ${selectedSignal.profitLoss > 0 ? "text-green-500" : "text-red-500"}`}>
                      {selectedSignal.profitLoss > 0 ? "+" : ""}{selectedSignal.profitLoss.toFixed(2)} EUR
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedSignal.status === "pending" && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleActivateSignal(selectedSignal.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Attiva Segnale
                  </Button>
                )}

                {selectedSignal.status === "active" && (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleCloseSignal(selectedSignal.id, Math.random() * 1000 - 500)}
                  >
                    Chiudi Segnale
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Signals List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {t("All Signals")} ({filteredSignals.length})
            </CardTitle>
            <CardDescription>{t("Click on a signal to view details and chart")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredSignals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nessun segnale trovato</p>
              ) : (
                filteredSignals.map((signal) => (
                  <div
                    key={signal.id}
                    onClick={() => setSelectedSignal(signal)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSignal?.id === signal.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {signal.direction === "LONG" ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-semibold">{signal.asset}</p>
                          <p className="text-xs text-muted-foreground">
                            {signal.aiModel} • {signal.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{signal.confidence}%</p>
                        <p className={`text-xs ${signal.status === "pending" ? "text-yellow-500" : signal.status === "active" ? "text-green-500" : "text-gray-500"}`}>
                          {signal.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
