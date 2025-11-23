/**
 * Alternative Investments Dashboard - Stile Bridgewater/Citadel
 * Dashboard completa per investimenti alternativi con 7 tabs specialistici
 * 
 * CORREZIONI LAYOUT RESPONSIVE:
 * - Grid responsive per tabs (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7)
 * - Scroll orizzontale su mobile per evitare sovrapposizione
 * - Icone e testo responsive con breakpoints
 * - Miglior spacing tra sezioni (space-y-8 invece di space-y-6)
 * - Grid gap responsive (gap-4 md:gap-6)
 * - Padding aggiuntivo per tabs container
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { useAlternativeInvestments } from '@/services/AlternativeInvestmentsService';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building,
  Coins,
  Globe,
  Database,
  Brain,
  Shield,
  Zap
} from 'lucide-react';

// Colori per i grafici istituzionali
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  orange: '#F97316',
  indigo: '#6366F1',
  emerald: '#059669'
};

const RADIAL_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AlternativeInvestments() {
  const { t } = useTranslation();
  const {
    privateEquityFunds,
    reitPortfolio,
    commodityPositions,
    hedgeFundStrategies,
    alternativeDataSources,
    performanceHistory,
    riskMetrics,
    signals,
    isLoading,
    generateSignals,
    calculatePortfolioMetrics,
    getTopPerformers
  } = useAlternativeInvestments();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  const [activeTab, setActiveTab] = useState('pe-analysis');

  // Calcola metriche aggregate
  const portfolioMetrics = useMemo(() => {
    const allocations = {
      'Private Equity': 25,
      'REITs': 20,
      'Commodities': 15,
      'Hedge Funds': 25,
      'Alternative Data': 15
    };
    return calculatePortfolioMetrics(allocations);
  }, [calculatePortfolioMetrics]);

  const topPerformers = getTopPerformers();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alternative Investments</h1>
            <p className="text-muted-foreground">
              Portfolio avanzato di investimenti alternativi stile Bridgewater/Citadel
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateSignals} 
              disabled={isLoading}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate AI Signals'}
            </Button>
            <Badge variant="outline" className="gap-2">
              <Activity className="h-4 w-4" />
              Real-time
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.45B</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% YTD
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.45</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above benchmark
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VaR (95%)</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-8.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  High risk period
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{signals.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last update: 2m ago
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto p-2">
            <TabsTrigger value="pe-analysis" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">PE </span>Analysis
            </TabsTrigger>
            <TabsTrigger value="reit-portfolio" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">REIT </span>Portfolio
            </TabsTrigger>
            <TabsTrigger value="commodities" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
              Commodities
            </TabsTrigger>
            <TabsTrigger value="hedge-funds" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Hedge Fund </span>Strategies
            </TabsTrigger>
            <TabsTrigger value="alternative-data" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Alternative </span>Data
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Performance </span>Analytics
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Risk </span>Assessment
            </TabsTrigger>
          </TabsList>

          {/* PE Analysis Tab */}
          <TabsContent value="pe-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* PE Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Private Equity Performance</CardTitle>
                  <CardDescription>Rendimento vs benchmark per vintage year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={privateEquityFunds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="vintage_year" 
                        type="number" 
                        domain={['dataMin', 'dataMax']}
                        name="Vintage Year"
                      />
                      <YAxis 
                        dataKey="irr" 
                        type="number" 
                        domain={['dataMin - 5', 'dataMax + 5']}
                        name="IRR %"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          name === 'irr' ? `${value}%` : value,
                          name === 'irr' ? 'IRR' : name
                        ]}
                        labelFormatter={(label) => `Vintage: ${label}`}
                      />
                      <Scatter 
                        dataKey="irr" 
                        fill={COLORS.primary}
                        fillOpacity={0.7}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* PE Sector Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                  <CardDescription>Distribuzione settoriale degli investimenti PE</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          privateEquityFunds.reduce((acc, fund) => {
                            acc[fund.sector] = (acc[fund.sector] || 0) + fund.investment_amount;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([sector, value]) => ({ name: sector, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(
                          privateEquityFunds.reduce((acc, fund) => {
                            acc[fund.sector] = (acc[fund.sector] || 0) + fund.investment_amount;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RADIAL_COLORS[index % RADIAL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* PE Funds Table */}
            <Card>
              <CardHeader>
                <CardTitle>Private Equity Fund Details</CardTitle>
                <CardDescription>Dettaglio completo dei fondi PE nel portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {privateEquityFunds.map((fund) => (
                    <div key={fund.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{fund.name}</h3>
                          <p className="text-sm text-muted-foreground">{fund.sector} • {fund.vintage_year}</p>
                        </div>
                        <Badge 
                          variant={fund.risk_rating === 'Low' ? 'default' : 
                                 fund.risk_rating === 'Medium' ? 'secondary' : 
                                 fund.risk_rating === 'High' ? 'destructive' : 'outline'}
                        >
                          {fund.risk_rating} Risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">IRR:</span>
                          <span className={`ml-2 font-medium ${fund.irr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {fund.irr}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">MOIC:</span>
                          <span className="ml-2 font-medium">{fund.moic}x</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Investment:</span>
                          <span className="ml-2 font-medium">${(fund.investment_amount / 1000000).toFixed(1)}M</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Val:</span>
                          <span className="ml-2 font-medium">${(fund.current_valuation / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REIT Portfolio Tab */}
          <TabsContent value="reit-portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* REIT Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>REIT Performance Analysis</CardTitle>
                  <CardDescription>Yield vs NAV premium analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={reitPortfolio}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="current_yield" 
                        name="Yield %"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis 
                        dataKey="price_to_nav" 
                        name="Price to NAV"
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          name === 'current_yield' ? `${value}%` : value,
                          name === 'current_yield' ? 'Yield' : 'P/NAV'
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;
                          return item ? `${item.name}` : '';
                        }}
                      />
                      <Scatter 
                        dataKey="price_to_nav" 
                        fill={COLORS.secondary}
                        fillOpacity={0.7}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sector Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sector Distribution</CardTitle>
                  <CardDescription>REIT allocation by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(
                      reitPortfolio.reduce((acc, reit) => {
                        Object.entries(reit.property_type_allocation).forEach(([sector, weight]) => {
                          acc[sector] = (acc[sector] || 0) + weight;
                        });
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([sector, weight]) => ({ sector, weight }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="weight" fill={COLORS.accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* REIT Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>REIT Key Metrics</CardTitle>
                <CardDescription>Performance indicators and financial health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reitPortfolio.map((reit) => (
                    <div key={reit.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{reit.name}</h3>
                        <Badge variant="outline">{reit.symbol}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Market Cap:</span>
                          <span className="font-medium">${(reit.market_cap / 1000000000).toFixed(1)}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Yield:</span>
                          <span className="font-medium text-green-600">{reit.current_yield}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">FFO Growth:</span>
                          <span className="font-medium">{reit.dividend_growth_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupancy:</span>
                          <span className="font-medium">{reit.occupancy_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">1Y Return:</span>
                          <span className={`font-medium ${reit.historical_returns_1y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {reit.historical_returns_1y}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commodities Tab */}
          <TabsContent value="commodities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Commodity Price Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Commodity Price Trends</CardTitle>
                  <CardDescription>24h price changes by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={commodityPositions.map(c => ({
                      name: c.symbol,
                      change: c.price_change_percentage_24h,
                      category: c.category
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value}%`, '24h Change']}
                        labelFormatter={(label) => `Symbol: ${label}`}
                      />
                      <Bar 
                        dataKey="change"
                      >
                        {commodityPositions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.price_change_percentage_24h > 0 ? COLORS.secondary : COLORS.danger} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Volatility Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Volatility Analysis</CardTitle>
                  <CardDescription>30-day historical volatility by commodity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={commodityPositions.map(c => ({
                      name: c.name,
                      volatility: c.historical_volatility_30d,
                      current_price: c.current_price
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          name === 'volatility' ? `${value}%` : `$${value}`,
                          name === 'volatility' ? 'Volatility' : 'Price'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="volatility" 
                        stroke={COLORS.purple}
                        fill={COLORS.purple}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Commodity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Commodity Positions</CardTitle>
                <CardDescription>Detailed analysis of commodity holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commodityPositions.map((commodity) => (
                    <div key={commodity.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Coins className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{commodity.name}</h3>
                            <p className="text-sm text-muted-foreground">{commodity.category}</p>
                          </div>
                        </div>
                        <Badge variant={commodity.trend_analysis === 'Bullish' ? 'default' : 
                                     commodity.trend_analysis === 'Bearish' ? 'destructive' : 'secondary'}>
                          {commodity.trend_analysis}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-2 font-medium">
                            ${commodity.current_price.toFixed(commodity.current_price < 10 ? 2 : 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">24h Change:</span>
                          <span className={`ml-2 font-medium flex items-center gap-1 ${
                            commodity.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {commodity.price_change_percentage_24h > 0 ? 
                              <ArrowUpRight className="h-3 w-3" /> : 
                              <ArrowDownRight className="h-3 w-3" />
                            }
                            {Math.abs(commodity.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volatility:</span>
                          <span className="ml-2 font-medium">{commodity.historical_volatility_30d}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk Score:</span>
                          <span className="ml-2 font-medium">{commodity.risk_adjusted_score}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hedge Fund Strategies Tab */}
          <TabsContent value="hedge-funds" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Strategy Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Performance Comparison</CardTitle>
                  <CardDescription>Risk-adjusted returns by strategy type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={hedgeFundStrategies.map(strategy => ({
                      name: strategy.name.split(' ')[0] + ' ' + strategy.name.split(' ')[1],
                      return: strategy.return_1y,
                      sharpe: strategy.sharpe_ratio,
                      drawdown: Math.abs(strategy.max_drawdown),
                      type: strategy.type
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="return" fill={COLORS.primary} />
                      <Line yAxisId="right" type="monotone" dataKey="sharpe" stroke={COLORS.accent} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AUM Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Assets Under Management</CardTitle>
                  <CardDescription>AUM distribution by strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={hedgeFundStrategies.map(strategy => ({
                          name: strategy.type,
                          value: strategy.aum
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {hedgeFundStrategies.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RADIAL_COLORS[index % RADIAL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${(value / 1000000000).toFixed(1)}B`, 'AUM']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Strategy Details */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis by hedge fund strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hedgeFundStrategies.map((strategy) => (
                    <div key={strategy.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground">{strategy.type}</p>
                        </div>
                        <Badge variant="outline">${(strategy.aum / 1000000000).toFixed(1)}B AUM</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{strategy.return_1y}%</div>
                          <div className="text-xs text-muted-foreground">1Y Return</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{strategy.sharpe_ratio}</div>
                          <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{strategy.max_drawdown}%</div>
                          <div className="text-xs text-muted-foreground">Max Drawdown</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{strategy.win_rate}%</div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{strategy.profit_factor}</div>
                          <div className="text-xs text-muted-foreground">Profit Factor</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Success Probability:</span>
                        <Progress value={strategy.success_probability} className="flex-1" />
                        <span className="text-sm font-medium">{strategy.success_probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alternative Data Tab */}
          <TabsContent value="alternative-data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* ROI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>ROI Analysis by Data Category</CardTitle>
                  <CardDescription>Return on investment for alternative data sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alternativeDataSources.map(source => ({
                      name: source.name.split(' ')[0],
                      roi: source.roi_estimate,
                      adoption: source.market_adoption_rate,
                      category: source.category
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          name === 'roi' ? `${value}%` : `${value}%`,
                          name === 'roi' ? 'ROI Estimate' : 'Market Adoption'
                        ]}
                      />
                      <Bar dataKey="roi" fill={COLORS.emerald} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Data Quality vs Predictive Power */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Quality vs Predictive Power</CardTitle>
                  <CardDescription>Alternative data effectiveness matrix</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={alternativeDataSources.map(source => ({
                      name: source.name.split(' ')[0] + ' ' + source.category.split(' ')[0],
                      quality: source.data_quality_score,
                      predictive: source.predictive_power,
                      complexity: source.implementation_complexity
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="quality" 
                        name="Data Quality"
                        domain={[0, 10]}
                      />
                      <YAxis 
                        dataKey="predictive" 
                        name="Predictive Power"
                        domain={[0, 10]}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          value.toFixed(1),
                          name === 'quality' ? 'Data Quality' : 'Predictive Power'
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;
                          return item ? item.name : '';
                        }}
                      />
                      <Scatter 
                        dataKey="predictive" 
                        fill={COLORS.purple}
                        fillOpacity={0.7}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alternative Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Alternative Data Sources</CardTitle>
                <CardDescription>Comprehensive analysis of alternative data implementations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {alternativeDataSources.map((source) => (
                    <div key={source.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{source.name}</h3>
                          <p className="text-sm text-muted-foreground">{source.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={source.cost_tier === 'Premium' ? 'destructive' : 
                                         source.cost_tier === 'High' ? 'secondary' : 'default'}>
                            {source.cost_tier} Cost
                          </Badge>
                          <Badge variant="outline">
                            {source.implementation_complexity} Complexity
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="ml-2 font-medium">{source.frequency}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Historical Depth:</span>
                          <span className="ml-2 font-medium">{source.historical_depth} years</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI Estimate:</span>
                          <span className="ml-2 font-medium text-green-600">{source.roi_estimate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Adoption:</span>
                          <span className="ml-2 font-medium">{source.market_adoption_rate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quality Score:</span>
                        <Progress value={source.data_quality_score * 10} className="flex-1" />
                        <span className="text-sm font-medium">{source.data_quality_score}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Predictive Power:</span>
                        <Progress value={source.predictive_power * 10} className="flex-1" />
                        <span className="text-sm font-medium">{source.predictive_power}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Alternative vs traditional investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          `${value.toFixed(2)}%`,
                          name === 'blended_alternative_return' ? 'Alternative Portfolio' :
                          name === 'traditional_portfolio_return' ? 'Traditional Portfolio' : name
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="blended_alternative_return" 
                        stroke={COLORS.primary}
                        strokeWidth={3}
                        name="Alternative Portfolio"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="traditional_portfolio_return" 
                        stroke={COLORS.accent}
                        strokeWidth={2}
                        name="Traditional Portfolio"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk-Adjusted Returns */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk-Adjusted Performance</CardTitle>
                  <CardDescription>Sharpe ratio comparison over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceHistory.map(p => ({
                      period: p.period,
                      sharpe: p.sharpe_ratio,
                      excess_return: p.excess_return
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis 
                        tickFormatter={(value) => value.toFixed(2)}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          value.toFixed(2),
                          name === 'sharpe' ? 'Sharpe Ratio' : 'Excess Return'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sharpe" 
                        stroke={COLORS.secondary}
                        fill={COLORS.secondary}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key performance metrics across asset classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Asset Class Performance (1Y)</h3>
                    {[
                      { name: 'Private Equity', return: 22.5, color: COLORS.primary },
                      { name: 'Alternative Data', return: 15.2, color: COLORS.secondary },
                      { name: 'Hedge Funds', return: 12.8, color: COLORS.accent },
                      { name: 'REITs', return: 11.2, color: COLORS.purple },
                      { name: 'Commodities', return: 6.5, color: COLORS.pink }
                    ].map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <span className="text-sm">{asset.name}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-16 h-2 rounded-full"
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="text-sm font-medium w-12 text-right">{asset.return}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Portfolio Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Expected Return:</span>
                        <span className="text-sm font-medium">{portfolioMetrics.expectedReturn.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Volatility:</span>
                        <span className="text-sm font-medium">{(portfolioMetrics.volatility * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sharpe Ratio:</span>
                        <span className="text-sm font-medium">{portfolioMetrics.sharpeRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">VaR (95%):</span>
                        <span className="text-sm font-medium text-red-600">{portfolioMetrics.var95.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Drawdown:</span>
                        <span className="text-sm font-medium text-red-600">{portfolioMetrics.maxDrawdown.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Top Performers</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best PE Fund:</span>
                        <span className="text-sm font-medium text-green-600">{topPerformers.bestPE.irr}% IRR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best REIT:</span>
                        <span className="text-sm font-medium text-green-600">{topPerformers.bestREIT.historical_returns_1y}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best Commodity:</span>
                        <span className="text-sm font-medium text-green-600">{topPerformers.bestCommodity.price_change_percentage_24h.toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best Hedge Fund:</span>
                        <span className="text-sm font-medium text-green-600">{topPerformers.bestHedgeFund.return_1y}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risk-assessment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Risk Metrics Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics Overview</CardTitle>
                  <CardDescription>Comprehensive risk assessment dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Value at Risk (95%)</span>
                        <span className="font-medium">{riskMetrics?.var_95}%</span>
                      </div>
                      <Progress value={Math.abs(riskMetrics?.var_95 || 0) * 5} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Value at Risk (99%)</span>
                        <span className="font-medium">{riskMetrics?.var_99}%</span>
                      </div>
                      <Progress value={Math.abs(riskMetrics?.var_99 || 0) * 4} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Expected Shortfall</span>
                        <span className="font-medium">{riskMetrics?.expected_shortfall}%</span>
                      </div>
                      <Progress value={Math.abs(riskMetrics?.expected_shortfall || 0) * 3} />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{riskMetrics?.leverage_factor}</div>
                        <div className="text-xs text-muted-foreground">Leverage Factor</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(riskMetrics?.concentration_risk || 0) * 100}%</div>
                        <div className="text-xs text-muted-foreground">Concentration Risk</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Decomposition */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Decomposition</CardTitle>
                  <CardDescription>Risk source allocation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(riskMetrics?.risk_decomposition || {}).map(([source, weight]) => ({
                          name: source,
                          value: weight * 100
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(riskMetrics?.risk_decomposition || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RADIAL_COLORS[index % RADIAL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Risk Contribution']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stress Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>Stress Test Analysis</CardTitle>
                <CardDescription>Portfolio impact under various market scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics?.stress_test_results.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{test.scenario}</h3>
                        <Badge variant={test.portfolio_impact < -15 ? 'destructive' : 
                                       test.portfolio_impact < -10 ? 'secondary' : 'default'}>
                          {test.portfolio_impact}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Portfolio Impact:</span>
                          <span className={`ml-2 font-medium ${test.portfolio_impact < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {test.portfolio_impact}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recovery Time:</span>
                          <span className="ml-2 font-medium">{test.time_to_recovery} months</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Impact Severity:</span>
                        <Progress 
                          value={Math.abs(test.portfolio_impact) * 4} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Management Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Recommendations</CardTitle>
                <CardDescription>AI-powered risk mitigation suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Current Risks
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">High Concentration Risk</p>
                          <p className="text-xs text-muted-foreground">
                            35% exposure in private equity requires diversification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Liquidity Risk Elevated</p>
                          <p className="text-xs text-muted-foreground">
                            40% in illiquid assets during market stress
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Currency Exposure</p>
                          <p className="text-xs text-muted-foreground">
                            18% unhedged international positions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Increase REIT Allocation</p>
                          <p className="text-xs text-muted-foreground">
                            Add 5-10% to improve liquidity profile
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Implement Currency Hedges</p>
                          <p className="text-xs text-muted-foreground">
                            Hedge 50% of international exposure
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Add Market Neutral Strategies</p>
                          <p className="text-xs text-muted-foreground">
                            Reduce portfolio beta through neutral positions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}