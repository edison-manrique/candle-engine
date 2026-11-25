import {
  Arena,
  MAX_CANDLES,
  MAX_VISIBLE,
  MAX_GRID_TICKS,
  PARAM_IN_PTR,
  PARAM_OUT_PTR,
  C_TS_PTR,
  C_OPEN_PTR,
  C_HIGH_PTR,
  C_LOW_PTR,
  C_CLOSE_PTR,
  C_VOL_PTR,
  C_EMA0_PTR,
  C_EMA1_PTR,
  C_EMA2_PTR,
  C_EMA3_PTR,
  C_BB_UPPER_PTR,
  C_BB_LOWER_PTR,
  C_RSI_PTR,
  C_META_PTR,
  R_BODY_INST_PTR,
  R_WICK_INST_PTR,
  R_VOL_INST_PTR,
  R_COLOR_PTR,
  R_EMA0_XY_PTR,
  R_EMA1_XY_PTR,
  R_EMA2_XY_PTR,
  R_EMA3_XY_PTR,
  R_BB_UPPER_XY_PTR,
  R_BB_LOWER_XY_PTR,
  R_RSI_XY_PTR,
  R_GRID_PRICES_PTR,
  R_GRID_YS_PTR,
  IN_CANDLE_COUNT,
  IN_CHART_LEFT,
  IN_CHART_TOP,
  IN_CHART_WIDTH,
  IN_CHART_HEIGHT,
  IN_VOL_TOP,
  IN_VOL_HEIGHT,
  IN_CANDLE_PITCH,
  IN_BODY_WIDTH,
  IN_SCROLL_RIGHT,
  IN_CURSOR_X,
  IN_CURSOR_Y,
  IN_EMA0_PERIOD,
  IN_EMA1_PERIOD,
  IN_EMA2_PERIOD,
  IN_EMA3_PERIOD,
  IN_EMA_MASK,
  IN_FLAGS,
  IN_MANUAL_MIN,
  IN_MANUAL_MAX,
  IN_PADDING_RATIO,
  IN_DPR,
  IN_RSI_TOP,
  IN_RSI_HEIGHT,
  IN_BB_PERIOD,
  IN_BB_STDDEV,
  OUT_VIS_START,
  OUT_VIS_END,
  OUT_VIS_COUNT,
  OUT_MIN_PRICE,
  OUT_MAX_PRICE,
  OUT_RAW_LOW,
  OUT_RAW_HIGH,
  OUT_MAX_VOL,
  OUT_HOVER_INDEX,
  OUT_HOVER_SNAP_X,
  OUT_HOVER_PRICE,
  OUT_GRID_COUNT,
  OUT_LAST_CLOSE,
  OUT_FIRST_OPEN,
  OUT_CHANGE_PCT,
  OUT_LAST_PRICE_Y,
  OUT_BULL_COUNT,
  OUT_BEAR_COUNT,
  OUT_EMA0_LAST,
  OUT_EMA1_LAST,
  OUT_EMA2_LAST,
  OUT_EMA3_LAST,
  OUT_RSI_LAST,
  OUT_BB_UPPER_LAST,
  OUT_BB_LOWER_LAST,
} from "./arena";

const FLAG_AUTO_SCALE_Y: i32 = 1 << 0;
const FLAG_EMA_ENABLED: i32 = 1 << 1;
const FLAG_LOG_SCALE: i32 = 1 << 2;
const FLAG_HEIKIN_ASHI: i32 = 1 << 3;
const FLAG_BB_ENABLED: i32 = 1 << 4;
const FLAG_RSI_ENABLED: i32 = 1 << 5;
const FLAG_CROSSHAIR_MAGNET: i32 = 1 << 6;

const META_BULLISH: u8 = 1 << 0;
const META_DOJI: u8 = 1 << 1;
const META_PINBAR: u8 = 1 << 2;
const META_ENGULFING: u8 = 1 << 3;

const RSI_PERIOD: i32 = 14;

// Estado O(1) de Wilder RSI para la penúltima y última vela cerrada
let rsiBaseGain: f64 = 0.0;
let rsiBaseLoss: f64 = 0.0;
let rsiCurGain: f64 = 0.0;
let rsiCurLoss: f64 = 0.0;
let rsiStateIdx: i32 = -1;

// @ts-ignore
@inline
function snapPx(v: f32, dpr: f32): f32 {
  return Mathf.round(v * dpr) / dpr;
}

// @ts-ignore
@inline
function loadInI32(offset: usize): i32 {
  return load<i32>(PARAM_IN_PTR + offset);
}

// @ts-ignore
@inline
function storeInI32(offset: usize, val: i32): void {
  store<i32>(PARAM_IN_PTR + offset, val);
}

// @ts-ignore
@inline
function loadInF32(offset: usize): f32 {
  return load<f32>(PARAM_IN_PTR + offset);
}

// @ts-ignore
@inline
function storeOutI32(offset: usize, val: i32): void {
  store<i32>(PARAM_OUT_PTR + offset, val);
}

// @ts-ignore
@inline
function storeOutF32(offset: usize, val: f32): void {
  store<f32>(PARAM_OUT_PTR + offset, val);
}

// @ts-ignore
@inline
function clampEmaPeriod(p: i32, fallback: i32): i32 {
  return p >= 2 ? (p <= 500 ? p : 500) : fallback;
}

// @ts-ignore
@inline
function emaAlpha(period: i32): f32 {
  return <f32>2.0 / (<f32>period + <f32>1.0);
}

export function initEngine(): void {
  Arena.wipe();
  rsiBaseGain = 0.0;
  rsiBaseLoss = 0.0;
  rsiCurGain = 0.0;
  rsiCurLoss = 0.0;
  rsiStateIdx = -1;

  storeInI32(IN_EMA0_PERIOD, 9);
  storeInI32(IN_EMA1_PERIOD, 21);
  storeInI32(IN_EMA2_PERIOD, 50);
  storeInI32(IN_EMA3_PERIOD, 200);
  storeInI32(IN_EMA_MASK, 0b0011);
  storeInI32(IN_BB_PERIOD, 20);
  store<f32>(PARAM_IN_PTR + IN_BB_STDDEV, <f32>2.0);
  storeInI32(IN_FLAGS, FLAG_AUTO_SCALE_Y | FLAG_EMA_ENABLED);
  store<f32>(PARAM_IN_PTR + IN_PADDING_RATIO, <f32>0.08);
  store<f32>(PARAM_IN_PTR + IN_DPR, <f32>1.0);
}

function compactWindow(dropCount: i32): void {
  const count = loadInI32(IN_CANDLE_COUNT);
  if (dropCount <= 0 || dropCount >= count) {
    storeInI32(IN_CANDLE_COUNT, 0);
    rsiStateIdx = -1;
    return;
  }
  const keep = count - dropCount;
  const keep4: usize = (<usize>keep) << 2;
  const keep8: usize = (<usize>keep) << 3;
  const drop4: usize = (<usize>dropCount) << 2;
  const drop8: usize = (<usize>dropCount) << 3;

  memory.copy(C_TS_PTR, C_TS_PTR + drop8, keep8);
  memory.copy(C_OPEN_PTR, C_OPEN_PTR + drop4, keep4);
  memory.copy(C_HIGH_PTR, C_HIGH_PTR + drop4, keep4);
  memory.copy(C_LOW_PTR, C_LOW_PTR + drop4, keep4);
  memory.copy(C_CLOSE_PTR, C_CLOSE_PTR + drop4, keep4);
  memory.copy(C_VOL_PTR, C_VOL_PTR + drop4, keep4);
  memory.copy(C_EMA0_PTR, C_EMA0_PTR + drop4, keep4);
  memory.copy(C_EMA1_PTR, C_EMA1_PTR + drop4, keep4);
  memory.copy(C_EMA2_PTR, C_EMA2_PTR + drop4, keep4);
  memory.copy(C_EMA3_PTR, C_EMA3_PTR + drop4, keep4);
  memory.copy(C_BB_UPPER_PTR, C_BB_UPPER_PTR + drop4, keep4);
  memory.copy(C_BB_LOWER_PTR, C_BB_LOWER_PTR + drop4, keep4);
  memory.copy(C_RSI_PTR, C_RSI_PTR + drop4, keep4);
  memory.copy(C_META_PTR, C_META_PTR + <usize>dropCount, <usize>keep);

  storeInI32(IN_CANDLE_COUNT, keep);
  if (rsiStateIdx >= 0) {
    rsiStateIdx -= dropCount;
  }
}

/**
 * Desplaza las velas existentes hacia la derecha para hacer hueco en [0..insertCount)
 * cuando se cargan velas históricas anteriores (backfill de Binance REST).
 */
export function shiftForPrepend(insertCount: i32): i32 {
  if (insertCount <= 0) return 0;
  const count = loadInI32(IN_CANDLE_COUNT);
  const actualInsert = insertCount > MAX_CANDLES ? MAX_CANDLES : insertCount;
  const keep = count > MAX_CANDLES - actualInsert ? MAX_CANDLES - actualInsert : count;

  if (keep > 0 && actualInsert > 0) {
    const keep4: usize = (<usize>keep) << 2;
    const keep8: usize = (<usize>keep) << 3;
    const shift4: usize = (<usize>actualInsert) << 2;
    const shift8: usize = (<usize>actualInsert) << 3;

    memory.copy(C_TS_PTR + shift8, C_TS_PTR, keep8);
    memory.copy(C_OPEN_PTR + shift4, C_OPEN_PTR, keep4);
    memory.copy(C_HIGH_PTR + shift4, C_HIGH_PTR, keep4);
    memory.copy(C_LOW_PTR + shift4, C_LOW_PTR, keep4);
    memory.copy(C_CLOSE_PTR + shift4, C_CLOSE_PTR, keep4);
    memory.copy(C_VOL_PTR + shift4, C_VOL_PTR, keep4);
  }

  const nextTotal = actualInsert + keep;
  storeInI32(IN_CANDLE_COUNT, nextTotal);
  rsiStateIdx = -1;
  return actualInsert;
}

// @ts-ignore
@inline
function classifyCandle(idx: i32): void {
  const off4: usize = (<usize>idx) << 2;
  const o = load<f32>(C_OPEN_PTR + off4);
  const h = load<f32>(C_HIGH_PTR + off4);
  const l = load<f32>(C_LOW_PTR + off4);
  const c = load<f32>(C_CLOSE_PTR + off4);

  const range = h - l;
  const body = Mathf.abs(c - o);
  let meta: u8 = c >= o ? META_BULLISH : 0;

  if (range > <f32>1e-9) {
    if (body <= range * <f32>0.12) {
      meta |= META_DOJI;
    }
    const upperWick = h - (c >= o ? c : o);
    const lowerWick = (c >= o ? o : c) - l;
    if (body > <f32>0.0) {
      if (lowerWick >= body * <f32>2.0 && upperWick <= body * <f32>0.6) {
        meta |= META_PINBAR;
      } else if (upperWick >= body * <f32>2.0 && lowerWick <= body * <f32>0.6) {
        meta |= META_PINBAR;
      }
    }
  }

  if (idx > 0) {
    const prevOff4: usize = (<usize>(idx - 1)) << 2;
    const po = load<f32>(C_OPEN_PTR + prevOff4);
    const pc = load<f32>(C_CLOSE_PTR + prevOff4);
    const prevBull = pc >= po;
    const curBull = c >= o;
    if (prevBull != curBull) {
      const prevBody = Mathf.abs(pc - po);
      if (body > prevBody * <f32>1.05) {
        const minCur = c < o ? c : o;
        const maxCur = c > o ? c : o;
        const minPrev = pc < po ? pc : po;
        const maxPrev = pc > po ? pc : po;
        if (minCur <= minPrev && maxCur >= maxPrev) {
          meta |= META_ENGULFING;
        }
      }
    }
  }

  store<u8>(C_META_PTR + <usize>idx, meta);
}

// @ts-ignore
@inline
function rsiFromAvg(avgG: f64, avgL: f64): f32 {
  if (avgL < 1e-9) {
    return avgG > 1e-9 ? <f32>100.0 : <f32>50.0;
  }
  return <f32>(100.0 - 100.0 / (1.0 + avgG / avgL));
}

/**
 * Actualiza BB y Wilder RSI(14) en O(1) para el índice más reciente cuando
 * el estado base de Wilder está sincronizado, con fallback exacto para series cortas.
 */
// @ts-ignore
@inline
function updateTrailingIndicatorsAt(idx: i32, bbPeriod: i32, bbStd: f32): void {
  const off4: usize = (<usize>idx) << 2;
  const c = load<f32>(C_CLOSE_PTR + off4);

  // Bollinger Bands (ventana corta exacta en f64, sin deriva por cancelación)
  const start = idx - bbPeriod + 1 > 0 ? idx - bbPeriod + 1 : 0;
  const len = idx - start + 1;
  let sum: f64 = 0.0;
  let sumSq: f64 = 0.0;
  for (let k = start; k <= idx; k++) {
    const v = <f64>load<f32>(C_CLOSE_PTR + ((<usize>k) << 2));
    sum += v;
    sumSq += v * v;
  }
  const mean = sum / <f64>len;
  const variance = Math.max(0.0, sumSq / <f64>len - mean * mean);
  const sd = Math.sqrt(variance) * <f64>bbStd;
  store<f32>(C_BB_UPPER_PTR + off4, <f32>(mean + sd));
  store<f32>(C_BB_LOWER_PTR + off4, <f32>(mean - sd));

  // Wilder RSI(14) en O(1) cuando idx == rsiStateIdx (> 14)
  if (idx == 0) {
    store<f32>(C_RSI_PTR, <f32>50.0);
    rsiBaseGain = 0.0;
    rsiBaseLoss = 0.0;
    rsiCurGain = 0.0;
    rsiCurLoss = 0.0;
    rsiStateIdx = 0;
  } else if (idx > RSI_PERIOD && rsiStateIdx == idx) {
    const prevC = load<f32>(C_CLOSE_PTR + ((<usize>(idx - 1)) << 2));
    const diff = <f64>(c - prevC);
    const gain = diff > 0.0 ? diff : 0.0;
    const loss = diff < 0.0 ? -diff : 0.0;
    rsiCurGain = (rsiBaseGain * <f64>(RSI_PERIOD - 1) + gain) / <f64>RSI_PERIOD;
    rsiCurLoss = (rsiBaseLoss * <f64>(RSI_PERIOD - 1) + loss) / <f64>RSI_PERIOD;
    store<f32>(C_RSI_PTR + off4, rsiFromAvg(rsiCurGain, rsiCurLoss));
  } else {
    // Fallback exacto para las primeras <= 14 velas o tras backfill
    const win = idx < RSI_PERIOD ? idx : RSI_PERIOD;
    let avgG: f64 = 0.0;
    let avgL: f64 = 0.0;
    for (let k = idx - win + 1; k <= idx; k++) {
      const prevC = load<f32>(C_CLOSE_PTR + ((<usize>(k - 1)) << 2));
      const curC = load<f32>(C_CLOSE_PTR + ((<usize>k) << 2));
      const diff = <f64>(curC - prevC);
      if (diff > 0.0) avgG += diff;
      else avgL -= diff;
    }
    avgG /= <f64>win;
    avgL /= <f64>win;
    rsiCurGain = avgG;
    rsiCurLoss = avgL;
    rsiStateIdx = idx;
    store<f32>(C_RSI_PTR + off4, rsiFromAvg(avgG, avgL));
  }
}

// @ts-ignore
@inline
function update4EmasAt(idx: i32, c: f32): void {
  const off4: usize = (<usize>idx) << 2;
  const p0 = clampEmaPeriod(loadInI32(IN_EMA0_PERIOD), 9);
  const p1 = clampEmaPeriod(loadInI32(IN_EMA1_PERIOD), 21);
  const p2 = clampEmaPeriod(loadInI32(IN_EMA2_PERIOD), 50);
  const p3 = clampEmaPeriod(loadInI32(IN_EMA3_PERIOD), 200);

  if (idx == 0) {
    store<f32>(C_EMA0_PTR, c);
    store<f32>(C_EMA1_PTR, c);
    store<f32>(C_EMA2_PTR, c);
    store<f32>(C_EMA3_PTR, c);
    return;
  }

  const prevOff4: usize = (<usize>(idx - 1)) << 2;
  const k0 = emaAlpha(p0);
  const k1 = emaAlpha(p1);
  const k2 = emaAlpha(p2);
  const k3 = emaAlpha(p3);

  const prev0 = load<f32>(C_EMA0_PTR + prevOff4);
  const prev1 = load<f32>(C_EMA1_PTR + prevOff4);
  const prev2 = load<f32>(C_EMA2_PTR + prevOff4);
  const prev3 = load<f32>(C_EMA3_PTR + prevOff4);

  store<f32>(C_EMA0_PTR + off4, c * k0 + prev0 * (<f32>1.0 - k0));
  store<f32>(C_EMA1_PTR + off4, c * k1 + prev1 * (<f32>1.0 - k1));
  store<f32>(C_EMA2_PTR + off4, c * k2 + prev2 * (<f32>1.0 - k2));
  store<f32>(C_EMA3_PTR + off4, c * k3 + prev3 * (<f32>1.0 - k3));
}

export function appendCandle(
  ts: f64,
  o: f32,
  h: f32,
  l: f32,
  c: f32,
  v: f32
): i32 {
  let count = loadInI32(IN_CANDLE_COUNT);
  if (count >= MAX_CANDLES) {
    compactWindow(2048);
    count = loadInI32(IN_CANDLE_COUNT);
  }

  // Promover estado Wilder de la vela anterior recién cerrada a base
  if (count > 0 && rsiStateIdx == count - 1) {
    rsiBaseGain = rsiCurGain;
    rsiBaseLoss = rsiCurLoss;
    rsiStateIdx = count;
  }

  const off4: usize = (<usize>count) << 2;
  const off8: usize = (<usize>count) << 3;

  store<f64>(C_TS_PTR + off8, ts);
  store<f32>(C_OPEN_PTR + off4, o);
  store<f32>(C_HIGH_PTR + off4, h);
  store<f32>(C_LOW_PTR + off4, l);
  store<f32>(C_CLOSE_PTR + off4, c);
  store<f32>(C_VOL_PTR + off4, v);

  classifyCandle(count);
  update4EmasAt(count, c);

  const bbP = loadInI32(IN_BB_PERIOD);
  const bbStd = loadInF32(IN_BB_STDDEV);
  updateTrailingIndicatorsAt(count, bbP > 2 ? bbP : 20, bbStd > <f32>0.1 ? bbStd : <f32>2.0);

  const nextCount = count + 1;
  storeInI32(IN_CANDLE_COUNT, nextCount);
  return nextCount;
}

export function updateLastCandle(
  high: f32,
  low: f32,
  close: f32,
  volume: f32,
  ts: f64
): void {
  const count = loadInI32(IN_CANDLE_COUNT);
  if (count <= 0) return;

  const idx = count - 1;
  const off4: usize = (<usize>idx) << 2;
  const off8: usize = (<usize>idx) << 3;

  const prevHigh = load<f32>(C_HIGH_PTR + off4);
  const prevLow = load<f32>(C_LOW_PTR + off4);

  store<f64>(C_TS_PTR + off8, ts);
  store<f32>(C_HIGH_PTR + off4, high > prevHigh ? high : prevHigh);
  store<f32>(C_LOW_PTR + off4, low < prevLow ? low : prevLow);
  store<f32>(C_CLOSE_PTR + off4, close);
  store<f32>(C_VOL_PTR + off4, volume);

  classifyCandle(idx);
  update4EmasAt(idx, close);

  const bbP = loadInI32(IN_BB_PERIOD);
  const bbStd = loadInF32(IN_BB_STDDEV);
  updateTrailingIndicatorsAt(idx, bbP > 2 ? bbP : 20, bbStd > <f32>0.1 ? bbStd : <f32>2.0);
}

/**
 * Recalcula las 4 EMAs configurables, Bollinger Bands (O(N) sliding window) y RSI(14) Wilder en O(N).
 */
export function computeIndicators(
  p0: i32,
  p1: i32,
  p2: i32,
  p3: i32
): void {
  const count = loadInI32(IN_CANDLE_COUNT);
  const ep0 = clampEmaPeriod(p0, 9);
  const ep1 = clampEmaPeriod(p1, 21);
  const ep2 = clampEmaPeriod(p2, 50);
  const ep3 = clampEmaPeriod(p3, 200);

  storeInI32(IN_EMA0_PERIOD, ep0);
  storeInI32(IN_EMA1_PERIOD, ep1);
  storeInI32(IN_EMA2_PERIOD, ep2);
  storeInI32(IN_EMA3_PERIOD, ep3);

  const rawBbP = loadInI32(IN_BB_PERIOD);
  const bbP = rawBbP > 2 ? rawBbP : 20;
  const rawBbStd = loadInF32(IN_BB_STDDEV);
  const bbStd = rawBbStd > <f32>0.1 ? rawBbStd : <f32>2.0;

  if (count <= 0) {
    rsiStateIdx = -1;
    return;
  }

  const k0 = emaAlpha(ep0);
  const k1 = emaAlpha(ep1);
  const k2 = emaAlpha(ep2);
  const k3 = emaAlpha(ep3);
  const om0: f32 = <f32>1.0 - k0;
  const om1: f32 = <f32>1.0 - k1;
  const om2: f32 = <f32>1.0 - k2;
  const om3: f32 = <f32>1.0 - k3;

  const firstClose = load<f32>(C_CLOSE_PTR);
  let ema0 = firstClose;
  let ema1 = firstClose;
  let ema2 = firstClose;
  let ema3 = firstClose;

  store<f32>(C_EMA0_PTR, ema0);
  store<f32>(C_EMA1_PTR, ema1);
  store<f32>(C_EMA2_PTR, ema2);
  store<f32>(C_EMA3_PTR, ema3);
  store<f32>(C_BB_UPPER_PTR, firstClose);
  store<f32>(C_BB_LOWER_PTR, firstClose);
  store<f32>(C_RSI_PTR, <f32>50.0);
  classifyCandle(0);

  let bbSum: f64 = <f64>firstClose;
  let bbSumSq: f64 = <f64>firstClose * <f64>firstClose;

  let avgGain: f64 = 0.0;
  let avgLoss: f64 = 0.0;
  let prevBarGain: f64 = 0.0;
  let prevBarLoss: f64 = 0.0;

  for (let i: i32 = 1; i < count; i++) {
    const off4: usize = (<usize>i) << 2;
    const c = load<f32>(C_CLOSE_PTR + off4);
    const prevC = load<f32>(C_CLOSE_PTR + ((<usize>(i - 1)) << 2));

    // 4 EMAs en paralelo escalar (4 registros independientes)
    ema0 = c * k0 + ema0 * om0;
    ema1 = c * k1 + ema1 * om1;
    ema2 = c * k2 + ema2 * om2;
    ema3 = c * k3 + ema3 * om3;
    store<f32>(C_EMA0_PTR + off4, ema0);
    store<f32>(C_EMA1_PTR + off4, ema1);
    store<f32>(C_EMA2_PTR + off4, ema2);
    store<f32>(C_EMA3_PTR + off4, ema3);

    // Bollinger Bands O(1) sliding window
    const c64: f64 = <f64>c;
    bbSum += c64;
    bbSumSq += c64 * c64;
    if (i >= bbP) {
      const oldC = <f64>load<f32>(C_CLOSE_PTR + ((<usize>(i - bbP)) << 2));
      bbSum -= oldC;
      bbSumSq -= oldC * oldC;
    }
    const winLen = i + 1 < bbP ? i + 1 : bbP;
    const mean = bbSum / <f64>winLen;
    const variance = Math.max(0.0, bbSumSq / <f64>winLen - mean * mean);
    const sd = Math.sqrt(variance) * <f64>bbStd;
    store<f32>(C_BB_UPPER_PTR + off4, <f32>(mean + sd));
    store<f32>(C_BB_LOWER_PTR + off4, <f32>(mean - sd));

    // Wilder RSI(14)
    const diff = <f64>(c - prevC);
    const gain = diff > 0.0 ? diff : 0.0;
    const loss = diff < 0.0 ? -diff : 0.0;
    if (i <= RSI_PERIOD) {
      avgGain += gain;
      avgLoss += loss;
      if (i == RSI_PERIOD) {
        avgGain /= <f64>RSI_PERIOD;
        avgLoss /= <f64>RSI_PERIOD;
        prevBarGain = avgGain;
        prevBarLoss = avgLoss;
      }
      const curG = i < RSI_PERIOD ? avgGain / <f64>i : avgGain;
      const curL = i < RSI_PERIOD ? avgLoss / <f64>i : avgLoss;
      store<f32>(C_RSI_PTR + off4, rsiFromAvg(curG, curL));
    } else {
      prevBarGain = avgGain;
      prevBarLoss = avgLoss;
      avgGain = (avgGain * <f64>(RSI_PERIOD - 1) + gain) / <f64>RSI_PERIOD;
      avgLoss = (avgLoss * <f64>(RSI_PERIOD - 1) + loss) / <f64>RSI_PERIOD;
      store<f32>(C_RSI_PTR + off4, rsiFromAvg(avgGain, avgLoss));
    }

    classifyCandle(i);
  }

  rsiBaseGain = prevBarGain;
  rsiBaseLoss = prevBarLoss;
  rsiCurGain = avgGain;
  rsiCurLoss = avgLoss;
  rsiStateIdx = count - 1;
}

/**
 * Escaneo SIMD v128 sobre carriles SoA (LOW, HIGH, VOL, opcionalmente BB y hasta 4 EMAs activas)
 */
function scanVisibleMinMaxSIMD(
  start: i32,
  end: i32,
  includeBb: bool,
  activeEmaMask: i32,
  outPtr: usize
): void {
  let minLo: f32 = f32.MAX_VALUE;
  let maxHi: f32 = -f32.MAX_VALUE;
  let maxVol: f32 = <f32>0.0;

  const ema0On = (activeEmaMask & 1) != 0;
  const ema1On = (activeEmaMask & 2) != 0;
  const ema2On = (activeEmaMask & 4) != 0;
  const ema3On = (activeEmaMask & 8) != 0;

  let i = start;

  while (i < end && (i & 3) != 0) {
    const off4: usize = (<usize>i) << 2;
    let lo = load<f32>(C_LOW_PTR + off4);
    let hi = load<f32>(C_HIGH_PTR + off4);
    const vol = load<f32>(C_VOL_PTR + off4);

    if (includeBb) {
      const bbl = load<f32>(C_BB_LOWER_PTR + off4);
      const bbu = load<f32>(C_BB_UPPER_PTR + off4);
      if (bbl > <f32>0.0 && bbl < lo) lo = bbl;
      if (bbu > hi) hi = bbu;
    }
    if (ema0On) {
      const e = load<f32>(C_EMA0_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema1On) {
      const e = load<f32>(C_EMA1_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema2On) {
      const e = load<f32>(C_EMA2_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema3On) {
      const e = load<f32>(C_EMA3_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }

    if (lo < minLo) minLo = lo;
    if (hi > maxHi) maxHi = hi;
    if (vol > maxVol) maxVol = vol;
    i++;
  }

  if (i + 4 <= end) {
    let vMin = f32x4.splat(minLo);
    let vMax = f32x4.splat(maxHi);
    let vVol = f32x4.splat(maxVol);

    for (; i + 4 <= end; i += 4) {
      const off4: usize = (<usize>i) << 2;
      const lows = v128.load(C_LOW_PTR + off4);
      const highs = v128.load(C_HIGH_PTR + off4);
      const vols = v128.load(C_VOL_PTR + off4);

      vMin = f32x4.min(vMin, lows);
      vMax = f32x4.max(vMax, highs);
      vVol = f32x4.max(vVol, vols);

      if (includeBb) {
        const bbL = v128.load(C_BB_LOWER_PTR + off4);
        const bbU = v128.load(C_BB_UPPER_PTR + off4);
        vMin = f32x4.min(vMin, bbL);
        vMax = f32x4.max(vMax, bbU);
      }
      if (ema0On) {
        const vE = v128.load(C_EMA0_PTR + off4);
        vMin = f32x4.min(vMin, vE);
        vMax = f32x4.max(vMax, vE);
      }
      if (ema1On) {
        const vE = v128.load(C_EMA1_PTR + off4);
        vMin = f32x4.min(vMin, vE);
        vMax = f32x4.max(vMax, vE);
      }
      if (ema2On) {
        const vE = v128.load(C_EMA2_PTR + off4);
        vMin = f32x4.min(vMin, vE);
        vMax = f32x4.max(vMax, vE);
      }
      if (ema3On) {
        const vE = v128.load(C_EMA3_PTR + off4);
        vMin = f32x4.min(vMin, vE);
        vMax = f32x4.max(vMax, vE);
      }
    }

    minLo = Mathf.min(
      Mathf.min(f32x4.extract_lane(vMin, 0), f32x4.extract_lane(vMin, 1)),
      Mathf.min(f32x4.extract_lane(vMin, 2), f32x4.extract_lane(vMin, 3))
    );
    maxHi = Mathf.max(
      Mathf.max(f32x4.extract_lane(vMax, 0), f32x4.extract_lane(vMax, 1)),
      Mathf.max(f32x4.extract_lane(vMax, 2), f32x4.extract_lane(vMax, 3))
    );
    maxVol = Mathf.max(
      Mathf.max(f32x4.extract_lane(vVol, 0), f32x4.extract_lane(vVol, 1)),
      Mathf.max(f32x4.extract_lane(vVol, 2), f32x4.extract_lane(vVol, 3))
    );
  }

  while (i < end) {
    const off4: usize = (<usize>i) << 2;
    let lo = load<f32>(C_LOW_PTR + off4);
    let hi = load<f32>(C_HIGH_PTR + off4);
    const vol = load<f32>(C_VOL_PTR + off4);

    if (includeBb) {
      const bbl = load<f32>(C_BB_LOWER_PTR + off4);
      const bbu = load<f32>(C_BB_UPPER_PTR + off4);
      if (bbl > <f32>0.0 && bbl < lo) lo = bbl;
      if (bbu > hi) hi = bbu;
    }
    if (ema0On) {
      const e = load<f32>(C_EMA0_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema1On) {
      const e = load<f32>(C_EMA1_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema2On) {
      const e = load<f32>(C_EMA2_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
    if (ema3On) {
      const e = load<f32>(C_EMA3_PTR + off4);
      if (e > <f32>0.0) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }

    if (lo < minLo) minLo = lo;
    if (hi > maxHi) maxHi = hi;
    if (vol > maxVol) maxVol = vol;
    i++;
  }

  store<f32>(outPtr, minLo);
  store<f32>(outPtr + 4, maxHi);
  store<f32>(outPtr + 8, maxVol);
}

function computeNiceGrid(
  minPrice: f32,
  maxPrice: f32,
  chartTop: f32,
  chartHeight: f32,
  isLog: bool,
  dpr: f32
): i32 {
  const range = maxPrice - minPrice;
  if (range <= <f32>1e-9 || chartHeight <= <f32>10.0) return 0;

  const targetTicks: i32 = <i32>Mathf.max(<f32>3.0, Mathf.min(<f32>10.0, Mathf.floor(chartHeight / <f32>58.0)));
  const rawStep: f64 = <f64>range / <f64>targetTicks;
  const mag: f64 = Math.pow(10.0, Math.floor(Math.log10(rawStep)));
  const norm: f64 = rawStep / mag;

  let niceNorm: f64 = 1.0;
  if (norm < 1.5) niceNorm = 1.0;
  else if (norm < 3.0) niceNorm = 2.0;
  else if (norm < 7.0) niceNorm = 5.0;
  else niceNorm = 10.0;

  const step: f64 = niceNorm * mag;
  const firstTick: f64 = Math.ceil(<f64>minPrice / step) * step;

  const logMin: f32 = isLog && minPrice > <f32>0.0 ? Mathf.log(minPrice) : <f32>0.0;
  const logMax: f32 = isLog && maxPrice > <f32>0.0 ? Mathf.log(maxPrice) : <f32>1.0;
  const logSpan: f32 = logMax - logMin;

  let count: i32 = 0;
  let val: f64 = firstTick;
  while (val <= <f64>maxPrice && count < MAX_GRID_TICKS) {
    const p: f32 = <f32>val;
    let tNorm: f32 = <f32>0.0;
    if (isLog && p > <f32>0.0 && logSpan > <f32>1e-9) {
      tNorm = (Mathf.log(p) - logMin) / logSpan;
    } else {
      tNorm = (p - minPrice) / range;
    }
    const yPx = snapPx(chartTop + chartHeight - tNorm * chartHeight, dpr);
    const off4: usize = (<usize>count) << 2;
    store<f32>(R_GRID_PRICES_PTR + off4, p);
    store<f32>(R_GRID_YS_PTR + off4, yPx);
    count++;
    val += step;
  }
  return count;
}

export function renderProject(): i32 {
  const savedScratch = Arena.save();

  const count = loadInI32(IN_CANDLE_COUNT);
  if (count <= 0) {
    storeOutI32(OUT_VIS_START, 0);
    storeOutI32(OUT_VIS_END, 0);
    storeOutI32(OUT_VIS_COUNT, 0);
    storeOutI32(OUT_HOVER_INDEX, -1);
    storeOutI32(OUT_GRID_COUNT, 0);
    Arena.restore(savedScratch);
    return 0;
  }

  const chartLeft = loadInF32(IN_CHART_LEFT);
  const chartTop = loadInF32(IN_CHART_TOP);
  const chartWidth = loadInF32(IN_CHART_WIDTH);
  const chartHeight = loadInF32(IN_CHART_HEIGHT);
  const volTop = loadInF32(IN_VOL_TOP);
  const volHeight = loadInF32(IN_VOL_HEIGHT);
  const rsiTop = loadInF32(IN_RSI_TOP);
  const rsiHeight = loadInF32(IN_RSI_HEIGHT);
  const pitch = Mathf.max(<f32>2.0, loadInF32(IN_CANDLE_PITCH));
  const bodyW = Mathf.max(<f32>1.0, loadInF32(IN_BODY_WIDTH));
  const scrollRight = loadInF32(IN_SCROLL_RIGHT);
  const cursorX = loadInF32(IN_CURSOR_X);
  const cursorY = loadInF32(IN_CURSOR_Y);
  const flags = loadInI32(IN_FLAGS);
  const padRatio = Mathf.max(<f32>0.01, Mathf.min(<f32>0.35, loadInF32(IN_PADDING_RATIO)));
  const dpr = Mathf.max(<f32>1.0, loadInF32(IN_DPR));

  const autoY: bool = (flags & FLAG_AUTO_SCALE_Y) != 0;
  const emaOn: bool = (flags & FLAG_EMA_ENABLED) != 0;
  const isLog: bool = (flags & FLAG_LOG_SCALE) != 0;
  const isHA: bool = (flags & FLAG_HEIKIN_ASHI) != 0;
  const bbOn: bool = (flags & FLAG_BB_ENABLED) != 0;
  const rsiOn: bool = (flags & FLAG_RSI_ENABLED) != 0;
  const magnetOn: bool = (flags & FLAG_CROSSHAIR_MAGNET) != 0;

  const emaMask: i32 = emaOn ? (loadInI32(IN_EMA_MASK) & 0b1111) : 0;
  const ema0On: bool = (emaMask & 1) != 0;
  const ema1On: bool = (emaMask & 2) != 0;
  const ema2On: bool = (emaMask & 4) != 0;
  const ema3On: bool = (emaMask & 8) != 0;

  const rightMarginPx: f32 = chartLeft + chartWidth - pitch * <f32>0.5;
  const lastCenterX: f32 = rightMarginPx + scrollRight * pitch;

  const leftEdge = chartLeft - pitch;
  const rightEdge = chartLeft + chartWidth + pitch;

  let visStart: i32 = <i32>Mathf.floor(<f32>(count - 1) - (lastCenterX - leftEdge) / pitch);
  let visEnd: i32 = <i32>Mathf.ceil(<f32>(count - 1) - (lastCenterX - rightEdge) / pitch) + 1;

  if (visStart < 0) visStart = 0;
  if (visEnd > count) visEnd = count;
  if (visStart >= visEnd) {
    storeOutI32(OUT_VIS_START, visStart);
    storeOutI32(OUT_VIS_END, visStart);
    storeOutI32(OUT_VIS_COUNT, 0);
    storeOutI32(OUT_HOVER_INDEX, -1);
    storeOutI32(OUT_GRID_COUNT, 0);
    Arena.restore(savedScratch);
    return 0;
  }

  if (visEnd - visStart > MAX_VISIBLE) {
    visStart = visEnd - MAX_VISIBLE;
  }

  const minMaxScratch = Arena.alloc16(16);
  scanVisibleMinMaxSIMD(visStart, visEnd, bbOn, emaMask, minMaxScratch);

  let rawLow = load<f32>(minMaxScratch);
  let rawHigh = load<f32>(minMaxScratch + 4);
  let maxVol = load<f32>(minMaxScratch + 8);
  if (maxVol < <f32>1e-6) maxVol = <f32>1.0;

  if (isHA) {
    let haOpen: f32 = (load<f32>(C_OPEN_PTR + ((<usize>visStart) << 2)) + load<f32>(C_CLOSE_PTR + ((<usize>visStart) << 2))) * <f32>0.5;
    for (let i = visStart; i < visEnd; i++) {
      const off4: usize = (<usize>i) << 2;
      const o = load<f32>(C_OPEN_PTR + off4);
      const h = load<f32>(C_HIGH_PTR + off4);
      const l = load<f32>(C_LOW_PTR + off4);
      const c = load<f32>(C_CLOSE_PTR + off4);
      const haClose = (o + h + l + c) * <f32>0.25;
      const haHigh = Mathf.max(h, Mathf.max(haOpen, haClose));
      const haLow = Mathf.min(l, Mathf.min(haOpen, haClose));
      if (haLow < rawLow) rawLow = haLow;
      if (haHigh > rawHigh) rawHigh = haHigh;
      haOpen = (haOpen + haClose) * <f32>0.5;
    }
  }

  let minPrice: f32 = rawLow;
  let maxPrice: f32 = rawHigh;

  if (autoY) {
    const span = maxPrice - minPrice;
    const pad = span > <f32>1e-9 ? span * padRatio : Mathf.max(<f32>1.0, maxPrice * <f32>0.01);
    minPrice -= pad;
    maxPrice += pad;
    if (isLog && minPrice <= <f32>0.0) {
      minPrice = Mathf.max(<f32>1e-6, rawLow * <f32>0.96);
    }
  } else {
    minPrice = loadInF32(IN_MANUAL_MIN);
    maxPrice = loadInF32(IN_MANUAL_MAX);
  }

  const priceSpan: f32 = Mathf.max(<f32>1e-9, maxPrice - minPrice);
  const scaleY: f32 = chartHeight / priceSpan;
  const chartBottom: f32 = chartTop + chartHeight;
  const invMaxVol: f32 = <f32>1.0 / maxVol;

  // Vectores SIMD constantes para transformación lineal [O, H, L, C] y [EMA0..EMA3]
  const vMinP = f32x4.splat(minPrice);
  const vNegScaleY = f32x4.splat(-scaleY);
  const vChartBot = f32x4.splat(chartBottom);

  const logMin: f32 = isLog && minPrice > <f32>0.0 ? Mathf.log(minPrice) : <f32>0.0;
  const logMax: f32 = isLog && maxPrice > <f32>0.0 ? Mathf.log(maxPrice) : <f32>1.0;
  const logSpan: f32 = Mathf.max(<f32>1e-9, logMax - logMin);
  const invLogSpan: f32 = <f32>1.0 / logSpan;

  const wickW: f32 = Mathf.max(<f32>1.0 / dpr, Mathf.min(<f32>2.0, bodyW * <f32>0.16));
  const halfBody: f32 = bodyW * <f32>0.5;
  const halfWick: f32 = wickW * <f32>0.5;
  const minBodyH: f32 = <f32>1.0 / dpr;

  let visCount: i32 = 0;
  let bullCount: i32 = 0;
  let bearCount: i32 = 0;

  let haPrevOpen: f32 = <f32>0.0;
  if (isHA) {
    const firstOff4: usize = (<usize>visStart) << 2;
    haPrevOpen = (load<f32>(C_OPEN_PTR + firstOff4) + load<f32>(C_CLOSE_PTR + firstOff4)) * <f32>0.5;
  }

  for (let i = visStart; i < visEnd; i++) {
    const off4: usize = (<usize>i) << 2;
    let o = load<f32>(C_OPEN_PTR + off4);
    let h = load<f32>(C_HIGH_PTR + off4);
    let l = load<f32>(C_LOW_PTR + off4);
    let c = load<f32>(C_CLOSE_PTR + off4);
    const vol = load<f32>(C_VOL_PTR + off4);

    if (isHA) {
      const haC = (o + h + l + c) * <f32>0.25;
      const haO = haPrevOpen;
      const haH = Mathf.max(h, Mathf.max(haO, haC));
      const haL = Mathf.min(l, Mathf.min(haO, haC));
      haPrevOpen = (haO + haC) * <f32>0.5;
      o = haO;
      h = haH;
      l = haL;
      c = haC;
    }

    const isBull: bool = c >= o;
    if (isBull) bullCount++;
    else bearCount++;

    const cx = lastCenterX - <f32>(count - 1 - i) * pitch;

    let yOpen: f32;
    let yHigh: f32;
    let yLow: f32;
    let yClose: f32;

    if (isLog) {
      yHigh = chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, h)) - logMin) * invLogSpan) * chartHeight;
      yLow = chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, l)) - logMin) * invLogSpan) * chartHeight;
      yOpen = chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, o)) - logMin) * invLogSpan) * chartHeight;
      yClose = chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, c)) - logMin) * invLogSpan) * chartHeight;
    } else {
      let vOhlc = f32x4.splat(o);
      vOhlc = f32x4.replace_lane(vOhlc, 1, h);
      vOhlc = f32x4.replace_lane(vOhlc, 2, l);
      vOhlc = f32x4.replace_lane(vOhlc, 3, c);

      const vY = f32x4.add(vChartBot, f32x4.mul(f32x4.sub(vOhlc, vMinP), vNegScaleY));
      yOpen = f32x4.extract_lane(vY, 0);
      yHigh = f32x4.extract_lane(vY, 1);
      yLow = f32x4.extract_lane(vY, 2);
      yClose = f32x4.extract_lane(vY, 3);
    }

    const bodyTop = snapPx(yOpen < yClose ? yOpen : yClose, dpr);
    const bodyBot = snapPx(yOpen > yClose ? yOpen : yClose, dpr);
    const bodyH = Mathf.max(minBodyH, bodyBot - bodyTop);
    const bodyX = snapPx(cx - halfBody, dpr);

    const wickTop = snapPx(yHigh, dpr);
    const wickBot = snapPx(yLow, dpr);
    const wickH = Mathf.max(minBodyH, wickBot - wickTop);
    const wickX = snapPx(cx - halfWick, dpr);

    const volRatio = Mathf.max(<f32>0.0, Mathf.min(<f32>1.0, vol * invMaxVol));
    const vH = Mathf.max(minBodyH, snapPx(volRatio * volHeight, dpr));
    const vY = snapPx(volTop + volHeight - vH, dpr);

    const out16: usize = (<usize>visCount) << 4;
    store<f32>(R_BODY_INST_PTR + out16, bodyX);
    store<f32>(R_BODY_INST_PTR + out16 + 4, bodyTop);
    store<f32>(R_BODY_INST_PTR + out16 + 8, bodyW);
    store<f32>(R_BODY_INST_PTR + out16 + 12, bodyH);

    store<f32>(R_WICK_INST_PTR + out16, wickX);
    store<f32>(R_WICK_INST_PTR + out16 + 4, wickTop);
    store<f32>(R_WICK_INST_PTR + out16 + 8, wickW);
    store<f32>(R_WICK_INST_PTR + out16 + 12, wickH);

    store<f32>(R_VOL_INST_PTR + out16, bodyX);
    store<f32>(R_VOL_INST_PTR + out16 + 4, vY);
    store<f32>(R_VOL_INST_PTR + out16 + 8, bodyW);
    store<f32>(R_VOL_INST_PTR + out16 + 12, vH);

    const rawMeta = load<u8>(C_META_PTR + <usize>i);
    const outColor: u8 = (isBull ? 1 : 0) | (rawMeta & ~1);
    store<u8>(R_COLOR_PTR + <usize>visCount, outColor);

    const out8: usize = (<usize>visCount) << 3;
    if (emaMask != 0) {
      if (isLog) {
        if (ema0On) {
          const e0 = load<f32>(C_EMA0_PTR + off4);
          store<f32>(R_EMA0_XY_PTR + out8, cx);
          store<f32>(R_EMA0_XY_PTR + out8 + 4, chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, e0)) - logMin) * invLogSpan) * chartHeight);
        }
        if (ema1On) {
          const e1 = load<f32>(C_EMA1_PTR + off4);
          store<f32>(R_EMA1_XY_PTR + out8, cx);
          store<f32>(R_EMA1_XY_PTR + out8 + 4, chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, e1)) - logMin) * invLogSpan) * chartHeight);
        }
        if (ema2On) {
          const e2 = load<f32>(C_EMA2_PTR + off4);
          store<f32>(R_EMA2_XY_PTR + out8, cx);
          store<f32>(R_EMA2_XY_PTR + out8 + 4, chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, e2)) - logMin) * invLogSpan) * chartHeight);
        }
        if (ema3On) {
          const e3 = load<f32>(C_EMA3_PTR + off4);
          store<f32>(R_EMA3_XY_PTR + out8, cx);
          store<f32>(R_EMA3_XY_PTR + out8 + 4, chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, e3)) - logMin) * invLogSpan) * chartHeight);
        }
      } else {
        // Proyección SIMD v128 simultánea para las 4 EMAs [EMA0, EMA1, EMA2, EMA3]
        let vEmas = f32x4.splat(load<f32>(C_EMA0_PTR + off4));
        vEmas = f32x4.replace_lane(vEmas, 1, load<f32>(C_EMA1_PTR + off4));
        vEmas = f32x4.replace_lane(vEmas, 2, load<f32>(C_EMA2_PTR + off4));
        vEmas = f32x4.replace_lane(vEmas, 3, load<f32>(C_EMA3_PTR + off4));

        const vEmaY = f32x4.add(vChartBot, f32x4.mul(f32x4.sub(vEmas, vMinP), vNegScaleY));
        if (ema0On) {
          store<f32>(R_EMA0_XY_PTR + out8, cx);
          store<f32>(R_EMA0_XY_PTR + out8 + 4, f32x4.extract_lane(vEmaY, 0));
        }
        if (ema1On) {
          store<f32>(R_EMA1_XY_PTR + out8, cx);
          store<f32>(R_EMA1_XY_PTR + out8 + 4, f32x4.extract_lane(vEmaY, 1));
        }
        if (ema2On) {
          store<f32>(R_EMA2_XY_PTR + out8, cx);
          store<f32>(R_EMA2_XY_PTR + out8 + 4, f32x4.extract_lane(vEmaY, 2));
        }
        if (ema3On) {
          store<f32>(R_EMA3_XY_PTR + out8, cx);
          store<f32>(R_EMA3_XY_PTR + out8 + 4, f32x4.extract_lane(vEmaY, 3));
        }
      }
    }

    if (bbOn) {
      const bbU = load<f32>(C_BB_UPPER_PTR + off4);
      const bbL = load<f32>(C_BB_LOWER_PTR + off4);
      const yBbU = isLog
        ? chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, bbU)) - logMin) * invLogSpan) * chartHeight
        : chartBottom - (bbU - minPrice) * scaleY;
      const yBbL = isLog
        ? chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, bbL)) - logMin) * invLogSpan) * chartHeight
        : chartBottom - (bbL - minPrice) * scaleY;
      store<f32>(R_BB_UPPER_XY_PTR + out8, cx);
      store<f32>(R_BB_UPPER_XY_PTR + out8 + 4, yBbU);
      store<f32>(R_BB_LOWER_XY_PTR + out8, cx);
      store<f32>(R_BB_LOWER_XY_PTR + out8 + 4, yBbL);
    }

    if (rsiOn && rsiHeight > <f32>10.0) {
      const rsiVal = Mathf.max(<f32>0.0, Mathf.min(<f32>100.0, load<f32>(C_RSI_PTR + off4)));
      const yRsi = rsiTop + rsiHeight - (rsiVal / <f32>100.0) * rsiHeight;
      store<f32>(R_RSI_XY_PTR + out8, cx);
      store<f32>(R_RSI_XY_PTR + out8 + 4, yRsi);
    }

    visCount++;
  }

  // Hit-test de crosshair (con soporte opcional de imán OHLC)
  let hoverIdx: i32 = -1;
  let hoverSnapX: f32 = <f32>-1.0;
  let hoverPrice: f32 = <f32>0.0;
  const interactiveBottom = rsiOn && rsiHeight > <f32>10.0
    ? rsiTop + rsiHeight
    : (volHeight > <f32>0.0 ? volTop + volHeight : chartBottom);

  if (
    cursorX >= chartLeft &&
    cursorX <= chartLeft + chartWidth &&
    cursorY >= chartTop &&
    cursorY <= interactiveBottom
  ) {
    const rawIdx = <i32>Mathf.round(<f32>(count - 1) - (lastCenterX - cursorX) / pitch);
    if (rawIdx >= visStart && rawIdx < visEnd) {
      hoverIdx = rawIdx;
      hoverSnapX = snapPx(lastCenterX - <f32>(count - 1 - rawIdx) * pitch, dpr);
    }
    const yClamped = Mathf.max(chartTop, Mathf.min(chartBottom, cursorY));
    const normY = (chartBottom - yClamped) / Mathf.max(<f32>1.0, chartHeight);
    if (isLog) {
      hoverPrice = Mathf.exp(logMin + normY * logSpan);
    } else {
      hoverPrice = minPrice + normY * priceSpan;
    }

    if (magnetOn && hoverIdx >= 0 && cursorY <= chartBottom) {
      hoverPrice = load<f32>(C_CLOSE_PTR + ((<usize>hoverIdx) << 2));
    }
  }

  const gridCount = computeNiceGrid(minPrice, maxPrice, chartTop, chartHeight, isLog, dpr);

  const lastIdx = count - 1;
  const lastOff4: usize = (<usize>lastIdx) << 2;
  const firstVisOff4: usize = (<usize>visStart) << 2;
  const lastClose = load<f32>(C_CLOSE_PTR + lastOff4);
  const firstOpen = load<f32>(C_OPEN_PTR + firstVisOff4);
  const changePct: f32 = firstOpen > <f32>1e-9 ? ((lastClose - firstOpen) / firstOpen) * <f32>100.0 : <f32>0.0;

  const lastPriceY = isLog
    ? chartBottom - ((Mathf.log(Mathf.max(<f32>1e-9, lastClose)) - logMin) * invLogSpan) * chartHeight
    : chartBottom - (lastClose - minPrice) * scaleY;

  storeOutI32(OUT_VIS_START, visStart);
  storeOutI32(OUT_VIS_END, visEnd);
  storeOutI32(OUT_VIS_COUNT, visCount);
  storeOutF32(OUT_MIN_PRICE, minPrice);
  storeOutF32(OUT_MAX_PRICE, maxPrice);
  storeOutF32(OUT_RAW_LOW, rawLow);
  storeOutF32(OUT_RAW_HIGH, rawHigh);
  storeOutF32(OUT_MAX_VOL, maxVol);
  storeOutI32(OUT_HOVER_INDEX, hoverIdx);
  storeOutF32(OUT_HOVER_SNAP_X, hoverSnapX);
  storeOutF32(OUT_HOVER_PRICE, hoverPrice);
  storeOutI32(OUT_GRID_COUNT, gridCount);
  storeOutF32(OUT_LAST_CLOSE, lastClose);
  storeOutF32(OUT_FIRST_OPEN, firstOpen);
  storeOutF32(OUT_CHANGE_PCT, changePct);
  storeOutF32(OUT_LAST_PRICE_Y, snapPx(lastPriceY, dpr));
  storeOutI32(OUT_BULL_COUNT, bullCount);
  storeOutI32(OUT_BEAR_COUNT, bearCount);
  storeOutF32(OUT_EMA0_LAST, load<f32>(C_EMA0_PTR + lastOff4));
  storeOutF32(OUT_EMA1_LAST, load<f32>(C_EMA1_PTR + lastOff4));
  storeOutF32(OUT_EMA2_LAST, load<f32>(C_EMA2_PTR + lastOff4));
  storeOutF32(OUT_EMA3_LAST, load<f32>(C_EMA3_PTR + lastOff4));
  storeOutF32(OUT_RSI_LAST, load<f32>(C_RSI_PTR + lastOff4));
  storeOutF32(OUT_BB_UPPER_LAST, load<f32>(C_BB_UPPER_PTR + lastOff4));
  storeOutF32(OUT_BB_LOWER_LAST, load<f32>(C_BB_LOWER_PTR + lastOff4));

  Arena.restore(savedScratch);
  return visCount;
}
