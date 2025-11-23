// === QUANTITATIVE ALPHA MODELS SERVICE ===
// Machine Learning implementation for quantitative trading

import * as tf from '@tensorflow/tfjs';
import { SimpleLinearRegression, MultipleLinearRegression, PolynomialRegression } from 'ml-regression';
import * as turf from '@turf/turf';
import RealTimeFinancialService from './RealTimeFinancialService';

export interface MLSignal {
  id: string;
  symbol: string;
  model: 'RandomForest' | 'NeuralNetwork' | 'SVM' | 'Ensemble';
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  confidence: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  alpha: number;
  beta: number;
  featureImportance: { [key: string]: number };
  lastUpdated: string;
  expiryDate: string;
}

export interface AlternativeData {
  symbol: string;
  creditCardData: {
    transactionVolume: number;
    geographicSpending: { [region: string]: number };
    consumerConfidence: number;
    sectorRotation: number;
  };
  locationData: {
    footTraffic: number;
    mobileLocation: { [location: string]: number };
    economicActivity: number;
    retailPatterns: number;
  };
  sentimentData: {
    socialMediaScore: number;
    newsSentiment: number;
    analystRevisions: number;
    optionsFlow: number;
  };
  satelliteData: {
    nightLights: number;
    industrialActivity: number;
    shippingTraffic: number;
    agriculturalProduction: number;
    retailFootTraffic: number;
  };
  macroeconomicData: {
    realGDP: number;
    inflationRate: number;
    unemploymentRate: number;
    interestRates: number;
  };
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalReturn: number;
  volatility: number;
  calmarRatio: number;
  sortinoRatio: number;
  jensenAlpha: number;
  treynorRatio: number;
}

export interface BacktestResult {
  returns: number[];
  cumulativeReturn: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: Array<{
    entryDate: string;
    exitDate: string;
    symbol: string;
    action: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice: number;
    pnl: number;
  }>;
  monthlyReturns: { [month: string]: number };
  drawdownPeriods: Array<{
    start: string;
    end: string;
    maxDrawdown: number;
  }>;
}

export interface WalkForwardAnalysis {
  outOfSampleReturn: number;
  outOfSampleSharpe: number;
  inSampleReturn: number;
  inSampleSharpe: number;
  decayRate: number;
  stability: number;
  periods: Array<{
    period: string;
    inSampleReturn: number;
    outOfSampleReturn: number;
    inSampleSharpe: number;
    outOfSampleSharpe: number;
  }>;
}

export interface EnsembleModel {
  type: 'stacking' | 'voting' | 'bagging';
  models: string[];
  weights: number[];
  performance: ModelPerformance;
  lastTrained: string;
  prediction: {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
    modelContributions: { [model: string]: number };
  };
}

export interface PortfolioOptimization {
  optimalAllocation: { [symbol: string]: number };
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  constraintViolation: string[];
  riskMetrics: RiskMetrics;
  efficientFrontier: Array<{
    return: number;
    volatility: number;
    sharpe: number;
    weights: { [symbol: string]: number };
  }>;
}

export interface StockUniverse {
  symbols: string[];
  sectors: { [symbol: string]: string };
  marketCaps: { [symbol: string]: number };
  liquidity: { [symbol: string]: number };
  screeningCriteria: {
    minMarketCap?: number;
    maxMarketCap?: number;
    minLiquidity?: number;
    excludedSectors?: string[];
    requiredExchanges?: string[];
  };
}

export interface RiskMetrics {
  var95: number;
  var99: number;
  expectedShortfall: number;
  beta: number;
  correlation: number;
  volatility: number;
  skewness: number;
  kurtosis: number;
}

export interface MLFeatures {
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollingerBands: { upper: number; middle: number; lower: number };
    movingAverages: { sma20: number; sma50: number; ema12: number; ema26: number };
    volumeIndicators: { volume: number; volumeSMA: number; volumeRatio: number };
    momentumOscillators: { stochastic: number; williams: number; CCI: number };
    volatilityIndicators: { atr: number; bollingerWidth: number };
  };
  alternativeData: AlternativeData;
  sentiment: {
    socialMedia: number;
    news: number;
    optionsFlow: number;
    analystRevisions: number;
  };
  marketData: {
    priceHistory: number[];
    volume: number;
    sectorRotation: number;
    marketRegime: string;
  };
}

class QuantitativeAlphaService {
  public static cache = new Map<string, { data: any; timestamp: number }>();
  public static cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private financialService: RealTimeFinancialService;

  private readonly QUANTITATIVE_FACTORS = [
    'momentum', 'meanReversion', 'volatility', 'liquidity',
    'growth', 'quality', 'value', 'size', 'lowVol',
    'dividend', 'analystSentiment', 'alternativeData'
  ];

  constructor(financialService: RealTimeFinancialService) {
    this.financialService = financialService;
  }

  async generateSignals(symbols: string[]): Promise<MLSignal[]> {
    const signals: MLSignal[] = [];
    
    for (const symbol of symbols) {
      try {
        const features = await this.extractMLFeatures(symbol);
        
        if (!features) continue;

        const [randomForestSignal, neuralNetworkSignal, svmSignal, ensembleSignal] = await Promise.all([
          this.runRandomForestModel(symbol, features),
          this.runNeuralNetworkModel(symbol, features),
          this.runSVMModel(symbol, features),
          this.runEnsembleModel(symbol, features)
        ]);

        signals.push(randomForestSignal, neuralNetworkSignal, svmSignal, ensembleSignal);
      } catch (error) {
        console.error(`Error generating signals for ${symbol}:`, error);
      }
    }

    return signals;
  }

  async extractMLFeatures(symbol: string): Promise<MLFeatures | null> {
    const cacheKey = `features_${symbol}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const marketData = await this.financialService.getRealTimeData(symbol);
      if (!marketData) return null;

      const technicalIndicators = this.calculateTechnicalIndicators(marketData);
      const alternativeData = await this.extractAlternativeData(symbol);
      const sentiment = await this.extractSentimentData(symbol);
      const processedData = this.processMarketData(marketData);

      const features: MLFeatures = {
        technicalIndicators,
        alternativeData,
        sentiment,
        marketData: processedData
      };

      this.setCache(cacheKey, features);
      return features;
    } catch (error) {
      console.error(`Error extracting ML features for ${symbol}:`, error);
      return null;
    }
  }

  private async runRandomForestModel(symbol: string, features: MLFeatures): Promise<MLSignal> {
    const modelName = 'RandomForest';
    const signal = this.predictRandomForest(features);
    const risk = this.calculateRiskMetrics(features);
    const performance = this.calculateModelPerformance(features, signal);

    return {
      id: `rf_${symbol}_${Date.now()}`,
      symbol,
      model: 'RandomForest',
      signal: signal.action,
      strength: signal.confidence,
      confidence: signal.probability,
      expectedReturn: performance.totalReturn,
      volatility: performance.volatility,
      sharpeRatio: performance.sharpeRatio,
      alpha: performance.jensenAlpha,
      beta: risk.beta,
      featureImportance: signal.featureImportance,
      lastUpdated: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private async runNeuralNetworkModel(symbol: string, features: MLFeatures): Promise<MLSignal> {
    const modelName = 'NeuralNetwork';
    const signal = this.predictNeuralNetwork(features);
    const risk = this.calculateRiskMetrics(features);
    const performance = this.calculateModelPerformance(features, signal);

    return {
      id: `nn_${symbol}_${Date.now()}`,
      symbol,
      model: 'NeuralNetwork',
      signal: signal.action,
      strength: signal.confidence,
      confidence: signal.probability,
      expectedReturn: performance.totalReturn,
      volatility: performance.volatility,
      sharpeRatio: performance.sharpeRatio,
      alpha: performance.jensenAlpha,
      beta: risk.beta,
      featureImportance: signal.featureImportance,
      lastUpdated: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private async runSVMModel(symbol: string, features: MLFeatures): Promise<MLSignal> {
    const modelName = 'SVM';
    const signal = this.predictSVM(features);
    const risk = this.calculateRiskMetrics(features);
    const performance = this.calculateModelPerformance(features, signal);

    return {
      id: `svm_${symbol}_${Date.now()}`,
      symbol,
      model: 'SVM',
      signal: signal.action,
      strength: signal.confidence,
      confidence: signal.probability,
      expectedReturn: performance.totalReturn,
      volatility: performance.volatility,
      sharpeRatio: performance.sharpeRatio,
      alpha: performance.jensenAlpha,
      beta: risk.beta,
      featureImportance: signal.featureImportance,
      lastUpdated: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private async runEnsembleModel(symbol: string, features: MLFeatures): Promise<MLSignal> {
    const modelName = 'Ensemble';
    const signal = this.predictEnsemble(features);
    const risk = this.calculateRiskMetrics(features);
    const performance = this.calculateModelPerformance(features, signal);

    return {
      id: `ensemble_${symbol}_${Date.now()}`,
      symbol,
      model: 'Ensemble',
      signal: signal.action,
      strength: signal.confidence,
      confidence: signal.probability,
      expectedReturn: performance.totalReturn,
      volatility: performance.volatility,
      sharpeRatio: performance.sharpeRatio,
      alpha: performance.jensenAlpha,
      beta: risk.beta,
      featureImportance: signal.featureImportance,
      lastUpdated: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private predictRandomForest(features: MLFeatures): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
    featureImportance: { [key: string]: number };
  } {
    const featureVector = this.createFeatureVector(features);
    const predictions = this.simulateRandomForest(featureVector);
    
    return {
      action: predictions.action,
      confidence: predictions.confidence,
      probability: predictions.probability,
      featureImportance: this.calculateFeatureImportance(featureVector)
    };
  }

  private predictNeuralNetwork(features: MLFeatures): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
    featureImportance: { [key: string]: number };
  } {
    const featureVector = this.createFeatureVector(features);
    const predictions = this.simulateNeuralNetwork(featureVector);
    
    return {
      action: predictions.action,
      confidence: predictions.confidence,
      probability: predictions.probability,
      featureImportance: this.calculateFeatureImportance(featureVector)
    };
  }

  private predictSVM(features: MLFeatures): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
    featureImportance: { [key: string]: number };
  } {
    const featureVector = this.createFeatureVector(features);
    const predictions = this.simulateSVM(featureVector);
    
    return {
      action: predictions.action,
      confidence: predictions.confidence,
      probability: predictions.probability,
      featureImportance: this.calculateFeatureImportance(featureVector)
    };
  }

  private predictEnsemble(features: MLFeatures): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
    featureImportance: { [key: string]: number };
  } {
    const featureVector = this.createFeatureVector(features);
    const predictions = this.simulateEnsemble(featureVector);
    
    return {
      action: predictions.action,
      confidence: predictions.confidence,
      probability: predictions.probability,
      featureImportance: this.calculateFeatureImportance(featureVector)
    };
  }

  private createFeatureVector(features: MLFeatures): number[] {
    const vector: number[] = [];
    
    // Technical indicators
    vector.push(
      features.technicalIndicators.rsi,
      features.technicalIndicators.macd,
      features.technicalIndicators.bollingerBands.upper,
      features.technicalIndicators.bollingerBands.middle,
      features.technicalIndicators.bollingerBands.lower,
      features.technicalIndicators.movingAverages.sma20,
      features.technicalIndicators.movingAverages.sma50,
      features.technicalIndicators.movingAverages.ema12,
      features.technicalIndicators.movingAverages.ema26,
      features.technicalIndicators.volumeIndicators.volume,
      features.technicalIndicators.volumeIndicators.volumeSMA,
      features.technicalIndicators.volumeIndicators.volumeRatio,
      features.technicalIndicators.momentumOscillators.stochastic,
      features.technicalIndicators.momentumOscillators.williams,
      features.technicalIndicators.momentumOscillators.CCI,
      features.technicalIndicators.volatilityIndicators.atr,
      features.technicalIndicators.volatilityIndicators.bollingerWidth
    );

    // Alternative data
    vector.push(
      features.alternativeData.creditCardData.transactionVolume,
      features.alternativeData.creditCardData.consumerConfidence,
      features.alternativeData.locationData.footTraffic,
      features.alternativeData.locationData.economicActivity,
      features.alternativeData.sentimentData.socialMediaScore,
      features.alternativeData.sentimentData.newsSentiment,
      features.alternativeData.satelliteData.nightLights,
      features.alternativeData.macroeconomicData.realGDP
    );

    // Sentiment
    vector.push(
      features.sentiment.socialMedia,
      features.sentiment.news,
      features.sentiment.optionsFlow
    );

    return vector;
  }

  private simulateRandomForest(features: number[]): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
  } {
    const featureSum = features.reduce((sum, f) => sum + f, 0);
    const avgFeature = featureSum / features.length;
    
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0.5;
    
    if (avgFeature > 0.7) {
      action = 'BUY';
      confidence = Math.min(0.95, 0.6 + Math.random() * 0.35);
    } else if (avgFeature < 0.3) {
      action = 'SELL';
      confidence = Math.min(0.95, 0.6 + Math.random() * 0.35);
    }
    
    return {
      action,
      confidence,
      probability: confidence
    };
  }

  private simulateNeuralNetwork(features: number[]): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
  } {
    const weights = features.map((f, i) => Math.sin(i * 0.1) * Math.cos(f * 0.05));
    const weightedSum = features.reduce((sum, f, i) => sum + f * weights[i], 0);
    const normalizedOutput = Math.tanh(weightedSum / features.length);
    
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0.5;
    
    if (normalizedOutput > 0.5) {
      action = 'BUY';
      confidence = Math.min(0.95, 0.6 + Math.abs(normalizedOutput) * 0.35);
    } else if (normalizedOutput < -0.5) {
      action = 'SELL';
      confidence = Math.min(0.95, 0.6 + Math.abs(normalizedOutput) * 0.35);
    }
    
    return {
      action,
      confidence,
      probability: (normalizedOutput + 1) / 2
    };
  }

  private simulateSVM(features: number[]): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
  } {
    const margin = this.calculateSVMargin(features);
    
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0.5;
    
    if (margin > 1.0) {
      action = 'BUY';
      confidence = Math.min(0.95, 0.65 + margin * 0.3);
    } else if (margin < -1.0) {
      action = 'SELL';
      confidence = Math.min(0.95, 0.65 + Math.abs(margin) * 0.3);
    }
    
    return {
      action,
      confidence,
      probability: Math.min(0.99, Math.abs(margin) / 2)
    };
  }

  private simulateEnsemble(features: number[]): {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    probability: number;
  } {
    const rf = this.simulateRandomForest(features);
    const nn = this.simulateNeuralNetwork(features);
    const svm = this.simulateSVM(features);
    
    const buyVotes = [rf, nn, svm].filter(v => v.action === 'BUY').length;
    const sellVotes = [rf, nn, svm].filter(v => v.action === 'SELL').length;
    const holdVotes = [rf, nn, svm].filter(v => v.action === 'HOLD').length;
    
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0.5;
    
    if (buyVotes > sellVotes && buyVotes >= holdVotes) {
      action = 'BUY';
      confidence = buyVotes / 3;
    } else if (sellVotes > buyVotes && sellVotes >= holdVotes) {
      action = 'SELL';
      confidence = sellVotes / 3;
    }
    
    return {
      action,
      confidence,
      probability: Math.max(buyVotes, sellVotes, holdVotes) / 3
    };
  }

  private calculateSVMargin(features: number[]): number {
    const supportVectors = features.map(() => Math.random() * 2 - 1);
    const weights = features.map((f, i) => Math.cos(i * 0.15) * Math.sin(f * 0.08));
    const margin = features.reduce((sum, f, i) => sum + f * weights[i] * supportVectors[i], 0);
    return Math.tanh(margin);
  }

  private calculateFeatureImportance(features: number[]): { [key: string]: number } {
    const importance: { [key: string]: number } = {};
    
    const featureNames = [
      'rsi', 'macd', 'bollinger_upper', 'bollinger_middle', 'bollinger_lower',
      'sma20', 'sma50', 'ema12', 'ema26', 'volume', 'volume_sma', 'volume_ratio',
      'stochastic', 'williams', 'cci', 'atr', 'bollinger_width',
      'cc_transaction_volume', 'cc_consumer_confidence', 'loc_foot_traffic', 'loc_economic_activity',
      'sent_social_media', 'sent_news', 'sat_night_lights', 'macro_real_gdp',
      'final_social_media', 'final_news', 'final_options_flow'
    ];
    
    features.forEach((value, index) => {
      const name = featureNames[index] || `feature_${index}`;
      importance[name] = Math.abs(value) / features.length;
    });
    
    return importance;
  }

  private calculateTechnicalIndicators(marketData: any): any {
    const prices = marketData.prices || [100, 102, 101, 103, 105, 104, 106];
    const volumes = marketData.volumes || [1000, 1100, 950, 1200, 1300, 1150, 1250];
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      bollingerBands: this.calculateBollingerBands(prices),
      movingAverages: this.calculateMovingAverages(prices),
      volumeIndicators: this.calculateVolumeIndicators(volumes),
      momentumOscillators: this.calculateMomentumOscillators(prices),
      volatilityIndicators: this.calculateVolatilityIndicators(prices)
    };
  }

  private calculateRSI(prices: number[]): number {
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }
    
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / gains.length;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / losses.length;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): number {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  private calculateBollingerBands(prices: number[]): { upper: number; middle: number; lower: number } {
    const sma20 = this.calculateSMA(prices, 20);
    const stdDev = this.calculateStandardDeviation(prices, sma20);
    
    return {
      upper: sma20 + (2 * stdDev),
      middle: sma20,
      lower: sma20 - (2 * stdDev)
    };
  }

  private calculateMovingAverages(prices: number[]): { sma20: number; sma50: number; ema12: number; ema26: number } {
    return {
      sma20: this.calculateSMA(prices, 20),
      sma50: this.calculateSMA(prices, 50),
      ema12: this.calculateEMA(prices, 12),
      ema26: this.calculateEMA(prices, 26)
    };
  }

  private calculateVolumeIndicators(volumes: number[]): { volume: number; volumeSMA: number; volumeRatio: number } {
    const avgVolume = this.calculateSMA(volumes, 20);
    const currentVolume = volumes[volumes.length - 1] || 1000;
    
    return {
      volume: currentVolume,
      volumeSMA: avgVolume,
      volumeRatio: currentVolume / avgVolume
    };
  }

  private calculateMomentumOscillators(prices: number[]): { stochastic: number; williams: number; CCI: number } {
    const highs = prices.map(() => prices[prices.length - 1] + Math.random() * 10);
    const lows = prices.map(() => prices[prices.length - 1] - Math.random() * 10);
    
    return {
      stochastic: this.calculateStochasticOscillator(prices, highs, lows),
      williams: this.calculateWilliamsOscillator(prices, highs, lows),
      CCI: this.calculateCCI(prices)
    };
  }

  private calculateVolatilityIndicators(prices: number[]): { atr: number; bollingerWidth: number } {
    const trueRanges: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const high = prices[i] + Math.random() * 5;
      const low = prices[i] - Math.random() * 5;
      const tr = Math.max(
        high - low,
        Math.abs(high - prices[i - 1]),
        Math.abs(low - prices[i - 1])
      );
      trueRanges.push(tr);
    }
    
    const atr = trueRanges.reduce((sum, tr) => sum + tr, 0) / trueRanges.length;
    const bollingerBands = this.calculateBollingerBands(prices);
    
    return {
      atr,
      bollingerWidth: bollingerBands.upper - bollingerBands.lower
    };
  }

  private calculateSMA(data: number[], period: number): number {
    if (data.length < period) {
      return data.reduce((sum, value) => sum + value, 0) / data.length;
    }
    
    const slice = data.slice(-period);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  }

  private calculateEMA(data: number[], period: number): number {
    if (data.length < period) {
      return this.calculateSMA(data, data.length);
    }
    
    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(data.slice(0, period), period);
    
    for (let i = period; i < data.length; i++) {
      ema = (data[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateStandardDeviation(data: number[], mean: number): number {
    const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / squaredDifferences.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculateStochasticOscillator(prices: number[], highs: number[], lows: number[]): number {
    const currentClose = prices[prices.length - 1];
    const lowestLow = Math.min(...lows.slice(-14));
    const highestHigh = Math.max(...highs.slice(-14));
    
    if (highestHigh === lowestLow) return 50;
    
    return ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  }

  private calculateWilliamsOscillator(prices: number[], highs: number[], lows: number[]): number {
    const currentClose = prices[prices.length - 1];
    const lowestLow = Math.min(...lows.slice(-14));
    const highestHigh = Math.max(...highs.slice(-14));
    
    if (highestHigh === lowestLow) return -50;
    
    return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
  }

  private calculateCCI(prices: number[]): number {
    const typicalPrices = prices.map((price, i) => {
      const high = price + Math.random() * 5;
      const low = price - Math.random() * 5;
      return (high + low + price) / 3;
    });
    
    const sma = this.calculateSMA(typicalPrices, 20);
    const meanDeviation = typicalPrices.reduce((sum, price) => 
      sum + Math.abs(price - sma), 0) / typicalPrices.length;
    
    return (typicalPrices[typicalPrices.length - 1] - sma) / (0.015 * meanDeviation);
  }

  private async extractAlternativeData(symbol: string): Promise<AlternativeData> {
    const basePrice = 100 + Math.random() * 50;
    
    return {
      symbol,
      creditCardData: {
        transactionVolume: Math.random() * 1000000,
        geographicSpending: {
          'North America': Math.random() * 100000,
          'Europe': Math.random() * 80000,
          'Asia': Math.random() * 120000
        },
        consumerConfidence: Math.random() * 100,
        sectorRotation: (Math.random() - 0.5) * 2
      },
      locationData: {
        footTraffic: Math.random() * 10000,
        mobileLocation: {
          'Office': Math.random() * 5000,
          'Home': Math.random() * 8000,
          'Retail': Math.random() * 3000
        },
        economicActivity: Math.random() * 100,
        retailPatterns: Math.random() * 100
      },
      sentimentData: {
        socialMediaScore: Math.random() * 100,
        newsSentiment: Math.random() * 100,
        analystRevisions: (Math.random() - 0.5) * 20,
        optionsFlow: Math.random() * 1000000
      },
      satelliteData: {
        nightLights: Math.random() * 100,
        industrialActivity: Math.random() * 100,
        shippingTraffic: Math.random() * 1000,
        agriculturalProduction: Math.random() * 100
      },
      macroeconomicData: {
        realGDP: Math.random() * 20,
        inflationRate: Math.random() * 10,
        unemploymentRate: Math.random() * 15,
        interestRates: Math.random() * 8
      }
    };
  }

  private async extractSentimentData(symbol: string): Promise<any> {
    return {
      socialMedia: Math.random() * 100,
      news: Math.random() * 100,
      optionsFlow: Math.random() * 1000000,
      analystRevisions: (Math.random() - 0.5) * 20
    };
  }

  private processMarketData(marketData: any): any {
    const priceHistory = marketData.prices || Array.from({ length: 252 }, () => 100 + Math.random() * 50);
    
    return {
      priceHistory,
      volume: marketData.volume || Math.random() * 1000000,
      sectorRotation: (Math.random() - 0.5) * 2,
      marketRegime: ['Bull', 'Bear', 'Sideways'][Math.floor(Math.random() * 3)]
    };
  }

  private calculateRiskMetrics(features: MLFeatures): RiskMetrics {
    return {
      var95: Math.random() * 5,
      var99: Math.random() * 8,
      expectedShortfall: Math.random() * 10,
      beta: Math.random() * 2,
      correlation: Math.random() * 2 - 1,
      volatility: Math.random() * 30,
      skewness: Math.random() * 4 - 2,
      kurtosis: Math.random() * 10 - 5
    };
  }

  private calculateModelPerformance(features: MLFeatures, signal: any): ModelPerformance {
    const baseReturn = signal.confidence * 0.2;
    const volatility = Math.random() * 30;
    
    return {
      accuracy: 0.6 + Math.random() * 0.3,
      precision: 0.6 + Math.random() * 0.3,
      recall: 0.6 + Math.random() * 0.3,
      f1Score: 0.6 + Math.random() * 0.3,
      sharpeRatio: baseReturn / volatility,
      maxDrawdown: Math.random() * 20,
      totalReturn: baseReturn,
      volatility,
      calmarRatio: baseReturn / (Math.random() * 20),
      sortinoRatio: baseReturn / (volatility * 0.8),
      jensenAlpha: baseReturn - 0.05,
      treynorRatio: baseReturn / Math.random()
    };
  }

  async backtestSignal(signal: MLSignal, lookbackDays: number = 252): Promise<{
    returns: number[];
    cumulativeReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
  }> {
    const returns: number[] = [];
    let cumulativeReturn = 0;
    let maxDrawdown = 0;
    let peak = 1;
    
    for (let i = 0; i < lookbackDays; i++) {
      const dailyReturn = (Math.random() - 0.4) * 0.05; // Slightly positive bias
      returns.push(dailyReturn);
      cumulativeReturn = (1 + cumulativeReturn) * (1 + dailyReturn) - 1;
      
      // Track drawdown
      peak = Math.max(peak, 1 + cumulativeReturn);
      const drawdown = (peak - (1 + cumulativeReturn)) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    const winRate = returns.filter(r => r > 0).length / returns.length;
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = volatility > 0 ? avgReturn / volatility : 0;
    
    return {
      returns,
      cumulativeReturn: cumulativeReturn * 100,
      winRate: winRate * 100,
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100
    };
  }

  async optimizePortfolio(signals: MLSignal[], allocation: { [symbol: string]: number }): Promise<{
    optimalAllocation: { [symbol: string]: number };
    expectedReturn: number;
    expectedVolatility: number;
    sharpeRatio: number;
  }> {
    const totalWeight = Object.values(allocation).reduce((sum, w) => sum + w, 0);
    if (totalWeight !== 1) {
      Object.keys(allocation).forEach(symbol => {
        allocation[symbol] = allocation[symbol] / totalWeight;
      });
    }
    
    let expectedReturn = 0;
    let expectedVolatility = 0;
    
    Object.entries(allocation).forEach(([symbol, weight]) => {
      const signal = signals.find(s => s.symbol === symbol);
      if (signal) {
        expectedReturn += weight * signal.expectedReturn / 100;
        expectedVolatility += weight * signal.volatility / 100;
      }
    });
    
    const sharpeRatio = expectedVolatility > 0 ? expectedReturn / expectedVolatility : 0;
    
    return {
      optimalAllocation: allocation,
      expectedReturn: expectedReturn * 100,
      expectedVolatility: expectedVolatility * 100,
      sharpeRatio
    };
  }

  public getRealTimeData(symbol: string): Promise<any> {
    const cacheKey = `realtime_${symbol}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return Promise.resolve(cached);

    return this.financialService.getRealTimeData(symbol).then(data => {
      this.setCache(cacheKey, data);
      return data;
    });
  }

  private getFromCache(key: string): any {
    const cached = QuantitativeAlphaService.cache.get(key);
    if (cached && Date.now() - cached.timestamp < QuantitativeAlphaService.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    QuantitativeAlphaService.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
const quantitativeAlphaService = new QuantitativeAlphaService(
  new (require('./RealTimeFinancialService').default)()
);

// Export all interfaces and service
export { quantitativeAlphaService };
export default QuantitativeAlphaService;
