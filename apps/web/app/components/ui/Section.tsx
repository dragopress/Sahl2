import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  centered?: boolean;
  background?: 'default' | 'muted' | 'subtle' | 'dark' | 'transparent';
  children: React.ReactNode;
}

export default function Section({
  id,
  className = '',
  containerClassName = '',
  badge,
  badgeIcon,
  title,
  subtitle,
  centered = false,
  background = 'default',
  children,
}: SectionProps) {
  const bgStyles = {
    default: 'bg-white dark:bg-slate-950',
    muted: 'bg-slate-50/80 dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800/80',
    subtle: 'bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-950',
    dark: 'bg-slate-900 text-white dark:bg-black',
    transparent: 'bg-transparent',
  };

  return (
    <section id={id} className={`py-16 sm:py-24 relative overflow-hidden ${bgStyles[background]} ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {(badge || title || subtitle) && (
          <div className={`mb-12 sm:mb-16 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}`}>
            {badge && (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border ${
                  background === 'dark'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50'
                }`}
              >
                {badgeIcon && <span className="flex-shrink-0">{badgeIcon}</span>}
                <span>{badge}</span>
              </div>
            )}

            {title && (
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 ${
                  background === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  background === 'dark' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
