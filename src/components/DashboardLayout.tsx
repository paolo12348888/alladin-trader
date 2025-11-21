import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Shield,
  Moon,
  Sun,
  BarChart3,
  Wallet,
  Plug,
  LineChart,
  Zap,
  AlertTriangle,
  Bell,
  Activity,
  Leaf,
  Bot,
  Settings,
  BookOpen,
  Brain,
  Globe,
  PieChart,
  Banknote,
  ShieldCheck,
  Building,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  interface NavItem {
    path: string;
    icon: React.ElementType;
    labelKey: string;
  }

  const navItems: NavItem[] = [
    { path: "/", icon: LayoutDashboard, labelKey: "Dashboard" },
    { path: "/guide", icon: BookOpen, labelKey: "Guida" },
    { path: "/risk-analysis", icon: Shield, labelKey: "Risk Analysis" },
    { path: "/portfolio", icon: Wallet, labelKey: "Portfolio Optimizer" },
    { path: "/market-data", icon: BarChart3, labelKey: "Market Data" },
    { path: "/predictions", icon: TrendingUp, labelKey: "AI Predictions" },
    { path: "/advanced-charts", icon: LineChart, labelKey: "Advanced Charts" },
    { path: "/smart-scaling", icon: Zap, labelKey: "Smart Scaling" },
    { path: "/high-volatility", icon: AlertTriangle, labelKey: "High Volatility" },
    { path: "/signal-room", icon: Bell, labelKey: "Signal Room" },
    { path: "/risk-monitoring", icon: Activity, labelKey: "Risk Monitoring" },
    { path: "/stress-test", icon: AlertTriangle, labelKey: "Stress Test" },
    { path: "/esg-analysis", icon: Leaf, labelKey: "ESG Analysis" },
    { path: "/sustainable-investing", icon: Leaf, labelKey: "Sustainable Investing" },
    { path: "/broker-integration", icon: Plug, labelKey: "Broker Integration" },
    { path: "/cbot", icon: Bot, labelKey: "CBOT" },
    { path: "/hedge-fund-algo", icon: Brain, labelKey: "Hedge Fund Algo" },
    { path: "/supply-chain-intelligence", icon: Globe, labelKey: "Supply Chain Intelligence" },
    { path: "/value-investing", icon: TrendingDown, labelKey: "Value Investing" },
    { path: "/etf-optimization", icon: PieChart, labelKey: "ETF Optimization" },
    { path: "/quantitative-alpha", icon: Brain, labelKey: "Quantitative Alpha" },
    { path: "/alternative-investments", icon: Building, labelKey: "Alternative Investments" },
    { path: "/risk-management-pro", icon: ShieldCheck, labelKey: "Risk Management Pro" },
    { path: "/fixed-income-credit", icon: Banknote, labelKey: "Fixed Income Credit" },
    { path: "/settings", icon: Settings, labelKey: "Impostazioni" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-80 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Alladin Trader AI</h1>
              <p className="text-xs text-muted-foreground">Enhanced Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Theme Toggle & Language Selector */}
          <div className="border-t border-border p-4 space-y-3">
            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Language")}</span>
              <LanguageSelector />
            </div>
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  {t("Light Mode")}
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  {t("Dark Mode")}
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 min-h-screen">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
