/**
 * CBOT Left Sidebar Component
 */
import { ReactNode } from 'react';
import { TrendingUp, Settings, BarChart3, Shield } from 'lucide-react';
import { TradingStatus } from '../../types/cbot';

interface LeftSidebarProps {
  status: TradingStatus;
  wsConnected: boolean;
}

export function CbotLeftSidebar({ status, wsConnected }: LeftSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">CBOT</h2>
            <p className="text-xs text-muted-foreground">Trading Chatbot</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<BarChart3 />} label="Dashboard" active />
        <NavItem icon={<Shield />} label="Gestione Rischio" />
        <NavItem icon={<Settings />} label="Impostazioni" />
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-150 ${
        active
          ? 'bg-primary/10 text-primary border border-primary/30'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
