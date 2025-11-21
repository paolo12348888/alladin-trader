import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PieChart,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Calculator,
  ArrowUpDown,
  DollarSign,
  Percent,
  Activity,
  Layers,
  Zap,
  Users,
  Building,
  Globe,
  BarChart3,
  Sparkles,
  Timer,
  RefreshCw,
  LineChart,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Layers3,
  TrendingDown as Down,
  TrendingUp as Up
} from 'lucide-react';

export default function ETFOptimizationGuideContent() {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <Alert className="border-blue-500/20 bg-blue-500/5">
        <PieChart className="h-4 w-4" />
        <AlertDescription className="text-sm">
          L'ETF Optimization Dashboard simula le capacità istituzionali di BlackRock iShares e Vanguard per 
          l'ottimizzazione di ETF e fund indexing con strategie avanzate di portfolio management.
        </AlertDescription>
      </Alert>

      {/* Panoramica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cos'è l'ETF Optimization?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            L'ETF Optimization è un approccio sistematico per costruire e ottimizzare portafogli di ETF 
            utilizzando tecniche avanzate di asset allocation, factor investing, e strategie di gestione del rischio 
            tipiche delle gestioni istituzionali di BlackRock e Vanguard.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Obiettivi Principali</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Ottimizzazione del risk-return profile</li>
                <li>• Minimizzazione dei costi (expense ratios)</li>
                <li>• Massimizzazione dell'efficienza fiscale</li>
                <li>• Diversificazione globale ottimale</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Tecniche Utilizzate</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Modern Portfolio Theory (MPT)</li>
                <li>• Factor Investing (5-factor model)</li>
                <li>• Smart Beta Strategies</li>
                <li>• Tax Loss Harvesting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture e Database */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Database ETF e Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema include un database completo di 25+ ETF realistici con dati di mercato aggiornati, 
            expense ratios, performance storiche, e metriche di rischio dettagliate.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">US Equity ETFs</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• SPY (S&P 500) - 0.0945%</div>
                <div>• QQQ (NASDAQ 100) - 0.20%</div>
                <div>• VTI (Total Market) - 0.03%</div>
                <div>• IWM (Russell 2000) - 0.19%</div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">Factor ETFs</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• VTV (Value) - 0.04%</div>
                <div>• VUG (Growth) - 0.04%</div>
                <div>• QUAL (Quality) - 0.15%</div>
                <div>• USMV (Low Vol) - 0.15%</div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm">Fixed Income</h4>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div>• BND (Total Bond) - 0.035%</div>
                <div>• LQD (Investment Grade) - 0.14%</div>
                <div>• HYG (High Yield) - 0.49%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Investing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Factor Investing - Il 5-Factor Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema implementa un modello a 5 fattori per l'analisi delle esposizioni degli ETF, 
            basato sulla ricerca accademica di Fama-French e successivi sviluppi.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">Value Factor</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Identifica aziende sottovalutate rispetto ai fondamentali (P/B, P/E, dividend yield).
              </p>
              <Badge className="bg-green-100 text-green-800">HML (High Minus Low)</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">Growth Factor</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Cattura aziende con crescita elevata degli utili e forte momentum dei ricavi.
              </p>
              <Badge className="bg-blue-100 text-blue-800">Growth Premium</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-orange-600 mb-2">Momentum Factor</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Sfrutta il momentum dei prezzi basato sulla performance a 12 mesi.
              </p>
              <Badge className="bg-orange-100 text-orange-800">12-1 Month</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">Quality Factor</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Focus su aziende con alta ROE, basso debito e profittabilità consistente.
              </p>
              <Badge className="bg-purple-100 text-purple-800">ROE & Debt</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-cyan-600 mb-2">Low Volatility</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Minimizza la volatilità con caratteristiche difensive e stabilità dei ricavi.
              </p>
              <Badge className="bg-cyan-100 text-cyan-800">Min Variance</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-600 mb-2">Size Factor</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Differenzia tra large-cap e small-cap per l'effetto dimensionale.
              </p>
              <Badge className="bg-gray-100 text-gray-800">SMB (Small Minus Big)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Beta Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Beta Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Le strategie Smart Beta combinano i benefici dell'indicizzazione passiva con l'ottimizzazione attiva, 
            utilizzando regole sistematiche per migliorare il risk-return profile.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Fundamental Weighting</h4>
                <Badge variant="outline">Value Focus</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ponderazione basata su metriche fondamentali (book value, sales, cash flow, dividendi) 
                invece della capitalizzazione di mercato.
              </p>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Volatilità</p>
                  <p className="font-medium">16.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">0.94</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-medium">-18.2%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking Error</p>
                  <p className="font-medium">3.4%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Risk Parity</h4>
                <Badge variant="outline">Diversification Focus</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Equal risk contribution attraverso volatilità, correlazione e asset allocation.
              </p>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Volatilità</p>
                  <p className="font-medium">12.3%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">0.87</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-medium">-12.4%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking Error</p>
                  <p className="font-medium">2.8%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Minimum Variance</h4>
                <Badge variant="outline">Low Vol Focus</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ottimizzazione del portafoglio per minimizzare la volatilità totale del portfolio.
              </p>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Volatilità</p>
                  <p className="font-medium">11.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">0.92</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-medium">-11.7%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking Error</p>
                  <p className="font-medium">2.1%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Maximum Sharpe</h4>
                <Badge variant="outline">Risk-Adjusted Focus</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ottimizzazione per massimizzare il rapporto di Sharpe con analisi dell'efficient frontier.
              </p>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Volatilità</p>
                  <p className="font-medium">14.7%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">1.08</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-medium">-16.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking Error</p>
                  <p className="font-medium">4.2%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Portfolio Theory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Modern Portfolio Theory (MPT)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            L'MPT è il fondamento teorico per l'ottimizzazione dei portafogli, sviluppato da Harry Markowitz. 
            Il sistema implementa l'algoritmo di ottimizzazione per generare l'efficient frontier.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Concetti Chiave</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Efficient Frontier</p>
                    <p className="text-xs text-muted-foreground">Insieme dei portafogli ottimali che offrono il massimo rendimento per un dato livello di rischio</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Risk-Return Optimization</p>
                    <p className="text-xs text-muted-foreground">Massimizzazione del rendimento atteso per un determinato livello di rischio</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Correlation Analysis</p>
                    <p className="text-xs text-muted-foreground">Studio delle correlazioni tra asset per ottimizzare la diversificazione</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Implementazione Tecnica</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded text-xs">
                  <strong>Matrice di Varianza-Covarianza:</strong> Calcolo delle correlazioni storiche e volatilità per ogni ETF
                </div>
                <div className="p-2 bg-muted rounded text-xs">
                  <strong>Algoritmo di Ottimizzazione:</strong> Quadratic programming per trovare il punto ottimale sulla frontiera efficiente
                </div>
                <div className="p-2 bg-muted rounded text-xs">
                  <strong>Constraint Management:</strong> Rispetto dei vincoli di peso minimo/massimo e turnover
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Loss Harvesting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Tax Loss Harvesting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            La strategia di Tax Loss Harvesting identifica opportunità per realizzare perdite fiscalmente vantaggiose 
            mantenendo l'esposizione al mercato attraverso ETF sostituti simili.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Meccanismo</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">1. Identificazione Perdite</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scansione automatica di posizioni con perdite non realizzate superiori a soglie predefinite
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">2. Wash Sale Rule</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Controllo dei 30 giorni prima/dopo per evitare violazioni della wash sale rule
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">3. Sostituzione</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Suggerimento di ETF simili con caratteristiche equivalenti ma ticker diversi
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Vantaggi Fiscali</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                  <span className="text-sm">Riduzione Imposte sul Reddito</span>
                  <span className="font-bold text-green-600">$2,000-5,000</span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                  <span className="text-sm">Carry Forward Perdite</span>
                  <span className="font-bold text-blue-600">Illimitato</span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-950 rounded">
                  <span className="text-sm">Timing Optimization</span>
                  <span className="font-bold text-purple-600">24 mesi</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Index Replication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Index Replication e Tracking Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            L'analisi della replicazione degli indici valuta quanto accuratamente un ETF segua il proprio indice di riferimento, 
            misurando il tracking error e identificando le fonti di deriva.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Tracking Error</h4>
              <p className="text-2xl font-bold text-blue-600">&lt; 0.10%</p>
              <p className="text-xs text-muted-foreground mt-1">Eccellente precisione</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Correlation</h4>
              <p className="text-2xl font-bold text-green-600">&gt; 99.5%</p>
              <p className="text-xs text-muted-foreground mt-1">Perfetto tracking</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Holdings Match</h4>
              <p className="text-2xl font-bold text-purple-600">&gt; 98%</p>
              <p className="text-xs text-muted-foreground mt-1">Alta corrispondenza</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Rebalancing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Automated Rebalancing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema di rebalancing automatico mantiene l'asset allocation del portafoglio in linea con gli obiettivi 
            strategici, ottimizzando timing e costi di transazione.
          </p>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Rebalancing Rules</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Threshold: ±5% deviazione target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Frequenza: Review trimestrale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Ottimizzazione fiscale: Prioritizzata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Minimizzazione costi transazione</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Expected Benefits</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Risk Reduction</p>
                    <p className="font-bold text-blue-600">15-20% volatilità più bassa</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Return Enhancement</p>
                    <p className="font-bold text-green-600">+2-3% annualized</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Tax Efficiency</p>
                    <p className="font-bold text-purple-600">$2,000-5,000 savings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Best Practices per ETF Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Portfolio Construction</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Diversifica attraverso asset classes, geografie, e fattori</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Mantieni un core di low-cost broad market ETFs</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Considera smart beta per enhancement specifici</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Evita over-concentration in settori o geografie</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Risk Management</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Monitora tracking error regolarmente</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Considera expense ratios nell'ottimizzazione</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Ribilancia solo quando necessario per minimizzare costi</p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                  <p>Mantieni liquidità per opportunità tattiche</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusione */}
      <Alert className="border-blue-500/20 bg-blue-500/5">
        <BookOpen className="h-4 w-4" />
        <AlertDescription className="text-sm">
          L'ETF Optimization Dashboard fornisce strumenti professionali per la costruzione di portafogli ETF ottimizzati, 
          combinando teoria finanziaria avanzata con implementazioni pratiche tipiche delle grandi istituzioni finanziarie. 
          Utilizza queste informazioni per prendere decisioni di investimento informate e ottimizzare il tuo risk-return profile.
        </AlertDescription>
      </Alert>
    </div>
  );
}