// Value Investing Service - Benjamin Graham & Warren Buffett Style Analysis
// Analisi fondamentale di livello istituzionale per stock value-oriented

export interface StockAnalysis {
  symbol: string;
  companyName: string;
  sector: string;
  marketCap: number;
  currentPrice: number;
  intrinsicValue: number;
  marginOfSafety: number;
  grahamMetrics: BenjaminGrahamMetrics;
  moatAnalysis: MoatAnalysis;
  qualityScore: QualityScore;
  intrinsicValueCalc: IntrinsicValueCalculation;
  lastUpdate: string;
}

export interface BenjaminGrahamMetrics {
  peRatio: number;
  pbRatio: number;
  roe: number; // Return on Equity %
  debtToEquity: number;
  currentRatio: number;
  dividendYield: number;
  earningsGrowth: number;
  bookValue: number;
  grahamNumber: number;
  isGrahamValue: boolean;
}

export interface MoatAnalysis {
  brandStrength: number; // 1-10 scale
  networkEffects: number; // 1-10 scale
  costAdvantages: number; // 1-10 scale
  switchingCosts: number; // 1-10 scale
  regulatoryBarriers: number; // 1-10 scale
  overallMoatStrength: number; // 1-10 scale
  moatType: 'narrow' | 'wide' | 'none';
  competitivePosition: string;
}

export interface QualityScore {
  overallScore: number; // 0-100
  financialHealth: number; // 0-100
  managementQuality: number; // 0-100
  profitabilityConsistency: number; // 0-100
  debtManagement: number; // 0-100
  cashFlowQuality: number; // 0-100
  enterpriseValue: number;
  freeCashFlow: number;
  fcfYield: number;
  returnOnCapital: number;
  economicMoat: number; // 0-100
}

export interface IntrinsicValueCalculation {
  dcfValue: number;
  dividendDiscountValue: number;
  bookValueApproach: number;
  earningsPowerValue: number;
  averageIntrinsicValue: number;
  marginOfSafety: number;
  confidence: number; // 0-100
  assumptions: {
    growthRate: number;
    discountRate: number;
    terminalGrowth: number;
    projectionYears: number;
  };
}

export interface ValueOpportunity {
  symbol: string;
  companyName: string;
  opportunityScore: number; // 0-100
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'AVOID';
  upsidePotential: number; // %
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyReasons: string[];
  targetPrice: number;
  currentPrice: number;
  timeHorizon: string;
}

export interface ValueScreeningFilters {
  maxPE: number;
  maxPB: number;
  minROE: number;
  maxDebtToEquity: number;
  minCurrentRatio: number;
  minMarketCap: number;
  maxMarketCap: number;
  minMoatStrength: number;
}

export interface ValueScreenerResult {
  totalMatches: number;
  matches: StockAnalysis[];
  filters: ValueScreeningFilters;
  timestamp: string;
}

export class ValueInvestingService {
  private static instance: ValueInvestingService;
  private valueStocks: StockAnalysis[] = [];
  private lastUpdate: Date = new Date();

  private constructor() {
    this.initializeValueStocksData();
    this.startRealTimeUpdates();
  }

  public static getInstance(): ValueInvestingService {
    if (!ValueInvestingService.instance) {
      ValueInvestingService.instance = new ValueInvestingService();
    }
    return ValueInvestingService.instance;
  }

  // ==================== INIZIALIZZAZIONE DATI VALUE STOCKS ====================
  
  private initializeValueStocksData(): void {
    // Database di stock value-friendly (15-20 aziende)
    this.valueStocks = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        marketCap: 2800000000000,
        currentPrice: 175.50,
        intrinsicValue: 195.25,
        marginOfSafety: 11.2,
        grahamMetrics: {
          peRatio: 28.5,
          pbRatio: 9.2,
          roe: 145.5,
          debtToEquity: 1.85,
          currentRatio: 1.07,
          dividendYield: 0.48,
          earningsGrowth: 10.5,
          bookValue: 19.08,
          grahamNumber: 58.42,
          isGrahamValue: false
        },
        moatAnalysis: {
          brandStrength: 9,
          networkEffects: 8,
          costAdvantages: 7,
          switchingCosts: 9,
          regulatoryBarriers: 6,
          overallMoatStrength: 7.8,
          moatType: 'wide',
          competitivePosition: 'Dominant in premium smartphones and services'
        },
        qualityScore: {
          overallScore: 87,
          financialHealth: 92,
          managementQuality: 85,
          profitabilityConsistency: 94,
          debtManagement: 88,
          cashFlowQuality: 95,
          enterpriseValue: 2820000000000,
          freeCashFlow: 98500000000,
          fcfYield: 3.49,
          returnOnCapital: 28.5,
          economicMoat: 85
        },
        intrinsicValueCalc: {
          dcfValue: 195.25,
          dividendDiscountValue: 168.45,
          bookValueApproach: 142.30,
          earningsPowerValue: 178.90,
          averageIntrinsicValue: 171.23,
          marginOfSafety: 11.2,
          confidence: 85,
          assumptions: {
            growthRate: 8.5,
            discountRate: 10.0,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        sector: 'Technology',
        marketCap: 2650000000000,
        currentPrice: 355.25,
        intrinsicValue: 385.60,
        marginOfSafety: 8.5,
        grahamMetrics: {
          peRatio: 26.8,
          pbRatio: 8.7,
          roe: 42.5,
          debtToEquity: 0.65,
          currentRatio: 1.78,
          dividendYield: 0.75,
          earningsGrowth: 12.2,
          bookValue: 40.84,
          grahamNumber: 98.15,
          isGrahamValue: false
        },
        moatAnalysis: {
          brandStrength: 9,
          networkEffects: 9,
          costAdvantages: 7,
          switchingCosts: 8,
          regulatoryBarriers: 7,
          overallMoatStrength: 8.0,
          moatType: 'wide',
          competitivePosition: 'Dominant in enterprise software and cloud computing'
        },
        qualityScore: {
          overallScore: 89,
          financialHealth: 94,
          managementQuality: 88,
          profitabilityConsistency: 91,
          debtManagement: 95,
          cashFlowQuality: 96,
          enterpriseValue: 2675000000000,
          freeCashFlow: 65000000000,
          fcfYield: 2.43,
          returnOnCapital: 25.8,
          economicMoat: 90
        },
        intrinsicValueCalc: {
          dcfValue: 385.60,
          dividendDiscountValue: 325.40,
          bookValueApproach: 285.75,
          earningsPowerValue: 358.90,
          averageIntrinsicValue: 338.91,
          marginOfSafety: 8.5,
          confidence: 88,
          assumptions: {
            growthRate: 10.2,
            discountRate: 10.0,
            terminalGrowth: 3.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'JNJ',
        companyName: 'Johnson & Johnson',
        sector: 'Healthcare',
        marketCap: 385000000000,
        currentPrice: 155.75,
        intrinsicValue: 185.40,
        marginOfSafety: 19.0,
        grahamMetrics: {
          peRatio: 15.2,
          pbRatio: 2.8,
          roe: 23.5,
          debtToEquity: 0.45,
          currentRatio: 1.32,
          dividendYield: 2.95,
          earningsGrowth: 8.7,
          bookValue: 55.63,
          grahamNumber: 96.85,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 8,
          networkEffects: 5,
          costAdvantages: 7,
          switchingCosts: 8,
          regulatoryBarriers: 9,
          overallMoatStrength: 7.4,
          moatType: 'narrow',
          competitivePosition: 'Strong pharmaceutical and consumer healthcare brand'
        },
        qualityScore: {
          overallScore: 82,
          financialHealth: 88,
          managementQuality: 80,
          profitabilityConsistency: 85,
          debtManagement: 90,
          cashFlowQuality: 87,
          enterpriseValue: 390000000000,
          freeCashFlow: 18500000000,
          fcfYield: 4.74,
          returnOnCapital: 18.5,
          economicMoat: 75
        },
        intrinsicValueCalc: {
          dcfValue: 185.40,
          dividendDiscountValue: 175.25,
          bookValueApproach: 165.80,
          earningsPowerValue: 192.50,
          averageIntrinsicValue: 179.74,
          marginOfSafety: 19.0,
          confidence: 82,
          assumptions: {
            growthRate: 6.5,
            discountRate: 9.5,
            terminalGrowth: 2.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'PG',
        companyName: 'Procter & Gamble Co.',
        sector: 'Consumer Goods',
        marketCap: 315000000000,
        currentPrice: 142.30,
        intrinsicValue: 168.75,
        marginOfSafety: 18.6,
        grahamMetrics: {
          peRatio: 21.5,
          pbRatio: 3.2,
          roe: 31.8,
          debtToEquity: 0.52,
          currentRatio: 0.67,
          dividendYield: 2.58,
          earningsGrowth: 6.2,
          bookValue: 44.47,
          grahamNumber: 105.22,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 8,
          networkEffects: 4,
          costAdvantages: 7,
          switchingCosts: 7,
          regulatoryBarriers: 5,
          overallMoatStrength: 6.2,
          moatType: 'narrow',
          competitivePosition: 'Strong portfolio of consumer brands with pricing power'
        },
        qualityScore: {
          overallScore: 78,
          financialHealth: 85,
          managementQuality: 82,
          profitabilityConsistency: 88,
          debtManagement: 87,
          cashFlowQuality: 83,
          enterpriseValue: 318000000000,
          freeCashFlow: 14500000000,
          fcfYield: 4.56,
          returnOnCapital: 22.8,
          economicMoat: 70
        },
        intrinsicValueCalc: {
          dcfValue: 168.75,
          dividendDiscountValue: 158.40,
          bookValueApproach: 145.20,
          earningsPowerValue: 172.85,
          averageIntrinsicValue: 161.30,
          marginOfSafety: 18.6,
          confidence: 80,
          assumptions: {
            growthRate: 5.8,
            discountRate: 9.0,
            terminalGrowth: 2.2,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'KO',
        companyName: 'Coca-Cola Company',
        sector: 'Beverages',
        marketCap: 245000000000,
        currentPrice: 58.75,
        intrinsicValue: 72.50,
        marginOfSafety: 23.4,
        grahamMetrics: {
          peRatio: 24.8,
          pbRatio: 5.8,
          roe: 42.1,
          debtToEquity: 1.67,
          currentRatio: 1.13,
          dividendYield: 3.12,
          earningsGrowth: 7.8,
          bookValue: 10.13,
          grahamNumber: 47.85,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 10,
          networkEffects: 6,
          costAdvantages: 8,
          switchingCosts: 9,
          regulatoryBarriers: 6,
          overallMoatStrength: 7.8,
          moatType: 'narrow',
          competitivePosition: 'Iconic global brand with massive distribution network'
        },
        qualityScore: {
          overallScore: 85,
          financialHealth: 90,
          managementQuality: 88,
          profitabilityConsistency: 92,
          debtManagement: 82,
          cashFlowQuality: 89,
          enterpriseValue: 248000000000,
          freeCashFlow: 9500000000,
          fcfYield: 3.83,
          returnOnCapital: 28.5,
          economicMoat: 85
        },
        intrinsicValueCalc: {
          dcfValue: 72.50,
          dividendDiscountValue: 68.25,
          bookValueApproach: 58.40,
          earningsPowerValue: 75.80,
          averageIntrinsicValue: 68.74,
          marginOfSafety: 23.4,
          confidence: 86,
          assumptions: {
            growthRate: 5.2,
            discountRate: 8.5,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'WMT',
        companyName: 'Walmart Inc.',
        sector: 'Retail',
        marketCap: 435000000000,
        currentPrice: 162.85,
        intrinsicValue: 185.20,
        marginOfSafety: 13.7,
        grahamMetrics: {
          peRatio: 26.5,
          pbRatio: 4.2,
          roe: 16.8,
          debtToEquity: 0.58,
          currentRatio: 0.93,
          dividendYield: 1.48,
          earningsGrowth: 4.8,
          bookValue: 38.77,
          grahamNumber: 88.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 8,
          networkEffects: 9,
          costAdvantages: 9,
          switchingCosts: 6,
          regulatoryBarriers: 4,
          overallMoatStrength: 7.2,
          moatType: 'narrow',
          competitivePosition: 'Massive scale and logistics advantages'
        },
        qualityScore: {
          overallScore: 75,
          financialHealth: 80,
          managementQuality: 78,
          profitabilityConsistency: 76,
          debtManagement: 85,
          cashFlowQuality: 82,
          enterpriseValue: 440000000000,
          freeCashFlow: 28000000000,
          fcfYield: 6.36,
          returnOnCapital: 14.2,
          economicMoat: 72
        },
        intrinsicValueCalc: {
          dcfValue: 185.20,
          dividendDiscountValue: 165.75,
          bookValueApproach: 152.30,
          earningsPowerValue: 178.90,
          averageIntrinsicValue: 170.54,
          marginOfSafety: 13.7,
          confidence: 78,
          assumptions: {
            growthRate: 4.5,
            discountRate: 9.0,
            terminalGrowth: 2.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'BRK.B',
        companyName: 'Berkshire Hathaway Inc.',
        sector: 'Financial Services',
        marketCap: 780000000000,
        currentPrice: 335.50,
        intrinsicValue: 425.80,
        marginOfSafety: 26.9,
        grahamMetrics: {
          peRatio: 8.5,
          pbRatio: 1.4,
          roe: 12.5,
          debtToEquity: 0.22,
          currentRatio: 1.25,
          dividendYield: 0.00,
          earningsGrowth: 18.5,
          bookValue: 239.64,
          grahamNumber: 145.20,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 9,
          networkEffects: 7,
          costAdvantages: 8,
          switchingCosts: 7,
          regulatoryBarriers: 5,
          overallMoatStrength: 7.2,
          moatType: 'narrow',
          competitivePosition: 'Legendary management and insurance float advantages'
        },
        qualityScore: {
          overallScore: 88,
          financialHealth: 92,
          managementQuality: 95,
          profitabilityConsistency: 85,
          debtManagement: 95,
          cashFlowQuality: 90,
          enterpriseValue: 750000000000,
          freeCashFlow: 35000000000,
          fcfYield: 4.67,
          returnOnCapital: 18.5,
          economicMoat: 80
        },
        intrinsicValueCalc: {
          dcfValue: 425.80,
          dividendDiscountValue: 0.00,
          bookValueApproach: 385.40,
          earningsPowerValue: 398.75,
          averageIntrinsicValue: 403.32,
          marginOfSafety: 26.9,
          confidence: 92,
          assumptions: {
            growthRate: 8.5,
            discountRate: 8.0,
            terminalGrowth: 3.0,
            projectionYears: 15
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'VZ',
        companyName: 'Verizon Communications',
        sector: 'Telecommunications',
        marketCap: 165000000000,
        currentPrice: 38.75,
        intrinsicValue: 52.80,
        marginOfSafety: 36.2,
        grahamMetrics: {
          peRatio: 8.2,
          pbRatio: 1.1,
          roe: 18.5,
          debtToEquity: 1.85,
          currentRatio: 0.78,
          dividendYield: 6.78,
          earningsGrowth: 2.8,
          bookValue: 35.23,
          grahamNumber: 48.65,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 7,
          networkEffects: 8,
          costAdvantages: 6,
          switchingCosts: 7,
          regulatoryBarriers: 6,
          overallMoatStrength: 6.8,
          moatType: 'narrow',
          competitivePosition: 'Strong telecom infrastructure and customer base'
        },
        qualityScore: {
          overallScore: 72,
          financialHealth: 75,
          managementQuality: 70,
          profitabilityConsistency: 78,
          debtManagement: 68,
          cashFlowQuality: 80,
          enterpriseValue: 180000000000,
          freeCashFlow: 22000000000,
          fcfYield: 12.22,
          returnOnCapital: 15.8,
          economicMoat: 65
        },
        intrinsicValueCalc: {
          dcfValue: 52.80,
          dividendDiscountValue: 48.25,
          bookValueApproach: 42.15,
          earningsPowerValue: 50.40,
          averageIntrinsicValue: 48.40,
          marginOfSafety: 36.2,
          confidence: 75,
          assumptions: {
            growthRate: 3.2,
            discountRate: 8.5,
            terminalGrowth: 2.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'T',
        companyName: 'AT&T Inc.',
        sector: 'Telecommunications',
        marketCap: 105000000000,
        currentPrice: 18.25,
        intrinsicValue: 28.50,
        marginOfSafety: 56.1,
        grahamMetrics: {
          peRatio: 6.8,
          pbRatio: 0.9,
          roe: 22.5,
          debtToEquity: 2.15,
          currentRatio: 0.85,
          dividendYield: 5.92,
          earningsGrowth: -2.5,
          bookValue: 20.28,
          grahamNumber: 28.15,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 6,
          networkEffects: 7,
          costAdvantages: 5,
          switchingCosts: 6,
          regulatoryBarriers: 7,
          overallMoatStrength: 6.2,
          moatType: 'narrow',
          competitivePosition: 'Large telecom network but facing competitive pressures'
        },
        qualityScore: {
          overallScore: 58,
          financialHealth: 60,
          managementQuality: 55,
          profitabilityConsistency: 52,
          debtManagement: 45,
          cashFlowQuality: 65,
          enterpriseValue: 145000000000,
          freeCashFlow: 18000000000,
          fcfYield: 12.41,
          returnOnCapital: 12.5,
          economicMoat: 55
        },
        intrinsicValueCalc: {
          dcfValue: 28.50,
          dividendDiscountValue: 25.75,
          bookValueApproach: 22.40,
          earningsPowerValue: 26.80,
          averageIntrinsicValue: 25.86,
          marginOfSafety: 56.1,
          confidence: 65,
          assumptions: {
            growthRate: 1.5,
            discountRate: 9.0,
            terminalGrowth: 1.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'XOM',
        companyName: 'Exxon Mobil Corporation',
        sector: 'Energy',
        marketCap: 485000000000,
        currentPrice: 115.75,
        intrinsicValue: 135.20,
        marginOfSafety: 16.8,
        grahamMetrics: {
          peRatio: 9.8,
          pbRatio: 2.1,
          roe: 32.8,
          debtToEquity: 0.25,
          currentRatio: 1.12,
          dividendYield: 3.15,
          earningsGrowth: 45.8,
          bookValue: 55.12,
          grahamNumber: 85.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 7,
          networkEffects: 6,
          costAdvantages: 8,
          switchingCosts: 5,
          regulatoryBarriers: 8,
          overallMoatStrength: 6.8,
          moatType: 'narrow',
          competitivePosition: 'Integrated oil major with global refining network'
        },
        qualityScore: {
          overallScore: 78,
          financialHealth: 85,
          managementQuality: 80,
          profitabilityConsistency: 72,
          debtManagement: 90,
          cashFlowQuality: 85,
          enterpriseValue: 480000000000,
          freeCashFlow: 65000000000,
          fcfYield: 13.54,
          returnOnCapital: 25.8,
          economicMoat: 70
        },
        intrinsicValueCalc: {
          dcfValue: 135.20,
          dividendDiscountValue: 118.50,
          bookValueApproach: 105.75,
          earningsPowerValue: 128.90,
          averageIntrinsicValue: 122.09,
          marginOfSafety: 16.8,
          confidence: 80,
          assumptions: {
            growthRate: 8.5,
            discountRate: 10.0,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'CVX',
        companyName: 'Chevron Corporation',
        sector: 'Energy',
        marketCap: 340000000000,
        currentPrice: 175.50,
        intrinsicValue: 198.75,
        marginOfSafety: 13.2,
        grahamMetrics: {
          peRatio: 10.5,
          pbRatio: 1.8,
          roe: 22.5,
          debtToEquity: 0.28,
          currentRatio: 1.18,
          dividendYield: 3.85,
          earningsGrowth: 38.2,
          bookValue: 97.50,
          grahamNumber: 112.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 7,
          networkEffects: 6,
          costAdvantages: 8,
          switchingCosts: 5,
          regulatoryBarriers: 8,
          overallMoatStrength: 6.8,
          moatType: 'narrow',
          competitivePosition: 'Strong downstream refining capabilities'
        },
        qualityScore: {
          overallScore: 80,
          financialHealth: 88,
          managementQuality: 82,
          profitabilityConsistency: 75,
          debtManagement: 92,
          cashFlowQuality: 88,
          enterpriseValue: 335000000000,
          freeCashFlow: 42000000000,
          fcfYield: 12.54,
          returnOnCapital: 22.8,
          economicMoat: 72
        },
        intrinsicValueCalc: {
          dcfValue: 198.75,
          dividendDiscountValue: 178.40,
          bookValueApproach: 162.25,
          earningsPowerValue: 185.90,
          averageIntrinsicValue: 181.33,
          marginOfSafety: 13.2,
          confidence: 82,
          assumptions: {
            growthRate: 7.8,
            discountRate: 10.0,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'MCD',
        companyName: "McDonald's Corporation",
        sector: 'Restaurants',
        marketCap: 195000000000,
        currentPrice: 265.80,
        intrinsicValue: 285.50,
        marginOfSafety: 7.4,
        grahamMetrics: {
          peRatio: 25.2,
          pbRatio: 15.8,
          roe: 85.2,
          debtToEquity: 1.15,
          currentRatio: 1.55,
          dividendYield: 2.38,
          earningsGrowth: 8.5,
          bookValue: 16.82,
          grahamNumber: 58.42,
          isGrahamValue: false
        },
        moatAnalysis: {
          brandStrength: 9,
          networkEffects: 8,
          costAdvantages: 7,
          switchingCosts: 6,
          regulatoryBarriers: 4,
          overallMoatStrength: 6.8,
          moatType: 'narrow',
          competitivePosition: 'Global fast food brand with scale advantages'
        },
        qualityScore: {
          overallScore: 76,
          financialHealth: 82,
          managementQuality: 78,
          profitabilityConsistency: 85,
          debtManagement: 75,
          cashFlowQuality: 80,
          enterpriseValue: 198000000000,
          freeCashFlow: 8500000000,
          fcfYield: 4.29,
          returnOnCapital: 22.5,
          economicMoat: 75
        },
        intrinsicValueCalc: {
          dcfValue: 285.50,
          dividendDiscountValue: 265.25,
          bookValueApproach: 245.80,
          earningsPowerValue: 275.40,
          averageIntrinsicValue: 267.99,
          marginOfSafety: 7.4,
          confidence: 78,
          assumptions: {
            growthRate: 6.8,
            discountRate: 9.5,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'INTC',
        companyName: 'Intel Corporation',
        sector: 'Technology',
        marketCap: 195000000000,
        currentPrice: 48.75,
        intrinsicValue: 68.50,
        marginOfSafety: 40.5,
        grahamMetrics: {
          peRatio: 12.8,
          pbRatio: 1.5,
          roe: 15.2,
          debtToEquity: 0.35,
          currentRatio: 2.15,
          dividendYield: 1.42,
          earningsGrowth: -2.8,
          bookValue: 32.50,
          grahamNumber: 45.85,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 7,
          networkEffects: 5,
          costAdvantages: 6,
          switchingCosts: 8,
          regulatoryBarriers: 8,
          overallMoatStrength: 6.8,
          moatType: 'narrow',
          competitivePosition: 'Legacy x86 architecture with switching costs'
        },
        qualityScore: {
          overallScore: 62,
          financialHealth: 75,
          managementQuality: 58,
          profitabilityConsistency: 48,
          debtManagement: 85,
          cashFlowQuality: 68,
          enterpriseValue: 200000000000,
          freeCashFlow: 12000000000,
          fcfYield: 6.00,
          returnOnCapital: 12.5,
          economicMoat: 60
        },
        intrinsicValueCalc: {
          dcfValue: 68.50,
          dividendDiscountValue: 58.25,
          bookValueApproach: 52.40,
          earningsPowerValue: 65.80,
          averageIntrinsicValue: 61.24,
          marginOfSafety: 40.5,
          confidence: 68,
          assumptions: {
            growthRate: 4.2,
            discountRate: 11.0,
            terminalGrowth: 2.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'ORCL',
        companyName: 'Oracle Corporation',
        sector: 'Technology',
        marketCap: 285000000000,
        currentPrice: 105.25,
        intrinsicValue: 135.80,
        marginOfSafety: 29.0,
        grahamMetrics: {
          peRatio: 18.5,
          pbRatio: 12.2,
          roe: 78.5,
          debtToEquity: 3.85,
          currentRatio: 0.95,
          dividendYield: 1.48,
          earningsGrowth: 12.8,
          bookValue: 8.62,
          grahamNumber: 35.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 8,
          networkEffects: 9,
          costAdvantages: 7,
          switchingCosts: 9,
          regulatoryBarriers: 6,
          overallMoatStrength: 7.8,
          moatType: 'narrow',
          competitivePosition: 'Enterprise database with high switching costs'
        },
        qualityScore: {
          overallScore: 72,
          financialHealth: 68,
          managementQuality: 75,
          profitabilityConsistency: 80,
          debtManagement: 55,
          cashFlowQuality: 78,
          enterpriseValue: 295000000000,
          freeCashFlow: 18000000000,
          fcfYield: 6.10,
          returnOnCapital: 32.8,
          economicMoat: 80
        },
        intrinsicValueCalc: {
          dcfValue: 135.80,
          dividendDiscountValue: 118.50,
          bookValueApproach: 98.25,
          earningsPowerValue: 142.90,
          averageIntrinsicValue: 123.86,
          marginOfSafety: 29.0,
          confidence: 78,
          assumptions: {
            growthRate: 9.5,
            discountRate: 10.5,
            terminalGrowth: 3.0,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'IBM',
        companyName: 'International Business Machines',
        sector: 'Technology',
        marketCap: 135000000000,
        currentPrice: 148.75,
        intrinsicValue: 185.50,
        marginOfSafety: 24.7,
        grahamMetrics: {
          peRatio: 15.8,
          pbRatio: 5.2,
          roe: 35.8,
          debtToEquity: 2.15,
          currentRatio: 1.15,
          dividendYield: 4.25,
          earningsGrowth: 6.2,
          bookValue: 28.61,
          grahamNumber: 68.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 7,
          networkEffects: 6,
          costAdvantages: 6,
          switchingCosts: 8,
          regulatoryBarriers: 8,
          overallMoatStrength: 7.0,
          moatType: 'narrow',
          competitivePosition: 'Enterprise services with long-term contracts'
        },
        qualityScore: {
          overallScore: 68,
          financialHealth: 72,
          managementQuality: 70,
          profitabilityConsistency: 65,
          debtManagement: 62,
          cashFlowQuality: 75,
          enterpriseValue: 142000000000,
          freeCashFlow: 12500000000,
          fcfYield: 8.80,
          returnOnCapital: 18.5,
          economicMoat: 65
        },
        intrinsicValueCalc: {
          dcfValue: 185.50,
          dividendDiscountValue: 168.25,
          bookValueApproach: 145.80,
          earningsPowerValue: 178.90,
          averageIntrinsicValue: 169.61,
          marginOfSafety: 24.7,
          confidence: 75,
          assumptions: {
            growthRate: 5.8,
            discountRate: 9.5,
            terminalGrowth: 2.5,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'GE',
        companyName: 'General Electric Company',
        sector: 'Industrial',
        marketCap: 185000000000,
        currentPrice: 118.50,
        intrinsicValue: 165.80,
        marginOfSafety: 39.9,
        grahamMetrics: {
          peRatio: 8.5,
          pbRatio: 2.8,
          roe: 42.5,
          debtToEquity: 1.85,
          currentRatio: 1.25,
          dividendYield: 0.32,
          earningsGrowth: 25.8,
          bookValue: 42.32,
          grahamNumber: 78.45,
          isGrahamValue: true
        },
        moatAnalysis: {
          brandStrength: 8,
          networkEffects: 5,
          costAdvantages: 7,
          switchingCosts: 8,
          regulatoryBarriers: 9,
          overallMoatStrength: 7.4,
          moatType: 'narrow',
          competitivePosition: 'Industrial equipment with technical expertise'
        },
        qualityScore: {
          overallScore: 75,
          financialHealth: 78,
          managementQuality: 72,
          profitabilityConsistency: 70,
          debtManagement: 68,
          cashFlowQuality: 80,
          enterpriseValue: 195000000000,
          freeCashFlow: 15000000000,
          fcfYield: 7.69,
          returnOnCapital: 22.8,
          economicMoat: 70
        },
        intrinsicValueCalc: {
          dcfValue: 165.80,
          dividendDiscountValue: 125.25,
          bookValueApproach: 118.50,
          earningsPowerValue: 158.90,
          averageIntrinsicValue: 142.11,
          marginOfSafety: 39.9,
          confidence: 82,
          assumptions: {
            growthRate: 8.2,
            discountRate: 10.5,
            terminalGrowth: 2.8,
            projectionYears: 10
          }
        },
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  private startRealTimeUpdates(): void {
    // Aggiorna i dati ogni 30 secondi per simulare real-time
    setInterval(() => {
      this.updateRealTimeData();
    }, 30000);
  }

  private updateRealTimeData(): void {
    this.valueStocks.forEach(stock => {
      // Simula variazioni real-time nei prezzi (±2%)
      const priceVariation = (Math.random() - 0.5) * 0.04;
      stock.currentPrice = Math.max(0.01, stock.currentPrice * (1 + priceVariation));
      
      // Aggiorna margin of safety
      stock.marginOfSafety = ((stock.intrinsicValue - stock.currentPrice) / stock.intrinsicValue) * 100;
      
      stock.lastUpdate = new Date().toISOString();
    });

    this.lastUpdate = new Date();
  }

  // ==================== METODI PUBBLICI ====================

  public async getAllValueStocks(): Promise<StockAnalysis[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return JSON.parse(JSON.stringify(this.valueStocks));
  }

  public async getBenjaminGrahamMetrics(): Promise<BenjaminGrahamMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.valueStocks.map(stock => stock.grahamMetrics);
  }

  public async getMoatAnalysis(): Promise<MoatAnalysis[]> {
    await new Promise(resolve => setTimeout(resolve, 180));
    
    return this.valueStocks.map(stock => stock.moatAnalysis);
  }

  public async getQualityScores(): Promise<QualityScore[]> {
    await new Promise(resolve => setTimeout(resolve, 220));
    
    return this.valueStocks.map(stock => stock.qualityScore);
  }

  public async getIntrinsicValueCalculations(): Promise<IntrinsicValueCalculation[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return this.valueStocks.map(stock => stock.intrinsicValueCalc);
  }

  public async getValueOpportunities(): Promise<ValueOpportunity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const opportunities: ValueOpportunity[] = [
      {
        symbol: 'BRK.B',
        companyName: 'Berkshire Hathaway Inc.',
        opportunityScore: 92,
        recommendation: 'STRONG_BUY',
        upsidePotential: 26.9,
        riskLevel: 'LOW',
        keyReasons: [
          'Graham Value: P/E 8.5, P/B 1.4 - extremely undervalued',
          'Legendary management with 95+ years combined experience',
          'Strong insurance float providing low-cost capital',
          'Margin of Safety: 26.9% - excellent downside protection'
        ],
        targetPrice: 425.80,
        currentPrice: 335.50,
        timeHorizon: '2-3 years'
      },
      {
        symbol: 'T',
        companyName: 'AT&T Inc.',
        opportunityScore: 88,
        recommendation: 'STRONG_BUY',
        upsidePotential: 56.1,
        riskLevel: 'MEDIUM',
        keyReasons: [
          'Deep value: P/E 6.8, P/B 0.9 - massive undervaluation',
          'High dividend yield: 5.92% - income generation',
          'Strong brand and infrastructure assets',
          'Margin of Safety: 56.1% - exceptional downside protection'
        ],
        targetPrice: 28.50,
        currentPrice: 18.25,
        timeHorizon: '18 months'
      },
      {
        symbol: 'VZ',
        companyName: 'Verizon Communications',
        opportunityScore: 85,
        recommendation: 'BUY',
        upsidePotential: 36.2,
        riskLevel: 'LOW',
        keyReasons: [
          'Value metrics: P/E 8.2, P/B 1.1 - undervalued',
          'Stable dividend yield: 6.78% - consistent income',
          'Strong 5G infrastructure position',
          'Margin of Safety: 36.2% - good downside protection'
        ],
        targetPrice: 52.80,
        currentPrice: 38.75,
        timeHorizon: '2 years'
      },
      {
        symbol: 'INTC',
        companyName: 'Intel Corporation',
        opportunityScore: 82,
        recommendation: 'BUY',
        upsidePotential: 40.5,
        riskLevel: 'MEDIUM',
        keyReasons: [
          'Rebound play: P/E 12.8, P/B 1.5 - reasonable valuation',
          'Dominant x86 architecture with switching costs',
          'AI chip market opportunity',
          'Margin of Safety: 40.5% - solid protection'
        ],
        targetPrice: 68.50,
        currentPrice: 48.75,
        timeHorizon: '3 years'
      },
      {
        symbol: 'ORCL',
        companyName: 'Oracle Corporation',
        opportunityScore: 80,
        recommendation: 'BUY',
        upsidePotential: 29.0,
        riskLevel: 'MEDIUM',
        keyReasons: [
          'Enterprise database leader with network effects',
          'High switching costs lock in customers',
          'Strong free cash flow generation',
          'Margin of Safety: 29.0% - adequate protection'
        ],
        targetPrice: 135.80,
        currentPrice: 105.25,
        timeHorizon: '2 years'
      },
      {
        symbol: 'GE',
        companyName: 'General Electric Company',
        opportunityScore: 78,
        recommendation: 'BUY',
        upsidePotential: 39.9,
        riskLevel: 'MEDIUM',
        keyReasons: [
          'Recovery play: P/E 8.5, P/B 2.8 - undervalued',
          'Strong industrial moat and technical expertise',
          'Clean energy transition beneficiary',
          'Margin of Safety: 39.9% - good protection'
        ],
        targetPrice: 165.80,
        currentPrice: 118.50,
        timeHorizon: '3 years'
      }
    ];

    return opportunities;
  }

  public async screenValueStocks(filters: ValueScreeningFilters): Promise<ValueScreenerResult> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const matches = this.valueStocks.filter(stock => {
      const metrics = stock.grahamMetrics;
      
      return (
        metrics.peRatio <= filters.maxPE &&
        metrics.pbRatio <= filters.maxPB &&
        metrics.roe >= filters.minROE &&
        metrics.debtToEquity <= filters.maxDebtToEquity &&
        metrics.currentRatio >= filters.minCurrentRatio &&
        stock.marketCap >= filters.minMarketCap &&
        stock.marketCap <= filters.maxMarketCap &&
        stock.moatAnalysis.overallMoatStrength >= filters.minMoatStrength
      );
    });

    return {
      totalMatches: matches.length,
      matches: matches,
      filters: filters,
      timestamp: new Date().toISOString()
    };
  }

  public async getStockBySymbol(symbol: string): Promise<StockAnalysis | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.valueStocks.find(stock => stock.symbol === symbol) || null;
  }

  public async getValueMetrics(): Promise<{
    totalStocks: number;
    averageMarginOfSafety: number;
    strongValueCount: number;
    averagePE: number;
    averageROE: number;
    timestamp: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const strongValueCount = this.valueStocks.filter(stock => stock.grahamMetrics.isGrahamValue).length;
    const averageMarginOfSafety = this.valueStocks.reduce((sum, stock) => sum + stock.marginOfSafety, 0) / this.valueStocks.length;
    const averagePE = this.valueStocks.reduce((sum, stock) => sum + stock.grahamMetrics.peRatio, 0) / this.valueStocks.length;
    const averageROE = this.valueStocks.reduce((sum, stock) => sum + stock.grahamMetrics.roe, 0) / this.valueStocks.length;

    return {
      totalStocks: this.valueStocks.length,
      averageMarginOfSafety: Math.round(averageMarginOfSafety * 10) / 10,
      strongValueCount,
      averagePE: Math.round(averagePE * 10) / 10,
      averageROE: Math.round(averageROE * 10) / 10,
      timestamp: new Date().toISOString()
    };
  }

  // ==================== METODI DI SUPPORTO ====================

  public getStocksBySector(sector: string): StockAnalysis[] {
    return this.valueStocks.filter(stock => stock.sector === sector);
  }

  public getHighQualityStocks(minScore: number = 80): StockAnalysis[] {
    return this.valueStocks.filter(stock => stock.qualityScore.overallScore >= minScore);
  }

  public getStocksWithMoat(moatType: 'narrow' | 'wide'): StockAnalysis[] {
    return this.valueStocks.filter(stock => stock.moatAnalysis.moatType === moatType);
  }

  public getLastUpdateTime(): string {
    return this.lastUpdate.toISOString();
  }
}

// Export singleton instance
export const valueInvestingService = ValueInvestingService.getInstance();