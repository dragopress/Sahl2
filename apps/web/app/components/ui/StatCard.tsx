import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trendLabel?: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  variant?: 'default' | 'highlight' | 'emerald' | 'amber' | 'blue';
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  id,
  label,
  value,
  change,
  changeType = 'positive',
  trendLabel,
  icon,
  description,
  badge,
  variant = 'default',
  className = '',
  onClick,
}: StatCardProps) {
  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white',
    highlight:
      'bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 border-emerald-800/40 text-white shadow-emerald-950/20 shadow-lg',
    emerald:
      'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 text-slate-900 dark:text-white',
    amber:
      'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50 text-slate-900 dark:text-white',
    blue:
      'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/50 text-slate-900 dark:text-white',
  };

  const isInteractive = Boolean(onClick);

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl p-6 border shadow-sm transition-all duration-200 ${
        isInteractive ? 'cursor-pointer hover:shadow-md hover:border-emerald-500/40' : ''
      } ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-medium tracking-tight truncate ${
                variant === 'highlight'
                  ? 'text-emerald-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {label}
            </span>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {badge}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
              variant === 'highlight'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</span>
      </div>

      {(change || description || trendLabel) && (
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded ${
                changeType === 'positive'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : changeType === 'negative'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {changeType === 'positive' && <TrendingUp size={12} />}
              {changeType === 'negative' && <TrendingDown size={12} />}
              {changeType === 'neutral' && <Minus size={12} />}
              {change}
            </span>
          )}

          {trendLabel && (
            <span
              className={
                variant === 'highlight'
                  ? 'text-slate-300 text-[11px]'
                  : 'text-slate-500 dark:text-slate-400 text-[11px]'
              }
            >
              {trendLabel}
            </span>
          )}

          {description && (
            <p
              className={`w-full mt-1 text-xs ${
                variant === 'highlight'
                  ? 'text-slate-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
