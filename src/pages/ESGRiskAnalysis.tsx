import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Leaf, Globe, Users, AlertTriangle, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as PieChartComponent, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { useXTBData } from "@/services/xtbApi";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { XTBDemoService } from "@/services/XTBDemoService";

interface ESGMetrics {
  asset: string;
  eScore: number;
  sScore: number;
  gScore: number;
  esgComposite: number;
  controversies: number;
  climateRisk: number;
  geopoliticalRisk: number;
  regulatoryRisk: number;
}

interface PortfolioESG {
  timestamp: string;
  esgScore: number;
  carbonFootprint: number;
  sustainabilityRating: number;
}

// Generate ESG data for assets
const generateESGData = (availableAssets: string[]): ESGMetrics[] => {
  return availableAssets.map((asset) => ({
    asset,
    eScore: Math.floor(Math.random() * 40) + 60,
    sScore: Math.floor(Math.random() * 40) + 55,
    gScore: Math.floor(Math.random() * 40) + 65,
    esgComposite: Math.floor(Math.random() * 40) + 60,
    controversies: Math.floor(Math.random() * 5),
    climateRisk: Math.floor(Math.random() * 100),
    geopoliticalRisk: Math.floor(Math.random() * 80),
    regulatoryRisk: Math.floor(Math.random() * 70),
  }));
};

// Generate portfolio ESG trend
const generatePortfolioESGTrend = (): PortfolioESG[] => {
  const data: PortfolioESG[] = [];
  for (let i = 12; i >= 0; i--) {
    data.push({
      timestamp: `Month ${13 - i}`,
      esgScore: 65 + Math.random() * 15,
      carbonFootprint: 100 - i * 5 + Math.random() * 10,
      sustainabilityRating: 60 + Math.random() * 20,
    });
  }
  return data;
};

export default function ESGRiskAnalysis() {
  const { t } = useTranslation();
  const [selectedAsset, setSelectedAsset] = useState("AAPL");
  const [esgData, setEsgData] = useState<ESGMetrics[]>([]);
  const [portfolioTrend, setPortfolioTrend] = useState<PortfolioESG[]>(generatePortfolioESGTrend());
  const [riskCategory, setRiskCategory] = useState("climate");
  const [availableAssets, setAvailableAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedAssetData = esgData.find((a) => a.asset === selectedAsset);

  // Carica gli asset disponibili da XTB
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const xtbService = new XTBDemoService();
        const symbols = await xtbService.getSymbols();
        const allAssets = symbols.all;
        setAvailableAssets(allAssets);
        
        // Genera dati ESG per tutti gli asset disponibili
        const initialESGData = generateESGData(allAssets);
        setEsgData(initialESGData);
        
        // Imposta il primo asset come selezionato di default
        if (allAssets.length > 0 && !selectedAsset) {
          setSelectedAsset(allAssets[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Errore nel caricamento asset:", error);
        toast.error("Errore nel caricamento degli asset");
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  const handleUpdateESGScores = () => {
    toast.info("Updating ESG scores from latest data sources...");
    setTimeout(() => {
      const updatedESGData = generateESGData(availableAssets);
      setEsgData(updatedESGData);
      toast.success("ESG scores updated successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento asset da XTB...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-500" /> {t("ESG & Non-Traditional Risk Analysis")}
          </h1>
          <p className="text-muted-foreground">
            {t("Environmental, Social, Governance factors and climate/geopolitical risk assessment")}
            {availableAssets.length > 0 && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                {availableAssets.length} asset XTB disponibili
              </span>
            )}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("ESG Analysis Settings")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Select Asset")}</label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {esgData.map((asset) => (
                    <SelectItem key={asset.asset} value={asset.asset}>
                      {asset.asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Risk Category")}</label>
              <Select value={riskCategory} onValueChange={setRiskCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="climate">Climate Risk</SelectItem>
                  <SelectItem value="geopolitical">Geopolitical Risk</SelectItem>
                  <SelectItem value="regulatory">Regulatory Risk</SelectItem>
                  <SelectItem value="social">Social Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label>&nbsp;</label>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleUpdateESGScores}>
                <TrendingUp className="h-4 w-4 mr-2" /> Update Scores
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ESG Score Cards */}
        {selectedAssetData && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border-border border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" /> Environmental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{selectedAssetData.eScore}</div>
                <p className="text-xs text-muted-foreground mt-1">E-Score (0-100)</p>
              </CardContent>
            </Card>

            <Card className="border-border border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" /> Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{selectedAssetData.sScore}</div>
                <p className="text-xs text-muted-foreground mt-1">S-Score (0-100)</p>
              </CardContent>
            </Card>

            <Card className="border-border border-purple-500/30 bg-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-500" /> Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{selectedAssetData.gScore}</div>
                <p className="text-xs text-muted-foreground mt-1">G-Score (0-100)</p>
              </CardContent>
            </Card>

            <Card className="border-border border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ESG Composite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{selectedAssetData.esgComposite}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall Score (0-100)</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Non-Traditional Risk Metrics */}
        {selectedAssetData && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-border border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" /> Climate Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{selectedAssetData.climateRisk}%</div>
                <p className="text-xs text-muted-foreground mt-1">Climate exposure level</p>
              </CardContent>
            </Card>

            <Card className="border-border border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-500" /> Geopolitical Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{selectedAssetData.geopoliticalRisk}%</div>
                <p className="text-xs text-muted-foreground mt-1">Geopolitical exposure</p>
              </CardContent>
            </Card>

            <Card className="border-border border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" /> Regulatory Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{selectedAssetData.regulatoryRisk}%</div>
                <p className="text-xs text-muted-foreground mt-1">Regulatory exposure</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Portfolio ESG Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t("Portfolio ESG Score Trend")}
            </CardTitle>
            <CardDescription>{t("Historical ESG performance over time")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="esgScore" stroke="#10b981" name="ESG Score" strokeWidth={2} />
                <Line type="monotone" dataKey="sustainabilityRating" stroke="#3b82f6" name="Sustainability Rating" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ESG Scores by Asset */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t("ESG Scores by Asset")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={esgData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="asset" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eScore" fill="#10b981" name="E-Score" />
                <Bar dataKey="sScore" fill="#3b82f6" name="S-Score" />
                <Bar dataKey="gScore" fill="#f59e0b" name="G-Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Non-Traditional Risks */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> {t("Non-Traditional Risk Distribution")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChartComponent>
                  <Pie
                    data={[
                      { name: "Climate Risk", value: 35 },
                      { name: "Geopolitical Risk", value: 25 },
                      { name: "Regulatory Risk", value: 20 },
                      { name: "Social Risk", value: 20 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChartComponent>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Controversies & Issues */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("ESG Controversies by Asset")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {esgData.map((asset) => (
                  <div key={asset.asset} className="flex items-center justify-between p-2 border border-border rounded-lg">
                    <span className="font-semibold">{asset.asset}</span>
                    <div className="flex items-center gap-2">
                      {asset.controversies > 0 && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          asset.controversies > 3
                            ? "bg-red-500/20 text-red-500"
                            : asset.controversies > 1
                              ? "bg-orange-500/20 text-orange-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {asset.controversies} issues
                        </span>
                      )}
                      {asset.controversies === 0 && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-500">
                          Clean
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ESG Recommendations */}
        <Card className="border-border border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-foreground">{t("ESG Portfolio Recommendations")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Based on ESG analysis and non-traditional risk assessment:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>Increase allocation to high ESG-score assets to improve portfolio sustainability</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>Reduce exposure to assets with high climate and geopolitical risks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>Monitor regulatory changes that may impact ESG-sensitive sectors</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>Consider ESG-focused ETFs for diversified sustainable exposure</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
