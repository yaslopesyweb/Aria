/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModeConfig } from '@/types';
import { modes } from '@/constants/modes';
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