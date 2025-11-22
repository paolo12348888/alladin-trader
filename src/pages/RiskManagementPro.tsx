import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';

/**
 * Risk Management Pro - Piattaforma Istituzionale
 * 
 * CORREZIONI LAYOUT RESPONSIVE:
 * - Grid responsive per tabs (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7)
 * - Scroll orizzontale su mobile per evitare sovrapposizione  
 * - Icone e testo responsive con breakpoints
 * - Miglior spacing tra sezioni (space-y-8 invece di space-y-6)
 * - Grid gap responsive (gap-4 md:gap-6)
 * - Padding aggiuntivo per tabs container
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  ComposedChart,
  Treemap
} from 'recharts';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Zap,
  DollarSign,
  Timer,
  Globe,
  Database,
  Eye,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import RiskManagementProService, {
  PortfolioPosition,
  VaRMetrics,
  StressTestScenario,
  CorrelationMatrix,
  RiskAttribution,
  LiquidityRisk,
  CounterpartyRisk,
  BacktestResult
} from '@/services/RiskManagementProService';

const RiskManagementPro: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [varMetrics, setVarMetrics] = useState<VaRMetrics | null>(null);
  const [stressScenarios, setStressScenarios] = useState<StressTestScenario[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix | null>(null);
  const [riskAttribution, setRiskAttribution] = useState<RiskAttribution | null>(null);
  const [liquidityRisk, setLiquidityRisk] = useState<LiquidityRisk | null>(null);
  const [counterpartyRisk, setCounterpartyRisk] = useState<CounterpartyRisk | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  // Initialize with sample portfolio
  useEffect(() => {
    initializeSamplePortfolio();
  }, []);

  const initializeSamplePortfolio = () => {
    const samplePositions: PortfolioPosition[] = [
      {
        symbol: 'AAPL',
        quantity: 1000,
        price: 175.50,
        weight: 0.15,
        sector: 'Technology',
        assetClass: 'Equity',
        beta: 1.25,
        volatility: 0.24
      },
      {
        symbol: 'MSFT',
        quantity: 800,
        price: 380.00,
        weight: 0.12,
        sector: 'Technology',
        assetClass: 'Equity',
        beta: 1.18,
        volatility: 0.22
      },
      {
        symbol: 'JNJ',
        quantity: 600,
        price: 165.25,
        weight: 0.08,
        sector: 'Healthcare',
        assetClass: 'Equity',
        beta: 0.75,
        volatility: 0.16
      },
      {
        symbol: 'JPM',
        quantity: 700,
        price: 145.75,
        weight: 0.10,
        sector: 'Financials',
        assetClass: 'Equity',
        beta: 1.15,
        volatility: 0.20
      },
      {
        symbol: 'XLF',
        quantity: 2000,
        price: 32.50,
        weight: 0.06,
        sector: 'Financials',
        assetClass: 'ETF',
        beta: 1.10,
        volatility: 0.18
      },
      {
        symbol: 'TLT',
        quantity: 1500,
        price: 98.75,
        weight: 0.12,
        sector: 'Fixed Income',
        assetClass: 'Fixed Income',
        beta: -0.15,
        volatility: 0.14
      },
      {
        symbol: 'GLD',
        quantity: 500,
        price: 195.80,
        weight: 0.08,
        sector: 'Commodities',
        assetClass: 'Commodity',
        beta: 0.05,
        volatility: 0.19
      },
      {
        symbol: 'EURUSD',
        quantity: 100000,
        price: 1.0850,
        weight: 0.29,
        sector: 'FX',
        assetClass: 'FX',
        beta: 0,
        volatility: 0.12
      }
    ];

    setPositions(samplePositions);
  };

  const runRiskAnalysis = async () => {
    setLoading(true);
    
    // Generate sample returns data
    const returns: number[][] = positions.map(() => {
      return Array.from({ length: 252 }, () => (Math.random() - 0.5) * 4); // Daily returns
    });

    try {
      // Run all risk analyses
      const varResults = RiskManagementProService.calculateVaR(positions, returns);
      const stressResults = RiskManagementProService.generateStressTestScenarios(positions);
      const correlationResults = RiskManagementProService.calculateCorrelationMatrix(returns, positions.map(p => p.symbol));
      const attributionResults = RiskManagementProService.performRiskAttribution(positions);
      const liquidityResults = RiskManagementProService.assessLiquidityRisk(positions);
      const counterpartyResults = RiskManagementProService.analyzeCounterpartyRisk(positions);
      const backtestResults = RiskManagementProService.runBacktesting('Risk Parity Strategy', returns, positions);

      setVarMetrics(varResults);
      setStressScenarios(stressResults);
      setCorrelationMatrix(correlationResults);
      setRiskAttribution(attributionResults);
      setLiquidityRisk(liquidityResults);
      setCounterpartyRisk(counterpartyResults);
      setBacktestResult(backtestResults);
    } catch (error) {
      console.error('Risk analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskLevel = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'Basso';
    if (value <= thresholds.warning) return 'Medio';
    return 'Alto';
  };

  const renderRiskOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valore Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">8 posizioni attive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VaR 1-Giorno (95%)</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${varMetrics ? getRiskColor(varMetrics.historicalVaR.oneDay / 1000000, { good: 0.5, warning: 1.0 }) : ''}`}>
              {varMetrics ? `$${(varMetrics.historicalVaR.oneDay / 1000000).toFixed(2)}M` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {varMetrics ? getRiskLevel(varMetrics.historicalVaR.oneDay / 1000000, { good: 0.5, warning: 1.0 }) : '--'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Shortfall</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${varMetrics ? getRiskColor(varMetrics.cvar.expectedShortfall / 1000000, { good: 0.8, warning: 1.5 }) : ''}`}>
              {varMetrics ? `$${(varMetrics.cvar.expectedShortfall / 1000000).toFixed(2)}M` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">CVaR 95%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">6.8</div>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Rischio Medio-Alto</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Composizione Portfolio</CardTitle>
            <CardDescription>Distribuzione per asset class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positions.reduce((acc, pos) => {
                    const existing = acc.find(item => item.name === pos.assetClass);
                    if (existing) {
                      existing.value += pos.weight * 100;
                    } else {
                      acc.push({ name: pos.assetClass, value: pos.weight * 100 });
                    }
                    return acc;
                  }, [] as any[])}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {positions.reduce((acc, pos) => {
                    const existing = acc.find(item => item.name === pos.assetClass);
                    if (existing) {
                      existing.value += pos.weight * 100;
                    } else {
                      acc.push({ name: pos.assetClass, value: pos.weight * 100 });
                    }
                    return acc;
                  }, [] as any[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esposizioni Settoriali</CardTitle>
            <CardDescription>Rischio per settore</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positions.reduce((acc, pos) => {
                const existing = acc.find(item => item.sector === pos.sector);
                if (existing) {
                  existing.weight += pos.weight * 100;
                } else {
                  acc.push({ sector: pos.sector, weight: pos.weight * 100 });
                }
                return acc;
              }, [] as any[])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="weight" fill="hsl(220, 70%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVaRAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              VaR Storico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>1-Giorno (95%)</Label>
              <div className="text-2xl font-bold text-red-500">
                ${varMetrics ? (varMetrics.historicalVaR.oneDay / 1000000).toFixed(2) : '--'}M
              </div>
            </div>
            <div>
              <Label>10-Giorni (95%)</Label>
              <div className="text-xl font-semibold">
                ${varMetrics ? (varMetrics.historicalVaR.tenDay / 1000000).toFixed(2) : '--'}M
              </div>
            </div>
            <Badge variant="secondary">Basato su 252 giorni</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              VaR Parametrico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>1-Giorno (95%)</Label>
              <div className="text-2xl font-bold text-orange-500">
                ${varMetrics ? (varMetrics.parametricVaR.oneDay / 1000000).toFixed(2) : '--'}M
              </div>
            </div>
            <div>
              <Label>10-Giorni (95%)</Label>
              <div className="text-xl font-semibold">
                ${varMetrics ? (varMetrics.parametricVaR.tenDay / 1000000).toFixed(2) : '--'}M
              </div>
            </div>
            <Badge variant="outline">Variance-Covariance</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              VaR Monte Carlo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>1-Giorno (95%)</Label>
              <div className="text-2xl font-bold text-blue-500">
                ${varMetrics ? (varMetrics.monteCarloVaR.oneDay / 1000000).toFixed(2) : '--'}M
              </div>
            </div>
            <div>
              <Label>Simulazioni</Label>
              <div className="text-xl font-semibold">
                {varMetrics ? varMetrics.monteCarloVaR.simulations.toLocaleString() : '--'}
              </div>
            </div>
            <Badge variant="default">10,000 simulazioni</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Component VaR */}
      <Card>
        <CardHeader>
          <CardTitle>Component VaR per Posizione</CardTitle>
          <CardDescription>Contributo al rischio totale per ogni asset</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={varMetrics ? Object.entries(varMetrics.componentVaR).map(([symbol, value]) => ({
              symbol,
              componentVaR: value / 1000000
            })) : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis label={{ value: 'VaR ($M)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, 'Component VaR']} />
              <Bar dataKey="componentVaR" fill="hsl(0, 70%, 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderStressTesting = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {stressScenarios.map((scenario, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                <Badge variant={scenario.portfolioImpact.percentageLoss > 15 ? "destructive" : "secondary"}>
                  {scenario.portfolioImpact.percentageLoss.toFixed(1)}% Loss
                </Badge>
              </div>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Impatto Totale</Label>
                <div className="text-xl font-bold text-red-500">
                  ${scenario.portfolioImpact.totalLoss.toLocaleString()}
                </div>
              </div>
              
              <div>
                <Label>Probabilità Storica</Label>
                <div className="text-sm">{(scenario.probability * 100).toFixed(1)}% annua</div>
              </div>

              {scenario.historicalAnalog && (
                <div>
                  <Label>Analoghi Storici</Label>
                  <div className="text-sm text-muted-foreground">{scenario.historicalAnalog}</div>
                </div>
              )}

              <div className="mt-4">
                <Label>Shock di Mercato</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>Equities: {scenario.marketShock.equityDrop}%</div>
                  <div>Bonds: {scenario.marketShock.bondYields}%</div>
                  <div>Credit: +{scenario.marketShock.creditSpreads}bps</div>
                  <div>FX: {scenario.marketShock.fxImpact}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stress Test Summary Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Confronto Scenari di Stress</CardTitle>
          <CardDescription>Impatto percentuale del portfolio per scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stressScenarios.map(scenario => ({
              scenario: scenario.name.split(' ')[0],
              loss: scenario.portfolioImpact.percentageLoss
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis label={{ value: 'Perdita (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Perdita Portfolio']} />
              <Bar dataKey="loss" fill="hsl(0, 70%, 50%)">
                {stressScenarios.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.portfolioImpact.percentageLoss > 15 ? "hsl(0, 70%, 40%)" : "hsl(45, 70%, 50%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderCorrelationMatrix = () => {
    if (!correlationMatrix) return <div>Caricamento matrice di correlazione...</div>;

    const renderHeatmap = () => {
      const data = correlationMatrix.matrix.map((row, i) =>
        row.map((value, j) => ({
          x: correlationMatrix.symbols[j],
          y: correlationMatrix.symbols[i],
          value: value
        }))
      ).flat();

      const getColor = (value: number) => {
        const intensity = Math.abs(value);
        if (value > 0) return `rgba(34, 197, 94, ${intensity})`; // Green for positive
        if (value < 0) return `rgba(239, 68, 68, ${intensity})`; // Red for negative
        return `rgba(156, 163, 175, 0.3)`; // Gray for zero
      };

      return (
        <div className="grid grid-cols-9 gap-1 p-4">
          {data.map((cell, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center text-xs font-medium rounded"
              style={{ backgroundColor: getColor(cell.value) }}
              title={`${cell.y} vs ${cell.x}: ${cell.value.toFixed(3)}`}
            >
              {Math.abs(cell.value) > 0.1 ? cell.value.toFixed(2) : ''}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Concentrazione Rischio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(correlationMatrix.concentrationRisk * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Indice di concentrazione</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indice di Diversificazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {correlationMatrix.diversificationRatio.toFixed(3)}
              </div>
              <p className="text-sm text-muted-foreground">Correlazione media</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eigenvalues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {correlationMatrix.eigenvalues.length} fattori
              </div>
              <p className="text-sm text-muted-foreground">Componenti principali</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Matrice di Correlazione</CardTitle>
            <CardDescription>Correlazioni storiche tra asset (252 giorni)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 opacity-30 rounded"></div>
                  <span>Correlazione Positiva</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 opacity-30 rounded"></div>
                  <span>Correlazione Negativa</span>
                </div>
              </div>
            </div>
            
            {/* Headers */}
            <div className="flex mb-2">
              <div className="w-16"></div>
              {correlationMatrix.symbols.map((symbol, i) => (
                <div key={i} className="w-16 text-center text-xs font-medium transform -rotate-45 origin-bottom-left">
                  {symbol}
                </div>
              ))}
            </div>
            
            {/* Matrix */}
            <div className="space-y-1">
              {correlationMatrix.symbols.map((rowSymbol, i) => (
                <div key={i} className="flex">
                  <div className="w-16 text-right pr-2 text-xs font-medium">{rowSymbol}</div>
                  {correlationMatrix.matrix[i].map((value, j) => (
                    <div
                      key={j}
                      className="w-16 h-8 flex items-center justify-center text-xs font-medium rounded"
                      style={{
                        backgroundColor: value > 0 
                          ? `rgba(34, 197, 94, ${Math.abs(value)})` 
                          : `rgba(239, 68, 68, ${Math.abs(value)})`
                      }}
                      title={`${rowSymbol} vs ${correlationMatrix.symbols[j]}: ${value.toFixed(3)}`}
                    >
                      {Math.abs(value) > 0.1 ? value.toFixed(2) : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRiskAttribution = () => {
    if (!riskAttribution) return <div>Caricamento attribuzione del rischio...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Factor Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Attribuzione per Fattori</CardTitle>
              <CardDescription>Contributo dei fattori di rischio</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(riskAttribution.factorContributions).map(([factor, data]) => ({
                  factor,
                  contribution: Math.abs(data.contribution / 1000000),
                  percentage: data.percentage
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="factor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="contribution" fill="hsl(220, 70%, 50%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Attribuzione Settoriale</CardTitle>
              <CardDescription>Rischio per settore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(riskAttribution.sectorAttribution).map(([sector, data]) => (
                  <div key={sector} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{sector}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.percentage} className="w-20" />
                      <span className="text-sm w-12">{data.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Class Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Attribuzione Asset Class</CardTitle>
              <CardDescription>Rischio per classe di asset</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(riskAttribution.assetClassAttribution).map(([assetClass, data]) => ({
                      name: assetClass,
                      value: data.percentage
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {Object.entries(riskAttribution.assetClassAttribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderLiquidityRisk = () => {
    if (!liquidityRisk) return <div>Caricamento analisi di liquidità...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spread Medio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(liquidityRisk.portfolioLiquidity.averageSpread * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground">Bid-Ask spread medio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tempo di Liquidazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {liquidityRisk.portfolioLiquidity.timeToLiquidatePortfolio} giorni
              </div>
              <p className="text-sm text-muted-foreground">Per liquidare l'intero portfolio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score di Liquidità</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {(liquidityRisk.portfolioLiquidity.liquidityRiskScore * 100).toFixed(0)}
              </div>
              <Progress value={liquidityRisk.portfolioLiquidity.liquidityRiskScore * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liquidità per Asset</CardTitle>
            <CardDescription>Analisi dettagliata di liquidità per posizione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(liquidityRisk.assetLiquidity).map(([symbol, liquidity]) => (
                <div key={symbol} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{symbol}</h4>
                    <Badge variant={liquidity.liquidityScore > 0.7 ? "default" : "secondary"}>
                      Score: {(liquidity.liquidityScore * 100).toFixed(0)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label>Bid-Ask Spread</Label>
                      <div>{(liquidity.bidAskSpread * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <Label>Volume Giornaliero</Label>
                      <div>${(liquidity.dailyVolume / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <Label>Volume/MC Ratio</Label>
                      <div>{liquidity.volumeToMarketCap.toFixed(2)}x</div>
                    </div>
                    <div>
                      <Label>Giorni per Liquidare</Label>
                      <div>{liquidity.timeToLiquidate}</div>
                    </div>
                  </div>
                  
                  <Progress value={liquidity.liquidityScore * 100} className="mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRiskDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${counterpartyRisk ? (counterpartyRisk.portfolioMetrics.totalExposure / 1000000).toFixed(1) : '--'}M
            </div>
            <p className="text-xs text-muted-foreground">Across all counterparties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${counterpartyRisk ? (counterpartyRisk.portfolioMetrics.portfolioExpectedLoss / 1000).toFixed(0) : '--'}K
            </div>
            <p className="text-xs text-muted-foreground">Annual expected loss</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {backtestResult ? backtestResult.sharpeRatio.toFixed(2) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {backtestResult ? backtestResult.maxDrawdown.toFixed(1) : '--'}%
            </div>
            <p className="text-xs text-muted-foreground">Peak-to-trough decline</p>
          </CardContent>
        </Card>
      </div>

      {/* Backtest Performance */}
      {backtestResult && (
        <Card>
          <CardHeader>
            <CardTitle>Performance del Backtest</CardTitle>
            <CardDescription>Strategia: {backtestResult.strategy}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={backtestResult.dailyReturns.map((ret, i) => ({
                day: i + 1,
                return: ret,
                cumulative: backtestResult.dailyReturns.slice(0, i + 1).reduce((sum, r) => sum + r, 0)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cumulative" stroke="hsl(220, 70%, 50%)" strokeWidth={2} />
                <Line type="monotone" dataKey="return" stroke="hsl(0, 70%, 50%)" strokeWidth={1} opacity={0.6} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Risk Management Pro</h1>
            <p className="text-muted-foreground">
              Piattaforma istituzionale di risk management stile Goldman Sachs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runRiskAnalysis}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              {loading ? 'Analizzando...' : 'Esegui Analisi'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Esporta Report
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto p-2">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              Panoramica
            </TabsTrigger>
            <TabsTrigger value="var" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">VaR </span>Analysis
            </TabsTrigger>
            <TabsTrigger value="stress" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Stress </span>Test
            </TabsTrigger>
            <TabsTrigger value="correlation" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              Correlazioni
            </TabsTrigger>
            <TabsTrigger value="attribution" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <PieChartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Attribution</span>
            </TabsTrigger>
            <TabsTrigger value="liquidity" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
              Liquidità
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderRiskOverview()}
          </TabsContent>

          <TabsContent value="var">
            {varMetrics ? renderVaRAnalysis() : <Alert><AlertDescription>Esegui l'analisi per visualizzare i dati VaR</AlertDescription></Alert>}
          </TabsContent>

          <TabsContent value="stress">
            {stressScenarios.length > 0 ? renderStressTesting() : <Alert><AlertDescription>Esegui l'analisi per visualizzare gli scenari di stress</AlertDescription></Alert>}
          </TabsContent>

          <TabsContent value="correlation">
            {correlationMatrix ? renderCorrelationMatrix() : <Alert><AlertDescription>Esegui l'analisi per visualizzare la matrice di correlazione</AlertDescription></Alert>}
          </TabsContent>

          <TabsContent value="attribution">
            {riskAttribution ? renderRiskAttribution() : <Alert><AlertDescription>Esegui l'analisi per visualizzare l'attribuzione del rischio</AlertDescription></Alert>}
          </TabsContent>

          <TabsContent value="liquidity">
            {liquidityRisk ? renderLiquidityRisk() : <Alert><AlertDescription>Esegui l'analisi per visualizzare il rischio di liquidità</AlertDescription></Alert>}
          </TabsContent>

          <TabsContent value="dashboard">
            {renderRiskDashboard()}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RiskManagementPro;