import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IcebergConfig } from '@/types/hedgeFund';
import { Play, Pause, Square, Settings, Mountain, Eye, EyeOff, Layers } from 'lucide-react';

interface IcebergSlice {
  id: string;
  display_size: number;
  hidden_size: number;
  status: 'PENDING' | 'ACTIVE' | 'FILLED' | 'CANCELLED';
  executed_at?: string;
}

const IcebergExecutor: React.FC = () => {
  const [config, setConfig] = useState<IcebergConfig>({
    id: 'iceberg-001',
    strategy_name: 'Iceberg Strategy',
    total_volume: 25000,
    display_size: 1000,
    slice_interval_ms: 30000,
    max_active_slices: 3,
    size_variance_percent: 15.0,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    slice_secrecy_factor: 0.8,
    enabled: false,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [slices, setSlices] = useState<IcebergSlice[]>([]);
  const [executionStats, setExecutionStats] = useState({
    total_executed: 0,
    slices_filled: 0,
    active_slices: 0,
    next_slice_at: null as Date | null,
    hidden_volume_remaining: 0,
  });

  // Genera una nuova slice con variabilità
  const generateNewSlice = (): IcebergSlice => {
    const variance = (Math.random() - 0.5) * 2 * (config.size_variance_percent / 100);
    const displayVaried = config.display_size * (1 + variance);
    const totalSlice = displayVaried * (1 + config.slice_secrecy_factor);
    
    return {
      id: `slice-${Date.now()}-${Math.random()}`,
      display_size: Math.floor(displayVaried),
      hidden_size: Math.floor(totalSlice - displayVaried),
      status: 'PENDING',
    };
  };

  // Inizializza le prime slices
  useEffect(() => {
    if (isRunning && slices.length === 0) {
      const initialSlices = Array.from({ length: Math.min(config.max_active_slices, 3) }, () => generateNewSlice());
      setSlices(initialSlices);
      setExecutionStats(prev => ({
        ...prev,
        active_slices: initialSlices.length,
        next_slice_at: new Date(Date.now() + config.slice_interval_ms),
      }));
    }
  }, [isRunning, slices.length]);

  // Gestisce l'esecuzione delle slices
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSlices(currentSlices => {
          let newSlices = [...currentSlices];
          let executedVolume = 0;

          // Simula l'esecuzione di slice attive
          newSlices = newSlices.map(slice => {
            if (slice.status === 'ACTIVE') {
              const executionAmount = Math.min(slice.display_size, config.display_size * 0.3);
              const newDisplaySize = slice.display_size - executionAmount;
              
              if (newDisplaySize <= 0) {
                executedVolume += slice.display_size;
                return { ...slice, status: 'FILLED', executed_at: new Date().toISOString() };
              } else {
                return { ...slice, display_size: newDisplaySize };
              }
            }
            return slice;
          });

          // Rimuovi slice riempite
          newSlices = newSlices.filter(slice => slice.status !== 'FILLED');

          // Attiva slice pendenti
          newSlices = newSlices.map(slice => 
            slice.status === 'PENDING' ? { ...slice, status: 'ACTIVE' } : slice
          );

          // Crea nuove slice se necessario
          if (newSlices.length < config.max_active_slices) {
            const remainingVolume = config.total_volume - (executionStats.total_executed + executedVolume);
            if (remainingVolume > 0) {
              const newSliceCount = Math.min(
                config.max_active_slices - newSlices.length,
                Math.ceil(remainingVolume / config.display_size)
              );
              
              for (let i = 0; i < newSliceCount && remainingVolume > 0; i++) {
                const newSlice = generateNewSlice();
                newSlice.display_size = Math.min(newSlice.display_size, remainingVolume);
                newSlice.hidden_size = Math.min(newSlice.hidden_size, remainingVolume - newSlice.display_size);
                newSlices.push(newSlice);
              }
            }
          }

          // Aggiorna statistiche
          setExecutionStats(prev => ({
            ...prev,
            total_executed: prev.total_executed + executedVolume,
            slices_filled: prev.slices_filled + (currentSlices.length - newSlices.filter(s => s.status !== 'FILLED').length),
            active_slices: newSlices.filter(s => s.status === 'ACTIVE').length,
            next_slice_at: new Date(Date.now() + config.slice_interval_ms),
          }));

          // Stop se completato
          const totalRemaining = newSlices.reduce((sum, slice) => sum + slice.display_size + slice.hidden_size, 0);
          if (executionStats.total_executed + executedVolume >= config.total_volume && totalRemaining === 0) {
            setIsRunning(false);
          }

          return newSlices;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, config]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSlices([]);
    setExecutionStats({
      total_executed: 0,
      slices_filled: 0,
      active_slices: 0,
      next_slice_at: null,
      hidden_volume_remaining: 0,
    });
  };

  const progress = (executionStats.total_executed / config.total_volume) * 100;
  const totalHiddenVolume = slices.reduce((sum, slice) => sum + slice.hidden_size, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5" />
              Iceberg Executor
            </CardTitle>
            <CardDescription>
              Iceberg Order Execution Algorithm with Hidden Slices
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
            <Label htmlFor="display-size">Display Size</Label>
            <Input
              id="display-size"
              type="number"
              value={config.display_size}
              onChange={(e) => setConfig(prev => ({ ...prev, display_size: parseFloat(e.target.value) || 1000 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Intervallo Slice (ms)</Label>
            <Input
              id="interval"
              type="number"
              value={config.slice_interval_ms}
              onChange={(e) => setConfig(prev => ({ ...prev, slice_interval_ms: parseInt(e.target.value) || 30000 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-slices">Max Slice Attive</Label>
            <Input
              id="max-slices"
              type="number"
              value={config.max_active_slices}
              onChange={(e) => setConfig(prev => ({ ...prev, max_active_slices: parseInt(e.target.value) || 3 }))}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secrecy">Segretezza Slice</Label>
            <Input
              id="secrecy"
              type="number"
              step="0.1"
              value={config.slice_secrecy_factor}
              onChange={(e) => setConfig(prev => ({ ...prev, slice_secrecy_factor: parseFloat(e.target.value) || 0.8 }))}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Progress e Statistiche */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Esecuzione</span>
            <span className="text-sm text-muted-foreground">
              {executionStats.total_executed.toFixed(0)} / {config.total_volume}
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
              <div className="text-lg font-semibold">{executionStats.slices_filled}</div>
              <div className="text-xs text-muted-foreground">Slice Riempite</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{executionStats.active_slices}</div>
              <div className="text-xs text-muted-foreground">Slice Attive</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{totalHiddenVolume.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Volume Nascosto</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">
                {executionStats.next_slice_at ? 
                  Math.ceil((executionStats.next_slice_at.getTime() - Date.now()) / 1000) : 0
                }s
              </div>
              <div className="text-xs text-muted-foreground">Prossima Slice</div>
            </div>
          </div>

          {/* Visualizzazione Slices */}
          {slices.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Stato Slice Iceberg
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {slices.slice(0, 5).map((slice, index) => (
                  <div key={slice.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex items-center gap-2">
                      <Badge variant={slice.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                        Slice {index + 1}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {slice.status === 'ACTIVE' ? (
                          <Eye className="h-3 w-3 text-blue-500" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        )}
                        <span className="text-xs">
                          {slice.status === 'ACTIVE' ? 'Visibile' : 
                           slice.status === 'PENDING' ? 'In Attesa' : 'Riempita'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">{slice.display_size}</span>
                      {slice.hidden_size > 0 && (
                        <span className="text-muted-foreground"> + {slice.hidden_size}</span>
                      )}
                    </div>
                  </div>
                ))}
                {slices.length > 5 && (
                  <div className="text-center text-xs text-muted-foreground py-2">
                    ... e altre {slices.length - 5} slice
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controlli */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Avvia Iceberg
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
            disabled={!isRunning && executionStats.total_executed === 0}
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

export default IcebergExecutor;