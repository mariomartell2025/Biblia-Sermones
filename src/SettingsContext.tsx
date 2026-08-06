import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS, loadSettings, saveSettings, Language, Theme } from './settings';

export interface SettingsContextType extends AppSettings {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setDefaultVersion: (version: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const updateAndSave = (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(patch);
  };

  if (!loaded) {
    return <>{children}</>;
  }

  const value: SettingsContextType = {
    ...settings,
    setLanguage: (lang) => updateAndSave({ language: lang }),
    setTheme: (theme) => updateAndSave({ theme }),
    setFontSize: (size) => updateAndSave({ fontSize: size }),
    setDefaultVersion: (version) => updateAndSave({ defaultVersion: version }),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return ctx;
}
