import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Shield,
  TrendingUp,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Target,
  Wifi,
  Brain,
  Activity
} from 'lucide-react';

export const CBOTGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          CBOT - Chat Bot Trading Interface
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          CBOT è l'interfaccia di trading automatizzato più avanzata di Alladin Trader AI. 
          Consente di eseguire operazioni, monitorare posizioni e gestire il portfolio 
          tramite comandi chat intuitivi, supportato da algoritmi di intelligenza artificiale.
        </p>
      </div>

      {/* Architettura del Sistema */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-500">
            <Brain className="h-5 w-5" />
            Architettura AI Trading System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CBOT integra intelligenza artificiale, algoritmi di trading e connessione XTB 
            in un'unica interfaccia conversazionale per un'esperienza di trading rivoluzionaria.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <MessageSquare className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-500 text-sm">Chat Interface</h4>
              <p className="text-xs text-muted-foreground mt-1">Comandi naturali</p>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Brain className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-500 text-sm">AI Engine</h4>
              <p className="text-xs text-muted-foreground mt-1">Algoritmi avanzati</p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Wifi className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-500 text-sm">XTB Integration</h4>
              <p className="text-xs text-muted-foreground mt-1">Esecuzione reale</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout e Componenti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Componenti dell'Interfaccia CBOT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chat */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Area Chat Trading
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-500/10 rounded border-l-2 border-blue-500">
                  <strong>User:</strong> Compra 1000 EUR/USD a 1.0845
                </div>
                <div className="p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                  <strong>CBOT:</strong> ✅ Ordine eseguito: 1000 EUR/USD @ 1.0845
                </div>
                <div className="p-2 bg-yellow-500/10 rounded border-l-2 border-yellow-500">
                  <strong>System:</strong> Stop Loss impostato a 1.0820
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Interfaccia conversazionale per trading in linguaggio naturale
              </p>
            </div>

            {/* Status Panel */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Status Sistema in Tempo Reale
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>WebSocket:</span>
                  <span className="text-green-500">🟢 Connected</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>AI Engine:</span>
                  <span className="text-blue-500">🔵 Active</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Balance:</span>
                  <span className="text-yellow-500">€ 10,250</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span>Posizioni:</span>
                  <span className="text-purple-500">3 Aperte</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Monitoraggio continuo stato account e algoritmi
              </p>
            </div>
          </div>

          {/* Performance Riepilogo */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Riepilogo (Always Visible)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-green-500">+2.5%</div>
                <div className="text-xs text-muted-foreground">P&L Daily</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-blue-500">1.8</div>
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-yellow-500">75%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-red-500">-5.2%</div>
                <div className="text-xs text-muted-foreground">Max DD</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-lg font-bold text-purple-500">€ 150</div>
                <div className="text-xs text-muted-foreground">VaR 95%</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Metriche performance sempre visibili, non scrollano con la chat
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comandi Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Commands - Comandi Rapidi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            I Quick Commands permettono esecuzione istantanea delle operazioni più comuni 
            con un singolo click, ideali per trading veloce.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-background rounded-lg border text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <h5 className="text-sm font-semibold">BUY EUR/USD</h5>
              <p className="text-xs text-muted-foreground">Market Order</p>
            </div>
            
            <div className="p-3 bg-background rounded-lg border text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-red-500 rotate-180" />
              <h5 className="text-sm font-semibold">SELL EUR/USD</h5>
              <p className="text-xs text-muted-foreground">Market Order</p>
            </div>
            
            <div className="p-3 bg-background rounded-lg border text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <Shield className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <h5 className="text-sm font-semibold">CLOSE ALL</h5>
              <p className="text-xs text-muted-foreground">Emergency Exit</p>
            </div>
            
            <div className="p-3 bg-background rounded-lg border text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <BarChart3 className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <h5 className="text-sm font-semibold">STATUS</h5>
              <p className="text-xs text-muted-foreground">Account Info</p>
            </div>
          </div>

          <Alert className="mt-4">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>⚡ Tip:</strong> I Quick Commands utilizzano background scuro per evidenziare 
              l'azione e ridurre l'affaticamento visivo durante sessioni di trading intense.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Come Utilizzare CBOT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Come Utilizzare CBOT - Guida Step-by-Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Verifica Connessione</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Assicurati che il WebSocket XTB sia connesso (indicatore verde) 
                  e che l'algoritmo AI sia attivo prima di iniziare il trading.
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500">
                    ✅ XTB Connected
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">
                    🤖 AI Active
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Comandi Trading</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Scrivi i tuoi comandi in linguaggio naturale nella chat. 
                  Il sistema AI interpreta ed esegue automaticamente le operazioni.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-background rounded border">
                    <strong>Esempio:</strong> "Compra 500 EUR/USD con stop loss a 1.08"
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Esempio:</strong> "Chiudi tutte le posizioni Gold"
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Esempio:</strong> "Mostra performance di oggi"
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Monitoraggio Real-Time</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitora le performance attraverso il pannello sempre visibile. 
                  Tutte le metriche si aggiornano in tempo reale senza bisogno di refresh.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algoritmi AI Integrati */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Algoritmi AI e Strategie Automatiche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CBOT utilizza algoritmi di intelligenza artificiale avanzati per ottimizzare 
            le operazioni di trading e gestire automaticamente il rischio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-2">🧠 AI Decision Engine</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Analisi sentiment di mercato</li>
                <li>• Pattern recognition avanzato</li>
                <li>• Risk assessment automatico</li>
                <li>• Timing ottimizzazione entrate</li>
              </ul>
            </div>
            
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-2">⚡ Smart Execution</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Slippage minimization</li>
                <li>• Liquidity optimization</li>
                <li>• Multi-timeframe analysis</li>
                <li>• Dynamic position sizing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sicurezza e Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sicurezza e Risk Management Integrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
              <h4 className="font-semibold text-red-500 mb-2">Stop Loss Automatico</h4>
              <p className="text-xs text-muted-foreground">
                Ogni posizione viene automaticamente protetta 
                con stop loss calcolato in base al rischio.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <DollarSign className="h-6 w-6 text-yellow-500 mb-2" />
              <h4 className="font-semibold text-yellow-500 mb-2">Position Sizing</h4>
              <p className="text-xs text-muted-foreground">
                La dimensione delle posizioni è calcolata 
                automaticamente per non superare il 2% di rischio.
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Clock className="h-6 w-6 text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-500 mb-2">Real-Time Monitoring</h4>
              <p className="text-xs text-muted-foreground">
                Monitoraggio continuo di drawdown, 
                VaR e altre metriche di rischio critiche.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices per CBOT Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-500 mb-3">✅ Raccomandazioni</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Inizia con posizioni piccole per familiarizzare</li>
                <li>• Verifica sempre lo stato connessione prima di tradare</li>
                <li>• Utilizza comandi chiari e specifici</li>
                <li>• Monitora le performance in tempo reale</li>
                <li>• Sfrutta i Quick Commands per operazioni veloci</li>
                <li>• Mantieni il risk per trade sotto il 2%</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-500 mb-3">❌ Errori da Evitare</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Non ignorare gli alert di disconnessione</li>
                <li>• Non sovraccaricare il sistema con comandi multipli</li>
                <li>• Non disabilitare mai i sistemi di sicurezza</li>
                <li>• Non tradare senza controllare il balance</li>
                <li>• Non utilizzare CBOT in mercati illiquidi</li>
                <li>• Non affidarsi solo all'AI per decisioni critiche</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrazione Avanzata */}
      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          <strong>🚀 Sistema Integrato Completo:</strong> CBOT rappresenta l'evoluzione del trading 
          automatizzato. Combina la potenza dell'AI con l'affidabilità di XTB per offrire 
          un'esperienza di trading senza precedenti, mantenendo sempre il controllo e la sicurezza al centro.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">🤖 Approfondimenti Avanzati</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Dopo aver padroneggiato CBOT, esplora le sezioni di supporto:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Smart Scaling
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → High Volatility Trading
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Analisi di Rischio
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Real-Time Risk Monitoring
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CBOTGuideContent;