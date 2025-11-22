import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Shield, Wallet, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MarketMetrics {
  volatility: number;
  var95: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual backend integration
    setTimeout(() => {
      setMetrics({
        volatility: 32.71,
        var95: 3.21,
        sharpeRatio: 0.71,
        maxDrawdown: 33.36,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: t("Portfolio Volatility"),
      value: metrics ? `${metrics.volatility}%` : "—",
      icon: Activity,
      description: t("Annualized volatility"),
      trend: "neutral",
    },
    {
      title: t("Value at Risk (95%)"),
      value: metrics ? `${metrics.var95}%` : "—",
      icon: Shield,
      description: t("Maximum expected loss"),
      trend: "down",
    },
    {
      title: t("Sharpe Ratio"),
      value: metrics ? metrics.sharpeRatio.toFixed(2) : "—",
      icon: TrendingUp,
      description: t("Risk-adjusted return"),
      trend: "up",
    },
    {
      title: t("Max Drawdown"),
      value: metrics ? `${metrics.maxDrawdown}%` : "—",
      icon: TrendingDown,
      description: t("Peak to trough decline"),
      trend: "down",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("Dashboard")}</h1>
          <p className="text-muted-foreground">
            {t("Enterprise-grade risk management and portfolio optimization")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Risk Metrics Overview")}</CardTitle>
              <CardDescription>
                {t("Comprehensive risk analysis across multiple methodologies")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("VaR Historical")}</span>
                  <span className="font-medium text-foreground">3.21%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("VaR Parametric")}</span>
                  <span className="font-medium text-foreground">3.29%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("VaR Monte Carlo")}</span>
                  <span className="font-medium text-foreground">3.33%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">CVaR (95%)</span>
                  <span className="font-medium text-foreground">4.57%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Portfolio Performance")}</CardTitle>
              <CardDescription>
                {t("Key performance indicators and ratios")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("Sharpe Ratio")}</span>
                  <span className="font-medium text-foreground">0.71</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("Sortino Ratio")}</span>
                  <span className="font-medium text-foreground">0.96</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("Expected Return")}</span>
                  <span className="font-medium text-green-500">+18.5%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("Annual Volatility")}</span>
                  <span className="font-medium text-foreground">22.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stress Test Results */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("Stress Test Scenarios")}</CardTitle>
            <CardDescription>
              {t("Portfolio impact under extreme market conditions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: t("Market Crash 2008"), impact: "-40.00%" },
                { name: t("COVID Crash 2020"), impact: "-35.00%" },
                { name: t("Flash Crash"), impact: "-10.00%" },
                { name: t("Moderate Correction"), impact: "-15.00%" },
              ].map((scenario) => (
                <div
                  key={scenario.name}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <p className="text-xs text-muted-foreground">{scenario.name}</p>
                  <p className="text-lg font-bold text-red-500">{scenario.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
