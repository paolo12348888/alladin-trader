import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Zap, TrendingUp, AlertCircle, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, Activity, Search } from "lucide-react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { toast } from "sonner";
import { useXTBData } from "@/services/xtbApi";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { useRealTimeChart } from "@/hooks/useRealTimeChart";

// Tipi di dati per la scalatura
interface ScalingStep {
  step: number;
  condition: string;
  action: string;
  size: number;
  status: "pending" | "active" | "completed" | "cancelled";
  entryPrice?: number;
}

interface TradePosition {
  id: string;
  asset: string;
  entryPrice: number;
  currentPrice: number;
  totalSize: number;
  investmentAmount: number;
  currency: "EUR" | "LOTS";
  scalingSteps: ScalingStep[];
  status: "open" | "closed" | "pending";
  alerts: string[];
  trendConfirmed: boolean;
}

// Logica di scalatura intelligente
const calculateScalingSteps = (entryPrice: number, investmentAmount: number): ScalingStep[] => {
  return [
    {
      step: 1,
      condition: "Trend confermato",
      action: "Entra",
      size: 25,
      status: "active",
      entryPrice: entryPrice,
    },
    {
      step: 2,
      condition: "+X% favorevole",
      action: "Aggiunge",
      size: 25,
      status: "pending",
    },
    {
      step: 3,
      condition: "Breakout contro",
      action: "Stop",
      size: 0,
      status: "pending",
    },
    {
      step: 4,
      condition: "Continuazione forte",
      action: "Ultimo scaling",
      size: 50,
      status: "pending",
    },
  ];
};

export default function SmartScaling() {
  const { t } = useTranslation();
  const { symbols, isConnected: xtbConnected } = useXTBData();
  const { prices } = useRealTimeData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const [selectedAsset, setSelectedAsset] = useState("EURUSD");
  const [searchTerm, setSearchTerm] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("1000");
  const [investmentType, setInvestmentType] = useState<"EUR" | "LOTS">("EUR");
  const [entryPrice, setEntryPrice] = useState("1.0850");
  const [trendConfirmed, setTrendConfirmed] = useState(false);
  const [positions, setPositions] = useState<TradePosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<TradePosition | null>(null);

  // Hook per dati real-time XTB
  const { candles, loading: chartLoading, error, lastUpdate } = useRealTimeChart({
    symbol: selectedAsset,
    timeframe: "H1",
    count: 200,
    enableRealTime: true,
  });

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

  // Asset popolari per Quick Access
  const popularSymbols = ["EURUSD", "GBPUSD", "USDJPY", "GOLD", "OIL", "US500", "BITCOIN", "ETHEREUM"];

  // Dati di fallback realistici per asset popolari (quando XTB non disponibile)
  const FALLBACK_DATA = {
    EURUSD: 1.0823,
    GBPUSD: 1.2645,
    USDJPY: 149.82,
    GOLD: 2018.45,
    OIL: 78.34,
    US500: 4567.89,
    BITCOIN: 67845.67,
    ETHEREUM: 3789.34,
  };

  // Aggiorna prezzo entry con prezzo reale XTB quando cambia asset
  useEffect(() => {
    let price = prices[selectedAsset];
    
    // Se non abbiamo prezzo XTB, usa dati di fallback
    if (!price || price <= 0) {
      price = FALLBACK_DATA[selectedAsset as keyof typeof FALLBACK_DATA];
    }
    
    if (price && price > 0) {
      setEntryPrice(price.toFixed(4));
    }
  }, [selectedAsset, prices]);

  // Simula l'ingresso a mercato
  const handleEnterMarket = () => {
    if (!investmentAmount || !entryPrice || !trendConfirmed) {
      toast.error("Completa tutti i campi e conferma il trend");
      return;
    }

    setLoading(true);
    toast.info(`Ingresso a mercato per ${selectedAsset}...`);

    setTimeout(() => {
      const newPosition: TradePosition = {
        id: `POS_${Date.now()}`,
        asset: selectedAsset,
        entryPrice: parseFloat(entryPrice),
        currentPrice: parseFloat(entryPrice),
        totalSize: parseFloat(investmentAmount),
        investmentAmount: parseFloat(investmentAmount),
        currency: investmentType,
        scalingSteps: calculateScalingSteps(parseFloat(entryPrice), parseFloat(investmentAmount)),
        status: "open",
        alerts: ["Ingresso confermato al trend"],
        trendConfirmed: true,
      };

      setPositions([...positions, newPosition]);
      setSelectedPosition(newPosition);
      setLoading(false);
      toast.success(`Posizione aperta per ${selectedAsset}`);
    }, 1500);
  };

  // Simula la scalatura
  const handleScaleUp = (positionId: string, stepNumber: number) => {
    setPositions(
      positions.map((pos) => {
        if (pos.id === positionId) {
          const updatedSteps = pos.scalingSteps.map((step) => {
            if (step.step === stepNumber) {
              return { ...step, status: "completed" as const };
            }
            return step;
          });

          const newAlert = `Step ${stepNumber} completato: +${updatedSteps[stepNumber - 1].size}%`;
          return {
            ...pos,
            scalingSteps: updatedSteps,
            alerts: [...pos.alerts, newAlert],
            totalSize: pos.totalSize * (1 + updatedSteps[stepNumber - 1].size / 100),
          };
        }
        return pos;
      })
    );
    toast.success(`Scalatura step ${stepNumber} completata`);
  };

  // Simula la chiusura della posizione
  const handleClosePosition = (positionId: string) => {
    setPositions(
      positions.map((pos) => {
        if (pos.id === positionId) {
          return {
            ...pos,
            status: "closed",
            alerts: [...pos.alerts, "Posizione chiusa"],
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
  }, []); // Inizializza chart una sola volta

  // Effect separato per aggiornare i dati quando cambiano
  useEffect(() => {
    if (candles.length > 0 && seriesRef.current) {
      seriesRef.current.setData(candles);
      chartRef.current?.timeScale().fitContent();
    }
  }, [candles]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8" /> {t("Smart Scaling")}
          </h1>
          <p className="text-muted-foreground">
            {t("Intelligent market entry with auto-scaling based on confirmed trends")}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Configure Entry")}</CardTitle>
            <CardDescription>{t("Set asset, investment amount, and confirm trend")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra di Ricerca Asset XTB */}
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="symbol-search" className="text-foreground">
                  {t("Search Asset")} {xtbConnected && symbols && `(${symbols.all.length} XTB symbols available)`}
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
                    placeholder={xtbConnected ? "Search symbols... (e.g., EURUSD, GOLD, BITCOIN)" : "Enter symbol manually (e.g., EURUSD, GOLD, BITCOIN)"}
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
                <Label className="text-sm text-muted-foreground">{t("Popular Assets")}</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSymbols.map((symbol) => (
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
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="investment-input">{t("Amount")}</Label>
              <Input
                id="investment-input"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="1000"
              />
            </div>

            {/* Investment Type */}
            <div className="space-y-2">
              <Label htmlFor="type-select">{t("Type")}</Label>
              <Select value={investmentType} onValueChange={(v) => setInvestmentType(v as "EUR" | "LOTS")}>
                <SelectTrigger id="type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="LOTS">LOTS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry Price */}
            <div className="space-y-2">
              <Label htmlFor="entry-price">{t("Entry Price")}</Label>
              <Input
                id="entry-price"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="1.0850"
                step="0.0001"
              />
            </div>

            {/* Trend Confirmation */}
            <div className="space-y-2">
              <Label htmlFor="trend-confirm">{t("Trend OK?")}</Label>
              <Button
                id="trend-confirm"
                onClick={() => setTrendConfirmed(!trendConfirmed)}
                className={trendConfirmed ? "bg-green-600 hover:bg-green-700 w-full" : "bg-gray-600 hover:bg-gray-700 w-full"}
              >
                {trendConfirmed ? "✓ Confermato" : "✗ Non confermato"}
              </Button>
            </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">
                {selectedAsset} - {t("Smart Scaling Chart")}
              </CardTitle>
              <CardDescription>
                {chartLoading && "Caricamento dati..."}
                {!chartLoading && candles.length > 0 && (
                  <>
                    {error?.includes('Backend non disponibile') ? (
                      <span className="text-amber-500 font-medium">📊 Dati Dimostrativi (Backend Offline)</span>
                    ) : (
                      <span className="text-green-500">Dati reali XTB</span>
                    )}
                    {lastUpdate && (
                      <span className="ml-2">
                        • Ultimo aggiornamento: {lastUpdate.toLocaleTimeString()}
                      </span>
                    )}
                  </>
                )}
                {!error?.includes('Backend non disponibile') && (
                  t("Candlestick chart with entry and scaling alerts")
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={chartContainerRef} className="w-full h-[500px]" />
            </CardContent>
          </Card>

          {/* Scaling Steps */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5" /> {t("Scaling Plan")}
              </CardTitle>
              <CardDescription>{t("Auto-scaling strategy")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedPosition ? (
                <>
                  {selectedPosition.scalingSteps.map((step) => (
                    <div key={step.step} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Step {step.step}</span>
                        <div className="flex items-center gap-1">
                          {step.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {step.status === "active" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {step.status === "pending" && <XCircle className="h-4 w-4 text-gray-500" />}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Condizione:</strong> {step.condition}</p>
                        <p><strong>Azione:</strong> {step.action}</p>
                        <p><strong>Size:</strong> {step.size}%</p>
                      </div>
                      {step.status === "pending" && step.step > 1 && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleScaleUp(selectedPosition.id, step.step)}
                        >
                          Esegui Step {step.step}
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleClosePosition(selectedPosition.id)}
                    disabled={selectedPosition.status === "closed"}
                  >
                    Chiudi Posizione
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleEnterMarket}
                  disabled={loading || !trendConfirmed}
                >
                  {loading ? "Ingresso in corso..." : "Entra a Mercato"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Positions */}
        {positions.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Active Positions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((pos) => (
                  <div key={pos.id} className="border border-border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Asset</p>
                        <p className="font-semibold">{pos.asset}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entry Price</p>
                        <p className="font-semibold">{pos.entryPrice.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Size</p>
                        <p className="font-semibold">{pos.totalSize.toFixed(2)} {pos.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={`font-semibold ${pos.status === "open" ? "text-green-500" : "text-red-500"}`}>
                          {pos.status === "open" ? "OPEN" : "CLOSED"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {pos.alerts.map((alert, idx) => (
                        <p key={idx} className="text-sm text-blue-500">
                          • {alert}
                        </p>
                      ))}
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
