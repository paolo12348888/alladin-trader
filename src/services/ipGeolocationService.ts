/**
 * Servizio di geolocalizzazione IP per auto-selezione lingua
 * Utilizza API gratuite per rilevare la posizione geografica dell'utente
 */

export interface IPLocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  org: string;
}

export interface CountryLanguageMapping {
  [countryCode: string]: string;
}

/**
 * Mappatura paese -> lingua secondo specifiche richieste
 */
export const COUNTRY_LANGUAGE_MAP: CountryLanguageMapping = {
  'IT': 'it',  // Italia -> Italiano
  'US': 'en',  // Stati Uniti -> Inglese
  'GB': 'en',  // Regno Unito -> Inglese
  'UK': 'en',  // UK -> Inglese
  'FR': 'fr',  // Francia -> Francese
  'ES': 'es',  // Spagna -> Spagnolo
  'DE': 'de',  // Germania -> Tedesco
};

class IPGeolocationService {
  private static instance: IPGeolocationService;
  private cachedLocation: IPLocationData | null = null;
  private readonly STORAGE_KEY = 'alladin_user_location';
  private readonly LANGUAGE_STORAGE_KEY = 'alladin_preferred_language';
  private readonly FALLBACK_API = 'https://ipapi.co/json/';

  private constructor() {}

  static getInstance(): IPGeolocationService {
    if (!IPGeolocationService.instance) {
      IPGeolocationService.instance = new IPGeolocationService();
    }
    return IPGeolocationService.instance;
  }

  /**
   * Rileva la posizione geografica dell'utente tramite IP
   */
  async detectLocation(): Promise<IPLocationData> {
    // Controlla se abbiamo già dati in cache
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    // Prova a recuperare da localStorage
    const cached = this.getCachedLocation();
    if (cached) {
      this.cachedLocation = cached;
      return cached;
    }

    try {
      // Usa ipapi.co (gratuito, 1000 chiamate/mese)
      const response = await fetch(`${this.FALLBACK_API}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const locationData: IPLocationData = {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'UTC',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        org: data.org || 'Unknown',
      };

      // Salva in cache
      this.cachedLocation = locationData;
      this.saveToCache(locationData);
      
      return locationData;
    } catch (error) {
      console.error('Errore nel rilevamento IP:', error);
      
      // Fallback: usa la lingua di default (italiano)
      const fallbackLocation: IPLocationData = {
        country: 'Unknown',
        countryCode: 'IT', // Default all'Italia
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'Europe/Rome',
        latitude: 0,
        longitude: 0,
        org: 'Unknown',
      };

      this.cachedLocation = fallbackLocation;
      return fallbackLocation;
    }
  }

  /**
   * Determina la lingua preferita basata sul paese rilevato
   */
  getLanguageFromLocation(location: IPLocationData): string {
    const languageCode = COUNTRY_LANGUAGE_MAP[location.countryCode.toUpperCase()];
    
    // Se non troviamo una mappatura, usiamo il fallback italiano
    return languageCode || 'it';
  }

  /**
   * Salva la preferenza lingua dell'utente in localStorage
   */
  saveLanguagePreference(language: string): void {
    try {
      localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Errore nel salvataggio della lingua preferita:', error);
    }
  }

  /**
   * Recupera la lingua preferita salvata
   */
  getSavedLanguagePreference(): string | null {
    try {
      return localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.error('Errore nel recupero della lingua preferita:', error);
      return null;
    }
  }

  /**
   * Processo completo: rileva posizione e determina lingua
   */
  async detectAndSetLanguage(): Promise<string> {
    const location = await this.detectLocation();
    const language = this.getLanguageFromLocation(location);
    
    // Salva la preferenza
    this.saveLanguagePreference(language);
    
    console.log(`Posizione rilevata: ${location.country} (${location.countryCode}) -> Lingua: ${language}`);
    
    return language;
  }

  /**
   * Verifica se è il primo caricamento (senza preferenza salvata)
   */
  isFirstVisit(): boolean {
    return !this.getSavedLanguagePreference();
  }

  /**
   * Salva i dati di localizzazione in localStorage
   */
  private saveToCache(location: IPLocationData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Errore nel salvataggio della cache di localizzazione:', error);
    }
  }

  /**
   * Recupera i dati di localizzazione dalla cache
   */
  private getCachedLocation(): IPLocationData | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Errore nel recupero della cache di localizzazione:', error);
    }
    return null;
  }

  /**
   * Pulisce la cache (utile per debugging o reset)
   */
  clearCache(): void {
    this.cachedLocation = null;
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      // Nota: non rimuoviamo la preferenza lingua per rispettare la scelta dell'utente
    } catch (error) {
      console.error('Errore nella pulizia della cache:', error);
    }
  }
}

export const ipGeolocationService = IPGeolocationService.getInstance();