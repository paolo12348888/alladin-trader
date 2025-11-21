import React from 'react';
import { MomentumAlgo } from '@/components/algo';

const AlgoPage: React.FC = () => {
  const handleSignal = (signal: 'buy' | 'sell' | 'hold') => {
    console.log('Segnale ricevuto:', signal);
    // Qui puoi implementare la logica per gestire i segnali
    // Ad esempio: inviare ordini, notificare l'utente, etc.
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Algoritmo Momentum</h1>
        <p className="text-muted-foreground">
          Analisi tecnica avanzata con RSI, MACD e Bollinger Bands
        </p>
      </div>

      <MomentumAlgo
        symbol="EURUSD"
        isRealTime={true}
        onSignal={handleSignal}
      />

      {/* Esempio con dati personalizzati */}
      <MomentumAlgo
        symbol="GBPUSD"
        isRealTime={false}
        onSignal={handleSignal}
      />
    </div>
  );
};

export default AlgoPage;