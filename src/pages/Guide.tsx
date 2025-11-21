import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Book, 
  LayoutDashboard, 
  Shield, 
  BarChart3, 
  LineChart, 
  Zap, 
  AlertTriangle,
  Bell,
  Leaf,
  Bot,
  Settings,
  ChevronRight,
  Home,
  ArrowUp,
  Menu,
  ChevronDown,
  Brain,
  Globe,
  TrendingDown,
  PieChart,
  Banknote,
  ShieldCheck,
  Gem,
  Calculator,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import dei contenuti dettagliati
import DashboardGuideContent from '@/components/guide/DashboardGuideContent';
import RiskAnalysisGuideContent from '@/components/guide/RiskAnalysisGuideContent';
import MarketDataGuideContent from '@/components/guide/MarketDataGuideContent';
import CBOTGuideContent from '@/components/guide/CBOTGuideContent';
import HedgeFundAlgoGuideContent from '@/components/guide/HedgeFundAlgoGuideContent';
import SupplyChainIntelligenceGuideContent from '@/components/guide/SupplyChainIntelligenceGuideContent';
import ValueInvestingGuideContent from '@/components/guide/ValueInvestingGuideContent';
import ETFOptimizationGuideContent from '@/components/guide/ETFOptimizationGuideContent';
import QuantitativeAlphaGuideContent from '@/components/guide/QuantitativeAlphaGuideContent';
import AlternativeInvestmentsGuideContent from '@/components/guide/AlternativeInvestmentsGuideContent';

// Sezioni della guida
const guideSections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Panoramica generale della piattaforma di trading',
    difficulty: 'Principiante',
    estimatedTime: '5 min'
  },
  {
    id: 'risk-analysis',
    title: 'Analisi di Rischio',
    icon: Shield,
    description: 'Calcolo del rischio e metriche di sicurezza',
    difficulty: 'Intermedio',
    estimatedTime: '8 min'
  },
  {
    id: 'risk-management-pro',
    title: 'Risk Management Pro',
    icon: ShieldCheck,
    description: 'Piattaforma istituzionale di risk management stile Goldman Sachs con VaR, Stress Testing e Correlation Analysis',
    difficulty: 'Esperto',
    estimatedTime: '30 min'
  },
  {
    id: 'market-data',
    title: 'Dati di Mercato',
    icon: BarChart3,
    description: 'Ricerca asset e prezzi in tempo reale',
    difficulty: 'Principiante',
    estimatedTime: '6 min'
  },
  {
    id: 'advanced-charts',
    title: 'Grafici Avanzati',
    icon: LineChart,
    description: 'Visualizzazione avanzata dei dati di mercato',
    difficulty: 'Intermedio',
    estimatedTime: '10 min'
  },
  {
    id: 'smart-scaling',
    title: 'Smart Scaling',
    icon: Zap,
    description: 'Gestione intelligente delle posizioni',
    difficulty: 'Avanzato',
    estimatedTime: '12 min'
  },
  {
    id: 'high-volatility',
    title: 'High Volatility Trading',
    icon: AlertTriangle,
    description: 'Strategie per mercati ad alta volatilità',
    difficulty: 'Avanzato',
    estimatedTime: '15 min'
  },
  {
    id: 'signal-room',
    title: 'Signal Room',
    icon: Bell,
    description: 'Segnali di trading e notifiche',
    difficulty: 'Intermedio',
    estimatedTime: '7 min'
  },
  {
    id: 'esg-analysis',
    title: 'ESG Analysis',
    icon: Leaf,
    description: 'Analisi di sostenibilità degli investimenti',
    difficulty: 'Intermedio',
    estimatedTime: '9 min'
  },
  {
    id: 'sustainable-investing',
    title: 'Sustainable Investing',
    icon: Leaf,
    description: 'Dashboard ESG istituzionale in stile Norwegian Government Pension Fund',
    difficulty: 'Intermedio',
    estimatedTime: '12 min'
  },
  {
    id: 'cbot',
    title: 'CBOT - Chat Trading',
    icon: Bot,
    description: 'Interfaccia chat per trading automatico',
    difficulty: 'Avanzato',
    estimatedTime: '18 min'
  },
  {
    id: 'hedge-fund-algo',
    title: 'Hedge Fund Algo Trading',
    icon: Brain,
    description: 'Sistemi algoritmici professionali per trading istituzionale',
    difficulty: 'Avanzato',
    estimatedTime: '25 min'
  },
  {
    id: 'supply-chain-intelligence',
    title: 'Supply Chain Intelligence',
    icon: Globe,
    description: 'Algoritmo innovativo per previsioni commodities tramite dati supply chain',
    difficulty: 'Avanzato',
    estimatedTime: '20 min'
  },
  {
    id: 'value-investing',
    title: 'Value Investing',
    icon: TrendingDown,
    description: 'Analisi fondamentale Benjamin Graham e Warren Buffett per identificare opportunità value',
    difficulty: 'Intermedio',
    estimatedTime: '15 min'
  },
  {
    id: 'etf-optimization',
    title: 'ETF Optimization',
    icon: PieChart,
    description: 'Ottimizzazione ETF istituzionale in stile BlackRock e Vanguard con factor investing e smart beta',
    difficulty: 'Avanzato',
    estimatedTime: '20 min'
  },
  {
    id: 'quantitative-alpha',
    title: 'Quantitative Alpha',
    icon: Brain,
    description: 'Modelli di alpha generation quantitativi stile Two Sigma/Renaissance Technologies con ML e dati alternativi',
    difficulty: 'Esperto',
    estimatedTime: '25 min'
  },
  {
    id: 'fixed-income-credit',
    title: 'Fixed Income & Credit',
    icon: Banknote,
    description: 'Analisi istituzionale bond, credit spreads e gestione duration in stile PIMCO/BlackRock',
    difficulty: 'Avanzato',
    estimatedTime: '22 min'
  },
  {
    id: 'alternative-investments',
    title: 'Alternative Investments',
    icon: Gem,
    description: 'Analisi istituzionale hedge fund stile Bridgewater/Citadel con PE, REITs, Commodities e Hedge Fund Strategies',
    difficulty: 'Esperto',
    estimatedTime: '25 min'
  },
  {
    id: 'settings',
    title: 'Impostazioni',
    icon: Settings,
    description: 'Configurazione della piattaforma',
    difficulty: 'Principiante',
    estimatedTime: '4 min'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Principiante':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'Intermedio':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Avanzato':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export default function Guide() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Gestione scroll per mostrare pulsante "torna su"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setNavOpen(false); // Chiudi il menu dopo la selezione
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Funzione per renderizzare il contenuto dettagliato di ogni sezione
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'dashboard':
        return <DashboardGuideContent />;
      case 'risk-analysis':
        return <RiskAnalysisGuideContent />;
      case 'risk-management-pro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">🛡️ Risk Management Pro - Piattaforma Istituzionale</h2>
              <p className="text-muted-foreground mb-6">
                La sezione Risk Management Pro offre strumenti avanzati di risk management in stile Goldman Sachs,
                con calcoli sophisticated per VaR, Stress Testing, Correlation Analysis e Portfolio Risk Attribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Value at Risk (VaR) Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calcolo VaR utilizzando multiple metodologie:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• VaR Storico - Basato su 252 giorni di dati</li>
                    <li>• VaR Parametrico - Metodo Variance-Covariance</li>
                    <li>• VaR Monte Carlo - 10,000 simulazioni</li>
                    <li>• Expected Shortfall (CVaR) - Conditional VaR</li>
                    <li>• Component VaR - Breakdown per asset</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚡ Stress Testing Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Scenari di stress basati su eventi storici:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• 2008 Financial Crisis - Equity crash scenario</li>
                    <li>• COVID-19 Market Crash - Pandemic volatility</li>
                    <li>• Flash Crash - Extreme intraday volatility</li>
                    <li>• Geopolitical Crisis - Global market impact</li>
                    <li>• Interest Rate Shock - Rapid rate increases</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔗 Correlation Matrix Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Matrice di correlazione avanzata:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Correlation heatmap interattiva</li>
                    <li>• Eigenvalue analysis per concentrazione rischio</li>
                    <li>• Diversification ratio calculation</li>
                    <li>• Concentration risk metrics</li>
                    <li>• Rolling correlation analysis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Risk Attribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Breakdown del rischio per fattori e settori:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Factor contributions (Market, Size, Value, Momentum)</li>
                    <li>• Sector attribution breakdown</li>
                    <li>• Asset class risk decomposition</li>
                    <li>• Risk-adjusted performance attribution</li>
                    <li>• Brinson-Hood-Beebower model</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>💧 Liquidity Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Analisi completa del rischio di liquidità:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Bid-Ask spread analysis per asset</li>
                    <li>• Daily volume vs market cap ratios</li>
                    <li>• Time to liquidate portfolio estimation</li>
                    <li>• Liquidity score calculation</li>
                    <li>• Stress liquidity scenarios</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏦 Counterparty Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gestione rischio controparte:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Current exposure analysis per controparte</li>
                    <li>• Potential future exposure (PFE)</li>
                    <li>• Credit ratings e probability of default</li>
                    <li>• Expected loss calculation</li>
                    <li>• Concentration risk assessment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota Importante:</strong> Tutti i calcoli sono basati su dati simulati per scopi dimostrativi. 
                Per implementazioni reali, integrare con dati di mercato real-time e utilizzare infrastrutture di calcolo distribuito per gestire portfolios di grandi dimensioni.
              </AlertDescription>
            </Alert>
          </div>
        );
      case 'market-data':
        return <MarketDataGuideContent />;
      case 'cbot':
        return <CBOTGuideContent />;
      case 'hedge-fund-algo':
        return <HedgeFundAlgoGuideContent />;
      case 'supply-chain-intelligence':
        return <SupplyChainIntelligenceGuideContent />;
      case 'value-investing':
        return <ValueInvestingGuideContent />;
      case 'etf-optimization':
        return <ETFOptimizationGuideContent />;
      case 'quantitative-alpha':
        return <QuantitativeAlphaGuideContent />;
      case 'fixed-income-credit':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">💰 Fixed Income & Credit - Analisi Istituzionale</h2>
              <p className="text-muted-foreground mb-6">
                La sezione Fixed Income & Credit offre un'analisi professionale dei mercati obbligazionari in stile PIMCO/BlackRock,
                con strumenti avanzati per la gestione duration, credit spreads e ottimizzazione portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🏛️ Government Bonds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Analisi UST Treasury bonds con scadenze da 2Y a 30Y:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Yield curve analysis e steepness metrics</li>
                    <li>• Duration management e convexity</li>
                    <li>• Stress testing e scenario analysis</li>
                    <li>• Forward rates e breakeven inflation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏢 Corporate Bonds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Investment Grade e High Yield bonds:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Credit analysis per settore e rating</li>
                    <li>• Spread analysis e volatilità</li>
                    <li>• Performance attribution breakdown</li>
                    <li>• Sector allocation e concentration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏛️ Municipal Bonds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tax-exempt state e local bonds:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Tax-equivalent yield calculations</li>
                    <li>• State e issuer analysis</li>
                    <li>• Credit quality assessment</li>
                    <li>• Interest rate risk management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Structured Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    CDO tranches e Asset-Backed Securities:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Tranche analysis e waterfall structure</li>
                    <li>• Recovery rates e default probabilities</li>
                    <li>• Prepayment e extension risk</li>
                    <li>• Subordination e credit enhancement</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>⚙️ Strumenti Avanzati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Calculator className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Duration Calculator</h4>
                    <p className="text-xs text-muted-foreground">
                      Calcola durata effettiva, modified duration e sensibilità ai tassi
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Spread Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Monitora credit spreads e identifica opportunità
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Portfolio Optimization</h4>
                    <p className="text-xs text-muted-foreground">
                      Ottimizza allocation basata su risk-return
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'sustainable-investing':
        return <AlternativeInvestmentsGuideContent />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">🌱 Sustainable Investing - Dashboard ESG Istituzionale</h2>
              <p className="text-muted-foreground mb-6">
                La sezione Sustainable Investing offre un'analisi ESG completa in stile Norwegian Government Pension Fund, 
                la versione più avanzata dell'analisi sostenibilità nella piattaforma Alladin Trader.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Caratteristiche Principali</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>ESG Scoring Avanzato:</strong> Environmental, Social, Governance con metriche dettagliate</li>
                    <li>• <strong>Climate Risk Assessment:</strong> Analisi del rischio climatico con temperature alignment</li>
                    <li>• <strong>Social Impact Metrics:</strong> Misurazione dell'impatto sociale</li>
                    <li>• <strong>Governance Analysis:</strong> Analisi approfondita della governance aziendale</li>
                    <li>• <strong>Green Bonds Portfolio:</strong> Selezione di green bonds certificati</li>
                    <li>• <strong>UN SDG Alignment:</strong> Allineamento con gli Obiettivi di Sviluppo Sostenibile</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Tabs del Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>ESG Overview:</strong> Panoramica generale con radar chart e scoring</li>
                    <li>• <strong>Portfolio Sustainability:</strong> Analisi della sostenibilità del portfolio</li>
                    <li>• <strong>Climate Risk:</strong> Valutazione rischi climatici e carbon footprint</li>
                    <li>• <strong>Social Impact:</strong> Metriche di impatto sociale</li>
                    <li>• <strong>Governance:</strong> Analisi governance con confronti benchmark</li>
                    <li>• <strong>Green Bonds:</strong> Catalogo green bonds con impatto climatico</li>
                    <li>• <strong>Sustainability Metrics:</strong> Metriche UN SDG e tendenze storiche</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-300">🎯 Come Utilizzare il Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="font-medium mb-2">1. Analisi ESG Overview</p>
                  <p className="text-muted-foreground">
                    Inizia con la panoramica generale per vedere lo score ESG complessivo (E, S, G) e l'andamento nel tempo. 
                    Il radar chart mostra il profilo tridimensionale della sostenibilità.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">2. Portfolio Sustainability</p>
                  <p className="text-muted-foreground">
                    Analizza la percentuale di asset sostenibili, l'intensità carbonio e i revenue verdi. 
                    Il pie chart mostra l'allocazione per settori ESG-friendly.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">3. Climate Risk Assessment</p>
                  <p className="text-muted-foreground">
                    Valuta i rischi di transizione e fisico, il carbon footprint e l'allineamento agli obiettivi climatici di Parigi (1.5°C, 2°C).
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">4. Green Bonds Selection</p>
                  <p className="text-muted-foreground">
                    Esplora il catalogo di green bonds certificati con rendimenti competitivi e impatto climatico misurabile.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Suggerimenti per l'Utilizzo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">🎯 Investment Strategy</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Usa i trend ESG per identificare settori in crescita</li>
                      <li>• Monitora l'evoluzione del climate risk nel tempo</li>
                      <li>• Considera l'allineamento con gli SDG per impatto sociale</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">📈 Performance Analysis</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Confronta gli score ESG con la performance finanziaria</li>
                      <li>• Analizza l'impatto del carbon footprint sui rendimenti</li>
                      <li>• Valuta l'allineamento temperature goals</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌍 Standard Internazionali</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground mb-3">
                  Il dashboard segue gli standard ESG più rigorosi utilizzati dal Norwegian Government Pension Fund:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">TCFD Guidelines</p>
                    <p className="text-xs text-muted-foreground">Task Force on Climate-related Financial Disclosures</p>
                  </div>
                  <div>
                    <p className="font-medium">SASB Standards</p>
                    <p className="text-xs text-muted-foreground">Sustainability Accounting Standards Board</p>
                  </div>
                  <div>
                    <p className="font-medium">GRI Framework</p>
                    <p className="text-xs text-muted-foreground">Global Reporting Initiative</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              📚 Contenuto dettagliato in preparazione per la sezione <strong>{sectionId}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Questa sezione includerà:
            </p>
            <ul className="text-sm text-muted-foreground">
              <li>• Introduzione e panoramica</li>
              <li>• Istruzioni passo-passo</li>
              <li>• Screenshot e esempi pratici</li>
              <li>• Suggerimenti e best practices</li>
              <li>• Risoluzione problemi comuni</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Principale */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-3 w-3" />
            <span>{t('User Guide')}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Book className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {t('Complete Guide Alladin Trader AI')}
              </h1>
              <p className="text-muted-foreground">
                {t('Guide Description')}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Navigazione Collapsible */}
        <Card className="border-primary/20 bg-primary/5">
          <Collapsible open={navOpen} onOpenChange={setNavOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Menu className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{t('Section Index')}</CardTitle>
                      <CardDescription>
                        {guideSections.length} {t('sections')} • {t('total minutes')}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-primary transition-transform ${navOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {guideSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`text-left p-4 rounded-lg transition-all duration-200 border ${
                          isActive
                            ? 'bg-primary/10 border-primary/20 shadow-md'
                            : 'hover:bg-accent border-border hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{t(section.title)}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(t(section.difficulty))}`}>
                                {t(section.difficulty)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{section.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-500">
                <LayoutDashboard className="h-5 w-5" />
                {t('Beginner')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('Basic sections to get started')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-500">
                <Shield className="h-5 w-5" />
                {t('Intermediate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('Advanced sections for risk analysis')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                <Bot className="h-5 w-5" />
                {t('Advanced')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('Professional sections for trading')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sezioni della Guida */}
        <div className="space-y-12">
          {guideSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-accent/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{section.title}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getDifficultyColor(section.difficulty)}>
                          {section.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {section.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {renderSectionContent(section.id)}
                    </div>
                  </CardContent>
                </Card>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 p-8 rounded-lg bg-accent/30 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">🎯 {t('You completed the guide!')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('Congratulations! You now know')}
            Ricorda che puoi sempre tornare a consultare questa guida quando ne hai bisogno.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={scrollToTop}>
              <Home className="h-4 w-4 mr-2" />
              {t('Return to home')}
            </Button>
          </div>
        </div>
      </div>

      {/* Pulsante Scroll to Top */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </DashboardLayout>
  );
}
