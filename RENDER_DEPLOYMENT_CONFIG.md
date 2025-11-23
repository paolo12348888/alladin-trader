# 🚀 Configurazione Deploy Render - Alladin Trader

## Configurazione Corretta per Render

### 1. Tipo di Servizio
```
TIPO: Static Site
```

### 2. Configurazione Build
```
ROOT DIRECTORY: alladin-trader-fixed (o cartella principale)
BUILD COMMAND: pnpm install && pnpm run build
PUBLISH DIRECTORY: dist
```

### 3. Variabili d'Ambiente da Configurare

Nella dashboard Render, vai su **Environment** e aggiungi queste variabili:

#### Obbligatorie per Funzionalità Base:
```
VITE_OPENAI_MODE=demo
VITE_XTB_MODE=demo
VITE_APP_VERSION=1.0.0
```

#### Opzionali (per Funzionalità Avanzate):
```
# Se vuoi attivare AI real (costa crediti OpenAI):
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# Per broker reale XTB:
VITE_XTB_CLIENT_ID=your-xtb-client-id
VITE_XTB_ACCOUNT_ID=your-xtb-account-id

# Per notifiche Telegram:
VITE_TELEGRAM_ENABLED=false
```

#### Auto-generate da Render:
```
# Render imposterà automaticamente:
# VITE_API_BASE_URL = https://your-app-name.onrender.com
```

## Note Importanti

1. **VITE_OPENAI_MODE=demo** - Funziona senza API key, usa dati simulati
2. **VITE_XTB_MODE=demo** - Modalità demo trading, sicura per test
3. **Non servono altre configurazioni** per il deploy base
4. **VITE_BACKEND_URL** - Non necessario (non hai backend separato)

## Errori da Evitare

❌ **NON usare** le configurazioni con "arduino" o "nginx"
❌ **NON creare** 2 servizi separati (non hai backend)
✅ **USA** configurazione Static Site singola
✅ **USA** i comandi pnpm corretti

## Deploy Steps

1. Crea nuovo progetto su Render
2. Connetti repository GitHub
3. Imposta configurazione Static Site
4. Aggiungi variabili d'ambiente
5. Deploy!

Il deploy dovrebbe funzionare senza errori dopo queste configurazioni.