# 🤖 Guida Completa Configurazione OpenAI API - Alladin Trader

## 📋 Indice
1. [Introduzione](#introduzione)
2. [Requisiti Prerequisiti](#requisiti-prerequisiti)
3. [Procedura di Registrazione OpenAI](#procedura-di-registrazione-openai)
4. [Configurazione API Key](#configurazione-api-key)
5. [Configurazione Alladin Trader](#configurazione-alladin-trader)
6. [Test e Validazione](#test-e-validazione)
7. [Risoluzione Problemi](#risoluzione-problemi)
8. [Gestione Costi](#gestione-costi)
9. [Sicurezza Best Practices](#sicurezza-best-practices)
10. [FAQ](#faq)

---

## 🚀 Introduzione

Alladin Trader supporta due modalità di funzionamento per l'intelligenza artificiale:

### 🧪 Modalità Demo (Attuale)
- **Costo**: Gratuita
- **Funzionalità**: Simulazioni con dati mock
- **Limiti**: Nessuna analisi reale, risposte pre-generate
- **Uso**: Testing, demo, sviluppo

### 🚀 Modalità Produzione OpenAI (Raccomandata)
- **Costo**: ~$0.002-0.010 per richiesta
- **Funzionalità**: AI reale con analisi avanzate
- **Vantaggi**: Analisi finanziarie reali, previsioni accurate
- **Uso**: Trading reale, analisi professionali

---

## 📋 Requisiti Prerequisiti

### ✅ Requisiti Obbligatori
- [ ] Account email valido
- [ ] Metodo di pagamento (carta di credito/debito)
- [ ] Account Alladin Trader attivo
- [ ] Accesso al file `.env` del progetto

### 💳 Metodi di Pagamento Accettati
- Carte di credito (Visa, Mastercard, American Express)
- Carte di debito con circuito internazionale
- PayPal (in alcune regioni)

---

## 🔐 Procedura di Registrazione OpenAI

### Passo 1: Registrazione Account
1. **Vai su OpenAI Platform**
   ```
   https://platform.openai.com
   ```

2. **Clicca "Sign up"**
   - Usa email aziendale o personale
   - Verifica email di conferma

3. **Completa il Profilo**
   - Nome e cognone
   - Paese di residenza
   - Numero di telefono (richiesto)

### Passo 2: Configurazione Billing
1. **Accedi a "Billing" nella Sidebar**

2. **Aggiungi Metodo di Pagamento**
   - Clicca "Add payment method"
   - Inserisci dati carta di credito
   - Verifica identità se richiesto

3. **Imposta Limiti di Spesa** (Raccomandato)
   ```
   Soft limit: $10-20/mese
   Hard limit: $50-100/mese
   ```

### Passo 3: Creazione API Key
1. **Vai su "API Keys" nella Sidebar**

2. **Clicca "Create new secret key"**

3. **Configura la Chiave**
   ```
   Name: Alladin-Trader-Production
   Permissions: Full access
   ```

4. **⚠️ IMPORTANTE: COPIA SUBITO LA CHIAVE**
   - La chiave è visibile solo una volta
   - Inizia con "sk-"
   - Esempio: `sk-proj-abcdef123456789...`

---

## ⚙️ Configurazione Alladin Trader

### Passo 1: Modifica File Environment

**Apri il file `.env` nella root del progetto:**

```bash
# Copia da .env.example se non esiste
cp .env.example .env
```

**Modifica le variabili OpenAI:**

```env
# ✅ OPENAI CONFIGURATION
# -----------------------
VITE_OPENAI_API_KEY=sk-proj-la-tua-chiave-qui
VITE_OPENAI_MODE=real

# 🔗 XTB BROKER INTEGRATION  
# -------------------------
VITE_XTB_MODE=demo  # Cambia a "real" per trading reale
```

### Passo 2: Aggiornamento Runtime (Opzionale)

**Per configurazione senza riavvio (solo sviluppo):**

```typescript
// src/config/openai.ts
export const openAIConfig = {
  apiKey: 'sk-proj-la-tua-chiave-qui', // Non per produzione!
  mode: 'real',
  model: 'gpt-4o-mini'
};
```

### Passo 3: Configurazione UI

1. **Apri Alladin Trader**
2. **Vai su Settings (Impostazioni)**
3. **Clicca Tab "🤖 OpenAI API"**
4. **Incolla la chiave nel campo "OpenAI API Key"**
5. **Clicca "Test" per verificare**

---

## 🧪 Test e Validazione

### Test Automatico Integrato

Il sistema include test automatici per verificare:

1. **Validità Chiave API**
   ```
   ✅ Chiave inizia con "sk-"
   ✅ Chiave non è vuota
   ✅ Formato corretto
   ```

2. **Connessione OpenAI**
   ```
   ✅ Reachability servers OpenAI
   ✅ Autenticazione valida
   ✅ Billing account attivo
   ✅ Rate limits OK
   ```

3. **Funzionalità Base**
   ```
   ✅ Chat completions
   ✅ JSON response format
   ✅ Error handling
   ```

### Test Manuale Step-by-Step

1. **Test Chat AI**
   ```
   Vai a: Dashboard → Chat AI
   Messaggio: "Ciao, analizza il mercato azionario"
   Risposta: Deve essere coerente e non demo
   ```

2. **Test Previsioni**
   ```
   Vai a: Quantitative Alpha → Generate Prediction
   Ticker: "AAPL"
   Deve generare previsioni reali (non simulate)
   ```

3. **Test Analisi Segnali**
   ```
   Vai a: Risk Management Pro → Signal Analysis
   Deve fornire analisi dettagliata (non demo)
   ```

---

## 🔧 Risoluzione Problemi

### Errore 401 - Unauthorized
```
❌ Problema: "Invalid API key"
✅ Soluzione:
   1. Verifica che la chiave inizi con "sk-"
   2. Rigenera la chiave da platform.openai.com
   3. Verifica che il billing sia attivo
```

### Errore 402 - Payment Required
```
❌ Problema: "Insufficient credits"
✅ Soluzione:
   1. Vai su Billing in OpenAI
   2. Aggiungi fondi al tuo account
   3. Verifica limiti di spesa
```

### Errore 429 - Rate Limit
```
❌ Problema: "Rate limit exceeded"
✅ Soluzione:
   1. Aspetta 1-5 minuti
   2. Riduci frequenza chiamate
   3. Controlla uso nella dashboard OpenAI
```

### Errore di Network
```
❌ Problema: "Network error"
✅ Soluzione:
   1. Verifica connessione internet
   2. Disabilita VPN temporaneamente
   3. Prova da rete diversa
```

### Modalità Demo Persistente
```
❌ Problema: "Demo mode always active"
✅ Soluzione:
   1. Verifica variabili .env
   2. Riavvia server di sviluppo
   3. Verifica che VITE_OPENAI_MODE=real
```

---

## 💰 Gestione Costi

### Stima Costi per Funzionalità

| Funzionalità | Token/Request | Costo/Request | Costo/Mese (1000x) |
|--------------|---------------|---------------|-------------------|
| Chat Base | 500 | $0.001 | $1 |
| Trading Prediction | 1500 | $0.003 | $3 |
| Market Analysis | 2000 | $0.004 | $4 |
| Risk Analysis | 1000 | $0.002 | $2 |

### Strategie di Controllo Costi

1. **Limiti di Budget**
   ```
   Soft limit: $20/mese
   Hard limit: $50/mese
   Alert: $15/mese
   ```

2. **Ottimizzazione Token**
   ```typescript
   // Usa modelli economici per task semplici
   const cheapModel = 'gpt-3.5-turbo';
   const expensiveModel = 'gpt-4o';
   
   // Limita max_tokens
   maxTokens: 500, // invece di 1000+
   ```

3. **Caching Risultati**
   - Le stesse analisi vengono cached
   - Evita richieste duplicate
   - Risparmia fino al 70% dei costi

### Monitoraggio Costi

**Dashboard OpenAI**
```
https://platform.openai.com/usage
```

**Metriche Importanti**
- Total usage: $X.XX/mese
- Requests today: N
- Average cost: $X.XX/request
- Top models by cost

---

## 🔒 Sicurezza Best Practices

### ✅ Best Practices

1. **Chiavi API**
   ```
   ❌ Mai commitare la chiave su Git
   ❌ Mai condividere la chiave via chat/email
   ❌ Mai usare in codice sorgente pubblico
   ```

2. **Ambiente Produzione**
   ```bash
   # Usa variabili ambiente
   VITE_OPENAI_API_KEY=${OPENAI_API_KEY}
   
   # Mai hardcode
   const apiKey = "sk-..."; // ❌ SBAGLIATO
   ```

3. **Monitoring**
   ```
   ✅ Controlla usage regolarmente
   ✅ Imposta alert sui costi
   ✅ Revoca chiavi non usate
   ```

4. **Rotazione Chiavi**
   ```
   ✅ Rigenera ogni 3-6 mesi
   ✅ Usa chiavi diverse per ambiente
   ✅ Revoca immediatamente se compromessa
   ```

### 🛡️ Configurazioni Sicure

**File .env (NON committare)**
```env
# ✅ Sicuro - Solo variabili ambiente
VITE_OPENAI_API_KEY=${OPENAI_PROD_KEY}
VITE_OPENAI_MODE=real
```

**File .env.example (SÌ committare)**
```env
# ✅ Sicuro - Solo placeholder
VITE_OPENAI_API_KEY=
VITE_OPENAI_MODE=demo
```

**Git Ignore**
```bash
# .gitignore
.env          # NON committare mai
.env.local    # NON committare mai
.env.production # NON committare mai
```

---

## ❓ FAQ

### Q: Quanto costa realmente usare OpenAI?
**A:** Circa $0.002-0.010 per richiesta. Con 100 analisi/mese: $0.20-1.00.

### Q: Posso usare una chiave gratuita?
**A:** OpenAI non offre chiavi gratuite. Ma il free tier di $5 dura mesi per uso moderato.

### Q: Cosa succede se esaurisco il credito?
**A:** Il sistema torna automaticamente in modalità demo. Ricevi notifica di errore.

### Q: Posso usare la stessa chiave per sviluppo e produzione?
**A:** No, raccomandato chiavi separate con limiti diversi.

### Q: Come faccio backup della configurazione?
**A:** Salva solo il file .env.example (senza chiavi reali). La configurazione UI è nel browser storage.

### Q: Posso disattivare OpenAI tornando a demo?
**A:** Sì, imposta `VITE_OPENAI_MODE=demo` o cancella la chiave API.

### Q: OpenAI funziona in tutti i paesi?
**A:** OpenAI è disponibile nella maggior parte dei paesi. Controlla la lista aggiornata sul sito.

### Q: Posso usare modelli diversi da gpt-4o-mini?
**A:** Sì, puoi scegliere tra gpt-4o, gpt-3.5-turbo nelle impostazioni UI.

### Q: Come controllo l'uso in tempo reale?
**A:** Dashboard OpenAI: `platform.openai.com/usage` + Monitor integrato in Alladin Trader.

### Q: C'è un modo per usare OpenAI senza carta di credito?
**A:** No, OpenAI richiede metodo di pagamento anche per account gratuiti.

---

## 📞 Supporto

### Contatti in Caso di Problemi

1. **OpenAI Support**
   ```
   Docs: https://platform.openai.com/docs
   Support: https://help.openai.com
   Community: https://community.openai.com
   ```

2. **Alladin Trader Support**
   ```
   Documentazione: Questo file
   Issues: Repository GitHub
   Email: support@alladintrader.com
   ```

### Logs Utili per Debug

```typescript
// Apri Console Browser (F12)
console.log('OpenAI Config:', getOpenAIConfig());
console.log('Is Available:', isOpenAIAvailable());
console.log('Test Result:', await testOpenAIKey());
```

---

## ✅ Checklist Finale

Prima di usare OpenAI in produzione, verifica:

- [ ] Account OpenAI creato e verificato
- [ ] Billing configurato con carta di credito
- [ ] API Key generata e copiata
- [ ] Variabili .env aggiornate
- [ ] Test di connessione riuscito
- [ ] Limiti di spesa impostati
- [ ] Modalità demo disabilitata
- [ ] Analisi di esempio testate
- [ ] Costi monitorati per 24h
- [ ] Chiave non committata su Git

---

## 📚 Risorse Aggiuntive

- [OpenAI Platform](https://platform.openai.com)
- [API Documentation](https://platform.openai.com/docs)
- [Pricing](https://openai.com/pricing)
- [Alladin Trader Repository](https://github.com/alladintrader)
- [Community Discord](https://discord.gg/alladintrader)

---

*Ultimo aggiornamento: Novembre 2025*
*Versione: 1.0*
*Maintainer: Alladin Trader Team*