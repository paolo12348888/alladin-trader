import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  Leaf,
  TrendingUp,
  Thermometer,
  Users,
  Shield,
  DollarSign,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Target,
  Globe
} from "lucide-react";
import {
  SustainableInvestingService,
  ESGScore,
  ClimateRiskMetrics,
  SocialImpactMetrics,
  GovernanceMetrics,
  GreenBond,
  SustainableDevelopmentGoal,
  PortfolioSustainability
} from "@/services/SustainableInvestingService";

const COLORS = {
  primary: "#10b981",
  secondary: "#059669",
  accent: "#34d399",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6"
};

const RADAR_COLORS = ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0"];

export default function SustainableInvesting() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("esg-overview");
  const [esgScore, setEsgScore] = useState<ESGScore | null>(null);
  const [climateRisk, setClimateRisk] = useState<ClimateRiskMetrics | null>(null);
  const [socialImpact, setSocialImpact] = useState<SocialImpactMetrics | null>(null);
  const [governanceMetrics, setGovernanceMetrics] = useState<GovernanceMetrics | null>(null);
  const [greenBonds, setGreenBonds] = useState<GreenBond[]>([]);
  const [sdgAlignment, setSdgAlignment] = useState<SustainableDevelopmentGoal[]>([]);
  const [portfolioSustainability, setPortfolioSustainability] = useState<PortfolioSustainability | null>(null);
  const [sustainabilityHistory, setSustainabilityHistory] = useState<any[]>([]);
  const [sectorBreakdown, setSectorBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          esgData,
          climateData,
          socialData,
          governanceData,
          bondsData,
          sdgData,
          portfolioData,
          historyData,
          sectorData
        ] = await Promise.all([
          SustainableInvestingService.getESGScore(),
          SustainableInvestingService.getClimateRiskMetrics(),
          SustainableInvestingService.getSocialImpactMetrics(),
          SustainableInvestingService.getGovernanceMetrics(),
          SustainableInvestingService.getGreenBonds(),
          SustainableInvestingService.getSDGAlignment(),
          SustainableInvestingService.getPortfolioSustainability(),
          SustainableInvestingService.getSustainabilityHistory(),
          SustainableInvestingService.getSectorBreakdown()
        ]);

        setEsgScore(esgData);
        setClimateRisk(climateData);
        setSocialImpact(socialData);
        setGovernanceMetrics(governanceData);
        setGreenBonds(bondsData);
        setSdgAlignment(sdgData);
        setPortfolioSustainability(portfolioData);
        setSustainabilityHistory(historyData);
        setSectorBreakdown(sectorData);
      } catch (error) {
        console.error("Errore nel caricamento dei dati ESG:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getESGGrade = (score: number) => SustainableInvestingService.getESGGrade(score);
  const getClimateRiskLevel = (risk: number) => SustainableInvestingService.getClimateRiskLevel(risk);
  const getTemperatureAlignmentLabel = (temp: number) => SustainableInvestingService.getTemperatureAlignmentLabel(temp);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento dati di sostenibilità...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const radarData = esgScore ? [
    { subject: 'Ambiente', E: esgScore.environmental, fullMark: 100 },
    { subject: 'Sociale', S: esgScore.social, fullMark: 100 },
    { subject: 'Governance', G: esgScore.governance, fullMark: 100 }
  ] : [];

  const pieData = sectorBreakdown.map(item => ({
    name: item.sector,
    value: item.allocation,
    esgScore: item.esgScore
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-500" />
              Sustainable Investing
            </h1>
            <p className="text-muted-foreground mt-2">
              Analisi ESG istituzionale ispirata al Norwegian Government Pension Fund
            </p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="h-4 w-4 mr-2" />
            Standard Internazionali
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="esg-overview">ESG Overview</TabsTrigger>
            <TabsTrigger value="portfolio-sustainability">Portfolio</TabsTrigger>
            <TabsTrigger value="climate-risk">Climate Risk</TabsTrigger>
            <TabsTrigger value="social-impact">Social Impact</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="green-bonds">Green Bonds</TabsTrigger>
            <TabsTrigger value="sustainability-metrics">Metrics</TabsTrigger>
          </TabsList>

          {/* ESG Overview Tab */}
          <TabsContent value="esg-overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Score ESG Complessivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                    {esgScore?.overall.toFixed(1)}
                  </div>
                  <Badge variant="outline" className="mt-2 bg-green-500 text-white">
                    {esgScore ? getESGGrade(esgScore.overall) : "N/A"}
                  </Badge>
                  <Progress 
                    value={esgScore?.overall || 0} 
                    className="mt-3 h-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Ambientale (E)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{esgScore?.environmental.toFixed(1)}</div>
                  <Progress value={esgScore?.environmental || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Carbon footprint, energia rinnovabile, economia circolare
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Sociale (S)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{esgScore?.social.toFixed(1)}</div>
                  <Progress value={esgScore?.social || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Diritti umani, pratiche lavorative, responsabilità prodotto
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    Governance (G)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{esgScore?.governance.toFixed(1)}</div>
                  <Progress value={esgScore?.governance || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Struttura del CdA, trasparenza, diritti azionisti
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analisi ESG Radar</CardTitle>
                  <CardDescription>Valutazione tridimensionale dei fattori ESG</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Score ESG"
                        dataKey="E"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendenza Storica ESG</CardTitle>
                  <CardDescription>Andamento degli score ESG nel tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sustainabilityHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="esgScore" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Sustainability Tab */}
          <TabsContent value="portfolio-sustainability" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Asset Sostenibili</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {portfolioSustainability?.sustainableAssets.toLocaleString('it-IT', { 
                      style: 'currency', 
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    di {portfolioSustainability?.totalAssets.toLocaleString('it-IT', { 
                      style: 'currency', 
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })} totali
                  </p>
                  <Progress 
                    value={portfolioSustainability?.esgCompliance || 0} 
                    className="mt-3 h-3" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Intensità Carbonio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {portfolioSustainability?.carbonIntensity.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">tCO2e/million USD</p>
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">-15% vs benchmark</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Verde</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {portfolioSustainability?.greenRevenue.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Fatturato da attività verdi</p>
                  <Progress 
                    value={portfolioSustainability?.greenRevenue || 0} 
                    className="mt-3 h-3" 
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allocazione per Settore</CardTitle>
                  <CardDescription>Distribuzione ESG-friendly degli investimenti</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.primary} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score ESG per Settore</CardTitle>
                  <CardDescription>Performance ESG per settore di investimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sectorBreakdown} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="sector" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="esgScore" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Climate Risk Tab */}
          <TabsContent value="climate-risk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-orange-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">
                    {climateRisk?.carbonFootprint.toFixed(0)}
                  </div>
                  <p className="text-xs text-red-700">tCO2e annue</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">Rischio Transizione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {climateRisk?.transitionRisk.toFixed(0)}%
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {climateRisk ? getClimateRiskLevel(climateRisk.transitionRisk) : ""}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Rischio Fisico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {climateRisk?.physicalRisk.toFixed(0)}%
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {climateRisk ? getClimateRiskLevel(climateRisk.physicalRisk) : ""}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Climatic VaR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {climateRisk?.climateValueAtRisk.toFixed(1)}%
                  </div>
                  <p className="text-xs text-purple-700">Impatto potenziale valore</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Allineamento Obiettivi Climatici
                </CardTitle>
                <CardDescription>
                  Temperatura target: {climateRisk ? getTemperatureAlignmentLabel(climateRisk.temperatureAlignment) : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1.5°C Well Below 2°C</span>
                    <div className="flex items-center gap-2">
                      <Progress value={climateRisk?.temperatureAlignment === 1.5 ? 100 : 0} className="w-20 h-2" />
                      {climateRisk?.temperatureAlignment === 1.5 && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2°C Well Below 2°C</span>
                    <div className="flex items-center gap-2">
                      <Progress value={climateRisk?.temperatureAlignment === 2.0 ? 100 : 0} className="w-20 h-2" />
                      {climateRisk?.temperatureAlignment === 2.0 && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">&gt; 2°C Above 2°C</span>
                    <div className="flex items-center gap-2">
                      <Progress value={climateRisk?.temperatureAlignment === 3.0 ? 100 : 0} className="w-20 h-2" />
                      {climateRisk?.temperatureAlignment === 3.0 && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Impact Tab */}
          <TabsContent value="social-impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Community Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialImpact?.communityScore.toFixed(1)}</div>
                  <Progress value={socialImpact?.communityScore || 0} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Diritti Umani</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialImpact?.humanRightsScore.toFixed(1)}</div>
                  <Progress value={socialImpact?.humanRightsScore || 0} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pratiche Lavorative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialImpact?.laborPracticesScore.toFixed(1)}</div>
                  <Progress value={socialImpact?.laborPracticesScore || 0} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Responsabilità Prodotto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialImpact?.productResponsibilityScore.toFixed(1)}</div>
                  <Progress value={socialImpact?.productResponsibilityScore || 0} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Stakeholder Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialImpact?.stakeholderEngagementScore.toFixed(1)}</div>
                  <Progress value={socialImpact?.stakeholderEngagementScore || 0} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impatto Sociale nel Tempo</CardTitle>
                <CardDescription>Evoluzione delle metriche di responsabilità sociale</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sustainabilityHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="socialScore" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Composizione CdA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.boardComposition.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.boardComposition || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Diversità e indipendenza</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Compensi Dirigenti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.executiveCompensation.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.executiveCompensation || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Allineamento con performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Diritti Azionisti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.shareholderRights.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.shareholderRights || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Protezione investitori</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Trasparenza</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.transparencyScore.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.transparencyScore || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Reporting e disclosure</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Anti-corruzione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.antiCorruptionScore.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.antiCorruptionScore || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Sistemi di controllo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Etica Aziendale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{governanceMetrics?.ethicsScore.toFixed(1)}</div>
                  <Progress value={governanceMetrics?.ethicsScore || 0} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Codice etico e compliance</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analisi Governance Comparativa</CardTitle>
                <CardDescription>Confronto con standard di settore e benchmark ESG</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Composizione CdA', nostro: governanceMetrics?.boardComposition || 0, benchmark: 75 },
                    { name: 'Compensi', nostro: governanceMetrics?.executiveCompensation || 0, benchmark: 65 },
                    { name: 'Diritti Azionisti', nostro: governanceMetrics?.shareholderRights || 0, benchmark: 80 },
                    { name: 'Trasparenza', nostro: governanceMetrics?.transparencyScore || 0, benchmark: 78 },
                    { name: 'Anti-corruzione', nostro: governanceMetrics?.antiCorruptionScore || 0, benchmark: 85 },
                    { name: 'Etica', nostro: governanceMetrics?.ethicsScore || 0, benchmark: 82 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nostro" fill="#10b981" name="Il Nostro Portfolio" />
                    <Bar dataKey="benchmark" fill="#6b7280" name="Benchmark Settore" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Green Bonds Tab */}
          <TabsContent value="green-bonds" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {greenBonds.map((bond) => (
                <Card key={bond.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-medium">
                    {bond.rating}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{bond.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      ${bond.amount}M • {bond.yield}% yield
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emittente</p>
                      <p className="text-sm">{bond.issuer}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Scadenza</p>
                      <p className="text-sm">{bond.maturity}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Utilizzo Proventi</p>
                      <div className="flex flex-wrap gap-1">
                        {bond.useOfProceeds.map((use, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-green-600 mb-1">Impatto Climatico</p>
                      <p className="text-xs text-muted-foreground">{bond.climateImpact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Performance Green Bonds
                </CardTitle>
                <CardDescription>Andamento dei rendimenti vs corporate bond tradizionali</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Gen', green: 2.8, traditional: 3.2 },
                    { month: 'Feb', green: 2.9, traditional: 3.1 },
                    { month: 'Mar', green: 2.85, traditional: 3.15 },
                    { month: 'Apr', green: 2.95, traditional: 3.25 },
                    { month: 'Mag', green: 3.0, traditional: 3.3 },
                    { month: 'Giu', green: 2.98, traditional: 3.28 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[2.5, 3.5]} />
                    <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="green" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Green Bonds"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="traditional" 
                      stroke="#6b7280" 
                      strokeWidth={2}
                      name="Corporate Bond"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sustainability Metrics Tab */}
          <TabsContent value="sustainability-metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Allineamento UN Sustainable Development Goals
                </CardTitle>
                <CardDescription>Contributo del portfolio agli SDG dell'Onu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sdgAlignment.map((sdg) => (
                  <div key={sdg.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{sdg.id}: {sdg.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{sdg.target}</p>
                      </div>
                      <Badge variant="outline">{sdg.investment.toFixed(1)}% portfolio</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Score di Impatto</p>
                        <div className="flex items-center gap-2">
                          <Progress value={sdg.score} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{sdg.score.toFixed(0)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Allineamento</p>
                        <div className="flex items-center gap-2">
                          <Progress value={sdg.alignment} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{sdg.alignment.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evoluzione Intensità Carbonio</CardTitle>
                  <CardDescription>Progresso verso la decarbonizzazione</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={sustainabilityHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="carbonIntensity" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crescita Revenue Verde</CardTitle>
                  <CardDescription>Percentuale di fatturato da attività sostenibili</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={sustainabilityHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="greenRevenue" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}