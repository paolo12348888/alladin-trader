import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIPGeolocation from '../hooks/useIPGeolocation';

interface IPGeolocationControlProps {
  showDebugInfo?: boolean;
  className?: string;
}

const IPGeolocationControl: React.FC<IPGeolocationControlProps> = ({
  showDebugInfo = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const {
    isDetecting,
    location,
    error,
    hasAutoDetected,
    detectAndSetLanguage,
    setManualLanguage,
    getSavedLanguage,
    isFirstVisit,
    clearLocationCache,
    currentLanguage,
    supportedLanguages
  } = useIPGeolocation();

  const [showDebug, setShowDebug] = useState(showDebugInfo);
  const [savedLanguage, setSavedLanguage] = useState<string | null>(null);

  useEffect(() => {
    setSavedLanguage(getSavedLanguage());
  }, [getSavedLanguage]);

  const handleLanguageChange = async (language: string) => {
    await setManualLanguage(language);
    setSavedLanguage(language);
  };

  const handleReDetect = async () => {
    clearLocationCache();
    await detectAndSetLanguage();
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'IT': '🇮🇹',
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'UK': '🇬🇧',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'DE': '🇩🇪',
    };
    return flags[countryCode] || '🌍';
  };

  const getLanguageName = (langCode: string) => {
    const names: { [key: string]: string } = {
      'it': 'Italiano',
      'en': 'English',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch'
    };
    return names[langCode] || langCode;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          🌍 {t('AI Trading Assistant')}
        </h3>
        {showDebugInfo && (
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDebug ? 'Nascondi' : 'Mostra'} Debug
          </button>
        )}
      </div>

      {/* Status principale */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            isDetecting ? 'bg-yellow-500 animate-pulse' : 
            error ? 'bg-red-500' : 'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium">
            {isDetecting ? 'Rilevamento posizione in corso...' :
             error ? 'Errore nel rilevamento' :
             hasAutoDetected ? 'Lingua impostata automaticamente' : 'In attesa di rilevamento'}
          </span>
        </div>

        {/* Lingua attuale */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Lingua corrente:</span>
          <span className="font-semibold text-blue-600">
            {getLanguageName(currentLanguage)} ({currentLanguage.toUpperCase()})
          </span>
        </div>

        {/* Posizione rilevata */}
        {location && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">Posizione:</span>
            <span className="text-sm">
              {getCountryFlag(location.countryCode)} {location.country} ({location.countryCode})
            </span>
          </div>
        )}
      </div>

      {/* Azioni */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Rilevamento automatico */}
        <button
          onClick={handleReDetect}
          disabled={isDetecting}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isDetecting ? '⏳ Rilevamento...' : '🔄 Rilevamento Automatico'}
        </button>

        {/* Reset cache */}
        <button
          onClick={clearLocationCache}
          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          🗑️ Pulisci Cache
        </button>
      </div>

      {/* Selezione lingua manuale */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imposta lingua manualmente:
        </label>
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {supportedLanguages.map(lang => (
            <option key={lang} value={lang}>
              {getLanguageName(lang)} ({lang.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Debug info */}
      {showDebug && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <div className="space-y-1">
            <div><strong>Prima visita:</strong> {isFirstVisit() ? 'Sì' : 'No'}</div>
            <div><strong>Auto-rilevato:</strong> {hasAutoDetected ? 'Sì' : 'No'}</div>
            <div><strong>Lingua salvata:</strong> {savedLanguage || 'Nessuna'}</div>
            {location && (
              <>
                <div><strong>Paese:</strong> {location.country} ({location.countryCode})</div>
                <div><strong>Regione:</strong> {location.region}</div>
                <div><strong>Città:</strong> {location.city}</div>
                <div><strong>Fuso orario:</strong> {location.timezone}</div>
                <div><strong>ISP:</strong> {location.org}</div>
              </>
            )}
            {error && (
              <div className="text-red-600"><strong>Errore:</strong> {error}</div>
            )}
          </div>
        </div>
      )}

      {/* Informazioni privacy */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
        <p className="text-blue-700">
          🔒 <strong>Privacy:</strong> Utilizziamo solo il tuo indirizzo IP per determinare la posizione geografica e impostare automaticamente la lingua appropriata. 
          I dati non vengono memorizzati o condivisi con terze parti.
        </p>
      </div>
    </div>
  );
};

export default IPGeolocationControl;