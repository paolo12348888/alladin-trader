import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Gem,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Calculator,
  Building,
  Banknote,
  Globe,
  BarChart3,
  PieChart,
  Layers,
  DollarSign,
  Percent,
  Activity,
  Zap,
  Users,
  Home,
  Droplet,
  Wheat,
  Coins,
  Mountain,
  Wind,
  RefreshCw,
  LineChart,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen,
  Lightbulb,
  ArrowRight,
  ArrowUpDown,
  Clock,
  Brain,
  Scatter3D,
  Radar
} from 'lucide-react';

export default function AlternativeInvestmentsGuideContent() {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <Alert className="border-purple-500/20 bg-purple-500/5">
        <Gem className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Il dashboard Alternative Investments simula le capacità di analisi hedge fund istituzionali in stile Bridgewater e Citadel,
          con copertura completa di Private Equity, REITs, Commodities e Hedge Fund Strategies.
        </AlertDescription>
      </Alert>

      {/* Panoramica Generale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cosa sono gli Alternative Investments?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Gli Alternative Investments rappresentano una categoria di asset non tradizionali che offrono diversificazione
            e opportunità di rendimento al di fuori dei mercati azionari e obbligazionari convenzionali. Il sistema
            simulata le capacità analitiche dei più sofisticati hedge fund istituzionali.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Asset Classes Coperte</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Private Equity (Buyout, Growth Equity, Venture Capital)</li>
                <li>• Real Estate Investment Trusts (REITs)</li>
                <li>• Commodities (Gold, Silver, Oil, Agricultural)</li>
                <li>• Hedge Fund Strategies (Long/Short, Market Neutral, Event Driven, Global Macro)</li>
                <li>• Alternative Data Sources (Satellite, Social, Sentiment)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Metodologie Analitiche</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Quantitative Risk Modeling</li>
                <li>• Monte Carlo Simulations</li>
                <li>• Factor-Based Analysis</li>
                <li>• Cross-Asset Correlation Analysis</li>
                <li>• Machine Learning Alpha Generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database e Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Database e Architecture Istituzionale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema include un database completo con dati realistici di alternative investments, 
            incluse metriche di performance, rischio e correlation analysis tipiche delle grandi istituzioni.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">Private Equity</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• 15+ PE Funds (Buyout, VC)</div>
                <div>• IRR: 15-25% range</div>
                <div>• MOIC: 2.5-4.0x</div>
                <div>• J-Curve Analysis</div>
                <div>• DPI, RVPI, TVPI metrics</div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">REITs Portfolio</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• 20+ Public REITs</div>
                <div>• Dividend Yield: 3-8%</div>
                <div>• Occupancy: 85-95%</div>
                <div>• FFO multiples analysis</div>
                <div>• Sector diversification</div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">Commodities</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• Gold: $1,800-2,200/oz</div>
                <div>• Silver: $20-30/oz</div>
                <div>• Oil: $60-90/barrel</div>
                <div>• Agricultural basket</div>
                <div>• Term structure analysis</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 1: PE Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Tab 1: PE Analysis - Analisi Private Equity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            La sezione PE Analysis fornisce un'analisi approfondita dei fondi di Private Equity con focus su
            performance, vintage year analysis e J-curve characteristics.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Metriche Chiave</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">IRR (Internal Rate of Return)</span>
                    <Badge className="bg-green-100 text-green-800">20.5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tasso di rendimento annualizzato che rende NPV=0</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">MOIC (Multiple on Invested Capital)</span>
                    <Badge className="bg-blue-100 text-blue-800">3.2x</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Moltiplicatore del capitale investito</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vintage Year</span>
                    <Badge className="bg-purple-100 text-purple-800">2018-2023</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Anno del primo investimento del fondo</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Visualizzazioni</h4>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">📊 IRR Distribution</h5>
                  <p className="text-xs text-muted-foreground mt-1">Bar chart con distribuzione IRR per vintage year</p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">📈 J-Curve Analysis</h5>
                  <p className="text-xs text-muted-foreground mt-1">Line chart che mostra il pattern tipico di performance</p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">🎯 Fund Comparison</h5>
                  <p className="text-xs text-muted-foreground mt-1">Scatter plot IRR vs MOIC per confronto diretto</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 2: REIT Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-green-600" />
            Tab 2: REIT Portfolio - Portafoglio Immobiliare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Analisi completa dei Real Estate Investment Trusts con focus su dividend yield, occupancy rates
            e performance fundamentals.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">Industrial REITs</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Warehouse, logistics e data center properties con crescente domanda e-commerce.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Avg Yield</p>
                  <p className="font-medium">4.2%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Occupancy</p>
                  <p className="font-medium">92%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">Residential REITs</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Multi-family e single-family rental properties con trend demografici favorevoli.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Avg Yield</p>
                  <p className="font-medium">3.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Occupancy</p>
                  <p className="font-medium">88%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">Healthcare REITs</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Senior housing e medical office buildings con crescita demografica strutturale.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Avg Yield</p>
                  <p className="font-medium">5.1%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Occupancy</p>
                  <p className="font-medium">85%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Visualizzazioni</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h5 className="font-medium text-sm">📊 REIT Performance vs S&P 500</h5>
                <p className="text-xs text-muted-foreground mt-1">Line chart comparativo 5-year performance</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🏢 Sector Allocation</h5>
                <p className="text-xs text-muted-foreground mt-1">Pie chart con breakdown settoriale del portfolio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 3: Commodities Trading */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-orange-600" />
            Tab 3: Commodities Trading - Trading Materie Prime
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Analisi comprehensive del mercato commodities con focus su trends, term structure e correlation
            con asset tradizionali.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <h4 className="font-semibold text-sm">Gold</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Spot Price</p>
                  <p className="font-medium">$2,047/oz</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">YTD Return</p>
                  <p className="font-medium text-green-600">+12.3%</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Safe Haven</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="h-4 w-4 text-gray-400" />
                <h4 className="font-semibold text-sm">Silver</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Spot Price</p>
                  <p className="font-medium">$24.85/oz</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">YTD Return</p>
                  <p className="font-medium text-green-600">+8.7%</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800 text-xs">Industrial Metal</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="h-4 w-4 text-black" />
                <h4 className="font-semibold text-sm">Crude Oil</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">WTI Price</p>
                  <p className="font-medium">$78.45/barrel</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">YTD Return</p>
                  <p className="font-medium text-red-600">-2.1%</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 text-xs">Energy</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wheat className="h-4 w-4 text-green-500" />
                <h4 className="font-semibold text-sm">Agricultural</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Basket Index</p>
                  <p className="font-medium">142.8</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">YTD Return</p>
                  <p className="font-medium text-green-600">+5.4%</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">Soft Commodities</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Analisi Term Structure</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🥇 Gold Forward Curve</h5>
                <p className="text-xs text-muted-foreground mt-1">Contango/backwardation patterns</p>
              </div>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <h5 className="font-medium text-sm">⛽ Oil Seasonality</h5>
                <p className="text-xs text-muted-foreground mt-1">Pattern stagionali e domanda</p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🌾 Weather Impact</h5>
                <p className="text-xs text-muted-foreground mt-1">Climate correlation analysis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 4: Hedge Fund Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Tab 4: Hedge Fund Strategies - Strategie Hedge Fund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Analisi approfondita delle principali strategie hedge fund con focus su risk-adjusted returns,
            correlation patterns e market conditions performance.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Strategie Principali</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">Long/Short Equity</h5>
                    <Badge className="bg-blue-100 text-blue-800">+18.5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Combina posizioni long su undervalued e short su overvalued stocks
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p className="font-medium">1.45</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="font-medium">-12.3%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-medium">67%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">Market Neutral</h5>
                    <Badge className="bg-green-100 text-green-800">+8.2%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hedge beta exposure mantenendo alpha generation abilità
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p className="font-medium">2.12</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="font-medium">-4.8%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Beta</p>
                      <p className="font-medium">0.15</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">Event Driven</h5>
                    <Badge className="bg-purple-100 text-purple-800">+15.7%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Opportunità da M&A, bankruptcy, restructuring events
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p className="font-medium">1.78</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="font-medium">-8.9%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deals/yr</p>
                      <p className="font-medium">24</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">Global Macro</h5>
                    <Badge className="bg-orange-100 text-orange-800">+12.4%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Top-down approach su valute, tassi, commodities, equity indices
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p className="font-medium">1.23</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="font-medium">-15.7%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Markets</p>
                      <p className="font-medium">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Performance Analysis</h4>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">📊 Strategy Comparison</h5>
                  <p className="text-xs text-muted-foreground mt-1">Radar chart risk-adjusted performance metrics</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">📈 Correlation Matrix</h5>
                  <p className="text-xs text-muted-foreground mt-1">Heatmap correlazioni strategie e market factors</p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <h5 className="font-medium text-sm">🎯 Factor Exposure</h5>
                  <p className="text-xs text-muted-foreground mt-1">Analisi exposures a market factors e style</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 5: Alternative Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Tab 5: Alternative Data - Dati Alternativi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Analisi e utilizzo di fonti dati alternative per generare alpha edge, incluse satellite imagery,
            social sentiment e supply chain analytics.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold text-sm">Satellite Data</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Oil Storage</p>
                  <p className="font-medium">+3.2% tank utilization</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Crop Yields</p>
                  <p className="font-medium">Corn +5.7% forecast</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Retail Traffic</p>
                  <p className="font-medium">-2.1% YoY trend</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">Real-time</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-green-500" />
                <h4 className="font-semibold text-sm">Social Sentiment</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Twitter Volume</p>
                  <p className="font-medium">1.2M mentions/day</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Sentiment Score</p>
                  <p className="font-medium">67.3 (Bullish)</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Influencer Impact</p>
                  <p className="font-medium">23.4% correlation</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">NLP Processing</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-purple-500" />
                <h4 className="font-semibold text-sm">Supply Chain</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Port Congestion</p>
                  <p className="font-medium">LA/Long Beach 12 days</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Shipping Costs</p>
                  <p className="font-medium">+18% index increase</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Raw Materials</p>
                  <p className="font-medium">Lead time +3 weeks</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-xs">Tracking</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Alpha Generation Metrics</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <h5 className="font-medium text-sm">📡 Signal Processing</h5>
                <p className="text-xs text-muted-foreground mt-1">Real-time signal generation da multiple data sources</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🤖 ML Models</h5>
                <p className="text-xs text-muted-foreground mt-1">Neural networks per pattern recognition</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 6: Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Tab 6: Performance Analytics - Analytics di Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Dashboard completo per l'analisi delle performance con focus su risk-adjusted returns,
            attribution analysis e benchmark comparison.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Portfolio Return</h4>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">YTD</p>
                  <p className="font-bold text-green-600">+14.7%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">1 Year</p>
                  <p className="font-bold text-green-600">+22.3%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">3 Years (Ann.)</p>
                  <p className="font-bold text-green-600">+18.9%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Since Inception</p>
                  <p className="font-bold text-green-600">+31.2%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Risk Metrics</h4>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Volatility (Ann.)</p>
                  <p className="font-bold">11.8%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-bold text-green-600">1.24</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Sortino Ratio</p>
                  <p className="font-bold text-green-600">1.87</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-bold text-red-600">-8.3%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Benchmark</h4>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">vs. 60/40 Portfolio</p>
                  <p className="font-bold text-green-600">+4.2%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">vs. Hedge Fund Index</p>
                  <p className="font-bold text-green-600">+2.8%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">vs. S&P 500</p>
                  <p className="font-bold text-red-600">-3.1%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">vs. Bloomberg Cmdty</p>
                  <p className="font-bold text-green-600">+7.5%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Attribution</h4>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="text-muted-foreground">Asset Allocation</p>
                  <p className="font-bold text-green-600">+2.3%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Security Selection</p>
                  <p className="font-bold text-green-600">+3.7%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Interaction</p>
                  <p className="font-bold text-blue-600">+0.4%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Total Alpha</p>
                  <p className="font-bold text-green-600">+6.4%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Visualizzazioni Avanzate</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                <h5 className="font-medium text-sm">📊 Rolling Performance</h5>
                <p className="text-xs text-muted-foreground mt-1">12-month rolling returns vs benchmarks</p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🎯 Attribution Breakdown</h5>
                <p className="text-xs text-muted-foreground mt-1">Bar chart con performance attribution</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h5 className="font-medium text-sm">📈 Efficient Frontier</h5>
                <p className="text-xs text-muted-foreground mt-1">Risk-return optimization analysis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 7: Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Tab 7: Risk Assessment - Valutazione del Rischio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Comprehensive risk analysis framework con VaR calculations, stress testing e correlation
            analysis per alternative investments.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Value at Risk (VaR)</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1-Day VaR (95%)</span>
                    <Badge className="bg-red-100 text-red-800">$1.2M</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Parametric method (variance-covariance)</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1-Day VaR (99%)</span>
                    <Badge className="bg-red-100 text-red-800">$1.8M</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Historical simulation method</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expected Shortfall</span>
                    <Badge className="bg-orange-100 text-orange-800">$2.1M</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Conditional VaR (CVaR)</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Stress Testing</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2008 Crisis</span>
                    <span className="text-red-600 font-bold">-28.4%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Historical replay analysis</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">COVID-19 Crash</span>
                    <span className="text-red-600 font-bold">-18.7%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Q1 2020 market scenario</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Shock (+200bps)</span>
                    <span className="text-red-600 font-bold">-12.3%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Interest rate sensitivity</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Risk Decomposition</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🎯 Factor Risk</h5>
                <p className="text-xs text-muted-foreground mt-1">Market, size, value, momentum exposures</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h5 className="font-medium text-sm">🌍 Geographic Risk</h5>
                <p className="text-xs text-muted-foreground mt-1">Regional concentration analysis</p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h5 className="font-medium text-sm">📊 Liquidity Risk</h5>
                <p className="text-xs text-muted-foreground mt-1">Time to liquidate portfolio analysis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metodologie e Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Metodologie e Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Metodologie Quant</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Monte Carlo simulations per portfolio optimization</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Machine learning per pattern recognition e alpha generation</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Cross-asset correlation analysis per risk management</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Dynamic hedging strategies per downside protection</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Risk Management</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Multi-dimensional VaR calculations con stress testing</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Liquidity analysis e time-to-liquidate modeling</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Factor risk attribution e concentration monitoring</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Dynamic rebalancing con transaction cost optimization</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusione */}
      <Alert className="border-purple-500/20 bg-purple-500/5">
        <BookOpen className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Il dashboard Alternative Investments fornisce strumenti professionali per l'analisi di asset non tradizionali,
          simulando le capacità dei più sofisticati hedge fund istituzionali. Utilizza queste analisi per costruire
          portfolios diversificati e ottimizzare il risk-return profile attraverso asset classes alternative.
        </AlertDescription>
      </Alert>
    </div>
  );
}
