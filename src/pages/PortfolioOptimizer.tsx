import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Shield, DollarSign, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/services/xtbApi";
import { XTBPosition } from "@/services/xtbApi";

export default function PortfolioOptimizer() {
  // Hook per i dati reali del portfolio XTB
  const { 
    portfolioData, 
    positions, 
    performance, 
    loading, 
    error, 
    lastUpdate, 
    refetch 
  } = usePortfolio();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Funzione per aggiornare manualmente i dati
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setLastRefresh(new Date());
      toast.success("Portfolio aggiornato con successo");
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del portfolio");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Se non ci sono posizioni, mostra stato di attesa
  if (loading && !portfolioData) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-muted-foreground">Caricamento portfolio in corso...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se c'è un errore di connessione
  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <WifiOff className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <p className="text-muted-foreground mb-2">Errore di connessione XTB</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={refreshData} className="mt-4">
                Riprova
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se non ci sono posizioni attive
  if (!positions || positions.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Wallet className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nessuna posizione attiva nel portfolio</p>
              <p className="text-sm text-muted-foreground">Connettiti al tuo account XTB per visualizzare le posizioni reali</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalValue = portfolioData?.summary?.equity || 0;
  const netProfit = portfolioData?.summary?.netProfit || 0;
  const profitPercentage = totalValue > 0 ? (netProfit / (totalValue - netProfit)) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header con Status XTB */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Portfolio Reale XTB
            </h1>
            <p className="text-muted-foreground">
              Posizioni attive dal tuo conto di trading
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                XTB Connesso
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              <span>Ultimo aggiornamento: {lastRefresh.toLocaleTimeString()}</span>
            </div>
            <Button 
              onClick={refreshData} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equity Totale
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                P&L Netto
              </CardTitle>
              <TrendingUp className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${netProfit.toFixed(2)}
              </div>
              <p className={`text-xs ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitPercentage.toFixed(2)}% dal bilancio iniziale
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posizioni Aperte
              </CardTitle>
              <Wallet className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {positions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {positions.filter(p => p.profit > 0).length} profitable
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Volume Totale
              </CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {portfolioData?.summary?.totalVolume?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Tabs */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">Posizioni Attive</TabsTrigger>
            <TabsTrigger value="analysis">Analisi P&L</TabsTrigger>
            <TabsTrigger value="technical">Dettagli Tecnici</TabsTrigger>
          </TabsList>

          {/* Posizioni Attive */}
          <TabsContent value="positions" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Posizioni Aperte dal Conto XTB
                </CardTitle>
                <CardDescription>Le tue posizioni di trading reali e P&L in tempo reale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {positions.map((position: XTBPosition) => (
                    <div key={position.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-bold text-foreground">{position.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {position.type} • Volume: {position.volume}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Aperto: {new Date(position.openTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-foreground">
                          {position.currentPrice.toFixed(5)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entrata: {position.openPrice.toFixed(5)}
                        </p>
                        <p className={`text-sm font-medium ${position.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          P&L: ${position.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analisi P&L */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profitto Totale</span>
                      <span className="font-bold text-green-500">
                        +${portfolioData?.summary?.totalProfit?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commissioni</span>
                      <span className="font-bold text-red-500">
                        ${portfolioData?.summary?.totalCommission?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Swap</span>
                      <span className="font-bold text-red-500">
                        ${portfolioData?.summary?.totalSwap?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground">Netto</span>
                      <span className={`font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${netProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Asset Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {positions.map((position: XTBPosition) => (
                      <div key={position.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{position.symbol}</span>
                          <span className="text-muted-foreground">
                            {((position.volume / (portfolioData?.summary?.totalVolume || 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full transition-all ${
                              position.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min((Math.abs(position.profit) / 200) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dettagli Tecnici */}
          <TabsContent value="technical" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Informazioni Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Equity</span>
                    <span className="font-medium text-foreground">
                      ${portfolioData?.summary?.equity?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="font-medium text-foreground">
                      ${portfolioData?.summary?.balance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Free Margin</span>
                    <span className="font-medium text-foreground">
                      ${portfolioData?.summary?.freeMargin?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volume Totale</span>
                    <span className="font-medium text-foreground">
                      {portfolioData?.summary?.totalVolume?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Stato Connessione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connessione XTB</span>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Attiva
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ultimo Aggiornamento</span>
                    <span className="font-medium text-foreground">
                      {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Refresh Automatico</span>
                    <Badge variant="secondary">30s</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Posizioni Totali</span>
                    <span className="font-medium text-foreground">
                      {positions.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
