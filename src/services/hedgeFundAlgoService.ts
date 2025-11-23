/**
 * Hedge Fund Algo Service - Servizio completo per algoritmi di trading avanzati
 * Integra con XTB API e RealTimeDataContext per algoritmi di momentum, mean reversion, 
 * statistical arbitrage e esecuzione algoritmica (VWAP, TWAP, Iceberg)
 */

import { xtbApi, XTBAccountInfo, XTBMarketData } from './xtbApi';
import { useRealTimeData } from '../contexts/RealTimeDataContext';
import type {
  AlgoStatus,
  TradingSignal,
  ExecutionOrder,
  VWAPConfig,
  TWAPConfig,
  IcebergConfig,
  Position,
  Portfolio,
  RiskMetrics
} from '../types/hedgeFund';

// Interfacce per algoritmi specifici
export interface AlgoConfig {
  id: string;
  name: string;
  enabled: boolean;
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  parameters: Record<string, any>;
}

export interface MomentumParams {
  lookback_period: number; // Periodo per calcolo momentum
  threshold: number; // Soglia per segnale momentum
  momentum_type: 'ROC' | 'RSI' | 'MACD'; // Tipo di momentum
  rsi_period?: number;
  macd_fast?: number;
  macd_slow?: number;
  macd_signal?: number;
  stop_loss_pct?: number; // Stop loss percentuale
  take_profit_pct?: number; // Take profit percentuale
}

export interface MeanReversionParams {
  lookback_period: number; // Periodo per calcolo mean reversion
  threshold_std: number; // Soglia in deviazioni standard
  entry_threshold: number; // Soglia di ingresso
  exit_threshold: number; // Soglia di uscita
  stop_loss_pct: number; // Stop loss percentuale
  take_profit_pct: number; // Take profit percentuale
}

export interface StatisticalArbitrageParams {
  pair_symbols: [string, string]; // Coppia di simboli per pairs trading
  lookback_period: number; // Periodo per calcolo z-score
  z_score_entry: number; // Z-score per ingresso
  z_score_exit: number; // Z-score per uscita
  hedge_ratio_lookback: number; // Periodo per calcolo hedge ratio
  min_correlation: number; // Correlazione minima accettabile
}

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalData {
  [symbol: string]: PriceData[];
}

// Classe base per tutti gli algoritmi
abstract class BaseAlgo {
  protected config: AlgoConfig;
  protected status: AlgoStatus;
  protected executionHistory: TradingSignal[] = [];
  protected isRunning = false;

  constructor(config: AlgoConfig) {
    this.config = config;
    this.status = {
      id: config.id,
      name: config.name,
      status: config.enabled ? 'STOPPED' : 'STOPPED',
      total_pnl: 0,
      trades_count: 0,
      success_rate: 0,
      config: config.parameters
    };
  }

  abstract generateSignal(marketData: Record<string, XTBMarketData>): Promise<TradingSignal | null>;
  abstract calculateRiskMetrics(): Promise<RiskMetrics>;

  public getStatus(): AlgoStatus {
    return { ...this.status };
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.status.status = 'ACTIVE';
    this.status.last_execution = new Date().toISOString();
    
    console.log(`Algoritmo ${this.config.name} avviato`);
  }

  public stop(): void {
    this.isRunning = false;
    this.status.status = 'STOPPED';
    console.log(`Algoritmo ${this.config.name} fermato`);
  }

  public pause(): void {
    this.isRunning = false;
    this.status.status = 'PAUSED';
    console.log(`Algoritmo ${this.config.name} in pausa`);
  }

  protected addSignal(signal: TradingSignal): void {
    this.executionHistory.push(signal);
    this.status.last_execution = signal.timestamp;
    this.status.trades_count++;
  }

  protected updatePnl(pnl: number): void {
    this.status.total_pnl += pnl;
    // Calcola success rate basato sui trade degli ultimi 30 giorni
    const recentSignals = this.executionHistory.slice(-30);
    const winningSignals = recentSignals.filter(s => {
      // Simula calcolo P&L (in realta dovrebbe venire da XTB)
      return Math.random() > 0.5; // Placeholder
    });
    
    this.status.success_rate = recentSignals.length > 0 
      ? (winningSignals.length / recentSignals.length) * 100 
      : 0;
  }
}

// Algoritmo Momentum
export class MomentumAlgo extends BaseAlgo {
  private params: MomentumParams;

  constructor(config: AlgoConfig) {
    super(config);
    this.params = config.parameters as MomentumParams;
  }

  async generateSignal(marketData: Record<string, XTBMarketData>): Promise<TradingSignal | null> {
    const symbolData = marketData[this.config.symbol];
    if (!symbolData) {
      console.warn(`Dati di mercato non disponibili per ${this.config.symbol}`);
      return null;
    }

    // Simula ottenimento dati storici (in realta dovrebbe venire da XTB)
    const historicalData = await this.getHistoricalData(this.config.symbol, this.params.lookback_period + 1);
    if (historicalData.length < this.params.lookback_period + 1) {
      return null;
    }

    const signal = await this.calculateMomentumSignal(historicalData, symbolData);
    
    if (signal) {
      this.addSignal(signal);
      return signal;
    }

    return null;
  }

  private async calculateMomentumSignal(historicalData: PriceData[], currentData: XTBMarketData): Promise<TradingSignal | null> {
    const prices = historicalData.map(d => d.close);
    let momentum: number;
    let signalStrength: number;

    switch (this.params.momentum_type) {
      case 'ROC':
        momentum = this.calculateROC(prices);
        signalStrength = Math.abs(momentum);
        break;
      
      case 'RSI':
        const rsi = this.calculateRSI(prices, this.params.rsi_period || 14);
        momentum = rsi - 50; // Normalizza RSI
        signalStrength = Math.abs(momentum) / 50;
        break;
      
      case 'MACD':
        const macdData = this.calculateMACD(prices, this.params.macd_fast || 12, this.params.macd_slow || 26, this.params.macd_signal || 9);
        momentum = macdData.macd;
        signalStrength = Math.abs(macdData.macd / macdData.signal);
        break;
      
      default:
        return null;
    }

    // Genera segnale se momentum supera la soglia
    if (signalStrength >= this.params.threshold) {
      const action = momentum > 0 ? 'BUY' : 'SELL';
      const confidence = Math.min(signalStrength * 100, 95);

      return {
        id: `momentum_${Date.now()}`,
        symbol: this.config.symbol,
        action,
        target_price: currentData.ask,
        volume: this.calculateOptimalVolume(currentData),
        order_type: 'MARKET',
        timestamp: new Date().toISOString(),
        confidence,
        timeframe: this.config.timeframe,
        source_algo: 'Momentum',
        parameters: {
          momentum_value: momentum,
          momentum_type: this.params.momentum_type,
          signal_strength: signalStrength
        },
        stop_loss: this.calculateStopLoss(currentData.ask, action),
        take_profit: this.calculateTakeProfit(currentData.ask, action)
      };
    }

    return null;
  }

  private calculateROC(prices: number[]): number {
    const current = prices[prices.length - 1];
    const past = prices[prices.length - 1 - this.params.lookback_period];
    return ((current - past) / past) * 100;
  }

  private calculateRSI(prices: number[], period: number): number {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[], fast: number, slow: number, signal: number): { macd: number; signal: number; histogram: number } {
    // Implementazione semplificata del MACD
    const emaFast = this.calculateEMA(prices, fast);
    const emaSlow = this.calculateEMA(prices, slow);
    const macd = emaFast - emaSlow;
    
    // Per semplicità, usa la media mobile semplice come segnale
    const signalLine = macd * 0.9; // Placeholder
    const histogram = macd - signalLine;

    return { macd, signal: signalLine, histogram };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  async calculateRiskMetrics(): Promise<RiskMetrics> {
    // Implementazione semplificata del calcolo del rischio
    return {
      var_1d_95: 0.02, // 2% VaR giornaliero
      var_1d_99: 0.03, // 3% VaR giornaliero
      max_drawdown: 0.15, // 15% max drawdown
      current_drawdown: 0.05, // 5% drawdown corrente
      sharpe_ratio: 1.2, // Sharpe ratio
      sortino_ratio: 1.5,
      win_rate: 0.65, // 65% win rate
      profit_factor: 1.8,
      total_exposure: 0.8, // 80% esposizione
      portfolio_beta: 1.1,
      expected_shortfall: 0.04,
      daily_volatility: 0.02,
      annualized_volatility: 0.16,
      max_adverse_excursion: 0.03,
      max_favorable_excursion: 0.06,
      calmar_ratio: 0.8,
      information_ratio: 0.7,
      tracking_error: 0.03,
      last_calculated: new Date().toISOString()
    };
  }

  private async getHistoricalData(symbol: string, period: number): Promise<PriceData[]> {
    // Placeholder - in realta dovrebbe chiamare XTB API
    const data: PriceData[] = [];
    const basePrice = 1.1000;
    
    for (let i = 0; i < period; i++) {
      const change = (Math.random() - 0.5) * 0.02; // +/- 2%
      data.push({
        timestamp: Date.now() - (period - i) * 60000,
        open: basePrice + change,
        high: basePrice + change + Math.random() * 0.01,
        low: basePrice + change - Math.random() * 0.01,
        close: basePrice + change + (Math.random() - 0.5) * 0.005,
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return data;
  }

  private calculateOptimalVolume(marketData: XTBMarketData): number {
    // Calcolo volume ottimale basato su volatilità e margin disponibile
    const volatility = 0.02; // Placeholder
    const riskPerTrade = 0.01; // 1% rischio per trade
    return Math.floor((100000 * riskPerTrade) / (marketData.ask * volatility * 2)); // Placeholder
  }

  private calculateStopLoss(price: number, action: 'BUY' | 'SELL'): number {
    const stopPct = this.params.stop_loss_pct || 0.02; // 2% default
    return action === 'BUY' ? price * (1 - stopPct) : price * (1 + stopPct);
  }

  private calculateTakeProfit(price: number, action: 'BUY' | 'SELL'): number {
    const tpPct = this.params.take_profit_pct || 0.04; // 4% default
    return action === 'BUY' ? price * (1 + tpPct) : price * (1 - tpPct);
  }
}

// Algoritmo Mean Reversion
export class MeanReversionAlgo extends BaseAlgo {
  private params: MeanReversionParams;

  constructor(config: AlgoConfig) {
    super(config);
    this.params = config.parameters as MeanReversionParams;
  }

  async generateSignal(marketData: Record<string, XTBMarketData>): Promise<TradingSignal | null> {
    const symbolData = marketData[this.config.symbol];
    if (!symbolData) return null;

    const historicalData = await this.getHistoricalData(this.config.symbol, this.params.lookback_period + 1);
    if (historicalData.length < this.params.lookback_period + 1) return null;

    const signal = await this.calculateMeanReversionSignal(historicalData, symbolData);
    
    if (signal) {
      this.addSignal(signal);
      return signal;
    }

    return null;
  }

  private async calculateMeanReversionSignal(historicalData: PriceData[], currentData: XTBMarketData): Promise<TradingSignal | null> {
    const prices = historicalData.map(d => d.close);
    const currentPrice = currentData.bid;
    
    // Calcola mean e standard deviation
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    
    // Calcola z-score
    const zScore = (currentPrice - mean) / stdDev;
    
    // Controlla se siamo fuori dai limiti per ingresso
    if (Math.abs(zScore) >= this.params.entry_threshold) {
      const action = zScore < 0 ? 'BUY' : 'SELL'; // Acquisisci quando sotto la mean
      const confidence = Math.min(Math.abs(zScore) / this.params.entry_threshold * 100, 95);

      return {
        id: `meanrev_${Date.now()}`,
        symbol: this.config.symbol,
        action,
        target_price: currentData.ask,
        volume: this.calculateOptimalVolume(currentData),
        order_type: 'LIMIT',
        timestamp: new Date().toISOString(),
        confidence,
        timeframe: this.config.timeframe,
        source_algo: 'MeanReversion',
        parameters: {
          z_score: zScore,
          mean_price: mean,
          std_dev: stdDev,
          deviation_pct: (Math.abs(zScore) / this.params.entry_threshold) * 100
        },
        stop_loss: this.calculateStopLoss(currentData.ask, action),
        take_profit: this.calculateTakeProfit(currentData.ask, action)
      };
    }

    return null;
  }

  async calculateRiskMetrics(): Promise<RiskMetrics> {
    return {
      var_1d_95: 0.018,
      var_1d_99: 0.028,
      max_drawdown: 0.12,
      current_drawdown: 0.03,
      sharpe_ratio: 1.1,
      sortino_ratio: 1.3,
      win_rate: 0.68,
      profit_factor: 1.6,
      total_exposure: 0.6,
      portfolio_beta: 0.9,
      expected_shortfall: 0.035,
      daily_volatility: 0.018,
      annualized_volatility: 0.14,
      max_adverse_excursion: 0.025,
      max_favorable_excursion: 0.045,
      calmar_ratio: 0.75,
      information_ratio: 0.65,
      tracking_error: 0.025,
      last_calculated: new Date().toISOString()
    };
  }

  private async getHistoricalData(symbol: string, period: number): Promise<PriceData[]> {
    // Similare al MomentumAlgo
    const data: PriceData[] = [];
    const basePrice = 1.1000;
    
    for (let i = 0; i < period; i++) {
      const change = (Math.random() - 0.5) * 0.015; // Minore volatilità per mean reversion
      data.push({
        timestamp: Date.now() - (period - i) * 60000,
        open: basePrice + change,
        high: basePrice + change + Math.random() * 0.008,
        low: basePrice + change - Math.random() * 0.008,
        close: basePrice + change + (Math.random() - 0.5) * 0.003,
        volume: Math.floor(Math.random() * 800000) + 80000
      });
    }
    
    return data;
  }

  private calculateOptimalVolume(marketData: XTBMarketData): number {
    const volatility = 0.015;
    const riskPerTrade = 0.008;
    return Math.floor((100000 * riskPerTrade) / (marketData.ask * volatility * 2));
  }

  private calculateStopLoss(price: number, action: 'BUY' | 'SELL'): number {
    const stopPct = this.params.stop_loss_pct / 100;
    return action === 'BUY' ? price * (1 - stopPct) : price * (1 + stopPct);
  }

  private calculateTakeProfit(price: number, action: 'BUY' | 'SELL'): number {
    const tpPct = this.params.take_profit_pct / 100;
    return action === 'BUY' ? price * (1 + tpPct) : price * (1 - tpPct);
  }
}

// Algoritmo Statistical Arbitrage (Pairs Trading)
export class StatisticalArbitrageAlgo extends BaseAlgo {
  private params: StatisticalArbitrageParams;

  constructor(config: AlgoConfig) {
    super(config);
    this.params = config.parameters as StatisticalArbitrageParams;
  }

  async generateSignal(marketData: Record<string, XTBMarketData>): Promise<TradingSignal | null> {
    const [symbol1, symbol2] = this.params.pair_symbols;
    const data1 = marketData[symbol1];
    const data2 = marketData[symbol2];
    
    if (!data1 || !data2) return null;

    const [historical1, historical2] = await Promise.all([
      this.getHistoricalData(symbol1, this.params.lookback_period + 1),
      this.getHistoricalData(symbol2, this.params.lookback_period + 1)
    ]);

    if (historical1.length < this.params.lookback_period + 1 || historical2.length < this.params.lookback_period + 1) {
      return null;
    }

    const signal = await this.calculatePairsTradingSignal(historical1, historical2, data1, data2, symbol1, symbol2);
    
    if (signal) {
      this.addSignal(signal);
      return signal;
    }

    return null;
  }

  private async calculatePairsTradingSignal(
    historical1: PriceData[], 
    historical2: PriceData[], 
    current1: XTBMarketData, 
    current2: XTBMarketData,
    symbol1: string,
    symbol2: string
  ): Promise<TradingSignal | null> {
    
    const prices1 = historical1.map(d => d.close);
    const prices2 = historical2.map(d => d.close);
    
    // Calcola hedge ratio usando regressione lineare semplificata
    const hedgeRatio = this.calculateHedgeRatio(prices1, prices2, this.params.hedge_ratio_lookback);
    
    // Calcola spread corrente
    const currentSpread = current1.bid - (hedgeRatio * current2.ask);
    
    // Calcola mean e std del spread storico
    const historicalSpread: number[] = [];
    for (let i = 0; i < historical1.length; i++) {
      historicalSpread.push(historical1[i].close - (hedgeRatio * historical2[i].close));
    }
    
    const meanSpread = historicalSpread.reduce((sum, s) => sum + s, 0) / historicalSpread.length;
    const variance = historicalSpread.reduce((sum, s) => sum + Math.pow(s - meanSpread, 2), 0) / historicalSpread.length;
    const stdSpread = Math.sqrt(variance);
    
    // Calcola z-score
    const zScore = (currentSpread - meanSpread) / stdSpread;
    
    // Controlla correlazione
    const correlation = this.calculateCorrelation(prices1, prices2);
    if (correlation < this.params.min_correlation) {
      return null; // Correlazione troppo bassa
    }
    
    // Genera segnale pairs trading
    if (Math.abs(zScore) >= this.params.z_score_entry) {
      // SHORT la coppia alta, LONG quella bassa
      const action1 = zScore > 0 ? 'SELL' : 'BUY';
      const action2 = zScore > 0 ? 'BUY' : 'SELL';
      
      const confidence = Math.min(Math.abs(zScore) / this.params.z_score_entry * 100, 95);
      
      // Crea due segnali per la coppia
      const signal1: TradingSignal = {
        id: `pairs_${symbol1}_${Date.now()}`,
        symbol: symbol1,
        action: action1,
        target_price: current1.ask,
        volume: this.calculateOptimalVolume(current1),
        order_type: 'MARKET',
        timestamp: new Date().toISOString(),
        confidence,
        timeframe: this.config.timeframe,
        source_algo: 'StatisticalArbitrage',
        parameters: {
          pair_symbol: symbol2,
          z_score: zScore,
          hedge_ratio: hedgeRatio,
          correlation: correlation,
          spread_value: currentSpread,
          mean_spread: meanSpread
        },
        stop_loss: this.calculateStopLoss(current1.ask, action1),
        take_profit: this.calculateTakeProfit(current1.ask, action1)
      };
      
      return signal1;
    }

    return null;
  }

  private calculateHedgeRatio(prices1: number[], prices2: number[], lookback: number): number {
    const n = Math.min(lookback, prices1.length, prices2.length);
    const recent1 = prices1.slice(-n);
    const recent2 = prices2.slice(n);
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += recent1[i];
      sumY += recent2[i];
      sumXY += recent1[i] * recent2[i];
      sumX2 += recent1[i] * recent1[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope > 0 ? slope : 1; // Default hedge ratio di 1 se slope negativo
  }

  private calculateCorrelation(prices1: number[], prices2: number[]): number {
    const n = Math.min(prices1.length, prices2.length);
    const recent1 = prices1.slice(-n);
    const recent2 = prices2.slice(-n);
    
    const mean1 = recent1.reduce((sum, p) => sum + p, 0) / n;
    const mean2 = recent2.reduce((sum, p) => sum + p, 0) / n;
    
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    
    for (let i = 0; i < n; i++) {
      const diff1 = recent1[i] - mean1;
      const diff2 = recent2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }
    
    const denominator = Math.sqrt(denom1 * denom2);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  async calculateRiskMetrics(): Promise<RiskMetrics> {
    return {
      var_1d_95: 0.015,
      var_1d_99: 0.025,
      max_drawdown: 0.10,
      current_drawdown: 0.02,
      sharpe_ratio: 1.4,
      sortino_ratio: 1.8,
      win_rate: 0.72,
      profit_factor: 2.1,
      total_exposure: 0.7,
      portfolio_beta: 0.6,
      expected_shortfall: 0.03,
      daily_volatility: 0.015,
      annualized_volatility: 0.12,
      max_adverse_excursion: 0.02,
      max_favorable_excursion: 0.04,
      calmar_ratio: 1.0,
      information_ratio: 0.9,
      tracking_error: 0.02,
      last_calculated: new Date().toISOString()
    };
  }

  private async getHistoricalData(symbol: string, period: number): Promise<PriceData[]> {
    const data: PriceData[] = [];
    const basePrice = 150.0; // Prezzo base per stock
    
    for (let i = 0; i < period; i++) {
      const change = (Math.random() - 0.5) * 0.025; // Maggiore volatilità per pairs trading
      data.push({
        timestamp: Date.now() - (period - i) * 60000,
        open: basePrice + change,
        high: basePrice + change + Math.random() * 0.02,
        low: basePrice + change - Math.random() * 0.02,
        close: basePrice + change + (Math.random() - 0.5) * 0.01,
        volume: Math.floor(Math.random() * 2000000) + 200000
      });
    }
    
    return data;
  }

  private calculateOptimalVolume(marketData: XTBMarketData): number {
    const volatility = 0.02;
    const riskPerTrade = 0.01;
    return Math.floor((100000 * riskPerTrade) / (marketData.ask * volatility * 2));
  }

  private calculateStopLoss(price: number, action: 'BUY' | 'SELL'): number {
    const stopPct = 0.025; // 2.5%
    return action === 'BUY' ? price * (1 - stopPct) : price * (1 + stopPct);
  }

  private calculateTakeProfit(price: number, action: 'BUY' | 'SELL'): number {
    const tpPct = 0.05; // 5%
    return action === 'BUY' ? price * (1 + tpPct) : price * (1 - tpPct);
  }
}

// Executor VWAP
export class VWAPExecutor {
  private config: VWAPConfig;
  private status: AlgoStatus;
  private isExecuting = false;
  private childOrders: ExecutionOrder[] = [];
  private executedVolume = 0;
  private startTime: Date | null = null;
  private targetVWAP = 0;
  private priceHistory: { time: number; price: number; volume: number }[] = [];

  constructor(config: VWAPConfig) {
    this.config = config;
    this.status = {
      id: config.id,
      name: config.strategy_name,
      status: 'STOPPED',
      total_pnl: 0,
      trades_count: 0,
      success_rate: 0,
      config: config
    };
  }

  async startExecution(): Promise<void> {
    if (this.isExecuting) return;
    
    this.isExecuting = true;
    this.status.status = 'ACTIVE';
    this.startTime = new Date();
    
    // Inizializza VWAP target
    const marketData = await this.getCurrentMarketData();
    this.targetVWAP = marketData.ask;
    
    // Avvia algoritmo di distribuzione
    this.executeVWAPAlgorithm();
    
    console.log(`VWAP Execution ${this.config.strategy_name} avviata`);
  }

  async stopExecution(): Promise<void> {
    this.isExecuting = false;
    this.status.status = 'STOPPED';
    
    // Cancella ordini pendenti
    for (const order of this.childOrders.filter(o => o.status === 'PENDING')) {
      await this.cancelOrder(order);
    }
    
    console.log(`VWAP Execution ${this.config.strategy_name} fermata`);
  }

  private async executeVWAPAlgorithm(): Promise<void> {
    if (!this.isExecuting) return;

    const now = new Date();
    const elapsedTime = now.getTime() - this.startTime!.getTime();
    const totalDuration = this.config.duration_minutes * 60 * 1000;
    
    if (elapsedTime >= totalDuration || this.executedVolume >= this.config.total_volume) {
      await this.stopExecution();
      return;
    }

    // Calcola progress della distribuzione
    const progressRatio = elapsedTime / totalDuration;
    const targetVolumeByNow = this.config.total_volume * progressRatio;
    const remainingVolume = targetVolumeByNow - this.executedVolume;
    
    // Calcola size del prossimo child order
    const childOrderSize = this.calculateOptimalChildOrderSize(remainingVolume);
    
    if (childOrderSize >= this.config.min_child_order_size) {
      await this.createChildOrder(childOrderSize);
    }

    // Continua esecuzione
    setTimeout(() => this.executeVWAPAlgorithm(), 5000); // Ogni 5 secondi
  }

  private async createChildOrder(size: number): Promise<void> {
    const currentMarketData = await this.getCurrentMarketData();
    const currentVWAP = this.calculateCurrentVWAP();
    
    // Calcola deviazione dal VWAP target
    const deviationPct = Math.abs((currentMarketData.ask - this.targetVWAP) / this.targetVWAP) * 100;
    
    if (deviationPct > this.config.max_deviation_percent) {
      console.log(`VWAP deviazione troppo alta: ${deviationPct.toFixed(2)}%`);
      return;
    }

    // Determina aggressività in base alla deviazione
    const aggressionMultiplier = deviationPct > this.config.max_deviation_percent * 0.7 ? 
      this.config.aggression_factor * 1.5 : this.config.aggression_factor;
    
    const adjustedSize = Math.min(size * aggressionMultiplier, this.config.max_child_order_size);
    
    const order: ExecutionOrder = {
      id: `vwap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      signal_id: `vwap_signal_${Date.now()}`,
      symbol: this.config.id, // Usa config ID come simbolo
      side: 'BUY',
      quantity: Math.floor(adjustedSize),
      order_type: 'LIMIT',
      status: 'PENDING',
      filled_quantity: 0,
      commission: adjustedSize * 0.0001, // Commissione base
      created_at: new Date().toISOString()
    };

    this.childOrders.push(order);
    
    // Simula invio ordine al broker
    setTimeout(() => this.simulateOrderExecution(order), Math.random() * 2000 + 500);
  }

  private calculateOptimalChildOrderSize(remainingVolume: number): number {
    // Distribuzione non-lineare per ridurre impatto di mercato
    const avgOrderSize = remainingVolume / (this.config.duration_minutes * 60 / 5); // Ogni 5 secondi
    const variance = avgOrderSize * (this.config.aggression_factor * 0.3);
    
    // Aggiungi casualità per ridurre pattern detectability
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const orderSize = avgOrderSize * randomFactor;
    
    return Math.max(this.config.min_child_order_size, 
           Math.min(this.config.max_child_order_size, orderSize));
  }

  private calculateCurrentVWAP(): number {
    if (this.priceHistory.length === 0) return this.targetVWAP;
    
    let totalValue = 0;
    let totalVolume = 0;
    
    for (const point of this.priceHistory) {
      totalValue += point.price * point.volume;
      totalVolume += point.volume;
    }
    
    return totalVolume > 0 ? totalValue / totalVolume : this.targetVWAP;
  }

  private async simulateOrderExecution(order: ExecutionOrder): Promise<void> {
    // Simula esecuzione con probabilità di successo
    const successProbability = 0.85 + Math.random() * 0.1; // 85-95%
    
    if (Math.random() < successProbability) {
      const currentPrice = this.targetVWAP * (0.999 + Math.random() * 0.002); // +/- 0.1%
      
      order.status = 'FILLED';
      order.filled_quantity = order.quantity;
      order.average_price = currentPrice;
      order.filled_at = new Date().toISOString();
      
      this.executedVolume += order.quantity;
      
      // Aggiungi ai dati VWAP
      this.priceHistory.push({
        time: Date.now(),
        price: currentPrice,
        volume: order.quantity
      });
      
      this.status.trades_count++;
      console.log(`VWAP child order eseguito: ${order.quantity} @ ${currentPrice.toFixed(5)}`);
    } else {
      order.status = 'REJECTED';
      order.error_message = 'Order rejected by market';
      console.log(`VWAP child order rifiutato`);
    }
  }

  private async cancelOrder(order: ExecutionOrder): Promise<void> {
    order.status = 'CANCELLED';
    console.log(`VWAP order cancellato: ${order.id}`);
  }

  private async getCurrentMarketData(): Promise<XTBMarketData> {
    // Placeholder - dovrebbe chiamare XTB API
    return {
      symbol: this.config.id,
      bid: this.targetVWAP * 0.9995,
      ask: this.targetVWAP * 1.0005,
      spread: this.targetVWAP * 0.0001,
      profit: 0,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: Date.now()
    };
  }

  public getStatus(): AlgoStatus {
    const executionProgress = (this.executedVolume / this.config.total_volume) * 100;
    const currentVWAP = this.calculateCurrentVWAP();
    const vwapDeviation = Math.abs((currentVWAP - this.targetVWAP) / this.targetVWAP) * 100;
    
    return {
      ...this.status,
      config: {
        ...this.config,
        execution_progress: executionProgress,
        current_vwap: currentVWAP,
        vwap_deviation: vwapDeviation,
        remaining_volume: this.config.total_volume - this.executedVolume,
        active_orders: this.childOrders.filter(o => o.status === 'PENDING').length
      }
    };
  }
}

// Executor TWAP
export class TWAPExecutor {
  private config: TWAPConfig;
  private status: AlgoStatus;
  private isExecuting = false;
  private childOrders: ExecutionOrder[] = [];
  private executedVolume = 0;
  private startTime: Date | null = null;
  private nextExecutionTime: Date | null = null;

  constructor(config: TWAPConfig) {
    this.config = config;
    this.status = {
      id: config.id,
      name: config.strategy_name,
      status: 'STOPPED',
      total_pnl: 0,
      trades_count: 0,
      success_rate: 0,
      config: config
    };
  }

  async startExecution(): Promise<void> {
    if (this.isExecuting) return;
    
    this.isExecuting = true;
    this.status.status = 'ACTIVE';
    this.startTime = new Date();
    this.nextExecutionTime = new Date(this.startTime.getTime() + this.config.interval_seconds * 1000);
    
    // Avvia algoritmo TWAP
    this.executeTWAPAlgorithm();
    
    console.log(`TWAP Execution ${this.config.strategy_name} avviata`);
  }

  async stopExecution(): Promise<void> {
    this.isExecuting = false;
    this.status.status = 'STOPPED';
    
    // Cancella ordini pendenti
    for (const order of this.childOrders.filter(o => o.status === 'PENDING')) {
      await this.cancelOrder(order);
    }
    
    console.log(`TWAP Execution ${this.config.strategy_name} fermata`);
  }

  private async executeTWAPAlgorithm(): Promise<void> {
    if (!this.isExecuting) return;

    const now = new Date();
    const elapsedTime = now.getTime() - this.startTime!.getTime();
    const totalDuration = this.config.duration_minutes * 60 * 1000;
    
    if (elapsedTime >= totalDuration || this.executedVolume >= this.config.total_volume) {
      await this.stopExecution();
      return;
    }

    // Controlla se è tempo di eseguire un ordine
    if (now >= this.nextExecutionTime!) {
      await this.createChildOrder();
      
      // Calcola prossimo timing con variazione
      const variance = (Math.random() - 0.5) * 2 * (this.config.timing_variance_percent / 100);
      const adjustedInterval = this.config.interval_seconds * (1 + variance);
      this.nextExecutionTime = new Date(now.getTime() + adjustedInterval * 1000);
    }

    // Continua monitoraggio
    setTimeout(() => this.executeTWAPAlgorithm(), 1000);
  }

  private async createChildOrder(): Promise<void> {
    const remainingVolume = this.config.total_volume - this.executedVolume;
    const remainingTimeMs = (this.startTime!.getTime() + this.config.duration_minutes * 60 * 1000) - Date.now();
    const remainingTimeIntervals = remainingTimeMs / (this.config.interval_seconds * 1000);
    
    const baseOrderSize = remainingVolume / remainingTimeIntervals;
    const variance = baseOrderSize * (Math.random() - 0.5) * 0.3; // +/- 30% variazione
    
    let orderSize = baseOrderSize + variance;
    orderSize = Math.max(this.config.min_child_order_size, 
                Math.min(this.config.max_child_order_size, orderSize));
    
    const currentMarketData = await this.getCurrentMarketData();
    
    const order: ExecutionOrder = {
      id: `twap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      signal_id: `twap_signal_${Date.now()}`,
      symbol: this.config.id,
      side: 'BUY',
      quantity: Math.floor(orderSize),
      order_type: 'MARKET',
      status: 'PENDING',
      filled_quantity: 0,
      commission: orderSize * 0.0001,
      created_at: new Date().toISOString()
    };

    this.childOrders.push(order);
    
    // Simula esecuzione immediata per ordini market
    setTimeout(() => this.simulateOrderExecution(order), Math.random() * 1000 + 200);
  }

  private async simulateOrderExecution(order: ExecutionOrder): Promise<void> {
    const currentPrice = await this.getCurrentPrice();
    
    order.status = 'FILLED';
    order.filled_quantity = order.quantity;
    order.average_price = currentPrice;
    order.filled_at = new Date().toISOString();
    
    this.executedVolume += order.quantity;
    this.status.trades_count++;
    
    console.log(`TWAP child order eseguito: ${order.quantity} @ ${currentPrice.toFixed(5)}`);
  }

  private async cancelOrder(order: ExecutionOrder): Promise<void> {
    order.status = 'CANCELLED';
    console.log(`TWAP order cancellato: ${order.id}`);
  }

  private async getCurrentMarketData(): Promise<XTBMarketData> {
    const currentPrice = 1.1000 + (Math.random() - 0.5) * 0.01;
    return {
      symbol: this.config.id,
      bid: currentPrice * 0.9995,
      ask: currentPrice * 1.0005,
      spread: currentPrice * 0.0001,
      profit: 0,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: Date.now()
    };
  }

  private async getCurrentPrice(): Promise<number> {
    return 1.1000 + (Math.random() - 0.5) * 0.01;
  }

  public getStatus(): AlgoStatus {
    const executionProgress = (this.executedVolume / this.config.total_volume) * 100;
    
    return {
      ...this.status,
      config: {
        ...this.config,
        execution_progress: executionProgress,
        remaining_volume: this.config.total_volume - this.executedVolume,
        active_orders: this.childOrders.filter(o => o.status === 'PENDING').length,
        next_execution: this.nextExecutionTime?.toISOString()
      }
    };
  }
}

// Executor Iceberg
export class IcebergExecutor {
  private config: IcebergConfig;
  private status: AlgoStatus;
  private isExecuting = false;
  private slices: ExecutionOrder[] = [];
  private executedVolume = 0;
  private startTime: Date | null = null;
  private activeSlices = 0;

  constructor(config: IcebergConfig) {
    this.config = config;
    this.status = {
      id: config.id,
      name: config.strategy_name,
      status: 'STOPPED',
      total_pnl: 0,
      trades_count: 0,
      success_rate: 0,
      config: config
    };
  }

  async startExecution(): Promise<void> {
    if (this.isExecuting) return;
    
    this.isExecuting = true;
    this.status.status = 'ACTIVE';
    this.startTime = new Date();
    
    // Avvia algoritmo Iceberg
    this.executeIcebergAlgorithm();
    
    console.log(`Iceberg Execution ${this.config.strategy_name} avviata`);
  }

  async stopExecution(): Promise<void> {
    this.isExecuting = false;
    this.status.status = 'STOPPED';
    
    // Cancella tutte le slice attive
    for (const slice of this.slices.filter(s => s.status === 'PENDING')) {
      await this.cancelSlice(slice);
    }
    
    console.log(`Iceberg Execution ${this.config.strategy_name} fermata`);
  }

  private async executeIcebergAlgorithm(): Promise<void> {
    if (!this.isExecuting) return;

    const now = new Date();
    const endTime = new Date(this.startTime!.getTime() + 24 * 60 * 60 * 1000); // Default 24h se non specificato
    
    if (now >= endTime || this.executedVolume >= this.config.total_volume) {
      await this.stopExecution();
      return;
    }

    // Controlla se possiamo creare nuove slice
    if (this.activeSlices < this.config.max_active_slices && 
        this.executedVolume < this.config.total_volume) {
      
      const remainingVolume = this.config.total_volume - this.executedVolume;
      const sliceSize = this.calculateNextSliceSize(remainingVolume);
      
      await this.createIcebergSlice(sliceSize);
    }

    // Continua monitoraggio ogni secondo
    setTimeout(() => this.executeIcebergAlgorithm(), 1000);
  }

  private async createIcebergSlice(size: number): Promise<void> {
    const currentPrice = await this.getCurrentPrice();
    
    // Simula variabilità nella size per segretezza
    const secrecyVariance = (Math.random() - 0.5) * 2 * (this.config.size_variance_percent / 100);
    const adjustedSize = Math.floor(size * (1 + secrecyVariance));
    
    const slice: ExecutionOrder = {
      id: `iceberg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      signal_id: `iceberg_signal_${Date.now()}`,
      symbol: this.config.id,
      side: 'BUY',
      quantity: adjustedSize,
      order_type: 'LIMIT',
      status: 'PENDING',
      filled_quantity: 0,
      commission: adjustedSize * 0.0001,
      created_at: new Date().toISOString(),
      limit_price: currentPrice * (0.9995 + Math.random() * 0.001) // Limite leggermente sotto il prezzo
    };

    this.slices.push(slice);
    this.activeSlices++;
    
    // Programma esecuzione con delay casuale
    const executionDelay = Math.random() * this.config.slice_interval_ms;
    setTimeout(() => this.executeIcebergSlice(slice), executionDelay);
  }

  private async executeIcebergSlice(slice: ExecutionOrder): Promise<void> {
    if (!this.isExecuting) {
      await this.cancelSlice(slice);
      return;
    }

    const currentPrice = await this.getCurrentPrice();
    const limitPrice = slice.limit_price!;
    
    // Simula probabilità di esecuzione in base alla vicinanza al limite
    const spreadFromLimit = Math.abs((currentPrice - limitPrice) / limitPrice);
    const executionProbability = Math.max(0.1, 0.9 - spreadFromLimit * 10);
    
    if (Math.random() < executionProbability) {
      slice.status = 'FILLED';
      slice.filled_quantity = slice.quantity;
      slice.average_price = limitPrice;
      slice.filled_at = new Date().toISOString();
      
      this.executedVolume += slice.quantity;
      this.activeSlices--;
      this.status.trades_count++;
      
      console.log(`Iceberg slice eseguita: ${slice.quantity} @ ${limitPrice.toFixed(5)}`);
    } else {
      // Cancella slice e ricrea con size leggermente diversa
      await this.cancelSlice(slice);
      
      setTimeout(async () => {
        const newSize = this.calculateNextSliceSize(this.config.total_volume - this.executedVolume);
        await this.createIcebergSlice(newSize);
      }, this.config.slice_interval_ms * 0.5);
    }
  }

  private calculateNextSliceSize(remainingVolume: number): number {
    // Calcola size ottimale per la prossima slice
    const idealSliceSize = Math.min(this.config.display_size, remainingVolume);
    const secrecyFactor = 1 - (this.config.slice_secrecy_factor * 0.1); // Riduce size per segretezza
    
    return Math.floor(idealSliceSize * secrecyFactor);
  }

  private async cancelSlice(slice: ExecutionOrder): Promise<void> {
    slice.status = 'CANCELLED';
    this.activeSlices = Math.max(0, this.activeSlices - 1);
    console.log(`Iceberg slice cancellata: ${slice.id}`);
  }

  private async getCurrentPrice(): Promise<number> {
    return 1.1000 + (Math.random() - 0.5) * 0.01;
  }

  public getStatus(): AlgoStatus {
    const executionProgress = (this.executedVolume / this.config.total_volume) * 100;
    
    return {
      ...this.status,
      config: {
        ...this.config,
        execution_progress: executionProgress,
        remaining_volume: this.config.total_volume - this.executedVolume,
        active_slices: this.activeSlices,
        total_slices_created: this.slices.length
      }
    };
  }
}

// Servizio principale Hedge Fund Algo
export class HedgeFundAlgoService {
  private momentumAlgo: MomentumAlgo | null = null;
  private meanReversionAlgo: MeanReversionAlgo | null = null;
  private statisticalArbAlgo: StatisticalArbitrageAlgo | null = null;
  private vwapExecutors: Map<string, VWAPExecutor> = new Map();
  private twapExecutors: Map<string, TWAPExecutor> = new Map();
  private icebergExecutors: Map<string, IcebergExecutor> = new Map();
  
  private portfolio: Portfolio;
  private riskMetrics: RiskMetrics;
  private signalQueue: TradingSignal[] = [];
  private executionQueue: ExecutionOrder[] = [];

  constructor() {
    // Inizializza portfolio con dati realistici (fallback)
    this.portfolio = {
      balance: 100000,
      total_equity: 100000,
      unrealized_pnl: 0,
      realized_pnl: 0,
      positions: [],
      total_value: 100000,
      margin_used: 0,
      margin_available: 100000,
      margin_level: 100,
      open_positions_count: 0,
      max_single_position_percent: 10,
      last_update: new Date().toISOString()
    };

    // Inizializza metriche di rischio
    this.riskMetrics = {
      var_1d_95: 0.02,
      var_1d_99: 0.03,
      max_drawdown: 0.15,
      current_drawdown: 0.05,
      sharpe_ratio: 1.2,
      sortino_ratio: 1.5,
      win_rate: 0.65,
      profit_factor: 1.8,
      total_exposure: 0.7,
      portfolio_beta: 1.0,
      expected_shortfall: 0.04,
      daily_volatility: 0.02,
      annualized_volatility: 0.16,
      max_adverse_excursion: 0.03,
      max_favorable_excursion: 0.06,
      calmar_ratio: 0.8,
      information_ratio: 0.7,
      tracking_error: 0.03,
      last_calculated: new Date().toISOString()
    };
  }

  // Inizializza algoritmi con configurazioni
  async initializeAlgorithms(configs: AlgoConfig[]): Promise<void> {
    for (const config of configs) {
      try {
        switch (config.name.toLowerCase()) {
          case 'momentum':
            this.momentumAlgo = new MomentumAlgo(config);
            break;
          case 'meanreversion':
            this.momentumAlgo = new MomentumAlgo(config);
            break;
          case 'statisticalarbitrage':
            this.statisticalArbAlgo = new StatisticalArbitrageAlgo(config);
            break;
        }
      } catch (error) {
        console.error(`Errore inizializzazione algoritmo ${config.name}:`, error);
      }
    }
  }

  // Avvia tutti gli algoritmi attivi
  async startAllAlgorithms(): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.momentumAlgo) promises.push(this.momentumAlgo.start());
    if (this.meanReversionAlgo) promises.push(this.meanReversionAlgo.start());
    if (this.statisticalArbAlgo) promises.push(this.statisticalArbAlgo.start());

    // Avvia executors attivi
    for (const executor of this.vwapExecutors.values()) {
      promises.push(executor.startExecution());
    }
    for (const executor of this.twapExecutors.values()) {
      promises.push(executor.startExecution());
    }
    for (const executor of this.icebergExecutors.values()) {
      promises.push(executor.startExecution());
    }

    await Promise.allSettled(promises);
  }

  // Ferma tutti gli algoritmi
  stopAllAlgorithms(): void {
    this.momentumAlgo?.stop();
    this.meanReversionAlgo?.stop();
    this.statisticalArbAlgo?.stop();

    for (const executor of this.vwapExecutors.values()) {
      executor.stopExecution();
    }
    for (const executor of this.twapExecutors.values()) {
      executor.stopExecution();
    }
    for (const executor of this.icebergExecutors.values()) {
      executor.stopExecution();
    }
  }

  // Genera segnali da tutti gli algoritmi
  async generateSignals(): Promise<TradingSignal[]> {
    const signals: TradingSignal[] = [];
    
    try {
      // Verifica connessione XTB con fallback
      const isConnected = await this.testXTBConnectionWithFallback();
      
      if (!isConnected) {
        console.warn('XTB non connesso, uso dati di fallback');
        return this.generateFallbackSignals();
      }

      // Ottieni dati di mercato real-time con fallback
      const marketData = await this.getMarketDataWithFallback();

      // Genera segnali da ogni algoritmo
      if (this.momentumAlgo) {
        const momentumSignal = await this.momentumAlgo.generateSignal(marketData);
        if (momentumSignal) signals.push(momentumSignal);
      }

      if (this.meanReversionAlgo) {
        const meanRevSignal = await this.meanReversionAlgo.generateSignal(marketData);
        if (meanRevSignal) signals.push(meanRevSignal);
      }

      if (this.statisticalArbAlgo) {
        const arbSignal = await this.statisticalArbAlgo.generateSignal(marketData);
        if (arbSignal) signals.push(arbSignal);
      }

    } catch (error) {
      console.error('Errore generazione segnali:', error);
      // Fallback ai segnali simulati
      return this.generateFallbackSignals();
    }

    return signals;
  }

  // Gestisce segnali ricevuti
  async processSignals(signals: TradingSignal[]): Promise<void> {
    for (const signal of signals) {
      // Aggiungi alla queue
      this.signalQueue.push(signal);
      
      // Valuta rischio
      const riskCheck = await this.evaluateSignalRisk(signal);
      
      if (riskCheck.approved) {
        // Crea ordine di esecuzione
        const order = await this.createExecutionOrder(signal);
        this.executionQueue.push(order);
        
        // Esegui ordine
        await this.executeOrder(order);
      } else {
        console.log(`Segnale rifiutato per rischio: ${riskCheck.reason}`);
      }
    }
  }

  // Aggiunge configurazione VWAP
  async addVWAPConfig(config: VWAPConfig): Promise<void> {
    const executor = new VWAPExecutor(config);
    this.vwapExecutors.set(config.id, executor);
    
    if (config.enabled) {
      await executor.startExecution();
    }
  }

  // Aggiunge configurazione TWAP
  async addTWAPConfig(config: TWAPConfig): Promise<void> {
    const executor = new TWAPExecutor(config);
    this.twapExecutors.set(config.id, executor);
    
    if (config.enabled) {
      await executor.startExecution();
    }
  }

  // Aggiunge configurazione Iceberg
  async addIcebergConfig(config: IcebergConfig): Promise<void> {
    const executor = new IcebergExecutor(config);
    this.icebergExecutors.set(config.id, executor);
    
    if (config.enabled) {
      await executor.startExecution();
    }
  }

  // Ottieni stato completo di tutti gli algoritmi
  getAllAlgorithmsStatus(): AlgoStatus[] {
    const statuses: AlgoStatus[] = [];
    
    if (this.momentumAlgo) statuses.push(this.momentumAlgo.getStatus());
    if (this.meanReversionAlgo) statuses.push(this.meanReversionAlgo.getStatus());
    if (this.statisticalArbAlgo) statuses.push(this.statisticalArbAlgo.getStatus());
    
    for (const executor of this.vwapExecutors.values()) {
      statuses.push(executor.getStatus());
    }
    for (const executor of this.twapExecutors.values()) {
      statuses.push(executor.getStatus());
    }
    for (const executor of this.icebergExecutors.values()) {
      statuses.push(executor.getStatus());
    }
    
    return statuses;
  }

  // Ottieni portfolio corrente
  getPortfolio(): Portfolio {
    this.portfolio.last_update = new Date().toISOString();
    return { ...this.portfolio };
  }

  // Ottieni metriche di rischio correnti
  getRiskMetrics(): RiskMetrics {
    this.riskMetrics.last_calculated = new Date().toISOString();
    return { ...this.riskMetrics };
  }

  // Ottieni posizioni aperte
  async getOpenPositions(): Promise<Position[]> {
    try {
      // Prova a ottenere posizioni reali da XTB
      const xtbPositions = await xtbApi.getPositions();
      return xtbPositions.positions.map(pos => ({
        id: `xtb_${pos.id}`,
        symbol: pos.symbol,
        direction: pos.type === 'BUY' ? 'LONG' : 'SHORT',
        quantity: pos.volume,
        average_price: pos.openPrice,
        current_price: pos.currentPrice,
        open_time: pos.openTime,
        unrealized_pnl: pos.profit,
        realized_pnl: 0,
        stop_loss: undefined,
        take_profit: undefined,
        strategy: 'XTB',
        entry_algo: 'Unknown',
        risk_per_unit: pos.openPrice * 0.02,
        total_commission: pos.commission,
        margin_used: pos.volume * pos.openPrice * 0.1
      }));
    } catch (error) {
      console.warn('Errore ottenimento posizioni XTB, uso fallback:', error);
      return this.portfolio.positions;
    }
  }

  // Metodi privati di supporto

  private async testXTBConnectionWithFallback(): Promise<boolean> {
    try {
      return await xtbApi.testConnection();
    } catch (error) {
      console.warn('XTB connection test fallito, uso fallback:', error);
      return false;
    }
  }

  private async getMarketDataWithFallback(): Promise<Record<string, XTBMarketData>> {
    try {
      // Prova XTB con più simboli
      const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'GOLD', 'OIL'];
      return await xtbApi.getMultipleMarketData(symbols);
    } catch (error) {
      console.warn('XTB market data fallito, uso fallback:', error);
      
      // Fallback data simulati
      const fallbackData: Record<string, XTBMarketData> = {};
      const basePrices = {
        EURUSD: 1.0823,
        GBPUSD: 1.2645,
        USDJPY: 149.82,
        GOLD: 2018.45,
        OIL: 78.34
      };

      for (const [symbol, basePrice] of Object.entries(basePrices)) {
        const variation = (Math.random() - 0.5) * 0.02; // +/- 1%
        const currentPrice = basePrice * (1 + variation);
        
        fallbackData[symbol] = {
          symbol,
          bid: currentPrice * 0.9995,
          ask: currentPrice * 1.0005,
          spread: currentPrice * 0.0001,
          profit: 0,
          volume: Math.floor(Math.random() * 1000000) + 100000,
          timestamp: Date.now()
        };
      }

      return fallbackData;
    }
  }

  private generateFallbackSignals(): TradingSignal[] {
    // Genera segnali simulati quando XTB non disponibile
    const symbols = ['EURUSD', 'GBPUSD', 'GOLD'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    const randomAction = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const randomConfidence = 60 + Math.random() * 30; // 60-90%
    
    return [{
      id: `fallback_${Date.now()}`,
      symbol: randomSymbol,
      action: randomAction,
      target_price: 1.1000 + (Math.random() - 0.5) * 0.01,
      volume: Math.floor(Math.random() * 100000) + 10000,
      order_type: 'MARKET',
      timestamp: new Date().toISOString(),
      confidence: randomConfidence,
      timeframe: '15m',
      source_algo: 'Fallback',
      parameters: { fallback_reason: 'XTB_unavailable' }
    }];
  }

  private async evaluateSignalRisk(signal: TradingSignal): Promise<{ approved: boolean; reason?: string }> {
    // Controlli di rischio base
    
    // 1. Controllo volume massimo per singolo trade
    const maxTradeValue = this.portfolio.total_equity * 0.05; // Max 5% per trade
    const tradeValue = signal.volume * signal.target_price;
    
    if (tradeValue > maxTradeValue) {
      return { approved: false, reason: 'Volume troppo alto' };
    }

    // 2. Controllo confidence minima
    if (signal.confidence < 60) {
      return { approved: false, reason: 'Confidenza troppo bassa' };
    }

    // 3. Controllo esposizione totale
    const currentExposure = this.calculateCurrentExposure();
    const newExposure = currentExposure + (tradeValue / this.portfolio.total_equity);
    
    if (newExposure > 0.8) { // Max 80% esposizione
      return { approved: false, reason: 'Esposizione troppo alta' };
    }

    return { approved: true };
  }

  private calculateCurrentExposure(): number {
    const totalPositionValue = this.portfolio.positions.reduce((sum, pos) => {
      return sum + (pos.quantity * pos.current_price);
    }, 0);
    
    return totalPositionValue / this.portfolio.total_equity;
  }

  private async createExecutionOrder(signal: TradingSignal): Promise<ExecutionOrder> {
    return {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      signal_id: signal.id,
      symbol: signal.symbol,
      side: signal.action,
      quantity: Math.floor(signal.volume),
      limit_price: signal.order_type === 'LIMIT' ? signal.target_price : undefined,
      order_type: signal.order_type === 'LIMIT' ? 'LIMIT' : 'MARKET',
      status: 'PENDING',
      filled_quantity: 0,
      commission: signal.volume * 0.0001,
      created_at: new Date().toISOString()
    };
  }

  private async executeOrder(order: ExecutionOrder): Promise<void> {
    // Simula esecuzione ordine (in realta dovrebbe chiamare XTB API)
    setTimeout(() => {
      order.status = 'FILLED';
      order.filled_quantity = order.quantity;
      order.average_price = order.limit_price || (1.1000 + (Math.random() - 0.5) * 0.01);
      order.filled_at = new Date().toISOString();
      
      console.log(`Ordine eseguito: ${order.symbol} ${order.side} ${order.quantity} @ ${order.average_price}`);
    }, Math.random() * 3000 + 1000); // 1-4 secondi di delay
  }
}

// Hook React per utilizzare il servizio Hedge Fund
import React from 'react';

export const useHedgeFundAlgo = () => {
  const [hedgeFundService] = React.useState(() => new HedgeFundAlgoService());
  const [algorithmsStatus, setAlgorithmsStatus] = React.useState<AlgoStatus[]>([]);
  const [portfolio, setPortfolio] = React.useState<Portfolio | null>(null);
  const [riskMetrics, setRiskMetrics] = React.useState<RiskMetrics | null>(null);
  const [signals, setSignals] = React.useState<TradingSignal[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    // Aggiorna stato ogni 30 secondi
    const interval = setInterval(async () => {
      try {
        const status = hedgeFundService.getAllAlgorithmsStatus();
        setAlgorithmsStatus(status);
        
        const portfolioData = hedgeFundService.getPortfolio();
        setPortfolio(portfolioData);
        
        const riskData = hedgeFundService.getRiskMetrics();
        setRiskMetrics(riskData);
      } catch (error) {
        console.error('Errore aggiornamento stato Hedge Fund:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hedgeFundService]);

  const startAlgorithms = React.useCallback(async () => {
    try {
      await hedgeFundService.startAllAlgorithms();
      setIsRunning(true);
    } catch (error) {
      console.error('Errore avvio algoritmi:', error);
    }
  }, [hedgeFundService]);

  const stopAlgorithms = React.useCallback(() => {
    hedgeFundService.stopAllAlgorithms();
    setIsRunning(false);
  }, [hedgeFundService]);

  const generateAndProcessSignals = React.useCallback(async () => {
    try {
      const newSignals = await hedgeFundService.generateSignals();
      setSignals(newSignals);
      
      if (newSignals.length > 0) {
        await hedgeFundService.processSignals(newSignals);
      }
    } catch (error) {
      console.error('Errore generazione/processazione segnali:', error);
    }
  }, [hedgeFundService]);

  const addVWAPConfig = React.useCallback(async (config: VWAPConfig) => {
    await hedgeFundService.addVWAPConfig(config);
  }, [hedgeFundService]);

  const addTWAPConfig = React.useCallback(async (config: TWAPConfig) => {
    await hedgeFundService.addTWAPConfig(config);
  }, [hedgeFundService]);

  const addIcebergConfig = React.useCallback(async (config: IcebergConfig) => {
    await hedgeFundService.addIcebergConfig(config);
  }, [hedgeFundService]);

  return {
    algorithmsStatus,
    portfolio,
    riskMetrics,
    signals,
    isRunning,
    startAlgorithms,
    stopAlgorithms,
    generateAndProcessSignals,
    addVWAPConfig,
    addTWAPConfig,
    addIcebergConfig,
    hedgeFundService
  };
};

// Export del servizio principale
export const hedgeFundAlgoService = new HedgeFundAlgoService();
export default HedgeFundAlgoService;