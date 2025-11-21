import OpenAI from 'openai';

// Configurazione e stato del client OpenAI
interface OpenAIConfig {
  isConfigured: boolean;
  isValid: boolean;
  mode: 'demo' | 'real';
  lastTest?: Date;
  testResult?: 'success' | 'error' | 'unknown';
  apiKey?: string;
}

let openAIConfig: OpenAIConfig = {
  isConfigured: false,
  isValid: false,
  mode: 'demo',
  testResult: 'unknown'
};

// Inizializzazione del client OpenAI (opzionale)
const getOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const mode = import.meta.env.VITE_OPENAI_MODE || 'demo';
  
  if (!apiKey) {
    console.log('⚠️ OpenAI API key non trovata, modalità demo attiva');
    openAIConfig = {
      isConfigured: false,
      isValid: false,
      mode: 'demo',
      testResult: 'unknown'
    };
    return null;
  }

  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️ Formato chiave API OpenAI non valido. Deve iniziare con "sk-"');
    openAIConfig = {
      isConfigured: true,
      isValid: false,
      mode: mode as 'demo' | 'real',
      testResult: 'error'
    };
    return null;
  }

  openAIConfig = {
    isConfigured: true,
    isValid: true,
    mode: mode as 'demo' | 'real',
    apiKey: apiKey.substring(0, 10) + '...', // Solo per logging sicuro
    testResult: 'unknown'
  };

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
    return '🤖 Modalità Demo: Chat AI temporaneamente non disponibile. Servizi simulati attivi.\n\n💡 Per attivare l\'AI reale: configura la tua chiave OpenAI API nelle impostazioni.';
  }
  
  try {
    const estimatedCost = estimateCost(1000, model);
    console.log(`💰 Costo stimato per questa richiesta: $${estimatedCost}`);
    
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || 'Nessuna risposta ricevuta';
    
    // Log del successo
    console.log(`✅ Chat OpenAI completata con successo (modello: ${model})`);
    
    return content;
  } catch (error) {
    logAPIError('sendChatMessage', error, { model, messageCount: messages.length });
    
    // Fallback intelligente basato sul tipo di errore
    if (error?.status === 401) {
      return '🔐 Errore di autenticazione OpenAI. Verifica la tua chiave API nelle impostazioni. Modalità demo attiva.';
    } else if (error?.status === 429) {
      return '⏱️ Troppe richieste. Rate limit superato. Riprova più tardi. Modalità demo attiva.';
    } else if (error?.status === 402) {
      return '💳 Credito OpenAI insufficiente. Aggiungi fondi al tuo account. Modalità demo attiva.';
    }
    
    return `❌ Errore di connessione OpenAI. Modalità demo attiva.\n\n🔧 Dettagli: ${error?.message || 'Errore sconosciuto'}`;
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
 * Testa automaticamente la validità della chiave API OpenAI
 */
export async function testOpenAIKey(): Promise<{
  success: boolean;
  error?: string;
  responseTime?: number;
  model?: string;
}> {
  if (!openai) {
    return {
      success: false,
      error: 'Client OpenAI non inizializzato. Modalità demo attiva.'
    };
  }

  const startTime = Date.now();
  
  try {
    // Test semplice con modello economico
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Rispondi solo "OK" se ricevi questo messaggio.'
        }
      ],
      max_tokens: 5,
      temperature: 0
    });

    const responseTime = Date.now() - startTime;
    
    // Aggiorna lo stato
    openAIConfig.lastTest = new Date();
    openAIConfig.testResult = 'success';
    
    console.log(`✅ OpenAI API test completato: ${responseTime}ms`);
    
    return {
      success: true,
      responseTime,
      model: response.model
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    openAIConfig.lastTest = new Date();
    openAIConfig.testResult = 'error';
    
    // Gestione errori specifici
    let errorMessage = 'Errore di connessione generico';
    
    if (error?.status === 401) {
      errorMessage = 'Chiave API non valida o scaduta';
    } else if (error?.status === 429) {
      errorMessage = 'Rate limit superato. Riprova più tardi.';
    } else if (error?.status === 402) {
      errorMessage = 'Credito insufficiente nel tuo account OpenAI';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    console.error(`❌ OpenAI API test fallito: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
      responseTime
    };
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

/**
 * Ottieni informazioni sulla configurazione OpenAI
 */
export function getOpenAIConfig(): OpenAIConfig {
  return { ...openAIConfig };
}

/**
 * Gestione sicura dell'errore con logging dettagliato
 */
function logAPIError(functionName: string, error: any, context?: any) {
  const errorInfo = {
    function: functionName,
    timestamp: new Date().toISOString(),
    hasOpenAI: !!openai,
    isConfigured: isOpenAIConfigured(),
    error: error?.message || error,
    context
  };
  
  console.error(`🚨 OpenAI ${functionName} Error:`, errorInfo);
  
  // In modalità demo, usa solo warning
  if (!openai) {
    console.warn(`📝 ${functionName}: Funziona in modalità demo`);
  }
}

/**
 * Test di connettività rapido (senza completare la richiesta)
 */
export async function quickConnectivityTest(): Promise<boolean> {
  if (!openai) {
    return false;
  }
  
  try {
    // Test base senza fare chiamate API
    const hasValidKey = openAIConfig.apiKey && openAIConfig.isValid;
    const lastTestRecent = openAIConfig.lastTest && 
      (Date.now() - openAIConfig.lastTest.getTime()) < 300000; // 5 minuti
    
    return hasValidKey && (lastTestRecent || openAIConfig.testResult === 'success');
  } catch {
    return false;
  }
}

/**
 * Ottieni stima dei costi per una richiesta
 */
export function estimateCost(tokens: number, model: string = 'gpt-4o-mini'): number {
  // Prezzi per 1K token (in USD) - Aggiornati al 2024
  const prices: { [key: string]: { input: number; output: number } } = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
  };
  
  const modelPrice = prices[model] || prices['gpt-4o-mini'];
  
  // Stima approssimativa: 70% input, 30% output
  const inputTokens = Math.floor(tokens * 0.7);
  const outputTokens = Math.floor(tokens * 0.3);
  
  const cost = (inputTokens / 1000) * modelPrice.input + 
               (outputTokens / 1000) * modelPrice.output;
  
  return Math.round(cost * 100000) / 100000; // Arrotonda a 5 decimali
}

export default openai;
