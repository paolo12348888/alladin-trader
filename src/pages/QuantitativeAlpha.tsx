import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calculator,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Timer,
  RefreshCw,
  LineChart,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen,
  Cpu,
  Database,
  BarChart3,
  PieChart,
  Globe,
  MapPin,
  MessageSquare,
  Satellite,
  GitBranch,
  Shield,
  DollarSign,
  Percent,
  ArrowUpDown,
  Eye,
  Lightbulb,
  Network
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
  Radar,
  ComposedChart
} from "recharts";
import {
  quantitativeAlphaService,
  type MLSignal,
  type AlternativeData,
  type BacktestResult,
  type WalkForwardAnalysis,
  type EnsembleModel,
  type PortfolioOptimization,
  type StockUniverse
} from "@/services/QuantitativeAlphaService";

// === CHART DATA ===

const ALPHA_GENERATION_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  randomForest: Math.sin(i * 0.2) * 20 + 50 + Math.random() * 10,
  neuralNetwork: Math.cos(i * 0.15) * 25 + 45 + Math.random() * 15,
  svm: Math.sin(i * 0.25) * 18 + 40 + Math.random() * 12,
  ensemble: Math.sin(i * 0.18) * 22 + 48 + Math.random() * 8
}));

const RISK_RETURN_DATA = [
  { strategy: 'Random Forest', risk: 15.2, return: 12.8, sharpe: 1.45, color: '#8b5cf6' },
  { strategy: 'Neural Network', risk: 18.4, return: 16.2, sharpe: 1.68, color: '#06b6d4' },
  { strategy: 'SVM', risk: 12.8, return: 11.5, sharpe: 1.35, color: '#10b981' },
  { strategy: 'Ensemble', risk: 16.1, return: 14.9, sharpe: 1.72, color: '#f59e0b' }
];

const SIGNAL_STRENGTH_DATA = Array.from({ length: 20 }, (_, i) => ({
  symbol: `STOCK_${i + 1}`,
  confidence: Math.random() * 100,
  strength: Math.random() * 100,
  expectedReturn: (Math.random() - 0.5) * 40,
  volatility: Math.random() * 50 + 10
}));

const ALTERNATIVE_DATA_SOURCES = [
  { source: 'Credit Card', value: 85, color: '#8b5cf6', description: 'Transaction patterns' },
  { source: 'Location', value: 72, color: '#06b6d4', description: 'Mobile & foot traffic' },
  { source: 'Sentiment', value: 78, color: '#10b981', description: 'Social & news analysis' },
  { source: 'Satellite', value: 65, color: '#f59e0b', description: 'Economic monitoring' }
];

const FACTOR_CORRELATION_DATA = [
  { factor: 'Momentum', momentum: 1.0, meanReversion: 0.15, quality: 0.45, size: -0.20, value: 0.25 },
  { factor: 'Mean Reversion', momentum: 0.15, meanReversion: 1.0, quality: 0.30, size: 0.35, value: 0.40 },
  { factor: 'Quality', momentum: 0.45, meanReversion: 0.30, quality: 1.0, size: -0.10, value: 0.55 },
  { factor: 'Size', momentum: -0.20, meanReversion: 0.35, quality: -0.10, size: 1.0, value: 0.25 },
  { factor: 'Value', momentum: 0.25, meanReversion: 0.40, quality: 0.55, size: 0.25, value: 1.0 }
];

const BACKTEST_PERFORMANCE = Array.from({ length: 24 }, (_, i) => ({
  month: new Date(2022, i).toLocaleDateString('it-IT', { month: 'short' }),
  randomForest: Math.sin(i * 0.3) * 8 + Math.random() * 4,
  neuralNetwork: Math.cos(i * 0.25) * 10 + Math.random() * 5,
  svm: Math.sin(i * 0.35) * 6 + Math.random() * 3,
  ensemble: Math.sin(i * 0.28) * 9 + Math.random() * 4
}));

const ENSEMBLE_WEIGHTS = [
  { model: 'Random Forest', weight: 0.25, performance: 12.8 },
  { model: 'Neural Network', weight: 0.45, performance: 16.2 },
  { model: 'SVM', weight: 0.30, performance: 11.5 }
];

export default function QuantitativeAlpha() {
  // State management
  const [mlSignals, setMLSignals] = useState<MLSignal[]>([]);
  const [alternativeData, setAlternativeData] = useState<AlternativeData[]>([]);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [walkForwardAnalysis, setWalkForwardAnalysis] = useState<WalkForwardAnalysis[]>([]);
  const [ensembleModels, setEnsembleModels] = useState<EnsembleModel[]>([]);
  const [portfolioOptimization, setPortfolioOptimization] = useState<PortfolioOptimization | null>(null);
  const [stockUniverse, setStockUniverse] = useState<StockUniverse[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load all data on component mount
  useEffect(() => {
    console.log("Quantitative Alpha component mounted");
    
    const loadData = async () => {
      try {
        console.log("Loading quantitative alpha data...");
        setLoading(true);
        
        console.log("Generating ML signals...");
        const signals = await quantitativeAlphaService.generateMLSignals();
        setMLSignals(signals);
        console.log(`Generated ${signals.length} ML signals`);
        
        console.log("Collecting alternative data...");
        const altData = await quantitativeAlphaService.getAlternativeData();
        setAlternativeData(altData);
        console.log(`Collected alternative data for ${altData.length} symbols`);
        
        console.log("Running backtesting analysis...");
        const backtest = await quantitativeAlphaService.runBacktest();
        setBacktestResults(backtest);
        console.log(`Backtesting completed for ${backtest.length} strategies`);
        
        console.log("Running walk-forward analysis...");
        const walkForward = await quantitativeAlphaService.walkForwardAnalysis();
        setWalkForwardAnalysis(walkForward);
        console.log(`Walk-forward analysis completed for ${walkForward.length} strategies`);
        
        console.log("Calculating ensemble models...");
        const ensemble = await quantitativeAlphaService.calculateEnsembleSignals();
        setEnsembleModels(ensemble);
        console.log(`Calculated ${ensemble.length} ensemble models`);
        
        console.log("Optimizing portfolio...");
        const portfolio = await quantitativeAlphaService.optimizePortfolio();
        setPortfolioOptimization(portfolio);
        console.log("Portfolio optimization completed");
        
        console.log("Building stock universe...");
        const universe = await quantitativeAlphaService.getStockUniverse();
        setStockUniverse(universe);
        console.log(`Built universe of ${universe.length} stocks`);
        
        setLoading(false);
        console.log("Quantitative Alpha data loaded successfully");
        
      } catch (error) {
        console.error("Error loading Quantitative Alpha data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get top signals
  const getTopSignals = () => {
    return mlSignals
      .filter(signal => signal.model === 'Ensemble')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Caricamento modelli quantitativi...</p>
            <p className="text-sm text-muted-foreground">Inizializzazione ML algorithms</p>
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
              <Brain className="h-8 w-8 text-violet-500" />
              Quantitative Alpha Models
              <Badge variant="outline" className="ml-2 text-xs bg-violet-50 text-violet-700 border-violet-200">
                <Cpu className="h-3 w-3 mr-1" />
                HEDGE FUND STYLE
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-2">
              Alpha generation system Two Sigma/Renaissance Technologies Style - Machine Learning & Alternative Data
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                <span>ML Models Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Alternative Data Fusion</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>Ensemble Models</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Target className="h-4 w-4 mr-1" />
              {stockUniverse.length} Stock Universe
            </Badge>
            {portfolioOptimization && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Portfolio Value: {formatCurrency(portfolioOptimization.totalValue)}</p>
                <p>Expected Return: {formatPercentage(portfolioOptimization.optimizationResults.expectedReturn)}</p>
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
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Ov</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: ml-signals');
                setActiveTab('ml-signals');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'ml-signals'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">ML Signals</span>
              <span className="sm:hidden">ML</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: alternative-data');
                setActiveTab('alternative-data');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'alternative-data'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Alternative Data</span>
              <span className="sm:hidden">AD</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: backtesting');
                setActiveTab('backtesting');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'backtesting'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Backtesting</span>
              <span className="sm:hidden">BT</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: walk-forward');
                setActiveTab('walk-forward');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'walk-forward'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Walk-Forward</span>
              <span className="sm:hidden">WF</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: ensemble');
                setActiveTab('ensemble');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'ensemble'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Ensemble Models</span>
              <span className="sm:hidden">EM</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: portfolio');
                setActiveTab('portfolio');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'portfolio'
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio Optimization</span>
              <span className="sm:hidden">PO</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alpha Generation Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-violet-500" />
                      Alpha Generation Overview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Live ML Signals</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer>
                      <RechartsLineChart data={ALPHA_GENERATION_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">Day {label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.dataKey}: {(Number(entry.value) || 0).toFixed(1)}
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="randomForest" stroke="#8b5cf6" strokeWidth={2} name="Random Forest" />
                        <Line type="monotone" dataKey="neuralNetwork" stroke="#06b6d4" strokeWidth={2} name="Neural Network" />
                        <Line type="monotone" dataKey="svm" stroke="#10b981" strokeWidth={2} name="SVM" />
                        <Line type="monotone" dataKey="ensemble" stroke="#f59e0b" strokeWidth={3} name="Ensemble" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Model Performance Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {RISK_RETURN_DATA.map((model, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{model.strategy}</h4>
                          <p className="text-xs text-muted-foreground">Model Performance</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: model.color }}>
                            {model.return.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sharpe: {model.sharpe.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs">
                          <span>Risk: {model.risk.toFixed(1)}%</span>
                          <span>Return: {model.return.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Top Signals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-violet-500" />
                    Top Alpha Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getTopSignals().slice(0, 6).map((signal, index) => (
                      <Card key={index} className="border-l-4" style={{ borderLeftColor: signal.model === 'Ensemble' ? '#f59e0b' : signal.model === 'NeuralNetwork' ? '#06b6d4' : '#8b5cf6' }}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{signal.symbol}</h4>
                              <p className="text-xs text-muted-foreground">{signal.model}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={signal.signal === 'BUY' ? 'default' : signal.signal === 'SELL' ? 'destructive' : 'secondary'}>
                                {signal.signal}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Confidence:</span>
                              <span className="font-medium">{(signal.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Expected Return:</span>
                              <span className="font-medium">{signal.expectedReturn.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Sharpe:</span>
                              <span className="font-medium">{signal.sharpeRatio.toFixed(2)}</span>
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

          {activeTab === "ml-signals" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-violet-500" />
                      Machine Learning Signal Generation
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">Real-time ML Processing</span>
                    </div>
                  </div>
                  <CardDescription>
                    Random Forest, Neural Networks, SVM - Multi-algorithm alpha generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer>
                      <ScatterChart data={SIGNAL_STRENGTH_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          type="number" 
                          dataKey="confidence" 
                          name="Confidence"
                          domain={[0, 100]}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          type="number" 
                          dataKey="strength" 
                          name="Signal Strength"
                          domain={[0, 100]}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{data.symbol}</p>
                                  <p className="text-sm">Confidence: {data.confidence.toFixed(1)}%</p>
                                  <p className="text-sm">Strength: {data.strength.toFixed(1)}</p>
                                  <p className="text-sm">Expected Return: {data.expectedReturn.toFixed(2)}%</p>
                                  <p className="text-sm">Volatility: {data.volatility.toFixed(1)}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          dataKey="strength" 
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Signal Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Random Forest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Signals:</span>
                        <span className="font-medium">{mlSignals.filter(s => s.model === 'RandomForest').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Confidence:</span>
                        <span className="font-medium">
                          {(() => {
                            const randomForestSignals = mlSignals.filter(s => s.model === 'RandomForest');
                            const avgConfidence = randomForestSignals.length > 0 
                              ? randomForestSignals.reduce((sum, s) => sum + s.confidence, 0) / randomForestSignals.length * 100 
                              : 0;
                            return `${avgConfidence.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Buy Signals:</span>
                        <span className="font-medium text-green-600">
                          {mlSignals.filter(s => s.model === 'RandomForest' && s.signal === 'BUY').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Neural Network</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Signals:</span>
                        <span className="font-medium">{mlSignals.filter(s => s.model === 'NeuralNetwork').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Confidence:</span>
                        <span className="font-medium">
                          {(() => {
                            const neuralNetworkSignals = mlSignals.filter(s => s.model === 'NeuralNetwork');
                            const avgConfidence = neuralNetworkSignals.length > 0 
                              ? neuralNetworkSignals.reduce((sum, s) => sum + s.confidence, 0) / neuralNetworkSignals.length * 100 
                              : 0;
                            return `${avgConfidence.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Buy Signals:</span>
                        <span className="font-medium text-green-600">
                          {mlSignals.filter(s => s.model === 'NeuralNetwork' && s.signal === 'BUY').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SVM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Signals:</span>
                        <span className="font-medium">{mlSignals.filter(s => s.model === 'SVM').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Confidence:</span>
                        <span className="font-medium">
                          {(() => {
                            const svmSignals = mlSignals.filter(s => s.model === 'SVM');
                            const avgConfidence = svmSignals.length > 0 
                              ? svmSignals.reduce((sum, s) => sum + s.confidence, 0) / svmSignals.length * 100 
                              : 0;
                            return `${avgConfidence.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Buy Signals:</span>
                        <span className="font-medium text-green-600">
                          {mlSignals.filter(s => s.model === 'SVM' && s.signal === 'BUY').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "alternative-data" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-violet-500" />
                      Alternative Data Integration
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">Multi-Source Fusion</span>
                    </div>
                  </div>
                  <CardDescription>
                    Credit Card, Location, Sentiment, Satellite data for alpha generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <BarChart data={ALTERNATIVE_DATA_SOURCES}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="source" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  <p className="text-sm">Data Quality: {data.value}%</p>
                                  <p className="text-sm text-muted-foreground">{data.description}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Data Sources */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      Credit Card Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alternativeData.slice(0, 3).map((data, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold">{data.symbol}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Transaction Volume:</span>
                              <span className="ml-1 font-medium">{data.creditCardData.transactionVolume.toFixed(0)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Consumer Confidence:</span>
                              <span className="ml-1 font-medium">{data.creditCardData.consumerConfidence.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-500" />
                      Location Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alternativeData.slice(0, 3).map((data, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold">{data.symbol}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Foot Traffic:</span>
                              <span className="ml-1 font-medium">{data.locationData.footTraffic.toFixed(0)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Economic Activity:</span>
                              <span className="ml-1 font-medium">{data.locationData.economicActivity.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                      Sentiment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alternativeData.slice(0, 3).map((data, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold">{data.symbol}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Social Media:</span>
                              <span className="ml-1 font-medium">{data.sentimentData.socialMediaScore.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">News Sentiment:</span>
                              <span className="ml-1 font-medium">{data.sentimentData.newsSentiment.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="h-5 w-5 text-purple-500" />
                      Satellite Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alternativeData.slice(0, 3).map((data, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold">{data.symbol}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Industrial Activity:</span>
                              <span className="ml-1 font-medium">{data.satelliteData.industrialActivity.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Retail Foot Traffic:</span>
                              <span className="ml-1 font-medium">{(Number(data.satelliteData.retailFootTraffic) || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "backtesting" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-violet-500" />
                      Backtesting Performance Analysis
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Timer className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Historical Analysis</span>
                    </div>
                  </div>
                  <CardDescription>
                    Strategy performance with drawdown analysis and win rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer>
                      <ComposedChart data={BACKTEST_PERFORMANCE}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length > 0) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-semibold">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.dataKey}: {(Number(entry.value) || 0).toFixed(2)}%
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="randomForest" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="neuralNetwork" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="svm" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="ensemble" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Backtest Results */}
              <div className="grid gap-4 md:grid-cols-2">
                {backtestResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.strategy}</CardTitle>
                      <CardDescription>Performance Metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Return</p>
                            <p className="font-bold text-green-600">{formatPercentage(result.totalReturn)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                            <p className="font-bold">{result.sharpeRatio.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Max Drawdown</p>
                            <p className="font-bold text-red-600">{formatPercentage(result.maxDrawdown)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="font-bold">{formatPercentage(result.winRate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Alpha</p>
                            <p className="font-bold">{formatPercentage(result.alpha)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Information Ratio</p>
                            <p className="font-bold">{result.informationRatio.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">Number of Trades: {result.numberOfTrades}</p>
                          <p className="text-sm text-muted-foreground">Avg Holding Period: {result.avgHoldingPeriod} days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "walk-forward" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-violet-500" />
                      Walk-Forward Analysis
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Out-of-Sample Validation</span>
                    </div>
                  </div>
                  <CardDescription>
                    Model validation with rolling windows: 6-month training, 3-month testing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {walkForwardAnalysis.map((analysis, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{analysis.strategy}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Valid Periods:</span>
                              <span className="font-medium">{analysis.validPeriods}/{analysis.totalPeriods}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Avg OOS Return:</span>
                              <span className="font-medium">{formatPercentage(analysis.avgOutOfSampleReturn)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Avg OOS Sharpe:</span>
                              <span className="font-medium">{analysis.avgOutOfSampleSharpe.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Stability Score:</span>
                              <span className="font-medium">{analysis.stabilityScore.toFixed(1)}%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground">Best Period:</p>
                              <p className="text-sm font-medium">
                                {formatPercentage(analysis.bestPeriod?.return || 0)}
                              </p>
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

          {activeTab === "ensemble" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-violet-500" />
                      Ensemble Model Combinations
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Network className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">Model Weighting</span>
                    </div>
                  </div>
                  <CardDescription>
                    Combined algorithms with dynamic weighting and performance optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div style={{ width: '100%', height: '300px' }}>
                      <ResponsiveContainer>
                        <RechartsPieChart>
                          <Pie
                            data={ENSEMBLE_WEIGHTS}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ model, weight }) => `${model}: ${(weight * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="weight"
                          >
                            {ENSEMBLE_WEIGHTS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#8b5cf6', '#06b6d4', '#10b981'][index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${((Number(value) || 0) * 100).toFixed(1)}%`, 'Weight']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {ensembleModels.map((model, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <CardDescription>Optimization: {model.optimizationMethod}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Total Return:</span>
                                <span className="font-medium">{formatPercentage(model.totalReturn)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Sharpe Ratio:</span>
                                <span className="font-medium">{(model.sharpeRatio || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Max Drawdown:</span>
                                <span className="font-medium text-red-600">
                                  {formatPercentage(model.maxDrawdown || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Win Rate:</span>
                                <span className="font-medium">
                                  {formatPercentage(model.winRate || 0)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-violet-500" />
                      Quantitative Portfolio Optimization
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-muted-foreground">Multi-Factor Optimization</span>
                    </div>
                  </div>
                  <CardDescription>
                    Risk-budgeted allocation with ML signal integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {portfolioOptimization && (
                    <div className="space-y-6">
                      {/* Portfolio Summary */}
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Expected Return</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatPercentage(portfolioOptimization.optimizationResults?.expectedReturn || 0)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Expected Volatility</p>
                          <p className="text-2xl font-bold">
                            {formatPercentage(portfolioOptimization.optimizationResults?.expectedVolatility || 0)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                          <p className="text-2xl font-bold">
                            {(portfolioOptimization.optimizationResults?.sharpeRatio || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Max Drawdown</p>
                          <p className="text-2xl font-bold text-red-600">
                            {formatPercentage(portfolioOptimization.optimizationResults?.maxDrawdown || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Top Positions */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Portfolio Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {(portfolioOptimization.positions || []).slice(0, 10).map((position, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <h4 className="font-semibold">{position.symbol}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Target: {((position.targetWeight || 0) * 100).toFixed(2)}% | 
                                    Current: {((position.currentWeight || 0) * 100).toFixed(2)}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatPercentage(position.expectedReturn || 0)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Signal: {(position.signalStrength || 0).toFixed(0)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Rebalancing Triggers */}
                      {(portfolioOptimization.rebalancingTriggers || []).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <RefreshCw className="h-5 w-5 text-orange-500" />
                              Rebalancing Triggers
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(portfolioOptimization.rebalancingTriggers || []).slice(0, 5).map((trigger, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <h4 className="font-semibold">{trigger.symbol}</h4>
                                    <p className="text-sm text-muted-foreground">{trigger.reason}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={trigger.action === 'BUY' ? 'default' : 'destructive'}>
                                      {trigger.action}
                                    </Badge>
                                    <span className="text-sm">
                                      {((trigger.currentWeight || 0) * 100).toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// CreditCard icon replacement (since lucide-react doesn't have it)
const CreditCard = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);