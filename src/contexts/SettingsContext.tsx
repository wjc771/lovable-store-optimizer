
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          settings: 'Settings',
          general: 'General',
          business: 'Business',
          notifications: 'Notifications',
          staff: 'Staff & Permissions',
          integrations: 'Integrations',
          theme: 'Theme',
          language: 'Language',
          dark: 'Dark',
          light: 'Light',
          system: 'System'
        }
      },
      pt: {
        translation: {
          settings: 'Configurações',
          general: 'Geral',
          business: 'Negócio',
          notifications: 'Notificações',
          staff: 'Equipe & Permissões',
          integrations: 'Integrações',
          theme: 'Tema',
          language: 'Idioma',
          dark: 'Escuro',
          light: 'Claro',
          system: 'Sistema'
        }
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
  });

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'pt';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('language') as Language) || 'en'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
