import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  Users, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';

export const DashboardGuideContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Cos'è la Dashboard
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          La Dashboard è il centro di controllo principale di Alladin Trader AI. Offre una panoramica 
          completa del tuo portfolio, delle performance e delle metriche di rischio in tempo reale. 
          È il punto di partenza ideale per analizzare lo stato del tuo trading.
        </p>
      </div>

      {/* Elementi Principali */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Elementi Principali della Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metriche Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-green-500 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Portfolio Metrics
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Balance:</strong> Saldo account corrente</li>
                <li>• <strong>Equity:</strong> Valore totale posizioni aperte</li>
                <li>• <strong>P&L:</strong> Profitti/perdite totali</li>
                <li>• <strong>Free Margin:</strong> Margine disponibile</li>
              </ul>
            </div>
            
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold text-blue-500 mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Risk Metrics
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Drawdown:</strong> Perdita massima dal picco</li>
                <li>• <strong>Sharpe Ratio:</strong> Rapporto rischio/rendimento</li>
                <li>• <strong>Win Rate:</strong> Percentuale operazioni vincenti</li>
                <li>• <strong>Value at Risk:</strong> Stima perdita potenziale</li>
              </ul>
            </div>
          </div>

          {/* Grafici Performance */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Grafici delle Performance
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded border">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Grafico Equity</p>
                  <p className="text-sm text-muted-foreground">Andamento del valore totale del portfolio nel tempo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded border">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Grafico P&L</p>
                  <p className="text-sm text-muted-foreground">Profitti e perdite cumulative per periodo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded border">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Distribuzione Asset</p>
                  <p className="text-sm text-muted-foreground">Composizione del portfolio per tipo di asset</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Come Usare la Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Come Utilizzare la Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Controllo Quotidiano</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Inizia ogni sessione di trading consultando le metriche principali: 
                  Balance, Equity e P&L giornaliero per avere un quadro immediato.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Monitoraggio del Rischio</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Controlla regolarmente il Drawdown e il VaR (Value at Risk) per 
                  assicurarti che il rischio rimanga entro i tuoi limiti predefiniti.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Analisi Performance</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Utilizza i grafici per identificare trend, pattern e opportunità di 
                  miglioramento nelle tue strategie di trading.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicatori di Stato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Indicatori di Stato del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-500">Connesso</h4>
              <p className="text-xs text-muted-foreground mt-1">XTB WebSocket attivo</p>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-500">Algoritmo</h4>
              <p className="text-xs text-muted-foreground mt-1">Trading AI attivo</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold text-yellow-500">Market Hours</h4>
              <p className="text-xs text-muted-foreground mt-1">Mercati aperti/chiusi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips e Best Practices */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>💡 Suggerimento Pro:</strong> Personalizza la Dashboard utilizzando le Impostazioni 
          per mostrare solo le metriche più rilevanti per il tuo stile di trading. 
          Puoi anche impostare allarmi per valori critici come Drawdown massimo o Free Margin minimo.
        </AlertDescription>
      </Alert>

      {/* Navigazione Rapida */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">🚀 Prossimi Passi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ora che conosci la Dashboard, esplora le sezioni correlate:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Analisi di Rischio
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → Dati di Mercato
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              → CBOT Trading
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGuideContent;