import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
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
  GitBranch,
  Volume2,
  Timer,
  Eye,
  ArrowUpDown,
  PieChart,
  Calculator,
  Globe,
  Workflow
} from 'lucide-react';

export const HedgeFundAlgoGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Hedge Fund Algo Trading - Sistema Algoritmico Professionale
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          La sezione Hedge Fund Algo Trading implementa sistemi algoritmici professionali utilizzati 
          dai grandi hedge fund e fondi istituzionali. Combina Alpha Algos per generazione segnali 
          con Execution Algos per gestione ordini, fornendo un trading automatizzato di livello istituzionale.
        </p>
      </div>

      {/* Architettura del Sistema */}
      <Card className="border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-500">
            <Workflow className="h-5 w-5" />
            Architettura Sistema Algoritmico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema implementa la stessa architettura dei hedge fund: Alpha Algos per decisioni 
            di trading e Execution Algos per ottimizzazione delle esecuzioni ordini.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-500 text-sm text-center">Alpha Algos</h4>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Generazione segnali intelligenti
              </p>
            </div>
            
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-500 text-sm text-center">Execution Algos</h4>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Ottimizzazione esecuzioni
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout dell'Interfaccia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Layout dell'Interfaccia Hedge Fund Algo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Trading in Tempo Reale */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Live Trading Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Total P&L:</span>
                  <span className="text-green-500 font-bold">€50,031.15</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Active Algorithms:</span>
                  <span className="text-blue-500">2 Running</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Portfolio VaR (95%):</span>
                  <span className="text-yellow-500">2.84%</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Win Rate:</span>
                  <span className="text-purple-500">67.3%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Metriche portfolio aggiornate in tempo reale
              </p>
            </div>

            {/* Controlli Algoritmi */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Algorithm Controls
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-background rounded border-l-2 border-green-500">
                  <strong>VWAP Strategy:</strong> ACTIVE • €15,230.50 P&L
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-green-500">
                  <strong>TWAP Strategy:</strong> ACTIVE • €12,450.25 P&L
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-yellow-500">
                  <strong>Iceberg Strategy:</strong> PAUSED • €8,920.40 P&L
                </div>
                <div className="p-2 bg-background rounded border-l-2 border-red-500">
                  <strong>Momentum Strategy:</strong> ERROR • Connection timeout
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Controlli centralizzati per tutti gli algoritmi
              </p>
            </div>
          </div>

          {/* Performance Metrics Avanzate */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Performance Analytics Professionali
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-green-500">1.85</div>
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-blue-500">-2.1%</div>
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-purple-500">2.3</div>
                <div className="text-xs text-muted-foreground">Sortino Ratio</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-orange-500">1.15</div>
                <div className="text-xs text-muted-foreground">Information Ratio</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-cyan-500">2.1</div>
                <div className="text-xs text-muted-foreground">Calmar Ratio</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Metriche avanzate tipiche dei fondi professionali
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alpha Algos - Generazione Segnali */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Alpha Algos - Generazione Segnali Intelligenti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Gli Alpha Algos sono il "cervello" del sistema, progettati per identificare 
            opportunità di profitto e generare segnali di trading automatico.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Momentum Algorithm */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Momentum Algorithm
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• RSI, MACD, Bollinger Bands</div>
                <div>• Trend detection automatico</div>
                <div>• Volume confirmation</div>
                <div>• Confidence scoring 0-100%</div>
              </div>
              <div className="mt-3 p-2 bg-green-500/10 rounded border border-green-500/20">
                <div className="text-xs text-green-500 font-semibold">Status: 70% Confidence</div>
              </div>
            </div>

            {/* Mean Reversion Algorithm */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Mean Reversion Algorithm
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Z-score statistical analysis</div>
                <div>• Support/Resistance levels</div>
                <div>• Standard deviation bands</div>
                <div>• Deviation detection &gt; 2σ</div>
              </div>
              <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="text-xs text-blue-500 font-semibold">Status: 85% Confidence</div>
              </div>
            </div>

            {/* Statistical Arbitrage */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Statistical Arbitrage
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Pair correlation analysis</div>
                <div>• Cointegration testing</div>
                <div>• Hedge ratio optimization</div>
                <div>• Spread deviation monitoring</div>
              </div>
              <div className="mt-3 p-2 bg-purple-500/10 rounded border border-purple-500/20">
                <div className="text-xs text-purple-500 font-semibold">Status: 65% Confidence</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Algos - Gestione Ordini */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Execution Algos - Gestione Ordini Professionale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Gli Execution Algos gestiscono l'esecuzione ottimale degli ordini, minimizzando 
            l'impatto sul mercato e i costi di transazione.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* VWAP Algorithm */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-orange-500 mb-3 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                VWAP Algorithm
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Volume Weighted Average Price</div>
                <div>• Distribuzione intelligente ordini</div>
                <div>• Market impact minimization</div>
                <div>• Target vs Achieved tracking</div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>VWAP Target:</span>
                  <span className="font-semibold">1.0825</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Achieved:</span>
                  <span className="text-green-500 font-semibold">1.0823</span>
                </div>
                <div className="w-full bg-background rounded-full h-1">
                  <div className="bg-green-500 h-1 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>

            {/* TWAP Algorithm */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-cyan-500 mb-3 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                TWAP Algorithm
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Time Weighted Average Price</div>
                <div>• Intervalli timing ottimizzati</div>
                <div>• Volume uniforme nel tempo</div>
                <div>• Reduced detectability</div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Schedule:</span>
                  <span className="font-semibold">Every 15 min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Progress:</span>
                  <span className="text-blue-500 font-semibold">60%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>

            {/* Iceberg Orders */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-yellow-500 mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Iceberg Orders
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Hidden order execution</div>
                <div>• Dynamic slice sizing</div>
                <div>• Market secrecy maintenance</div>
                <div>• Active slice management</div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Visible:</span>
                  <span className="font-semibold">100 units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Hidden:</span>
                  <span className="text-yellow-500 font-semibold">900 units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Slices Filled:</span>
                  <span className="text-green-500 font-semibold">3/10</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Come Utilizzare Hedge Fund Algo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Come Utilizzare Hedge Fund Algo - Guida Step-by-Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Verifica Configurazione Sistema</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Controlla che tutti gli algoritmi abbiano configurazione corretta 
                  e che la connessione XTB sia stabile prima di avviare il trading.
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500">
                    ✅ XTB Connected
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">
                    🤖 Algorithms Ready
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-500">
                    💰 Balance OK
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Configurazione Risk Management</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Imposta parametri di rischio per ogni algoritmo: stop loss, 
                  take profit, position sizing e diversification.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-background rounded border">
                    <strong>Max Risk per Trade:</strong> 2% del capitale
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Portfolio VaR Limit:</strong> 5% giornaliero
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Max Drawdown Stop:</strong> 10% del valore portfolio
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Avvio Algoritmi Selettivi</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Avvia gli algoritmi in base alle condizioni di mercato: 
                  Momentum per trending markets, Mean Reversion per range-bound, 
                  Statistical Arbitrage per correlate pairs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Monitoraggio Performance Real-Time</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitora dashboard in tempo reale, metriche di rischio, 
                  e recent trading signals. Utilizza Emergency Stop se necessario.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategie e Algoritmi Avanzati */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Strategie e Algoritmi Avanzati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il sistema implementa le stesse strategie utilizzate dai grandi hedge fund 
            e fondi istituzionali per generare alpha consistenti.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-2">📊 Alpha Generation</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Statistical arbitrage con cointegration</li>
                <li>• Momentum e trend following multi-timeframe</li>
                <li>• Mean reversion con z-score optimization</li>
                <li>• Machine learning pattern recognition</li>
              </ul>
            </div>
            
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-2">⚡ Smart Execution</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• VWAP e TWAP per reduced market impact</li>
                <li>• Iceberg orders per trading discreto</li>
                <li>• Implementation shortfall minimization</li>
                <li>• Liquidity optimization algorithms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Management Professionale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Management Professionale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
              <h4 className="font-semibold text-red-500 mb-2">Emergency Stop</h4>
              <p className="text-xs text-muted-foreground">
                Arresto immediato di tutti gli algoritmi in caso di 
                situazioni di mercato anomale o rischio eccessivo.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <DollarSign className="h-6 w-6 text-yellow-500 mb-2" />
              <h4 className="font-semibold text-yellow-500 mb-2">Position Sizing</h4>
              <p className="text-xs text-muted-foreground">
                Dimensionamento automatico posizioni basato su 
                VaR, volatilità e correlation analysis.
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-500 mb-2">Portfolio Risk</h4>
              <p className="text-xs text-muted-foreground">
                Monitoraggio continuo di drawdown, Sharpe ratio, 
                e altre metriche critiche del portfolio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices Hedge Fund */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices per Hedge Fund Algo Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-500 mb-3">✅ Raccomandazioni Professionali</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Inizia con capitale limitato per testing</li>
                <li>• Diversifica tra multiple strategie algoritmiche</li>
                <li>• Monitora performance vs benchmark di mercato</li>
                <li>• Implementa stress testing regolare</li>
                <li>• Mantieni allocation massima 5% per asset</li>
                <li>• Ribilanciamento automatico portfolio</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-500 mb-3">❌ Errori da Evitare</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Non overtrade con capitale insufficiente</li>
                <li>• Non ignorare segnali di drawdown eccessivo</li>
                <li>• Non concentrarsi su un singolo algoritmo</li>
                <li>• Non disabilitare sistemi di sicurezza</li>
                <li>• Non tradare durante news ad alto impatto</li>
                <li>• Non sottovalutare correlation risk</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Targets e Benchmark */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>🎯 Target Performance Istituzionali:</strong> Il sistema Hedge Fund Algo 
          mira a generare risk-adjusted returns superiori ai benchmark di mercato con 
          target Sharpe Ratio &gt; 1.5, Maximum Drawdown &lt; 8%, e win rate &gt; 65%.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Approfondimenti Algoritmici</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Per massimizzare l'efficacia degli algoritmi, approfondisci:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Analisi di Rischio
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Real-Time Risk Monitoring
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Smart Scaling
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → CBOT Integration
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Portfolio Optimizer
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HedgeFundAlgoGuideContent;