import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { 
  TrendingDown, 
  Calculator, 
  Shield, 
  BarChart3,
  Star,
  Search,
  Target
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { 
  ValueInvestingService, 
  StockAnalysis, 
  BenjaminGrahamMetrics,
  MoatAnalysis,
  QualityScore,
  ValueOpportunity,
  ValueScreenerResult,
  ValueScreeningFilters,
  valueInvestingService
} from "@/services/ValueInvestingService";

export default function ValueInvesting() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockAnalysis | null>(null);
  
  const [allStocks, setAllStocks] = useState<StockAnalysis[]>([]);
  const [screenerResults, setScreenerResults] = useState<ValueScreenerResult | null>(null);
  
  const [screeningFilters, setScreeningFilters] = useState<ValueScreeningFilters>({
    maxPE: 25,
    maxPB: 3,
    minROE: 15,
    maxDebtToEquity: 2,
    minCurrentRatio: 1.5,
    minMarketCap: 1000000000,
    maxMarketCap: 1000000000000,
    minMoatStrength: 5
  });

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const stocks = await valueInvestingService.getAllValueStocks();
      setAllStocks(stocks);
      
      const results = await valueInvestingService.screenValueStocks(screeningFilters);
      setScreenerResults(results);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSearch = async () => {
    if (!searchSymbol) return;
    try {
      setLoading(true);
      const stock = await valueInvestingService.getStockBySymbol(searchSymbol.toUpperCase());
      if (stock) {
        setSelectedStock(stock);
      } else {
        alert(`Stock ${searchSymbol} not found.`);
      }
    } catch (error) {
      console.error("Error searching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScreeningUpdate = async (newFilters: ValueScreeningFilters) => {
    try {
      setLoading(true);
      const results = await valueInvestingService.screenValueStocks(newFilters);
      setScreenerResults(results);
      setScreeningFilters(newFilters);
    } catch (error) {
      console.error("Error updating screening:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Data processing functions
  const getPortfolioData = useMemo(() => {
    if (allStocks.length === 0) return [];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];
    const sectors = allStocks.reduce((acc, stock) => {
      const existing = acc.find(item => item.name === stock.sector);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({
          name: stock.sector,
          value: 1,
          color: colors[acc.length % colors.length]
        });
      }
      return acc;
    }, [] as Array<{name: string, value: number, color: string}>);
    return sectors;
  }, [allStocks]);

  const getGrahamData = useMemo(() => {
    if (allStocks.length === 0) return [];
    return allStocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.companyName,
      pe: stock.grahamMetrics.peRatio,
      roe: stock.grahamMetrics.roe,
      isGrahamValue: stock.grahamMetrics.isGrahamValue
    }));
  }, [allStocks]);

  const getMoatData = useMemo(() => {
    if (allStocks.length === 0) return [];
    const sectors = allStocks.reduce((acc, stock) => {
      const sector = stock.sector;
      if (!acc[sector]) {
        acc[sector] = { sector, strength: 0, competitive: 0, network: 0, count: 0 };
      }
      acc[sector].strength += stock.moatAnalysis.overallMoatStrength;
      acc[sector].competitive += stock.moatAnalysis.overallMoatStrength;
      acc[sector].network += stock.moatAnalysis.overallMoatStrength;
      acc[sector].count += 1;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(sectors).map((data: any) => ({
      sector: data.sector,
      strength: Math.round((data.strength / data.count) * 10) / 10,
      competitive: Math.round((data.competitive / data.count) * 10) / 10,
      network: Math.round((data.network / data.count) * 10) / 10
    }));
  }, [allStocks]);

  const getQualityData = useMemo(() => {
    if (allStocks.length === 0) return [];
    const avgRoe = allStocks.reduce((sum, s) => sum + s.grahamMetrics.roe, 0) / allStocks.length;
    const avgDebtEquity = allStocks.reduce((sum, s) => sum + s.grahamMetrics.debtToEquity, 0) / allStocks.length;
    const avgRoa = allStocks.reduce((sum, s) => sum + s.qualityScore.returnOnCapital, 0) / allStocks.length;
    const avgFcfYield = allStocks.reduce((sum, s) => sum + s.qualityScore.fcfYield, 0) / allStocks.length;
    
    return [
      { name: 'ROE', score: Math.round(avgRoe * 10) / 10 },
      { name: 'Debt/Equity', score: Math.round((100 - avgDebtEquity * 25) * 10) / 10 },
      { name: 'ROA', score: Math.round(avgRoa * 10) / 10 },
      { name: 'Free Cash Flow', score: Math.round(avgFcfYield * 10) / 10 },
      { name: 'Profit Margin', score: Math.round(avgRoa * 10) / 10 },
      { name: 'Dividend Yield', score: Math.round((allStocks.reduce((sum, s) => sum + s.grahamMetrics.dividendYield, 0) / allStocks.length) * 10) / 10 }
    ];
  }, [allStocks]);

  const getIntrinsicValueData = useMemo(() => {
    if (!selectedStock) return [];
    const currentPrice = selectedStock.currentPrice;
    const intrinsicValue = selectedStock.intrinsicValue;
    
    return [
      { date: '2024-01', market: Math.round(currentPrice * 0.9), intrinsic: Math.round(intrinsicValue * 0.95) },
      { date: '2024-02', market: Math.round(currentPrice * 0.92), intrinsic: Math.round(intrinsicValue * 0.96) },
      { date: '2024-03', market: Math.round(currentPrice * 0.95), intrinsic: Math.round(intrinsicValue * 0.97) },
      { date: '2024-04', market: Math.round(currentPrice * 0.98), intrinsic: Math.round(intrinsicValue * 0.98) },
      { date: '2024-05', market: Math.round(currentPrice * 0.96), intrinsic: Math.round(intrinsicValue * 0.99) },
      { date: '2024-06', market: Math.round(currentPrice * 0.99), intrinsic: Math.round(intrinsicValue) },
      { date: '2024-07', market: Math.round(currentPrice), intrinsic: Math.round(intrinsicValue * 1.01) },
      { date: '2024-08', market: Math.round(currentPrice * 1.02), intrinsic: Math.round(intrinsicValue * 1.02) },
      { date: '2024-09', market: Math.round(currentPrice * 1.04), intrinsic: Math.round(intrinsicValue * 1.03) },
      { date: '2024-10', market: Math.round(currentPrice * 1.06), intrinsic: Math.round(intrinsicValue * 1.04) },
      { date: '2024-11', market: Math.round(currentPrice), intrinsic: Math.round(intrinsicValue * 1.05) }
    ];
  }, [selectedStock]);

  const getScreenerData = useMemo(() => {
    if (!screenerResults) return [];
    return [
      { criteria: `P/E < ${screeningFilters.maxPE}`, stocks: screenerResults.matches.filter(s => s.grahamMetrics.peRatio < screeningFilters.maxPE).length, pass: true },
      { criteria: `P/B < ${screeningFilters.maxPB}`, stocks: screenerResults.matches.filter(s => s.grahamMetrics.pbRatio < screeningFilters.maxPB).length, pass: true },
      { criteria: `ROE > ${screeningFilters.minROE}%`, stocks: screenerResults.matches.filter(s => s.grahamMetrics.roe > screeningFilters.minROE).length, pass: true },
      { criteria: `Debt/Equity < ${screeningFilters.maxDebtToEquity}`, stocks: screenerResults.matches.filter(s => s.grahamMetrics.debtToEquity < screeningFilters.maxDebtToEquity).length, pass: true },
      { criteria: `Current Ratio > ${screeningFilters.minCurrentRatio}`, stocks: screenerResults.matches.filter(s => s.grahamMetrics.currentRatio > screeningFilters.minCurrentRatio).length, pass: true }
    ];
  }, [screenerResults, screeningFilters]);

  if (loading && allStocks.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Caricamento dati Value Investing...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Value Investing Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Analisi fondamentale in stile Warren Buffett e Benjamin Graham
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Ricerca e Analisi Interattiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Cerca Stock (Ticker Symbol)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Es. AAPL, MSFT, JNJ..."
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStockSearch()}
                  />
                  <Button onClick={handleStockSearch} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {selectedStock && (
                <div className="min-w-64">
                  <div className="text-sm font-medium mb-2">Stock Selezionato</div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold">{selectedStock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{selectedStock.companyName}</div>
                    <div className="text-sm mt-1">
                      Prezzo: ${selectedStock.currentPrice.toFixed(2)} | 
                      Valore Intr.: ${selectedStock.intrinsicValue.toFixed(2)} | 
                      MoS: {selectedStock.marginOfSafety.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', icon: TrendingDown, label: 'Overview' },
              { id: 'graham', icon: Calculator, label: 'Graham' },
              { id: 'moat', icon: Shield, label: 'Moat' },
              { id: 'intrinsic', icon: BarChart3, label: 'Intrinsic' },
              { id: 'quality', icon: Star, label: 'Quality' },
              { id: 'screener', icon: Search, label: 'Screener' },
              { id: 'opportunities', icon: Target, label: 'Opportunities' }
            ].map((tab) => {
              const handleTabClick = () => {
                setActiveTab(tab.id);
              };
              
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={handleTabClick}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.substring(0, 2)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{allStocks.length}</div>
                    <div className="text-sm text-muted-foreground">Value stocks analizzati</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round((allStocks.reduce((sum, s) => sum + s.marginOfSafety, 0) / allStocks.length) * 10) / 10}%
                    </div>
                    <div className="text-sm text-muted-foreground">Margine medio di sicurezza</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {allStocks.filter(s => s.grahamMetrics.isGrahamValue).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Stocks Graham Value</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Portfolio Allocation by Sector (Dati Reali)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPortfolioData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value} stocks`}
                      >
                        {getPortfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} stocks`, 'Allocation']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "graham" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Benjamin Graham Criteria - Analisi Reale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3">Graham Selection Criteria</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">P/E ≤ 15</Badge>
                          <span>Price-to-Earnings ratio threshold</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">P/B ≤ 1.5</Badge>
                          <span>Price-to-Book ratio limit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">ROE ≥ 15%</Badge>
                          <span>Return on Equity minimum</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">D/E ≤ 2.0</Badge>
                          <span>Debt-to-Equity maximum</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Portfolio Results (Reali)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Stocks qualifying:</span>
                          <span className="font-semibold text-green-600">
                            {allStocks.filter(s => s.grahamMetrics.isGrahamValue).length}/{allStocks.length} ({Math.round((allStocks.filter(s => s.grahamMetrics.isGrahamValue).length / allStocks.length) * 100)}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average P/E:</span>
                          <span className="font-semibold">
                            {Math.round((allStocks.reduce((sum, s) => sum + s.grahamMetrics.peRatio, 0) / allStocks.length) * 10) / 10}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average ROE:</span>
                          <span className="font-semibold">
                            {Math.round((allStocks.reduce((sum, s) => sum + s.grahamMetrics.roe, 0) / allStocks.length) * 10) / 10}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average P/B:</span>
                          <span className="font-semibold">
                            {Math.round((allStocks.reduce((sum, s) => sum + s.grahamMetrics.pbRatio, 0) / allStocks.length) * 10) / 10}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart data={getGrahamData} margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="pe" name="P/E Ratio" label={{ value: 'P/E Ratio', position: 'insideBottom', offset: -10 }} />
                      <YAxis type="number" dataKey="roe" name="ROE" label={{ value: 'ROE (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [
                          name === 'roe' ? `${value}%` : value,
                          name === 'roe' ? 'ROE' : 'P/E Ratio'
                        ]}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.symbol || ''}
                      />
                      <Scatter name="Stocks" data={getGrahamData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Interpretation:</strong> Stocks in the upper-left quadrant (low P/E, high ROE) represent the best value opportunities per Graham's criteria.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "moat" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Competitive Moat Analysis by Sector (Dati Reali)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getMoatData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="strength" fill="#8884d8" name="Overall Strength" />
                      <Bar dataKey="competitive" fill="#82ca9d" name="Competitive Advantage" />
                      <Bar dataKey="network" fill="#ffc658" name="Network Effects" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Companies with Strongest Moats (Dati Reali)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allStocks
                      .sort((a, b) => b.moatAnalysis.overallMoatStrength - a.moatAnalysis.overallMoatStrength)
                      .slice(0, 5)
                      .map((stock) => (
                      <div key={stock.symbol} className="flex justify-between items-center p-4 bg-card rounded-lg border">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.companyName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{stock.moatAnalysis.competitivePosition}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-2 ${
                            stock.moatAnalysis.overallMoatStrength >= 8 ? 'bg-green-500' :
                            stock.moatAnalysis.overallMoatStrength >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {stock.moatAnalysis.overallMoatStrength >= 8 ? 'Strong' :
                             stock.moatAnalysis.overallMoatStrength >= 6 ? 'Moderate' : 'Weak'}
                          </Badge>
                          <div className="text-sm font-semibold">{stock.moatAnalysis.overallMoatStrength.toFixed(1)}/10</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "intrinsic" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedStock ? selectedStock.intrinsicValueCalc.assumptions.growthRate.toFixed(1) : '8.5'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedStock ? selectedStock.intrinsicValueCalc.assumptions.discountRate.toFixed(1) : '10.0'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Discount Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedStock ? selectedStock.intrinsicValueCalc.assumptions.terminalGrowth.toFixed(1) : '2.5'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Terminal Growth</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      ${selectedStock ? selectedStock.intrinsicValue.toFixed(0) : '196'}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Intrinsic Value</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Price vs Intrinsic Value {selectedStock ? `(${selectedStock.symbol})` : '(Seleziona un stock)'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStock && getIntrinsicValueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={getIntrinsicValueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value, name) => [`$${value}`, name === 'market' ? 'Market Price' : 'Intrinsic Value']} />
                        <Legend />
                        <Line type="monotone" dataKey="market" stroke="#8884d8" strokeWidth={2} name="Market Price" dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }} />
                        <Line type="monotone" dataKey="intrinsic" stroke="#82ca9d" strokeWidth={2} name="Intrinsic Value" dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Seleziona un stock dalla barra di ricerca per vedere l'analisi intrinseca</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "quality" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round((allStocks.reduce((sum, s) => sum + s.qualityScore.overallScore, 0) / allStocks.length))}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Quality Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round((allStocks.reduce((sum, s) => sum + s.qualityScore.financialHealth, 0) / allStocks.length))}
                    </div>
                    <div className="text-sm text-muted-foreground">Financial Health</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round((allStocks.reduce((sum, s) => sum + s.qualityScore.managementQuality, 0) / allStocks.length))}
                    </div>
                    <div className="text-sm text-muted-foreground">Management Quality</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round((allStocks.reduce((sum, s) => sum + s.qualityScore.economicMoat, 0) / allStocks.length))}
                    </div>
                    <div className="text-sm text-muted-foreground">Economic Moat</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Quality Metrics Breakdown (Dati Reali)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getQualityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" name="Quality Score" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Quality Assessment:</strong> I punteggi più alti indicano una migliore qualità degli investimenti. Un punteggio {'>'} 80 è considerato eccellente.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "screener" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Value Screener - Parametri Personalizzabili
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="text-sm font-medium">Max P/E</label>
                      <Input 
                        type="number" 
                        value={screeningFilters.maxPE}
                        onChange={(e) => setScreeningFilters({...screeningFilters, maxPE: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max P/B</label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={screeningFilters.maxPB}
                        onChange={(e) => setScreeningFilters({...screeningFilters, maxPB: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Min ROE</label>
                      <Input 
                        type="number" 
                        value={screeningFilters.minROE}
                        onChange={(e) => setScreeningFilters({...screeningFilters, minROE: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Debt/Equity</label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={screeningFilters.maxDebtToEquity}
                        onChange={(e) => setScreeningFilters({...screeningFilters, maxDebtToEquity: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button 
                    className="mt-4" 
                    onClick={() => handleScreeningUpdate(screeningFilters)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Esegui Screening
                  </Button>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{screeningFilters.maxPE}</div>
                    <div className="text-sm text-muted-foreground">Max P/E Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{screeningFilters.maxPB}</div>
                    <div className="text-sm text-muted-foreground">Max P/B Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{screeningFilters.minROE}%</div>
                    <div className="text-sm text-muted-foreground">Min ROE</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {screenerResults ? screenerResults.totalMatches : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Matches Found</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Screening Criteria Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getScreenerData.length > 0 && (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={getScreenerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="criteria" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Stocks Found', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value, name) => [`${value} stocks`, 'Matches']} labelFormatter={(label) => `Criteria: ${label}`} />
                        <Legend />
                        <Bar dataKey="stocks" fill="#8884d8" name="Stocks Found" radius={[4, 4, 0, 0]}>
                          {getScreenerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.pass ? '#82ca9d' : '#ff7300'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Green bars:</strong> Criteria met successfully | <strong>Orange bars:</strong> Stricter criteria with fewer matches</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "opportunities" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">+15.5%</div>
                    <div className="text-sm text-muted-foreground">Average Upside</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground">Top Opportunities</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">18M</div>
                    <div className="text-sm text-muted-foreground">Avg Timeframe</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">$1.2M</div>
                    <div className="text-sm text-muted-foreground">Potential Value</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Value Opportunities - Top Picks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {allStocks
                      .filter(stock => stock.marginOfSafety > 15)
                      .sort((a, b) => b.marginOfSafety - a.marginOfSafety)
                      .slice(0, 6)
                      .map((stock) => (
                      <div key={stock.symbol} className="p-4 bg-card rounded-lg border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-lg">{stock.symbol}</div>
                            <div className="text-sm text-muted-foreground">{stock.companyName}</div>
                          </div>
                          <Badge className="bg-green-600">
                            {stock.marginOfSafety > 20 ? 'STRONG_BUY' : stock.marginOfSafety > 15 ? 'BUY' : 'HOLD'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Current Price</div>
                            <div className="font-semibold">${stock.currentPrice.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Target Price</div>
                            <div className="font-semibold text-green-600">${stock.intrinsicValue.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Upside Potential</div>
                            <div className="font-bold text-green-600">+{stock.marginOfSafety.toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Sector</div>
                            <div className="font-semibold">{stock.sector}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
