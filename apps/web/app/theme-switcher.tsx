'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useTheme, THEMES, ThemeId } from './theme-provider';

export default function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { currentTheme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="theme-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm ${
          compact ? 'px-2.5 py-1' : 'px-3 py-1.5'
        }`}
        title="Changer le thème visuel"
      >
        <span
          className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-inner flex-shrink-0"
          style={{ backgroundColor: themeConfig.primaryColor }}
        />
        {!compact && <span className="hidden sm:inline">{themeConfig.label}</span>}
        <Palette size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-[var(--border)] bg-white dark:bg-slate-900 p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-[var(--border)] mb-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-[var(--primary)]" />
                Thème d&apos;interface
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SahlBiz UI</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Personnalisez les couleurs selon vos préférences.
            </p>
          </div>

          <div className="space-y-1">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setTheme(theme.id as ThemeId);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-[var(--primary-light)] dark:bg-slate-800 text-[var(--primary)] font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-4 w-4 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {theme.label}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {theme.name}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={15} className="text-[var(--primary)] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
