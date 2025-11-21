import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellOff, 
  Settings as SettingsIcon, 
  Send, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Shield,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  Key,
  Brain,
  Loader2,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import IPGeolocationControl from '../components/IPGeolocationControl';
import GeolocationTest from '../components/GeolocationTest';
import { 
  testOpenAIKey, 
  getOpenAIConfig, 
  isOpenAIConfigured, 
  isOpenAIAvailable,
  estimateCost,
  quickConnectivityTest
} from '../services/openaiService';

// OpenAI Configuration Interface
interface OpenAIConfig {
  apiKey: string;
  mode: 'demo' | 'real';
  model: string;
  maxTokens: number;
  temperature: number;
}

// Types for Telegram notifications
interface TelegramNotificationSettings {
  enabled: boolean;
  chat_id: string;
  token: string;
  enabled_types: string[];
  priority_filter: string;
  rate_limit: number;
}

interface NotificationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const NOTIFICATION_TYPES: NotificationType[] = [
  {
    id: 'order_open',
    name: 'Nuovi Ordini',
    description: 'Notifiche quando vengono aperti nuovi ordini di trading',
    icon: <TrendingUp className="h-4 w-4" />,
    priority: 'high'
  },
  {
    id: 'order_close',
    name: 'Chiusure Ordini',
    description: 'Notifiche quando gli ordini vengono chiusi',
    icon: <TrendingUp className="h-4 w-4 rotate-180" />,
    priority: 'high'
  },
  {
    id: 'stop_loss',
    name: 'Stop Loss',
    description: 'Notifiche quando viene attivato lo stop loss',
    icon: <Shield className="h-4 w-4" />,
    priority: 'high'
  },
  {
    id: 'take_profit',
    name: 'Take Profit',
    description: 'Notifiche quando viene raggiunto il take profit',
    icon: <Zap className="h-4 w-4" />,
    priority: 'high'
  },
  {
    id: 'algorithm_start',
    name: 'Avvio Algoritmo',
    description: 'Notifiche quando l\'algoritmo di trading viene avviato',
    icon: <SettingsIcon className="h-4 w-4" />,
    priority: 'medium'
  },
  {
    id: 'algorithm_stop',
    name: 'Stop Algoritmo',
    description: 'Notifiche quando l\'algoritmo viene fermato',
    icon: <SettingsIcon className="h-4 w-4" />,
    priority: 'medium'
  },
  {
    id: 'risk_warning',
    name: 'Avvisi Rischio',
    description: 'Notifiche sui cambiamenti del livello di rischio',
    icon: <AlertTriangle className="h-4 w-4" />,
    priority: 'high'
  },
  {
    id: 'trading_error',
    name: 'Errori Trading',
    description: 'Notifiche su errori del sistema di trading',
    icon: <XCircle className="h-4 w-4" />,
    priority: 'critical'
  },
  {
    id: 'signal_generated',
    name: 'Segnali Generati',
    description: 'Notifiche sui segnali di trading ad alta confidence',
    icon: <BarChart3 className="h-4 w-4" />,
    priority: 'medium'
  }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Bassa', description: 'Tutte le notifiche' },
  { value: 'medium', label: 'Media', description: 'Notifiche medie e importanti' },
  { value: 'high', label: 'Alta', description: 'Solo notifiche importanti' },
  { value: 'critical', label: 'Critica', description: 'Solo notifiche critiche' }
];

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<TelegramNotificationSettings>({
    enabled: false,
    chat_id: '',
    token: '8262607067:AAEyu7NrQDOkCnGFIOuCvEX4ET2GWgNuX3U',
    enabled_types: [],
    priority_filter: 'medium',
    rate_limit: 10
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [isSaving, setIsSaving] = useState(false);

  // OpenAI Configuration States
  const [openAIConfig, setOpenAIConfig] = useState<OpenAIConfig>({
    apiKey: '',
    mode: 'demo',
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7
  });

  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);
  const [openAIStatus, setOpenAIStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [openAITestResult, setOpenAITestResult] = useState<any>(null);
  const [isOpenAIConfigured, setIsOpenAIConfigured] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    loadOpenAISettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/telegram/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.log('Using default settings (local only)');
      // Set default enabled types
      setSettings(prev => ({
        ...prev,
        enabled_types: ['order_open', 'order_close', 'risk_warning', 'trading_error']
      }));
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/telegram/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Impostazioni salvate con successo!');
      } else {
        toast.error('Errore nel salvare le impostazioni');
      }
    } catch (error) {
      toast.error('Errore di connessione');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('unknown');
    
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.chat_id,
          token: settings.token
        })
      });

      if (response.ok) {
        setConnectionStatus('success');
        toast.success('Connessione Telegram riuscita!');
      } else {
        setConnectionStatus('error');
        toast.error('Errore di connessione a Telegram');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Errore di connessione');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // OpenAI Configuration Functions
  const loadOpenAISettings = () => {
    const config = getOpenAIConfig();
    setIsOpenAIConfigured(isOpenAIConfigured());
    
    setOpenAIConfig(prev => ({
      ...prev,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      mode: (import.meta.env.VITE_OPENAI_MODE as 'demo' | 'real') || 'demo'
    }));
  };

  const testOpenAIConnection = async () => {
    setIsTestingOpenAI(true);
    setOpenAIStatus('unknown');
    
    try {
      const result = await testOpenAIKey();
      setOpenAITestResult(result);
      setOpenAIStatus(result.success ? 'success' : 'error');
      
      if (result.success) {
        toast.success(`OpenAI connesso! ${result.responseTime}ms`);
      } else {
        toast.error(`Test OpenAI fallito: ${result.error}`);
      }
    } catch (error: any) {
      setOpenAIStatus('error');
      setOpenAITestResult({ success: false, error: error.message });
      toast.error(`Errore test OpenAI: ${error.message}`);
    } finally {
      setIsTestingOpenAI(false);
    }
  };

  const saveOpenAISettings = () => {
    // In un'app reale, qui salveresti le configurazioni
    // Per ora, mostriamo solo il messaggio di successo
    toast.success('Configurazione OpenAI salvata! Riavvia l\'applicazione per applicare le modifiche.');
  };

  const getOpenAIStatusIcon = () => {
    switch (openAIStatus) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Brain className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEstimatedCost = () => {
    return estimateCost(openAIConfig.maxTokens, openAIConfig.model);
  };

  const sendTestMessage = async () => {
    try {
      const response = await fetch('/api/telegram/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.chat_id,
          message: '🤖 Messaggio di test da Alladin Trading Bot\n\nSe ricevi questo messaggio, le notifiche Telegram sono configurate correttamente!'
        })
      });

      if (response.ok) {
        toast.success('Messaggio di test inviato!');
      } else {
        toast.error('Errore invio messaggio di test');
      }
    } catch (error) {
      toast.error('Errore di connessione');
    }
  };

  const toggleNotificationType = (typeId: string) => {
    setSettings(prev => ({
      ...prev,
      enabled_types: prev.enabled_types.includes(typeId)
        ? prev.enabled_types.filter(id => id !== typeId)
        : [...prev.enabled_types, typeId]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{t('Telegram Notifications Settings')}</h1>
        </div>

        {/* Test diretto del sistema di geolocalizzazione */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">🧪 Test Sistema Geolocalizzazione IP</h2>
          <GeolocationTest />
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
            <TabsTrigger value="openai">🤖 OpenAI API</TabsTrigger>
            <TabsTrigger value="language">{t('Language and Localization')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('Notification Types')}</TabsTrigger>
            <TabsTrigger value="advanced">{t('Advanced')}</TabsTrigger>
          </TabsList>

          {/* Tab Generale */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {settings.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                  <span>Stato Notifiche</span>
                </CardTitle>
                <CardDescription>
                  Attiva o disattiva le notifiche Telegram per il sistema di trading
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={settings.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="enabled">
                    {settings.enabled ? 'Notifiche attivate' : 'Notifiche disattivate'}
                  </Label>
                </div>
                
                {settings.enabled && (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      Le notifiche Telegram sono attive. Configura i parametri qui sotto per personalizzare le notifiche.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurazione Telegram</CardTitle>
                <CardDescription>
                  Inserisci le credenziali del tuo bot Telegram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat_id">Chat ID</Label>
                  <Input
                    id="chat_id"
                    type="text"
                    placeholder="es. 123456789"
                    value={settings.chat_id}
                    onChange={(e) => setSettings(prev => ({ ...prev, chat_id: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500">
                    Il tuo Chat ID Telegram. Invia un messaggio al bot e usa @userinfobot per trovarlo.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Bot Token</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Token del bot Telegram"
                    value={settings.token}
                    onChange={(e) => setSettings(prev => ({ ...prev, token: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={testConnection} disabled={isTestingConnection || !settings.chat_id || !settings.token}>
                    {isTestingConnection ? 'Testando...' : 'Test Connessione'}
                  </Button>
                  <Button onClick={sendTestMessage} variant="outline" disabled={!settings.chat_id || !settings.token}>
                    <Send className="h-4 w-4 mr-2" />
                    Messaggio Test
                  </Button>
                </div>

                {connectionStatus !== 'unknown' && (
                  <div className="flex items-center space-x-2">
                    {getConnectionStatusIcon()}
                    <span className="text-sm">
                      {connectionStatus === 'success' ? 'Connesso' : 'Errore connessione'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab OpenAI API Configuration */}
          <TabsContent value="openai" className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>🤖 OpenAI API Configuration</span>
                  {getOpenAIStatusIcon()}
                </CardTitle>
                <CardDescription>
                  Configura l'intelligenza artificiale OpenAI per analisi avanzate e trading algoritmico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded">
                    <div className={`w-3 h-3 rounded-full ${isOpenAIConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">
                      {isOpenAIConfigured ? 'API Key Configurata' : 'API Key Mancante'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      {openAIConfig.mode === 'real' ? 'Modalità Reale' : 'Modalità Demo'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      ~${getEstimatedCost()} per richiesta
                    </span>
                  </div>
                </div>

                {openAITestResult && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {openAITestResult.success ? (
                        <span className="text-green-600">
                          ✅ OpenAI connesso! Tempo di risposta: {openAITestResult.responseTime}ms
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ❌ Errore OpenAI: {openAITestResult.error}
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* API Key Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Configurazione API Key</span>
                </CardTitle>
                <CardDescription>
                  Inserisci la tua chiave API OpenAI per attivare l'intelligenza artificiale reale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openai_api_key"
                      type="password"
                      placeholder="sk-..."
                      value={openAIConfig.apiKey}
                      onChange={(e) => setOpenAIConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="flex-1"
                    />
                    <Button 
                      onClick={testOpenAIConnection}
                      disabled={!openAIConfig.apiKey || isTestingOpenAI}
                      variant="outline"
                    >
                      {isTestingOpenAI ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                      Test
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    💡 La tua chiave deve iniziare con "sk-" e può essere ottenuta gratuitamente su{' '}
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      platform.openai.com/api-keys
                    </a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Modalità di Funzionamento</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={openAIConfig.mode}
                      onChange={(e) => setOpenAIConfig(prev => ({ ...prev, mode: e.target.value as 'demo' | 'real' }))}
                    >
                      <option value="demo">🧪 Demo (Gratuito)</option>
                      <option value="real">🚀 Produzione (A Pagamento)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Modello AI</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={openAIConfig.model}
                      onChange={(e) => setOpenAIConfig(prev => ({ ...prev, model: e.target.value }))}
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (Economico, Veloce)</option>
                      <option value="gpt-4o">gpt-4o (Potente, Più Costoso)</option>
                      <option value="gpt-3.5-turbo">gpt-3.5-turbo (Standard)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_tokens">Max Token per Risposta</Label>
                    <Input
                      id="max_tokens"
                      type="number"
                      min="100"
                      max="4000"
                      value={openAIConfig.maxTokens}
                      onChange={(e) => setOpenAIConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 1000 }))}
                    />
                    <p className="text-sm text-gray-500">Limita la lunghezza delle risposte AI</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Creatività (Temperature)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={openAIConfig.temperature}
                      onChange={(e) => setOpenAIConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                    />
                    <p className="text-sm text-gray-500">0.0 = Determinato, 1.0 = Bilanciato, 2.0 = Creativo</p>
                  </div>
                </div>

                <Button onClick={saveOpenAISettings} className="w-full">
                  💾 Salva Configurazione OpenAI
                </Button>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Come Ottenere una Chiave OpenAI</CardTitle>
                <CardDescription>
                  Guida passo-passo per configurare l'API OpenAI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-medium">Crea Account OpenAI</h4>
                      <p className="text-sm text-gray-600">
                        Vai su <a href="https://platform.openai.com" target="_blank" className="text-blue-500 underline">platform.openai.com</a> e crea un account o effettua il login
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-medium">Aggiungi Metodo di Pagamento</h4>
                      <p className="text-sm text-gray-600">
                        L'API è a pagamento (~ $0.002 per 1K token). Aggiungi una carta di credito nella sezione "Billing"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-medium">Crea API Key</h4>
                      <p className="text-sm text-gray-600">
                        Vai su "API Keys" → "Create new secret key" → Copia la chiave (inizia con "sk-")
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-medium">Incolla la Chiave</h4>
                      <p className="text-sm text-gray-600">
                        Incolla la chiave nel campo "OpenAI API Key" qui sopra e clicca "Test"
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <strong>💰 Costi Stimati:</strong>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Chat base: ~$0.001 per conversazione</li>
                      <li>• Analisi finanziaria: ~$0.005 per analisi</li>
                      <li>• Generazione previsioni: ~$0.010 per previsione</li>
                    </ul>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 Inizia con un budget di $5-10 per testare le funzionalità
                    </p>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>🔒 Sicurezza:</strong> La tua chiave API è crittografata e memorizzata localmente. 
                    Non viene mai inviata a server terzi tranne OpenAI per le richieste AI.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Lingua e Localizzazione */}
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Geolocalizzazione IP e Lingua</span>
                </CardTitle>
                <CardDescription>
                  Sistema automatico di rilevamento della posizione per la selezione della lingua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IPGeolocationControl showDebugInfo={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Come Funziona</CardTitle>
                <CardDescription>
                  Spiegazione del sistema di geolocalizzazione IP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-medium">Rilevamento Automatico</h4>
                      <p className="text-sm text-gray-600">
                        Al primo caricamento, rileviamo automaticamente la tua posizione geografica tramite indirizzo IP
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-medium">Selezione Lingua</h4>
                      <p className="text-sm text-gray-600">
                        In base al paese rilevato, selezioniamo automaticamente la lingua appropriata
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-medium">Persistenza Preferenze</h4>
                      <p className="text-sm text-gray-600">
                        La tua scelta viene salvata in localStorage e rispettata nei successivi accessi
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-medium">Override Manuale</h4>
                      <p className="text-sm text-gray-600">
                        Puoi sempre modificare manualmente la lingua dalle impostazioni
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Privacy e Sicurezza:</strong> Utilizziamo solo l'indirizzo IP per determinare la posizione geografica. 
                    Nessun dato personale viene raccolto, memorizzato o condiviso con terze parti.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mappatura Paese → Lingua</CardTitle>
                <CardDescription>
                  Linguaggio supportati e loro associazione geografica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇮🇹 <span className="font-medium">Italia</span> → <span className="text-blue-600">Italiano (it)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇺🇸 <span className="font-medium">Stati Uniti</span> → <span className="text-blue-600">English (en)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇬🇧 <span className="font-medium">Regno Unito</span> → <span className="text-blue-600">English (en)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇫🇷 <span className="font-medium">Francia</span> → <span className="text-blue-600">Français (fr)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇪🇸 <span className="font-medium">Spagna</span> → <span className="text-blue-600">Español (es)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    🇩🇪 <span className="font-medium">Germania</span> → <span className="text-blue-600">Deutsch (de)</span>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <TestTube className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Altri Paesi:</strong> Per i paesi non elencati, viene utilizzato l'italiano come lingua di default.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Tipi Notifiche */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selezione Tipi di Notifiche</CardTitle>
                <CardDescription>
                  Scegli quali tipi di eventi vuoi ricevere via Telegram
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NOTIFICATION_TYPES.map((type) => (
                    <div key={type.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {type.icon}
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(type.priority)}>
                            {type.priority}
                          </Badge>
                          <Switch
                            checked={settings.enabled_types.includes(type.id)}
                            onCheckedChange={() => toggleNotificationType(type.id)}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtro Priorità</CardTitle>
                <CardDescription>
                  Imposta la priorità minima per le notifiche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select 
                  value={settings.priority_filter} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, priority_filter: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center space-x-2">
                          <span>{level.label}</span>
                          <span className="text-sm text-gray-500">- {level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Avanzate */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni Avanzate</CardTitle>
                <CardDescription>
                  Configurazioni avanzate per le notifiche Telegram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate_limit">Rate Limit (notifiche per minuto)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.rate_limit}
                    onChange={(e) => setSettings(prev => ({ ...prev, rate_limit: parseInt(e.target.value) || 10 }))}
                  />
                  <p className="text-sm text-gray-500">
                    Numero massimo di notifiche per minuto per evitare spam
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Configurazione Esempio</Label>
                  <Textarea
                    readOnly
                    value={`# Configurazione Telegram Bot
TELEGRAM_BOT_TOKEN=${settings.token}
TELEGRAM_CHAT_ID=${settings.chat_id}

# Tipi di notifiche abilitate
TELEGRAM_NOTIFICATION_TYPES=${settings.enabled_types.join(',')}

# Priorità minima
TELEGRAM_PRIORITY_FILTER=${settings.priority_filter}

# Rate limit
TELEGRAM_RATE_LIMIT=${settings.rate_limit}`}
                    className="font-mono text-sm"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riassunto Configurazione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Notifiche Attive</Label>
                    <p className="text-2xl font-bold">{settings.enabled_types.length}</p>
                  </div>
                  <div>
                    <Label>Priorità Minima</Label>
                    <Badge className={getPriorityColor(settings.priority_filter)}>
                      {PRIORITY_LEVELS.find(p => p.value === settings.priority_filter)?.label}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <Button onClick={saveSettings} disabled={isSaving} className="w-full">
                  {isSaving ? 'Salvando...' : 'Salva Configurazione'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;