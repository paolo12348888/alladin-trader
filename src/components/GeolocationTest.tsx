import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIPGeolocation from '../hooks/useIPGeolocation';

const GeolocationTest: React.FC = () => {
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

  useEffect(() => {
    console.log('GeolocationTest component loaded');
    console.log('Current language:', currentLanguage);
    console.log('Has auto detected:', hasAutoDetected);
  }, [currentLanguage, hasAutoDetected]);

  const handleTestGeolocation = async () => {
    console.log('Testing geolocation manually...');
    await detectAndSetLanguage();
  };

  const handleTestLanguageChange = async (lang: string) => {
    console.log('Testing language change to:', lang);
    await setManualLanguage(lang);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Geolocalizzazione IP - Test Component</h2>
      
      {/* Status attuale */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Status Attuale:</h3>
        <div className="space-y-2 text-sm">
          <div><strong>Lingua corrente:</strong> {currentLanguage}</div>
          <div><strong>È primo accesso:</strong> {isFirstVisit() ? 'Sì' : 'No'}</div>
          <div><strong>Auto-rilevato:</strong> {hasAutoDetected ? 'Sì' : 'No'}</div>
          <div><strong>Stato rilevamento:</strong> {isDetecting ? 'In corso...' : 'Fermo'}</div>
          <div><strong>Lingua salvata:</strong> {getSavedLanguage() || 'Nessuna'}</div>
        </div>
      </div>

      {/* Posizione rilevata */}
      {location && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Posizione Rilevata:</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Paese:</strong> {location.country} ({location.countryCode})</div>
            <div><strong>Regione:</strong> {location.region}</div>
            <div><strong>Città:</strong> {location.city}</div>
            <div><strong>Fuso orario:</strong> {location.timezone}</div>
            <div><strong>ISP:</strong> {location.org}</div>
          </div>
        </div>
      )}

      {/* Errore */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <h3 className="font-semibold mb-2 text-red-700">Errore:</h3>
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      {/* Azioni di test */}
      <div className="space-y-4">
        <h3 className="font-semibold">Test Actions:</h3>
        
        <div className="flex gap-2">
          <button
            onClick={handleTestGeolocation}
            disabled={isDetecting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isDetecting ? '⏳ Rilevamento...' : '🔄 Test Rilevamento Automatico'}
          </button>
          
          <button
            onClick={clearLocationCache}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            🗑️ Pulisci Cache
          </button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Test Cambio Lingua Manuale:</h4>
          <div className="flex gap-2 flex-wrap">
            {supportedLanguages.map(lang => (
              <button
                key={lang}
                onClick={() => handleTestLanguageChange(lang)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                disabled={currentLanguage === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Debug Info (Console):</h3>
        <div className="text-sm text-gray-600">
          Controlla la console del browser per i log dettagliati del sistema di geolocalizzazione.
        </div>
      </div>
    </div>
  );
};

export default GeolocationTest;