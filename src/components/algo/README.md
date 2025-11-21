# MomentumAlgo Component

Componente React per l'analisi algoritmica momentum/trend following con indicatori tecnici avanzati.

## Caratteristiche

### Indicatori Tecnici Inclusi
- **RSI (Relative Strength Index)**: Oscillatore momentum per identificare condizioni di ipercomprato (RSI > 70) e ipervenduto (RSI < 30)
- **MACD (Moving Average Convergence Divergence)**: Indicatore trend-following che mostra la relazione tra due medie mobili del prezzo
- **Bollinger Bands**: Bande di volatilità per identificare livelli di supporto e resistenza dinamici

### Funzionalità
- ✅ **Real-time signals**: Simula aggiornamenti in tempo reale ogni 5 secondi
- ✅ **Confidence scoring**: Sistema di confidenza basato sulla forza degli indicatori
- ✅ **Visualizzazioni interattive**: Grafici con Recharts per analisi visiva
- ✅ **Segnali di trading**: Genera segnali buy/sell/hold basati sull'analisi combinata
- ✅ **Responsive design**: Utilizza Tailwind CSS per design responsive
- ✅ **Componenti UI consistenti**: Utilizza gli stessi componenti UI del progetto (Card, Badge, Button, etc.)

### Interface

```typescript
interface MomentumAlgoProps {
  symbol?: string;           // Simbolo del strumento finanziario (default: 'EURUSD')
  data?: MomentumData[];     // Dati storici personalizzati (opzionale)
  isRealTime?: boolean;      // Abilita aggiornamenti in tempo reale (default: true)
  onSignal?: (signal: 'buy' | 'sell' | 'hold') => void; // Callback per segnali
}
```

```typescript
interface MomentumData {
  timestamp: string;    // ISO timestamp
  price: number;        // Prezzo corrente
  rsi: number;          // Valore RSI
  macd: number;         // Valore MACD
  macdSignal: number;   // Linea del segnale MACD
  bbUpper: number;      // Banda di Bollinger superiore
  bbLower: number;      // Banda di Bollinger inferiore
  bbMiddle: number;     // Banda di Bollinger media
  volume: number;       // Volume di trading
}
```

## Utilizzo

### Importazione
```typescript
import { MomentumAlgo } from '@/components/algo';
```

### Esempio Base
```tsx
<MomentumAlgo 
  symbol="EURUSD"
  isRealTime={true}
  onSignal={(signal) => {
    console.log('Segnale:', signal);
    // Gestisci il segnale...
  }}
/>
```

### Con Dati Personalizzati
```tsx
const customData: MomentumData[] = [
  {
    timestamp: '2025-11-20T01:54:32Z',
    price: 1.1000,
    rsi: 65.5,
    macd: 0.002,
    macdSignal: 0.001,
    bbUpper: 1.1050,
    bbLower: 1.0950,
    bbMiddle: 1.1000,
    volume: 1000000
  },
  // ... altri dati
];

<MomentumAlgo 
  symbol="GBPUSD"
  data={customData}
  isRealTime={false}
/>
```

## Logica dell'Algoritmo

### Generazione Segnali
1. **RSI**: Segnala `buy` se RSI < 30, `sell` se RSI > 70
2. **MACD**: Segnala `buy` se MACD > MACD Signal, `sell` altrimenti
3. **Bollinger Bands**: Segnala `buy` se prezzo vicino banda inferiore, `sell` se vicino banda superiore

### Segnale Complessivo
- **Buy**: Almeno 2 indicatori su 3 suggeriscono acquisto
- **Sell**: Almeno 2 indicatori su 3 suggeriscono vendita
- **Hold**: Nessun consenso chiaro tra gli indicatori

### Confidence Scoring
La confidenza è calcolata come media ponderata della forza di ogni indicatore:
- **RSI**: Basata sulla distanza dai valori estremi (30/70)
- **MACD**: Basata sulla differenza tra MACD e Signal line
- **Bollinger**: Basata sulla posizione relativa del prezzo nelle bande

## Componenti UI Utilizzati

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` - Layout principale
- `Badge` - Indicatori di stato e segnali
- `Button` - Controlli interattivi
- `ChartContainer`, `ChartTooltip` - Visualizzazioni dei grafici
- `LineChart`, `AreaChart`, `Line`, `Area`, `XAxis`, `YAxis`, `ReferenceLine` - Grafici tecnici

## Dipendenze

Il componente utilizza:
- `recharts` - Per i grafici interattivi
- `lucide-react` - Per le icone
- Radix UI components - Per l'interfaccia utente
- Tailwind CSS - Per lo styling

## Note

⚠️ **Disclaimer**: Questo componente è solo per scopi educativi e di analisi. Non costituisce consulenza finanziaria. Sempre combinare con analisi fondamentale e gestione del rischio appropriata.

🔄 **Aggiornamenti**: Il componente simula dati di mercato in tempo reale. Per produzione, integrare con API finanziarie reali.

## Personalizzazione

Il componente può essere facilmente personalizzato:
- Aggiungere nuovi indicatori tecnici
- Modificare i parametri degli indicatori esistenti
- Cambiare i colori e lo styling
- Estendere le funzionalità di analisi