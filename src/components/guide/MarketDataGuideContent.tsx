import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Search, 
  Wifi, 
  Globe,
  TrendingUp,
  Clock,
  RefreshCw,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';

export const MarketDataGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Dati di Mercato in Tempo Reale
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          La sezione Dati di Mercato è la tua finestra sui mercati finanziari globali. 
          Integrata completamente con XTB, ti fornisce prezzi in tempo reale, ricerca asset 
          avanzata e tutti i dati necessari per prendere decisioni di trading informate.
        </p>
      </div>

      {/* Integrazione XTB */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-500">
            <Wifi className="h-5 w-5" />
            Integrazione XTB Real-Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Alladin Trader AI è direttamente connesso ai server XTB tramite WebSocket, 
            garantendo dati di mercato aggiornati istantaneamente senza ritardi.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-500 text-sm">Connessione Attiva</h4>
              <p className="text-xs text-muted-foreground mt-1">WebSocket XTB Online</p>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <RefreshCw className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-500 text-sm">Aggiornamento</h4>
              <p className="text-xs text-muted-foreground mt-1">Tick-by-tick pricing</p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Database className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-500 text-sm">Asset Database</h4>
              <p className="text-xs text-muted-foreground mt-1">2000+ strumenti</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funzionalità di Ricerca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Sistema di Ricerca Asset Intelligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-accent/30 rounded-lg border">
            <h4 className="font-semibold mb-3">🔍 Come Funziona la Ricerca</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Il sistema di ricerca utilizza l'autocomplete intelligente per trovare rapidamente 
              gli asset dal database XTB. Supporta diverse modalità di ricerca:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Ricerca per Simbolo
                </h5>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>EURUSD</span>
                    <span className="text-green-500">✓ Forex</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>AAPL</span>
                    <span className="text-blue-500">✓ Azioni</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>US500</span>
                    <span className="text-purple-500">✓ Indice</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  Ricerca per Nome
                </h5>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>Apple</span>
                    <span className="text-blue-500">→ AAPL</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>Gold</span>
                    <span className="text-yellow-500">→ GOLD</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded">
                    <span>S&P 500</span>
                    <span className="text-purple-500">→ US500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categorie Asset */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Categorie di Asset Disponibili
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-green-500">Forex</h5>
                <p className="text-xs text-muted-foreground">50+ coppie valutarie</p>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-blue-500">Azioni</h5>
                <p className="text-xs text-muted-foreground">1500+ titoli globali</p>
              </div>
              
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-center">
                <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-purple-500">Indici</h5>
                <p className="text-xs text-muted-foreground">30+ indici mondiali</p>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-center">
                <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-yellow-500">Commodities</h5>
                <p className="text-xs text-muted-foreground">Metalli, petrolio, agricoli</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informazioni Real-Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Informazioni Real-Time Disponibili
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Dati Prezzo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Bid (Vendita)</span>
                  <span className="text-red-500 font-mono">1.0845</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Ask (Acquisto)</span>
                  <span className="text-green-500 font-mono">1.0847</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Spread</span>
                  <span className="font-mono">2 pip</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Variazione %</span>
                  <span className="text-green-500 font-mono">+0.15%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">📈 Informazioni Tecniche</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Volume 24h</span>
                  <span className="font-mono">2.4M</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>High 24h</span>
                  <span className="text-green-500 font-mono">1.0892</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Low 24h</span>
                  <span className="text-red-500 font-mono">1.0823</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/30 rounded">
                  <span>Ultimo Update</span>
                  <span className="text-blue-500 font-mono">Live</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Come Utilizzare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Come Utilizzare i Dati di Mercato
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
                <p className="text-sm text-muted-foreground mt-1">
                  Utilizza la barra di ricerca per trovare l'asset di interesse. 
                  Il sistema suggerirà automaticamente i risultati più pertinenti.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Analisi Prezzi</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Esamina i prezzi Bid/Ask, lo spread e la variazione percentuale 
                  per identificare opportunità di trading favorevoli.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Monitoraggio Continuo</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  I prezzi si aggiornano automaticamente. Utilizza le informazioni 
                  in tempo reale per timing ottimale delle tue operazioni.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggerimenti Pratici */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Suggerimenti per Trading Efficace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Spread Analysis:</strong> Controlla sempre lo spread prima di aprire 
                una posizione. Spread bassi indicano maggiore liquidità e costi ridotti.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚡ Volume Monitoring:</strong> Volumi elevati spesso precedono 
                movimenti significativi. Usa questa informazione per il timing.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-3">🎯 Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                <h5 className="text-sm font-semibold text-green-500 mb-1">Orari Migliori</h5>
                <p className="text-xs text-muted-foreground">
                  Forex: 08:00-17:00 GMT<br/>
                  US Stocks: 14:30-21:00 GMT
                </p>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <h5 className="text-sm font-semibold text-blue-500 mb-1">Spread Ottimali</h5>
                <p className="text-xs text-muted-foreground">
                  EUR/USD: 0.5-1 pip<br/>
                  GOLD: 20-30 cent<br/>
                  US500: 0.4-0.7 punti
                </p>
              </div>
              
              <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                <h5 className="text-sm font-semibold text-purple-500 mb-1">Volatilità</h5>
                <p className="text-xs text-muted-foreground">
                  Alta: GBP/USD, GOLD<br/>
                  Media: EUR/USD, US500<br/>
                  Bassa: USD/CHF, EUR/CHF
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrazione Completa */}
      <Alert>
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          <strong>🚀 Integrazione Completa XTB:</strong> Tutti i dati mostrati sono direttamente 
          collegati al tuo account XTB reale. Le informazioni di prezzo, spread e disponibilità 
          riflettono le condizioni effettive del tuo broker.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">📊 Sezioni Correlate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Dopo aver padroneggiato i Dati di Mercato, approfondisci con:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Grafici Avanzati
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Analisi di Rischio
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Signal Room
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataGuideContent;