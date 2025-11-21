import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TWAPConfig } from '@/types/hedgeFund';
import { Play, Pause, Square, Settings, Clock, Timer, BarChart3 } from 'lucide-react';

const TWAPExecutor: React.FC = () => {
  const [config, setConfig] = useState<TWAPConfig>({
    id: 'twap-001',
    strategy_name: 'TWAP Strategy',
    duration_minutes: 120,
    total_volume: 50000,
    interval_seconds: 60,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    timing_variance_percent: 10.0,
    min_child_order_size: 500,
    max_child_order_size: 2000,
    aggression_factor: 1.0,
    enabled: false,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState({
    executed_volume: 0,
    orders_executed: 0,
    next_order_at: null as Date | null,
    time_elapsed: 0,
    avg_interval_achieved: 0,
  });

  // Calcolo del prossimo ordine
  const calculateNextOrderTime = () => {
    const variance = (Math.random() - 0.5) * 2 * (config.timing_variance_percent / 100);
    const adjustedInterval = config.interval_seconds * (1 + variance);
    return new Date(Date.now() + adjustedInterval * 1000);
  };

  useEffect(() => {
    if (isRunning && executionStats.executed_volume < config.total_volume) {
      const timeout = setTimeout(() => {
        const orderVolume = Math.min(
          config.max_child_order_size,
          config.total_volume - executionStats.executed_volume
        );

        setExecutionStats(prev => ({
          ...prev,
          executed_volume: prev.executed_volume + orderVolume,
          orders_executed: prev.orders_executed + 1,
          next_order_at: calculateNextOrderTime(),
          time_elapsed: prev.time_elapsed + config.interval_seconds,
        }));

        // Stop se completato
        if (executionStats.executed_volume + orderVolume >= config.total_volume) {
          setIsRunning(false);
        }
      }, config.interval_seconds * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isRunning, executionStats.executed_volume, config]);

  const handleStart = () => {
    setIsRunning(true);
    setExecutionStats(prev => ({
      ...prev,
      next_order_at: calculateNextOrderTime(),
    }));
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setExecutionStats({
      executed_volume: 0,
      orders_executed: 0,
      next_order_at: null,
      time_elapsed: 0,
      avg_interval_achieved: 0,
    });
  };

  const progress = (executionStats.executed_volume / config.total_volume) * 100;
  const timeProgress = (executionStats.time_elapsed / (config.duration_minutes * 60)) * 100;
  const estimatedRemainingTime = config.duration_minutes - (executionStats.time_elapsed / 60);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              TWAP Executor
            </CardTitle>
            <CardDescription>
              Time Weighted Average Price Execution Algorithm
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
            <Label htmlFor="interval">Intervallo Ordini (sec)</Label>
            <Input
              id="interval"
              type="number"
              value={config.interval_seconds}
              onChange={(e) => setConfig(prev => ({ ...prev, interval_seconds: parseInt(e.target.value) || 60 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variance">Varianza Timing (%)</Label>
            <Input
              id="variance"
              type="number"
              step="0.1"
              value={config.timing_variance_percent}
              onChange={(e) => setConfig(prev => ({ ...prev, timing_variance_percent: parseFloat(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-order">Min Order Size</Label>
            <Input
              id="min-order"
              type="number"
              value={config.min_child_order_size}
              onChange={(e) => setConfig(prev => ({ ...prev, min_child_order_size: parseFloat(e.target.value) || 0 }))}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Progress e Statistiche */}
        <div className="space-y-4">
          {/* Progress Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso Volume</span>
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
          </div>

          {/* Progress Tempo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso Tempo</span>
              <span className="text-sm text-muted-foreground">
                {Math.floor(executionStats.time_elapsed / 60)}:{(executionStats.time_elapsed % 60).toString().padStart(2, '0')} / {config.duration_minutes}:00
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(timeProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Statistiche */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{executionStats.orders_executed}</div>
              <div className="text-xs text-muted-foreground">Ordini Eseguiti</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{config.interval_seconds}s</div>
              <div className="text-xs text-muted-foreground">Intervallo Target</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">
                {executionStats.next_order_at ? 
                  Math.ceil((executionStats.next_order_at.getTime() - Date.now()) / 1000) : 0
                }s
              </div>
              <div className="text-xs text-muted-foreground">Prossimo Ordine</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{Math.max(0, estimatedRemainingTime).toFixed(1)}m</div>
              <div className="text-xs text-muted-foreground">Tempo Rimanente</div>
            </div>
          </div>

          {/* Schedule Timeline */}
          {isRunning && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Timeline Scheduling
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Orario Inizio:</span>
                  <span>{new Date(config.start_time).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Orario Fine Previsto:</span>
                  <span>{new Date(Date.now() + estimatedRemainingTime * 60 * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume per Intervallo:</span>
                  <span>{(config.total_volume * config.interval_seconds / (config.duration_minutes * 60)).toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controlli */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Avvia TWAP
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

export default TWAPExecutor;