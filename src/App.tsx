import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RealTimeDataProvider } from "./contexts/RealTimeDataContext";
import Dashboard from "./pages/Dashboard";
import RiskAnalysis from "./pages/RiskAnalysis";
import PortfolioOptimizer from "./pages/PortfolioOptimizer";
import MarketData from "./pages/MarketData";
import AIPredictions from "./pages/AIPredictions";
import BrokerIntegration from "./pages/BrokerIntegration";
import AdvancedCharts from "./pages/AdvancedCharts";
import SmartScaling from "./pages/SmartScaling";
import HighVolatilityTrading from "./pages/HighVolatilityTrading";
import SignalRoom from "./pages/SignalRoom";
import RealTimeRiskMonitoring from "./pages/RealTimeRiskMonitoring";
import StressTestScenarios from "./pages/StressTestScenarios";
import ESGRiskAnalysis from "./pages/ESGRiskAnalysis";
import SustainableInvesting from "./pages/SustainableInvesting";
import CBOT from "./pages/CBOT";
import HedgeFundAlgo from "./pages/HedgeFundAlgo";
import SupplyChainIntelligence from "./pages/SupplyChainIntelligence";
import ValueInvesting from "./pages/ValueInvesting";
import ValueInvestingDebug from "./pages/ValueInvestingDebug";
import ValueInvestingManual from "./pages/ValueInvestingManual";
import ETFOptimization from "./pages/ETFOptimization";
import QuantitativeAlpha from "./pages/QuantitativeAlpha";
import AlternativeInvestments from "./pages/AlternativeInvestments";
import RiskManagementPro from "./pages/RiskManagementPro";
import FixedIncomeCredit from "./pages/FixedIncomeCredit";
import Settings from "./pages/Settings";
import Guide from "./pages/Guide";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path="/risk-analysis" component={RiskAnalysis} />
      <Route path="/portfolio" component={PortfolioOptimizer} />
      <Route path="/market-data" component={MarketData} />
      <Route path="/predictions" component={AIPredictions} />
      <Route path="/broker-integration" component={BrokerIntegration} />
      <Route path="/advanced-charts" component={AdvancedCharts} />
      <Route path="/smart-scaling" component={SmartScaling} />
      <Route path="/high-volatility" component={HighVolatilityTrading} />
      <Route path="/signal-room" component={SignalRoom} />
      <Route path="/risk-monitoring" component={RealTimeRiskMonitoring} />
      <Route path="/stress-test" component={StressTestScenarios} />
      <Route path="/esg-analysis" component={ESGRiskAnalysis} />
      <Route path="/sustainable-investing" component={SustainableInvesting} />
      <Route path="/cbot" component={CBOT} />
      <Route path="/hedge-fund-algo" component={HedgeFundAlgo} />
      <Route path="/supply-chain-intelligence" component={SupplyChainIntelligence} />
      <Route path="/value-investing" component={ValueInvesting} />
      <Route path="/value-investing-debug" component={ValueInvestingDebug} />
      <Route path="/value-investing-manual" component={ValueInvestingManual} />
      <Route path="/etf-optimization" component={ETFOptimization} />
      <Route path="/quantitative-alpha" component={QuantitativeAlpha} />
      <Route path="/alternative-investments" component={AlternativeInvestments} />
      <Route path="/risk-management-pro" component={RiskManagementPro} />
      <Route path="/fixed-income-credit" component={FixedIncomeCredit} />
      <Route path="/guide" component={Guide} />
      <Route path="/settings" component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <RealTimeDataProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </RealTimeDataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
