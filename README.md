# 🤖 Alladin Trader - Piattaforma di Trading Algoritmico Internazionale

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)

> **Alladin Trader** è una piattaforma avanzata di trading algoritmico con intelligenza artificiale integrata, supporto multilingua e integrazione broker per trading real-time.

## ✨ Caratteristiche Principali

### 🧠 Intelligenza Artificiale
- **OpenAI Integration** - Analisi di mercato e previsioni avanzate
- **Chat AI** - Assistente AI per consulenze finanziarie personalizzate
- **Analisi Predittiva** - Modelli ML per previsioni di prezzo e trend
- **Sentiment Analysis** - Analisi sentiment del mercato in tempo reale

### 📊 Moduli Trading
- **Quantitative Alpha** - Trading algoritmico avanzato
- **Value Investing** - Analisi fundamental per investimenti a lungo termine
- **ETF Optimization** - Ottimizzazione portafogli ETF
- **Risk Management Pro** - Gestione avanzata del rischio
- **Supply Chain Intelligence** - Analisi catena di fornitura

### 🌍 Internazionalizzazione
- **6 Lingue Supportate**: Italiano, Inglese, Francese, Spagnolo, Tedesco
- **Geolocalizzazione Automatica** - Rilevamento automatico della lingua
- **Interfaccia Adattiva** - UI completamente localizzata

### 🔗 Integrazione Broker
- **XTB Broker** - Trading real-time
- **Demo Mode** - Modalità di testing senza rischi
- **Gestione Ordini** - Sistema completo di ordini e posizioni

### 📱 Interfaccia Utente
- **Dashboard Interattivo** - Grafici e widget personalizzabili
- **Design Responsive** - Ottimizzato per desktop, tablet e mobile
- **Dark/Light Mode** - Tema scuro e chiaro
- **Real-time Updates** - Aggiornamenti in tempo reale

## 🚀 Quick Start

### 1. Clona il Repository
```bash
git clone https://github.com/alladintrader/alladin-trader.git
cd alladin-trader
```

### 2. Installa le Dipendenze
```bash
npm install
# o
pnpm install
# o
yarn install
```

### 3. Configura l'Ambiente
```bash
# Copia il template di configurazione
cp .env.example .env

# Modifica le variabili necessarie
nano .env
```

### 4. Avvia il Server di Sviluppo
```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 🔧 Configurazione OpenAI API

### 🤖 Per Abilitare l'AI Reale

Alladin Trader supporta **due modalità**:
- **🧪 Modalità Demo**: Gratuita, dati simulati
- **🚀 Modalità Reale**: AI OpenAI, analisi reali

#### Guida Completa OpenAI
📚 **LEGGI LA GUIDA COMPLETA**: [`OPENAI_SETUP_GUIDE.md`](./OPENAI_SETUP_GUIDE.md)

#### Setup Rapido
1. **Crea Account OpenAI**
   ```
   https://platform.openai.com
   ```

2. **Genera API Key**
   - Vai su "API Keys"
   - Clicca "Create new secret key"
   - Copia la chiave (inizia con "sk-")

3. **Configura in Alladin Trader**
   ```env
   # .env
   VITE_OPENAI_API_KEY=sk-la-tua-chiave-qui
   VITE_OPENAI_MODE=real
   ```

4. **Testa la Configurazione**
   - Vai su Settings → 🤖 OpenAI API
   - Clicca "Test" per verificare

### 💰 Costi OpenAI
- **Chat Base**: ~$0.001 per conversazione
- **Analisi Finanziaria**: ~$0.005 per analisi  
- **Previsioni Trading**: ~$0.010 per previsione
- **Budget Raccomandato**: $5-10 per iniziare

## 📋 Funzionalità per Sezione

### 🏠 Dashboard
- Panoramica portafoglio
- Performance in tempo reale
- Widget personalizzabili
- Alert e notifiche

### 📈 Quantitative Alpha
- Trading algoritmico
- Backtesting strategie
- Ottimizzazione parametri
- Analisi tecnica avanzata

### 💎 Value Investing
- Screeners azionari
- Analisi fondamentali
- Valutazioni automatiche
- Scorecard investimenti

### 🎯 ETF Optimization
- Ottimizzazione portafogli
- Analisi rischio/rendimento
- Rebalancing automatico
- Backtest strategici

### ⚠️ Risk Management
- Stress testing
- Calcolo VaR
- Analisi correlazioni
- Hedging automatico

### 🔗 Supply Chain
- Monitor supply chain
- Analisi impatti geopolitici
- Previsioni commodity
- Risk scoring

## 🌍 Lingue Supportate

| Lingua | Codice | Traduzione | Localizzazione |
|--------|--------|------------|----------------|
| 🇮🇹 Italiano | `it` | ✅ Completa | ✅ Completa |
| 🇺🇸 English | `en` | ✅ Completa | ✅ Completa |
| 🇫🇷 Français | `fr` | ✅ Completa | ✅ Completa |
| 🇪🇸 Español | `es` | ✅ Completa | ✅ Completa |
| 🇩🇪 Deutsch | `de` | ✅ Completa | ✅ Completa |

### Geolocalizzazione Automatica
Il sistema rileva automaticamente la lingua dell'utente basandosi su:
- Indirizzo IP geografico
- Preferenze browser
- Impostazioni sistema

## 🔐 Configurazione Sicurezza

### Variabili Ambiente (.env)
```env
# ✅ OPENAI CONFIGURATION
VITE_OPENAI_API_KEY=
VITE_OPENAI_MODE=demo

# 🤖 TELEGRAM BOT
VITE_TELEGRAM_ENABLED=true
VITE_TELEGRAM_BOT_TOKEN=
VITE_TELEGRAM_CHAT_ID=

# 🌐 GEOLOCALIZATION
VITE_GEOLOCATION_ENABLED=true
VITE_DEFAULT_LANGUAGE=it

# 💱 BROKER INTEGRATION
VITE_XTB_MODE=demo
VITE_XTB_CLIENT_ID=
VITE_XTB_ACCOUNT_ID=
```

### ⚠️ Sicurezza Importante
- **NON committare mai il file `.env`** su Git
- Usa `.env.example` per template (già incluso)
- Rigenera API keys regolarmente
- Monitora l'uso e i costi

## 📊 Architettura Tecnica

### Frontend
```
React 18 + TypeScript
├── Vite (Build tool)
├── Tailwind CSS (Styling)
├── Lucide Icons (Icone)
├── i18next (Internazionalizzazione)
└── Sonner (Notifiche)
```

### Struttura Progetto
```
src/
├── components/          # Componenti UI riutilizzabili
├── pages/              # Pagine principali
├── services/           # Servizi API e business logic
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript definitions
├── lib/                # Utilities e helpers
└── locales/            # File di traduzione
```

### Integrazioni API
- **OpenAI GPT** - Intelligenza artificiale
- **XTB Broker** - Trading platform
- **Yahoo Finance** - Dati di mercato (demo)
- **Telegram Bot** - Notifiche
- **IP Geolocation** - Rilevamento lingua

## 🚀 Deployment

### Build per Produzione
```bash
npm run build
# Genera cartella dist/ con file ottimizzati
```

### Deployment Options

#### Vercel (Raccomandato)
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel

# Setup automatico con environmental variables
```

#### Netlify
```bash
# Build e deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Railway
```bash
# Connessione repository Railway
railway login
railway link
railway deploy
```

#### Docker
```bash
# Build Docker image
docker build -t alladin-trader .

# Run container
docker run -p 3000:3000 alladin-trader
```

### Configurazione Environment Variables in Produzione

```bash
# Vercel
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_OPENAI_MODE

# Netlify
netlify env:set VITE_OPENAI_API_KEY "sk-..."
netlify env:set VITE_OPENAI_MODE "real"
```

## 🧪 Testing

### Test Suite
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Manuale
1. **Test OpenAI**: Settings → OpenAI API → Test
2. **Test Geolocalizzazione**: Settings → Language → Test
3. **Test Chat AI**: Dashboard → Chat → Send Message
4. **Test Modalità Demo**: Disabilita API key

## 🛠️ Sviluppo

### Script Disponibili
```bash
npm run dev          # Server sviluppo
npm run build        # Build produzione
npm run preview      # Preview build locale
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Convenzioni Codice
- **TypeScript strict mode** abilitato
- **ESLint + Prettier** per code style
- **Conventional Commits** per git messages
- **Component naming**: PascalCase
- **File naming**: kebab-case

### Aggiungere Nuove Funzionalità
1. Crea branch feature: `git checkout -b feature/nuova-funzionalita`
2. Sviluppa seguendo le convenzioni
3. Aggiungi test se applicabile
4. Commit con conventional commits
5. Crea Pull Request

## 📈 Performance

### Metriche Target
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 2MB (gzipped)

### Ottimizzazioni Implementate
- **Code splitting** automatico con Vite
- **Lazy loading** componenti pesanti
- **Image optimization** con WebP
- **Tree shaking** per bundle minimi
- **Service Worker** per caching

## 🤝 Contribuzione

### Come Contribuire
1. Fork del repository
2. Crea branch feature: `git checkout -b feature/miglioramento`
3. Commit changes: `git commit -m 'feat: migliora interfaccia'`
4. Push branch: `git push origin feature/miglioramento`
5. Crea Pull Request

### Linee Guida
- **Testa** sempre le modifiche
- **Documenta** nuove funzionalità
- **Segue** le convenzioni di codice
- **Rispetta** i PR guidelines

### Tipi di Contribuzioni
- 🐛 Bug fixes
- ✨ Nuove features
- 📚 Documentazione
- 🎨 UI/UX improvements
- 🧪 Test coverage
- 🌐 Traduzioni

## 📜 License

Questo progetto è sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

## 📞 Supporto

### Risorse Utili
- **📚 Documentazione**: [Wiki del progetto](https://github.com/alladintrader/wiki)
- **🐛 Bug Reports**: [Issues](https://github.com/alladintrader/issues)
- **💬 Community**: [Discord](https://discord.gg/alladintrader)
- **📧 Email**: support@alladintrader.com

### FAQ Rapide

**Q: Come attivo la modalità reale OpenAI?**
A: Vedi [`OPENAI_SETUP_GUIDE.md`](./OPENAI_SETUP_GUIDE.md) per guida completa.

**Q: Il sistema funziona senza API key OpenAI?**
A: Sì, in modalità demo gratuita con dati simulati.

**Q: Posso usare broker diversi da XTB?**
A: Attualmente supportato solo XTB. Altri broker in sviluppo.

**Q: Come cambio lingua dell'interfaccia?**
A: Settings → Language → Seleziona lingua preferita.

---

## 🎯 Roadmap

### Versione 1.1 (Q1 2025)
- [ ] Integrazione broker aggiuntivi (IG, eToro)
- [ ] Mobile app (React Native)
- [ ] Trading bot standalone
- [ ] API pubblica

### Versione 1.2 (Q2 2025)
- [ ] Machine Learning avanzato
- [ ] Social trading features
- [ ] Portfolio backtesting
- [ ] Advanced charting

### Versione 2.0 (Q3 2025)
- [ ] Multi-asset trading
- [ ] Institutional features
- [ ] White-label solutions
- [ ] Advanced risk management

---

<div align="center">

**🤖 Alladin Trader** - *Il futuro del trading algoritmico*

[![GitHub stars](https://img.shields.io/github/stars/alladintrader/alladin-trader.svg?style=social&label=Star)](https://github.com/alladintrader/alladin-trader)
[![GitHub forks](https://img.shields.io/github/forks/alladintrader/alladin-trader.svg?style=social&label=Fork)](https://github.com/alladintrader/alladin-trader/fork)

*Made with ❤️ by the Alladin Trader Team*

</div>