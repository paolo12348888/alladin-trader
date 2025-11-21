import { useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Zap, TrendingDown, BarChart3, CheckCircle2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface StressScenario {
  id: string;
  name: string;
  description: string;
  marketShock: number;
  volatilityIncrease: number;
  correlationChange: number;
  portfolioImpact: number;
  status: "pending" | "running" | "completed";
  results?: {
    maxLoss: number;
    var95Impact: number;
    recoveryTime: number;
  };
}

interface ScenarioResult {
  scenario: string;
  portfolioValue: number;
  maxDrawdown: number;
  recoveryTime: number;
  impactPercentage: number;
}

// Predefined stress scenarios
const PREDEFINED_SCENARIOS: StressScenario[] = [
  {
    id: "2008",
    name: "Financial Crisis 2008",
    description: "Market crash similar to the 2008 financial crisis",
    marketShock: -35,
    volatilityIncrease: 300,
    correlationChange: 0.8,
    portfolioImpact: 0,
    status: "pending",
  },
  {
    id: "covid",
    name: "COVID-19 Crash 2020",
    description: "Rapid market decline followed by recovery",
    marketShock: -25,
    volatilityIncrease: 200,
    correlationChange: 0.7,
    portfolioImpact: 0,
    status: "pending",
  },
  {
    id: "flash",
    name: "Flash Crash",
    description: "Sudden market drop with rapid recovery",
    marketShock: -15,
    volatilityIncrease: 150,
    correlationChange: 0.5,
    portfolioImpact: 0,
    status: "pending",
  },
  {
    id: "rates",
    name: "Interest Rate Shock",
    description: "Sudden increase in interest rates",
    marketShock: -20,
    volatilityIncrease: 100,
    correlationChange: 0.6,
    portfolioImpact: 0,
    status: "pending",
  },
  {
    id: "geopolitical",
    name: "Geopolitical Crisis",
    description: "Major geopolitical event impact",
    marketShock: -18,
    volatilityIncrease: 120,
    correlationChange: 0.65,
    portfolioImpact: 0,
    status: "pending",
  },
  {
    id: "algo_crash",
    name: "Algorithmic Crash Test",
    description: "Combines Scenario Replay, Walk-Forward, Monte Carlo, Reverse Stress, and Crowding tests.",
    marketShock: -45, // Impatto più severo per uno scenario combinato
    volatilityIncrease: 400,
    correlationChange: 0.9,
    portfolioImpact: 0,
    status: "pending",
  },
];

export default function StressTestScenarios() {
  const { t } = useTranslation();
  const [scenarios, setScenarios] = useState<StressScenario[]>(PREDEFINED_SCENARIOS);
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [customMarketShock, setCustomMarketShock] = useState("-20");
  const [customVolatility, setCustomVolatility] = useState("150");
  const [results, setResults] = useState<ScenarioResult[]>([]);

  // Run stress test for a scenario
  const handleRunScenario = (scenarioId: string) => {
    setRunningScenario(scenarioId);
    toast.info(`Running stress test: ${scenarios.find((s) => s.id === scenarioId)?.name}...`);

    setTimeout(() => {
      setScenarios((prevScenarios) =>
        prevScenarios.map((scenario) => {
          if (scenario.id === scenarioId) {
            const maxLoss = Math.abs(scenario.marketShock) * (1 + scenario.volatilityIncrease / 100);
            const result: ScenarioResult = {
              scenario: scenario.name,
              portfolioValue: 100 + scenario.marketShock,
              maxDrawdown: maxLoss,
              recoveryTime: Math.floor(Math.random() * 30) + 10,
              impactPercentage: scenario.marketShock,
            };

            setResults((prevResults) => [...prevResults, result]);

            return {
              ...scenario,
              status: "completed",
              portfolioImpact: scenario.marketShock,
              results: {
                maxLoss,
                var95Impact: scenario.marketShock * 1.5,
                recoveryTime: result.recoveryTime,
              },
            };
          }
          return scenario;
        })
      );
      setRunningScenario(null);
      toast.success("Stress test completed!");
    }, 2000);
  };

  // Run custom scenario
  const handleRunCustomScenario = () => {
    if (!customMarketShock || !customVolatility) {
      toast.error("Please fill in all fields");
      return;
    }

    const customScenario: StressScenario = {
      id: `custom_${Date.now()}`,
      name: "Custom Scenario",
      description: `Market shock: ${customMarketShock}%, Volatility: ${customVolatility}%`,
      marketShock: parseFloat(customMarketShock),
      volatilityIncrease: parseFloat(customVolatility),
      correlationChange: 0.5,
      portfolioImpact: 0,
      status: "pending",
    };

    setScenarios([...scenarios, customScenario]);
    handleRunScenario(customScenario.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-500" /> {t("Stress Test & Scenario Analysis")}
          </h1>
          <p className="text-muted-foreground">
            {t("Simulate extreme market conditions and analyze portfolio impact")}
          </p>
        </div>

        {/* Custom Scenario Builder */}
        <Card className="border-border border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" /> {t("Custom Scenario Builder")}
            </CardTitle>
            <CardDescription>{t("Create and run custom stress scenarios")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="market-shock">{t("Market Shock (%)")}</Label>
              <Input
                id="market-shock"
                type="number"
                value={customMarketShock}
                onChange={(e) => setCustomMarketShock(e.target.value)}
                placeholder="-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volatility">{t("Volatility Increase (%)")}</Label>
              <Input
                id="volatility"
                type="number"
                value={customVolatility}
                onChange={(e) => setCustomVolatility(e.target.value)}
                placeholder="150"
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleRunCustomScenario}
                disabled={runningScenario !== null}
              >
                {runningScenario ? "Running..." : "Run Custom Scenario"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Predefined Scenarios */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Predefined Stress Scenarios")}</CardTitle>
            <CardDescription>{t("Run historical or common market crisis scenarios")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scenarios.slice(0, 5).map((scenario) => (
                <div key={scenario.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Market Shock:</span>{" "}
                      <span className="font-semibold text-red-500">{scenario.marketShock}%</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Volatility:</span>{" "}
                      <span className="font-semibold text-orange-500">+{scenario.volatilityIncrease}%</span>
                    </p>
                  </div>

                  {scenario.status === "completed" && scenario.results && (
                    <div className="space-y-1 text-sm bg-green-500/10 p-2 rounded-lg border border-green-500/30">
                      <p className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="h-4 w-4" /> Max Loss: {scenario.results.maxLoss.toFixed(2)}%
                      </p>
                      <p className="text-green-600">Recovery: {scenario.results.recoveryTime} days</p>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={scenario.status === "completed" ? "outline" : "default"}
                    onClick={() => handleRunScenario(scenario.id)}
                    disabled={runningScenario !== null}
                  >
                    {runningScenario === scenario.id
                      ? "Running..."
                      : scenario.status === "completed"
                        ? "Re-run Test"
                        : "Run Test"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Comparison */}
        {results.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> {t("Stress Test Results")}
              </CardTitle>
              <CardDescription>{t("Comparison of portfolio impact across scenarios")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="maxDrawdown" fill="#ef4444" name="Max Drawdown %" />
                  <Bar dataKey="impactPercentage" fill="#f59e0b" name="Impact %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Detailed Results")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold">Scenario</th>
                      <th className="text-right py-2 px-3 font-semibold">Portfolio Value</th>
                      <th className="text-right py-2 px-3 font-semibold">Max Drawdown</th>
                      <th className="text-right py-2 px-3 font-semibold">Recovery Time (Days)</th>
                      <th className="text-right py-2 px-3 font-semibold">Impact %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-3">{result.scenario}</td>
                        <td className="text-right py-3 px-3 font-semibold">${result.portfolioValue.toFixed(2)}</td>
                        <td className="text-right py-3 px-3 text-red-500 font-semibold">
                          {result.maxDrawdown.toFixed(2)}%
                        </td>
                        <td className="text-right py-3 px-3">{result.recoveryTime}</td>
                        <td className="text-right py-3 px-3 text-orange-500 font-semibold">
                          {result.impactPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="border-border border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Risk Mitigation Recommendations")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Based on stress test results, consider the following risk mitigation strategies:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Diversify across uncorrelated asset classes to reduce concentration risk</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Implement dynamic hedging strategies during high volatility periods</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Maintain adequate liquidity reserves for margin calls and redemptions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Use options strategies to protect against tail risks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
