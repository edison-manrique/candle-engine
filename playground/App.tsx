import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  Show,
  untrack,
} from "solid-js";
import {
  aggregateOrderBook,
  type AggTradeItem,
  applyDepthDiffs,
  BinanceStreamClient,
  CandleEngineWrapper,
  type CandleInspection,
  CRYPTO_MARKETS,
  type CryptoPair,
  DEFAULT_EMA_CONFIGS,
  DEFAULT_TICK_STEP_INDEX,
  type EmaConfigTuple,
  type EmaPeriodTuple,
  type EmaSlotConfig,
  fetchBinance24hrTickers,
  fetchBinanceKlines,
  fetchBinanceRawOrderBook,
  fetchBinanceRecentAggTrades,
  generateSyntheticCandles,
  type OrderBookSnapshot,
  PAIR_TICK_STEPS,
  type RawOrderBookState,
  type StreamConnectionState,
  type Ticker24h,
  type Timeframe,
  timeframeToMs,
  type ViewportConfig,
} from "../src/engine";
import { ArenaInspector } from "./components/ArenaInspector";
import { CandleViewport } from "./components/CandleViewport";
import { ChartToolbar } from "./components/ChartToolbar";
import { MarketDepthSidebar } from "./components/MarketDepthSidebar";
import { OhlcvHeader } from "./components/OhlcvHeader";
import { TopBar } from "./components/TopBar";
import styles from "./styles/App.module.css";
import type {
  ArenaMemoryDiagnostics,
  BenchmarkSummary,
  ChartSettings,
  RendererBackend,
  SidebarTab,
  TelemetrySnapshot,
} from "./types";

const ALL_PAIRS: CryptoPair[] = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];
const STREAM_FLUSH_MS = 250; // 4 actualizaciones por segundo (4 Hz)

export function App() {
  const [engine, setEngine] = createSignal<CandleEngineWrapper | null>(null);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [diagnostics, setDiagnostics] = createSignal<ArenaMemoryDiagnostics | null>(null);
  const [dataVersion, setDataVersion] = createSignal(0);
  const [resetSignal, setResetSignal] = createSignal(0);
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const [sidebarTab, setSidebarTab] = createSignal<SidebarTab>("market");
  const [streamState, setStreamState] = createSignal<StreamConnectionState>("connecting");
  const [backfilling, setBackfilling] = createSignal(false);
  const [stressOverride, setStressOverride] = createSignal(false);

  const [tickers, setTickers] = createSignal<Partial<Record<CryptoPair, Ticker24h>>>({});
  const [orderBook, setOrderBook] = createSignal<OrderBookSnapshot | null>(null);
  const [tickStepIndex, setTickStepIndex] = createSignal<number>(
    DEFAULT_TICK_STEP_INDEX.BTCUSDT
  );
  const [trades, setTrades] = createSignal<AggTradeItem[]>([]);
  const [hoveredCandle, setHoveredCandle] = createSignal<CandleInspection | null>(null);
  const [benchmark, setBenchmark] = createSignal<BenchmarkSummary | null>(null);
  const [benchmarkRunning, setBenchmarkRunning] = createSignal(false);

  const [settings, setSettings] = createSignal<ChartSettings>({
    pair: "BTCUSDT",
    timeframe: "15m",
    heikinAshi: false,
    logScale: false,
    showEma: true,
    emas: [
      { ...DEFAULT_EMA_CONFIGS[0] },
      { ...DEFAULT_EMA_CONFIGS[1] },
      { ...DEFAULT_EMA_CONFIGS[2] },
      { ...DEFAULT_EMA_CONFIGS[3] },
    ],
    showBb: false,
    showRsi: true,
    showVolume: true,
    magnetCrosshair: false,
    renderer: "webgl2",
    streamActive: true,
  });

  // Fine-grained memos so toggling UI/indicator/EMA buttons NEVER triggers REST or WSS effects
  const activePair = createMemo(() => settings().pair);
  const activeTimeframe = createMemo(() => settings().timeframe);
  const isStreamActive = createMemo(() => settings().streamActive);
  const emaPeriods = createMemo<EmaPeriodTuple>(() => {
    const e = settings().emas;
    return [e[0].period, e[1].period, e[2].period, e[3].period];
  });
  const tickSteps = createMemo(() => PAIR_TICK_STEPS[activePair()]);
  const currentTickStep = createMemo(() => {
    const steps = tickSteps();
    const idx = Math.max(0, Math.min(steps.length - 1, tickStepIndex()));
    return steps[idx];
  });

  const [telemetry, setTelemetry] = createSignal<TelemetrySnapshot>({
    wasmProjectUs: 0,
    drawUs: 0,
    visibleCount: 0,
    visibleStart: 0,
    visibleEnd: 0,
    loadedCandles: 0,
    bullCount: 0,
    bearCount: 0,
    lastClose: 0,
    changePct: 0,
    emaLasts: [0, 0, 0, 0],
    rsiLast: 50,
    bbUpperLast: 0,
    bbLowerLast: 0,
  });

  let getViewportConfig: (() => ViewportConfig | null) | null = null;
  let hasMoreHistory = true;
  let rawBook: RawOrderBookState | null = null;
  let activeWsClient: BinanceStreamClient | null = null;

  onMount(async () => {
    try {
      const wasmUrl = `${import.meta.env.BASE_URL}wasm/candle-engine.wasm`;
      const wrapper = await CandleEngineWrapper.create(wasmUrl);
      setEngine(wrapper);
      setDiagnostics(wrapper.getMemoryDiagnostics());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to initialize WASM engine");
    }

    try {
      const stats = await fetchBinance24hrTickers(ALL_PAIRS);
      setTickers(stats);
    } catch {
      // WSS miniTicker populates tickers on flush
    }
  });

  const refreshDiagnostics = () => {
    const eng = engine();
    if (eng) setDiagnostics(eng.getMemoryDiagnostics());
  };

  const reaggregateBook = () => {
    if (!rawBook) return;
    setOrderBook(aggregateOrderBook(rawBook, currentTickStep(), 10));
  };

  // Re-aggregate instantly when user clicks - / + depth step without refetching
  createEffect(() => {
    void currentTickStep();
    reaggregateBook();
  });

  // Effect 1: Independent Order Book & Recent Trades lifecycle (keyed ONLY on activePair)
  createEffect(() => {
    const pair = activePair();
    let cancelled = false;

    rawBook = null;
    setOrderBook(null);
    setTrades([]);
    setTickStepIndex(DEFAULT_TICK_STEP_INDEX[pair]);

    Promise.all([
      fetchBinanceRawOrderBook(pair, 500),
      fetchBinanceRecentAggTrades(pair, 35),
    ])
      .then(([bookSnapshot, recentTrades]) => {
        if (cancelled) return;
        rawBook = bookSnapshot;
        batch(() => {
          setOrderBook(aggregateOrderBook(bookSnapshot, untrack(currentTickStep), 10));
          setTrades(recentTrades);
        });
      })
      .catch(() => {
        // Keep empty state gracefully if unreachable
      });

    onCleanup(() => {
      cancelled = true;
    });
  });

  // Effect 2: Klines historical load (keyed ONLY on engine + activePair + activeTimeframe)
  createEffect(() => {
    const eng = engine();
    const pair = activePair();
    const tf = activeTimeframe();
    if (!eng) return;

    let cancelled = false;

    fetchBinanceKlines(pair, tf, 1000)
      .then((klines) => {
        if (cancelled) return;
        hasMoreHistory = true;
        setStressOverride(false);
        eng.loadCandles(klines, untrack(emaPeriods));
        batch(() => {
          setDataVersion((v) => v + 1);
          setResetSignal((s) => s + 1);
        });
        refreshDiagnostics();
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = generateSyntheticCandles(pair, tf, 800);
        eng.loadCandles(fallback, untrack(emaPeriods));
        batch(() => {
          setDataVersion((v) => v + 1);
          setResetSignal((s) => s + 1);
        });
        refreshDiagnostics();
      });

    onCleanup(() => {
      cancelled = true;
    });
  });

  // Effect 3: WebSocket connection lifecycle (keyed ONLY on engine + activePair + isStreamActive)
  createEffect(() => {
    const eng = engine();
    const pair = activePair();
    const streaming = isStreamActive();

    if (!eng || !streaming) {
      setStreamState("paused");
      return;
    }

    const initialTf = untrack(activeTimeframe);
    const client = new BinanceStreamClient(
      pair,
      initialTf,
      ALL_PAIRS,
      {
        onStatus: (st) => setStreamState(st),
        onBatch: ({ klines, trades: newTrades, depthDiffs, miniTickers }) => {
          let appended = false;

          if (!untrack(stressOverride) && klines.length > 0) {
            for (const candle of klines) {
              const lastTs = eng.getLatestTimestamp();
              if (lastTs > 0 && candle.timestamp === lastTs) {
                eng.updateLastTick(
                  candle.high,
                  candle.low,
                  candle.close,
                  candle.volume,
                  candle.timestamp
                );
              } else if (lastTs === 0 || candle.timestamp > lastTs) {
                eng.appendCandle(candle);
                appended = true;
              }
            }
          }

          if (depthDiffs.length > 0 && rawBook) {
            applyDepthDiffs(rawBook, depthDiffs);
          }

          batch(() => {
            if (klines.length > 0 && !untrack(stressOverride)) {
              setDataVersion((v) => v + 1);
            }
            if (newTrades.length > 0) {
              setTrades((prev) => [...newTrades, ...prev].slice(0, 40));
            }
            if (depthDiffs.length > 0 && rawBook) {
              setOrderBook(aggregateOrderBook(rawBook, untrack(currentTickStep), 10));
            }
            if (miniTickers.length > 0) {
              setTickers((prev) => {
                const next = { ...prev };
                for (const mt of miniTickers) {
                  const change = mt.close - mt.open24h;
                  const changePct = mt.open24h > 0 ? (change / mt.open24h) * 100 : 0;
                  const existing = prev[mt.symbol];
                  next[mt.symbol] = {
                    symbol: mt.symbol,
                    lastPrice: mt.close,
                    priceChange: change,
                    priceChangePercent: changePct,
                    highPrice: mt.high24h,
                    lowPrice: mt.low24h,
                    volume: mt.vol24h,
                    quoteVolume: mt.quoteVol24h,
                    weightedAvgPrice: existing?.weightedAvgPrice ?? mt.close,
                    count: existing?.count ?? 0,
                  };
                }
                return next;
              });
            }
          });

          if (appended) {
            refreshDiagnostics();
          }
        },
      },
      STREAM_FLUSH_MS
    );

    activeWsClient = client;
    client.connect();

    onCleanup(() => {
      if (activeWsClient === client) {
        activeWsClient = null;
      }
      client.dispose();
    });
  });

  // Hot-swap kline interval on the open socket without disturbing Order Book or Trades
  createEffect(() => {
    const tf = activeTimeframe();
    activeWsClient?.setKlineInterval(tf);
  });

  const handleReachLeftEdge = async () => {
    const eng = engine();
    if (!eng || backfilling() || !hasMoreHistory || stressOverride()) return;
    const oldestTs = eng.getOldestTimestamp();
    if (!oldestTs) return;

    setBackfilling(true);
    try {
      const older = await fetchBinanceKlines(activePair(), activeTimeframe(), 1000, oldestTs - 1);
      if (older.length === 0) {
        hasMoreHistory = false;
      } else {
        const inserted = eng.prependCandles(older, emaPeriods());
        if (inserted === 0) {
          hasMoreHistory = false;
        } else {
          setDataVersion((v) => v + 1);
          refreshDiagnostics();
        }
      }
    } catch {
      hasMoreHistory = false;
    } finally {
      setBackfilling(false);
    }
  };

  const handleSelectPair = (pair: CryptoPair) => {
    setSettings((prev) => ({ ...prev, pair }));
  };

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setSettings((prev) => ({ ...prev, timeframe }));
  };

  const handleToggleSetting = (
    key:
      | "heikinAshi"
      | "logScale"
      | "showEma"
      | "showBb"
      | "showRsi"
      | "showVolume"
      | "magnetCrosshair"
      | "streamActive"
  ) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdateEma = (
    slot: 0 | 1 | 2 | 3,
    patch: Partial<EmaSlotConfig>
  ) => {
    let periodChanged = false;
    let nextPeriods: EmaPeriodTuple = emaPeriods();

    setSettings((prev) => {
      const nextEmas = [...prev.emas] as EmaConfigTuple;
      const cur = nextEmas[slot];
      const nextSlot: EmaSlotConfig = { ...cur, ...patch };
      nextEmas[slot] = nextSlot;
      if (patch.period !== undefined && patch.period !== cur.period) {
        periodChanged = true;
      }
      nextPeriods = [
        nextEmas[0].period,
        nextEmas[1].period,
        nextEmas[2].period,
        nextEmas[3].period,
      ];
      return {
        ...prev,
        // Automatically ensure master EMA overlay is visible when enabling a slot
        showEma: patch.enabled === true ? true : prev.showEma,
        emas: nextEmas,
      };
    });

    const eng = engine();
    if (eng && periodChanged) {
      eng.computeIndicators(nextPeriods);
      setDataVersion((v) => v + 1);
    }
  };

  const handleApplyEmaPreset = (periods: EmaPeriodTuple) => {
    setSettings((prev) => {
      const nextEmas: EmaConfigTuple = [
        { ...prev.emas[0], period: periods[0], enabled: true },
        { ...prev.emas[1], period: periods[1], enabled: true },
        { ...prev.emas[2], period: periods[2], enabled: true },
        { ...prev.emas[3], period: periods[3], enabled: true },
      ];
      return { ...prev, showEma: true, emas: nextEmas };
    });

    const eng = engine();
    if (eng) {
      eng.computeIndicators(periods);
      setDataVersion((v) => v + 1);
    }
  };

  const handleRendererChange = (renderer: RendererBackend) => {
    setSettings((prev) => ({ ...prev, renderer }));
  };

  const handleLoadStressMax = () => {
    const eng = engine();
    if (!eng) return;
    setStressOverride(true);
    const massive = generateSyntheticCandles(
      activePair(),
      activeTimeframe(),
      eng.maxCandles,
      42
    );
    eng.loadCandles(massive, emaPeriods());
    setDataVersion((v) => v + 1);
    refreshDiagnostics();
  };

  const handleBurstTicks = () => {
    const eng = engine();
    if (!eng) return;
    setStressOverride(true);
    const stepMs = timeframeToMs(activeTimeframe());
    const meta = CRYPTO_MARKETS[activePair()];
    const count = eng.candleCount;
    const last = count > 0 ? eng.getCandleAt(count - 1) : null;
    let price = last ? last.close : meta.basePrice;
    let ts = last ? last.timestamp : Date.now();

    for (let i = 0; i < 500; i++) {
      ts += stepMs;
      const ret = (Math.random() - 0.495) * meta.volatility * 1.4;
      const open = price;
      const close = Math.max(open * 0.5, open * (1 + ret));
      const wick = Math.abs(close - open) * 0.6 + open * meta.volatility * 0.3;
      eng.appendCandle({
        timestamp: ts,
        open,
        high: Math.max(open, close) + wick,
        low: Math.min(open, close) - wick,
        close,
        volume: meta.baseVolume * (0.5 + Math.random() * 1.5),
      });
      price = close;
    }

    setDataVersion((v) => v + 1);
    refreshDiagnostics();
  };

  const handleRunBenchmark = () => {
    const eng = engine();
    const vp = getViewportConfig?.();
    if (!eng || !vp) return;
    setBenchmarkRunning(true);

    requestAnimationFrame(() => {
      const result = eng.runBenchmark(1000, vp);
      setBenchmark(result);
      setBenchmarkRunning(false);
    });
  };

  const handleWipeAndReload = async () => {
    const eng = engine();
    if (!eng) return;
    eng.wipe();
    setBenchmark(null);
    hasMoreHistory = true;
    setStressOverride(false);
    try {
      const klines = await fetchBinanceKlines(activePair(), activeTimeframe(), 1000);
      eng.loadCandles(klines, emaPeriods());
    } catch {
      eng.loadCandles(
        generateSyntheticCandles(activePair(), activeTimeframe(), 800),
        emaPeriods()
      );
    }
    setDataVersion((v) => v + 1);
    setResetSignal((r) => r + 1);
    refreshDiagnostics();
  };

  const activeTicker = () => tickers()[activePair()] ?? null;

  return (
    <div class={styles.shell}>
      <TopBar
        activePair={activePair()}
        tickers={tickers()}
        onSelectPair={handleSelectPair}
        onResetView={() => setResetSignal((s) => s + 1)}
      />

      <ChartToolbar
        settings={settings()}
        sidebarOpen={sidebarOpen()}
        sidebarTab={sidebarTab()}
        streamState={streamState()}
        backfilling={backfilling()}
        onTimeframeChange={handleTimeframeChange}
        onToggleSetting={handleToggleSetting}
        onUpdateEma={handleUpdateEma}
        onApplyEmaPreset={handleApplyEmaPreset}
        onRendererChange={handleRendererChange}
        onSelectSidebarTab={(tab) => {
          if (sidebarOpen() && sidebarTab() === tab) {
            setSidebarOpen(false);
          } else {
            setSidebarTab(tab);
            setSidebarOpen(true);
          }
        }}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <OhlcvHeader
        pair={activePair()}
        timeframe={activeTimeframe()}
        hoveredCandle={hoveredCandle()}
        ticker24h={activeTicker()}
        telemetry={telemetry()}
        showEma={settings().showEma}
        emas={settings().emas}
        showBb={settings().showBb}
      />

      <Show
        when={!loadError()}
        fallback={
          <div class={styles.errorWrap}>
            <div class={styles.errorBox}>
              <div class={styles.errorTitle}>WASM Engine Initialization Error</div>
              <p class={styles.errorMsg}>{loadError()}</p>
            </div>
          </div>
        }
      >
        <div class={styles.workspace}>
          <CandleViewport
            engine={engine()}
            settings={settings()}
            dataVersion={dataVersion()}
            resetSignal={resetSignal()}
            onTelemetry={setTelemetry}
            onHoverCandle={setHoveredCandle}
            onReachLeftEdge={() => void handleReachLeftEdge()}
            onRegisterViewportAccessor={(fn) => {
              getViewportConfig = fn;
            }}
          />

          <Show when={sidebarOpen()}>
            <Show
              when={sidebarTab() === "market"}
              fallback={
                <ArenaInspector
                  diagnostics={diagnostics()}
                  telemetry={telemetry()}
                  benchmark={benchmark()}
                  benchmarkRunning={benchmarkRunning()}
                  onLoadStressMax={handleLoadStressMax}
                  onBurstTicks={handleBurstTicks}
                  onRunBenchmark={handleRunBenchmark}
                  onWipeAndReload={() => void handleWipeAndReload()}
                />
              }
            >
              <MarketDepthSidebar
                orderBook={orderBook()}
                trades={trades()}
                lastPrice={activeTicker()?.lastPrice ?? telemetry().lastClose}
                tickStep={currentTickStep()}
                canDecreaseTick={tickStepIndex() > 0}
                canIncreaseTick={tickStepIndex() < tickSteps().length - 1}
                onDecreaseTick={() =>
                  setTickStepIndex((i) => Math.max(0, i - 1))
                }
                onIncreaseTick={() =>
                  setTickStepIndex((i) => Math.min(tickSteps().length - 1, i + 1))
                }
              />
            </Show>
          </Show>
        </div>
      </Show>
    </div>
  );
}
