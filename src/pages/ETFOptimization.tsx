import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calculator,
  Shield,
  ArrowUpDown,
  DollarSign,
  Percent,
  Activity,
  Layers,
  Zap,
  Users,
  Building,
  Globe,
  BarChart3,
  Sparkles,
  Timer,
  RefreshCw,
  LineChart,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  etfOptimizationService,
  type ETF,
  type FactorExposure,
  type SmartBetaStrategy,
  type AssetAllocation,
  type TaxLossHarvesting,
  type PortfolioOptimization,
  type IndexReplication,
  type ETFMetrics
} from "@/services/ETFOptimizationService";

// === DATA FOR CHARTS ===

// Risk vs Return scatter data
const RISK_RETURN_DATA = [
  { name: 'SPY', risk: 16.2, return: 10.8, aum: 567.8, expense: 0.094 },
  { name: 'QQQ', risk: 22.4, return: 12.4, aum: 245.7, expense: 0.20 },
  { name: 'VTI', risk: 15.8, return: 10.5, aum: 387.5, expense: 0.03 },
  { name: 'IWM', risk: 20.1, return: 11.2, aum: 76.9, expense: 0.19 },
  { name: 'VTV', risk: 17.3, return: 9.8, aum: 89.4, expense: 0.04 },
  { name: 'VUG', risk: 18.9, return: 11.9, aum: 98.8, expense: 0.04 },
  { name: 'QUAL', risk: 16.8, return: 11.3, aum: 12.4, expense: 0.15 },
  { name: 'USMV', risk: 12.4, return: 9.2, aum: 31.2, expense: 0.15 },
  { name: 'XLK', risk: 24.7, return: 13.2, aum: 45.8, expense: 0.12 },
  { name: 'VEA', risk: 17.4, return: 9.4, aum: 87.7, expense: 0.05 },
  { name: 'BND', risk: 5.2, return: 3.8, aum: 334.9, expense: 0.035 },
  { name: 'GLD', risk: 19.3, return: 7.2, aum: 58.9, expense: 0.40 }
];

// Factor exposure heatmap data
const FACTOR_EXPOSURE_DATA = [
  { factor: 'Value', SPY: 0.12, VTI: 0.35, VTV: 0.89, VUG: 0.08, QUAL: 0.45, USMV: 0.62 },
  { factor: 'Growth', SPY: 0.85, VTI: 0.62, VTV: 0.11, VUG: 0.92, QUAL: 0.52, USMV: 0.38 },
  { factor: 'Momentum', SPY: 0.67, VTI: 0.58, VTV: 0.34, VUG: 0.78, QUAL: 0.61, USMV: 0.29 },
  { factor: 'Quality', SPY: 0.78, VTI: 0.71, VTV: 0.67, VUG: 0.72, QUAL: 0.94, USMV: 0.84 },
  { factor: 'Low Vol', SPY: 0.23, VTI: 0.34, VTV: 0.45, VUG: 0.18, QUAL: 0.52, USMV: 0.96 }
];

// Portfolio allocation pie data
const PORTFOLIO_ALLOCATION_DATA = [
  { name: 'US Equity', value: 45, color: '#0088FE' },
  { name: 'International', value: 20, color: '#00C49F' },
  { name: 'Fixed Income', value: 25, color: '#FFBB28' },
  { name: 'REITs', value: 5, color: '#FF8042' },
  { name: 'Commodities', value: 5, color: '#8884d8' }
];

// Smart Beta heatmap data
const SMART_BETA_HEATMAP = [
  { strategy: 'Enhanced Value', SPY: 0.3, QQQ: 0.1, VTI: 0.5, IWM: 0.7, VTV: 0.9, VUG: 0.2 },
  { strategy: 'Risk Parity', SPY: 0.6, QQQ: 0.4, VTI: 0.7, IWM: 0.5, VTV: 0.8, VUG: 0.6 },
  { strategy: 'Min Variance', SPY: 0.4, QQQ: 0.2, VTI: 0.6, IWM: 0.3, VTV: 0.5, VUG: 0.4 },
  { strategy: 'Max Sharpe', SPY: 0.8, QQQ: 0.9, VTI: 0.7, IWM: 0.6, VTV: 0.4, VUG: 0.8 }
];

// Efficient frontier data
const EFFICIENT_FRONTIER = [
  { risk: 5.2, return: 3.8, portfolio: 'Conservative Bond' },
  { risk: 8.4, return: 5.2, portfolio: 'Conservative Balanced' },
  { risk: 12.1, return: 7.1, portfolio: 'Moderate Balanced' },
  { risk: 15.8, return: 9.5, portfolio: 'Growth Balanced' },
  { risk: 19.2, return: 11.8, portfolio: 'Aggressive Growth' },
  { risk: 22.4, return: 13.2, portfolio: 'Maximum Growth' }
];

// Tax calendar data
const TAX_CALENDAR = [
  { month: 'Gen', opportunities: 2, potential_savings: 1250 },
  { month: 'Feb', opportunities: 1, potential_savings: 890 },
  { month: 'Mar', opportunities: 3, potential_savings: 2100 },
  { month: 'Apr', opportunities: 1, potential_savings: 750 },
  { month: 'Mag', opportunities: 2, potential_savings: 1650 },
  { month: 'Giu', opportunities: 0, potential_savings: 0 },
  { month: 'Lug', opportunities: 1, potential_savings: 950 },
  { month: 'Ago', opportunities: 2, potential_savings: 1400 },
  { month: 'Set', opportunities: 4, potential_savings: 3200 },
  { month: 'Ott', opportunities: 3, potential_savings: 2800 },
  { month: 'Nov', opportunities: 2, potential_savings: 1800 },
  { month: 'Dic', opportunities: 1, potential_savings: 1100 }
];

// Index tracking data
const INDEX_TRACKING_DATA = [
  { name: 'S&P 500', tracking_error: 0.12, correlation: 0.99, r_squared: 0.98, tracking_difference: -0.08 },
  { name: 'NASDAQ 100', tracking_error: 0.18, correlation: 0.98, r_squared: 0.96, tracking_difference: 0.15 },
  { name: 'Russell 2000', tracking_error: 0.25, correlation: 0.97, r_squared: 0.94, tracking_difference: -0.12 },
  { name: 'MSCI EAFE', tracking_error: 0.32, correlation: 0.96, r_squared: 0.92, tracking_difference: 0.22 }
];

// Rebalancing suggestions data
const REBALANCING_SUGGESTIONS = [
  { asset: 'US Equity', current: 48.2, target: 45.0, difference: -3.2, action: 'Reduce', priority: 'Medium' },
  { asset: 'International', current: 18.5, target: 20.0, difference: 1.5, action: 'Increase', priority: 'Low' },
  { asset: 'Fixed Income', current: 27.8, target: 25.0, difference: -2.8, action: 'Reduce', priority: 'High' },
  { asset: 'REITs', current: 3.2, target: 5.0, difference: 1.8, action: 'Increase', priority: 'Medium' },
  { asset: 'Commodities', current: 2.3, target: 5.0, difference: 2.7, action: 'Increase', priority: 'High' }
];

export default function ETFOptimization() {
  // State management
  const [etfs, setETFs] = useState<ETF[]>([]);
  const [factorExposures, setFactorExposures] = useState<FactorExposure[]>([]);
  const [smartBetaStrategies, setSmartBetaStrategies] = useState<SmartBetaStrategy[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<PortfolioOptimization | null>(null);
  const [taxHarvesting, setTaxHarvesting] = useState<TaxLossHarvesting[]>([]);
  const [rebalancing, setRebalancing] = useState<AssetAllocation[]>([]);
  const [indexReplication, setIndexReplication] = useState<IndexReplication[]>([]);
  const [etfMetrics, setETFMetrics] = useState<ETFMetrics | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Load all data on component mount
  useEffect(() => {
    console.log("ETF Optimization component mounted");
    
    const loadData = async () => {
      try {
        console.log("Loading ETF Optimization data...");
        setLoading(true);
        
        console.log("Caricamento dati ETF...");
        
        // Load ETFs
        const etfData = await etfOptimizationService.getETFData();
        setETFs(etfData);
        console.log(`Loaded ETFs: ${etfData.length} funds`);
        
        console.log("Calcolo factor exposures...");
        
        // Load factor exposures
        const factorData = await etfOptimizationService.getFactorExposures();
        setFactorExposures(factorData);
        console.log(`Loaded factor exposures: ${factorData.length} factors`);
        
        console.log("Analisi strategie Smart Beta...");
        
        // Load smart beta strategies
        const smartBetaData = await etfOptimizationService.calculateSmartBeta();
        setSmartBetaStrategies(smartBetaData);
        console.log(`Loaded smart beta strategies: ${smartBetaData.length} strategies`);
        
        console.log("Ottimizzazione portafoglio con MPT...");
        
        // Portfolio optimization
        const optimizationData = await etfOptimizationService.optimizePortfolio();
        setOptimizationResult(optimizationData);
        console.log("Portfolio optimization:", optimizationData);
        
        console.log("Analisi Tax Loss Harvesting...");
        
        // Tax loss harvesting
        const taxData = await etfOptimizationService.generateTaxLossHarvest();
        setTaxHarvesting(taxData);
        console.log(`Tax loss harvesting: ${taxData.length} opportunities`);
        
        console.log("Calcolo rebalancing suggestions...");
        
        // Rebalancing
        const rebalanceData = await etfOptimizationService.rebalancePortfolio();
        setRebalancing(rebalanceData);
        console.log(`Rebalancing needs: ${rebalanceData.length} adjustments`);
        
        console.log("Analisi index replication...");
        
        // Index replication
        const indexData = await etfOptimizationService.getIndexReplication();
        setIndexReplication(indexData);
        console.log(`Index replication: ${indexData.length} indices`);
        
        console.log("Calcolo metriche ETF...");
        
        // ETF metrics
        const metricsData = await etfOptimizationService.getETFAggregateMetrics();
        setETFMetrics(metricsData);
        console.log("ETF aggregate metrics:", metricsData);
        
        setLoading(false);
        console.log("ETF Optimization data loaded successfully");
        
      } catch (error) {
        console.error("Error loading ETF Optimization data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Caricamento dati ETF Optimization...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PieChart className="h-8 w-8" />
              ETF & Index Fund Optimization
              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                REAL-TIME DATA
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-2">
              Ottimizzazione portafogli ETF con strategie BlackRock/Vanguard Style - Dati di mercato in tempo reale
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Market Data</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Real-time Optimization</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Activity className="h-4 w-4 mr-1" />
              {etfs.length} ETF Analizzati
            </Badge>
            {etfMetrics && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Total AUM: ${etfMetrics.totalAUM.toFixed(1)}B</p>
                <p>Avg Expense: {etfMetrics.averageExpenseRatio.toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => {
                console.log('Clicking tab: overview');
                setActiveTab('overview');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Ov</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: factors');
                setActiveTab('factors');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'factors'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Factor Analysis</span>
              <span className="sm:hidden">Fa</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: smartbeta');
                setActiveTab('smartbeta');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'smartbeta'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Beta</span>
              <span className="sm:hidden">Sb</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: optimizer');
                setActiveTab('optimizer');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'optimizer'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio Optimizer</span>
              <span className="sm:hidden">Po</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: tax');
                setActiveTab('tax');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tax'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Tax Optimization</span>
              <span className="sm:hidden">To</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: tracking');
                setActiveTab('tracking');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tracking'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Index Tracking</span>
              <span className="sm:hidden">It</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: rebalancing');
                setActiveTab('rebalancing');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rebalancing'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Rebalancing</span>
              <span className="sm:hidden">Rb</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Risk vs Return Scatter Plot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk vs Return Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <ScatterChart data={RISK_RETURN_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="risk" 
                          name="Risk (Volatility %)"
                          domain={[0, 30]}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="return" 
                          name="Return (%)"
                          domain={[0, 20]}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{data.name}</p>
                                  <p className="text-sm">Risk: {data.risk.toFixed(1)}%</p>
                                  <p className="text-sm">Return: {data.return.toFixed(1)}%</p>
                                  <p className="text-sm">AUM: ${data.aum}B</p>
                                  <p className="text-sm">Expense: {data.expense}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          dataKey="return" 
                          fill="#3b82f6"
                          fillOpacity={0.7}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Portfolio Allocation Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div style={{ width: '100%', height: '300px' }}>
                      <ResponsiveContainer>
                        <RechartsPieChart>
                          <Pie
                            data={PORTFOLIO_ALLOCATION_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {PORTFOLIO_ALLOCATION_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Asset Class Breakdown</h4>
                      {PORTFOLIO_ALLOCATION_DATA.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ETF Performance Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Top Performing ETFs
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Live Data</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {etfs.slice(0, 6).map((etf, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{etf.symbol}</h4>
                              <p className="text-sm text-muted-foreground">{etf.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">+{etf.ytdReturn.toFixed(1)}%</p>
                              <p className="text-xs text-muted-foreground">YTD Return</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <span>Expense: {etf.expenseRatio.toFixed(2)}%</span>
                            <span>AUM: ${(etf.aum / 1000).toFixed(1)}B</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "factors" && (
            <div className="space-y-6">
              {(() => {
                console.log('Rendering factors tab content');
                return (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Factor Exposure Analysis
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Real-time Calculation</span>
                        </div>
                      </div>
                      <CardDescription>
                        Factor investing analysis: Value, Growth, Momentum, Quality, Low Volatility
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        console.log('Factor Analysis tab content rendering - activeTab:', activeTab);
                        return (
                          <>
                            <div className="text-green-600 font-semibold">Factor Analysis tab caricato con successo!</div>
                            <p className="text-muted-foreground mt-2">Analisi Factor Exposure con heat map interattiva.</p>
                            <div style={{ width: '100%', height: '400px' }}>
                              <ResponsiveContainer>
                                <BarChart data={FACTOR_EXPOSURE_DATA}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="factor" />
                                  <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                  <Tooltip 
                                    content={({ active, payload, label }) => {
                                      if (active && payload && payload.length > 0) {
                                        return (
                                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                                            <p className="font-semibold">{label} Factor</p>
                                            {payload.map((entry, index) => (
                                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                {entry.dataKey}: {((Number(entry.value) || 0) * 100).toFixed(1)}%
                                              </p>
                                            ))}
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Bar dataKey="SPY" fill="#3b82f6" />
                                  <Bar dataKey="VTI" fill="#10b981" />
                                  <Bar dataKey="VTV" fill="#f59e0b" />
                                  <Bar dataKey="VUG" fill="#ef4444" />
                                  <Bar dataKey="QUAL" fill="#8b5cf6" />
                                  <Bar dataKey="USMV" fill="#06b6d4" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {activeTab === "smartbeta" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Smart Beta Strategies
                  </CardTitle>
                  <CardDescription>
                    Enhanced indexing strategies con fattori avanzati di ottimizzazione
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-green-600 font-semibold">Smart Beta tab caricato con successo!</div>
                  <p className="text-muted-foreground mt-2">4 strategie Smart Beta disponibili per ottimizzazione enhanced indexing.</p>
                  
                  {/* Strategy Heat Map */}
                  <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
                    <ResponsiveContainer>
                      <BarChart data={SMART_BETA_HEATMAP}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.dataKey}: {((Number(entry.value) || 0) * 100).toFixed(1)}%
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="SPY" fill="#3b82f6" />
                        <Bar dataKey="QQQ" fill="#10b981" />
                        <Bar dataKey="VTI" fill="#f59e0b" />
                        <Bar dataKey="IWM" fill="#ef4444" />
                        <Bar dataKey="VTV" fill="#8b5cf6" />
                        <Bar dataKey="VUG" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    {smartBetaStrategies.map((strategy, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{strategy.name}</CardTitle>
                          <CardDescription>{strategy.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Sharpe Ratio:</span>
                              <span className="font-medium">{strategy.riskMetrics.sharpeRatio}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Volatility:</span>
                              <span className="font-medium">{strategy.riskMetrics.volatility}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Max Drawdown:</span>
                              <span className="font-medium">{strategy.riskMetrics.maxDrawdown}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "optimizer" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Portfolio Optimization Results
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-muted-foreground">MPT Algorithm</span>
                    </div>
                  </div>
                  <CardDescription>
                    Modern Portfolio Theory - Efficient Frontier Analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-green-600 font-semibold">Portfolio Optimizer tab caricato con successo!</div>
                  <p className="text-muted-foreground mt-2">Efficient Frontier analysis e MPT optimization disponibili.</p>
                  
                  {/* Efficient Frontier Chart */}
                  <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                    <ResponsiveContainer>
                      <ScatterChart data={EFFICIENT_FRONTIER}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="risk" 
                          name="Risk (Volatility %)"
                          domain={[0, 25]}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="return" 
                          name="Expected Return (%)"
                          domain={[0, 15]}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{data.portfolio}</p>
                                  <p className="text-sm">Risk: {data.risk.toFixed(1)}%</p>
                                  <p className="text-sm">Expected Return: {data.return.toFixed(1)}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          dataKey="return" 
                          fill="#3b82f6"
                          fillOpacity={0.8}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  {optimizationResult && (
                    <div className="grid gap-4 md:grid-cols-4 mt-6">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Portfolio Return</p>
                        <p className="text-2xl font-bold">{optimizationResult.riskMetrics.portfolioReturn.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Portfolio Volatility</p>
                        <p className="text-2xl font-bold">{optimizationResult.riskMetrics.portfolioVolatility.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-2xl font-bold">{optimizationResult.riskMetrics.portfolioSharpe.toFixed(2)}</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Portfolio Beta</p>
                        <p className="text-2xl font-bold">{optimizationResult.riskMetrics.beta.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tax" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Tax Loss Harvesting Opportunities
                  </CardTitle>
                  <CardDescription>
                    Opportunità di ottimizzazione fiscale con wash sale rule compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-green-600 font-semibold">Tax Optimization tab caricato con successo!</div>
                  <p className="text-muted-foreground mt-2">{taxHarvesting.length} opportunità Tax Loss Harvesting identificate.</p>
                  
                  {/* Tax Calendar */}
                  <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
                    <ResponsiveContainer>
                      <BarChart data={TAX_CALENDAR}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  <p className="text-sm">Opportunità: {payload[0]?.value || 0}</p>
                                  <p className="text-sm">Risparmi Fiscali: €{payload[1]?.value?.toLocaleString() || 0}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar yAxisId="left" dataKey="opportunities" fill="#3b82f6" name="Opportunità" />
                        <Bar yAxisId="right" dataKey="potential_savings" fill="#10b981" name="Risparmi (€)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4 mt-6">
                    {taxHarvesting.map((opportunity, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{opportunity.symbol}</h4>
                            <p className="text-sm text-muted-foreground">
                              Holding Period: {opportunity.holdingPeriod} days
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              {formatCurrency(opportunity.unrealizedLoss)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Tax Savings: {formatCurrency(opportunity.taxImpact)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Index Tracking Analysis
                  </CardTitle>
                  <CardDescription>
                    Analisi tracking error e qualità di replica degli indici
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-green-600 font-semibold">Index Tracking tab caricato con successo!</div>
                  <p className="text-muted-foreground mt-2">{indexReplication.length} indici analizzati per tracking accuracy.</p>
                  
                  {/* Tracking Error Chart */}
                  <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
                    <ResponsiveContainer>
                      <BarChart data={INDEX_TRACKING_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm">
                                      {entry.dataKey}: {(Number(entry.value) || 0).toFixed(3)}
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="tracking_error" fill="#ef4444" name="Tracking Error" />
                        <Bar dataKey="correlation" fill="#3b82f6" name="Correlation" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    {indexReplication.map((index, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-lg">{index.indexName}</CardTitle>
                          <CardDescription>ETF: {index.etfSymbol}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Tracking Error:</span>
                              <span className="font-medium">{(index.trackingError * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Correlation:</span>
                              <span className="font-medium">{index.correlation.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">R-Squared:</span>
                              <span className="font-medium">{index.rSquared.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Tracking Difference:</span>
                              <span className={`font-medium ${index.trackingDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(index.trackingDifference * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "rebalancing" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    Portfolio Rebalancing Suggestions
                  </CardTitle>
                  <CardDescription>
                    Suggerimenti automatici per riallineamento portafoglio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-green-600 font-semibold">Rebalancing tab caricato con successo!</div>
                  <p className="text-muted-foreground mt-2">{rebalancing.length} suggerimenti di riallineamento generati.</p>
                  
                  {/* Rebalancing Chart */}
                  <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
                    <ResponsiveContainer>
                      <BarChart data={REBALANCING_SUGGESTIONS}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="asset" />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  <p className="text-sm">Current: {data.current.toFixed(1)}%</p>
                                  <p className="text-sm">Target: {data.target.toFixed(1)}%</p>
                                  <p className="text-sm">Difference: {data.difference.toFixed(1)}%</p>
                                  <p className="text-sm">Action: {data.action}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="current" fill="#3b82f6" name="Current %" />
                        <Bar dataKey="target" fill="#10b981" name="Target %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4 mt-6">
                    {REBALANCING_SUGGESTIONS.map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{suggestion.asset}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={suggestion.action === 'Increase' ? 'default' : 'secondary'}>
                                {suggestion.action}
                              </Badge>
                              <Badge variant={suggestion.priority === 'High' ? 'destructive' : suggestion.priority === 'Medium' ? 'default' : 'secondary'}>
                                {suggestion.priority} Priority
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {(Number(suggestion.difference) || 0) > 0 ? '+' : ''}{(Number(suggestion.difference) || 0).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.current.toFixed(1)}% → {suggestion.target.toFixed(1)}%
                            </p>
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
