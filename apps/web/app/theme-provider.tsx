'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'emerald' | 'navy' | 'terracotta' | 'indigo' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  label: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  isDark?: boolean;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'emerald',
    name: 'Atlas Emerald',
    label: 'Émeraude Atlas',
    description: 'Style officiel marocain, vert profond & équilibre professionnel',
    primaryColor: '#0f766e',
    accentColor: '#d97706',
    isDark: false,
  },
  {
    id: 'navy',
    name: 'Casablanca Royal',
    label: 'Bleu Casablanca',
    description: 'Corporate moderne, bleu roi & finitions financières élégantes',
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    isDark: false,
  },
  {
    id: 'terracotta',
    name: 'Marrakech Ochre',
    label: 'Terre de Marrakech',
    description: 'Chaleur minérale, ocre raffiné & design distinctif',
    primaryColor: '#c2410c',
    accentColor: '#ea580c',
    isDark: false,
  },
  {
    id: 'indigo',
    name: 'Tanger Modern',
    label: 'Indigo Tanger Tech',
    description: 'Inspiré des tech hubs, violet indigo vif & moderne',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    isDark: false,
  },
  {
    id: 'dark',
    name: 'Night Executive',
    label: 'Sombre Exécutif',
    description: 'Mode sombre haute précision pour sessions prolongées',
    primaryColor: '#14b8a6',
    accentColor: '#38bdf8',
    isDark: true,
  },
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'emerald',
  setTheme: () => {},
  themeConfig: THEMES[0],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('emerald');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahlbiz_theme') as ThemeId;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setCurrentTheme(saved);
        applyTheme(saved);
      } else {
        applyTheme('emerald');
      }
    } catch {
      applyTheme('emerald');
    }
    setMounted(true);
  }, []);

  const applyTheme = (themeId: ThemeId) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    // Remove old theme classes
    THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${themeId}`);
    if (themeId === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleSetTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    try {
      localStorage.setItem('sahlbiz_theme', themeId);
    } catch {}
  };

  const themeConfig = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
