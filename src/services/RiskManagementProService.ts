// Risk Management Pro Service - Stile Goldman Sachs
// Calcoli avanzati per Value at Risk, Stress Testing, Correlation Analysis, Portfolio Attribution, Liquidity Risk, Counterparty Risk

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  price: number;
  weight: number;
  sector: string;
  assetClass: string;
  beta: number;
  volatility: number;
  correlationMatrix?: number[][];
}

export interface VaRMetrics {
  historicalVaR: {
    oneDay: number;
    tenDay: number;
    confidenceLevel: number;
  };
  parametricVaR: {
    oneDay: number;
    tenDay: number;
    method: string;
  };
  monteCarloVaR: {
    oneDay: number;
    confidenceLevel: number;
    simulations: number;
  };
  cvar: {
    expectedShortfall: number;
    conditionalVaR: number;
  };
  componentVaR: {
    [symbol: string]: number;
  };
}

export interface StressTestScenario {
  name: string;
  description: string;
  marketShock: {
    equityDrop: number;
    bondYields: number;
    creditSpreads: number;
    fxImpact: number;
    commodities: number;
  };
  portfolioImpact: {
    totalLoss: number;
    percentageLoss: number;
    positions: Array<{
      symbol: string;
      loss: number;
      impact: string;
    }>;
  };
  probability: number;
  historicalAnalog?: string;
}

export interface CorrelationMatrix {
  symbols: string[];
  matrix: number[][];
  eigenvalues: number[];
  eigenvectors: number[][];
  concentrationRisk: number;
  diversificationRatio: number;
}

export interface RiskAttribution {
  factorContributions: {
    [factor: string]: {
      contribution: number;
      percentage: number;
      explanation: string;
    };
  };
  sectorAttribution: {
    [sector: string]: {
      contribution: number;
      percentage: number;
    };
  };
  assetClassAttribution: {
    [assetClass: string]: {
      contribution: number;
      percentage: number;
    };
  };
}

export interface LiquidityRisk {
  assetLiquidity: {
    [symbol: string]: {
      bidAskSpread: number;
      dailyVolume: number;
      volumeToMarketCap: number;
      timeToLiquidate: number;
      liquidityScore: number;
    };
  };
  portfolioLiquidity: {
    averageSpread: number;
    timeToLiquidatePortfolio: number;
    liquidityRiskScore: number;
    stressLiquidity: number;
  };
}

export interface CounterpartyRisk {
  exposures: {
    [counterparty: string]: {
      currentExposure: number;
      potentialFutureExposure: number;
      creditRating: string;
      probabilityOfDefault: number;
      lossGivenDefault: number;
      expectedLoss: number;
    };
  };
  portfolioMetrics: {
    totalExposure: number;
    weightedPD: number;
    portfolioExpectedLoss: number;
    concentrationRisk: number;
  };
}

export interface BacktestResult {
  strategy: string;
  period: string;
  totalReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  varHistory: number[];
  dailyReturns: number[];
}

export class RiskManagementProService {
  private static readonly RISK_FREE_RATE = 0.045; // 4.5% T-Bill rate
  private static readonly MARKET_VOLATILITY = 0.16; // SPY volatility proxy
  private static readonly TRADING_DAYS_PER_YEAR = 252;
  private static readonly CONFIDENCE_LEVEL_95 = 0.95;
  private static readonly CONFIDENCE_LEVEL_99 = 0.99;

  /**
   * Calculate Value at Risk (VaR) using multiple methodologies
   */
  static calculateVaR(positions: PortfolioPosition[], returns: number[][]): VaRMetrics {
    const portfolioValues = this.calculatePortfolioValues(positions);
    const portfolioReturns = this.calculatePortfolioReturns(returns, positions);
    
    // Historical VaR
    const historicalVaR = this.calculateHistoricalVaR(portfolioReturns, portfolioValues);
    
    // Parametric VaR (Variance-Covariance)
    const parametricVaR = this.calculateParametricVaR(portfolioReturns, portfolioValues);
    
    // Monte Carlo VaR
    const monteCarloVaR = this.calculateMonteCarloVaR(portfolioReturns, portfolioValues);
    
    // Expected Shortfall (CVaR)
    const cvar = this.calculateExpectedShortfall(portfolioReturns, portfolioValues);
    
    // Component VaR
    const componentVaR = this.calculateComponentVaR(positions, returns);

    return {
      historicalVaR,
      parametricVaR,
      monteCarloVaR,
      cvar,
      componentVaR
    };
  }

  /**
   * Generate comprehensive stress test scenarios
   */
  static generateStressTestScenarios(positions: PortfolioPosition[]): StressTestScenario[] {
    return [
      {
        name: "2008 Financial Crisis",
        description: "Severe credit crisis with equity market collapse",
        marketShock: {
          equityDrop: -37.0,
          bondYields: 2.15,
          creditSpreads: 800,
          fxImpact: -15.0,
          commodities: -35.0
        },
        portfolioImpact: this.calculateStressImpact(positions, {
          equityDrop: -37.0, bondYields: 2.15, creditSpreads: 800, fxImpact: -15.0, commodities: -35.0
        }),
        probability: 0.05,
        historicalAnalog: "Lehman Brothers Collapse, Sept 2008"
      },
      {
        name: "COVID-19 Market Crash",
        description: "Pandemic-driven market volatility and recession",
        marketShock: {
          equityDrop: -34.0,
          bondYields: 0.7,
          creditSpreads: 400,
          fxImpact: -8.0,
          commodities: -25.0
        },
        portfolioImpact: this.calculateStressImpact(positions, {
          equityDrop: -34.0, bondYields: 0.7, creditSpreads: 400, fxImpact: -8.0, commodities: -25.0
        }),
        probability: 0.08,
        historicalAnalog: "March 2020 COVID crash"
      },
      {
        name: "Flash Crash Scenario",
        description: "Extreme intraday volatility and liquidity crisis",
        marketShock: {
          equityDrop: -15.0,
          bondYields: 1.5,
          creditSpreads: 200,
          fxImpact: -5.0,
          commodities: -10.0
        },
        portfolioImpact: this.calculateStressImpact(positions, {
          equityDrop: -15.0, bondYields: 1.5, creditSpreads: 200, fxImpact: -5.0, commodities: -10.0
        }),
        probability: 0.15,
        historicalAnalog: "May 6, 2010 Flash Crash"
      },
      {
        name: "Geopolitical Crisis",
        description: "Major geopolitical event affecting global markets",
        marketShock: {
          equityDrop: -20.0,
          bondYields: 2.5,
          creditSpreads: 300,
          fxImpact: -12.0,
          commodities: -30.0
        },
        portfolioImpact: this.calculateStressImpact(positions, {
          equityDrop: -20.0, bondYields: 2.5, creditSpreads: 300, fxImpact: -12.0, commodities: -30.0
        }),
        probability: 0.12,
        historicalAnalog: "Gulf War 1991, 9/11 attacks"
      },
      {
        name: "Interest Rate Shock",
        description: "Rapid interest rate increase scenario",
        marketShock: {
          equityDrop: -18.0,
          bondYields: 3.5,
          creditSpreads: 150,
          fxImpact: -6.0,
          commodities: -8.0
        },
        portfolioImpact: this.calculateStressImpact(positions, {
          equityDrop: -18.0, bondYields: 3.5, creditSpreads: 150, fxImpact: -6.0, commodities: -8.0
        }),
        probability: 0.10,
        historicalAnalog: "Volcker Shock 1979-1982"
      }
    ];
  }

  /**
   * Calculate correlation matrix with advanced metrics
   */
  static calculateCorrelationMatrix(returns: number[][], symbols: string[]): CorrelationMatrix {
    const nAssets = returns.length;
    const correlationMatrix: number[][] = Array(nAssets).fill(null).map(() => Array(nAssets).fill(0));
    
    // Calculate correlation matrix
    for (let i = 0; i < nAssets; i++) {
      for (let j = 0; j < nAssets; j++) {
        correlationMatrix[i][j] = this.calculateCorrelation(returns[i], returns[j]);
      }
    }
    
    // Calculate eigenvalues for concentration risk analysis
    const eigenvalues = this.calculateEigenvalues(correlationMatrix);
    
    // Calculate concentration risk metrics
    const concentrationRisk = this.calculateConcentrationRisk(eigenvalues);
    const diversificationRatio = this.calculateDiversificationRatio(correlationMatrix);

    return {
      symbols,
      matrix: correlationMatrix,
      eigenvalues,
      eigenvectors: [], // Simplified for performance
      concentrationRisk,
      diversificationRatio
    };
  }

  /**
   * Perform portfolio risk attribution analysis
   */
  static performRiskAttribution(positions: PortfolioPosition[]): RiskAttribution {
    const factorContributions = this.calculateFactorContributions(positions);
    const sectorAttribution = this.calculateSectorAttribution(positions);
    const assetClassAttribution = this.calculateAssetClassAttribution(positions);

    return {
      factorContributions,
      sectorAttribution,
      assetClassAttribution
    };
  }

  /**
   * Assess liquidity risk across portfolio
   */
  static assessLiquidityRisk(positions: PortfolioPosition[]): LiquidityRisk {
    const assetLiquidity: { [symbol: string]: any } = {};
    
    positions.forEach(position => {
      const bidAskSpread = this.estimateBidAskSpread(position.symbol, position.assetClass);
      const dailyVolume = this.estimateDailyVolume(position.symbol);
      const marketCap = position.price * position.quantity;
      const volumeToMarketCap = dailyVolume / marketCap;
      const timeToLiquidate = this.calculateTimeToLiquidate(position.quantity, dailyVolume);
      const liquidityScore = this.calculateLiquidityScore(bidAskSpread, volumeToMarketCap, timeToLiquidate);
      
      assetLiquidity[position.symbol] = {
        bidAskSpread,
        dailyVolume,
        volumeToMarketCap,
        timeToLiquidate,
        liquidityScore
      };
    });

    const portfolioLiquidity = this.calculatePortfolioLiquidity(assetLiquidity);

    return {
      assetLiquidity,
      portfolioLiquidity
    };
  }

  /**
   * Analyze counterparty risk exposures
   */
  static analyzeCounterpartyRisk(positions: PortfolioPosition[]): CounterpartyRisk {
    const exposures: { [counterparty: string]: any } = {};
    
    // Simulate counterparty exposures
    const counterparties = ['Goldman Sachs', 'JPMorgan', 'Citigroup', 'Bank of America', 'Morgan Stanley'];
    
    counterparties.forEach((counterparty, index) => {
      const currentExposure = Math.random() * 10000000 + 5000000; // $5M - $15M
      const potentialFutureExposure = currentExposure * (1.2 + Math.random() * 0.5);
      const creditRating = ['AAA', 'AA', 'A', 'BBB', 'BB'][Math.floor(Math.random() * 5)];
      const probabilityOfDefault = this.getPDFromRating(creditRating);
      const lossGivenDefault = 0.45 + Math.random() * 0.25; // 45% - 70%
      const expectedLoss = currentExposure * probabilityOfDefault * lossGivenDefault;
      
      exposures[counterparty] = {
        currentExposure,
        potentialFutureExposure,
        creditRating,
        probabilityOfDefault,
        lossGivenDefault,
        expectedLoss
      };
    });

    const portfolioMetrics = this.calculatePortfolioCounterpartyMetrics(exposures);

    return {
      exposures,
      portfolioMetrics
    };
  }

  /**
   * Run comprehensive backtesting engine
   */
  static runBacktesting(strategy: string, returns: number[][], positions: PortfolioPosition[]): BacktestResult {
    const portfolioReturns = this.calculatePortfolioReturns(returns, positions);
    const totalReturn = this.calculateTotalReturn(portfolioReturns);
    const volatility = this.calculateAnnualizedVolatility(portfolioReturns);
    const sharpeRatio = this.calculateSharpeRatio(portfolioReturns);
    const maxDrawdown = this.calculateMaxDrawdown(portfolioReturns);
    const winRate = this.calculateWinRate(portfolioReturns);
    const profitFactor = this.calculateProfitFactor(portfolioReturns);
    const varHistory = this.calculateVaRSeries(portfolioReturns);

    return {
      strategy,
      period: "12 mesi",
      totalReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      winRate,
      profitFactor,
      varHistory,
      dailyReturns: portfolioReturns
    };
  }

  // Private helper methods

  private static calculatePortfolioValues(positions: PortfolioPosition[]): number[] {
    return positions.map(pos => pos.quantity * pos.price);
  }

  private static calculatePortfolioReturns(returns: number[][], positions: PortfolioPosition[]): number[] {
    if (returns.length !== positions.length) {
      throw new Error("Returns array length must match positions length");
    }

    const nPeriods = returns[0].length;
    const portfolioReturns: number[] = [];

    for (let t = 0; t < nPeriods; t++) {
      let portfolioReturn = 0;
      for (let i = 0; i < positions.length; i++) {
        portfolioReturn += positions[i].weight * returns[i][t];
      }
      portfolioReturns.push(portfolioReturn);
    }

    return portfolioReturns;
  }

  private static calculateHistoricalVaR(returns: number[], portfolioValues: number[]): any {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index95 = Math.floor((1 - this.CONFIDENCE_LEVEL_95) * sortedReturns.length);
    const index99 = Math.floor((1 - this.CONFIDENCE_LEVEL_99) * sortedReturns.length);

    const currentValue = portfolioValues[portfolioValues.length - 1];
    
    return {
      oneDay: currentValue * Math.abs(sortedReturns[index95] / 100),
      tenDay: currentValue * Math.abs(sortedReturns[index95] / 100) * Math.sqrt(10),
      confidenceLevel: 95
    };
  }

  private static calculateParametricVaR(returns: number[], portfolioValues: number[]): any {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance);
    
    const zScore95 = 1.645; // 95% confidence
    const zScore99 = 2.326; // 99% confidence
    
    const currentValue = portfolioValues[portfolioValues.length - 1];
    
    return {
      oneDay: currentValue * (zScore95 * volatility / 100),
      tenDay: currentValue * (zScore95 * volatility * Math.sqrt(10) / 100),
      method: "Variance-Covariance"
    };
  }

  private static calculateMonteCarloVaR(returns: number[], portfolioValues: number[]): any {
    const simulations = 10000;
    const currentValue = portfolioValues[portfolioValues.length - 1];
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance);
    
    const simulatedReturns: number[] = [];
    
    for (let i = 0; i < simulations; i++) {
      const randomReturn = this.generateNormalRandom(mean, volatility);
      simulatedReturns.push(randomReturn);
    }
    
    simulatedReturns.sort((a, b) => a - b);
    const index = Math.floor((1 - this.CONFIDENCE_LEVEL_95) * simulations);
    
    return {
      oneDay: currentValue * Math.abs(simulatedReturns[index] / 100),
      confidenceLevel: 95,
      simulations
    };
  }

  private static calculateExpectedShortfall(returns: number[], portfolioValues: number[]): any {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor((1 - this.CONFIDENCE_LEVEL_95) * sortedReturns.length);
    const tailReturns = sortedReturns.slice(0, varIndex);
    const expectedShortfall = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
    
    const currentValue = portfolioValues[portfolioValues.length - 1];
    
    return {
      expectedShortfall: currentValue * Math.abs(expectedShortfall / 100),
      conditionalVaR: currentValue * Math.abs(expectedShortfall / 100)
    };
  }

  private static calculateComponentVaR(positions: PortfolioPosition[], returns: number[][]): { [symbol: string]: number } {
    const componentVaR: { [symbol: string]: number } = {};
    
    positions.forEach((position, index) => {
      const positionReturns = returns[index];
      const mean = positionReturns.reduce((sum, r) => sum + r, 0) / positionReturns.length;
      const variance = positionReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (positionReturns.length - 1);
      const volatility = Math.sqrt(variance);
      const zScore = 1.645;
      const positionValue = position.quantity * position.price;
      
      componentVaR[position.symbol] = positionValue * (zScore * volatility / 100);
    });

    return componentVaR;
  }

  private static calculateStressImpact(positions: PortfolioPosition[], shock: any): any {
    let totalLoss = 0;
    const totalValue = positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0);
    
    const positionImpacts = positions.map(position => {
      let impact = 0;
      
      // Calculate impact based on asset class
      if (position.assetClass === 'Equity') {
        impact = position.weight * shock.equityDrop / 100;
      } else if (position.assetClass === 'Fixed Income') {
        impact = position.weight * (shock.bondYields - 2.0) / 100; // Yield shock impact
      } else if (position.assetClass === 'Commodity') {
        impact = position.weight * shock.commodities / 100;
      } else if (position.assetClass === 'FX') {
        impact = position.weight * shock.fxImpact / 100;
      }
      
      const loss = position.weight * totalValue * impact;
      totalLoss += loss;
      
      return {
        symbol: position.symbol,
        loss: Math.abs(loss),
        impact: impact > 0 ? 'Positive' : 'Negative'
      };
    });

    return {
      totalLoss: Math.abs(totalLoss),
      percentageLoss: (Math.abs(totalLoss) / totalValue) * 100,
      positions: positionImpacts
    };
  }

  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    const xMean = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let xSquaredSum = 0;
    let ySquaredSum = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xSquaredSum += xDiff * xDiff;
      ySquaredSum += yDiff * yDiff;
    }
    
    return numerator / Math.sqrt(xSquaredSum * ySquaredSum);
  }

  private static calculateEigenvalues(matrix: number[][]): number[] {
    // Simplified eigenvalue calculation (in real implementation, use proper linear algebra)
    const n = matrix.length;
    const eigenvalues: number[] = [];
    
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += Math.abs(matrix[i][j]);
      }
      eigenvalues.push(sum / n);
    }
    
    return eigenvalues;
  }

  private static calculateConcentrationRisk(eigenvalues: number[]): number {
    const sum = eigenvalues.reduce((a, b) => a + b, 0);
    const maxEigenvalue = Math.max(...eigenvalues);
    return maxEigenvalue / sum;
  }

  private static calculateDiversificationRatio(matrix: number[][]): number {
    // Simplified diversification ratio
    const n = matrix.length;
    let sumCorrelations = 0;
    let count = 0;
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        sumCorrelations += Math.abs(matrix[i][j]);
        count++;
      }
    }
    
    return count > 0 ? sumCorrelations / count : 1;
  }

  private static calculateFactorContributions(positions: PortfolioPosition[]): { [factor: string]: any } {
    // Market, Size, Value, Momentum, Quality factors
    const factors = {
      'Market': { contribution: 0, explanation: 'Overall market exposure' },
      'Size': { contribution: 0, explanation: 'Small vs large cap exposure' },
      'Value': { contribution: 0, explanation: 'Value vs growth exposure' },
      'Momentum': { contribution: 0, explanation: 'Price momentum factor' },
      'Quality': { contribution: 0, explanation: 'Quality factor exposure' }
    };
    
    positions.forEach(position => {
      const positionValue = position.quantity * position.price;
      
      // Simulate factor exposures
      factors['Market'].contribution += positionValue * position.beta / 100;
      factors['Size'].contribution += positionValue * (Math.random() - 0.5) / 50;
      factors['Value'].contribution += positionValue * (Math.random() - 0.5) / 100;
      factors['Momentum'].contribution += positionValue * position.volatility / 1000;
      factors['Quality'].contribution += positionValue * (0.3 + Math.random() * 0.4) / 100;
    });
    
    const totalValue = positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0);
    
    Object.keys(factors).forEach(factor => {
      factors[factor].percentage = Math.abs(factors[factor].contribution / totalValue * 100);
    });
    
    return factors;
  }

  private static calculateSectorAttribution(positions: PortfolioPosition[]): { [sector: string]: any } {
    const sectorAttribution: { [sector: string]: any } = {};
    
    positions.forEach(position => {
      const positionValue = position.quantity * position.price;
      
      if (!sectorAttribution[position.sector]) {
        sectorAttribution[position.sector] = { contribution: 0, percentage: 0 };
      }
      
      sectorAttribution[position.sector].contribution += positionValue;
    });
    
    const totalValue = positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0);
    
    Object.keys(sectorAttribution).forEach(sector => {
      sectorAttribution[sector].percentage = sectorAttribution[sector].contribution / totalValue * 100;
    });
    
    return sectorAttribution;
  }

  private static calculateAssetClassAttribution(positions: PortfolioPosition[]): { [assetClass: string]: any } {
    const assetClassAttribution: { [assetClass: string]: any } = {};
    
    positions.forEach(position => {
      const positionValue = position.quantity * position.price;
      
      if (!assetClassAttribution[position.assetClass]) {
        assetClassAttribution[position.assetClass] = { contribution: 0, percentage: 0 };
      }
      
      assetClassAttribution[position.assetClass].contribution += positionValue;
    });
    
    const totalValue = positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0);
    
    Object.keys(assetClassAttribution).forEach(assetClass => {
      assetClassAttribution[assetClass].percentage = assetClassAttribution[assetClass].contribution / totalValue * 100;
    });
    
    return assetClassAttribution;
  }

  private static estimateBidAskSpread(symbol: string, assetClass: string): number {
    const spreads: { [key: string]: number } = {
      'Equity': 0.02,
      'Fixed Income': 0.05,
      'ETF': 0.01,
      'Commodity': 0.03,
      'FX': 0.001
    };
    return spreads[assetClass] || 0.02;
  }

  private static estimateDailyVolume(symbol: string): number {
    // Simplified volume estimation
    return Math.random() * 1000000 + 500000; // $500K - $1.5M
  }

  private static calculateTimeToLiquidate(quantity: number, dailyVolume: number): number {
    return Math.ceil(quantity / (dailyVolume / 100)); // Days to liquidate
  }

  private static calculateLiquidityScore(spread: number, volumeToMC: number, timeToLiquidate: number): number {
    const spreadScore = Math.max(0, 1 - spread * 50);
    const volumeScore = Math.min(1, volumeToMC * 10);
    const timeScore = Math.max(0, 1 - timeToLiquidate / 30);
    
    return (spreadScore + volumeScore + timeScore) / 3;
  }

  private static calculatePortfolioLiquidity(assetLiquidity: { [symbol: string]: any }): any {
    const spreads = Object.values(assetLiquidity).map((liquidity: any) => liquidity.bidAskSpread);
    const timesToLiquidate = Object.values(assetLiquidity).map((liquidity: any) => liquidity.timeToLiquidate);
    
    const averageSpread = spreads.reduce((sum, spread) => sum + spread, 0) / spreads.length;
    const maxTimeToLiquidate = Math.max(...timesToLiquidate);
    
    return {
      averageSpread,
      timeToLiquidatePortfolio: maxTimeToLiquidate,
      liquidityRiskScore: Math.max(0, 1 - maxTimeToLiquidate / 30),
      stressLiquidity: averageSpread * 2 // Stress scenario
    };
  }

  private static getPDFromRating(rating: string): number {
    const pdRates: { [key: string]: number } = {
      'AAA': 0.0001,
      'AA': 0.0002,
      'A': 0.0005,
      'BBB': 0.002,
      'BB': 0.01
    };
    return pdRates[rating] || 0.02;
  }

  private static calculatePortfolioCounterpartyMetrics(exposures: { [counterparty: string]: any }): any {
    const exposureValues = Object.values(exposures);
    const totalExposure = exposureValues.reduce((sum: number, exposure: any) => sum + exposure.currentExposure, 0);
    const weightedPD = exposureValues.reduce((sum: number, exposure: any) => 
      sum + (exposure.currentExposure / totalExposure) * exposure.probabilityOfDefault, 0);
    const portfolioExpectedLoss = exposureValues.reduce((sum: number, exposure: any) => 
      sum + exposure.expectedLoss, 0);
    
    // Concentration risk (Herfindahl index)
    const concentrationRisk = exposureValues.reduce((sum: number, exposure: any) => {
      const weight = exposure.currentExposure / totalExposure;
      return sum + weight * weight;
    }, 0);
    
    return {
      totalExposure,
      weightedPD,
      portfolioExpectedLoss,
      concentrationRisk
    };
  }

  private static generateNormalRandom(mean: number, stdDev: number): number {
    // Box-Muller transformation for normal random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  private static calculateTotalReturn(returns: number[]): number {
    return returns.reduce((sum, r) => sum + r, 0);
  }

  private static calculateAnnualizedVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    return Math.sqrt(variance * this.TRADING_DAYS_PER_YEAR);
  }

  private static calculateSharpeRatio(returns: number[]): number {
    const totalReturn = this.calculateTotalReturn(returns);
    const volatility = this.calculateAnnualizedVolatility(returns);
    return (totalReturn - (this.RISK_FREE_RATE * 100)) / volatility;
  }

  private static calculateMaxDrawdown(returns: number[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;
    
    for (const ret of returns) {
      cumulative += ret;
      if (cumulative > peak) {
        peak = cumulative;
      }
      const drawdown = peak - cumulative;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }

  private static calculateWinRate(returns: number[]): number {
    const wins = returns.filter(r => r > 0).length;
    return (wins / returns.length) * 100;
  }

  private static calculateProfitFactor(returns: number[]): number {
    const grossProfit = returns.filter(r => r > 0).reduce((sum, r) => sum + r, 0);
    const grossLoss = Math.abs(returns.filter(r => r < 0).reduce((sum, r) => sum + r, 0));
    return grossLoss > 0 ? grossProfit / grossLoss : 0;
  }

  private static calculateVaRSeries(returns: number[]): number[] {
    const varSeries: number[] = [];
    const window = 30; // 30-day rolling VaR
    
    for (let i = window; i < returns.length; i++) {
      const windowReturns = returns.slice(i - window, i);
      const sortedReturns = [...windowReturns].sort((a, b) => a - b);
      const var95Index = Math.floor((1 - this.CONFIDENCE_LEVEL_95) * sortedReturns.length);
      varSeries.push(Math.abs(sortedReturns[var95Index]));
    }
    
    return varSeries;
  }
}

export default RiskManagementProService;