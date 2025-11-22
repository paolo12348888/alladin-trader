import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  Cpu,
  Database,
  BarChart3,
  RefreshCw,
  GitBranch,
  Calculator,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Network,
  Activity,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function QuantitativeAlphaGuideContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-violet-500" />
          <div>
            <h1 className="text-3xl font-bold">Quantitative Alpha Models</h1>
            <p className="text-muted-foreground">
              Sistema di generazione alpha stile Two Sigma/Renaissance Technologies
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Livello: Avanzato</Badge>
          <Badge variant="outline">Durata: 15 min</Badge>
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            Hedge Fund Style
          </Badge>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Panoramica del Sistema Quantitativo
          </CardTitle>
          <CardDescription>
            Sistema avanzato di trading quantitativo che simula le capacità dei principali hedge fund mondiali
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema Quantitative Alpha Models rappresenta l'apice della tecnologia di trading quantitativo, 
            implementando algoritmi di machine learning e analisi di dati alternativi per identificare 
            opportunità di alpha generation.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Obiettivi Principali
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generazione di segnali di trading tramite ML</li>
                <li>• Integrazione di dati alternativi</li>
                <li>• Ottimizzazione quantitativa del portafoglio</li>
                <li>• Validazione out-of-sample</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Caratteristiche Distintive
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 4 algoritmi ML simultanei</li>
                <li>• 4 fonti di dati alternativi</li>
                <li>• Backtesting con walk-forward analysis</li>
                <li>• Ensemble model weighting dinamico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ML Algorithms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-500" />
            Algoritmi Machine Learning
          </CardTitle>
          <CardDescription>
            Quattro algoritmi ML avanzati per la generazione di segnali di trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader>
                <CardTitle className="text-lg">Random Forest</CardTitle>
                <CardDescription>Ensemble di decision trees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Trees:</span>
                    <span className="font-medium">500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Depth:</span>
                    <span className="font-medium">10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Feature Importance:</span>
                    <span className="font-medium">✓</span>
                  </div>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <p className="text-sm text-violet-700">
                    <strong>Vantaggi:</strong> Robusto contro overfitting, interpretabile, buona performance su dati non-lineari.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="text-lg">Neural Networks</CardTitle>
                <CardDescription>Deep feedforward networks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Layers:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Neurons:</span>
                    <span className="font-medium">128-64-32-16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dropout:</span>
                    <span className="font-medium">0.3</span>
                  </div>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <p className="text-sm text-cyan-700">
                    <strong>Vantaggi:</strong> Cattura pattern complessi, approssimazione universale, ottimo per dati ad alta dimensionalità.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Support Vector Machine</CardTitle>
                <CardDescription>Kernel-based classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kernel:</span>
                    <span className="font-medium">RBF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gamma:</span>
                    <span className="font-medium">Auto</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>C Parameter:</span>
                    <span className="font-medium">1.0</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Vantaggi:</strong> Efficace in spazi ad alta dimensione, memoria efficiente, versatile.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg">Ensemble Model</CardTitle>
                <CardDescription>Combined ML predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Models:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weighting:</span>
                    <span className="font-medium">Dynamic</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Voting:</span>
                    <span className="font-medium">Soft</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Vantaggi:</strong> Riduce varianza, migliora generalizzazione, performance superiore ai singoli modelli.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            Alternative Data Integration
          </CardTitle>
          <CardDescription>
            Quattro fonti di dati alternativi per insights unici sui mercati
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  Credit Card Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Metriche Principali:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Transaction volume patterns</li>
                    <li>• Geographic spending trends</li>
                    <li>• Consumer confidence indicators</li>
                    <li>• Sector rotation signals</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Utilizzo:</strong> Indicatore anticipatore per earnings e trends di consumo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Location Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Metriche Principali:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mobile location analytics</li>
                    <li>• Foot traffic patterns</li>
                    <li>• Store visit correlations</li>
                    <li>• Economic activity indicators</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Utilizzo:</strong> Monitoraggio real-time dell'attività economica e retail.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Metriche Principali:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Social media sentiment scoring</li>
                    <li>• News sentiment aggregation</li>
                    <li>• Analyst revision trends</li>
                    <li>• Options flow sentiment</li>
                  </ul>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Utilizzo:</strong> Misurazione del sentiment di mercato e momentum.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-purple-500" />
                  Satellite Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Metriche Principali:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Economic activity monitoring</li>
                    <li>• Industrial production tracking</li>
                    <li>• Retail foot traffic estimation</li>
                    <li>• Agricultural commodities</li>
                  </ul>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Utilizzo:</strong> Dati obiettivi per settori hard-to-measure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Backtesting Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            Backtesting Framework
          </CardTitle>
          <CardDescription>
            Sistema di test rigoroso per validare strategie quantitative
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Metriche di Performance</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Return Metrics</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Total Return</li>
                  <li>• Annualized Return</li>
                  <li>• Alpha vs Market</li>
                  <li>• Information Ratio</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Risk Metrics</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sharpe Ratio</li>
                  <li>• Sortino Ratio</li>
                  <li>• Maximum Drawdown</li>
                  <li>• Calmar Ratio</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Trading Metrics</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Win Rate</li>
                  <li>• Profit Factor</li>
                  <li>• Number of Trades</li>
                  <li>• Avg Holding Period</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg">
            <h5 className="font-semibold text-indigo-800 mb-2">Walk-Forward Analysis</h5>
            <p className="text-sm text-indigo-700">
              Il sistema utilizza walk-forward analysis con finestre di training di 6 mesi e testing di 3 mesi 
              per garantire che le strategie mantengano performance robuste out-of-sample e non siano affette 
              da overfitting sui dati storici.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-teal-500" />
            Quantitative Portfolio Optimization
          </CardTitle>
          <CardDescription>
            Ottimizzazione avanzata del portafoglio con ML signals integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Metodi di Ottimizzazione</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium">Risk Parity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sharpe Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Minimum Variance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">ML Signal Weighting</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Rebalancing Logic</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Trigger di Rebalancing</p>
                  <p className="text-xs text-muted-foreground">
                    Quando la deviazione dal target weight supera il 2% o quando 
                    i segnali ML cambiano direzionalmente.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Costi di Transazione</p>
                  <p className="text-xs text-muted-foreground">
                    Modello realistico con slippage dello 0.05% e commissioni 
                    variabili per ottimizzare il turnover.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-500" />
            Guida all'Utilizzo
          </CardTitle>
          <CardDescription>
            Come utilizzare efficacemente il sistema Quantitative Alpha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Workflow Consigliato</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div className="space-y-1">
                  <p className="font-medium">Analizza Overview Dashboard</p>
                  <p className="text-sm text-muted-foreground">
                    Inizia dalla panoramica per vedere la performance aggregata di tutti gli algoritmi ML
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div className="space-y-1">
                  <p className="font-medium">Esplora ML Signals</p>
                  <p className="text-sm text-muted-foreground">
                    Analizza i segnali generati da ogni algoritmo e confronta le performance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div className="space-y-1">
                  <p className="font-medium">Integra Alternative Data</p>
                  <p className="text-sm text-muted-foreground">
                    Utilizza i dati alternativi per confermare o invalidare i segnali ML
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div className="space-y-1">
                  <p className="font-medium">Valuta Backtesting</p>
                  <p className="text-sm text-muted-foreground">
                    Studia la performance storica per identificare strategie robuste
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <div className="space-y-1">
                  <p className="font-medium">Implementa Ensemble</p>
                  <p className="text-sm text-muted-foreground">
                    Combina i migliori modelli tramite ensemble per massimizzare l'alpha
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold">6</div>
                <div className="space-y-1">
                  <p className="font-medium">Ottimizza Portfolio</p>
                  <p className="text-sm text-muted-foreground">
                    Genera allocation ottimale basata sui segnali e risk budgeting
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800">Best Practices</h5>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Non basare decisioni su un singolo segnale ML</li>
                  <li>• Utilizza ensemble models per robustezza</li>
                  <li>• Monitora walk-forward performance regolarmente</li>
                  <li>• Considera alternative data come conferma, non sostituto</li>
                  <li>• Ribilancia il portafoglio solo quando necessario</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Dettagli Tecnici
          </CardTitle>
          <CardDescription>
            Specifiche tecniche per implementazione e ottimizzazione
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Parametri di Sistema</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal Refresh:</span>
                  <span className="font-medium">5 minuti</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model Retraining:</span>
                  <span className="font-medium">Settimanale</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Walk-Forward Window:</span>
                  <span className="font-medium">6M/3M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rebalancing Threshold:</span>
                  <span className="font-medium">2%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Requisiti di Sistema</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>CPU: Multi-core per parallel ML</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>RAM: 16GB+ per dataset processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Storage: SSD per low-latency access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Network: Low-latency per real-time data</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Icon components for alternative data section
const CreditCard = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Satellite = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M15.5 8.5l1 1" />
    <path d="M7.5 16.5l1-1" />
    <path d="M7.5 7.5l1-1" />
    <path d="M16.5 16.5l1-1" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);