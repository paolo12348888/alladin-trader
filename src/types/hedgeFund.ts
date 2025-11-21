/**
 * Type Definitions per Sistema Hedge Fund Algo Trading
 * Interfacce per algoritmi di trading avanzati e gestione del rischio
 */

/**
 * Stato degli algoritmi di trading automatico
 */
export interface AlgoStatus {
  /** Identificativo univoco dell'algoritmo */
  id: string;
  /** Nome dell'algoritmo */
  name: string;
  /** Stato corrente: attivo, in pausa, fermo, errore */
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'ERROR';
  /** Data e ora dell'ultima esecuzione */
  last_execution?: string;
  /** P&L totale generato dall'algoritmo */
  total_pnl: number;
  /** Numero di trade eseguiti */
  trades_count: number;
  /** Percentuale di successo */
  success_rate: number;
  /** Tempo di esecuzione medio in millisecondi */
  avg_execution_time?: number;
  /** Configurazione corrente dell'algoritmo */
  config: Record<string, any>;
  /** Eventuale messaggio di errore */
  error_message?: string;
}

/**
 * Segnale di trading generato dagli algoritmi
 */
export interface TradingSignal {
  /** Identificativo univoco del segnale */
  id: string;
  /** Simbolo del titolo/coppia di valute */
  symbol: string;
  /** Direzione del trade: BUY o SELL */
  action: 'BUY' | 'SELL';
  /** Prezzo target di entrata */
  target_price: number;
  /** Volume/quantità da tradare */
  volume: number;
  /** Tipo di ordine: market, limit, stop */
  order_type: 'MARKET' | 'LIMIT' | 'STOP';
  /** Timestamp di generazione del segnale */
  timestamp: string;
  /** Confidenza del segnale (0-100) */
  confidence: number;
  /** Timeframe di riferimento */
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  /** Algoritmo che ha generato il segnale */
  source_algo: string;
  /** Parametri aggiuntivi del segnale */
  parameters?: Record<string, any>;
  /** Stop loss consigliato */
  stop_loss?: number;
  /** Take profit consigliato */
  take_profit?: number;
}

/**
 * Ordine di esecuzione sul mercato
 */
export interface ExecutionOrder {
  /** Identificativo univoco dell'ordine */
  id: string;
  /** Riferimento al segnale di trading */
  signal_id: string;
  /** Simbolo del titolo */
  symbol: string;
  /** Side dell'ordine */
  side: 'BUY' | 'SELL';
  /** Quantità da eseguire */
  quantity: number;
  /** Prezzo limite (se applicabile) */
  limit_price?: number;
  /** Tipo di ordine */
  order_type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'ICEBOX';
  /** Stato dell'ordine */
  status: 'PENDING' | 'PARTIAL' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  /** Quantità già eseguita */
  filled_quantity: number;
  /** Prezzo medio di esecuzione */
  average_price?: number;
  /** Commissioni sostenute */
  commission: number;
  /** Timestamp di creazione */
  created_at: string;
  /** Timestamp di completamento */
  filled_at?: string;
  /** ID dell'ordine presso il broker */
  broker_order_id?: string;
  /** Messaggio di errore (se presente) */
  error_message?: string;
}

/**
 * Configurazione per algoritmo VWAP (Volume Weighted Average Price)
 */
export interface VWAPConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Durata dell'esecuzione in minuti */
  duration_minutes: number;
  /** Volume totale da distribuire */
  total_volume: number;
  /** Orario di inizio esecuzione */
  start_time: string;
  /** Orario di fine esecuzione */
  end_time: string;
  /** Deviazione massima dal VWAP teorico (%) */
  max_deviation_percent: number;
  /** Volume minimo per singolo child order */
  min_child_order_size: number;
  /** Volume massimo per singolo child order */
  max_child_order_size: number;
  /** Fattore di aggressività (0.1-2.0) */
  aggression_factor: number;
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Configurazione per algoritmo TWAP (Time Weighted Average Price)
 */
export interface TWAPConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Durata dell'esecuzione in minuti */
  duration_minutes: number;
  /** Volume totale da distribuire */
  total_volume: number;
  /** Intervallo tra gli ordini in secondi */
  interval_seconds: number;
  /** Orario di inizio esecuzione */
  start_time: string;
  /** Orario di fine esecuzione */
  end_time: string;
  /** Variabilità percentuale nel timing */
  timing_variance_percent: number;
  /** Volume minimo per singolo child order */
  min_child_order_size: number;
  /** Volume massimo per singolo child order */
  max_child_order_size: number;
  /** Fattore di aggressività (0.1-2.0) */
  aggression_factor: number;
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Configurazione per algoritmo Iceberg
 */
export interface IcebergConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Volume totale dell'ordine */
  total_volume: number;
  /** Dimensione di ogni slice visibile */
  display_size: number;
  /** Gap tra slices in millisecondi */
  slice_interval_ms: number;
  /** Numero massimo di slices attive */
  max_active_slices: number;
  /** Variabilità nella dimensione delle slices */
  size_variance_percent: number;
  /** Orario di inizio */
  start_time: string;
  /** Orario di fine */
  end_time: string;
  /** Fattore di segretezza della slice */
  slice_secrecy_factor: number;
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Posizione aperta nel portafoglio
 */
export interface Position {
  /** Identificativo univoco della posizione */
  id: string;
  /** Simbolo del titolo */
  symbol: string;
  /** Direzione della posizione */
  direction: 'LONG' | 'SHORT' | 'FLAT';
  /** Quantità detenuta */
  quantity: number;
  /** Prezzo medio di entrata */
  average_price: number;
  /** Prezzo corrente di mercato */
  current_price: number;
  /** Timestamp di apertura */
  open_time: string;
  /** P&L non realizzato */
  unrealized_pnl: number;
  /** P&L realizzato */
  realized_pnl: number;
  /** Stop loss (se applicabile) */
  stop_loss?: number;
  /** Take profit (se applicabile) */
  take_profit?: number;
  /** Strategia associata */
  strategy: string;
  /** Algoritmo di entrata */
  entry_algo?: string;
  /** Rischio per unità */
  risk_per_unit: number;
  /** Commissioni totali sostenute */
  total_commission: number;
  /** Margine utilizzato */
  margin_used: number;
}

/**
 * Portafoglio di investimenti
 */
export interface Portfolio {
  /** Saldo disponibile */
  balance: number;
  /** Patrimonio netto totale */
  total_equity: number;
  /** P&L non realizzato totale */
  unrealized_pnl: number;
  /** P&L realizzato totale */
  realized_pnl: number;
  /** Lista delle posizioni aperte */
  positions: Position[];
  /** Valore totale del portafoglio */
  total_value: number;
  /** Margine utilizzato */
  margin_used: number;
  /** Margine disponibile */
  margin_available: number;
  /** Livello di margin call */
  margin_level: number;
  /** Numero di posizioni aperte */
  open_positions_count: number;
  /** Concentrazione massima per singolo titolo (%) */
  max_single_position_percent: number;
  /** Esposizione totale per settore */
  sector_exposure?: Record<string, number>;
  /** Esposizione totale per asset class */
  asset_class_exposure?: Record<string, number>;
  /** Ultima aggiornamento */
  last_update?: string;
}

/**
 * Metriche di rischio del portafoglio
 */
export interface RiskMetrics {
  /** Value at Risk giornaliero (95% confidenza) */
  var_1d_95: number;
  /** Value at Risk giornaliero (99% confidenza) */
  var_1d_99: number;
  /** Maximum Drawdown storico */
  max_drawdown: number;
  /** Drawdown corrente */
  current_drawdown: number;
  /** Sharpe Ratio */
  sharpe_ratio: number;
  /** Sortino Ratio */
  sortino_ratio?: number;
  /** Win Rate percentuale */
  win_rate: number;
  /** Profit Factor */
  profit_factor: number;
  /** Esposizione totale del portafoglio */
  total_exposure: number;
  /** Beta del portafoglio */
  portfolio_beta?: number;
  /** Expected Shortfall (CVaR) */
  expected_shortfall?: number;
  /** Volatilità giornaliera */
  daily_volatility: number;
  /** Volatilità annualizzata */
  annualized_volatility: number;
  /** Maximum Adverse Excursion */
  max_adverse_excursion?: number;
  /** Maximum Favorable Excursion */
  max_favorable_excursion?: number;
  /** Calmar Ratio */
  calmar_ratio?: number;
  /** Information Ratio */
  information_ratio?: number;
  /** Tracking Error */
  tracking_error?: number;
  /**ultimo aggiornamento */
  last_calculated?: string;
}

/**
 * Strategia algoritmica di trading
 */
export interface AlgoStrategy {
  /** Identificativo univoco della strategia */
  id: string;
  /** Nome della strategia */
  name: string;
  /** Descrizione dettagliata della strategia */
  description?: string;
  /** Tipo di strategia */
  strategy_type: 'MOMENTUM' | 'MEAN_REVERSION' | 'ARBITRAGE' | 'SCALPING' | 'SWING' | 'GRID' | 'MARTINGALE';
  /** Stato della strategia */
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'BACKTEST';
  /** Timeframe di trading */
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  /** Simboli supportati */
  symbols: string[];
  /** Parametri della strategia */
  parameters: Record<string, any>;
  /** Capital allocation (% del portafoglio) */
  allocation_percent: number;
  /** Stop loss globale della strategia */
  global_stop_loss?: number;
  /** Take profit globale della strategia */
  global_take_profit?: number;
  /** Rischio massimo per trade (%) */
  max_risk_per_trade: number;
  /** Numero massimo di posizioni simultanee */
  max_positions: number;
  /** Filtri di mercato applicati */
  market_filters?: {
    min_volatility?: number;
    max_volatility?: number;
    min_volume?: number;
    trading_hours_only?: boolean;
  };
  /** Data di creazione */
  created_at: string;
  /** Data di ultima modifica */
  updated_at?: string;
  /** Algoritmo di execution associato */
  execution_algo?: string;
  /** Performance metriche */
  performance?: {
    total_return: number;
    sharpe_ratio: number;
    max_drawdown: number;
    win_rate: number;
    total_trades: number;
    avg_trade_duration?: number;
  };
}

/**
 * Algoritmo di esecuzione ordini
 */
export interface ExecutionAlgo {
  /** Identificativo univoco dell'algoritmo */
  id: string;
  /** Nome dell'algoritmo */
  name: string;
  /** Tipo di algoritmo di execution */
  algo_type: 'VWAP' | 'TWAP' | 'ICEBERG' | 'POV' | 'IMPLEMENTATION_SHORTFALL' | 'SNAPSHOT';
  /** Configurazione specifica dell'algoritmo */
  config: VWAPConfig | TWAPConfig | IcebergConfig | POVConfig | ImplementationShortfallConfig | SnapshotConfig;
  /** Stato dell'algoritmo */
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'ERROR';
  /** Strategie che utilizzano questo algoritmo */
  strategies_using: string[];
  /** Performance metriche */
  performance?: {
    total_executed_volume: number;
    avg_execution_price?: number;
    savings_vs_market?: number;
    execution_quality_score?: number;
    market_impact_estimate?: number;
  };
  /** Limiti e constraint */
  constraints?: {
    max_daily_volume?: number;
    max_single_order_size?: number;
    max_price_deviation_percent?: number;
    allowed_markets?: string[];
    restricted_times?: string[];
  };
  /** Data di ultima esecuzione */
  last_execution?: string;
  /** Numero totale di esecuzioni */
  total_executions: number;
  /** Abilitazione generale */
  enabled: boolean;
}

/**
 * Configurazione per algoritmo POV (Percentage of Volume)
 */
export interface POVConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Percentuale del volume di mercato da utilizzare */
  volume_participation_percent: number;
  /** Volume totale da eseguire */
  total_volume: number;
  /** Orario di inizio esecuzione */
  start_time: string;
  /** Orario di fine esecuzione */
  end_time: string;
  /** Volume minimo per singolo child order */
  min_child_order_size: number;
  /** Volume massimo per singolo child order */
  max_child_order_size: number;
  /** Soglia di volume minimo per attivazione */
  min_market_volume_threshold: number;
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Configurazione per algoritmo Implementation Shortfall
 */
export interface ImplementationShortfallConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Volume totale da eseguire */
  total_volume: number;
  /** Orario di inizio esecuzione */
  start_time: string;
  /** Orario di fine esecuzione */
  end_time: string;
  /** Toleranza di prezzo massima */
  max_price_tolerance_percent: number;
  /** Aggressività dell'algoritmo (0.1-1.0) */
  aggression_level: number;
  /** Livello di rischio accettabile */
  risk_tolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Configurazione per algoritmo Snapshot
 */
export interface SnapshotConfig {
  /** Identificativo della configurazione */
  id: string;
  /** Nome della strategia */
  strategy_name: string;
  /** Volume totale da eseguire */
  total_volume: number;
  /** Tempo massimo per completare l'esecuzione (secondi) */
  max_execution_time_seconds: number;
  /** Numero massimo di tentativi */
  max_attempts: number;
  /** Intervallo tra tentativi (millisecondi) */
  retry_interval_ms: number;
  /** Abilitazione dell'algoritmo */
  enabled: boolean;
}

/**
 * Statistiche di performance avanzate
 */
export interface PerformanceStats {
  /** Periodo di riferimento delle statistiche */
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ALL_TIME';
  /** Data di inizio del periodo */
  start_date: string;
  /** Data di fine del periodo */
  end_date: string;
  /** Rendimento totale (%) */
  total_return: number;
  /** Rendimento annualizzato (%) */
  annualized_return: number;
  /** Volatilità annualizzata (%) */
  annualized_volatility: number;
  /** Sharpe Ratio */
  sharpe_ratio: number;
  /** Sortino Ratio */
  sortino_ratio: number;
  /** Maximum Drawdown (%) */
  max_drawdown: number;
  /** Current Drawdown (%) */
  current_drawdown: number;
  /** Calmar Ratio */
  calmar_ratio: number;
  /** Information Ratio */
  information_ratio: number;
  /** Win Rate (%) */
  win_rate: number;
  /** Profit Factor */
  profit_factor: number;
  /** Average Win */
  avg_win: number;
  /** Average Loss */
  avg_loss: number;
  /** Largest Win */
  largest_win: number;
  /** Largest Loss */
  largest_loss: number;
  /** Average Trade Duration (minuti) */
  avg_trade_duration?: number;
  /** Total Number of Trades */
  total_trades: number;
  /** Winning Trades */
  winning_trades: number;
  /** Losing Trades */
  losing_trades: number;
  /** Break-even Trades */
  breakeven_trades: number;
  /** Average Time in Market (%) */
  avg_time_in_market?: number;
  /** Beta (vs benchmark) */
  beta?: number;
  /** Alpha (vs benchmark) */
  alpha?: number;
  /** Tracking Error */
  tracking_error?: number;
  /** Upside Capture Ratio */
  upside_capture?: number;
  /** Downside Capture Ratio */
  downside_capture?: number;
  /** Maximum Consecutive Wins */
  max_consecutive_wins: number;
  /** Maximum Consecutive Losses */
  max_consecutive_losses: number;
  /** Current Streak */
  current_streak: {
    type: 'WIN' | 'LOSS';
    count: number;
  };
  /** Value at Risk (1 giorno, 95%) */
  var_1d_95: number;
  /** Value at Risk (1 giorno, 99%) */
  var_1d_99: number;
  /** Expected Shortfall (CVaR) */
  expected_shortfall: number;
  /** Recovery Factor */
  recovery_factor?: number;
  /** Ulcer Index */
  ulcer_index?: number;
  /** Pain Index */
  pain_index?: number;
  /** Omega Ratio */
  omega_ratio?: number;
  /** Sterling Ratio */
  sterling_ratio?: number;
  /** Burke Ratio */
  burke_ratio?: number;
  /** Data dell'ultimo calcolo */
  last_calculated: string;
}