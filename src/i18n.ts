import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import delle traduzioni dai file JSON
import enTranslations from './locales/en.json';
import itTranslations from './locales/it.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import deTranslations from './locales/de.json';

// Import del servizio di geolocalizzazione IP
import { ipGeolocationService } from './services/ipGeolocationService';

// Dizionari di traduzione
const resources = {
  en: {
    translation: enTranslations,
  },
  it: {
    translation: itTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  es: {
    translation: esTranslations,
  },
  de: {
    translation: deTranslations,
  },
};

// Inizializzazione del sistema i18n con geolocalizzazione IP
const initializeI18n = async () => {
  // Inizializza i18n con il language detector standard
  await i18n
    .use(LanguageDetector) 
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en', 
      lng: 'en',
      supportedLngs: ['en', 'it', 'fr', 'es', 'de'],
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
      },
      interpolation: {
        escapeValue: false,
      },
      debug: false,
    });

  // Inizializzazione geolocalizzazione IP per auto-selezione lingua
  try {
    // Se è il primo visitatore e non ha preferenze salvate, rileva automaticamente la lingua
    if (ipGeolocationService.isFirstVisit()) {
      console.log('Prima visita: avvio rilevamento geolocalizzazione IP per auto-selezione lingua...');
      const detectedLanguage = await ipGeolocationService.detectAndSetLanguage();
      
      // Cambia la lingua in base alla geolocalizzazione
      if (detectedLanguage && detectedLanguage !== i18n.language) {
        console.log(`Cambio lingua automatico da ${i18n.language} a ${detectedLanguage} basato su geolocalizzazione IP`);
        await i18n.changeLanguage(detectedLanguage);
      }
    } else {
      // Se ha già una preferenza salvata, usala
      const savedLanguage = ipGeolocationService.getSavedLanguagePreference();
      if (savedLanguage && savedLanguage !== i18n.language) {
        console.log(`Ripristino lingua salvata: ${savedLanguage}`);
        await i18n.changeLanguage(savedLanguage);
      }
    }
  } catch (error) {
    console.error('Errore nell\'inizializzazione della geolocalizzazione IP:', error);
    // Mantieni la lingua corrente come fallback
  }
};

// Inizializzazione asincrona
initializeI18n();

export default i18n;
