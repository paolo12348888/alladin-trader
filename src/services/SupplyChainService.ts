// Supply Chain Intelligence Service per Supply Chain Disruption & Commodity Price Prediction Algo
// Simula un sistema completo di monitoraggio supply chain e previsioni prezzi commodities

export interface SupplyChainNode {
  id: string;
  name: string;
  type: 'port' | 'mine' | 'plant' | 'refinery';
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: number; // capacità giornaliera
  currentUtilization: number; // 0-100%
  activityIndex: number; // 0-100, indice di attività real-time
  disruptionProbability: number; // 0-1, probabilità di disruption
  lastUpdate: string;
  riskFactors: string[];
  connectedTo: string[]; // ID dei nodi collegati
}

export interface AlternativeData {
  satellite: {
    location: string;
    activityLevel: number; // 0-100
    congestionScore: number; // 0-100
    infrastructureHealth: number; // 0-100
    timestamp: string;
  }[];
  shipping: {
    route: string;
    freightRate: number;
    tonnage: number;
    expectedDelay: number; // ore
    fuelCostIndex: number;
    timestamp: string;
  }[];
  sentiment: {
    sector: string;
    score: number; // -1 a +1
    volume: number; // volume di menzioni
    trend: 'positive' | 'negative' | 'neutral';
    timestamp: string;
  }[];
}

export interface AlphaSignal {
  id: string;
  symbol: string; // XAUUSD, XAGUSD, CRUDE, etc.
  signal: 'LONG' | 'SHORT';
  confidence: number; // 0-1
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  expectedReturn: number; // percentuale
  timeframe: '1D' | '3D' | '7D' | '10D';
  reasons: string[];
  riskScore: number; // 0-1
  timestamp: string;
  validUntil: string;
  supplyChainFactors: {
    nodeId: string;
    impact: number; // -1 a +1
    weight: number; // 0-1
  }[];
}

export interface RiskAssessment {
  commodity: string;
  overallRisk: number; // 0-1
  disruptionRisk: number; // 0-1
  priceVolatilityRisk: number; // 0-1
  supplyDemandRisk: number; // 0-1
  geopoliticalRisk: number; // 0-1
  factors: {
    factor: string;
    impact: number; // 0-1
    probability: number; // 0-1
    description: string;
  }[];
  mitigationStrategies: string[];
  timestamp: string;
}

export interface CommodityCorrelation {
  commodity: string;
  supplyChainNode: string;
  correlation: number; // -1 a +1
  strength: 'very_strong' | 'strong' | 'moderate' | 'weak' | 'very_weak';
  leadTime: number; // giorni di anticipo
  reliability: number; // 0-1
  lastUpdate: string;
  historicalAccuracy: number; // 0-1
}

export interface PricePrediction {
  symbol: string;
  currentPrice: number;
  predictions: {
    timeframe: string;
    price: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
  }[];
  supplyChainDrivers: {
    driver: string;
    impact: number;
    probability: number;
  }[];
  timestamp: string;
}

export class SupplyChainService {
  private static instance: SupplyChainService;
  private supplyChainNodes: SupplyChainNode[] = [];
  private alternativeData: AlternativeData = { satellite: [], shipping: [], sentiment: [] };
  private lastUpdate: Date = new Date();

  private constructor() {
    this.initializeSupplyChainData();
    this.generateAlternativeData();
    this.startRealTimeUpdates();
  }

  public static getInstance(): SupplyChainService {
    if (!SupplyChainService.instance) {
      SupplyChainService.instance = new SupplyChainService();
    }
    return SupplyChainService.instance;
  }

  // ==================== INIZIALIZZAZIONE DATI ====================
  
  private initializeSupplyChainData(): void {
    this.supplyChainNodes = [
      // PORTS GLOBALI
      {
        id: 'port-shanghai',
        name: 'Port of Shanghai',
        type: 'port',
        location: 'Shanghai',
        country: 'Cina',
        coordinates: { lat: 31.2304, lng: 121.4737 },
        capacity: 43000000, // TEU annuali
        currentUtilization: 87,
        activityIndex: 92,
        disruptionProbability: 0.15,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['COVID-19 outbreaks', 'Trade tensions', 'Port congestion'],
        connectedTo: ['port-losangeles', 'port-rotterdam']
      },
      {
        id: 'port-rotterdam',
        name: 'Port of Rotterdam',
        type: 'port',
        location: 'Rotterdam',
        country: 'Paesi Bassi',
        coordinates: { lat: 51.9244, lng: 4.4777 },
        capacity: 15000000,
        currentUtilization: 78,
        activityIndex: 85,
        disruptionProbability: 0.08,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Energy crisis', 'Labor strikes', 'Weather disruptions'],
        connectedTo: ['port-shanghai', 'port-singapore']
      },
      {
        id: 'port-losangeles',
        name: 'Port of Los Angeles',
        type: 'port',
        location: 'Los Angeles',
        country: 'USA',
        coordinates: { lat: 33.7406, lng: -118.2756 },
        capacity: 10000000,
        currentUtilization: 82,
        activityIndex: 88,
        disruptionProbability: 0.12,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Supply chain bottlenecks', 'Labor shortages', 'Chassis shortages'],
        connectedTo: ['port-shanghai', 'port-singapore']
      },
      {
        id: 'port-singapore',
        name: 'Port of Singapore',
        type: 'port',
        location: 'Singapore',
        country: 'Singapore',
        coordinates: { lat: 1.2966, lng: 103.7764 },
        capacity: 37000000,
        currentUtilization: 75,
        activityIndex: 80,
        disruptionProbability: 0.06,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Geopolitical tensions', 'Piracy concerns', 'Channel congestion'],
        connectedTo: ['port-rotterdam', 'port-dubai']
      },
      {
        id: 'port-dubai',
        name: 'Port of Jebel Ali',
        type: 'port',
        location: 'Dubai',
        country: 'UAE',
        coordinates: { lat: 25.0133, lng: 55.0669 },
        capacity: 19000000,
        currentUtilization: 73,
        activityIndex: 78,
        disruptionProbability: 0.09,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Regional conflicts', 'Fuel price volatility', 'Shipping lane security'],
        connectedTo: ['port-singapore', 'port-rotterdam']
      },

      // MINIERE LITIO
      {
        id: 'mine-salardeuyuni',
        name: 'Salar de Uyuni',
        type: 'mine',
        location: 'Uyuni',
        country: 'Bolivia',
        coordinates: { lat: -20.1338, lng: -67.4891 },
        capacity: 15000, // tonnellate annue
        currentUtilization: 65,
        activityIndex: 70,
        disruptionProbability: 0.25,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Political instability', 'Environmental concerns', 'Infrastructure limitations'],
        connectedTo: ['port-rotterdam', 'port-losangeles']
      },
      {
        id: 'mine-greenbushes',
        name: 'Greenbushes Lithium Mine',
        type: 'mine',
        location: 'Greenbushes',
        country: 'Australia',
        coordinates: { lat: -33.3387, lng: 116.0587 },
        capacity: 135000,
        currentUtilization: 92,
        activityIndex: 95,
        disruptionProbability: 0.05,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Weather events', 'Equipment maintenance', 'Worker availability'],
        connectedTo: ['port-singapore', 'port-losangeles']
      },
      {
        id: 'mine-cobolt-blue',
        name: 'Tenke Fungurume',
        type: 'mine',
        location: 'Tenke',
        country: 'Repubblica Democratica del Congo',
        coordinates: { lat: -10.6056, lng: 26.1667 },
        capacity: 180000, // tonnellate cobalto
        currentUtilization: 78,
        activityIndex: 82,
        disruptionProbability: 0.30,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Political instability', 'Security concerns', 'Infrastructure challenges'],
        connectedTo: ['port-rotterdam', 'port-dubai']
      },

      // MINIERE RAME
      {
        id: 'mine-lasbambas',
        name: 'Las Bambas',
        type: 'mine',
        location: 'Apurímac',
        country: 'Perù',
        coordinates: { lat: -14.0833, lng: -72.2500 },
        capacity: 400000,
        currentUtilization: 85,
        activityIndex: 88,
        disruptionProbability: 0.18,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Community protests', 'Environmental regulations', 'Transportation disruptions'],
        connectedTo: ['port-losangeles', 'port-rotterdam']
      },

      // IMPIANTI PETROLIO
      {
        id: 'plant-texas',
        name: 'Texas Gulf Coast Refineries',
        type: 'refinery',
        location: 'Houston',
        country: 'USA',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        capacity: 2800000, // barili/gorno
        currentUtilization: 88,
        activityIndex: 90,
        disruptionProbability: 0.12,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Hurricane season', 'Hurricane risk', 'Equipment failures', 'Labor disputes'],
        connectedTo: ['port-losangeles']
      },
      {
        id: 'plant-arabiansaudi',
        name: 'Saudi Aramco Facilities',
        type: 'refinery',
        location: 'Ras Tanura',
        country: 'Arabia Saudita',
        coordinates: { lat: 26.7269, lng: 50.0359 },
        capacity: 4200000,
        currentUtilization: 85,
        activityIndex: 87,
        disruptionProbability: 0.10,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Geopolitical tensions', 'Regional conflicts', 'Equipment maintenance'],
        connectedTo: ['port-dubai']
      },

      // IMPIANTI GRANO
      {
        id: 'plant-kansas',
        name: 'Kansas Grain Elevators',
        type: 'plant',
        location: 'Wichita',
        country: 'USA',
        coordinates: { lat: 37.6872, lng: -97.3301 },
        capacity: 850000, // bushels/gorno
        currentUtilization: 76,
        activityIndex: 80,
        disruptionProbability: 0.08,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Weather conditions', 'Storage capacity', 'Transportation availability'],
        connectedTo: ['port-losangeles', 'port-rotterdam']
      },
      {
        id: 'plant-ukraine',
        name: 'Ukrainian Grain Terminals',
        type: 'plant',
        location: 'Odessa',
        country: 'Ucraina',
        coordinates: { lat: 46.4825, lng: 30.7233 },
        capacity: 1200000,
        currentUtilization: 45,
        activityIndex: 55,
        disruptionProbability: 0.40,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['War conflict', 'Infrastructure damage', 'Export restrictions', 'Security risks'],
        connectedTo: ['port-rotterdam', 'port-dubai']
      },

      // MINIERE ORO
      {
        id: 'mine-witwatersrand',
        name: 'Witwatersrand Gold Mines',
        type: 'mine',
        location: 'Johannesburg',
        country: 'Sudafrica',
        coordinates: { lat: -26.2041, lng: 28.0473 },
        capacity: 295000, // chilogrammi annui
        currentUtilization: 82,
        activityIndex: 85,
        disruptionProbability: 0.22,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Power outages', 'Safety incidents', 'Labor unrest', 'Environmental regulations'],
        connectedTo: ['port-rotterdam', 'port-dubai']
      },

      // MINIERE ARGENTO
      {
        id: 'mine-fresnillo',
        name: 'Fresnillo Silver Mine',
        type: 'mine',
        location: 'Fresnillo',
        country: 'Messico',
        coordinates: { lat: 23.1723, lng: -102.8610 },
        capacity: 52000, // tonnellate annue
        currentUtilization: 88,
        activityIndex: 91,
        disruptionProbability: 0.15,
        lastUpdate: new Date().toISOString(),
        riskFactors: ['Water scarcity', 'Community relations', 'Regulatory changes'],
        connectedTo: ['port-losangeles', 'port-rotterdam']
      }
    ];
  }

  private generateAlternativeData(): void {
    // Dati satellite
    this.alternativeData.satellite = [
      { location: 'Shanghai Port', activityLevel: 92, congestionScore: 78, infrastructureHealth: 85, timestamp: new Date().toISOString() },
      { location: 'Rotterdam Port', activityLevel: 85, congestionScore: 45, infrastructureHealth: 90, timestamp: new Date().toISOString() },
      { location: 'Los Angeles Port', activityLevel: 88, congestionScore: 72, infrastructureHealth: 82, timestamp: new Date().toISOString() },
      { location: 'Singapore Port', activityLevel: 80, congestionScore: 38, infrastructureHealth: 95, timestamp: new Date().toISOString() },
      { location: 'Texas Refineries', activityLevel: 90, congestionScore: 25, infrastructureHealth: 88, timestamp: new Date().toISOString() },
      { location: 'Greenbushes Mine', activityLevel: 95, congestionScore: 15, infrastructureHealth: 92, timestamp: new Date().toISOString() }
    ];

    // Dati shipping
    this.alternativeData.shipping = [
      { route: 'Shanghai-Rotterdam', freightRate: 2850, tonnage: 15000, expectedDelay: 2, fuelCostIndex: 115, timestamp: new Date().toISOString() },
      { route: 'Los Angeles-Rotterdam', freightRate: 3200, tonnage: 12000, expectedDelay: 1, fuelCostIndex: 118, timestamp: new Date().toISOString() },
      { route: 'Singapore-Rotterdam', freightRate: 2100, tonnage: 18000, expectedDelay: 3, fuelCostIndex: 112, timestamp: new Date().toISOString() },
      { route: 'Dubai-Rotterdam', freightRate: 1900, tonnage: 8000, expectedDelay: 1, fuelCostIndex: 110, timestamp: new Date().toISOString() }
    ];

    // Dati sentiment
    this.alternativeData.sentiment = [
      { sector: 'Gold Mining', score: 0.65, volume: 12500, trend: 'positive', timestamp: new Date().toISOString() },
      { sector: 'Oil & Gas', score: 0.45, volume: 8900, trend: 'positive', timestamp: new Date().toISOString() },
      { sector: 'Lithium Battery', score: 0.78, volume: 15600, trend: 'positive', timestamp: new Date().toISOString() },
      { sector: 'Copper Mining', score: 0.25, volume: 9800, trend: 'positive', timestamp: new Date().toISOString() },
      { sector: 'Agriculture', score: -0.15, volume: 7200, trend: 'negative', timestamp: new Date().toISOString() },
      { sector: 'Shipping', score: 0.35, volume: 5600, trend: 'positive', timestamp: new Date().toISOString() }
    ];
  }

  private startRealTimeUpdates(): void {
    // Aggiorna i dati ogni 30 secondi per simulare real-time
    setInterval(() => {
      this.updateRealTimeData();
    }, 30000);
  }

  private updateRealTimeData(): void {
    this.supplyChainNodes.forEach(node => {
      // Simula variazioni real-time (±5%)
      const variation = (Math.random() - 0.5) * 10;
      node.activityIndex = Math.max(0, Math.min(100, node.activityIndex + variation));
      node.currentUtilization = Math.max(0, Math.min(100, node.currentUtilization + variation * 0.5));
      
      // Simula variazioni nella probabilità di disruption (±3%)
      const disruptionVariation = (Math.random() - 0.5) * 0.06;
      node.disruptionProbability = Math.max(0, Math.min(1, node.disruptionProbability + disruptionVariation));
      
      node.lastUpdate = new Date().toISOString();
    });

    // Aggiorna sentiment
    this.alternativeData.sentiment.forEach(sentiment => {
      const variation = (Math.random() - 0.5) * 0.1;
      sentiment.score = Math.max(-1, Math.min(1, sentiment.score + variation));
      sentiment.timestamp = new Date().toISOString();
    });

    this.lastUpdate = new Date();
  }

  // ==================== METODI PUBBLICI ====================

  public async getSupplyChainNodes(): Promise<SupplyChainNode[]> {
    // Simula delay API
    await new Promise(resolve => setTimeout(resolve, 150));
    return JSON.parse(JSON.stringify(this.supplyChainNodes));
  }

  public async getAlternativeData(): Promise<AlternativeData> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(this.alternativeData));
  }

  public async generateAlphaSignals(): Promise<AlphaSignal[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const signals: AlphaSignal[] = [
      {
        id: 'signal-xauusd-001',
        symbol: 'XAUUSD',
        signal: 'LONG',
        confidence: 0.78,
        entryPrice: 2018.45,
        targetPrice: 2055.00,
        stopLoss: 2002.00,
        expectedReturn: 1.81,
        timeframe: '3D',
        reasons: [
          'South Africa gold mines disruption risk +22%',
          'Positive sentiment in gold sector (+0.65)',
          'Port congestion increasing costs',
          'Geopolitical tensions supporting safe-haven demand'
        ],
        riskScore: 0.25,
        timestamp: new Date().toISOString(),
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        supplyChainFactors: [
          { nodeId: 'mine-witwatersrand', impact: 0.35, weight: 0.8 },
          { nodeId: 'port-rotterdam', impact: 0.15, weight: 0.3 },
          { nodeId: 'port-shanghai', impact: 0.10, weight: 0.2 }
        ]
      },
      {
        id: 'signal-crude-001',
        symbol: 'CRUDE',
        signal: 'SHORT',
        confidence: 0.82,
        entryPrice: 78.34,
        targetPrice: 74.50,
        stopLoss: 80.20,
        expectedReturn: -4.90,
        timeframe: '7D',
        reasons: [
          'Texas refineries utilization at 88%, capacity concerns',
          'Saudi Arabia supply increase signals',
          'Shipping freight rates declining (-8%)',
          'Oil sentiment cooling (0.45 from 0.65)'
        ],
        riskScore: 0.30,
        timestamp: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        supplyChainFactors: [
          { nodeId: 'plant-texas', impact: -0.40, weight: 0.9 },
          { nodeId: 'plant-arabiansaudi', impact: -0.25, weight: 0.7 },
          { nodeId: 'port-dubai', impact: -0.15, weight: 0.4 }
        ]
      },
      {
        id: 'signal-lithium-001',
        symbol: 'LITHIUM',
        signal: 'LONG',
        confidence: 0.85,
        entryPrice: 45600,
        targetPrice: 48900,
        stopLoss: 44200,
        expectedReturn: 7.24,
        timeframe: '10D',
        reasons: [
          'Greenbushes mine utilization 92%, near capacity',
          'Battery sector sentiment very positive (+0.78)',
          'EV demand acceleration continuing',
          'Supply constraints in Q1 2024 expected'
        ],
        riskScore: 0.20,
        timestamp: new Date().toISOString(),
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        supplyChainFactors: [
          { nodeId: 'mine-greenbushes', impact: 0.45, weight: 0.95 },
          { nodeId: 'port-singapore', impact: 0.20, weight: 0.5 },
          { nodeId: 'port-losangeles', impact: 0.15, weight: 0.3 }
        ]
      },
      {
        id: 'signal-wheat-001',
        symbol: 'WHEAT',
        signal: 'LONG',
        confidence: 0.72,
        entryPrice: 587.25,
        targetPrice: 612.50,
        stopLoss: 575.00,
        expectedReturn: 4.30,
        timeframe: '7D',
        reasons: [
          'Ukraine port activity at 45%, historical low',
          'Kansas grain elevators at 76% capacity',
          'Global food security concerns rising',
          'Weather disruptions in key growing regions'
        ],
        riskScore: 0.35,
        timestamp: new Date().toISOString(),
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        supplyChainFactors: [
          { nodeId: 'plant-ukraine', impact: 0.50, weight: 0.8 },
          { nodeId: 'plant-kansas', impact: 0.25, weight: 0.6 },
          { nodeId: 'port-rotterdam', impact: 0.15, weight: 0.4 }
        ]
      },
      {
        id: 'signal-copper-001',
        symbol: 'COPPER',
        signal: 'SHORT',
        confidence: 0.68,
        entryPrice: 3.8245,
        targetPrice: 3.6920,
        stopLoss: 3.8900,
        expectedReturn: -3.46,
        timeframe: '7D',
        reasons: [
          'Las Bambas mine protests, 18% disruption risk',
          'China manufacturing PMI cooling',
          'Infrastructure spending concerns',
          'Shipping delays improving, reducing costs'
        ],
        riskScore: 0.40,
        timestamp: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        supplyChainFactors: [
          { nodeId: 'mine-lasbambas', impact: -0.35, weight: 0.7 },
          { nodeId: 'port-losangeles', impact: -0.20, weight: 0.5 },
          { nodeId: 'port-shanghai', impact: -0.10, weight: 0.3 }
        ]
      }
    ];

    return signals;
  }

  public async assessRisk(): Promise<RiskAssessment[]> {
    await new Promise(resolve => setTimeout(resolve, 250));

    const assessments: RiskAssessment[] = [
      {
        commodity: 'XAUUSD',
        overallRisk: 0.35,
        disruptionRisk: 0.28,
        priceVolatilityRisk: 0.42,
        supplyDemandRisk: 0.31,
        geopoliticalRisk: 0.45,
        factors: [
          {
            factor: 'South Africa Gold Mines Power Issues',
            impact: 0.35,
            probability: 0.22,
            description: 'Ongoing power outages affecting 22% of gold production capacity'
          },
          {
            factor: 'Shipping Cost Inflation',
            impact: 0.25,
            probability: 0.85,
            description: 'Port congestion increasing shipping costs by 15-20%'
          },
          {
            factor: 'Central Bank Gold Purchases',
            impact: -0.30,
            probability: 0.90,
            description: 'Strong demand from central banks supporting prices'
          }
        ],
        mitigationStrategies: [
          'Monitor South Africa infrastructure developments',
          'Track central bank gold purchase patterns',
          'Watch for geopolitical risk escalations'
        ],
        timestamp: new Date().toISOString()
      },
      {
        commodity: 'CRUDE',
        overallRisk: 0.52,
        disruptionRisk: 0.45,
        priceVolatilityRisk: 0.58,
        supplyDemandRisk: 0.48,
        geopoliticalRisk: 0.62,
        factors: [
          {
            factor: 'Texas Hurricane Season',
            impact: 0.40,
            probability: 0.15,
            description: 'Peak hurricane season approaching Gulf Coast refineries'
          },
          {
            factor: 'OPEC+ Production Decisions',
            impact: 0.35,
            probability: 0.70,
            description: 'Potential production cuts or increases from OPEC+ nations'
          },
          {
            factor: 'China Demand Recovery',
            impact: -0.25,
            probability: 0.80,
            description: 'Chinese oil demand showing signs of recovery'
          }
        ],
        mitigationStrategies: [
          'Monitor weather forecasts for Gulf Coast',
          'Track OPEC+ meeting announcements',
          'Follow Chinese economic indicators'
        ],
        timestamp: new Date().toISOString()
      },
      {
        commodity: 'LITHIUM',
        overallRisk: 0.28,
        disruptionRisk: 0.22,
        priceVolatilityRisk: 0.35,
        supplyDemandRisk: 0.45,
        geopoliticalRisk: 0.18,
        factors: [
          {
            factor: 'Greenbushes Mine Capacity Constraints',
            impact: 0.45,
            probability: 0.92,
            description: 'Operating at 92% capacity with limited expansion options'
          },
          {
            factor: 'EV Battery Demand Surge',
            impact: -0.40,
            probability: 0.95,
            description: 'Accelerating EV adoption driving lithium demand'
          },
          {
            factor: 'Australia-China Trade Tensions',
            impact: 0.25,
            probability: 0.40,
            description: 'Potential restrictions on Australian lithium exports to China'
          }
        ],
        mitigationStrategies: [
          'Monitor Greenbushes production reports',
          'Track EV sales and battery factory announcements',
          'Watch for trade policy developments'
        ],
        timestamp: new Date().toISOString()
      }
    ];

    return assessments;
  }

  public async getCommodityCorrelations(): Promise<CommodityCorrelation[]> {
    await new Promise(resolve => setTimeout(resolve, 180));

    const correlations: CommodityCorrelation[] = [
      {
        commodity: 'XAUUSD',
        supplyChainNode: 'mine-witwatersrand',
        correlation: 0.68,
        strength: 'strong',
        leadTime: 2,
        reliability: 0.82,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.78
      },
      {
        commodity: 'XAUUSD',
        supplyChainNode: 'port-rotterdam',
        correlation: 0.45,
        strength: 'moderate',
        leadTime: 1,
        reliability: 0.75,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.71
      },
      {
        commodity: 'CRUDE',
        supplyChainNode: 'plant-texas',
        correlation: 0.72,
        strength: 'strong',
        leadTime: 0,
        reliability: 0.88,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.85
      },
      {
        commodity: 'CRUDE',
        supplyChainNode: 'plant-arabiansaudi',
        correlation: 0.65,
        strength: 'strong',
        leadTime: 1,
        reliability: 0.83,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.79
      },
      {
        commodity: 'LITHIUM',
        supplyChainNode: 'mine-greenbushes',
        correlation: 0.82,
        strength: 'very_strong',
        leadTime: 3,
        reliability: 0.91,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.86
      },
      {
        commodity: 'LITHIUM',
        supplyChainNode: 'port-singapore',
        correlation: 0.58,
        strength: 'moderate',
        leadTime: 2,
        reliability: 0.77,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.73
      },
      {
        commodity: 'WHEAT',
        supplyChainNode: 'plant-ukraine',
        correlation: 0.75,
        strength: 'strong',
        leadTime: 5,
        reliability: 0.79,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.82
      },
      {
        commodity: 'WHEAT',
        supplyChainNode: 'plant-kansas',
        correlation: 0.52,
        strength: 'moderate',
        leadTime: 1,
        reliability: 0.85,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.76
      },
      {
        commodity: 'COPPER',
        supplyChainNode: 'mine-lasbambas',
        correlation: 0.63,
        strength: 'strong',
        leadTime: 2,
        reliability: 0.74,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.71
      },
      {
        commodity: 'XAGUSD',
        supplyChainNode: 'mine-fresnillo',
        correlation: 0.55,
        strength: 'moderate',
        leadTime: 1,
        reliability: 0.68,
        lastUpdate: new Date().toISOString(),
        historicalAccuracy: 0.64
      }
    ];

    return correlations;
  }

  public async getPredictions(): Promise<PricePrediction[]> {
    await new Promise(resolve => setTimeout(resolve, 220));

    const predictions: PricePrediction[] = [
      {
        symbol: 'XAUUSD',
        currentPrice: 2018.45,
        predictions: [
          {
            timeframe: '1D',
            price: 2025.30,
            confidence: 0.82,
            upperBound: 2042.15,
            lowerBound: 2008.45
          },
          {
            timeframe: '3D',
            price: 2055.00,
            confidence: 0.78,
            upperBound: 2078.20,
            lowerBound: 2031.80
          },
          {
            timeframe: '7D',
            price: 2078.50,
            confidence: 0.72,
            upperBound: 2112.30,
            lowerBound: 2044.70
          },
          {
            timeframe: '10D',
            price: 2095.25,
            confidence: 0.68,
            upperBound: 2138.90,
            lowerBound: 2051.60
          }
        ],
        supplyChainDrivers: [
          { driver: 'South Africa gold mines disruption', impact: 0.35, probability: 0.22 },
          { driver: 'Port shipping cost inflation', impact: 0.25, probability: 0.85 },
          { driver: 'Central bank purchases', impact: -0.30, probability: 0.90 }
        ],
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'CRUDE',
        currentPrice: 78.34,
        predictions: [
          {
            timeframe: '1D',
            price: 77.85,
            confidence: 0.78,
            upperBound: 78.92,
            lowerBound: 76.78
          },
          {
            timeframe: '3D',
            price: 76.50,
            confidence: 0.82,
            upperBound: 77.68,
            lowerBound: 75.32
          },
          {
            timeframe: '7D',
            price: 74.50,
            confidence: 0.82,
            upperBound: 76.25,
            lowerBound: 72.75
          },
          {
            timeframe: '10D',
            price: 73.20,
            confidence: 0.75,
            upperBound: 75.80,
            lowerBound: 70.60
          }
        ],
        supplyChainDrivers: [
          { driver: 'Texas refinery capacity concerns', impact: -0.40, probability: 0.88 },
          { driver: 'OPEC+ production signals', impact: 0.20, probability: 0.70 },
          { driver: 'China demand recovery', impact: -0.25, probability: 0.80 }
        ],
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'LITHIUM',
        currentPrice: 45600,
        predictions: [
          {
            timeframe: '1D',
            price: 46200,
            confidence: 0.85,
            upperBound: 46800,
            lowerBound: 45600
          },
          {
            timeframe: '3D',
            price: 47100,
            confidence: 0.85,
            upperBound: 47950,
            lowerBound: 46250
          },
          {
            timeframe: '7D',
            price: 48200,
            confidence: 0.82,
            upperBound: 49300,
            lowerBound: 47100
          },
          {
            timeframe: '10D',
            price: 48900,
            confidence: 0.85,
            upperBound: 50200,
            lowerBound: 47600
          }
        ],
        supplyChainDrivers: [
          { driver: 'Greenbushes capacity constraints', impact: 0.45, probability: 0.92 },
          { driver: 'EV demand surge', impact: -0.40, probability: 0.95 },
          { driver: 'Australia-China trade tensions', impact: 0.15, probability: 0.40 }
        ],
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'WHEAT',
        currentPrice: 587.25,
        predictions: [
          {
            timeframe: '1D',
            price: 592.50,
            confidence: 0.75,
            upperBound: 598.75,
            lowerBound: 586.25
          },
          {
            timeframe: '3D',
            price: 605.00,
            confidence: 0.72,
            upperBound: 613.50,
            lowerBound: 596.50
          },
          {
            timeframe: '7D',
            price: 615.50,
            confidence: 0.68,
            upperBound: 627.25,
            lowerBound: 603.75
          },
          {
            timeframe: '10D',
            price: 622.00,
            confidence: 0.65,
            upperBound: 638.50,
            lowerBound: 605.50
          }
        ],
        supplyChainDrivers: [
          { driver: 'Ukraine port disruption', impact: 0.50, probability: 0.40 },
          { driver: 'Kansas storage capacity', impact: 0.25, probability: 0.76 },
          { driver: 'Global food security concerns', impact: 0.35, probability: 0.85 }
        ],
        timestamp: new Date().toISOString()
      }
    ];

    return predictions;
  }

  // ==================== METODI DI SUPPORTO ====================

  public getNodesByType(type: 'port' | 'mine' | 'plant' | 'refinery'): SupplyChainNode[] {
    return this.supplyChainNodes.filter(node => node.type === type);
  }

  public getNodesByCountry(country: string): SupplyChainNode[] {
    return this.supplyChainNodes.filter(node => 
      node.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  public getHighRiskNodes(threshold: number = 0.2): SupplyChainNode[] {
    return this.supplyChainNodes.filter(node => node.disruptionProbability >= threshold);
  }

  public getActiveNodes(utilizationThreshold: number = 70): SupplyChainNode[] {
    return this.supplyChainNodes.filter(node => node.currentUtilization >= utilizationThreshold);
  }

  public getLastUpdateTime(): string {
    return this.lastUpdate.toISOString();
  }

  public async getNodeById(id: string): Promise<SupplyChainNode | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.supplyChainNodes.find(node => node.id === id) || null;
  }

  public async getSupplyChainHealth(): Promise<{
    overall: number;
    ports: number;
    mines: number;
    plants: number;
    refineries: number;
    timestamp: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const ports = this.getNodesByType('port');
    const mines = this.getNodesByType('mine');
    const plants = this.getNodesByType('plant');
    const refineries = this.getNodesByType('refinery');

    const avgActivity = (nodes: SupplyChainNode[]) => 
      nodes.reduce((sum, node) => sum + node.activityIndex, 0) / nodes.length;

    const avgDisruption = (nodes: SupplyChainNode[]) => 
      nodes.reduce((sum, node) => sum + node.disruptionProbability, 0) / nodes.length;

    const healthScore = (activity: number, disruption: number) => 
      (activity / 100) * (1 - disruption);

    const overall = healthScore(avgActivity(this.supplyChainNodes), avgDisruption(this.supplyChainNodes));

    return {
      overall: Math.round(overall * 100),
      ports: Math.round(healthScore(avgActivity(ports), avgDisruption(ports)) * 100),
      mines: Math.round(healthScore(avgActivity(mines), avgDisruption(mines)) * 100),
      plants: Math.round(healthScore(avgActivity(plants), avgDisruption(plants)) * 100),
      refineries: Math.round(healthScore(avgActivity(refineries), avgDisruption(refineries)) * 100),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const supplyChainService = SupplyChainService.getInstance();