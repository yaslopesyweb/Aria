import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModeConfig } from '@/types';

const modes: Record<'governance' | 'devops' | 'full', ModeConfig> = {
  governance: {
    id: 'governance',
    name: 'Processos & Governança',
    accentColor: '#6366F1',
    accentColorHover: '#4F46E5',
    badgeColor: 'bg-indigo-500/10 text-indigo-500',
    description: 'ISO 27001, LGPD, COBIT, RIPD, BPM',
    gradientFrom: '#6366F1',
    gradientTo: '#8B5CF6',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderLight: 'border-indigo-200 dark:border-indigo-800',
  },
  devops: {
    id: 'devops',
    name: 'DevOps & Cloud',
    accentColor: '#10B981',
    accentColorHover: '#059669',
    badgeColor: 'bg-emerald-500/10 text-emerald-500',
    description: 'Well-Architected, DORA, CIS, DevSecOps, FinOps',
    gradientFrom: '#10B981',
    gradientTo: '#14B8A6',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderLight: 'border-emerald-200 dark:border-emerald-800',
  },
  full: {
    id: 'full',
    name: 'Full Spectrum',
    accentColor: '#8B5CF6',      // Roxo/Violeta
    accentColorHover: '#7C3AED',  // Violeta mais escuro
    badgeColor: 'bg-purple-500/10 text-purple-500',
    description: 'Governança + DevOps & Cloud — Assessment Completo',
    gradientFrom: '#8B5CF6',
    gradientTo: '#C084FC',        // Roxo claro
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    borderLight: 'border-purple-200 dark:border-purple-800',
  },
};

interface ModeContextType {
  mode: ModeConfig;
  setMode: (mode: 'governance' | 'devops' | 'full') => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const MODE_KEY = 'aria_mode';

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ModeConfig>(() => {
    const saved = localStorage.getItem(MODE_KEY) as 'governance' | 'devops' | 'full';
    if (saved === 'devops') return modes.devops;
    if (saved === 'full') return modes.full;
    return modes.governance;
  });

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode.id);
    document.documentElement.style.setProperty('--aria-accent', mode.accentColor);
    document.documentElement.style.setProperty('--aria-accent-hover', mode.accentColorHover);
    document.documentElement.style.setProperty('--aria-gradient-from', mode.gradientFrom);
    document.documentElement.style.setProperty('--aria-gradient-to', mode.gradientTo);
  }, [mode]);

  const setMode = (newMode: 'governance' | 'devops' | 'full') => {
    setModeState(modes[newMode]);
  };

  const toggleMode = () => {
    setModeState(prev => {
      if (prev.id === 'governance') return modes.devops;
      if (prev.id === 'devops') return modes.full;
      return modes.governance;
    });
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}