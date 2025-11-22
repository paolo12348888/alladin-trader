# Supply Chain Intelligence - Documentazione

## Panoramica
Il componente `SupplyChainIntelligence.tsx` è una dashboard completa per la sezione 'Supply Chain Intelligence' basata sull'algoritmo 'Supply Chain Disruption & Commodity Price Prediction Algo'.

## Struttura del Componente

### File Principali
- `src/pages/SupplyChainIntelligence.tsx` - Componente principale della dashboard
- `src/services/supplyChainService.ts` - Servizio per la gestione dei dati supply chain

### Dipendenze
- React (useState, useEffect)
- shadcn/ui components
- Lucide React (icone)
- Recharts (grafici)
- react-i18next (traduzioni)

## Caratteristiche Principali

### 1. Dashboard Overview
- **Metriche Overview**: KPI principali del sistema supply chain
- **Supply Chain Network**: Monitoraggio real-time di porti, miniere, impianti
- **Supply Chain Flow**: Distribuzione del flusso per categoria
- **Active Disruptions**: Monitoraggio disruption attive

### 2. Commodity Predictions
- **Price Predictions**: Predizioni algoritmiche per 24h e 7d
- **Confidence Scoring**: Punteggi di confidenza per ogni previsione
- **Technical Signals**: Trend short, medium e long term
- **Disruption Factors**: Fattori che influenzano i prezzi

### 3. Alpha Signal Generator
- **Long/Short Signals**: Segnali generati dall'algoritmo
- **Risk-Reward Ratio**: Calcolo ratio rischio/rendimento
- **Supply Chain Factors**: Fattori specifici supply chain
- **Expected Returns**: Stima dei rendimenti attesi

### 4. Risk Assessment
- **Risk Metrics**: Metriche di rischio per categoria
- **Geopolitical Risk**: Rischi geopolitici
- **Transport Risk**: Rischi di trasporto
- **Weather Risk**: Rischi meteorologici
- **Concentration Risk**: Rischio di concentrazione

### 5. Satellite Monitoring
- **Activity Indicators**: Indicatori attività da immagini satellitari
- **Change Detection**: Rilevamento cambiamenti
- **Port Activity**: Attività portuale
- **Mining Activity**: Attività mineraria

### 6. Shipping Analytics
- **Route Monitoring**: Monitoraggio rotte di trasporto
- **Congestion Levels**: Livelli di congestione
- **Transit Times**: Tempi di transito
- **Freight Rates**: Tassi di nolo

### 7. Sentiment Analysis
- **News Sentiment**: Analisi sentiment delle notizie
- **Social Media**: Sentiment dai social media
- **Impact Assessment**: Impatto sui prezzi

### 8. Correlation Matrix
- **Heatmap Correlations**: Matrice di correlazione tra commodities
- **Supply Chain Impact**: Impatto supply chain sui prezzi

## Asset Supportati

### Commodities Principali
- **XAUUSD** (Gold) - Monitoraggio oro con supply chain miniere
- **XAGUSD** (Silver) - Monitoraggio argento industriale e investment
- **CRUDE** (Petrolio) - Monitoraggio oil supply chain e raffinerie
- **WHEAT** (Grano) - Monitoraggio agricultural supply chain

### Additional Assets
- **LITHIUM** - Monitoraggio battery supply chain
- **COPPER** - Monitoraggio industrial metals supply chain

## Utilizzo del Servizio

### Metodi Principali

```typescript
import { supplyChainService } from "@/services/supplyChainService";

// Ottieni overview metrics
const overview = await supplyChainService.getOverviewMetrics();

// Ottieni predizioni commodities
const predictions = await supplyChainService.getCommodityPredictions();

// Ottieni alpha signals
const signals = await supplyChainService.getAlphaSignals();

// Ottieni risk metrics
const risks = await supplyChainService.getRiskMetrics();

// Ottieni matrice correlazioni
const correlations = await supplyChainService.getCorrelationMatrix();
```

### Struttura Dati

#### SupplyChainPoint
```typescript
interface SupplyChainPoint {
  id: string;
  name: string;
  type: 'port' | 'mine' | 'factory' | 'refinery' | 'terminal';
  coordinates: [number, number];
  status: 'operational' | 'disrupted' | 'maintenance' | 'offline';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  capacity_utilization: number;
  efficiency_score: number;
}
```

#### CommodityPrediction
```typescript
interface CommodityPrediction {
  symbol: string;
  current_price: number;
  predicted_price_24h: number;
  predicted_price_7d: number;
  confidence: number;
  supply_chain_impact: number;
  technical_signals: {
    short_term_trend: 'bullish' | 'bearish' | 'neutral';
    medium_term_trend: 'bullish' | 'bearish' | 'neutral';
    long_term_trend: 'bullish' | 'bearish' | 'neutral';
  };
}
```

#### AlphaSignal
```typescript
interface AlphaSignal {
  id: string;
  symbol: string;
  action: 'LONG' | 'SHORT';
  confidence: number;
  expected_return: number;
  risk_reward_ratio: number;
  supply_chain_factor: string;
}
```

## Navigazione

### URL
- Path: `/supply-chain-intelligence`
- Aggiunto automaticamente alla navigazione in `DashboardLayout.tsx`

### Traduzioni
- Italiano: "Intelligence Supply Chain"
- Inglese: "Supply Chain Intelligence"

## Aggiornamenti Real-time

Il componente si aggiorna automaticamente ogni 30 secondi per mantenere i dati aggiornati.

## Personalizzazione

### Aggiungere Nuovi Supply Chain Points
```typescript
// In supplyChainService.ts
private initializeSupplyChainPoints(): void {
  this.supplyChainPoints.push({
    id: 'new_point_001',
    name: 'Nome Nuovo Punto',
    type: 'port', // o 'mine', 'factory', etc.
    coordinates: [lat, lng],
    status: 'operational',
    risk_level: 'low',
    capacity_utilization: 75,
    // ... altri campi
  });
}
```

### Aggiungere Nuovi Asset
```typescript
// In initializeCommodityPredictions()
this.commodityPredictions.push({
  symbol: 'NUOVO_SYMBOL',
  name: 'Nome Asset',
  current_price: 100.00,
  // ... altri campi
});
```

## Considerazioni Future

1. **Integrazione API Reali**: Sostituire i dati simulati con API reali per supply chain data
2. **Machine Learning**: Implementare modelli ML per previsioni più accurate
3. **Real-time Updates**: WebSocket per aggiornamenti real-time
4. **Geolocalizzazione**: Mappa interattiva con geolocalizzazione
5. **Alert System**: Sistema di notifiche per disruption critiche

## Performance

- **Lazy Loading**: I dati vengono caricati on-demand
- **Caching**: I dati sono cacheati per ridurre le chiamate API
- **Optimized Rendering**: Uso di React.memo e useMemo per ottimizzazioni

## Troubleshooting

### Problemi Comuni

1. **Build Errors**: Verificare che tutte le dipendenze siano installate
2. **Missing Components**: Assicurarsi che tutti i componenti UI siano disponibili
3. **Translation Issues**: Verificare le chiavi di traduzione in i18n.ts

### Debug
```typescript
// Abilitare debug mode nel servizio
const service = new SupplyChainService();
// Il servizio logga automaticamente operazioni e errori
```

## Testing

Per testare il componente:
1. Navigare a `/supply-chain-intelligence`
2. Verificare che tutti i tab si caricano correttamente
3. Controllare che i dati simulati siano visualizzati
4. Verificare che la navigazione funzioni

## Roadmap

- [ ] Integrazione con API di supply chain reali
- [ ] Implementazione di modelli di ML avanzati
- [ ] Dashboard personalizzabili dall'utente
- [ ] Alert system avanzato
- [ ] Export dati in CSV/Excel
- [ ] Integrazione con sistemi ERP