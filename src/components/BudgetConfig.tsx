import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Play, 
  Pause, 
  StopCircle,
  PieChart,
  Target,
  Shield,
  Activity
} from 'lucide-react';
import { CapitalManager, CapitalSettings, CapitalAllocation } from '@/services/CapitalManager';
import { XTBApiService } from '@/services/xtbApi';
// import { XTBDemoService } from '@/services/XTBDemoService';

interface BudgetConfigProps {
  onSettingsChange?: (settings: CapitalSettings) => void;
}

export const BudgetConfig: React.FC<BudgetConfigProps> = ({ onSettingsChange }) => {
  const [capitalManager] = useState(() => new CapitalManager(new XTBApiService()));
  const [settings, setSettings] = useState<CapitalSettings>({
    totalAvailableCapital: 100, // Default €100 come nell'esempio
    riskTolerance: 0.02, // 2% rischio per trade
    maxDrawdown: 0.05, // 5% drawdown massimo
    emergencyStopLevel: 0.10, // 10% stop automatico
    algorithmsAllocation: [
      {
        algorithmId: 'momentum',
        algorithmName: 'Momentum Strategy',
        allocatedCapital: 25,
        usedCapital: 0,
        availableCapital: 25,
        maxPositionSize: 2.5,
        riskPercentage: 25,
        isActive: true
      },
      {
        algorithmId: 'mean-reversion',
        algorithmName: 'Mean Reversion',
        allocatedCapital: 20,
        usedCapital: 0,
        availableCapital: 20,
        maxPositionSize: 2,
        riskPercentage: 20,
        isActive: true
      },
      {
        algorithmId: 'statistical-arbitrage',
        algorithmName: 'Statistical Arbitrage',
        allocatedCapital: 15,
        usedCapital: 0,
        availableCapital: 15,
        maxPositionSize: 1.5,
        riskPercentage: 15,
        isActive: true
      },
      {
        algorithmId: 'vwap',
        algorithmName: 'VWAP Execution',
        allocatedCapital: 15,
        usedCapital: 0,
        availableCapital: 15,
        maxPositionSize: 1.5,
        riskPercentage: 15,
        isActive: true
      },
      {
        algorithmId: 'twap',
        algorithmName: 'TWAP Execution',
        allocatedCapital: 15,
        usedCapital: 0,
        availableCapital: 15,
        maxPositionSize: 1.5,
        riskPercentage: 15,
        isActive: true
      },
      {
        algorithmId: 'iceberg',
        algorithmName: 'Iceberg Orders',
        allocatedCapital: 10,
        usedCapital: 0,
        availableCapital: 10,
        maxPositionSize: 1,
        riskPercentage: 10,
        isActive: false
      }
    ]
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [capitalReport, setCapitalReport] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    initializeCapital();
  }, []);

  const initializeCapital = async () => {
    try {
      // Prova prima con il servizio reale
      await capitalManager.initializeCapital(settings);
      setIsInitialized(true);
      setIsDemoMode(false);
      
      // Ottieni il report iniziale
      const report = await capitalManager.getCapitalReport();
      setCapitalReport(report);
      
      if (onSettingsChange) {
        onSettingsChange(settings);
      }
    } catch (error) {
      console.warn('⚠️ Connessione XTB non disponibile, attivazione modalità demo...', error);
      
      // Fallback alla modalità demo
      try {
        const demoService = new XTBApiService();
        const demoManager = new CapitalManager(demoService);
        await demoManager.initializeCapital(settings);
        
        setIsInitialized(true);
        setIsDemoMode(true);
        
        // Ottieni il report dal demo
        const report = await demoManager.getCapitalReport();
        setCapitalReport(report);
        
        // Sostituisci il capital manager con quello demo
        (capitalManager as any).xtbApi = demoService;
        
        if (onSettingsChange) {
          onSettingsChange(settings);
        }
        
        console.log('✅ Modalità demo attivata con successo!');
      } catch (demoError) {
        console.error('❌ Errore anche in modalità demo:', demoError);
      }
    }
  };

  const updateAllocation = (algorithmId: string, field: keyof CapitalAllocation, value: any) => {
    setSettings(prev => ({
      ...prev,
      algorithmsAllocation: prev.algorithmsAllocation.map(algo =>
        algo.algorithmId === algorithmId 
          ? { ...algo, [field]: value }
          : algo
      )
    }));
  };

  const updateSetting = (field: keyof CapitalSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAlgorithm = (algorithmId: string) => {
    const allocation = settings.algorithmsAllocation.find(a => a.algorithmId === algorithmId);
    if (allocation) {
      if (allocation.isActive) {
        capitalManager.pauseAlgorithm(algorithmId);
      } else {
        capitalManager.resumeAlgorithm(algorithmId);
      }
      
      updateAllocation(algorithmId, 'isActive', !allocation.isActive);
    }
  };

  const emergencyStop = () => {
    capitalManager.emergencyStop();
    setSettings(prev => ({
      ...prev,
      algorithmsAllocation: prev.algorithmsAllocation.map(algo => ({
        ...algo,
        isActive: false
      }))
    }));
  };

  const refreshReport = async () => {
    const report = await capitalManager.getCapitalReport();
    setCapitalReport(report);
  };

  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configurazione Capitale
          </CardTitle>
          <CardDescription>
            Inizializzazione del sistema di gestione capitale...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <strong>🎯 Cosa succederà quando premi "Inizializza Capitale":</strong><br />
              1. Il sistema tenterà di connettersi al tuo conto XTB reale<br />
              2. Se la connessione fallisce, attiverà automaticamente la <strong>Modalità Demo</strong><br />
              3. In modalità demo: simulazione con €100 fittizi per testare tutte le funzioni<br />
              4. Potrai configurare budget per ogni algoritmo e testare i limiti di rischio
            </AlertDescription>
          </Alert>
          
          <Button onClick={initializeCapital} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Inizializza Capitale
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con stats principali */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Gestione Capitale
                {isDemoMode && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Demo Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isDemoMode 
                  ? "Modalità demo - Simulazione con €100 di capitale fittizio"
                  : "Configurazione budget per algoritmi hedge fund"
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshReport}>
                <Activity className="h-4 w-4 mr-1" />
                Aggiorna
              </Button>
              <Button variant="destructive" size="sm" onClick={emergencyStop}>
                <StopCircle className="h-4 w-4 mr-1" />
                Stop Emergenza
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {capitalReport && (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  €{capitalReport.totalCapital?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">Capitale Totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  €{capitalReport.allocatedCapital?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">Allocato</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  €{capitalReport.usedCapital?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">In Uso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  €{capitalReport.availableCapital?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">Disponibile</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allocation">Allocazione Budget</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni Rischio</TabsTrigger>
          <TabsTrigger value="status">Stato Algoritmi</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuzione Capitale per Algoritmo
              </CardTitle>
              <CardDescription>
                Configura quanto capitale allocare per ogni algoritmo (totale: 100%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {settings.algorithmsAllocation.map((allocation) => (
                  <div key={allocation.algorithmId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {allocation.algorithmName}
                          <Badge variant={allocation.isActive ? "default" : "secondary"}>
                            {allocation.isActive ? "Attivo" : "Pausa"}
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-500">
                          Allocato: €{allocation.allocatedCapital?.toFixed(2) || '0.00'} | 
                          In uso: €{allocation.usedCapital?.toFixed(2) || '0.00'} | 
                          Disponibile: €{allocation.availableCapital?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Button
                        variant={allocation.isActive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleAlgorithm(allocation.algorithmId)}
                      >
                        {allocation.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">
                          Percentuale Allocazione: {allocation.riskPercentage}%
                        </Label>
                        <Slider
                          value={[allocation.riskPercentage]}
                          onValueChange={(value) => updateAllocation(allocation.algorithmId, 'riskPercentage', value[0])}
                          max={50}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Max Posizione (€)</Label>
                          <Input
                            type="number"
                            value={allocation.maxPositionSize}
                            onChange={(e) => updateAllocation(allocation.algorithmId, 'maxPositionSize', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Capitale Allocato (€)</Label>
                          <Input
                            type="number"
                            value={allocation.allocatedCapital}
                            onChange={(e) => updateAllocation(allocation.algorithmId, 'allocatedCapital', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* Progress bar per utilizzo capitale */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilizzo Capitale</span>
                          <span>
                            {allocation.usedCapital > 0 && allocation.allocatedCapital > 0
                              ? `${((allocation.usedCapital / allocation.allocatedCapital) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </span>
                        </div>
                        <Progress 
                          value={
                            allocation.usedCapital > 0 && allocation.allocatedCapital > 0
                              ? (allocation.usedCapital / allocation.allocatedCapital) * 100
                              : 0
                          } 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Impostazioni di Rischio Globali
              </CardTitle>
              <CardDescription>
                Configura i limiti di rischio per proteggere il capitale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tolleranza Rischio per Trade: {(settings.riskTolerance * 100).toFixed(1)}%
                </Label>
                <Slider
                  value={[settings.riskTolerance * 100]}
                  onValueChange={(value) => updateSetting('riskTolerance', value[0] / 100)}
                  max={10}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Massimo rischio per singola operazione
                </p>
              </div>

              <div>
                <Label className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Drawdown Massimo Consentito: {(settings.maxDrawdown * 100).toFixed(1)}%
                </Label>
                <Slider
                  value={[settings.maxDrawdown * 100]}
                  onValueChange={(value) => updateSetting('maxDrawdown', value[0] / 100)}
                  max={20}
                  min={1}
                  step={0.5}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Livello massimo di perdita accettabile
                </p>
              </div>

              <div>
                <Label className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Stop Automatico di Emergenza: {(settings.emergencyStopLevel * 100).toFixed(1)}%
                </Label>
                <Slider
                  value={[settings.emergencyStopLevel * 100]}
                  onValueChange={(value) => updateSetting('emergencyStopLevel', value[0] / 100)}
                  max={30}
                  min={5}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Arresta tutti gli algoritmi se viene superata questa perdita
                </p>
              </div>

              <Separator />

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>🎯 Come Funziona la Gestione del Capitale:</strong><br />
                  {isDemoMode ? (
                    <>
                      <strong>Modalità Demo attiva</strong> - Simulazione con €100 fittizi:<br />
                      • Momentum Strategy (25%) → €25 disponibili → Max €2.50 per posizione<br />
                      • Mean Reversion (20%) → €20 disponibili → Max €2.00 per posizione<br />
                      • Statistical Arbitrage (15%) → €15 disponibili → Max €1.50 per posizione<br />
                      • VWAP + TWAP (15% + 15%) → €15 ciascuno → Max €1.50 per posizione<br />
                      • Iceberg (10%) → €10 disponibili → Max €1.00 per posizione
                    </>
                  ) : (
                    <>
                      Il sistema riconosce automaticamente il tuo capitale dal conto XTB.<br />
                      Ogni algoritmo ha un budget dedicato con limiti di rischio:<br />
                      • Max rischio per trade: {(settings.riskTolerance * 100).toFixed(1)}%<br />
                      • Max drawdown: {(settings.maxDrawdown * 100).toFixed(1)}%<br />
                      • Stop automatico: {(settings.emergencyStopLevel * 100).toFixed(1)}%
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Stato Attuale degli Algoritmi
              </CardTitle>
              <CardDescription>
                Monitoraggio in tempo reale dell'utilizzo del capitale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {capitalReport?.algorithms?.map((algo: CapitalAllocation) => (
                  <div key={algo.algorithmId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${algo.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium">{algo.algorithmName}</div>
                        <div className="text-sm text-gray-500">
                          €{algo.usedCapital?.toFixed(2)} / €{algo.allocatedCapital?.toFixed(2)} utilizzati
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        €{algo.availableCapital?.toFixed(2)} disponibili
                      </div>
                      <div className="text-xs text-gray-500">
                        Max pos: €{algo.maxPositionSize?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};