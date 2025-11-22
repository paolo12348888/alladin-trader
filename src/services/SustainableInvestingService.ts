export interface ESGScore {
  environmental: number; // 0-100
  social: number; // 0-100
  governance: number; // 0-100
  overall: number; // 0-100
}

export interface ClimateRiskMetrics {
  carbonFootprint: number; // tCO2e
  transitionRisk: number; // 0-100
  physicalRisk: number; // 0-100
  climateValueAtRisk: number; // %
  temperatureAlignment: number; // 1.5°C, 2°C, 3°C+
}

export interface SocialImpactMetrics {
  communityScore: number; // 0-100
  humanRightsScore: number; // 0-100
  laborPracticesScore: number; // 0-100
  productResponsibilityScore: number; // 0-100
  stakeholderEngagementScore: number; // 0-100
}

export interface GovernanceMetrics {
  boardComposition: number; // 0-100
  executiveCompensation: number; // 0-100
  shareholderRights: number; // 0-100
  transparencyScore: number; // 0-100
  antiCorruptionScore: number; // 0-100
  ethicsScore: number; // 0-100
}

export interface GreenBond {
  id: string;
  name: string;
  issuer: string;
  amount: number; // in millions
  yield: number; // %
  maturity: string;
  rating: string;
  useOfProceeds: string[];
  climateImpact: string;
}

export interface SustainableDevelopmentGoal {
  id: string;
  title: string;
  target: string;
  score: number; // 0-100
  alignment: number; // 0-100
  investment: number; // percentage
}

export interface PortfolioSustainability {
  totalAssets: number;
  sustainableAssets: number;
  greenBonds: number;
  esgCompliance: number; // %
  carbonIntensity: number; // tCO2e/million USD
  greenRevenue: number; // %
}

export class SustainableInvestingService {
  // Simula una chiamata API per ottenere i dati ESG
  static async getESGScore(portfolioId?: string): Promise<ESGScore> {
    // Simula latenza di rete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dati realistici ispirati al Norwegian Government Pension Fund
    return {
      environmental: Math.floor(Math.random() * 20) + 75, // 75-95
      social: Math.floor(Math.random() * 25) + 70, // 70-95
      governance: Math.floor(Math.random() * 30) + 65, // 65-95
      overall: Math.floor(Math.random() * 15) + 80 // 80-95
    };
  }

  static async getClimateRiskMetrics(ticker?: string): Promise<ClimateRiskMetrics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      carbonFootprint: Math.floor(Math.random() * 150) + 50, // 50-200 tCO2e
      transitionRisk: Math.floor(Math.random() * 40) + 30, // 30-70
      physicalRisk: Math.floor(Math.random() * 50) + 20, // 20-70
      climateValueAtRisk: Math.random() * 15 - 5, // -5% to 10%
      temperatureAlignment: Math.random() > 0.6 ? 2.0 : (Math.random() > 0.3 ? 1.5 : 3.0)
    };
  }

  static async getSocialImpactMetrics(companyId?: string): Promise<SocialImpactMetrics> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      communityScore: Math.floor(Math.random() * 25) + 70,
      humanRightsScore: Math.floor(Math.random() * 30) + 65,
      laborPracticesScore: Math.floor(Math.random() * 35) + 60,
      productResponsibilityScore: Math.floor(Math.random() * 30) + 65,
      stakeholderEngagementScore: Math.floor(Math.random() * 28) + 68
    };
  }

  static async getGovernanceMetrics(companyId?: string): Promise<GovernanceMetrics> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    return {
      boardComposition: Math.floor(Math.random() * 25) + 70,
      executiveCompensation: Math.floor(Math.random() * 40) + 45,
      shareholderRights: Math.floor(Math.random() * 30) + 65,
      transparencyScore: Math.floor(Math.random() * 35) + 60,
      antiCorruptionScore: Math.floor(Math.random() * 28) + 68,
      ethicsScore: Math.floor(Math.random() * 32) + 63
    };
  }

  static async getGreenBonds(): Promise<GreenBond[]> {
    await new Promise(resolve => setTimeout(resolve, 450));
    
    const bonds: GreenBond[] = [
      {
        id: "GB001",
        name: "EU Green Bond 2024",
        issuer: "European Investment Bank",
        amount: 500,
        yield: 2.85,
        maturity: "2030",
        rating: "AAA",
        useOfProceeds: ["Renewable Energy", "Energy Efficiency"],
        climateImpact: "Reduces 750k tCO2e annually"
      },
      {
        id: "GB002",
        name: "Corporate Green Bond",
        issuer: "Microsoft Corporation",
        amount: 800,
        yield: 3.15,
        maturity: "2029",
        rating: "AA+",
        useOfProceeds: ["Carbon Reduction", "Clean Transportation"],
        climateImpact: "Achieves carbon negative by 2030"
      },
      {
        id: "GB003",
        name: "Sustainability Bond",
        issuer: "Apple Inc.",
        amount: 1000,
        yield: 2.95,
        maturity: "2032",
        rating: "AA+",
        useOfProceeds: ["Clean Energy", "Circular Economy"],
        climateImpact: "Net zero emissions by 2030"
      },
      {
        id: "GB004",
        name: "Climate Action Bond",
        issuer: "Banco Santander",
        amount: 400,
        yield: 3.45,
        maturity: "2028",
        rating: "A",
        useOfProceeds: ["Green Buildings", "Sustainable Transport"],
        climateImpact: "1.5°C pathway alignment"
      },
      {
        id: "GB005",
        name: "Transition Bond",
        issuer: "Iberdrola SA",
        amount: 600,
        yield: 2.75,
        maturity: "2031",
        rating: "BBB+",
        useOfProceeds: ["Renewable Energy", "Energy Transition"],
        climateImpact: "100% renewable by 2030"
      }
    ];
    
    return bonds;
  }

  static async getSDGAlignment(): Promise<SustainableDevelopmentGoal[]> {
    await new Promise(resolve => setTimeout(resolve, 380));
    
    const sdgs: SustainableDevelopmentGoal[] = [
      {
        id: "SDG7",
        title: "Affordable and Clean Energy",
        target: "Ensure access to affordable, reliable, sustainable and modern energy for all",
        score: 88,
        alignment: 92,
        investment: 25.5
      },
      {
        id: "SDG13",
        title: "Climate Action",
        target: "Take urgent action to combat climate change and its impacts",
        score: 85,
        alignment: 89,
        investment: 22.8
      },
      {
        id: "SDG8",
        title: "Decent Work and Economic Growth",
        target: "Promote sustained, inclusive and sustainable economic growth",
        score: 76,
        alignment: 81,
        investment: 18.2
      },
      {
        id: "SDG12",
        title: "Responsible Consumption and Production",
        target: "Ensure sustainable consumption and production patterns",
        score: 82,
        alignment: 86,
        investment: 15.7
      },
      {
        id: "SDG9",
        title: "Industry, Innovation and Infrastructure",
        target: "Build resilient infrastructure, promote inclusive industrialization",
        score: 79,
        alignment: 83,
        investment: 12.4
      }
    ];
    
    return sdgs;
  }

  static async getPortfolioSustainability(): Promise<PortfolioSustainability> {
    await new Promise(resolve => setTimeout(resolve, 520));
    
    return {
      totalAssets: 1250000000, // $1.25B
      sustainableAssets: 987500000, // $987.5M (79%)
      greenBonds: 185000000, // $185M
      esgCompliance: 79.2,
      carbonIntensity: 45.8, // tCO2e/million USD
      greenRevenue: 34.5
    };
  }

  static async getSustainabilityHistory(): Promise<{ date: string; esgScore: number; carbonIntensity: number; greenRevenue: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 280));
    
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => ({
      date: `${month} 2024`,
      esgScore: 75 + Math.sin(index * 0.5) * 8 + Math.random() * 6,
      carbonIntensity: 52 - index * 0.8 + Math.random() * 4,
      greenRevenue: 28 + index * 0.6 + Math.random() * 3
    }));
  }

  static async getSectorBreakdown(): Promise<{ sector: string; allocation: number; esgScore: number; carbonIntensity: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 320));
    
    return [
      {
        sector: "Tecnologia Verde",
        allocation: 28.5,
        esgScore: 88,
        carbonIntensity: 32.1
      },
      {
        sector: "Energia Rinnovabile",
        allocation: 22.3,
        esgScore: 91,
        carbonIntensity: 18.5
      },
      {
        sector: "Immobiliare Sostenibile",
        allocation: 15.8,
        esgScore: 84,
        carbonIntensity: 41.2
      },
      {
        sector: "Trasporti Puliti",
        allocation: 12.7,
        esgScore: 82,
        carbonIntensity: 55.8
      },
      {
        sector: "Agricoltura Sostenibile",
        allocation: 8.9,
        esgScore: 76,
        carbonIntensity: 68.3
      },
      {
        sector: "Acqua e Rifiuti",
        allocation: 6.4,
        esgScore: 79,
        carbonIntensity: 38.7
      },
      {
        sector: "Altro",
        allocation: 5.4,
        esgScore: 71,
        carbonIntensity: 85.2
      }
    ];
  }

  static getESGGrade(score: number): string {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    return "D";
  }

  static getClimateRiskLevel(risk: number): string {
    if (risk >= 80) return "Molto Alto";
    if (risk >= 60) return "Alto";
    if (risk >= 40) return "Moderato";
    if (risk >= 20) return "Basso";
    return "Molto Basso";
  }

  static getTemperatureAlignmentLabel(temp: number): string {
    if (temp <= 1.5) return "1.5°C Well Below 2°C";
    if (temp <= 2.0) return "2°C Well Below 2°C";
    return "> 2°C Above 2°C";
  }
}