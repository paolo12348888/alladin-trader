import DashboardLayout from "@/components/DashboardLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plug, CheckCircle, XCircle, ArrowRight, Server, Loader2, RefreshCw } from "lucide-react";
import { useXTBData } from "@/services/xtbApi";
import { toast } from "sonner";

interface Broker {
  id: string;
  name: string;
  status: "connected" | "disconnected";
  icon: string; // Placeholder for icon URL or component
  description: string;
}

export default function BrokerIntegration() {
  const { t } = useTranslation();
  const { isConnected: isXTBConnected, status: xtbStatus, accountInfo, loading, error, refetch } = useXTBData();

  // Lista broker con stato dinamico per XTB
  const BROKERS: Broker[] = [
    {
      id: "interactive_brokers",
      name: "Interactive Brokers",
      status: "connected",
      icon: "IB",
      description: "Real-time data and execution via IBKR API.",
    },
    {
      id: "alpaca",
      name: "Alpaca",
      status: "disconnected",
      icon: "AP",
      description: "Commission-free trading API for stocks and crypto.",
    },
    {
      id: "binance",
      name: "Binance",
      status: "disconnected",
      icon: "BN",
      description: "Crypto trading and market data integration.",
    },
    {
      id: "td_ameritrade",
      name: "TD Ameritrade",
      status: "connected",
      icon: "TD",
      description: "Access to thinkorswim platform data.",
    },
    {
      id: "xtb",
      name: "XTB",
      status: isXTBConnected ? "connected" : "disconnected",
      icon: "XTB",
      description: `Integrazione tramite xAPI per dati e trading in tempo reale. ${accountInfo ? `(Saldo: ${accountInfo.currency} ${accountInfo.balance.toFixed(2)})` : ''}`,
    },
  ];

  const checkXTBStatus = async () => {
    if (isXTBConnected && xtbStatus) {
      toast.success(t("XTB Status: Connesso. Session ID: ") + (xtbStatus.streamSessionId || 'N/A'));
    } else {
      toast.info(t("XTB Status: ") + (xtbStatus?.status || 'Disconnesso'));
    }
  };


  const handleConnect = (brokerName: string) => {
    toast.info(t(`Attempting to connect to {{brokerName}}...`, { brokerName }));
    // Simulate connection logic
    if (brokerName === "XTB") {
      checkXTBStatus();
      return;
    }

    setTimeout(() => {
      toast.success(t(`Successfully connected to {{brokerName}}! (Simulated)`, { brokerName }));
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("Broker Integration")}</h1>
          <p className="text-muted-foreground">
            {t("Connect your trading accounts for real-time execution and portfolio synchronization.")}
          </p>
        </div>

        {/* Broker List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BROKERS.map((broker) => (
            <Card key={broker.id} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    {broker.icon === "XTB" ? <Server className="h-5 w-5" /> : broker.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {broker.name}
                  </CardTitle>
                </div>
                {broker.status === "connected" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{broker.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      broker.status === "connected" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t("Status")}: {broker.status === "connected" ? t("Connected") : t("Disconnected")}
                  </span>
                  <Button
                    variant={broker.status === "connected" ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleConnect(broker.name)}
                    disabled={broker.status === "connected"}
                  >
                    {broker.status === "connected" ? t("Synchronized") : t("Connect")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Key Management */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Plug className="h-5 w-5" />
              {t("API Key Management")}
            </CardTitle>
            <CardDescription>
              {t("Manage your API credentials for secure broker integration.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("This section would typically contain forms to input and save your broker-specific API keys and secrets. For security reasons, this is a placeholder.")}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
