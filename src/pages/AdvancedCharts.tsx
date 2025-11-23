import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Zap, Search, Loader2, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { toast } from "sonner";
import { useXTBData } from "@/services/xtbApi";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { useRealTimeChart } from "@/hooks/useRealTimeChart";

// Tipi di asset e timeframe
const ASSET_TYPES = ["Stocks", "Commodity", "Crypto", "Bonds", "Forex", "Indices", "ETF", "Options"];
// Timeframes supportati da XTB API
const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"];

export default function AdvancedCharts() {
  const { t } = useTranslation();
  const { symbols, isConnected: xtbConnected } = useXTBData();
  const { prices } = useRealTimeData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const [selectedAsset, setSelectedAsset] = useState("EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("H1");
  const [searchTerm, setSearchTerm] = useState("");
  const [enableRealTime, setEnableRealTime] = useState(true);

  // Hook per dati real-time XTB
  const { candles, loading, error, lastUpdate } = useRealTimeChart({
    symbol: selectedAsset,
    timeframe: selectedTimeframe,
    count: 300,
    enableRealTime: enableRealTime,
  });

  // Filtra simboli XTB in base alla ricerca
  const filteredSymbols = useMemo(() => {
    if (!symbols || !searchTerm) return [];
    const term = searchTerm.toUpperCase();
    return symbols.all.filter(symbol => symbol.toUpperCase().includes(term)).slice(0, 10);
  }, [symbols, searchTerm]);

  const updateChart = (data: CandlestickData[]) => {
    if (chartRef.current && seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
      
      // Aggiorna volumi REALI da XTB
      if (volumeSeriesRef.current) {
        const volumeData = data.map(d => ({
          time: d.time,
          value: (d as any).volume || 0,
          color: d.close > d.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }));
        volumeSeriesRef.current.setData(volumeData);
      }
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    const asset = searchTerm.toUpperCase();
    toast.info(`Loading real-time data for ${asset} on ${selectedTimeframe}...`);
    setSelectedAsset(asset);
  };

  const handleSelectSymbol = (symbol: string) => {
    setSearchTerm(symbol);
    setSelectedAsset(symbol);
    toast.success(`Switched to ${symbol}`);
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Usa colori fissi compatibili con lightweight-charts
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const backgroundColor = isDarkMode ? '#0a0a0a' : '#ffffff';
    const textColor = isDarkMode ? '#e5e5e5' : '#171717';
    const borderColor = isDarkMode ? '#262626' : '#e5e5e5';
    const successColor = '#22c55e';
    const destructiveColor = '#ef4444';
    const mutedColor = isDarkMode ? '#737373' : '#a3a3a3';

    // Crea il grafico
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
    
    // Aggiungi la serie candlestick usando la nuova API v5
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: successColor,
      downColor: destructiveColor,
      borderVisible: false,
      wickUpColor: successColor,
      wickDownColor: destructiveColor,
    });
    
    seriesRef.current = candlestickSeries;
    
    // Aggiungi un indicatore di volume usando la nuova API v5
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: mutedColor,
      priceFormat: {
        type: 'volume',
      },
    });
    
    volumeSeriesRef.current = volumeSeries;
    
    // Gestione del resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);  // Inizializza chart una sola volta

  // Effect separato per aggiornare i dati quando cambiano
  useEffect(() => {
    if (candles.length > 0) {
      updateChart(candles);
    }
  }, [candles]); // Aggiorna quando arrivano nuovi dati

  // Mostra errore se presente
  useEffect(() => {
    if (error) {
      toast.error(`Errore caricamento dati: ${error}`);
    }
  }, [error]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LineChart className="h-8 w-8" /> {t("Advanced Charts")}
          </h1>
          <p className="text-muted-foreground">
            {t("Interactive charts with technical indicators and AI signals")} {xtbConnected && <span className="text-green-500">• XTB Connected</span>}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Chart Controls")}</CardTitle>
            <CardDescription>{t("Select asset, timeframe, and apply indicators")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Asset Search */}
            <div className="space-y-2 md:col-span-2 relative">
              <Label htmlFor="asset-search">{t("Asset Search")} {xtbConnected && `(${symbols?.all.length || 0} XTB symbols)`}</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="asset-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    placeholder={xtbConnected ? "Search XTB symbols (e.g., EURUSD, US500, BITCOIN)" : "e.g., EURUSD, BTC, AAPL"}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  {filteredSymbols.length > 0 && searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSymbols.map((symbol) => (
                        <div
                          key={symbol}
                          className="px-4 py-2 cursor-pointer hover:bg-accent transition-colors text-foreground"
                          onClick={() => handleSelectSymbol(symbol)}
                        >
                          {symbol}
                          {prices[symbol] && <span className="text-muted-foreground ml-2 text-sm">({prices[symbol].toFixed(4)})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {xtbConnected ? `Search from ${symbols?.all.length || 0} XTB symbols (Forex, Indices, Commodities, Crypto)` : t("Search for assets (Stocks, Commodity, Crypto, Forex, etc.)")}
              </p>
            </div>

            {/* Timeframe Select */}
            <div className="space-y-2">
              <Label htmlFor="timeframe-select">{t("Select Timeframe")}</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger id="timeframe-select">
                  <SelectValue placeholder={t("Select Timeframe")} />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map(tf => (
                    <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Indicators Button (Placeholder) */}
            <div className="space-y-2">
              <Label htmlFor="indicators-button">{t("Apply Indicators")}</Label>
              <Button id="indicators-button" variant="outline" className="w-full" disabled>
                {t("Apply Indicators")} (WIP)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Container - Full Width */}
        <div className="grid grid-cols-1 gap-6">
          {/* Chart Container */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {selectedAsset} - {selectedTimeframe} {t("Chart")}
                    {enableRealTime && lastUpdate && (
                      <span className="text-xs font-normal text-green-500 flex items-center gap-1">
                        <Activity className="h-3 w-3 animate-pulse" />
                        Live
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {loading && "Caricamento dati..."}
                    {!loading && candles.length > 0 && (
                      <>
                        {candles.length} candele • 
                        {error?.includes('Backend non disponibile') ? (
                          <span className="text-amber-500 font-medium"> 📊 Dati Dimostrativi (Backend Offline)</span>
                        ) : (
                          <span className="text-green-500"> Dati reali XTB</span>
                        )}
                        {lastUpdate && (
                          <span className="ml-2 text-muted-foreground">
                            • Ultimo aggiornamento: {lastUpdate.toLocaleTimeString()}
                          </span>
                        )}
                      </>
                    )}
                    {error && !error.includes('Backend non disponibile') && (
                      <span className="text-destructive">Errore: {error}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={enableRealTime ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnableRealTime(!enableRealTime)}
                  >
                    {enableRealTime ? (
                      <>
                        <Activity className="h-4 w-4 mr-1" />
                        Streaming ON
                      </>
                    ) : (
                      "Streaming OFF"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {loading && candles.length === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm">Caricamento dati XTB...</span>
                  </div>
                </div>
              )}
              <div ref={chartContainerRef} className="w-full h-[500px]" />
            </CardContent>
          </Card>
        </div>
        
        {/* Placeholder for ESG/Sostenibilità (Nuova Sezione ALLADIN) */}
        <Card className="border-l-4 border-blue-500 bg-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-500">{t("ESG & Sustainability Analysis")}</CardTitle>
            <CardDescription className="text-blue-500/80">
              {t("This section will be implemented to incorporate ESG factors into asset analysis, a key feature of the ALLADIN platform.")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}
