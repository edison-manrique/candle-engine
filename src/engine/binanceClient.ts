import type { OhlcvCandle } from "./constants";
import type { CryptoPair, Timeframe } from "./cryptoFeed";

const REST_BASES = [
  "https://data-api.binance.vision",
  "https://api.binance.us",
];

const WS_STREAM_BASE = "wss://data-stream.binance.vision/stream";

export interface Ticker24h {
  symbol: CryptoPair;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  weightedAvgPrice: number;
  count: number;
}

export interface OrderBookLevel {
  price: number;
  qty: number;
  total: number;
}

export interface OrderBookSnapshot {
  lastUpdateId: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestBid: number;
  bestAsk: number;
}

export interface RawOrderBookState {
  lastUpdateId: number;
  bids: Map<number, number>;
  asks: Map<number, number>;
}

export interface DepthDiffEvent {
  firstUpdateId: number;
  finalUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface AggTradeItem {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface MiniTickerUpdate {
  symbol: CryptoPair;
  close: number;
  open24h: number;
  high24h: number;
  low24h: number;
  vol24h: number;
  quoteVol24h: number;
}

export interface StreamBatchPayload {
  klines: OhlcvCandle[];
  trades: AggTradeItem[];
  depthDiffs: DepthDiffEvent[];
  miniTickers: MiniTickerUpdate[];
}

export type StreamConnectionState = "connecting" | "connected" | "reconnecting" | "paused";

export const PAIR_TICK_STEPS: Record<CryptoPair, number[]> = {
  BTCUSDT: [0.01, 0.1, 1, 5, 10, 50, 100],
  ETHUSDT: [0.01, 0.1, 0.5, 1, 5, 10, 25],
  BNBUSDT: [0.01, 0.1, 0.5, 1, 2, 5, 10],
  SOLUSDT: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
};

export const DEFAULT_TICK_STEP_INDEX: Record<CryptoPair, number> = {
  BTCUSDT: 4, // 10 USDT
  ETHUSDT: 3, // 1 USDT
  BNBUSDT: 2, // 0.5 USDT
  SOLUSDT: 2, // 0.1 USDT
};

async function fetchJsonWithFallback<T>(pathAndQuery: string, timeoutMs = 4500): Promise<T> {
  let lastError: unknown;
  for (const base of REST_BASES) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${base}${pathAndQuery}`, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`Binance HTTP ${res.status} on ${base}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
    } finally {
      window.clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Binance REST request failed");
}

export async function fetchBinanceKlines(
  symbol: CryptoPair,
  interval: Timeframe,
  limit = 1000,
  endTime?: number
): Promise<OhlcvCandle[]> {
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: String(Math.min(1000, Math.max(1, limit))),
  });
  if (endTime !== undefined) {
    params.set("endTime", String(Math.floor(endTime)));
  }

  const raw = await fetchJsonWithFallback<unknown[][]>(`/api/v3/klines?${params.toString()}`);
  if (!Array.isArray(raw)) {
    throw new Error("Unexpected Binance klines payload");
  }

  return raw.map((k) => ({
    timestamp: Number(k[0]),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}

export async function fetchBinance24hrTickers(
  symbols: CryptoPair[]
): Promise<Record<CryptoPair, Ticker24h>> {
  const encoded = encodeURIComponent(JSON.stringify(symbols));
  const raw = await fetchJsonWithFallback<Record<string, string | number>[]>(
    `/api/v3/ticker/24hr?symbols=${encoded}`
  );

  const out = {} as Record<CryptoPair, Ticker24h>;
  for (const item of raw) {
    const sym = String(item.symbol) as CryptoPair;
    out[sym] = {
      symbol: sym,
      lastPrice: Number(item.lastPrice),
      priceChange: Number(item.priceChange),
      priceChangePercent: Number(item.priceChangePercent),
      highPrice: Number(item.highPrice),
      lowPrice: Number(item.lowPrice),
      volume: Number(item.volume),
      quoteVolume: Number(item.quoteVolume),
      weightedAvgPrice: Number(item.weightedAvgPrice),
      count: Number(item.count),
    };
  }
  return out;
}

export async function fetchBinanceRawOrderBook(
  symbol: CryptoPair,
  limit = 500
): Promise<RawOrderBookState> {
  const raw = await fetchJsonWithFallback<{
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
  }>(`/api/v3/depth?symbol=${symbol}&limit=${limit}`);

  const bids = new Map<number, number>();
  const asks = new Map<number, number>();

  for (const [p, q] of raw.bids) {
    const qty = Number(q);
    if (qty > 0) bids.set(Number(p), qty);
  }
  for (const [p, q] of raw.asks) {
    const qty = Number(q);
    if (qty > 0) asks.set(Number(p), qty);
  }

  return {
    lastUpdateId: raw.lastUpdateId,
    bids,
    asks,
  };
}

export function applyDepthDiffs(
  book: RawOrderBookState,
  diffs: DepthDiffEvent[]
): void {
  for (const diff of diffs) {
    if (diff.finalUpdateId <= book.lastUpdateId) continue;

    for (const [pStr, qStr] of diff.bids) {
      const price = Number(pStr);
      const qty = Number(qStr);
      if (qty <= 0) book.bids.delete(price);
      else book.bids.set(price, qty);
    }
    for (const [pStr, qStr] of diff.asks) {
      const price = Number(pStr);
      const qty = Number(qStr);
      if (qty <= 0) book.asks.delete(price);
      else book.asks.set(price, qty);
    }
    book.lastUpdateId = diff.finalUpdateId;
  }

  // Prune distant levels if maps grow large during long sessions
  if (book.bids.size > 1200) {
    const sorted = Array.from(book.bids.entries()).sort((a, b) => b[0] - a[0]).slice(0, 750);
    book.bids = new Map(sorted);
  }
  if (book.asks.size > 1200) {
    const sorted = Array.from(book.asks.entries()).sort((a, b) => a[0] - b[0]).slice(0, 750);
    book.asks = new Map(sorted);
  }
}

export function aggregateOrderBook(
  book: RawOrderBookState,
  tickStep: number,
  maxRows = 10
): OrderBookSnapshot {
  const step = Math.max(0.0001, tickStep);
  const invStep = 1 / step;

  let bestBid = 0;
  const bidBuckets = new Map<number, number>();
  for (const [price, qty] of book.bids) {
    if (price > bestBid) bestBid = price;
    const key = Math.floor(price * invStep + 1e-9);
    bidBuckets.set(key, (bidBuckets.get(key) ?? 0) + qty);
  }

  let bestAsk = Infinity;
  const askBuckets = new Map<number, number>();
  for (const [price, qty] of book.asks) {
    if (price < bestAsk) bestAsk = price;
    const key = Math.ceil(price * invStep - 1e-9);
    askBuckets.set(key, (askBuckets.get(key) ?? 0) + qty);
  }

  const sortedBids = Array.from(bidBuckets.entries())
    .sort((a, b) => b[0] - a[0])
    .slice(0, maxRows);
  let bidRunning = 0;
  const bids: OrderBookLevel[] = sortedBids.map(([key, qty]) => {
    bidRunning += qty;
    return { price: key * step, qty, total: bidRunning };
  });

  const sortedAsks = Array.from(askBuckets.entries())
    .sort((a, b) => a[0] - b[0])
    .slice(0, maxRows);
  let askRunning = 0;
  const asks: OrderBookLevel[] = sortedAsks.map(([key, qty]) => {
    askRunning += qty;
    return { price: key * step, qty, total: askRunning };
  });

  return {
    lastUpdateId: book.lastUpdateId,
    bids,
    asks,
    bestBid,
    bestAsk: Number.isFinite(bestAsk) ? bestAsk : 0,
  };
}

export async function fetchBinanceRecentAggTrades(
  symbol: CryptoPair,
  limit = 35
): Promise<AggTradeItem[]> {
  const raw = await fetchJsonWithFallback<
    { a: number; p: string; q: string; T: number; m: boolean }[]
  >(`/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`);

  return raw
    .map((t) => ({
      id: t.a,
      price: Number(t.p),
      qty: Number(t.q),
      time: t.T,
      isBuyerMaker: t.m,
    }))
    .reverse();
}

export interface BinanceStreamHandlers {
  onStatus?: (state: StreamConnectionState) => void;
  onBatch?: (batch: StreamBatchPayload) => void;
}

/**
 * Cliente WebSocket multiplexado puro con flush consolidado cada 250 ms (4 Hz).
 * Soporta actualización dinámica de intervalo de klines sin reconectar Order Book / Trades.
 */
export class BinanceStreamClient {
  private ws: WebSocket | null = null;
  private closed = false;
  private reconnectAttempt = 0;
  private reconnectTimer: number | null = null;
  private flushTimer: number | null = null;

  private pendingKlines = new Map<number, OhlcvCandle>();
  private pendingTrades: AggTradeItem[] = [];
  private pendingDepthDiffs: DepthDiffEvent[] = [];
  private pendingMiniTickers = new Map<CryptoPair, MiniTickerUpdate>();

  constructor(
    private symbol: CryptoPair,
    private interval: Timeframe,
    private allPairs: CryptoPair[],
    private handlers: BinanceStreamHandlers,
    private flushIntervalMs = 250
  ) {}

  connect(): void {
    this.closed = false;
    this.startFlushLoop();
    this.openSocket();
  }

  /**
   * Cambia el stream de klines en caliente sobre el mismo socket abierto sin tocar
   * las suscripciones de depth, aggTrade ni miniTicker.
   */
  setKlineInterval(nextInterval: Timeframe): void {
    if (this.interval === nextInterval) return;
    const oldStream = `${this.symbol.toLowerCase()}@kline_${this.interval}`;
    const newStream = `${this.symbol.toLowerCase()}@kline_${nextInterval}`;
    this.interval = nextInterval;
    this.pendingKlines.clear();

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(
          JSON.stringify({
            method: "UNSUBSCRIBE",
            params: [oldStream],
            id: Date.now(),
          })
        );
        this.ws.send(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: [newStream],
            id: Date.now() + 1,
          })
        );
      } catch {
        // ignore if socket closing
      }
    }
  }

  private startFlushLoop(): void {
    if (this.flushTimer !== null) {
      window.clearInterval(this.flushTimer);
    }
    this.flushTimer = window.setInterval(() => {
      this.flushBatch();
    }, this.flushIntervalMs);
  }

  private flushBatch(): void {
    if (
      this.pendingKlines.size === 0 &&
      this.pendingTrades.length === 0 &&
      this.pendingDepthDiffs.length === 0 &&
      this.pendingMiniTickers.size === 0
    ) {
      return;
    }

    const klines = Array.from(this.pendingKlines.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const trades = this.pendingTrades.slice(0, 40);
    const depthDiffs = this.pendingDepthDiffs;
    const miniTickers = Array.from(this.pendingMiniTickers.values());

    this.pendingKlines.clear();
    this.pendingTrades = [];
    this.pendingDepthDiffs = [];
    this.pendingMiniTickers.clear();

    this.handlers.onBatch?.({ klines, trades, depthDiffs, miniTickers });
  }

  private openSocket(): void {
    if (this.closed) return;
    this.handlers.onStatus?.(this.reconnectAttempt > 0 ? "reconnecting" : "connecting");

    const symLower = this.symbol.toLowerCase();
    const streams = [
      `${symLower}@kline_${this.interval}`,
      `${symLower}@aggTrade`,
      `${symLower}@depth@100ms`,
      ...this.allPairs.map((p) => `${p.toLowerCase()}@miniTicker`),
    ];

    const url = `${WS_STREAM_BASE}?streams=${streams.join("/")}`;

    try {
      const ws = new WebSocket(url);
      this.ws = ws;

      ws.onopen = () => {
        if (this.closed) {
          ws.close();
          return;
        }
        this.reconnectAttempt = 0;
        this.handlers.onStatus?.("connected");
      };

      ws.onmessage = (event) => {
        if (this.closed) return;
        try {
          const msg = JSON.parse(event.data as string) as {
            stream?: string;
            data?: Record<string, unknown>;
          };
          const stream = msg.stream;
          const d = msg.data;
          if (!stream || !d) return;

          if (stream.includes("@kline_")) {
            const k = d.k as Record<string, unknown> | undefined;
            if (!k) return;
            const candle: OhlcvCandle = {
              timestamp: Number(k.t),
              open: Number(k.o),
              high: Number(k.h),
              low: Number(k.l),
              close: Number(k.c),
              volume: Number(k.v),
            };
            this.pendingKlines.set(candle.timestamp, candle);
          } else if (stream.endsWith("@aggTrade")) {
            this.pendingTrades.unshift({
              id: Number(d.a),
              price: Number(d.p),
              qty: Number(d.q),
              time: Number(d.T),
              isBuyerMaker: Boolean(d.m),
            });
            if (this.pendingTrades.length > 40) {
              this.pendingTrades.length = 40;
            }
          } else if (stream.includes("@depth")) {
            const bids = d.b as [string, string][] | undefined;
            const asks = d.a as [string, string][] | undefined;
            if (bids && asks) {
              this.pendingDepthDiffs.push({
                firstUpdateId: Number(d.U ?? 0),
                finalUpdateId: Number(d.u ?? 0),
                bids,
                asks,
              });
            }
          } else if (stream.endsWith("@miniTicker")) {
            const sym = String(d.s) as CryptoPair;
            this.pendingMiniTickers.set(sym, {
              symbol: sym,
              close: Number(d.c),
              open24h: Number(d.o),
              high24h: Number(d.h),
              low24h: Number(d.l),
              vol24h: Number(d.v),
              quoteVol24h: Number(d.q),
            });
          }
        } catch {
          // ignore malformed packet or control ACK
        }
      };

      ws.onerror = () => {
        // handled by onclose
      };

      ws.onclose = () => {
        if (this.closed) return;
        this.reconnectAttempt++;
        const delayMs = Math.min(8000, 500 * Math.pow(1.6, this.reconnectAttempt));
        this.handlers.onStatus?.("reconnecting");
        this.reconnectTimer = window.setTimeout(() => this.openSocket(), delayMs);
      };
    } catch {
      this.reconnectAttempt++;
      this.handlers.onStatus?.("reconnecting");
    }
  }

  dispose(): void {
    this.closed = true;
    if (this.flushTimer !== null) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.pendingKlines.clear();
    this.pendingTrades = [];
    this.pendingDepthDiffs = [];
    this.pendingMiniTickers.clear();

    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.handlers.onStatus?.("paused");
  }
}
