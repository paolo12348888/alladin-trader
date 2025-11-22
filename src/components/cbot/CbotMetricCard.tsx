/**
 * CBOT Metric Card Component
 */
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  changeValue?: string;
  critical?: boolean;
  loading?: boolean;
}

export function CbotMetricCard({
  label,
  value,
  icon,
  trend = 'neutral',
  changeValue,
  critical = false,
  loading = false,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'positive') return 'text-green-500';
    if (trend === 'negative') return 'text-red-500';
    return 'text-foreground';
  };

  const getTrendShadow = () => {
    if (critical && trend === 'negative') return 'shadow-[0_0_12px_rgba(239,68,68,0.3)]';
    if (trend === 'positive') return 'hover:shadow-[0_0_12px_rgba(34,197,94,0.2)]';
    return '';
  };

  if (loading) {
    return (
      <div className="bg-card p-4 rounded-lg border border-border shadow-sm animate-pulse">
        <div className="h-4 bg-accent rounded w-20 mb-3"></div>
        <div className="h-8 bg-accent rounded w-32"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-card p-4 rounded-lg border border-border shadow-sm transition-all duration-250 hover:border-primary/50 hover:scale-[1.02] ${getTrendShadow()} ${
        critical ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      <div className={`text-2xl font-bold font-mono ${getTrendColor()}`}>
        {value}
      </div>

      {changeValue && (
        <div className={`text-xs font-mono mt-2 ${getTrendColor()}`}>
          {trend === 'positive' && '+ '}
          {trend === 'negative' && '- '}
          {changeValue}
        </div>
      )}
    </div>
  );
}
