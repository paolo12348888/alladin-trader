import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown,
  Shield,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Zap,
  Activity,
  Satellite,
  Ship,
  Factory,
  Mountain,
  Anchor,
  Truck,
  MapPin,
  PieChart,
  LineChart,
  ArrowUpDown,
  Gauge,
  Brain,
  Cpu,
  Database,
  Eye,
  Webhook,
  Lightbulb,
  Briefcase,
  Timer,
  Layers,
  Network,
  Cloud
} from 'lucide-react';

export const SupplyChainIntelligenceGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Supply Chain Intelligence - Algoritmo Innovativo per Previsioni Commodities
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Il sistema Supply Chain Intelligence utilizza un algoritmo avanzato per l'analisi e previsione 
          dei prezzi delle commodities basato sui dati della supply chain in tempo reale. Combina 
          monitoraggio satellitare, analytics di shipping, sentiment analysis e fattori geopolitici 
          per generare segnali di trading ad alta precisione per metalli preziosi, energia e materie prime agricole.
        </p>
      </div>

      {/* Algoritmo Supply Chain Disruption */}
      <Card className="border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-500">
            <Brain className="h-5 w-5" />
            Supply Chain Disruption & Commodity Price Prediction Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            L'algoritmo implementa una metodologia multi-strato che analizza disruption della supply chain 
            per predire movimenti dei prezzi delle commodities con precisione superiore ai metodi tradizionali.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Database className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-500 text-sm text-center">Data Collection Layer</h4>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Satellite imagery, shipping data, news sentiment
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Cpu className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-500 text-sm text-center">ML Processing</h4>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Pattern recognition, disruption detection, prediction modeling
              </p>
            </div>
            
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-500 text-sm text-center">Signal Generation</h4>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Alpha signals, risk assessment, confidence scoring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Dashboard Supply Chain Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Layout Dashboard Supply Chain Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overview Metrics */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-emerald-500 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                KPI Overview System
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Supply Chain Points:</span>
                  <span className="text-blue-500 font-bold">247 Monitored</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Active Disruptions:</span>
                  <span className="text-red-500">12 Critical</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Alpha Signals (24h):</span>
                  <span className="text-green-500">8 Generated</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Avg Confidence:</span>
                  <span className="text-purple-500">78.5%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Metriche chiave del sistema aggiornate in tempo reale
              </p>
            </div>

            {/* Supply Chain Network Status */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Supply Chain Network Status
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-background rounded border-l-2 border-green-500">
                  <strong>Ports Operational:</strong> 89% • High Efficiency
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-yellow-500">
                  <strong>Mining Activities:</strong> 76% • Moderate Risk
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-orange-500">
                  <strong>Shipping Routes:</strong> 82% • Some Delays
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-red-500">
                  <strong>Industrial Plants:</strong> 65% • Supply Constraints
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Monitoraggio stato della rete supply chain globale
              </p>
            </div>
          </div>

          {/* Commodity Predictions Real-Time */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Commodity Predictions Algorithm
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-background rounded">
                <div className="text-sm font-bold text-yellow-500">$2,045</div>
                <div className="text-xs text-muted-foreground">Gold (XAUUSD)</div>
                <div className="text-xs text-green-500">↗ +1.2% 24h</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-sm font-bold text-gray-400">$25.85</div>
                <div className="text-xs text-muted-foreground">Silver (XAGUSD)</div>
                <div className="text-xs text-red-500">↘ -0.8% 24h</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-sm font-bold text-orange-500">$78.45</div>
                <div className="text-xs text-muted-foreground">Crude Oil</div>
                <div className="text-xs text-green-500">↗ +2.1% 24h</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-sm font-bold text-green-600">$6.85</div>
                <div className="text-xs text-muted-foreground">Wheat</div>
                <div className="text-xs text-red-500">↘ -1.5% 24h</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Predizioni algoritmiche basate su supply chain analysis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Moduli Core del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Moduli Core del Sistema Supply Chain Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Il sistema è organizzato in moduli specializzati che raccolgono e analizzano 
            dati alternativi per generare insights unici sui mercati delle commodities.
          </p>

          {/* Satellite Monitoring */}
          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <Satellite className="h-5 w-5" />
              Satellite Monitoring System
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-orange-500" />
                  Mining Activity Detection
                </h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Infrared satellite imagery</li>
                  <li>• Machinery movement tracking</li>
                  <li>• Production capacity estimation</li>
                  <li>• Site accessibility assessment</li>
                </ul>
              </div>
              
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Anchor className="h-4 w-4 text-blue-500" />
                  Port Activity Monitoring
                </h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ship traffic density</li>
                  <li>• Loading/unloading operations</li>
                  <li>• Storage levels assessment</li>
                  <li>• Traffic congestion analysis</li>
                </ul>
              </div>
              
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Factory className="h-4 w-4 text-green-500" />
                  Industrial Production
                </h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Facility activity levels</li>
                  <li>• Energy consumption patterns</li>
                  <li>• Waste heat detection</li>
                  <li>• Production capacity utilization</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping Analytics */}
          <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
            <h4 className="font-semibold text-cyan-500 mb-3 flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Shipping Analytics & Route Optimization
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border">
                  <h5 className="font-semibold text-sm mb-2">Route Monitoring</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Global shipping route tracking</div>
                    <div>• AIS data integration</div>
                    <div>• Transit time optimization</div>
                    <div>• Weather route adjustment</div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border">
                  <h5 className="font-semibold text-sm mb-2">Freight Rate Analysis</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Spot vs contract rates</div>
                    <div>• Seasonal demand patterns</div>
                    <div>• Carrier capacity utilization</div>
                    <div>• Fuel cost impact modeling</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2">Congestion Metrics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Suez Canal:</span>
                    <span className="text-red-500 font-semibold">Critical</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Port of Shanghai:</span>
                    <span className="text-yellow-500 font-semibold">Moderate</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Panama Canal:</span>
                    <span className="text-green-500 font-semibold">Normal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-cyan-500 h-1 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
            <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Sentiment Analysis & News Impact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2">News Sentiment Engine</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Geopolitical Events:</span>
                    <span className="text-red-500">Negative 0.72</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Supply Disruptions:</span>
                    <span className="text-orange-500">Bearish 0.65</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Economic Data:</span>
                    <span className="text-green-500">Positive 0.58</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-background rounded border">
                <h5 className="font-semibold text-sm mb-2">Social Media Sentiment</h5>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Twitter/X commodity discussions</div>
                  <div>• LinkedIn industry insights</div>
                  <div>• Reddit trading communities</div>
                  <div>• Professional network analysis</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alpha Signal Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Alpha Signal Generator - Engine Predittivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Il generatore di segnali alpha combina tutti i moduli per produrre segnali 
            di trading ad alta probabilità basati su disruption della supply chain.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Long Signals */}
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Long Position Signals
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border border-green-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">XAUUSD</span>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500">
                      LONG 78%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Supply constraints detected</div>
                    <div>• Mining output down 15%</div>
                    <div>• Geopolitical risk premium</div>
                    <div>• Expected return: +2.8%</div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border border-green-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">CRUDE</span>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500">
                      LONG 72%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Refinery maintenance surge</div>
                    <div>• Strategic reserve depleting</div>
                    <div>• Shipping delays increasing</div>
                    <div>• Expected return: +1.9%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Signals */}
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Short Position Signals
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border border-red-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">WHEAT</span>
                    <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-500">
                      SHORT 69%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Harvest season approaching</div>
                    <div>• Weather conditions improving</div>
                    <div>• Storage levels adequate</div>
                    <div>• Expected return: +1.5%</div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border border-red-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">XAGUSD</span>
                    <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-500">
                      SHORT 65%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Industrial demand declining</div>
                    <div>• Inventory accumulation</div>
                    <div>• ETF outflows detected</div>
                    <div>• Expected return: +1.2%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signal Confidence Metrics */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Signal Confidence & Risk Assessment
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-green-500">78%</div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-blue-500">2.3</div>
                <div className="text-xs text-muted-foreground">Risk/Reward</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-purple-500">85%</div>
                <div className="text-xs text-muted-foreground">Hit Rate</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-orange-500">1.8%</div>
                <div className="text-xs text-muted-foreground">Avg Return</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment & Correlation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment & Commodity Correlation Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-500">Risk Assessment Categories</h4>
              
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <h5 className="font-semibold text-red-500 text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Geopolitical Risk - Critical
                </h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Trade sanctions monitoring</div>
                  <div>• Regional conflict analysis</div>
                  <div>• Regulatory change tracking</div>
                  <div>• Political stability assessment</div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <h5 className="font-semibold text-yellow-500 text-sm mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Transport Risk - Elevated
                </h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Shipping route disruptions</div>
                  <div>• Port congestion levels</div>
                  <div>• Fuel cost volatility</div>
                  <div>• Infrastructure constraints</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h5 className="font-semibold text-blue-500 text-sm mb-2 flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Weather Risk - Moderate
                </h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Seasonal pattern analysis</div>
                  <div>• Extreme weather forecasting</div>
                  <div>• Climate change impact</div>
                  <div>• Agricultural yield modeling</div>
                </div>
              </div>
            </div>

            {/* Correlation Matrix Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-500">Commodity Correlation Matrix</h4>
              
              <div className="p-3 bg-background rounded border">
                <div className="text-xs space-y-2">
                  <div className="grid grid-cols-4 gap-1 font-semibold text-center">
                    <div></div>
                    <div>XAU</div>
                    <div>XAG</div>
                    <div>CRUDE</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="text-left font-semibold">XAU</div>
                    <div className="text-gray-400">1.00</div>
                    <div className="text-green-500">0.78</div>
                    <div className="text-red-500">-0.23</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="text-left font-semibold">XAG</div>
                    <div className="text-green-500">0.78</div>
                    <div className="text-gray-400">1.00</div>
                    <div className="text-yellow-500">0.12</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="text-left font-semibold">CRUDE</div>
                    <div className="text-red-500">-0.23</div>
                    <div className="text-yellow-500">0.12</div>
                    <div className="text-gray-400">1.00</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-accent/30 rounded border">
                <h5 className="font-semibold text-sm mb-2">Supply Chain Impact Analysis</h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Cross-commodity disruption effects</div>
                  <div>• Supply chain bottleneck identification</div>
                  <div>• Alternative source availability</div>
                  <div>• Substitution risk assessment</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Come Utilizzare Supply Chain Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Come Utilizzare Supply Chain Intelligence - Guida Step-by-Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Navigazione Dashboard Supply Chain</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Accedi alla sezione Supply Chain Intelligence e familiarizza con i moduli principali: 
                  Overview, Commodity Predictions, Alpha Signals, Risk Assessment e Correlation Matrix.
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                    🌍 Global Overview
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">
                    📊 Data Analytics
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-500">
                    🎯 Alpha Signals
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Interpretazione Alpha Signals</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Analizza i segnali generati considerando: confidence score, supply chain factors, 
                  expected returns e risk-reward ratio. Focalizzati sui segnali con confidence &gt; 70%.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-background rounded border">
                    <strong>High Confidence Signals (70%+):</strong> Considera allocation 3-5% del portfolio
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Medium Confidence (50-70%):</strong> Position sizing ridotto 1-2%
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Risk Monitoring:</strong> Utilizza stop loss basati su disruption scenarios
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Utilizzo Dati Alternativi</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Combina satellite imagery, shipping data e sentiment analysis per una visione 
                  completa. I dati alternativi offrono vantaggio informativo di 2-4 settimane 
                  rispetto ai dati tradizionali di mercato.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Risk Management & Portfolio Integration</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Integra i risk metrics nel portfolio management, utilizzando correlation matrix 
                  per diversification e monitorando disruption alerts per risk mitigation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices per Supply Chain Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-500 mb-3">✅ Strategie Consigliate</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Focus su segnali con confidence &gt; 70%</li>
                <li>• Diversifica tra multiple commodities</li>
                <li>• Monitora correlation matrix per hedge efficiency</li>
                <li>• Utilizza satellite data per timing entry/exit</li>
                <li>• Combina supply chain signals con technical analysis</li>
                <li>• Implementa position sizing basato su disruption severity</li>
                <li>• Mantieni tracking di geopolitical developments</li>
                <li>• Usa sentiment analysis per contrarian signals</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-500 mb-3">❌ Errori da Evitare</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Non ignorare correlation breakdown periods</li>
                <li>• Non overtrade su singolo commodity signal</li>
                <li>• Non sottovalutare transport bottlenecks</li>
                <li>• Non trascurare seasonal supply patterns</li>
                <li>• Non basarsi solo su un modulo di analisi</li>
                <li>• Non ignorare weather risk assessment</li>
                <li>• Non operare durante critical disruption alerts</li>
                <li>• Non dimenticare di aggiornare risk models</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risoluzione Problemi Comuni */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risoluzione Problemi Comuni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-500 mb-2">⚠️ Dati Satellite Non Disponibili</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Problema:</strong> Le immagini satellitari non si caricano o mostrano errori
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Soluzione:</strong> Il sistema utilizza dati simulati per demo. In produzione, 
                verifica connessione API satellite e copertura geografica del monitoraggio.
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-500 mb-2">📊 Alpha Signals Inconsistent</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Problema:</strong> I segnali cambiano frequently senza clear justification
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Soluzione:</strong> I segnali si aggiornano ogni 30 minuti. Focus su trend 
                a 24h e 7d piuttosto che variazioni intra-day per decisioni di trading.
              </p>
            </div>
            
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <h4 className="font-semibold text-red-500 mb-2">🔄 Correlation Matrix Error</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Problema:</strong> Heatmap correlazioni non mostra dati o errori di rendering
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Soluzione:</strong> Ricarica la pagina. Se il problema persiste, verifica 
                che almeno 3 commodities siano selezionate per calcolo correlazioni.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics & Target */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>🎯 Performance Target Supply Chain Intelligence:</strong> Il sistema mira a generare 
          alpha con Sharpe Ratio &gt; 1.8, hit rate &gt; 75%, e average confidence &gt; 80% attraverso 
          l'utilizzo di dati alternativi supply chain non disponibili ai competitors tradizionali.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">🌐 Integrazione Supply Chain Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Per massimizzare l'efficacia del sistema, integralo con altre funzionalità:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Portfolio Optimizer
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Real-Time Risk Monitoring
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Hedge Fund Algo
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → ESG Risk Analysis
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Market Data Integration
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Stress Test Scenarios
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainIntelligenceGuideContent;