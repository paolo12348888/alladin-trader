import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import FixedIncomeCreditService, { 
  GovernmentBond, 
  CorporateBond, 
  MunicipalBond, 
  CreditDefaultSwap,
  CollateralizedDebtObligation,
  YieldCurvePoint,
  DurationAnalysis,
  SpreadAnalysis,
  OptimizationResult
} from '@/services/FixedIncomeCreditService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Calculator, 
  Target, 
  BarChart3,
  AlertTriangle,
  DollarSign,
  Percent,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
  format?: 'percentage' | 'currency' | 'number';
}

function MetricCard({ title, value, change, icon: Icon, description, format = 'number' }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(2)}%`;
      case 'currency':
        return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      default:
        return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(change).toFixed(2)} bps
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface BondTableProps {
  data: (GovernmentBond | CorporateBond | MunicipalBond)[];
  type: 'government' | 'corporate' | 'municipal';
}

function BondTable({ data, type }: BondTableProps) {
  const renderRating = (rating: string) => {
    const getRatingColor = (rating: string) => {
      if (rating.startsWith('AAA') || rating.startsWith('AA')) return 'text-green-500';
      if (rating.startsWith('A') || rating.startsWith('BBB')) return 'text-yellow-500';
      return 'text-red-500';
    };
    return <span className={`font-semibold ${getRatingColor(rating)}`}>{rating}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Bond</th>
            {type === 'corporate' && <th className="text-left p-2">Issuer</th>}
            <th className="text-right p-2">Yield</th>
            <th className="text-right p-2">Price</th>
            <th className="text-right p-2">Duration</th>
            {type === 'corporate' && <th className="text-right p-2">Spread</th>}
            <th className="text-right p-2">Maturity</th>
            <th className="text-center p-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bond) => (
            <tr key={bond.id} className="border-b hover:bg-accent/30">
              <td className="p-2">
                <div className="font-medium">{bond.name}</div>
                <div className="text-xs text-muted-foreground">
                  {'ticker' in bond ? bond.ticker : bond.issuer || ''}
                </div>
              </td>
              {type === 'corporate' && <td className="p-2">{(bond as CorporateBond).issuer}</td>}
              <td className="p-2 text-right font-mono">{bond.yield.toFixed(2)}%</td>
              <td className="p-2 text-right font-mono">${bond.price.toFixed(3)}</td>
              <td className="p-2 text-right font-mono">{bond.duration.toFixed(2)}</td>
              {type === 'corporate' && <td className="p-2 text-right font-mono">{(bond as CorporateBond).spread.toFixed(0)} bps</td>}
              <td className="p-2 text-right">{bond.maturity}</td>
              <td className="p-2 text-center">
                {renderRating('rating' in bond ? bond.rating : 'AAA')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FixedIncomeCredit() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBondType, setSelectedBondType] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [governmentBonds, setGovernmentBonds] = useState<GovernmentBond[]>([]);
  const [corporateBonds, setCorporateBonds] = useState<CorporateBond[]>([]);
  const [municipalBonds, setMunicipalBonds] = useState<MunicipalBond[]>([]);
  const [creditDefaultSwaps, setCreditDefaultSwaps] = useState<CreditDefaultSwap[]>([]);
  const [collateralizedDebtObligations, setCollateralizedDebtObligations] = useState<CollateralizedDebtObligation[]>([]);
  const [yieldCurve, setYieldCurve] = useState<YieldCurvePoint[]>([]);
  const [durationAnalysis, setDurationAnalysis] = useState<DurationAnalysis[]>([]);
  const [spreadAnalysis, setSpreadAnalysis] = useState<SpreadAnalysis[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [historicalYieldData, setHistoricalYieldData] = useState<any[]>([]);
  const [historicalSpreadData, setHistoricalSpreadData] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [performanceAttribution, setPerformanceAttribution] = useState<any>(null);
  const [riskMetrics, setRiskMetrics] = useState<any>(null);

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setGovernmentBonds(FixedIncomeCreditService.getGovernmentBonds());
    setCorporateBonds(FixedIncomeCreditService.getCorporateBonds());
    setMunicipalBonds(FixedIncomeCreditService.getMunicipalBonds());
    setCreditDefaultSwaps(FixedIncomeCreditService.getCreditDefaultSwaps());
    setCollateralizedDebtObligations(FixedIncomeCreditService.getCollateralizedDebtObligations());
    setYieldCurve(FixedIncomeCreditService.getYieldCurve());
    setDurationAnalysis(FixedIncomeCreditService.getDurationAnalysis());
    setSpreadAnalysis(FixedIncomeCreditService.getSpreadAnalysis());
    setOptimizationResult(FixedIncomeCreditService.getOptimizationResult());
    setHistoricalYieldData(FixedIncomeCreditService.getHistoricalYieldData());
    setHistoricalSpreadData(FixedIncomeCreditService.getHistoricalSpreadData());
    setMarketData(FixedIncomeCreditService.getMarketData());
    setPerformanceAttribution(FixedIncomeCreditService.getPerformanceAttribution());
    setRiskMetrics(FixedIncomeCreditService.getRiskMetrics());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      loadAllData();
      setRefreshing(false);
    }, 1500);
  };

  // Filter data based on selections
  const filteredCorporateBonds = corporateBonds.filter(bond => {
    const ratingMatch = selectedRating === 'all' || bond.rating.startsWith(selectedRating);
    return ratingMatch;
  });

  const avgYield = (
    governmentBonds.reduce((sum, bond) => sum + bond.yield, 0) +
    corporateBonds.reduce((sum, bond) => sum + bond.yield, 0) +
    municipalBonds.reduce((sum, bond) => sum + bond.yield, 0)
  ) / (governmentBonds.length + corporateBonds.length + municipalBonds.length);

  const avgSpread = corporateBonds.reduce((sum, bond) => sum + bond.spread, 0) / corporateBonds.length;
  const avgDuration = durationAnalysis.reduce((sum, bond) => sum + bond.duration, 0) / durationAnalysis.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Fixed Income & Credit</h1>
              <p className="text-muted-foreground">
                Analisi istituzionale di bond, credit spreads e gestione duration in stile PIMCO/BlackRock
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Yield Medio Portfolio"
            value={avgYield}
            icon={Percent}
            format="percentage"
            change={-2.5}
            description="Media ponderata del portafoglio"
          />
          <MetricCard
            title="Credit Spread Medio"
            value={avgSpread}
            icon={BarChart3}
            format="number"
            change={5.2}
            description="Corporate IG spreads in bps"
          />
          <MetricCard
            title="Duration Media"
            value={avgDuration}
            icon={Clock}
            format="number"
            change={0.15}
            description="Modified duration in anni"
          />
          <MetricCard
            title="Market Cap Totale"
            value={marketData?.totalMarketCap || 28500000000000}
            icon={DollarSign}
            format="currency"
            description="Mercato fixed income totale"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="credit" className="text-xs">Credit Analysis</TabsTrigger>
            <TabsTrigger value="yield-curve" className="text-xs">Yield Curve</TabsTrigger>
            <TabsTrigger value="duration" className="text-xs">Duration Mgmt</TabsTrigger>
            <TabsTrigger value="spreads" className="text-xs">Spread Analysis</TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs">Optimization</TabsTrigger>
            <TabsTrigger value="market-data" className="text-xs">Market Data</TabsTrigger>
          </TabsList>

          {/* Bond Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Government Bonds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Government Bonds
                  </CardTitle>
                  <CardDescription>UST Treasury con scadenze 2Y-30Y</CardDescription>
                </CardHeader>
                <CardContent>
                  <BondTable data={governmentBonds} type="government" />
                </CardContent>
              </Card>

              {/* Corporate Bonds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Corporate Bonds
                  </CardTitle>
                  <CardDescription>Investment Grade & High Yield</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti i rating</SelectItem>
                        <SelectItem value="AAA">AAA</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="BBB">BBB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <BondTable data={filteredCorporateBonds} type="corporate" />
                </CardContent>
              </Card>
            </div>

            {/* Municipal Bonds and CDOs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Municipal Bonds
                  </CardTitle>
                  <CardDescription>Tax-exempt state e local bonds</CardDescription>
                </CardHeader>
                <CardContent>
                  <BondTable data={municipalBonds} type="municipal" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Structured Products
                  </CardTitle>
                  <CardDescription>CDO tranches e ABS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Product</th>
                          <th className="text-left p-2">Tranche</th>
                          <th className="text-right p-2">Yield</th>
                          <th className="text-right p-2">Spread</th>
                          <th className="text-center p-2">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collateralizedDebtObligations.map((cdo) => (
                          <tr key={cdo.id} className="border-b hover:bg-accent/30">
                            <td className="p-2">
                              <div className="font-medium">{cdo.name}</div>
                              <div className="text-xs text-muted-foreground">{cdo.assetType}</div>
                            </td>
                            <td className="p-2">{cdo.trancheType}</td>
                            <td className="p-2 text-right font-mono">{cdo.yield.toFixed(2)}%</td>
                            <td className="p-2 text-right font-mono">{cdo.spread.toFixed(0)} bps</td>
                            <td className="p-2 text-center">
                              <Badge variant="outline">{cdo.rating}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credit Analysis Tab */}
          <TabsContent value="credit" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Default Swaps</CardTitle>
                  <CardDescription>CDS spreads by entity e rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditDefaultSwaps.map((cds) => (
                      <div key={cds.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{cds.referenceEntity}</div>
                          <div className="text-sm text-muted-foreground">{cds.rating} • {cds.tenure}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{cds.spread} bps</div>
                          <div className="text-xs text-muted-foreground">RR: {cds.recoveryRate}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credit Sector Distribution</CardTitle>
                  <CardDescription>Allocazione per settore e rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={corporateBonds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="yield" fill="#3b82f6" name="Yield %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Attribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Attribution</CardTitle>
                <CardDescription>Decomposizione dei rendimenti del portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {performanceAttribution && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Carry', value: performanceAttribution.carry, color: '#10b981' },
                      { name: 'Credit Spread', value: performanceAttribution.creditSpread, color: '#3b82f6' },
                      { name: 'Yield Curve', value: performanceAttribution.yieldCurve, color: '#f59e0b' },
                      { name: 'Currency', value: performanceAttribution.currency, color: '#8b5cf6' },
                      { name: 'Other', value: performanceAttribution.other, color: '#6b7280' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yield Curve Tab */}
          <TabsContent value="yield-curve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yield Curve Analysis</CardTitle>
                <CardDescription>Andamento yield curve governativo con simulazioni stress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={yieldCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="maturity" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                    <Legend />
                    <Line type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                    <ReferenceLine y={4.25} stroke="#ef4444" strokeDasharray="5 5" label="Current 10Y" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Curve Evolution (1Y)</CardTitle>
                  <CardDescription>Movimento storico yield curve</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalYieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" hide />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="yield" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Indicatori chiave yield curve</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Steepness (10Y-2Y)</span>
                      <span className="font-mono">{(4.25 - 4.75).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Butterfly 2Y-10Y-30Y</span>
                      <span className="font-mono">-0.15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Forward Rates (1Y fwd)</span>
                      <span className="font-mono">4.35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Real Yield (TIPS)</span>
                      <span className="font-mono">2.15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Breakeven Inflation</span>
                      <span className="font-mono">2.55%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Duration Management Tab */}
          <TabsContent value="duration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Duration Analysis</CardTitle>
                <CardDescription>Durata effettiva e sensibilità ai tassi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Bond</th>
                        <th className="text-right p-2">Duration</th>
                        <th className="text-right p-2">Mod Duration</th>
                        <th className="text-right p-2">Effective Duration</th>
                        <th className="text-right p-2">ΔP (+1bp)</th>
                        <th className="text-right p-2">ΔP (+100bp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {durationAnalysis.map((bond) => (
                        <tr key={bond.bondId} className="border-b hover:bg-accent/30">
                          <td className="p-2 font-medium">{bond.bondName}</td>
                          <td className="p-2 text-right font-mono">{bond.duration.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono">{bond.modifiedDuration.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono">{bond.effectiveDuration.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono">{(bond.priceChange1BP * 100).toFixed(3)}%</td>
                          <td className="p-2 text-right font-mono">{(bond.priceChange100BP * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {riskMetrics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Duration Profile</CardTitle>
                    <CardDescription>Concentrazione duration per maturity bucket</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { bucket: '0-2Y', duration: 1.2, percentage: 15 },
                        { bucket: '2-5Y', duration: 3.5, percentage: 35 },
                        { bucket: '5-10Y', duration: 7.2, percentage: 30 },
                        { bucket: '10-20Y', duration: 14.5, percentage: 15 },
                        { bucket: '20Y+', duration: 25.0, percentage: 5 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bucket" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#3b82f6" name="Allocation %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metrics</CardTitle>
                    <CardDescription>Metriche di rischio del portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Duration Exposure</div>
                        <div className="text-lg font-mono">{riskMetrics.durationExposure.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Convexity Exposure</div>
                        <div className="text-lg font-mono">{riskMetrics.convexityExposure.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Beta vs Benchmark</div>
                        <div className="text-lg font-mono">{riskMetrics.beta.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tracking Error</div>
                        <div className="text-lg font-mono">{riskMetrics.trackingError.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Information Ratio</div>
                        <div className="text-lg font-mono">{riskMetrics.informationRatio.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Volatility</div>
                        <div className="text-lg font-mono">{riskMetrics.volatility.toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Spread Analysis Tab */}
          <TabsContent value="spreads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Credit Spread Analysis</CardTitle>
                <CardDescription>Analisi spreads per categoria di bond e volatilità</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={spreadAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bondType" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} bps`, 'Spread']} />
                        <Bar dataKey="averageSpread" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {spreadAnalysis.map((analysis, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{analysis.bondType}</span>
                          <Badge variant={analysis.trend === 'Widening' ? 'destructive' : analysis.trend === 'Narrowing' ? 'default' : 'secondary'}>
                            {analysis.trend}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {analysis.averageSpread} bps • Range: {analysis.spreadRange.min}-{analysis.spreadRange.max} bps
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vol: {analysis.volatility.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spread Evolution</CardTitle>
                <CardDescription>Movimento storico credit spreads</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalSpreadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} bps`, 'Spread']} />
                    <Line type="monotone" dataKey="spread" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-4">
            {optimizationResult && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Optimization</CardTitle>
                    <CardDescription>Allocazione ottimizzata basata su risk-return</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Expected Return</span>
                          <span className="text-lg font-bold text-green-500">{optimizationResult.expectedReturn.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Portfolio Duration</span>
                          <span className="text-lg font-mono">{optimizationResult.portfolioDuration.toFixed(2)} anni</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          <span className="text-lg font-mono">{optimizationResult.riskScore.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Concentration</span>
                          <span className="text-lg font-mono">{(optimizationResult.concentration * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[
                            { name: 'Expected', value: optimizationResult.expectedReturn },
                            { name: 'Benchmark', value: 4.25 },
                            { name: 'Risk Score', value: optimizationResult.riskScore * 0.5 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Allocations</CardTitle>
                    <CardDescription>Allocazioni raccomandate per il portfolio ottimale</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {optimizationResult.recommendedBonds.map((bondId) => {
                        const bond = [...governmentBonds, ...corporateBonds].find(b => b.id === bondId);
                        if (!bond) return null;
                        
                        return (
                          <div key={bondId} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{bond.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {bond.ticker} • {bond.maturity}
                                </div>
                              </div>
                              <Badge variant="outline">{bond.yield.toFixed(2)}%</Badge>
                            </div>
                            <div className="mt-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-mono">{bond.duration.toFixed(2)}</span>
                              </div>
                              {'spread' in bond && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Spread:</span>
                                  <span className="font-mono">{bond.spread} bps</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Market Data Tab */}
          <TabsContent value="market-data" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Status generale mercato fixed income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap</span>
                      <span className="font-mono">${(marketData?.totalMarketCap / 1e12).toFixed(2)}T</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Daily Volume</span>
                      <span className="font-mono">${(marketData?.dailyVolume / 1e9).toFixed(1)}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Yield</span>
                      <span className="font-mono">{marketData?.averageYield.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Benchmark</span>
                      <span className="font-mono">{marketData?.benchmarkYield.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Spread vs Benchmark</span>
                      <span className="font-mono">{(marketData?.yieldSpread * 100).toFixed(1)} bps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>Notifiche e segnali di mercato</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>Credit spreads widening (+15bps)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Duration extension opportunity</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span>New AAA issuance - Technology</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calculator className="h-4 w-4 text-purple-500" />
                      <span>CDO refinancing window</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Strumenti rapidi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcola Duration
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analizza Spread
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Ottimizza Portfolio
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Report PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Economic Calendar</CardTitle>
                <CardDescription>Eventi economici rilevanti per fixed income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Questa Settimana</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fed Minutes</span>
                        <span className="text-muted-foreground">Mer 20:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Initial Jobless Claims</span>
                        <span className="text-muted-foreground">Gio 14:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Existing Home Sales</span>
                        <span className="text-muted-foreground">Ven 16:00</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Prossima Settimana</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>PCE Price Index</span>
                        <span className="text-muted-foreground">Ven 14:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manufacturing PMI</span>
                        <span className="text-muted-foreground">Lun 15:45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FOMC Meeting</span>
                        <span className="text-muted-foreground">Mar-Mer</span>
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