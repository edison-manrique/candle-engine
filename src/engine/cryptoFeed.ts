import type { OhlcvCandle } from "./constants";

export type CryptoPair = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface MarketMeta {
  pair: CryptoPair;
  label: string;
  basePrice: number;
  volatility: number;
  baseVolume: number;
}

export const CRYPTO_MARKETS: Record<CryptoPair, MarketMeta> = {
  BTCUSDT: {
    pair: "BTCUSDT",
    label: "BTC / USDT",
    basePrice: 94250,
    volatility: 0.0038,
    baseVolume: 1850,
  },
  ETHUSDT: {
    pair: "ETHUSDT",
    label: "ETH / USDT",
    basePrice: 3420,
    volatility: 0.0046,
    baseVolume: 14200,
  },
  SOLUSDT: {
    pair: "SOLUSDT",
    label: "SOL / USDT",
    basePrice: 218.5,
    volatility: 0.0062,
    baseVolume: 96000,
  },
  BNBUSDT: {
    pair: "BNBUSDT",
    label: "BNB / USDT",
    basePrice: 642.0,
    volatility: 0.0034,
    baseVolume: 21500,
  },
};

export function timeframeToMs(tf: Timeframe): number {
  switch (tf) {
    case "1m":
      return 60_000;
    case "5m":
      return 300_000;
    case "15m":
      return 900_000;
    case "1h":
      return 3_600_000;
    case "4h":
      return 14_400_000;
    case "1d":
      return 86_400_000;
  }
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Genera series OHLCV cripto realistas con clústeres de volatilidad y mechas orgánicas.
 */
export function generateSyntheticCandles(
  pair: CryptoPair,
  timeframe: Timeframe,
  count = 600,
  seedOffset = 0
): OhlcvCandle[] {
  const meta = CRYPTO_MARKETS[pair];
  const stepMs = timeframeToMs(timeframe);
  const tfScale = Math.sqrt(stepMs / 900_000);
  const rand = seededRand(
    pair.charCodeAt(0) * 1337 + timeframe.charCodeAt(0) * 97 + count + seedOffset
  );

  const now = Math.floor(Date.now() / stepMs) * stepMs;
  const startTs = now - (count - 1) * stepMs;

  const out: OhlcvCandle[] = new Array(count);
  let price = meta.basePrice * (0.88 + rand() * 0.16);
  let regimeVol = meta.volatility * tfScale;
  let trend = 0;

  for (let i = 0; i < count; i++) {
    // Volatility regime mean-reversion + occasional breakout burst
    const burst = rand() < 0.04 ? 2.4 : 1.0;
    regimeVol = regimeVol * 0.94 + meta.volatility * tfScale * (0.7 + rand() * 0.7) * 0.06;
    trend = trend * 0.85 + (rand() - 0.495) * regimeVol * 0.35;

    const u1 = Math.max(1e-7, rand());
    const u2 = rand();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    const open = price;
    const ret = trend + z * regimeVol * burst;
    const close = Math.max(open * 0.25, open * (1 + ret));

    const bodyTop = Math.max(open, close);
    const bodyBot = Math.min(open, close);
    const bodySpan = Math.abs(close - open);

    const upperWick = (0.15 + Math.pow(rand(), 1.8) * 1.1) * Math.max(bodySpan, open * regimeVol * 0.45);
    const lowerWick = (0.15 + Math.pow(rand(), 1.8) * 1.1) * Math.max(bodySpan, open * regimeVol * 0.45);

    const high = bodyTop + upperWick;
    const low = Math.max(open * 0.1, bodyBot - lowerWick);
    const volume =
      meta.baseVolume *
      tfScale *
      (0.45 + Math.abs(z) * 0.9 + rand() * 0.8) *
      (burst > 1 ? 2.3 : 1.0);

    out[i] = {
      timestamp: startTs + i * stepMs,
      open,
      high,
      low,
      close,
      volume,
    };

    price = close;
  }

  return out;
}

export interface FeedFetchResult {
  candles: OhlcvCandle[];
  source: "binance" | "simulated";
}

/**
 * Intenta cargar velas reales desde Binance REST público con timeout corto;
 * si la red bloquea o falla, devuelve velas sintéticas de alta fidelidad.
 */
export async function fetchMarketCandles(
  pair: CryptoPair,
  timeframe: Timeframe,
  limit = 750
): Promise<FeedFetchResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2800);
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${timeframe}&limit=${limit}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = (await res.json()) as unknown[][];
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error("Empty klines response");
    }
    const candles: OhlcvCandle[] = raw.map((k) => ({
      timestamp: Number(k[0]),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
      volume: Number(k[5]),
    }));
    return { candles, source: "binance" };
  } catch {
    return {
      candles: generateSyntheticCandles(pair, timeframe, limit),
      source: "simulated",
    };
  } finally {
    window.clearTimeout(timer);
  }
}

export function subscribeBinanceKline(
  pair: CryptoPair,
  timeframe: Timeframe,
  onTick: (candle: OhlcvCandle, isClosed: boolean) => void,
  onFallback: () => void
): () => void {
  let closedByCaller = false;
  let receivedAny = false;
  const wsUrl = `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@kline_${timeframe}`;
  let ws: WebSocket | null = null;

  const fallbackTimer = window.setTimeout(() => {
    if (!receivedAny && !closedByCaller) {
      try {
        ws?.close();
      } catch {
        // ignore
      }
      onFallback();
    }
  }, 3500);

  try {
    ws = new WebSocket(wsUrl);
    ws.onmessage = (ev) => {
      receivedAny = true;
      window.clearTimeout(fallbackTimer);
      try {
        const msg = JSON.parse(ev.data as string);
        const k = msg?.k;
        if (!k) return;
        onTick(
          {
            timestamp: Number(k.t),
            open: Number(k.o),
            high: Number(k.h),
            low: Number(k.l),
            close: Number(k.c),
            volume: Number(k.v),
          },
          Boolean(k.x)
        );
      } catch {
        // ignore malformed packet
      }
    };
    ws.onerror = () => {
      if (!receivedAny && !closedByCaller) {
        onFallback();
      }
    };
  } catch {
    onFallback();
  }

  return () => {
    closedByCaller = true;
    window.clearTimeout(fallbackTimer);
    try {
      ws?.close();
    } catch {
      // ignore
    }
  };
}
