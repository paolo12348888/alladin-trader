import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { 
  useXTBOrders, 
  XTBOrderRequest,
  XTBAccountTypeResponse 
} from '@/services/xtbApi';

interface XTBRealTradingProps {
  className?: string;
}

export const XTBRealTrading: React.FC<XTBRealTradingProps> = ({ className = '' }) => {
  const {
    accountType,
    placingOrder,
    error,
    validateOrder,
    placeOrder,
    closePosition,
    modifyOrder,
    isRealAccount,
    clearError
  } = useXTBOrders();

  const [orderForm, setOrderForm] = useState<XTBOrderRequest>({
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.1,
    stopLoss: undefined,
    takeProfit: undefined,
    comment: 'Alladin Trader Order'
  });

  const [validation, setValidation] = useState<{
    valid: boolean;
    warnings: string[];
    errors: string[];
    isReal: boolean;
  } | null>(null);

  const [orderResult, setOrderResult] = useState<any>(null);

  const handleInputChange = (field: keyof XTBOrderRequest, value: string | number) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset risultati quando cambia il form
    setValidation(null);
    setOrderResult(null);
    clearError();
  };

  const handleValidateOrder = async () => {
    try {
      const result = await validateOrder(orderForm);
      setValidation(result);
    } catch (err) {
      console.error('Errore validazione:', err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await placeOrder(orderForm);
      setOrderResult(result);
      
      if (result.success) {
        // Reset form dopo ordine riuscito
        setOrderForm({
          symbol: 'EURUSD',
          type: 'BUY',
          volume: 0.1,
          stopLoss: undefined,
          takeProfit: undefined,
          comment: 'Alladin Trader Order'
        });
        setValidation(null);
      }
    } catch (err) {
      console.error('Errore invio ordine:', err);
    }
  };

  const getAccountTypeBadge = (accountType: XTBAccountTypeResponse | null) => {
    if (!accountType) return null;
    
    return accountType.isReal ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Shield className="w-3 h-3" />
        REAL ACCOUNT
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Activity className="w-3 h-3" />
        DEMO ACCOUNT
      </Badge>
    );
  };

  if (!accountType) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Caricamento configurazione account...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con info account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Trading XTB {isRealAccount ? 'Reale' : 'Demo'}
          </CardTitle>
          <CardDescription>
            Gestione ordini per account {accountType.accountType.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {accountType.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Ultimo aggiornamento: {new Date(accountType.timestamp).toLocaleString('it-IT')}
              </p>
            </div>
            {getAccountTypeBadge(accountType)}
          </div>
        </CardContent>
      </Card>

      {/* Warning per account real */}
      {isRealAccount && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>ATTENZIONE: ACCOUNT REALE ATTIVO</strong>
            <br />
            Tutti gli ordini saranno inviati direttamente al broker XTB e possono risultare in:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Movimenti di denaro reali</li>
              <li>Profitti e perdite effettivi</li>
              <li>Commissioni reali addebitate</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Form ordine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {orderForm.type === 'BUY' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            Nuovo Ordine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Simbolo */}
            <div className="space-y-2">
              <Label htmlFor="symbol">Simbolo</Label>
              <Input
                id="symbol"
                value={orderForm.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="EURUSD"
                className="uppercase"
              />
            </div>

            {/* Tipo ordine */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={orderForm.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="BUY">ACQUISTA (BUY)</option>
                <option value="SELL">VENDI (SELL)</option>
              </select>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (lotti)</Label>
              <Input
                id="volume"
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                value={orderForm.volume}
                onChange={(e) => handleInputChange('volume', parseFloat(e.target.value) || 0)}
                placeholder="0.10"
              />
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (opzionale)</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.0001"
                value={orderForm.stopLoss || ''}
                onChange={(e) => handleInputChange('stopLoss', parseFloat(e.target.value) || undefined)}
                placeholder="1.1000"
              />
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (opzionale)</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.0001"
                value={orderForm.takeProfit || ''}
                onChange={(e) => handleInputChange('takeProfit', parseFloat(e.target.value) || undefined)}
                placeholder="1.1100"
              />
            </div>

            {/* Commento */}
            <div className="space-y-2">
              <Label htmlFor="comment">Commento</Label>
              <Input
                id="comment"
                value={orderForm.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Ordine Alladin Trader"
              />
            </div>
          </div>

          {/* Pulsanti azione */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleValidateOrder}
              disabled={placingOrder}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Valida Ordine
            </Button>

            <Button 
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className={`flex items-center gap-2 ${
                orderForm.type === 'BUY' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {placingOrder ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : orderForm.type === 'BUY' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {isRealAccount ? 'INVIA ORDINE REALE' : 'INVIA ORDINE DEMO'}
            </Button>
          </div>

          {/* Errori */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Risultato validazione */}
          {validation && (
            <div className="space-y-2">
              {validation.errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Errori:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validation.warnings.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Avvisi:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validation.valid && validation.errors.length === 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ Ordine valido e pronto per l'invio
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Risultato ordine */}
          {orderResult && (
            <Alert className={`${
              orderResult.success 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              {orderResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={orderResult.success ? 'text-green-800' : 'text-red-800'}>
                {orderResult.success ? (
                  <div>
                    <strong>✅ Ordine inviato con successo!</strong>
                    <br />
                    ID Ordine: {orderResult.data?.orderId}
                    <br />
                    Tipo: {orderResult.data?.isReal ? 'REALE' : 'DEMO'}
                  </div>
                ) : (
                  <div>
                    <strong>❌ Errore invio ordine:</strong>
                    <br />
                    {orderResult.error}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default XTBRealTrading;