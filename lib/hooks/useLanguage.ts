'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations, Translations } from '../i18n/translations';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  initialized: boolean;
}

// Detect language based on geolocation
const detectLanguageByGeolocation = async (): Promise<Language> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const country = data.country_code?.toUpperCase();
    
    // Americas
    if (['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY'].includes(country)) {
      return country === 'BR' ? 'pt-BR' : 'en-US';
    }
    // Europe
    if (['RU', 'BY', 'KZ', 'UA', 'MD', 'DE', 'FR', 'GB', 'IT', 'ES', 'PL', 'CZ', 'SE', 'NO', 'DK'].includes(country)) {
      return country === 'RU' || country === 'BY' || country === 'KZ' || country === 'UA' || country === 'MD' ? 'ru' : 'en-US';
    }
    // Asia
    if (['JP', 'CN', 'KR', 'IN', 'TH', 'VN', 'ID', 'MY', 'SG', 'PH'].includes(country)) {
      if (country === 'JP') return 'ja';
      if (country === 'CN') return 'zh';
      return 'en-US';
    }
    
    return 'en-US';
  } catch {
    return 'en-US';
  }
};

const languageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en-US',
      initialized: false,
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'discord-embed-language',
    }
  )
);

// Initialize language detection only on client
if (typeof window !== 'undefined') {
  detectLanguageByGeolocation().then(lang => {
    languageStore.setState({ language: lang, initialized: true });
  });
}

export const useLanguage = () => {
  const { language, setLanguage } = languageStore();
  
  // Ensure we always have translations available, with fallback to en-US
  const t = translations[language] || translations['en-US'];
  
  return { language, setLanguage, t };
};
