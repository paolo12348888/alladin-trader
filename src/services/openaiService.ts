import OpenAI from 'openai';

// Inizializzazione del client OpenAI (opzionale)
const getOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OpenAI API key non trovata, modalità demo attiva');
    return null;
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Necessario per uso client-side
  });
};

const openai = getOpenAI();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Invia una richiesta al chatbot OpenAI
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = 'gpt-4o-mini'
): Promise<string> {
  if (!openai) {
    return 'Modalità demo: Chat AI temporaneamente non disponibile. Servizi simulati attivi.';
  }
  
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Nessuna risposta ricevuta';
  } catch (error) {
    console.error('Errore OpenAI Chat:', error);
    return 'Modalità demo: Chat AI temporaneamente non disponibile. Servizi simulati attivi.';
  }
}

/**
 * Genera previsioni di trading usando OpenAI
 */
export async function generateTradingPrediction(
  ticker: string,
  currentPrice: number,
  timeframe: string,
  marketData?: any
): Promise<{
  predictedPrice: number;
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
  analysis: string;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}> {
  if (!openai) {
    // Modalità demo con dati simulati
    const change = (Math.random() - 0.5) * 0.1;
    const newPrice = currentPrice * (1 + change);
    
    return {
      predictedPrice: newPrice,
      confidence: Math.floor(Math.random() * 30) + 60,
      direction: change > 0 ? 'up' : 'down',
      analysis: `Analisi simulata per ${ticker}: Mercato in modalità demo con previsioni basate su dati simulati.`,
      recommendation: change > 0 ? 'buy' : 'sell'
    };
  }
  
  try {
    const prompt = `Analizza il seguente asset finanziario e fornisci una previsione dettagliata.

Asset: ${ticker}
Prezzo Corrente: $${currentPrice}
Timeframe: ${timeframe}
${marketData ? `Dati di mercato: ${JSON.stringify(marketData)}` : ''}

Fornisci la risposta in questo formato JSON:
{
  "predictedPrice": <prezzo previsto>,
  "confidence": <confidenza 0-100>,
  "direction": "<up/down/neutral>",
  "analysis": "<analisi dettagliata>",
  "recommendation": "<strong_buy/buy/hold/sell/strong_sell>"
}

Basa la tua analisi su:
1. Trend di mercato recenti
2. Analisi tecnica
3. Sentiment di mercato
4. Fattori fondamentali`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto analista finanziario specializzato in trading algoritmico e previsioni di mercato.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    return {
      predictedPrice: result.predictedPrice || currentPrice,
      confidence: result.confidence || 50,
      direction: result.direction || 'neutral',
      analysis: result.analysis || 'Analisi non disponibile',
      recommendation: result.recommendation || 'hold'
    };
  } catch (error) {
    console.error('Errore generazione previsione:', error);
    // Fallback a modalità demo
    return generateTradingPrediction(ticker, currentPrice, timeframe, marketData);
  }
}

/**
 * Analizza segnali di trading usando OpenAI
 */
export async function analyzeTradingSignals(
  ticker: string,
  technicalIndicators: any,
  marketConditions: any
): Promise<{
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
}> {
  if (!openai) {
    // Modalità demo
    const signal = Math.random() > 0.5 ? 'buy' : 'sell';
    return {
      signal,
      strength: Math.floor(Math.random() * 40) + 60,
      reasoning: `Analisi simulata per ${ticker}: Segnali basati su dati demo`,
      riskLevel: Math.random() > 0.5 ? 'medium' : 'high'
    };
  }
  
  try {
    const prompt = `Analizza i seguenti indicatori tecnici e condizioni di mercato per ${ticker}:

Indicatori Tecnici: ${JSON.stringify(technicalIndicators)}
Condizioni di Mercato: ${JSON.stringify(marketConditions)}

Fornisci la risposta in questo formato JSON:
{
  "signal": "<buy/sell/hold>",
  "strength": <forza segnale 0-100>,
  "reasoning": "<spiegazione dettagliata>",
  "riskLevel": "<low/medium/high>"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto di analisi tecnica e trading algoritmico. Fornisci segnali di trading precisi e affidabili.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    return {
      signal: result.signal || 'hold',
      strength: result.strength || 50,
      reasoning: result.reasoning || 'Analisi non disponibile',
      riskLevel: result.riskLevel || 'medium'
    };
  } catch (error) {
    console.error('Errore analisi segnali:', error);
    return analyzeTradingSignals(ticker, technicalIndicators, marketConditions);
  }
}

/**
 * Genera analisi di mercato avanzata
 */
export async function generateMarketAnalysis(
  assets: string[],
  marketContext: string
): Promise<string> {
  if (!openai) {
    return `Analisi di mercato simulata per: ${assets.join(', ')}

Modalità demo attiva - L'analisi è basata su dati simulati.

Contesto: ${marketContext}

Analisi Generale:
- Trend: Mercato in modalità demo con volatilità simulata
- Opportunità: Identificate attraverso modelli algoritmici demo
- Rischi: In modalità demo, tutti i rischi sono simulati
- Raccomandazioni: Procedere con cautela e validare sempre i risultati`;
  }
  
  try {
    const prompt = `Fornisci un'analisi di mercato completa per i seguenti asset: ${assets.join(', ')}

Contesto di mercato: ${marketContext}

Includi:
1. Trend generali del mercato
2. Opportunità di trading
3. Rischi da considerare
4. Raccomandazioni strategiche`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto analista di mercati finanziari con esperienza in strategie di trading algoritmico.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2000
    });

    return response.choices[0]?.message?.content || 'Analisi non disponibile';
  } catch (error) {
    console.error('Errore generazione analisi:', error);
    return generateMarketAnalysis(assets, marketContext);
  }
}

/**
 * Verifica se l'API key è configurata correttamente
 */
export function isOpenAIConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
}

/**
 * Verifica se OpenAI è attualmente disponibile
 */
export function isOpenAIAvailable(): boolean {
  return !!openai;
}

export default openai;
