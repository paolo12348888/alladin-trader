// Sistema di Gestione Capitale per Hedge Fund Algorithms
import { XTBApiService } from './xtbApi';

export interface CapitalAllocation {
  algorithmId: string;
  algorithmName: string;
  allocatedCapital: number;
  usedCapital: number;
  availableCapital: number;
  maxPositionSize: number;
  riskPercentage: number;
  isActive: boolean;
}

export interface CapitalSettings {
  totalAvailableCapital: number;
  riskTolerance: number; // 0.01 = 1% di rischio per trade
  maxDrawdown: number; // 0.05 = 5% drawdown massimo
  emergencyStopLevel: number; // 0.10 = stop automatico al 10% di perdita
  algorithmsAllocation: CapitalAllocation[];
}

export interface TradingLimits {
  maxPositionSize: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
  maxRiskPerTrade: number;
}

export class CapitalManager {
  private xtbApi: XTBApiService;
  private currentSettings: CapitalSettings | null = null;
  private activeAllocations: Map<string, CapitalAllocation> = new Map();

  constructor(xtbApi: XTBApiService) {
    this.xtbApi = xtbApi;
  }

  /**
   * Inizializza la gestione del capitale con la configurazione fornita
   */
  async initializeCapital(settings: CapitalSettings): Promise<void> {
    this.currentSettings = settings;
    
    // Valida le impostazioni
    await this.validateSettings(settings);
    
    // Ottieni il capitale attuale dal conto XTB
    await this.updateCapitalFromXTB();
    
    // Inizializza le allocazioni per ogni algoritmo
    this.initializeAllocations();
    
    console.log('💰 Capital Manager initialized:', settings);
  }

  /**
   * Ottiene il capitale disponibile dal conto XTB
   */
  private async updateCapitalFromXTB(): Promise<void> {
    try {
      const accountInfo = await this.xtbApi.getAccountInfo();
      const availableCapital = Math.min(accountInfo.freeMargin, accountInfo.equity); // Usa tutto l'equity disponibile
      
      if (this.currentSettings) {
        this.currentSettings.totalAvailableCapital = availableCapital;
      }
      
      console.log(`💰 Available capital from XTB: €${availableCapital.toFixed(2)}`);
    } catch (error) {
      console.error('❌ Error fetching capital from XTB:', error);
      throw new Error('Impossibile ottenere il capitale dal conto XTB');
    }
  }

  /**
   * Inizializza le allocazioni per tutti gli algoritmi
   */
  private initializeAllocations(): void {
    if (!this.currentSettings) return;

    this.currentSettings.algorithmsAllocation.forEach(allocation => {
      // Calcola il capitale allocato per questo algoritmo
      const baseAllocation = this.currentSettings!.totalAvailableCapital * 
                            (allocation.riskPercentage / 100);
      
      // Aggiorna l'allocazione
      const updatedAllocation: CapitalAllocation = {
        ...allocation,
        allocatedCapital: baseAllocation,
        usedCapital: 0,
        availableCapital: baseAllocation,
        maxPositionSize: baseAllocation * 0.1, // Max 10% per singola posizione
        isActive: true
      };
      
      this.activeAllocations.set(allocation.algorithmId, updatedAllocation);
    });
  }

  /**
   * Verifica se un algoritmo può aprire una nuova posizione
   */
  canOpenPosition(algorithmId: string, proposedAmount: number): {
    canOpen: boolean;
    reason?: string;
    suggestedAmount?: number;
  } {
    const allocation = this.activeAllocations.get(algorithmId);
    
    if (!allocation) {
      return { canOpen: false, reason: 'Algoritmo non trovato' };
    }

    if (!allocation.isActive) {
      return { canOpen: false, reason: 'Algoritmo non attivo' };
    }

    if (proposedAmount > allocation.availableCapital) {
      return { 
        canOpen: false, 
        reason: 'Capitale insufficiente',
        suggestedAmount: allocation.availableCapital 
      };
    }

    if (proposedAmount > allocation.maxPositionSize) {
      return { 
        canOpen: false, 
        reason: 'Posizione troppo grande',
        suggestedAmount: allocation.maxPositionSize 
      };
    }

    // Controlla limite di drawdown globale
    const currentDrawdown = this.getCurrentDrawdown();
    if (currentDrawdown > this.currentSettings!.maxDrawdown) {
      return { 
        canOpen: false, 
        reason: `Drawdown massimo raggiunto: ${(currentDrawdown * 100).toFixed(2)}%` 
      };
    }

    return { canOpen: true };
  }

  /**
   * Alloca capitale per una nuova posizione
   */
  allocateCapital(algorithmId: string, amount: number): boolean {
    const allocation = this.activeAllocations.get(algorithmId);
    
    if (!allocation) {
      throw new Error(`Algoritmo ${algorithmId} non trovato`);
    }

    const canOpen = this.canOpenPosition(algorithmId, amount);
    if (!canOpen.canOpen) {
      throw new Error(`Impossibile aprire posizione: ${canOpen.reason}`);
    }

    // Aggiorna l'allocazione
    allocation.usedCapital += amount;
    allocation.availableCapital -= amount;
    
    this.activeAllocations.set(algorithmId, allocation);
    
    console.log(`💰 Allocated €${amount} to ${allocation.algorithmName}`);
    console.log(`📊 Remaining: €${allocation.availableCapital} (${allocation.algorithmName})`);
    
    return true;
  }

  /**
   * Libera capitale quando una posizione viene chiusa
   */
  releaseCapital(algorithmId: string, amount: number, profit: number = 0): void {
    const allocation = this.activeAllocations.get(algorithmId);
    
    if (!allocation) {
      console.warn(`⚠️ Algoritmo ${algorithmId} non trovato per release capitale`);
      return;
    }

    // Aggiorna l'allocazione
    allocation.usedCapital -= amount;
    allocation.availableCapital += amount + profit; // Aggiungi eventuali profitti
    
    // Evita valori negativi
    allocation.availableCapital = Math.max(0, allocation.availableCapital);
    
    this.activeAllocations.set(algorithmId, allocation);
    
    console.log(`💰 Released €${amount} + €${profit} profit from ${allocation.algorithmName}`);
  }

  /**
   * Calcola il drawdown attuale
   */
  private getCurrentDrawdown(): number {
    if (!this.currentSettings) return 0;
    
    try {
      // In una implementazione reale, questo dovrebbe calcolare il drawdown basato
      // sui dati storici delle performance
      // Per ora, usiamo una stima basata sul rapporto equity/balance
      const estimatedDrawdown = 0.02; // 2% stima
      return estimatedDrawdown;
    } catch {
      return 0;
    }
  }

  /**
   * Ottiene lo stato del capitale per tutti gli algoritmi
   */
  getCapitalStatus(): CapitalAllocation[] {
    return Array.from(this.activeAllocations.values());
  }

  /**
   * Ottiene i dati del conto XTB
   */
  async getCurrentCapital(): Promise<{
    balance: number;
    equity: number;
    freeMargin: number;
    margin: number;
    marginLevel: number;
  }> {
    const accountInfo = await this.xtbApi.getAccountInfo();
    return {
      balance: accountInfo.balance,
      equity: accountInfo.equity,
      freeMargin: accountInfo.freeMargin,
      margin: accountInfo.margin,
      marginLevel: accountInfo.marginLevel
    };
  }

  /**
   * Ottiene il resoconto completo del capitale
   */
  async getCapitalReport(): Promise<{
    totalCapital: number;
    allocatedCapital: number;
    availableCapital: number;
    usedCapital: number;
    algorithms: CapitalAllocation[];
  }> {
    await this.updateCapitalFromXTB();
    
    const algorithms = this.getCapitalStatus();
    const allocatedCapital = algorithms.reduce((sum, algo) => sum + algo.allocatedCapital, 0);
    const usedCapital = algorithms.reduce((sum, algo) => sum + algo.usedCapital, 0);
    const availableCapital = algorithms.reduce((sum, algo) => sum + algo.availableCapital, 0);

    return {
      totalCapital: this.currentSettings?.totalAvailableCapital || 0,
      allocatedCapital,
      availableCapital,
      usedCapital,
      algorithms
    };
  }

  /**
   * Pausa un algoritmo e libera il suo capitale
   */
  pauseAlgorithm(algorithmId: string): void {
    const allocation = this.activeAllocations.get(algorithmId);
    if (allocation) {
      allocation.isActive = false;
      // Libera tutto il capitale disponibile
      allocation.availableCapital = allocation.allocatedCapital;
      allocation.usedCapital = 0;
      this.activeAllocations.set(algorithmId, allocation);
      console.log(`⏸️ Paused algorithm ${allocation.algorithmName} and released capital`);
    }
  }

  /**
   * Riattiva un algoritmo
   */
  resumeAlgorithm(algorithmId: string): void {
    const allocation = this.activeAllocations.get(algorithmId);
    if (allocation) {
      allocation.isActive = true;
      this.activeAllocations.set(algorithmId, allocation);
      console.log(`▶️ Resumed algorithm ${allocation.algorithmName}`);
    }
  }

  /**
   * Stop di emergenza - pausa tutti gli algoritmi
   */
  emergencyStop(): void {
    console.log('🛑 EMERGENCY STOP - Pausing all algorithms');
    
    this.activeAllocations.forEach((allocation, algorithmId) => {
      allocation.isActive = false;
      allocation.availableCapital = allocation.allocatedCapital;
      allocation.usedCapital = 0;
      this.activeAllocations.set(algorithmId, allocation);
    });
  }

  /**
   * Valida le impostazioni del capitale
   */
  private async validateSettings(settings: CapitalSettings): Promise<void> {
    if (settings.riskTolerance <= 0 || settings.riskTolerance > 1) {
      throw new Error('Risk tolerance deve essere tra 0 e 1');
    }

    const totalAllocationPercentage = settings.algorithmsAllocation.reduce(
      (sum, algo) => sum + algo.riskPercentage, 0
    );

    if (totalAllocationPercentage > 100) {
      throw new Error('La somma delle percentuali di allocazione non può superare 100%');
    }

    // Verifica connessione XTB
    const isConnected = await this.xtbApi.testConnection();
    if (!isConnected) {
      console.warn('⚠️ XTB connection not available - using fallback mode');
    }
  }
}