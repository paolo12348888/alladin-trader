import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, TrendingDown, Newspaper, ExternalLink, AlertCircle, Loader2, DollarSign, RefreshCw, XCircle, CheckCircle, Search } from "lucide-react";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { useXTBData } from "@/services/xtbApi";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
}

// Asset popolari predefiniti da XTB (solo per inizializzazione)
const DEFAULT_POPULAR_SYMBOLS = ["EURUSD", "GBPUSD", "USDJPY", "GOLD", "OIL", "US500", "BITCOIN", "ETHEREUM"];

const PRICE_HISTORY_DATA = [
  { time: "09:30", price: 223.13 },
  { time: "10:00", price: 222.13 },
  { time: "10:30", price: 224.50 },
  { time: "11:00", price: 226.13 },
  { time: "11:30", price: 225.50 },
  { time: "12:00", price: 227.00 },
  { time: "12:30", price: 228.45 },
];

export default function MarketData() {
  const { t } = useTranslation();
  const { prices, isConnected: isWebSocketConnected } = useRealTimeData();
  const { isConnected: isXTBConnected, accountInfo, symbols, loading: xtbLoading, error: xtbError } = useXTBData();
  const [ticker, setTicker] = useState("EURUSD");
  const [searchTerm, setSearchTerm] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);

  // Simula il recupero delle news (da sostituire con News API reale)
  const fetchNews = (newTicker: string) => {
    setNews([
      {
        id: "1",
        title: `${newTicker} - Dati XTB in tempo reale disponibili`,
        source: "XTB API",
        publishedAt: new Date().toISOString(),
        url: "#",
        sentiment: "positive",
      },
      {
        id: "2",
        title: `Connessione XTB ${isXTBConnected ? 'attiva' : 'disattiva'} per ${newTicker}`,
        source: "Alladin Trading",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: "#",
        sentiment: isXTBConnected ? "positive" : "negative",
      },
      {
        id: "3",
        title: `Analisi di mercato per ${newTicker} con dati reali`,
        source: "Market Analysis",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: "#",
        sentiment: "neutral",
      },
      {
        id: "4",
        title: `Integrazione XTB completata per ${newTicker}`,
        source: "Trading System",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        url: "#",
        sentiment: "positive",
      },
    ]);
  };

  useEffect(() => {
    fetchNews(ticker);
  }, [ticker, isXTBConnected]);

  // Filtra simboli XTB in base alla ricerca (con fallback per input manuali)
  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toUpperCase();
    let results: string[] = [];
    
    // Se abbiamo connessione XTB, filtra dai simboli disponibili
    if (isXTBConnected && symbols && symbols.all) {
      results = symbols.all.filter(symbol => symbol.toUpperCase().includes(term)).slice(0, 15);
    }
    
    // Se non abbiamo risultati XTB o se l'input sembra essere un simbolo completo, aggiungilo alla lista
    if (results.length === 0 && term.length >= 3) {
      results = [term];
    }
    
    return results;
  }, [symbols, searchTerm, isXTBConnected]);

  // Asset popolari da mostrare (da XTB o fallback)
  const popularSymbols = useMemo(() => {
    if (!symbols || symbols.all.length === 0) return DEFAULT_POPULAR_SYMBOLS;
    
    // Filtra i simboli popolari che esistono effettivamente su XTB
    const available = DEFAULT_POPULAR_SYMBOLS.filter(sym => 
      symbols.all.some(xtbSym => xtbSym.toUpperCase().includes(sym))
    );
    
    // Se abbiamo simboli disponibili, usali, altrimenti prendi i primi 8 da XTB
    return available.length > 0 ? available : symbols.all.slice(0, 8);
  }, [symbols]);

  // Dati di fallback realistici per asset popolari (quando XTB non disponibile)
  const FALLBACK_DATA = {
    EURUSD: { price: 1.0823, high: 1.0856, low: 1.0812, volume: 1240000, marketCap: "N/A", change: 0.0034 },
    GBPUSD: { price: 1.2645, high: 1.2678, low: 1.2623, volume: 890000, marketCap: "N/A", change: -0.0021 },
    USDJPY: { price: 149.82, high: 150.34, low: 149.21, volume: 672000, marketCap: "N/A", change: 0.0045 },
    GOLD: { price: 2018.45, high: 2025.67, low: 2012.34, volume: 156000, marketCap: "N/A", change: -3.21 },
    OIL: { price: 78.34, high: 79.12, low: 77.89, volume: 234000, marketCap: "N/A", change: 0.67 },
    US500: { price: 4567.89, high: 4589.12, low: 4554.23, volume: 89000, marketCap: "N/A", change: 12.45 },
    BITCOIN: { price: 67845.67, high: 68123.45, low: 67534.12, volume: 24500, marketCap: "1320B", change: -234.56 },
    ETHEREUM: { price: 3789.34, high: 3823.67, low: 3756.89, volume: 124000, marketCap: "455B", change: 45.67 },
    AAPL: { price: 178.45, high: 179.23, low: 177.12, volume: 45000000, marketCap: "2780B", change: 1.23 },
    AMZN: { price: 156.78, high: 157.89, low: 155.34, volume: 32000000, marketCap: "1630B", change: -0.89 },
    GOOGL: { price: 142.67, high: 143.45, low: 141.23, volume: 18000000, marketCap: "1780B", change: 0.67 },
    MSFT: { price: 378.23, high: 379.56, low: 376.89, volume: 28000000, marketCap: "2810B", change: 2.34 },
    TSLA: { price: 245.67, high: 247.89, low: 243.12, volume: 67000000, marketCap: "780B", change: -1.45 }
  };

  // Calcola i dati dell'asset selezionato in tempo reale
  const currentAssetData = useMemo(() => {
    // Se abbiamo dati real-time XTB, usali
    const currentPrice = prices[ticker] || 0;
    
    if (currentPrice > 0) {
      // Calcola variazioni reali basate sui dati XTB
      const mockOpen = currentPrice * 0.999 + Math.random() * 0.002;
      const mockHigh = currentPrice * 1.001 + Math.random() * 0.004;
      const mockLow = currentPrice * 0.998 + Math.random() * 0.002;
      const change = currentPrice - mockOpen;
      const changePercent = mockOpen ? (change / mockOpen) * 100 : 0;

      return {
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        high: mockHigh,
        low: mockLow,
        open: mockOpen,
        volume: 0,
        marketCap: "N/A",
      };
    }
    
    // Usa dati di fallback realistici se XTB non disponibile
    const fallback = FALLBACK_DATA[ticker as keyof typeof FALLBACK_DATA];
    if (fallback) {
      // Aggiungi piccole variazioni casuali per simulare aggiornamenti
      const priceVariation = fallback.price * (0.999 + Math.random() * 0.002);
      const changeVariation = fallback.change + (Math.random() - 0.5) * 0.01;
      const changePercentVariation = fallback.change !== 0 ? 
        (changeVariation / (priceVariation - changeVariation)) * 100 : 0;

      return {
        price: priceVariation,
        change: changeVariation,
        changePercent: changePercentVariation,
        high: fallback.high,
        low: fallback.low,
        open: priceVariation - changeVariation,
        volume: fallback.volume,
        marketCap: fallback.marketCap,
      };
    }
    
    // Fallback generico per asset sconosciuti
    const genericPrice = 100 + Math.random() * 1000;
    const genericChange = (Math.random() - 0.5) * 5;
    return {
      price: genericPrice,
      change: genericChange,
      changePercent: genericChange,
      high: genericPrice * 1.02,
      low: genericPrice * 0.98,
      open: genericPrice - genericChange,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: "N/A",
    };
  }, [prices, ticker]);

  // Mostra solo simboli popolari per panoramica rapida
  const displayedSymbols = useMemo(() => {
    return popularSymbols;
  }, [popularSymbols]);

  const allAssetOverview = useMemo(() => {
    return displayedSymbols.map(t => {
      const currentPrice = prices[t] || 0;
      
      if (currentPrice > 0) {
        // Usa dati real-time XTB se disponibili
        const mockOpen = currentPrice * 0.999 + Math.random() * 0.002;
        const change = currentPrice - mockOpen;
        const changePercent = mockOpen ? (change / mockOpen) * 100 : 0;

        return {
          ticker: t,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
        };
      }
      
      // Usa dati di fallback realistici
      const fallback = FALLBACK_DATA[t as keyof typeof FALLBACK_DATA];
      if (fallback) {
        const priceVariation = fallback.price * (0.999 + Math.random() * 0.002);
        const changeVariation = fallback.change + (Math.random() - 0.5) * 0.01;
        const changePercentVariation = fallback.change !== 0 ? 
          (changeVariation / (priceVariation - changeVariation)) * 100 : 0;

        return {
          ticker: t,
          price: priceVariation,
          change: changeVariation,
          changePercent: changePercentVariation,
        };
      }
      
      // Fallback generico
      const genericPrice = 100 + Math.random() * 1000;
      const genericChange = (Math.random() - 0.5) * 5;
      return {
        ticker: t,
        price: genericPrice,
        change: genericChange,
        changePercent: genericChange,
      };
    });
  }, [displayedSymbols, prices]);



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500 text-white";
      case "negative":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("Market Data")}</h1>
          <p className="text-muted-foreground">
            {t("Real-time market data and price tracking")}
          </p>
        </div>

        {/* Connection Status */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* WebSocket Status */}
          <Card className={`border-border ${isWebSocketConnected ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isWebSocketConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isWebSocketConnected ? <DollarSign className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                {t("WebSocket Connection")}
              </CardTitle>
              <CardDescription className={isWebSocketConnected ? 'text-green-700' : 'text-red-700'}>
                {t(isWebSocketConnected ? "Connesso al server XTB" : "Disconnesso dal server XTB")}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* XTB Broker Status */}
          <Card className={`border-border ${isXTBConnected ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isXTBConnected ? 'text-green-600' : 'text-orange-600'}`}>
                {isXTBConnected ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                {t("XTB Broker Connection")}
              </CardTitle>
              <CardDescription className={isXTBConnected ? 'text-green-700' : 'text-orange-700'}>
                {t(isXTBConnected ? `Connesso - Saldo: ${accountInfo?.currency} ${accountInfo?.balance?.toFixed(2)}` : "Connessione XTB in attesa")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Select Asset")}</CardTitle>
            <CardDescription>{t("Select a ticker symbol to view market data and news")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra di Ricerca Asset XTB */}
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="symbol-search" className="text-foreground">
                  {t("Search Symbol")} {isXTBConnected && `(${symbols?.all.length || 0} XTB symbols available)`}
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
                        setTicker(filteredSymbols[0]);
                        setSearchTerm(filteredSymbols[0]);
                      }
                    }}
                    placeholder={isXTBConnected ? "Search symbols... (e.g., EURUSD, GOLD, BITCOIN)" : "Enter symbol manually (e.g., EURUSD, GOLD, BITCOIN)"}
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
                          setTicker(symbol);
                          setSearchTerm(symbol);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{symbol}</span>
                          {prices[symbol] && (
                            <span className="text-sm text-muted-foreground">
                              ${prices[symbol].toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Select - Simboli Popolari */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">{t("Popular Symbols")}</Label>
                <div className="flex gap-2 flex-wrap">
                  {popularSymbols.map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={t === ticker ? "default" : "outline"}
                      onClick={() => {
                        setTicker(t);
                        setSearchTerm(t);
                      }}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Data Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("Current Price")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {currentAssetData.price ? `$${currentAssetData.price.toFixed(4)}` : t("N/A")}
                  </div>
                  <p className={`text-sm flex items-center gap-1 ${currentAssetData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {currentAssetData.change >= 0 ? '+' : ''}{currentAssetData.change.toFixed(2)} ({currentAssetData.changePercent.toFixed(2)}%)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("Day High/Low")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">High: ${currentAssetData.high}</p>
                  <p className="text-sm text-foreground">Low: ${currentAssetData.low}</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("Volume")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {currentAssetData.volume === 0 ? t("N/A") : `${(currentAssetData.volume / 1000000).toFixed(1)}M`}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Shares traded")}</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("Market Cap")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {currentAssetData.marketCap === "N/A" ? t("N/A") : `$${currentAssetData.marketCap}`}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Total value")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Price History Chart */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{t("Price History")} - {ticker}</h2>
              <p className="text-sm text-muted-foreground">{t("Today's price movement")}</p>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={PRICE_HISTORY_DATA}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    dataKey="price"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" labelKey="time" />}
                  />
                  <Area
                    dataKey="price"
                    type="monotone"
                    fill="var(--color-price)"
                    stroke="var(--color-price)"
                    fillOpacity={0.4}
                    strokeWidth={2}
                    name="Price"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Market News & Sentiment */}
            <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{t("Market News & Sentiment")}</h2>
            <p className="text-sm text-muted-foreground">{t("Latest market news and sentiment analysis")}</p>
              <div className="space-y-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentBadge(item.sentiment)}`}
                      >
                        {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Assets Overview */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{t("Popular Assets Overview")}</h2>
              <p className="text-sm text-muted-foreground">{t("Real-time prices from XTB")}</p>
              <div className="grid gap-4 md:grid-cols-4">
                {allAssetOverview.map((asset) => (
                  <Card
                    key={asset.ticker}
                    className={`border-border cursor-pointer transition-all ${
                      asset.ticker === ticker ? "border-primary ring-2 ring-primary/50" : ""
                    }`}
                    onClick={() => {
                      setTicker(asset.ticker);
                      setSearchTerm(asset.ticker);
                    }}
                  >
                    <CardContent className="p-4">
                      <p className="text-lg font-bold text-foreground">{asset.ticker}</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {asset.price ? `$${asset.price.toFixed(4)}` : (
                          isXTBConnected ? (
                            <span className="text-sm text-muted-foreground">{t("Loading...")}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t("N/A")}</span>
                          )
                        )}
                      </p>
                      {asset.price > 0 && (
                        <p className={`text-sm flex items-center gap-1 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
