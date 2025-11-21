export interface GovernmentBond {
  id: string;
  name: string;
  ticker: string;
  maturity: string;
  yield: number;
  price: number;
  duration: number;
  convexity: number;
  outstanding: number;
  lastUpdated: string;
}

export interface CorporateBond {
  id: string;
  name: string;
  ticker: string;
  issuer: string;
  sector: string;
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
  yield: number;
  price: number;
  duration: number;
  spread: number;
  maturity: string;
  issueSize: number;
  coupon: number;
  callDate?: string;
  lastUpdated: string;
}

export interface MunicipalBond {
  id: string;
  name: string;
  issuer: string;
  state: string;
  yield: number;
  price: number;
  duration: number;
  taxStatus: 'Tax-Exempt' | 'Taxable';
  rating: string;
  maturity: string;
  parValue: number;
  lastUpdated: string;
}

export interface CreditDefaultSwap {
  id: string;
  referenceEntity: string;
  rating: string;
  spread: number;
  tenure: '1Y' | '2Y' | '3Y' | '4Y' | '5Y' | '7Y' | '10Y';
  recoveryRate: number;
  lastUpdated: string;
}

export interface CollateralizedDebtObligation {
  id: string;
  name: string;
  trancheType: 'Senior' | 'Mezzanine' | 'Junior' | 'Equity';
  rating: string;
  yield: number;
  spread: number;
  maturity: string;
  originalBalance: number;
  currentBalance: number;
  assetType: 'Corporate Loans' | 'Auto Loans' | 'Credit Cards' | 'Mortgages';
  lastUpdated: string;
}

export interface YieldCurvePoint {
  maturity: string;
  yield: number;
  change: number;
}

export interface DurationAnalysis {
  bondId: string;
  bondName: string;
  duration: number;
  modifiedDuration: number;
  effectiveDuration: number;
  priceChange1BP: number;
  priceChange100BP: number;
}

export interface SpreadAnalysis {
  bondType: string;
  averageSpread: number;
  spreadRange: {
    min: number;
    max: number;
  };
  volatility: number;
  trend: 'Narrowing' | 'Widening' | 'Stable';
}

export interface OptimizationResult {
  recommendedBonds: string[];
  expectedReturn: number;
  portfolioDuration: number;
  riskScore: number;
  concentration: number;
}

export interface MarketData {
  timestamp: string;
  totalMarketCap: number;
  dailyVolume: number;
  averageYield: number;
  benchmarkYield: number;
  yieldSpread: number;
}

class FixedIncomeCreditService {
  private lastUpdate: string = new Date().toISOString();

  // Government Bonds Data
  getGovernmentBonds(): GovernmentBond[] {
    return [
      {
        id: 'UST10Y',
        name: 'U.S. Treasury 10 Year',
        ticker: 'US10Y',
        maturity: '2034-11-15',
        yield: 4.25,
        price: 98.750,
        duration: 8.45,
        convexity: 0.85,
        outstanding: 2350000000000,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'UST30Y',
        name: 'U.S. Treasury 30 Year',
        ticker: 'US30Y',
        maturity: '2054-11-15',
        yield: 4.45,
        price: 97.250,
        duration: 20.25,
        convexity: 4.20,
        outstanding: 1850000000000,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'UST2Y',
        name: 'U.S. Treasury 2 Year',
        ticker: 'US2Y',
        maturity: '2026-11-15',
        yield: 4.75,
        price: 99.500,
        duration: 1.95,
        convexity: 0.04,
        outstanding: 1850000000000,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'UST5Y',
        name: 'U.S. Treasury 5 Year',
        ticker: 'US5Y',
        maturity: '2029-11-15',
        yield: 4.35,
        price: 99.125,
        duration: 4.35,
        convexity: 0.19,
        outstanding: 2100000000000,
        lastUpdated: this.lastUpdate
      }
    ];
  }

  // Corporate Bonds Data
  getCorporateBonds(): CorporateBond[] {
    return [
      {
        id: 'AAPL2528',
        name: 'Apple Inc 5.375% 2028',
        ticker: 'AAPL28',
        issuer: 'Apple Inc.',
        sector: 'Technology',
        rating: 'AA+',
        yield: 4.80,
        price: 101.250,
        duration: 3.85,
        spread: 155,
        maturity: '2028-02-09',
        issueSize: 5000000000,
        coupon: 5.375,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'MSFT2530',
        name: 'Microsoft Corp 4.50% 2030',
        ticker: 'MSFT30',
        issuer: 'Microsoft Corp',
        sector: 'Technology',
        rating: 'AAA',
        yield: 4.65,
        price: 99.875,
        duration: 5.25,
        spread: 140,
        maturity: '2030-02-06',
        issueSize: 8000000000,
        coupon: 4.50,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'JNJ2529',
        name: 'Johnson & Johnson 4.95% 2029',
        ticker: 'JNJ29',
        issuer: 'Johnson & Johnson',
        sector: 'Healthcare',
        rating: 'AAA',
        yield: 4.70,
        price: 100.125,
        duration: 4.75,
        spread: 145,
        maturity: '2029-03-01',
        issueSize: 3500000000,
        coupon: 4.95,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'JPM2527',
        name: 'JPMorgan Chase 4.80% 2027',
        ticker: 'JPM27',
        issuer: 'JPMorgan Chase & Co',
        sector: 'Financials',
        rating: 'A+',
        yield: 5.15,
        price: 99.750,
        duration: 2.85,
        spread: 240,
        maturity: '2027-01-23',
        issueSize: 2500000000,
        coupon: 4.80,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'BAC2526',
        name: 'Bank of America 5.25% 2026',
        ticker: 'BAC26',
        issuer: 'Bank of America Corp',
        sector: 'Financials',
        rating: 'A-',
        yield: 5.45,
        price: 100.500,
        duration: 1.95,
        spread: 270,
        maturity: '2026-03-22',
        issueSize: 4000000000,
        coupon: 5.25,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'TEXACO2530',
        name: 'Chevron Corp 4.35% 2030',
        ticker: 'CVX30',
        issuer: 'Chevron Corporation',
        sector: 'Energy',
        rating: 'AA-',
        yield: 4.95,
        price: 98.750,
        duration: 5.45,
        spread: 160,
        maturity: '2030-05-16',
        issueSize: 6000000000,
        coupon: 4.35,
        lastUpdated: this.lastUpdate
      }
    ];
  }

  // Municipal Bonds Data
  getMunicipalBonds(): MunicipalBond[] {
    return [
      {
        id: 'CALIF2034',
        name: 'California State GO 2034',
        issuer: 'State of California',
        state: 'CA',
        yield: 3.85,
        price: 99.500,
        duration: 7.25,
        taxStatus: 'Tax-Exempt',
        rating: 'AA-',
        maturity: '2034-08-01',
        parValue: 500000000,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'NYCM2035',
        name: 'NYC Transitional Finance Auth 2035',
        issuer: 'NYC Transitional Finance Authority',
        state: 'NY',
        yield: 4.05,
        price: 99.250,
        duration: 8.75,
        taxStatus: 'Tax-Exempt',
        rating: 'AAA',
        maturity: '2035-02-01',
        parValue: 350000000,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'TEXAS2040',
        name: 'Texas State GO 2040',
        issuer: 'State of Texas',
        state: 'TX',
        yield: 3.95,
        price: 99.750,
        duration: 10.25,
        taxStatus: 'Tax-Exempt',
        rating: 'AAA',
        maturity: '2040-10-01',
        parValue: 750000000,
        lastUpdated: this.lastUpdate
      }
    ];
  }

  // Credit Default Swaps Data
  getCreditDefaultSwaps(): CreditDefaultSwap[] {
    return [
      {
        id: 'CDS_APPLE',
        referenceEntity: 'Apple Inc.',
        rating: 'AA+',
        spread: 45,
        tenure: '5Y',
        recoveryRate: 40,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'CDS_MICROSOFT',
        referenceEntity: 'Microsoft Corp.',
        rating: 'AAA',
        spread: 35,
        tenure: '5Y',
        recoveryRate: 40,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'CDS_BOFA',
        referenceEntity: 'Bank of America Corp.',
        rating: 'A-',
        spread: 185,
        tenure: '5Y',
        recoveryRate: 40,
        lastUpdated: this.lastUpdate
      },
      {
        id: 'CDS_CHEVON',
        referenceEntity: 'Chevron Corporation',
        rating: 'AA-',
        spread: 65,
        tenure: '5Y',
        recoveryRate: 40,
        lastUpdated: this.lastUpdate
      }
    ];
  }

  // Collateralized Debt Obligations Data
  getCollateralizedDebtObligations(): CollateralizedDebtObligation[] {
    return [
      {
        id: 'CLO2024A',
        name: 'CLO 2024-A Senior',
        trancheType: 'Senior',
        rating: 'AAA',
        yield: 6.75,
        spread: 275,
        maturity: '2035-05-15',
        originalBalance: 500000000,
        currentBalance: 485000000,
        assetType: 'Corporate Loans',
        lastUpdated: this.lastUpdate
      },
      {
        id: 'CLO2024B',
        name: 'CLO 2024-A Mezzanine',
        trancheType: 'Mezzanine',
        rating: 'AA',
        yield: 8.25,
        spread: 525,
        maturity: '2035-05-15',
        originalBalance: 150000000,
        currentBalance: 145000000,
        assetType: 'Corporate Loans',
        lastUpdated: this.lastUpdate
      },
      {
        id: 'ABS2024C',
        name: 'Auto Loan ABS 2024-B',
        trancheType: 'Senior',
        rating: 'AAA',
        yield: 5.85,
        spread: 185,
        maturity: '2029-01-15',
        originalBalance: 750000000,
        currentBalance: 735000000,
        assetType: 'Auto Loans',
        lastUpdated: this.lastUpdate
      }
    ];
  }

  // Yield Curve Data
  getYieldCurve(): YieldCurvePoint[] {
    return [
      { maturity: '1M', yield: 5.30, change: 0.05 },
      { maturity: '3M', yield: 5.35, change: 0.03 },
      { maturity: '6M', yield: 5.40, change: 0.02 },
      { maturity: '1Y', yield: 5.25, change: -0.01 },
      { maturity: '2Y', yield: 4.75, change: -0.05 },
      { maturity: '3Y', yield: 4.55, change: -0.08 },
      { maturity: '5Y', yield: 4.35, change: -0.10 },
      { maturity: '7Y', yield: 4.30, change: -0.12 },
      { maturity: '10Y', yield: 4.25, change: -0.15 },
      { maturity: '20Y', yield: 4.40, change: -0.10 },
      { maturity: '30Y', yield: 4.45, change: -0.08 }
    ];
  }

  // Duration Analysis
  getDurationAnalysis(): DurationAnalysis[] {
    const govBonds = this.getGovernmentBonds();
    const corpBonds = this.getCorporateBonds();
    
    return [
      ...govBonds.map(bond => ({
        bondId: bond.id,
        bondName: bond.name,
        duration: bond.duration,
        modifiedDuration: bond.duration / (1 + bond.yield / 100),
        effectiveDuration: bond.duration * 0.98,
        priceChange1BP: bond.duration * 0.0001,
        priceChange100BP: bond.duration * 0.01
      })),
      ...corpBonds.slice(0, 3).map(bond => ({
        bondId: bond.id,
        bondName: bond.name,
        duration: bond.duration,
        modifiedDuration: bond.duration / (1 + bond.yield / 100),
        effectiveDuration: bond.duration * 0.97,
        priceChange1BP: bond.duration * 0.0001,
        priceChange100BP: bond.duration * 0.01
      }))
    ];
  }

  // Spread Analysis
  getSpreadAnalysis(): SpreadAnalysis[] {
    return [
      {
        bondType: 'Investment Grade Corporate',
        averageSpread: 165,
        spreadRange: { min: 95, max: 285 },
        volatility: 15.5,
        trend: 'Widening'
      },
      {
        bondType: 'High Yield Corporate',
        averageSpread: 485,
        spreadRange: { min: 350, max: 750 },
        volatility: 45.2,
        trend: 'Stable'
      },
      {
        bondType: 'Emerging Market Sovereign',
        averageSpread: 385,
        spreadRange: { min: 250, max: 650 },
        volatility: 65.8,
        trend: 'Narrowing'
      },
      {
        bondType: 'Municipal Bonds',
        averageSpread: 75,
        spreadRange: { min: 25, max: 150 },
        volatility: 8.5,
        trend: 'Stable'
      },
      {
        bondType: 'Financial Sector',
        averageSpread: 195,
        spreadRange: { min: 125, max: 325 },
        volatility: 25.3,
        trend: 'Widening'
      },
      {
        bondType: 'Energy Sector',
        averageSpread: 225,
        spreadRange: { min: 155, max: 385 },
        volatility: 35.7,
        trend: 'Narrowing'
      }
    ];
  }

  // Optimization Results
  getOptimizationResult(): OptimizationResult {
    return {
      recommendedBonds: ['UST10Y', 'MSFT2530', 'AAPL2528', 'CLO2024A'],
      expectedReturn: 5.25,
      portfolioDuration: 6.75,
      riskScore: 3.2,
      concentration: 0.35
    };
  }

  // Market Data
  getMarketData(): MarketData {
    return {
      timestamp: this.lastUpdate,
      totalMarketCap: 28500000000000,
      dailyVolume: 125000000000,
      averageYield: 4.65,
      benchmarkYield: 4.25,
      yieldSpread: 0.40
    };
  }

  // Historical Yield Data for Charts
  getHistoricalYieldData(): { date: string; yield: number }[] {
    const data = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate realistic yield movements
      const baseYield = 4.25;
      const volatility = 0.15;
      const randomChange = (Math.random() - 0.5) * volatility;
      
      data.push({
        date: date.toISOString().split('T')[0],
        yield: baseYield + randomChange + Math.sin(i / 30) * 0.1
      });
    }
    return data;
  }

  // Historical Spread Data for Charts
  getHistoricalSpreadData(): { date: string; spread: number }[] {
    const data = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseSpread = 165;
      const volatility = 25;
      const randomChange = (Math.random() - 0.5) * volatility;
      
      data.push({
        date: date.toISOString().split('T')[0],
        spread: baseSpread + randomChange + Math.cos(i / 45) * 15
      });
    }
    return data;
  }

  // Performance Attribution Data
  getPerformanceAttribution(): {
    carry: number;
    creditSpread: number;
    yieldCurve: number;
    currency: number;
    other: number;
    total: number;
  } {
    return {
      carry: 3.85,
      creditSpread: 1.25,
      yieldCurve: -0.45,
      currency: 0.15,
      other: 0.20,
      total: 5.00
    };
  }

  // Risk Metrics
  getRiskMetrics() {
    return {
      durationExposure: 6.85,
      convexityExposure: 2.15,
      spreadDuration: 4.25,
      beta: 0.85,
      trackingError: 2.15,
      informationRatio: 0.85,
      maxDrawdown: -8.5,
      volatility: 12.3
    };
  }
}

export default new FixedIncomeCreditService();