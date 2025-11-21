import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ipGeolocationService, IPLocationData } from '../services/ipGeolocationService';

/**
 * Hook per gestire l'auto-selezione della lingua tramite geolocalizzazione IP
 */
export const useIPGeolocation = () => {
  const { i18n } = useTranslation();
  const [isDetecting, setIsDetecting] = useState(false);
  const [location, setLocation] = useState<IPLocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoDetected, setHasAutoDetected] = useState(false);

  /**
   * Applica la lingua al sistema i18n
   */
  const applyLanguage = useCallback(async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      console.log(`Lingua cambiata a: ${language}`);
    } catch (error) {
      console.error('Errore nel cambio lingua:', error);
      setError('Errore nel cambio lingua');
    }
  }, [i18n]);

  /**
   * Rileva automaticamente la posizione e imposta la lingua
   */
  const detectAndSetLanguage = useCallback(async () => {
    if (isDetecting) return; // Evita chiamate multiple

    setIsDetecting(true);
    setError(null);

    try {
      // Se l'utente ha già una preferenza salvata, non sovrascrivere automaticamente
      if (!ipGeolocationService.isFirstVisit() && hasAutoDetected) {
        console.log('Utente ha già una preferenza lingua salvata, skipping auto-detection');
        setIsDetecting(false);
        return;
      }

      const detectedLanguage = await ipGeolocationService.detectAndSetLanguage();
      await applyLanguage(detectedLanguage);
      
      setHasAutoDetected(true);
      setLocation(await ipGeolocationService.detectLocation());
      
    } catch (error) {
      console.error('Errore nel rilevamento lingua automatica:', error);
      setError('Errore nel rilevamento della posizione');
      
      // Fallback: usa l'italiano come lingua di default
      await applyLanguage('it');
    } finally {
      setIsDetecting(false);
    }
  }, [applyLanguage, isDetecting, hasAutoDetected]);

  /**
   * Imposta manualmente una lingua (override dell'auto-detection)
   */
  const setManualLanguage = useCallback(async (language: string) => {
    setIsDetecting(true);
    setError(null);

    try {
      await applyLanguage(language);
      ipGeolocationService.saveLanguagePreference(language);
      setHasAutoDetected(true);
      
      console.log(`Lingua manualmente impostata a: ${language}`);
    } catch (error) {
      console.error('Errore nel setting manuale lingua:', error);
      setError('Errore nel setting della lingua');
    } finally {
      setIsDetecting(false);
    }
  }, [applyLanguage]);

  /**
   * Ottiene la lingua preferita salvata
   */
  const getSavedLanguage = useCallback(() => {
    return ipGeolocationService.getSavedLanguagePreference();
  }, []);

  /**
   * Verifica se è il primo caricamento
   */
  const isFirstVisit = useCallback(() => {
    return ipGeolocationService.isFirstVisit();
  }, []);

  /**
   * Pulisce la cache di localizzazione
   */
  const clearLocationCache = useCallback(() => {
    ipGeolocationService.clearCache();
    setLocation(null);
    setHasAutoDetected(false);
  }, []);

  // Auto-detection al primo mount del componente (solo al primo caricamento)
  useEffect(() => {
    // Esegui solo se non abbiamo mai auto-rilevato prima
    if (!hasAutoDetected && !isDetecting) {
      detectAndSetLanguage();
    }
  }, [detectAndSetLanguage, hasAutoDetected, isDetecting]);

  return {
    // Stati
    isDetecting,
    location,
    error,
    hasAutoDetected,
    
    // Metodi
    detectAndSetLanguage,
    setManualLanguage,
    getSavedLanguage,
    isFirstVisit,
    clearLocationCache,
    
    // Utilità
    currentLanguage: i18n.language,
    supportedLanguages: ['it', 'en', 'fr', 'es', 'de']
  };
};

export default useIPGeolocation;