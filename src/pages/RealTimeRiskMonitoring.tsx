import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Activity, Zap, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as PieChartComponent, Pie, Cell } from "recharts";
import { toast } from "sonner";

interface RiskMetric {
  timestamp: Date;
  var95: number;
  var99: number;
  cvar95: number;
  liquidityRisk: number;
  counterpartyRisk: number;
  concentrationRisk: number;
}

interface PortfolioRisk {
  asset: string;
  weight: number;
  var95: number;
  riskContribution: number;
}

// Genera dati mock per il monitoraggio del rischio
const generateRiskData = (): RiskMetric[] => {
  const data: RiskMetric[] = [];
  const now = Date.now();
  
  for (let i = 100; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60 * 1000),
      var95: 2.5 + Math.random() * 2,
      var99: 3.2 + Math.random() * 2.5,
      cvar95: 4.1 + Math.random() * 3,
      liquidityRisk: 15 + Math.random() * 20,
      counterpartyRisk: 8 + Math.random() * 12,
      concentrationRisk: 25 + Math.random() * 30,
    });
  }
  return data;
};

// Genera dati per il rischio per asset
const generatePortfolioRiskData = (): PortfolioRisk[] => {
  return [
    { asset: "AAPL", weight: 25, var95: 2.8, riskContribution: 0.7 },
    { asset: "MSFT", weight: 20, var95: 2.5, riskContribution: 0.5 },
    { asset: "GOOGL", weight: 20, var95: 3.1, riskContribution: 0.62 },
    { asset: "AMZN", weight: 18, var95: 3.5, riskContribution: 0.63 },
    { asset: "TSLA", weight: 17, var95: 4.2, riskContribution: 0.71 },
  ];
};

export default function RealTimeRiskMonitoring() {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState("1H");
  const [riskData, setRiskData] = useState<RiskMetric[]>(generateRiskData());
  const [portfolioRisk, setPortfolioRisk] = useState<PortfolioRisk[]>(generatePortfolioRiskData());
  const [selectedMetric, setSelectedMetric] = useState("var95");

  // Simula aggiornamento in tempo reale
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskData((prevData) => {
        const newData = [...prevData];
        newData.shift();
        newData.push({
          timestamp: new Date(),
          var95: 2.5 + Math.random() * 2,
          var99: 3.2 + Math.random() * 2.5,
          cvar95: 4.1 + Math.random() * 3,
          liquidityRisk: 15 + Math.random() * 20,
          counterpartyRisk: 8 + Math.random() * 12,
          concentrationRisk: 25 + Math.random() * 30,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentRisk = riskData[riskData.length - 1];
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-500" /> {t("Real-Time Risk Monitoring")}
          </h1>
          <p className="text-muted-foreground">
            {t("Advanced risk metrics including VaR, CVaR, liquidity and counterparty risk")}
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Risk Monitoring Settings")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Timeframe")}</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5M">5 Minutes</SelectItem>
                  <SelectItem value="15M">15 Minutes</SelectItem>
                  <SelectItem value="1H">1 Hour</SelectItem>
                  <SelectItem value="4H">4 Hours</SelectItem>
                  <SelectItem value="1D">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Metric")}</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="var95">VaR 95%</SelectItem>
                  <SelectItem value="var99">VaR 99%</SelectItem>
                  <SelectItem value="cvar95">CVaR 95%</SelectItem>
                  <SelectItem value="liquidity">Liquidity Risk</SelectItem>
                  <SelectItem value="counterparty">Counterparty Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label>&nbsp;</label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Zap className="h-4 w-4 mr-2" /> Refresh Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Risk Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VaR 95%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{currentRisk.var95.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">95% confidence level</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VaR 99%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{currentRisk.var95.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">99% confidence level</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CVaR 95%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{currentRisk.cvar95.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Expected shortfall</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Liquidity Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{currentRisk.liquidityRisk.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Market liquidity</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Counterparty Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{currentRisk.counterpartyRisk.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Counterparty exposure</p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Trends Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t("Risk Metrics Trend")}
            </CardTitle>
            <CardDescription>{t("Historical risk metrics over time")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="var95" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="VaR 95%" />
                <Area type="monotone" dataKey="cvar95" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="CVaR 95%" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk by Asset & Risk Concentration */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Risk Contribution by Asset */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> {t("Risk Contribution by Asset")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={portfolioRisk}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="asset" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="riskContribution" fill="#ef4444" name="Risk Contribution %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Portfolio Composition */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5" /> {t("Portfolio Composition")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChartComponent>
                  <Pie
                    data={portfolioRisk}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ asset, weight }) => `${asset} ${weight}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="weight"
                  >
                    {portfolioRisk.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChartComponent>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts */}
        <Card className="border-border border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> {t("Risk Alerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentRisk.var95 > 4 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">
                ⚠️ High VaR 95% detected: {currentRisk.var95.toFixed(2)}%
              </div>
            )}
            {currentRisk.liquidityRisk > 30 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-500">
                ⚠️ Liquidity risk elevated: {currentRisk.liquidityRisk.toFixed(1)}%
              </div>
            )}
            {currentRisk.counterpartyRisk > 15 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-500">
                ⚠️ Counterparty risk warning: {currentRisk.counterpartyRisk.toFixed(1)}%
              </div>
            )}
            {currentRisk.var95 <= 4 && currentRisk.liquidityRisk <= 30 && currentRisk.counterpartyRisk <= 15 && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-500">
                ✓ All risk metrics within acceptable levels
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
