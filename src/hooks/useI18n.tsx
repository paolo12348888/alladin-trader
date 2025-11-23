import { useTranslation } from 'react-i18next';

export interface UseTranslationReturn {
  t: (key: string, options?: any) => string;
  i18n: any;
  changeLanguage: (lng: string) => Promise<any>;
  language: string;
  getLanguageName: (langCode?: string) => string;
  exists: (key: string) => boolean;
  getSupportedLanguages: () => { code: string; name: string; flag: string; }[];
}

/**
 * Hook personalizzato per l'internazionalizzazione
 * Estende useTranslation di react-i18next con funzionalità aggiuntive
 */
export const useI18n = (): UseTranslationReturn => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      // Salva la preferenza nel localStorage
      localStorage.setItem('alladin_preferred_language', lng);
      return i18n;
    } catch (error) {
      console.error('Errore nel cambio lingua:', error);
      throw error;
    }
  };

  /**
   * Funzione per ottenere il nome della lingua nel formato leggibile
   */
  const getLanguageName = (langCode?: string): string => {
    const lang = langCode || language;
    const languageNames: Record<string, string> = {
      'en': 'English',
      'it': 'Italiano',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch'
    };
    
    return languageNames[lang] || lang;
  };

  /**
   * Funzione per verificare se una traduzione esiste
   */
  const exists = (key: string): boolean => {
    return i18n.exists(key);
  };

  /**
   * Funzione per ottenere tutte le lingue supportate
   */
  const getSupportedLanguages = () => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  return {
    t,
    i18n,
    changeLanguage,
    language,
    // Funzioni aggiuntive disponibili direttamente dal hook
    getLanguageName,
    exists,
    getSupportedLanguages
  };
};

// Hook alias più conciso per uso comune
export const useTranslationCustom = useI18n;
