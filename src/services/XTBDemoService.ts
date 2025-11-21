// Modalità Demo per testare il sistema senza connessione XTB reale

// Interfacce per i tipi di dati
interface MarketDataBasic {
  bid: number;
  ask: number;
  spread: number;
}

interface CommodityData extends MarketDataBasic {
  category: string;
  production: string;
  supplyChainFactors: string[];
}

interface SupplyChainCorrelation {
  regions: string[];
  correlation: number;
  primarySupplier: string;
}

export class XTBDemoService {
  private demoAccountInfo = {
    balance: 100, // Esempio con €100 come richiesto dall'utente
    equity: 100,
    margin: 0,
    freeMargin: 100, // Tutto il capitale disponibile per trading
    marginLevel: 0,
    currency: "EUR"
  };

  private demoPortfolio = {
    positions: [],
    summary: {
      totalPositions: 0,
      totalProfit: 0,
      totalCommission: 0,
      totalSwap: 0,
      netProfit: 0,
      totalVolume: 0,
      equity: 100,
      balance: 100,
      freeMargin: 100
    }
  };

  private demoMarketData: Record<string, MarketDataBasic | CommodityData> = {
    // Forex
    EURUSD: { bid: 1.0823, ask: 1.0825, spread: 0.0002 },
    GBPUSD: { bid: 1.2645, ask: 1.2647, spread: 0.0002 },
    USDJPY: { bid: 149.82, ask: 149.84, spread: 0.02 },
    
    // Commodities
    XAUUSD: { bid: 2018.45, ask: 2018.65, spread: 0.20, category: "commodity", production: "Sud Africa, Russia, Cina", supplyChainFactors: ["mining_output", "central_bank_reserves"] },
    XAGUSD: { bid: 23.45, ask: 23.47, spread: 0.02, category: "commodity", production: "Messico, Perù, Cina", supplyChainFactors: ["mining_output", "industrial_demand"] },
    CRUDE: { bid: 78.34, ask: 78.36, spread: 0.02, category: "commodity", production: "Texas, Arabia Saudita, Russia", supplyChainFactors: ["drilling_activity", "geopolitical_events"] },
    WHEAT: { bid: 6.78, ask: 6.80, spread: 0.02, category: "commodity", production: "Kansas, Ucraina, Francia", supplyChainFactors: ["weather_conditions", "farming_output"] },
    LITHIUM: { bid: 45.67, ask: 45.69, spread: 0.02, category: "commodity", production: "Cile, Australia, Argentina", supplyChainFactors: ["mining_extraction", "battery_industry_demand"] },
    COPPER: { bid: 3.45, ask: 3.47, spread: 0.02, category: "commodity", production: "Perù, Cile, Cina", supplyChainFactors: ["mining_output", "construction_demand"] },
    
    // Legacy commodities (per compatibilità)
    GOLD: { bid: 2018.45, ask: 2018.65, spread: 0.20 },
    OIL: { bid: 78.34, ask: 78.36, spread: 0.02 }
  };

  private supplyChainCorrelations: Record<string, SupplyChainCorrelation> = {
    XAUUSD: { regions: ["Sud Africa", "Russia", "Cina"], correlation: 0.65, primarySupplier: "Sud Africa" },
    XAGUSD: { regions: ["Messico", "Perù", "Cina"], correlation: 0.58, primarySupplier: "Messico" },
    CRUDE: { regions: ["Texas", "Arabia Saudita", "Russia"], correlation: 0.72, primarySupplier: "Texas" },
    WHEAT: { regions: ["Kansas", "Ucraina", "Francia"], correlation: 0.61, primarySupplier: "Kansas" },
    LITHIUM: { regions: ["Cile", "Australia", "Argentina"], correlation: 0.68, primarySupplier: "Cile" },
    COPPER: { regions: ["Perù", "Cile", "Cina"], correlation: 0.59, primarySupplier: "Perù" }
  };

  private isConnected = true;

  async getStatus() {
    // Simula un piccolo delay per realismo
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      status: "connected",
      streamSessionId: "demo-session-123",
      connected: true,
      timestamp: new Date().toISOString()
    };
  }

  async getAccountInfo() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.demoAccountInfo;
  }

  async getMarketData(symbol: string) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const data = this.demoMarketData[symbol as keyof typeof this.demoMarketData];
    if (!data) {
      throw new Error(`Symbol ${symbol} not found in demo data`);
    }
    return {
      symbol,
      bid: data.bid,
      ask: data.ask,
      spread: data.spread,
      profit: 0,
      volume: 1000,
      timestamp: Date.now()
    };
  }

  async getSymbols() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      forex: ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD"],
      stocks: ["AAPL", "GOOGL", "MSFT", "TSLA"],
      crypto: ["BITCOIN", "ETHEREUM"],
      commodities: ["XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"],
      all: [
        "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", 
        "AAPL", "GOOGL", "MSFT", "TSLA", 
        "BITCOIN", "ETHEREUM",
        "XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"
      ]
    };
  }

  async testConnection() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.isConnected;
  }

  async getMultipleMarketData(symbols: string[]) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const results: Record<string, any> = {};
    
    symbols.forEach(symbol => {
      const data = this.demoMarketData[symbol as keyof typeof this.demoMarketData];
      if (data) {
        results[symbol] = {
          symbol,
          bid: data.bid,
          ask: data.ask,
          spread: data.spread,
          profit: 0,
          volume: 1000,
          timestamp: Date.now()
        };
      }
    });
    
    return results;
  }

  // Metodi per commodities - Supply Chain Intelligence
  async getCommoditiesData() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const commodities = ["XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"];
    const results: Record<string, any> = {};
    
    commodities.forEach(symbol => {
      const data = this.demoMarketData[symbol as keyof typeof this.demoMarketData] as CommodityData;
      const correlation = this.supplyChainCorrelations[symbol as keyof typeof this.supplyChainCorrelations];
      
      if (data && correlation) {
        results[symbol] = {
          symbol,
          bid: data.bid,
          ask: data.ask,
          spread: data.spread,
          category: data.category,
          production: data.production,
          supplyChainFactors: data.supplyChainFactors,
          correlation: correlation.correlation,
          primarySupplier: correlation.primarySupplier,
          regions: correlation.regions,
          timestamp: Date.now()
        };
      }
    });
    
    return results;
  }

  async getCommodityPrice(symbol: string) {
    await new Promise(resolve => setTimeout(resolve, 120));
    const commoditySymbols = ["XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"];
    
    if (!commoditySymbols.includes(symbol)) {
      throw new Error(`Commodity ${symbol} not found`);
    }
    
    const data = this.demoMarketData[symbol as keyof typeof this.demoMarketData] as CommodityData;
    const correlation = this.supplyChainCorrelations[symbol as keyof typeof this.supplyChainCorrelations];
    
    if (!data || !correlation) {
      throw new Error(`Data not found for commodity ${symbol}`);
    }
    
    return {
      symbol,
      bid: data.bid,
      ask: data.ask,
      spread: data.spread,
      category: data.category,
      production: data.production,
      supplyChainFactors: data.supplyChainFactors,
      correlation: correlation.correlation,
      primarySupplier: correlation.primarySupplier,
      regions: correlation.regions,
      timestamp: Date.now()
    };
  }

  async getSupplyChainCorrelations() {
    await new Promise(resolve => setTimeout(resolve, 180));
    const results: Record<string, any> = {};
    
    Object.keys(this.supplyChainCorrelations).forEach(symbol => {
      const correlation = this.supplyChainCorrelations[symbol as keyof typeof this.supplyChainCorrelations];
      const marketData = this.demoMarketData[symbol as keyof typeof this.demoMarketData];
      
      if (correlation && marketData) {
        results[symbol] = {
          symbol,
          correlation: correlation.correlation,
          primarySupplier: correlation.primarySupplier,
          regions: correlation.regions,
          currentPrice: {
            bid: marketData.bid,
            ask: marketData.ask
          },
          supplyChainRisk: correlation.correlation > 0.7 ? "Alto" : correlation.correlation > 0.5 ? "Medio" : "Basso",
          timestamp: Date.now()
        };
      }
    });
    
    return results;
  }

  // Metodo per ottenere solo i simboli dei commodities
  async getCommoditiesSymbols() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      commodities: ["XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"],
      count: 6
    };
  }

  // Metodo per analisi supply chain specifica
  async getSupplyChainAnalysis(symbol: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const commoditySymbols = ["XAUUSD", "XAGUSD", "CRUDE", "WHEAT", "LITHIUM", "COPPER"];
    
    if (!commoditySymbols.includes(symbol)) {
      throw new Error(`Commodity ${symbol} not supported for supply chain analysis`);
    }
    
    const correlation = this.supplyChainCorrelations[symbol as keyof typeof this.supplyChainCorrelations];
    const marketData = this.demoMarketData[symbol as keyof typeof this.demoMarketData] as CommodityData;
    
    if (!correlation || !marketData) {
      throw new Error(`Supply chain data not found for ${symbol}`);
    }
    
    return {
      symbol,
      analysis: {
        correlation: correlation.correlation,
        riskLevel: correlation.correlation > 0.7 ? "Alto" : correlation.correlation > 0.5 ? "Medio" : "Basso",
        primarySupplier: correlation.primarySupplier,
        supplierConcentration: correlation.regions.length,
        priceVolatility: marketData.spread > 0.1 ? "Alta" : "Media",
        supplyChainStrength: correlation.correlation > 0.6 ? "Forte" : "Debole"
      },
      regions: correlation.regions.map(region => ({
        name: region,
        contribution: Math.random() * 0.4 + 0.2, // Simulato 20-60%
        risk: Math.random() > 0.5 ? "Basso" : "Medio"
      })),
      factors: marketData.supplyChainFactors,
      timestamp: Date.now()
    };
  }

  async getPortfolio() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.demoPortfolio;
  }

  async getPositions() {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      positions: [],
      timestamp: new Date().toISOString()
    };
  }

  async getPortfolioPerformance() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      totalReturn: 0,
      dailyReturn: 0,
      positionsCount: 0,
      profitablePositions: 0,
      unprofitablePositions: 0
    };
  }

  // Metodi per simulare l'utilizzo del capitale
  simulateCapitalUsage(amount: number) {
    this.demoAccountInfo.freeMargin = Math.max(0, this.demoAccountInfo.freeMargin - amount);
    this.demoAccountInfo.equity = this.demoAccountInfo.balance;
  }

  simulateCapitalRelease(amount: number, profit: number = 0) {
    this.demoAccountInfo.freeMargin += amount + profit;
    this.demoAccountInfo.freeMargin = Math.min(this.demoAccountInfo.balance, this.demoAccountInfo.freeMargin);
    this.demoAccountInfo.equity = this.demoAccountInfo.balance;
  }

  resetDemoCapital() {
    this.demoAccountInfo = {
      balance: 100,
      equity: 100,
      margin: 0,
      freeMargin: 100,
      marginLevel: 0,
      currency: "EUR"
    };
  }

  // Aggiorna il capitale disponibile (per simulare depositi/prelievi)
  updateDemoCapital(newBalance: number) {
    const oldBalance = this.demoAccountInfo.balance;
    const difference = newBalance - oldBalance;
    
    this.demoAccountInfo.balance = newBalance;
    this.demoAccountInfo.equity += difference;
    this.demoAccountInfo.freeMargin += difference;
    
    // Assicura che il margine libero non superi il bilancio totale
    this.demoAccountInfo.freeMargin = Math.min(this.demoAccountInfo.freeMargin, newBalance);
  }
}