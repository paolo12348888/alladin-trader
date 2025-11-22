import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingDown,
  TrendingUp,
  Shield,
  Calculator,
  Target,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Percent,
  Building,
  Brain,
  Filter,
  Search,
  Eye,
  TrendingDown as Down
} from 'lucide-react';

export default function ValueInvestingGuideContent() {
  return (
    <div className="space-y-8">
      {/* Introduzione */}
      <Alert className="border-green-500/20 bg-green-500/5">
        <TrendingDown className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Il Value Investing Dashboard implementa la filosofia di Benjamin Graham e Warren Buffett per identificare 
          aziende sottovalutate con forti fondamentali e vantaggi competitivi sostenibili.
        </AlertDescription>
      </Alert>

      {/* Panoramica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Cos'è il Value Investing?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il value investing è una filosofia di investimento che si concentra sull'identificazione di azioni 
            il cui valore intrinseco è superiore al loro prezzo di mercato. Questo approccio, sviluppato da 
            <strong> Benjamin Graham </strong>e perfezionato da <strong> Warren Buffett</strong>, mira a:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Acquistare aziende con forte posizione competitiva (Economic Moat)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Valutare il valore intrinseco vs prezzo di mercato</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Mantenere un Margine di Sicurezza (Margin of Safety)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Focus su qualità aziendale e management competente</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Criteri Benjamin Graham */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Criteri Benjamin Graham
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Benjamin Graham stabilì criteri specifici per identificare stock value-friendly:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Metriche di Valutazione
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">P/E Ratio (Massimo):</span>
                  <Badge variant="outline">15</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">P/B Ratio (Massimo):</span>
                  <Badge variant="outline">1.5</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">ROE (Minimo):</span>
                  <Badge variant="outline">15%</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Debt-to-Equity (Massimo):</span>
                  <Badge variant="outline">2.0</Badge>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Criteri di Sicurezza
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Current Ratio (Minimo):</span>
                  <Badge variant="outline">1.0</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Dividend Yield:</span>
                  <Badge variant="outline" className="text-green-600">Preferibile</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Graham Number:</span>
                  <Badge variant="outline">Calcolato</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Margin of Safety:</span>
                  <Badge variant="outline" className="text-green-600">≥ 20%</Badge>
                </li>
              </ul>
            </div>
          </div>
          
          <Alert className="border-blue-500/20 bg-blue-500/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Graham Number:</strong> Formula di Benjamin Graham che combina P/E e P/B per calcolare 
              il valore teorico massimo che un investitore dovrebbe pagare per un'azione: √(22.5 × P/E × Book Value per Share)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Economic Moat Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Economic Moat (Vantaggio Competitivo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Il concetto di "Economic Moat" (fosso economico), introdotto da Warren Buffett, descrive la capacità 
            di un'azienda di proteggere i propri profitti dalla concorrenza nel lungo termine.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Brand Strength
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Potere del brand e lealtà dei clienti
              </p>
              <div className="text-sm">
                <strong>Esempi:</strong> Coca-Cola, Apple, Nike
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Network Effects
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Valore che aumenta con il numero di utenti
              </p>
              <div className="text-sm">
                <strong>Esempi:</strong> Facebook, Microsoft, Oracle
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost Advantages
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Vantaggi di costo rispetto ai concorrenti
              </p>
              <div className="text-sm">
                <strong>Esempi:</strong> Walmart, Costco, Amazon
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Switching Costs
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Difficoltà/costi per cambiare fornitore
              </p>
              <div className="text-sm">
                <strong>Esempi:</strong> Oracle DB, Adobe Creative Suite
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border bg-card">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Moat Strength Scale (1-10)
            </h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center">
                <Badge className="bg-red-500 text-white mb-2">Wide Moat (8-10)</Badge>
                <p className="text-xs text-muted-foreground">
                  Vantaggio competitivo significativo e sostenibile
                </p>
              </div>
              <div className="text-center">
                <Badge className="bg-yellow-500 text-white mb-2">Narrow Moat (5-7)</Badge>
                <p className="text-xs text-muted-foreground">
                  Vantaggio competitivo presente ma limitato
                </p>
              </div>
              <div className="text-center">
                <Badge className="bg-gray-500 text-white mb-2">No Moat (1-4)</Badge>
                <p className="text-xs text-muted-foreground">
                  Nessun vantaggio competitivo significativo
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intrinsic Value Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcolo Valore Intrinseco
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Il dashboard utilizza diversi metodi per calcolare il valore intrinseco di un'azienda:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  DCF (Discounted Cash Flow)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Sconta i flussi di cassa futuri attesi al presente usando il WACC (Weighted Average Cost of Capital).
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Growth Rate:</span>
                    <Badge variant="outline">8.5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount Rate:</span>
                    <Badge variant="outline">10.0%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Terminal Growth:</span>
                    <Badge variant="outline">2.5%</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Dividend Discount Model
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Valore basato sui dividendi futuri scontati al valore presente.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Formula:</strong> D₁ / (r - g)
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Book Value Approach
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Valore basato sul patrimonio netto per azione e multipli di settore.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Formula:</strong> Book Value × Industry Multiple
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Earnings Power Value
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Valore basato sui utili normalizzati e sostenibili.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Formula:</strong> Normalized EPS × Appropriate P/E
                </div>
              </div>
            </div>
          </div>
          
          <Alert className="border-purple-500/20 bg-purple-500/5">
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>Valore Intrinseco Medio:</strong> Il dashboard calcola la media dei diversi metodi per 
              ottenere una valutazione più robusta e affidabile del valore intrinseco dell'azienda.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Quality Score System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Sistema di scoring completo che valuta la qualità complessiva di un'azienda:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Financial Health</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Liquidità, capitale circolante, stabilità finanziaria
              </p>
              <Badge variant="outline" className="text-blue-600">0-100</Badge>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Management Quality</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Competenza del management, track record, governance
              </p>
              <Badge variant="outline" className="text-green-600">0-100</Badge>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Profitability Consistency</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Profitti stabili e crescenti nel tempo
              </p>
              <Badge variant="outline" className="text-purple-600">0-100</Badge>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Debt Management</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Gestione del debito, leverage, copertura interessi
              </p>
              <Badge variant="outline" className="text-orange-600">0-100</Badge>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Cash Flow Quality</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Qualità del cash flow, conversione utili-cash
              </p>
              <Badge variant="outline" className="text-red-600">0-100</Badge>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-2">Economic Moat</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Forza del vantaggio competitivo
              </p>
              <Badge variant="outline" className="text-yellow-600">0-100</Badge>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border bg-card">
            <h4 className="font-semibold text-foreground mb-3">Overall Quality Score Interpretation</h4>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="text-center">
                <Badge className="bg-green-600 text-white mb-2">90-100: Exceptional</Badge>
                <p className="text-xs text-muted-foreground">
                  Azienda di altissima qualità
                </p>
              </div>
              <div className="text-center">
                <Badge className="bg-blue-600 text-white mb-2">80-89: Excellent</Badge>
                <p className="text-xs text-muted-foreground">
                  Azienda di ottima qualità
                </p>
              </div>
              <div className="text-center">
                <Badge className="bg-yellow-600 text-white mb-2">70-79: Good</Badge>
                <p className="text-xs text-muted-foreground">
                  Azienda di buona qualità
                </p>
              </div>
              <div className="text-center">
                <Badge className="bg-gray-600 text-white mb-2">Below 70: Average</Badge>
                <p className="text-xs text-muted-foreground">
                  Qualità media o inferiore
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Screener */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Value Stock Screener
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Lo screener ti permette di filtrare le aziende in base a criteri specifici di value investing:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3">Valuation Filters</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Max P/E Ratio:</span>
                  <span>Controlla la sopravvalutazione</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Max P/B Ratio:</span>
                  <span>Valutazione sul patrimonio netto</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap Range:</span>
                  <span>Filtra per dimensione aziendale</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3">Quality & Safety Filters</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Min ROE:</span>
                  <span>Efficienza nell'uso del capitale</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Max Debt-to-Equity:</span>
                  <span>Livello di indebitamento</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Min Moat Strength:</span>
                  <span>Vantaggio competitivo</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Alert className="border-green-500/20 bg-green-500/5">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Best Practices:</strong> Combina filtri di valutazione (P/E, P/B) con filtri di qualità 
              (ROE, Moat Strength) per identificare opportunità value di alta qualità.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Investment Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Value Investment Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            La sezione Opportunities identifica le migliori opportunità value basate su:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Scoring System
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Opportunity Score:</span>
                  <Badge variant="outline">0-100</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Upside Potential:</span>
                  <Badge variant="outline" className="text-green-600">Calcolato</Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline" className="text-blue-600">Basso/Medio/Alto</Badge>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recommendations
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600 text-white">STRONG_BUY</Badge>
                  <span className="text-muted-foreground">Ottima opportunità</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-500 text-white">BUY</Badge>
                  <span className="text-muted-foreground">Buona opportunità</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-500 text-white">HOLD</Badge>
                  <span className="text-muted-foreground">Mantieni posizione</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border bg-card">
            <h4 className="font-semibold text-foreground mb-3">Key Investment Reasons</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Per ogni opportunità, il dashboard fornisce motivazioni dettagliate:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Valutazione secondo Benjamin Graham</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Forza del vantaggio competitivo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Margin of Safety e protezione downside</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Quality metrics e solidità finanziaria</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interpretazione Risultati */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Come Interpretare i Risultati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-green-500/5">
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Segnali Positivi
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>High Margin of Safety (≥25%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Graham Value = true</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Wide o Narrow Moat</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Quality Score ≥80</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Strong FCF generation</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-red-500/5">
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Down className="h-4 w-4" />
                Segnali di Attenzione
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  <span>High P/E ratio (&gt;25)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  <span>No Economic Moat</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  <span>High debt levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  <span>Declining profitability</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  <span>Poor cash flow quality</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> I risultati sono basati su dati simulati per scopi dimostrativi. 
              Nel mondo reale, è essenziale condurre una due diligence approfondita e consultare un consulente 
              finanziario qualificato prima di prendere decisioni di investimento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Best Practices Value Investing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Principi di Base
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Invest only in businesses you understand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Focus on intrinsic value, not market price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Maintain a margin of safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Think long-term (years, not quarters)</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Processo di Selezione
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Screen for basic value metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Analyze economic moat strength</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Calculate intrinsic value range</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Assess management quality</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border bg-card">
            <h4 className="font-semibold text-foreground mb-3">La Filosofia Warren Buffett</h4>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "Il prezzo è quello che paghi. Il valore è quello che ricevi. Il modo migliore di ridurre il rischio 
              è pensare alle azioni come pezzi di business."
              <footer className="text-sm mt-2 not-italic">- Warren Buffett</footer>
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Alert className="border-primary/20 bg-primary/5">
        <TrendingDown className="h-4 w-4" />
        <AlertDescription>
          <strong>Value Investing Dashboard</strong> implementa una metodologia sistematica per l'analisi fondamentale, 
          combinando i principi di Benjamin Graham con le innovazioni di Warren Buffett per identificare 
          opportunità di investimento di qualità con margini di sicurezza significativi.
        </AlertDescription>
      </Alert>
    </div>
  );
}