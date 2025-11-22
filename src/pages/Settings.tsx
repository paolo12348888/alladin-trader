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
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import IPGeolocationControl from '../components/IPGeolocationControl';
import GeolocationTest from '../components/GeolocationTest';

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

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
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