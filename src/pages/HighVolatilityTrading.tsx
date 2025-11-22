import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Activity, Search } from "lucide-react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries } from "lightweight-charts";
import { toast } from "sonner";
import { useXTBData } from "@/services/xtbApi";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { useRealTimeChart } from "@/hooks/useRealTimeChart";

interface VolatilityPosition {
  id: string;
  asset: string;
  entryPrice: number;
  currentPrice: number;
  size: number;
  volatilityLevel: "high" | "extreme";
  stopLoss: number;
  takeProfit: number;
  status: "open" | "closed" | "stopped";
  alerts: string[];
  riskRewardRatio: number;
}

// Asset popolari per Quick Access
const POPULAR_VOLATILE_ASSETS = ["BITCOIN", "ETHEREUM", "US500", "OIL", "GOLD", "EURUSD", "GBPUSD", "USDJPY"];

// Dati di fallback realistici per asset popolari ad alta volatilità
const FALLBACK_DATA = {
  BITCOIN: 67845.67,
  ETHEREUM: 3789.34,
  US500: 4567.89,
  OIL: 78.34,
  GOLD: 2018.45,
  EURUSD: 1.0823,
  GBPUSD: 1.2645,
  USDJPY: 149.82,
};

export default function HighVolatilityTrading() {
  const { t } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [selectedAsset, setSelectedAsset] = useState("BITCOIN");
  const [searchTerm, setSearchTerm] = useState("");
  const [volatilityLevel, setVolatilityLevel] = useState<"high" | "extreme">("high");
  const [entryPrice, setEntryPrice] = useState("45000");
  const [size, setSize] = useState("0.5");
  const [stopLoss, setStopLoss] = useState("43000");
  const [takeProfit, setTakeProfit] = useState("47000");
  const [positions, setPositions] = useState<VolatilityPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<VolatilityPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [enableStreaming, setEnableStreaming] = useState(true);

  // Hook XTB
  const { symbols, isConnected: xtbConnected } = useXTBData();
  const { prices } = useRealTimeData();

  // Filtra simboli XTB (con fallback per input manuali)
  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toUpperCase();
    let results: string[] = [];
    
    // Se abbiamo connessione XTB, filtra dai simboli disponibili
    if (xtbConnected && symbols && symbols.all) {
      results = symbols.all.filter(symbol => symbol.toUpperCase().includes(term)).slice(0, 15);
    }
    
    // Se non abbiamo risultati XTB o se l'input sembra essere un simbolo completo, aggiungilo alla lista
    if (results.length === 0 && term.length >= 3) {
      results = [term];
    }
    
    return results;
  }, [symbols, searchTerm, xtbConnected]);

  // Hook per dati real-time da XTB
  const { 
    candles, 
    loading: chartLoading, 
    error: chartError,
    lastUpdate,
    isStreaming 
  } = useRealTimeChart({
    symbol: selectedAsset,
    timeframe: "M15",
    count: 100,
    enableRealTime: enableStreaming,
  });

  // Calcola volatilità reale (ATR) dai dati
  const calculateVolatility = (candles: CandlestickData[]): number => {
    if (candles.length < 14) return 0;
    let atr = 0;
    for (let i = 1; i < Math.min(14, candles.length); i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;
      const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
      atr += tr;
    }
    return atr / 14;
  };

  const currentVolatility = calculateVolatility(candles);

  // Calcola il rapporto rischio/rendimento
  const calculateRiskReward = (entry: number, sl: number, tp: number): number => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return reward / risk;
  };

  // Aggiorna automaticamente i prezzi quando cambia l'asset selezionato
  useEffect(() => {
    let price = prices[selectedAsset];
    
    // Se non abbiamo prezzo XTB, usa dati di fallback
    if (!price || price <= 0) {
      price = FALLBACK_DATA[selectedAsset as keyof typeof FALLBACK_DATA];
    }
    
    if (price && price > 0) {
      // Per asset ad alta volatilità, usa spread più ampi
      const spreadPercent = selectedAsset === 'BITCOIN' || selectedAsset === 'ETHEREUM' ? 0.02 : 0.015;
      const stopLossValue = price * (1 - spreadPercent);
      const takeProfitValue = price * (1 + spreadPercent * 1.5);
      
      setEntryPrice(price.toFixed(0));
      setStopLoss(stopLossValue.toFixed(0));
      setTakeProfit(takeProfitValue.toFixed(0));
    }
  }, [selectedAsset, prices]);

  // Entra a mercato con impostazioni per alta volatilità
  const handleEnterMarket = () => {
    if (!entryPrice || !stopLoss || !takeProfit || !size) {
      toast.error("Completa tutti i campi");
      return;
    }

    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const riskReward = calculateRiskReward(entry, sl, tp);

    if (riskReward < 1.5) {
      toast.warning("Risk/Reward ratio troppo basso per alta volatilità (minimo 1.5:1)");
      return;
    }

    setLoading(true);
    toast.info(`Ingresso a mercato per ${selectedAsset}...`);

    setTimeout(() => {
      const newPosition: VolatilityPosition = {
        id: `VOL_${Date.now()}`,
        asset: selectedAsset,
        entryPrice: entry,
        currentPrice: entry,
        size: parseFloat(size),
        volatilityLevel: volatilityLevel,
        stopLoss: sl,
        takeProfit: tp,
        status: "open",
        alerts: [
          `Ingresso a ${entry} con volatilità ${volatilityLevel}`,
          `Risk/Reward: ${riskReward.toFixed(2)}:1`,
          `Stop Loss: ${sl}`,
          `Take Profit: ${tp}`,
        ],
        riskRewardRatio: riskReward,
      };

      setPositions([...positions, newPosition]);
      setSelectedPosition(newPosition);
      setLoading(false);
      toast.success(`Posizione aperta per ${selectedAsset}`);
    }, 1500);
  };

  // Chiudi posizione
  const handleClosePosition = (positionId: string, reason: "tp" | "sl" | "manual") => {
    setPositions(
      positions.map((pos) => {
        if (pos.id === positionId) {
          const closureReason =
            reason === "tp" ? "Take Profit raggiunto" : reason === "sl" ? "Stop Loss attivato" : "Chiusura manuale";
          return {
            ...pos,
            status: reason === "sl" ? "stopped" : "closed",
            alerts: [...pos.alerts, closureReason],
          };
        }
        return pos;
      })
    );
    toast.success("Posizione chiusa");
  };

  // Inizializza il grafico
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDarkMode = document.documentElement.classList.contains("dark");
    const backgroundColor = isDarkMode ? "#0a0a0a" : "#ffffff";
    const textColor = isDarkMode ? "#e5e5e5" : "#171717";
    const borderColor = isDarkMode ? "#262626" : "#e5e5e5";
    const successColor = "#22c55e";
    const destructiveColor = "#ef4444";

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
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
  }, [selectedPosition, volatilityLevel]);

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
            <AlertTriangle className="h-8 w-8 text-orange-500" /> {t("High Volatility Trading")}
          </h1>
          <p className="text-muted-foreground">
            {t("AI-powered trading for crypto, stocks, and indices with extreme volatility management")}
          </p>
        </div>

        {/* Configuration Panel */}
        <Card className="border-border border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" /> {t("High Volatility Setup")}
            </CardTitle>
            <CardDescription>{t("Configure entry, SL, TP with risk/reward optimization")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra di Ricerca Asset XTB */}
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="symbol-search" className="text-foreground">
                  {t("Search Volatile Asset")} {xtbConnected && symbols && `(${symbols.all.length} XTB symbols available)`}
                </Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="symbol-search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value.toUpperCase());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filteredSymbols.length > 0) {
                        setSelectedAsset(filteredSymbols[0]);
                        setSearchTerm(filteredSymbols[0]);
                      }
                    }}
                    onFocus={() => {
                      if (!searchTerm) setSearchTerm("");
                    }}
                    placeholder={xtbConnected ? "Search volatile assets... (e.g., BITCOIN, OIL, US500)" : "Enter volatile asset manually (e.g., BITCOIN, OIL, US500)"}
                    className="pl-10"
                  />
                </div>
                {/* Dropdown risultati ricerca */}
                {filteredSymbols.length > 0 && searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSymbols.map((symbol) => (
                      <div
                        key={symbol}
                        className="px-4 py-2 hover:bg-accent cursor-pointer text-foreground"
                        onClick={() => {
                          setSelectedAsset(symbol);
                          setSearchTerm(symbol);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{symbol}</span>
                          {prices[symbol] && (
                            <span className="text-sm text-muted-foreground">
                              {prices[symbol].toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Asset Popolari */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">{t("Popular Volatile Assets")}</Label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_VOLATILE_ASSETS.map((symbol) => (
                    <Button
                      key={symbol}
                      variant={selectedAsset === symbol ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedAsset(symbol);
                        setSearchTerm(symbol);
                      }}
                      className="text-xs"
                    >
                      {symbol}
                      {prices[symbol] && (
                        <span className="ml-1 opacity-70">{prices[symbol].toFixed(2)}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Selezionato e Parametri di Trading */}
            <div className="border-t border-border pt-4">
              <div className="mb-4">
                <Label className="text-lg font-semibold text-foreground">
                  {t("Selected Asset")}: <span className="text-primary">{selectedAsset}</span>
                </Label>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

            {/* Volatility Level */}
            <div className="space-y-2">
              <Label htmlFor="volatility-select">{t("Volatility")}</Label>
              <Select value={volatilityLevel} onValueChange={(v) => setVolatilityLevel(v as "high" | "extreme")}>
                <SelectTrigger id="volatility-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry Price */}
            <div className="space-y-2">
              <Label htmlFor="entry-price">{t("Entry")}</Label>
              <Input
                id="entry-price"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="45000"
              />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label htmlFor="size-input">{t("Size")}</Label>
              <Input
                id="size-input"
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="0.5"
                step="0.01"
              />
            </div>

            {/* Risk Management Info */}
            <div className="space-y-2">
              <Label>{t("Risk/Reward")}</Label>
              <div className="text-sm font-semibold text-orange-500">
                {calculateRiskReward(parseFloat(entryPrice) || 0, parseFloat(stopLoss) || 0, parseFloat(takeProfit) || 0).toFixed(2)}:1
              </div>
            </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="border-border border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> {t("Risk Management")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Stop Loss */}
            <div className="space-y-2">
              <Label htmlFor="sl-input">{t("Stop Loss")}</Label>
              <Input
                id="sl-input"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="43000"
                className="border-red-500/50"
              />
              <p className="text-xs text-red-500">
                Risk: {(Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss)) || 0).toFixed(2)}
              </p>
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <Label htmlFor="tp-input">{t("Take Profit")}</Label>
              <Input
                id="tp-input"
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="47000"
                className="border-green-500/50"
              />
              <p className="text-xs text-green-500">
                Reward: {(Math.abs(parseFloat(takeProfit) - parseFloat(entryPrice)) || 0).toFixed(2)}
              </p>
            </div>

            {/* Enter Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleEnterMarket}
                disabled={loading}
              >
                {loading ? "Ingresso..." : "Entra a Mercato"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  {selectedAsset} - {volatilityLevel === "extreme" ? "Extreme" : "High"} Volatility Chart
                  {isStreaming && enableStreaming && (
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  )}
                </CardTitle>
                <CardDescription>
                  {chartLoading && "Caricamento dati..."}
                  {!chartLoading && candles.length > 0 && (
                    <>
                      {chartError?.includes('Backend non disponibile') ? (
                        <span className="text-amber-500 font-medium">📊 Dati Dimostrativi (Backend Offline) • </span>
                      ) : (
                        <span className="text-green-500">Dati reali XTB • </span>
                      )}
                      ATR: {currentVolatility.toFixed(4)}
                      {lastUpdate && (
                        <span className="text-xs ml-2">Ultimo aggiornamento: {new Date(lastUpdate).toLocaleTimeString()}</span>
                      )}
                    </>
                  )}
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
            {chartLoading && <p className="text-muted-foreground">Caricamento dati real-time...</p>}
            {chartError && <p className="text-destructive">Errore: {chartError}</p>}
            <div ref={chartContainerRef} className="w-full h-[500px]" />
          </CardContent>
        </Card>

        {/* Active Positions */}
        {positions.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Active Positions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {positions.map((pos) => (
                <div key={pos.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div>
                      <p className="text-sm text-muted-foreground">Asset</p>
                      <p className="font-semibold">{pos.asset}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entry</p>
                      <p className="font-semibold">{pos.entryPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SL / TP</p>
                      <p className="font-semibold text-red-500">{pos.stopLoss.toFixed(2)}</p>
                      <p className="font-semibold text-green-500">{pos.takeProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk/Reward</p>
                      <p className="font-semibold text-orange-500">{pos.riskRewardRatio.toFixed(2)}:1</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`font-semibold ${pos.status === "open" ? "text-green-500" : "text-red-500"}`}>
                        {pos.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="space-y-1">
                    {pos.alerts.map((alert, idx) => (
                      <p key={idx} className="text-sm text-blue-500 flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" /> {alert}
                      </p>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {pos.status === "open" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleClosePosition(pos.id, "tp")}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" /> Take Profit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleClosePosition(pos.id, "sl")}
                      >
                        <TrendingDown className="h-4 w-4 mr-1" /> Stop Loss
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClosePosition(pos.id, "manual")}
                      >
                        Chiudi Manualmente
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
