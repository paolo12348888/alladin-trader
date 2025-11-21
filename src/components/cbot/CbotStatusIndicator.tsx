/**
 * CBOT Status Indicator Component
 */
interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  label?: string;
  showPulse?: boolean;
}

export function CbotStatusIndicator({
  status,
  label,
  showPulse = true,
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
      case 'error':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-muted-foreground';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'connecting':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    if (label) return label;
    switch (status) {
      case 'connected':
        return 'Connesso';
      case 'error':
        return 'Errore';
      case 'connecting':
        return 'Connessione...';
      case 'disconnected':
        return 'Disconnesso';
      default:
        return 'Sconosciuto';
    }
  };

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-sm bg-background border border-border">
      <div className="relative mr-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        {showPulse && status === 'connected' && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
        )}
        {status === 'connecting' && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-yellow-500 animate-spin"></div>
        )}
      </div>
      <span className={`text-sm font-medium ${getTextColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
}
