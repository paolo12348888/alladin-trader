# 🚀 Deploy Alladin Trader su Railway

## 📋 Prerequisites
- Account Railway (gratuito su [railway.app](https://railway.app))
- Git repository con il tuo progetto
- OpenAI API Key (opzionale per modalità demo)

## 🛠️ Deploy Steps

### 1. Preparazione Repository
```bash
# Push del progetto su GitHub/GitLab
git init
git add .
git commit -m "Alladin Trader - Ready for Railway"
git remote add origin https://github.com/your-username/alladin-trader.git
git push -u origin main
```

### 2. Setup su Railway
1. **Accedi a [railway.app](https://railway.app)**
2. **Clicca "New Project"**
3. **Seleziona "Deploy from GitHub repo"**
4. **Scegli il repository Alladin Trader**
5. **Railway rileva automaticamente la configurazione**

### 3. Configurazione Environment Variables
Su Railway Dashboard → **Variables** aggiungi:

```bash
# 🤖 OPENAI CONFIGURATION
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_OPENAI_MODE=demo

# 🤖 TELEGRAM BOT (optional)
VITE_TELEGRAM_ENABLED=true
VITE_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
VITE_TELEGRAM_CHAT_ID=your-telegram-chat-id

# 🌐 GEOLOCALIZATION
VITE_GEOLOCATION_ENABLED=true
VITE_DEFAULT_LANGUAGE=it

# 💱 XTB BROKER
VITE_XTB_MODE=demo
VITE_XTB_CLIENT_ID=your-xtb-client-id
VITE_XTB_ACCOUNT_ID=your-xtb-account-id
```

### 4. Deploy Automático
Railway eseguirà automaticamente:
- ✅ `pnpm install` - Installazione dipendenze
- ✅ `pnpm run build:prod` - Build ottimizzata
- ✅ Deploy con Nginx
- ✅ SSL automatico (HTTPS)

### 5. Verifica Deploy
1. **URL dell'app**: `https://your-project.railway.app`
2. **Test funzionalità**:
   - Dashboard carica correttamente
   - Cambio lingua funziona
   - Chat AI risponde (demo mode)
   - Grafici visualizzano dati

## 🔧 Configuration Details

### Environment Variables Explained

| Variable | Required | Description | Values |
|----------|----------|-------------|--------|
| `VITE_OPENAI_API_KEY` | No* | OpenAI API key per AI reale | `sk-...` |
| `VITE_OPENAI_MODE` | Yes | Modalità demo o reale | `demo` / `real` |
| `VITE_TELEGRAM_ENABLED` | No | Abilita notifiche Telegram | `true` / `false` |
| `VITE_GEOLOCATION_ENABLED` | No | Rilevamento automatico lingua | `true` / `false` |
| `VITE_DEFAULT_LANGUAGE` | No | Lingua di default | `it` / `en` / `fr` / `es` / `de` |
| `VITE_XTB_MODE` | Yes | Modalità broker | `demo` / `real` |

*OpenAI key non è richiesta se usi `VITE_OPENAI_MODE=demo`

### 🔒 Sicurezza
- **HTTPS**: Abilitato automaticamente
- **Environment Variables**: Crittografate su Railway
- **No Secrets in Code**: Tutte le chiavi sono environment variables

## 📊 Monitor & Analytics

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: Version history e rollback
- **Custom Domains**: Setup dominio personalizzato

### Health Checks
- **Auto-deploy** su ogni push
- **Zero-downtime** deployments
- **Automatic scaling** in base al traffico

## 🚨 Troubleshooting

### Build Fails
```bash
# Verifica package.json
npm run build

# Test locale
npm install
npm run build:prod
```

### Environment Variables
- Assicurati che tutte le `VITE_` variables siano impostate
- Non aggiungere `VITE_` prefix se non necessario

### OpenAI Issues
- **Demo mode** funziona senza API key
- **Real mode** richiede API key valida
- Testa la configurazione su Settings → 🤖 OpenAI API

## 📈 Performance

### Otimizzazioni Incluse
- ✅ **Code Splitting** - Caricamento lazy dei componenti
- ✅ **Gzip Compression** - Riduzione banda ~70%
- ✅ **Static Asset Caching** - Cache di 1 anno per assets
- ✅ **Minification** - Bundle ottimizzati
- ✅ **Tree Shaking** - Rimozione codice non usato

### Monitoring
- **Lighthouse Score**: Target >90
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s

## 🌐 Custom Domain

### Setup su Railway
1. **Settings** → **Domains**
2. **Add Domain** → `your-domain.com`
3. **DNS Configuration**:
   ```
   Type: CNAME
   Name: www
   Value: your-project.railway.app
   
   Type: A
   Name: @
   Value: 172.67.74.226
   ```

## 🔄 Continuous Deployment

### Auto-Deploy su Railway
- **Push su main** → Deploy automatico
- **Branch preview** → Deploy di staging
- **Rollback** → Un click per tornare alla versione precedente

### GitHub Actions (Opzionale)
```yaml
# .github/workflows/railway.yml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway deploy
```

## 🎯 Post-Deploy

### Test Completi
1. **Dashboard**: ✅ Carica e mostra dati
2. **AI Chat**: ✅ Risponde (demo o real)
3. **Trading**: ✅ Grafici e simulazioni
4. **Multi-lingua**: ✅ Cambio lingua funziona
5. **Responsive**: ✅ Mobile e desktop

### Configurazioni Avanzate
- **SSL Certificate**: Automatico su Railway
- **CDN**: Built-in con Cloudflare
- **Monitoring**: Integrated metrics

---

## 🆘 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Project Issues**: Crea issue su GitHub
- **Community**: Discord Railway community

**🎉 Deploy completato! La tua piattaforma Alladin Trader è live su Railway!**