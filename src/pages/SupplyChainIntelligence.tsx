import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Ship, 
  Factory,
  Mountain,
  Satellite,
  Zap,
  Target,
  Shield,
  Globe,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  Anchor
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
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import {
  supplyChainService,
  type SupplyChainPoint,
  type CommodityPrediction,
  type SupplyChainDisruption,
  type AlphaSignal,
  type SupplyChainRiskMetrics,
  type SatelliteMonitoring,
  type ShippingAnalytics,
  type SentimentAnalysis,
  type CorrelationMatrix
} from "@/services/supplyChainService";

interface OverviewMetrics {
  total_supply_points: number;
  operational_points: number;
  risk_alerts: number;
  active_disruptions: number;
  signal_generated_today: number;
  average_confidence: number;
}

const SUPPLY_CHAIN_ICONS = {
  port: Anchor,
  mine: Mountain,
  factory: Factory,
  refinery: Factory,
  terminal: Truck
};

const RISK_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500", 
  high: "bg-orange-500",
  critical: "bg-red-500"
};

const STATUS_COLORS = {
  operational: "bg-green-500",
  disrupted: "bg-red-500",
  maintenance: "bg-yellow-500",
  offline: "bg-gray-500"
};

// Dati simulati per heatmap correlazioni
const CORRELATION_HEATMAP_DATA = [
  { x: "XAUUSD", y: "XAGUSD", value: 0.78, label: "Oro-Argento" },
  { x: "XAUUSD", y: "CRUDE", value: -0.23, label: "Oro-Petrolio" },
  { x: "XAGUSD", y: "LITHIUM", value: 0.45, label: "Argento-Litio" },
  { x: "CRUDE", y: "COPPER", value: 0.52, label: "Petrolio-Rame" },
  { x: "WHEAT", y: "CRUDE", value: 0.18, label: "Grano-Petrolio" },
  { x: "LITHIUM", y: "COPPER", value: 0.61, label: "Litio-Rame" }
];

// Dati simulati per price predictions chart
const PREDICTION_CHART_DATA = [
  { time: "00:00", gold: 2018, silver: 24.82, oil: 78.34 },
  { time: "04:00", gold: 2022, silver: 24.95, oil: 78.56 },
  { time: "08:00", gold: 2035, silver: 25.15, oil: 79.12 },
  { time: "12:00", gold: 2040, silver: 25.28, oil: 79.45 },
  { time: "16:00", gold: 2045, silver: 25.42, oil: 79.89 },
  { time: "20:00", gold: 2050, silver: 25.55, oil: 80.23 }
];

// Dati per supply chain flow
const SUPPLY_FLOW_DATA = [
  { name: "Mining", value: 35, color: "#8b5cf6" },
  { name: "Transportation", value: 25, color: "#06b6d4" },
  { name: "Processing", value: 20, color: "#10b981" },
  { name: "Storage", value: 15, color: "#f59e0b" },
  { name: "Distribution", value: 5, color: "#ef4444" }
];

export default function SupplyChainIntelligence() {
  // State management
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
  const [supplyChainPoints, setSupplyChainPoints] = useState<SupplyChainPoint[]>([]);
  const [commodityPredictions, setCommodityPredictions] = useState<CommodityPrediction[]>([]);
  const [disruptions, setDisruptions] = useState<SupplyChainDisruption[]>([]);
  const [alphaSignals, setAlphaSignals] = useState<AlphaSignal[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<SupplyChainRiskMetrics | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteMonitoring[]>([]);
  const [shippingAnalytics, setShippingAnalytics] = useState<ShippingAnalytics[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [
          overviewData,
          pointsData,
          predictionsData,
          disruptionsData,
          signalsData,
          riskData,
          satelliteMonitoringData,
          shippingData,
          sentimentAnalysisData,
          correlationData
        ] = await Promise.all([
          supplyChainService.getOverviewMetrics(),
          supplyChainService.getSupplyChainPoints(),
          supplyChainService.getCommodityPredictions(),
          supplyChainService.getDisruptions(),
          supplyChainService.getAlphaSignals(),
          supplyChainService.getRiskMetrics(),
          supplyChainService.getSatelliteData(),
          supplyChainService.getShippingAnalytics(),
          supplyChainService.getSentimentData(),
          supplyChainService.getCorrelationMatrix()
        ]);

        setOverviewMetrics(overviewData);
        setSupplyChainPoints(pointsData);
        setCommodityPredictions(predictionsData);
        setDisruptions(disruptionsData);
        setAlphaSignals(signalsData);
        setRiskMetrics(riskData);
        setSatelliteData(satelliteMonitoringData);
        setShippingAnalytics(shippingData);
        setSentimentData(sentimentAnalysisData);
        setCorrelationMatrix(correlationData);
      } catch (error) {
        console.error("Errore caricamento dati Supply Chain Intelligence:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    return RISK_COLORS[risk as keyof typeof RISK_COLORS] || "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-500";
  };

  const formatChange = (change: number) => {
    const prefix = change >= 0 ? "+" : "";
    return `${prefix}${change.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Caricamento Supply Chain Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Supply Chain Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitoraggio real-time e predizioni algoritmiche per supply chain e commodity prices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            Algo Active
          </Badge>
        </div>
      </div>

      {/* Overview Metrics */}
      {overviewMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Supply Points
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {overviewMetrics.total_supply_points}
              </div>
              <p className="text-xs text-muted-foreground">
                {overviewMetrics.operational_points} operativi
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Risk Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {overviewMetrics.risk_alerts}
              </div>
              <p className="text-xs text-muted-foreground">
                Alto/Critico rischio
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disruption
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {overviewMetrics.active_disruptions}
              </div>
              <p className="text-xs text-muted-foreground">
                Active disruptions
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alpha Signals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {overviewMetrics.signal_generated_today}
              </div>
              <p className="text-xs text-muted-foreground">
                Generati oggi
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Confidence
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {overviewMetrics.average_confidence}%
              </div>
              <p className="text-xs text-muted-foreground">
                Confidenza media
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Risk Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {riskMetrics ? riskMetrics.overall_risk_score : "--"}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall risk
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="signals">Alpha Signals</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Supply Chain Map & Points */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Supply Chain Network
                </CardTitle>
                <CardDescription>
                  Monitoraggio real-time di porti, miniere e impianti globali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplyChainPoints.map((point) => {
                    const Icon = SUPPLY_CHAIN_ICONS[point.type];
                    return (
                      <div key={point.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{point.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {point.type.charAt(0).toUpperCase() + point.type.slice(1)} • {point.capacity_utilization}% capacità
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(point.status)} text-white`}>
                            {point.status}
                          </Badge>
                          <Badge className={`${getRiskColor(point.risk_level)} text-white`}>
                            {point.risk_level}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Flow */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Supply Chain Flow
                </CardTitle>
                <CardDescription>
                  Distribuzione del flusso supply chain per categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={SUPPLY_FLOW_DATA}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {SUPPLY_FLOW_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Disruptions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Supply Chain Disruptions
              </CardTitle>
              <CardDescription>
                Monitoraggio disruption attive e loro impatto sui commodity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disruptions.map((disruption) => (
                  <div key={disruption.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{disruption.title}</h3>
                          <Badge 
                            className={
                              disruption.severity === 'critical' ? 'bg-red-500 text-white' :
                              disruption.severity === 'high' ? 'bg-orange-500 text-white' :
                              disruption.severity === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-blue-500 text-white'
                            }
                          >
                            {disruption.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{disruption.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            <strong>Location:</strong> {disruption.location}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Impact:</strong> {(disruption.estimated_impact * 100).toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Probability:</strong> {(disruption.probability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {disruption.affected_commodities.map((commodity) => (
                            <Badge key={commodity} variant="outline">
                              {commodity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={
                            disruption.current_status === 'resolved' ? 'text-green-600' :
                            disruption.current_status === 'mitigating' ? 'text-blue-600' :
                            disruption.current_status === 'confirmed' ? 'text-orange-600' :
                            'text-gray-600'
                          }
                        >
                          {disruption.current_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          {/* Price Predictions Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Commodity Price Predictions
              </CardTitle>
              <CardDescription>
                Predizioni algoritmo Supply Chain Disruption & Commodity Price Prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={PREDICTION_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="gold" stroke="#fbbf24" strokeWidth={2} name="Gold" />
                    <Line type="monotone" dataKey="silver" stroke="#9ca3af" strokeWidth={2} name="Silver" />
                    <Line type="monotone" dataKey="oil" stroke="#6b7280" strokeWidth={2} name="Oil" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Commodity Predictions Details */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commodityPredictions.map((prediction) => (
              <Card key={prediction.symbol} className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{prediction.name}</span>
                    <Badge variant="outline">{prediction.symbol}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Price</span>
                      <span className="font-medium">${prediction.current_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h Prediction</span>
                      <span className={prediction.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatChange(prediction.price_change_24h)} (${prediction.predicted_price_24h.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">7d Prediction</span>
                      <span className={prediction.price_change_7d >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatChange(prediction.price_change_7d)} (${prediction.predicted_price_7d.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Technical Signals</div>
                    <div className="flex gap-1">
                      <Badge 
                        variant="outline" 
                        className={
                          prediction.technical_signals.short_term_trend === 'bullish' ? 'text-green-600' :
                          prediction.technical_signals.short_term_trend === 'bearish' ? 'text-red-600' :
                          'text-gray-600'
                        }
                      >
                        {prediction.technical_signals.short_term_trend}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={
                          prediction.technical_signals.medium_term_trend === 'bullish' ? 'text-green-600' :
                          prediction.technical_signals.medium_term_trend === 'bearish' ? 'text-red-600' :
                          'text-gray-600'
                        }
                      >
                        {prediction.technical_signals.medium_term_trend}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Key Factors</div>
                    {prediction.disruption_factors.slice(0, 2).map((factor, index) => (
                      <div key={index} className="text-xs text-muted-foreground bg-accent rounded px-2 py-1">
                        {factor}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alpha Signals Tab */}
        <TabsContent value="signals" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Alpha Signal Generator
              </CardTitle>
              <CardDescription>
                Segnali Long/Short generati dall'algoritmo Supply Chain Disruption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alphaSignals.map((signal) => (
                  <div key={signal.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={signal.action === 'LONG' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        >
                          {signal.action}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{signal.symbol}</h3>
                        <Badge variant="outline">{signal.strategy}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{signal.confidence}%</div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Entry Price</div>
                        <div className="font-medium">${signal.entry_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Target Price</div>
                        <div className="font-medium text-green-500">${signal.target_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stop Loss</div>
                        <div className="font-medium text-red-500">${signal.stop_loss.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expected Return</div>
                        <div className="font-medium text-green-500">+{signal.expected_return}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {signal.catalysts.slice(0, 2).map((catalyst, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {catalyst}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        R/R: {signal.risk_reward_ratio.toFixed(1)} • {signal.time_horizon}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      <strong>Supply Chain Factor:</strong> {signal.supply_chain_factor}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risks" className="space-y-6">
          {riskMetrics && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Supply Chain Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Metriche di rischio per categorie supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Geopolitical Risk', value: riskMetrics.geopolitical_risk, color: 'bg-red-500' },
                    { label: 'Transport Risk', value: riskMetrics.transport_risk, color: 'bg-orange-500' },
                    { label: 'Labor Risk', value: riskMetrics.labor_risk, color: 'bg-yellow-500' },
                    { label: 'Weather Risk', value: riskMetrics.weather_risk, color: 'bg-blue-500' },
                    { label: 'Infrastructure Risk', value: riskMetrics.infrastructure_risk, color: 'bg-green-500' },
                    { label: 'Concentration Risk', value: riskMetrics.concentration_risk, color: 'bg-purple-500' }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">{metric.value}/100</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Satellite Monitoring */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Satellite Monitoring
                  </CardTitle>
                  <CardDescription>
                    Indicatori attività da immagini satellitari simulate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {satelliteData.map((sat, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border bg-card">
                      <h3 className="font-medium text-foreground mb-2">{sat.location}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Port Activity:</span>
                          <span className="ml-2 font-medium">{sat.activity_indicators.port_activity}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mining Activity:</span>
                          <span className="ml-2 font-medium">{sat.activity_indicators.mining_activity}%</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last updated: {new Date(sat.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Commodity Correlation Matrix
              </CardTitle>
              <CardDescription>
                Heatmap correlazioni tra supply chain e commodity prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CORRELATION_HEATMAP_DATA.map((correlation, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{correlation.label}</span>
                      <Badge 
                        variant="outline"
                        className={
                          correlation.value > 0.6 ? 'text-green-600' :
                          correlation.value > 0.3 ? 'text-yellow-600' :
                          correlation.value > 0 ? 'text-blue-600' :
                          'text-red-600'
                        }
                      >
                        {correlation.value.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={
                          correlation.value > 0.6 ? 'bg-green-500' :
                          correlation.value > 0.3 ? 'bg-yellow-500' :
                          correlation.value > 0 ? 'bg-blue-500' :
                          'bg-red-500'
                        }
                        style={{ width: `${Math.abs(correlation.value) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Shipping Analytics */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  Shipping Analytics
                </CardTitle>
                <CardDescription>
                  Dati traffico navale e porti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shippingAnalytics.map((route, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-foreground">{route.route_name}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          route.congestion_level === 'critical' ? 'text-red-600' :
                          route.congestion_level === 'high' ? 'text-orange-600' :
                          route.congestion_level === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }
                      >
                        {route.congestion_level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transit Time:</span>
                        <span className="ml-2 font-medium">{route.current_transit_time}d</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="ml-2 font-medium">{((route.used_capacity / route.available_capacity) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Freight Rate: ${route.freight_rates.spot_rate.toLocaleString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Analisi notizie e social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sentimentData.map((sentiment, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-foreground">{sentiment.source}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          sentiment.impact_on_prices === 'positive' ? 'text-green-600' :
                          sentiment.impact_on_prices === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }
                      >
                        {sentiment.impact_on_prices}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sentiment Score</span>
                        <span className="font-medium">{(sentiment.sentiment_score * 100).toFixed(0)}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>👍 {sentiment.positive_mentions}</span>
                        <span>👎 {sentiment.negative_mentions}</span>
                        <span>😐 {sentiment.neutral_mentions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}