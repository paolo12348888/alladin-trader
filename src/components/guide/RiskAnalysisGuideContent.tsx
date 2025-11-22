import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Calculator, 
  Target, 
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Search,
  Zap,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';

export const RiskAnalysisGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Analisi di Rischio Avanzata
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          L'Analisi di Rischio è il cuore della gestione professionale del trading. Questa sezione 
          ti permette di calcolare il rischio ottimale per ogni operazione, analizzare la correlazione 
          tra asset e impostare limiti di sicurezza per proteggere il tuo capitale.
        </p>
      </div>

      {/* Funzionalità Principali */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Funzionalità Principali
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ricerca Asset */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Ricerca Asset XTB
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Utilizza la barra di ricerca intelligente per trovare asset dal database XTB in tempo reale:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Forex:</strong> EUR/USD, GBP/USD, USD/JPY</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Azioni:</strong> AAPL, TSLA, GOOGL</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong>Indici:</strong> US500, US100, DE40</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span><strong>Commodities:</strong> GOLD, OIL, SILVER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calcolatore Rischio */}
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Calcolatore di Rischio
            </h4>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Il sistema calcola automaticamente la dimensione ottimale della posizione basandosi su:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Input Parametri:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Balance account corrente</li>
                    <li>• Prezzo di entrata</li>
                    <li>• Stop Loss target</li>
                    <li>• Percentuale di rischio (1-5%)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Output Calcoli:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Dimensione posizione ottimale</li>
                    <li>• Rischio monetario (€)</li>
                    <li>• Rapporto Risk/Reward</li>
                    <li>• Margine richiesto</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metriche di Rischio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Metriche di Rischio Avanzate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Value at Risk */}
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <h4 className="font-semibold text-red-500">Value at Risk (VaR)</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Stima la perdita massima potenziale in un periodo di tempo specifico 
                con un determinato livello di confidenza (95% o 99%).
              </p>
            </div>

            {/* Sharpe Ratio */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold text-blue-500">Sharpe Ratio</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Misura il rendimento aggiustato per il rischio. Valori superiori a 1.0 
                indicano performance buone, superiori a 2.0 eccellenti.
              </p>
            </div>

            {/* Maximum Drawdown */}
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <h4 className="font-semibold text-yellow-500">Max Drawdown</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                La perdita massima dal picco più alto al punto più basso. 
                Valori inferiori al 10% sono considerati eccellenti.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Come Utilizzare l'Analisi di Rischio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Procedura Step-by-Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Ricerca Asset</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Inizia digitando il simbolo o il nome dell'asset nella barra di ricerca. 
                  Il sistema mostrerà suggerimenti dal database XTB in tempo reale.
                </p>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Tip:</strong> Usa simboli standard come "EURUSD" per il Forex o "AAPL" per Apple.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Impostazione Parametri</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Inserisci i parametri fondamentali per il calcolo del rischio:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-background rounded border">
                    <strong>Prezzo Entrata:</strong> Prezzo di acquisto/vendita
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Stop Loss:</strong> Livello di uscita per limitare perdite
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>Take Profit:</strong> Obiettivo di profitto (opzionale)
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <strong>% Rischio:</strong> Percentuale del capitale da rischiare (1-5%)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Calcolo Automatico</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Il sistema calcola automaticamente la dimensione ottimale della posizione 
                  e ti mostra tutti i parametri di rischio rilevanti.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Lot Size</Badge>
                  <Badge variant="outline" className="text-xs">Rischio €</Badge>
                  <Badge variant="outline" className="text-xs">R:R Ratio</Badge>
                  <Badge variant="outline" className="text-xs">Margine</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Validazione e Esecuzione</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Prima di eseguire l'operazione, verifica che tutti i parametri siano corretti 
                  e che il rischio sia in linea con la tua strategia di money management.
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
            <CheckCircle2 className="h-5 w-5" />
            Best Practices per la Gestione del Rischio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Raccomandazioni ✅
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Non rischiare mai più del 2% del capitale per trade</li>
                <li>• Mantieni un rapporto Risk/Reward minimo di 1:2</li>
                <li>• Diversifica tra asset non correlati</li>
                <li>• Utilizza sempre Stop Loss</li>
                <li>• Controlla il Drawdown quotidianamente</li>
                <li>• Rivedi le metriche settimanalmente</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Errori da Evitare ❌
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Aumentare la posizione in perdita (averaging down)</li>
                <li>• Rimuovere lo Stop Loss durante un trade</li>
                <li>• Rischiare più del 5% in un singolo trade</li>
                <li>• Ignorare la correlazione tra asset</li>
                <li>• Tradare senza calcolare il rischio prima</li>
                <li>• Overleverage in mercati volatili</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrazione XTB */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>🔗 Integrazione XTB Attiva:</strong> Tutti i calcoli utilizzano dati di mercato 
          in tempo reale da XTB. I prezzi, gli spread e le informazioni sui contratti 
          sono aggiornati continuamente per garantire accuratezza nei calcoli di rischio.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">🎯 Approfondimenti Correlati</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ora che padroneggi l'Analisi di Rischio, esplora le sezioni avanzate:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Smart Scaling
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → High Volatility Trading
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

export default RiskAnalysisGuideContent;