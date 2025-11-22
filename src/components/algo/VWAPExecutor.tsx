import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VWAPConfig } from '@/types/hedgeFund';
import { Play, Pause, Square, Settings, TrendingUp, Clock, Target } from 'lucide-react';

const VWAPExecutor: React.FC = () => {
  const [config, setConfig] = useState<VWAPConfig>({
    id: 'vwap-001',
    strategy_name: 'VWAP Strategy',
    duration_minutes: 60,
    total_volume: 10000,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    max_deviation_percent: 2.0,
    min_child_order_size: 100,
    max_child_order_size: 500,
    aggression_factor: 1.0,
    enabled: false,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState({
    executed_volume: 0,
    vwap_achieved: 0,
    target_vwap: 0,
    deviation_percent: 0,
    child_orders_executed: 0,
  });

  // Calcolo VWAP teorico
  const calculateTargetVWAP = () => {
    // In un'implementazione reale, questo calcolerebbe il VWAP storico
    return 100.5 + Math.random() * 2; // Simulazione
  };

  useEffect(() => {
    const target = calculateTargetVWAP();
    setExecutionStats(prev => ({
      ...prev,
      target_vwap: target,
    }));
  }, [config.total_volume]);

  const handleStart = () => {
    setIsRunning(true);
    // Simulazione esecuzione
    const interval = setInterval(() => {
      setExecutionStats(prev => {
        const newExecuted = Math.min(
          prev.executed_volume + Math.random() * 200,
          config.total_volume
        );
        const newVWAP = prev.target_vwap + (Math.random() - 0.5) * 0.1;
        const newDeviation = Math.abs((newVWAP - prev.target_vwap) / prev.target_vwap * 100);
        
        if (newExecuted >= config.total_volume) {
          clearInterval(interval);
          setIsRunning(false);
        }

        return {
          ...prev,
          executed_volume: newExecuted,
          vwap_achieved: newVWAP,
          deviation_percent: newDeviation,
          child_orders_executed: prev.child_orders_executed + 1,
        };
      });
    }, 2000);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setExecutionStats(prev => ({
      ...prev,
      executed_volume: 0,
      child_orders_executed: 0,
    }));
  };

  const progress = (executionStats.executed_volume / config.total_volume) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              VWAP Executor
            </CardTitle>
            <CardDescription>
              Volume Weighted Average Price Execution Algorithm
            </CardDescription>
          </div>
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configurazione */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Nome Strategia</Label>
            <Input
              id="strategy-name"
              value={config.strategy_name}
              onChange={(e) => setConfig(prev => ({ ...prev, strategy_name: e.target.value }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durata (minuti)</Label>
            <Input
              id="duration"
              type="number"
              value={config.duration_minutes}
              onChange={(e) => setConfig(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total-volume">Volume Totale</Label>
            <Input
              id="total-volume"
              type="number"
              value={config.total_volume}
              onChange={(e) => setConfig(prev => ({ ...prev, total_volume: parseFloat(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-deviation">Max Deviazione (%)</Label>
            <Input
              id="max-deviation"
              type="number"
              step="0.1"
              value={config.max_deviation_percent}
              onChange={(e) => setConfig(prev => ({ ...prev, max_deviation_percent: parseFloat(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-order-size">Min Order Size</Label>
            <Input
              id="min-order-size"
              type="number"
              value={config.min_child_order_size}
              onChange={(e) => setConfig(prev => ({ ...prev, min_child_order_size: parseFloat(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aggression-factor">Aggressività</Label>
            <Input
              id="aggression-factor"
              type="number"
              step="0.1"
              value={config.aggression_factor}
              onChange={(e) => setConfig(prev => ({ ...prev, aggression_factor: parseFloat(e.target.value) || 1.0 }))}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Progress e Statistiche */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Esecuzione</span>
            <span className="text-sm text-muted-foreground">
              {executionStats.executed_volume.toFixed(0)} / {config.total_volume}
            </span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{executionStats.vwap_achieved.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">VWAP Raggiunto</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{executionStats.target_vwap.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">VWAP Target</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className={`text-lg font-semibold ${executionStats.deviation_percent > config.max_deviation_percent ? 'text-red-500' : 'text-green-500'}`}>
                {executionStats.deviation_percent.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Deviazione</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{executionStats.child_orders_executed}</div>
              <div className="text-xs text-muted-foreground">Child Orders</div>
            </div>
          </div>
        </div>

        {/* Controlli */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Avvia VWAP
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Pausa
            </Button>
          )}
          
          <Button 
            onClick={handleStop} 
            variant="destructive" 
            className="flex items-center gap-2"
            disabled={!isRunning && executionStats.executed_volume === 0}
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>

          <Button variant="outline" className="flex items-center gap-2 ml-auto">
            <Settings className="h-4 w-4" />
            Configurazione Avanzata
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VWAPExecutor;