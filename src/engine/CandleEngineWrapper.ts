import {
  type ArenaMemoryDiagnostics,
  type CandleInspection,
  type EmaPeriodTuple,
  EngineFlags,
  type FrameProjection,
  type OhlcvCandle,
  ParamInOffset,
  ParamOutOffset,
  type ViewportConfig,
} from "./constants";

interface CandleEngineWasmExports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  initEngine: () => void;
  shiftForPrepend: (insertCount: number) => number;
  appendCandle: (
    ts: number,
    o: number,
    h: number,
    l: number,
    c: number,
    v: number
  ) => number;
  updateLastCandle: (
    high: number,
    low: number,
    close: number,
    volume: number,
    ts: number
  ) => void;
  computeIndicators: (p0: number, p1: number, p2: number, p3: number) => void;
  renderProject: () => number;
  secure_wipe: () => void;

  getMaxCandles: () => number;
  getMaxVisible: () => number;
  getMaxGridTicks: () => number;
  getMaxEmas: () => number;
  getBytesPerCandle: () => number;
  getParamInSize: () => number;
  getParamOutSize: () => number;
  getWorkSize: () => number;
  getCandlesSoaSize: () => number;
  getRenderOutSize: () => number;
  getTotalArenaSize: () => number;

  getParamInPtr: () => number;
  getParamOutPtr: () => number;
  getScratchWorkPtr: () => number;
  getCandlesSoaPtr: () => number;
  getRenderOutPtr: () => number;

  getCTsPtr: () => number;
  getCOpenPtr: () => number;
  getCHighPtr: () => number;
  getCLowPtr: () => number;
  getCClosePtr: () => number;
  getCVolPtr: () => number;
  getCEma0Ptr: () => number;
  getCEma1Ptr: () => number;
  getCEma2Ptr: () => number;
  getCEma3Ptr: () => number;
  getCBbUpperPtr: () => number;
  getCBbLowerPtr: () => number;
  getCRsiPtr: () => number;
  getCMetaPtr: () => number;

  getRBodyInstPtr: () => number;
  getRWickInstPtr: () => number;
  getRVolInstPtr: () => number;
  getRColorPtr: () => number;
  getREma0XyPtr: () => number;
  getREma1XyPtr: () => number;
  getREma2XyPtr: () => number;
  getREma3XyPtr: () => number;
  getRBbUpperXyPtr: () => number;
  getRBbLowerXyPtr: () => number;
  getRRsiXyPtr: () => number;
  getRGridPricesPtr: () => number;
  getRGridYsPtr: () => number;
}

const DEFAULT_PERIODS: EmaPeriodTuple = [9, 21, 50, 200];

export class CandleEngineWrapper {
  private exports: CandleEngineWasmExports;
  private memory: WebAssembly.Memory;

  private paramInView: DataView;
  private paramOutView: DataView;

  // SoA zero-copy TypedArray views
  private cTs: Float64Array;
  private cOpen: Float32Array;
  private cHigh: Float32Array;
  private cLow: Float32Array;
  private cClose: Float32Array;
  private cVol: Float32Array;
  private cEmas: [Float32Array, Float32Array, Float32Array, Float32Array];
  private cBbUpper: Float32Array;
  private cBbLower: Float32Array;
  private cRsi: Float32Array;
  private cMeta: Uint8Array;

  // Render output zero-copy TypedArray views
  private rBodies: Float32Array;
  private rWicks: Float32Array;
  private rVols: Float32Array;
  private rColors: Uint8Array;
  private rEmaXy: [Float32Array, Float32Array, Float32Array, Float32Array];
  private rBbUpperXy: Float32Array;
  private rBbLowerXy: Float32Array;
  private rRsiXy: Float32Array;
  private rGridPrices: Float32Array;
  private rGridYs: Float32Array;

  // Reusable projection struct to eliminate per-frame object/array GC allocations
  private projectionOut: FrameProjection;

  public readonly maxCandles: number;
  public readonly maxVisible: number;
  public readonly maxGridTicks: number;
  public readonly maxEmas: number;
  public readonly totalArenaBytes: number;

  private constructor(instance: WebAssembly.Instance) {
    this.exports = instance.exports as CandleEngineWasmExports;
    this.memory = this.exports.memory;
    this.exports.initEngine();

    this.maxCandles = this.exports.getMaxCandles();
    this.maxVisible = this.exports.getMaxVisible();
    this.maxGridTicks = this.exports.getMaxGridTicks();
    this.maxEmas = this.exports.getMaxEmas();
    this.totalArenaBytes = this.exports.getTotalArenaSize();

    const buf = this.memory.buffer;
    const paramInPtr = this.exports.getParamInPtr();
    const paramOutPtr = this.exports.getParamOutPtr();

    this.paramInView = new DataView(buf, paramInPtr, this.exports.getParamInSize());
    this.paramOutView = new DataView(buf, paramOutPtr, this.exports.getParamOutSize());

    this.cTs = new Float64Array(buf, this.exports.getCTsPtr(), this.maxCandles);
    this.cOpen = new Float32Array(buf, this.exports.getCOpenPtr(), this.maxCandles);
    this.cHigh = new Float32Array(buf, this.exports.getCHighPtr(), this.maxCandles);
    this.cLow = new Float32Array(buf, this.exports.getCLowPtr(), this.maxCandles);
    this.cClose = new Float32Array(buf, this.exports.getCClosePtr(), this.maxCandles);
    this.cVol = new Float32Array(buf, this.exports.getCVolPtr(), this.maxCandles);
    this.cEmas = [
      new Float32Array(buf, this.exports.getCEma0Ptr(), this.maxCandles),
      new Float32Array(buf, this.exports.getCEma1Ptr(), this.maxCandles),
      new Float32Array(buf, this.exports.getCEma2Ptr(), this.maxCandles),
      new Float32Array(buf, this.exports.getCEma3Ptr(), this.maxCandles),
    ];
    this.cBbUpper = new Float32Array(buf, this.exports.getCBbUpperPtr(), this.maxCandles);
    this.cBbLower = new Float32Array(buf, this.exports.getCBbLowerPtr(), this.maxCandles);
    this.cRsi = new Float32Array(buf, this.exports.getCRsiPtr(), this.maxCandles);
    this.cMeta = new Uint8Array(buf, this.exports.getCMetaPtr(), this.maxCandles);

    this.rBodies = new Float32Array(buf, this.exports.getRBodyInstPtr(), this.maxVisible * 4);
    this.rWicks = new Float32Array(buf, this.exports.getRWickInstPtr(), this.maxVisible * 4);
    this.rVols = new Float32Array(buf, this.exports.getRVolInstPtr(), this.maxVisible * 4);
    this.rColors = new Uint8Array(buf, this.exports.getRColorPtr(), this.maxVisible);
    this.rEmaXy = [
      new Float32Array(buf, this.exports.getREma0XyPtr(), this.maxVisible * 2),
      new Float32Array(buf, this.exports.getREma1XyPtr(), this.maxVisible * 2),
      new Float32Array(buf, this.exports.getREma2XyPtr(), this.maxVisible * 2),
      new Float32Array(buf, this.exports.getREma3XyPtr(), this.maxVisible * 2),
    ];
    this.rBbUpperXy = new Float32Array(buf, this.exports.getRBbUpperXyPtr(), this.maxVisible * 2);
    this.rBbLowerXy = new Float32Array(buf, this.exports.getRBbLowerXyPtr(), this.maxVisible * 2);
    this.rRsiXy = new Float32Array(buf, this.exports.getRRsiXyPtr(), this.maxVisible * 2);
    this.rGridPrices = new Float32Array(buf, this.exports.getRGridPricesPtr(), this.maxGridTicks);
    this.rGridYs = new Float32Array(buf, this.exports.getRGridYsPtr(), this.maxGridTicks);

    this.projectionOut = {
      visibleStart: 0,
      visibleEnd: 0,
      visibleCount: 0,
      minPrice: 0,
      maxPrice: 0,
      rawLow: 0,
      rawHigh: 0,
      maxVolume: 0,
      hoverIndex: -1,
      hoverSnapX: -1,
      hoverPrice: 0,
      gridCount: 0,
      lastClose: 0,
      firstOpen: 0,
      changePct: 0,
      lastPriceY: 0,
      bullCount: 0,
      bearCount: 0,
      emaLasts: [0, 0, 0, 0],
      rsiLast: 50,
      bbUpperLast: 0,
      bbLowerLast: 0,
      wasmProjectUs: 0,
      bodies: this.rBodies.subarray(0, 0),
      wicks: this.rWicks.subarray(0, 0),
      volumes: this.rVols.subarray(0, 0),
      colors: this.rColors.subarray(0, 0),
      emaXy: [
        this.rEmaXy[0].subarray(0, 0),
        this.rEmaXy[1].subarray(0, 0),
        this.rEmaXy[2].subarray(0, 0),
        this.rEmaXy[3].subarray(0, 0),
      ],
      bbUpperXy: this.rBbUpperXy.subarray(0, 0),
      bbLowerXy: this.rBbLowerXy.subarray(0, 0),
      rsiXy: this.rRsiXy.subarray(0, 0),
      gridPrices: this.rGridPrices.subarray(0, 0),
      gridYs: this.rGridYs.subarray(0, 0),
    };
  }

  static async create(
    wasmUrl = `${(import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/"}wasm/candle-engine.wasm`
  ): Promise<CandleEngineWrapper> {
    const imports: WebAssembly.Imports = {
      env: {
        abort: (msg: number, file: number, line: number, col: number) => {
          throw new Error(`WASM abort at ${file}:${line}:${col} (msg=${msg})`);
        },
      },
    };

    let result: WebAssembly.WebAssemblyInstantiatedSource;
    try {
      const response = fetch(wasmUrl);
      result = await WebAssembly.instantiateStreaming(response, imports);
    } catch {
      const resp = await fetch(wasmUrl);
      if (!resp.ok) {
        throw new Error(`Failed to fetch WASM binary: ${resp.status} ${resp.statusText}`);
      }
      const bytes = await resp.arrayBuffer();
      result = await WebAssembly.instantiate(bytes, imports);
    }

    return new CandleEngineWrapper(result.instance);
  }

  get candleCount(): number {
    return this.paramInView.getInt32(ParamInOffset.CANDLE_COUNT, true);
  }

  getOldestTimestamp(): number {
    return this.candleCount > 0 ? this.cTs[0] : 0;
  }

  getLatestTimestamp(): number {
    const c = this.candleCount;
    return c > 0 ? this.cTs[c - 1] : 0;
  }

  loadCandles(
    candles: OhlcvCandle[],
    emaPeriods: EmaPeriodTuple = DEFAULT_PERIODS
  ): number {
    const startIdx = candles.length > this.maxCandles ? candles.length - this.maxCandles : 0;
    const count = candles.length - startIdx;

    for (let i = 0; i < count; i++) {
      const c = candles[startIdx + i];
      this.cTs[i] = c.timestamp;
      this.cOpen[i] = c.open;
      this.cHigh[i] = c.high;
      this.cLow[i] = c.low;
      this.cClose[i] = c.close;
      this.cVol[i] = c.volume;
    }

    this.paramInView.setInt32(ParamInOffset.CANDLE_COUNT, count, true);
    this.exports.computeIndicators(
      emaPeriods[0],
      emaPeriods[1],
      emaPeriods[2],
      emaPeriods[3]
    );
    return count;
  }

  /**
   * Inserta velas históricas anteriores al inicio de la Arena usando memory.copy en WASM (zero-alloc).
   */
  prependCandles(
    candles: OhlcvCandle[],
    emaPeriods: EmaPeriodTuple = DEFAULT_PERIODS
  ): number {
    if (candles.length === 0) return 0;
    const current = this.candleCount;
    const maxInsert = Math.min(candles.length, this.maxCandles - current);
    if (maxInsert <= 0) return 0;

    const sliceStart = candles.length - maxInsert;
    const inserted = this.exports.shiftForPrepend(maxInsert);
    for (let i = 0; i < inserted; i++) {
      const c = candles[sliceStart + i];
      this.cTs[i] = c.timestamp;
      this.cOpen[i] = c.open;
      this.cHigh[i] = c.high;
      this.cLow[i] = c.low;
      this.cClose[i] = c.close;
      this.cVol[i] = c.volume;
    }
    this.exports.computeIndicators(
      emaPeriods[0],
      emaPeriods[1],
      emaPeriods[2],
      emaPeriods[3]
    );
    return inserted;
  }

  appendCandle(candle: OhlcvCandle): number {
    return this.exports.appendCandle(
      candle.timestamp,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      candle.volume
    );
  }

  updateLastTick(high: number, low: number, close: number, volume: number, ts: number): void {
    this.exports.updateLastCandle(high, low, close, volume, ts);
  }

  computeIndicators(emaPeriods: EmaPeriodTuple): void {
    this.exports.computeIndicators(
      emaPeriods[0],
      emaPeriods[1],
      emaPeriods[2],
      emaPeriods[3]
    );
  }

  /**
   * Proyecta el frame actual en la Arena WASM y actualiza la vista FrameProjection reutilizable
   * (zero-alloc en JS: válida síncronamente hasta el siguiente projectFrame).
   */
  projectFrame(vp: ViewportConfig): FrameProjection {
    let flags = 0;
    if (vp.autoScaleY) flags |= EngineFlags.AUTO_SCALE_Y;
    if (vp.emaEnabled) flags |= EngineFlags.EMA_ENABLED;
    if (vp.logScale) flags |= EngineFlags.LOG_SCALE;
    if (vp.heikinAshi) flags |= EngineFlags.HEIKIN_ASHI;
    if (vp.bbEnabled) flags |= EngineFlags.BB_ENABLED;
    if (vp.rsiEnabled) flags |= EngineFlags.RSI_ENABLED;
    if (vp.magnetCrosshair) flags |= EngineFlags.CROSSHAIR_MAGNET;

    const p = this.paramInView;
    p.setFloat32(ParamInOffset.VP_WIDTH, vp.viewportWidth, true);
    p.setFloat32(ParamInOffset.VP_HEIGHT, vp.viewportHeight, true);
    p.setFloat32(ParamInOffset.CHART_LEFT, vp.chartLeft, true);
    p.setFloat32(ParamInOffset.CHART_TOP, vp.chartTop, true);
    p.setFloat32(ParamInOffset.CHART_WIDTH, vp.chartWidth, true);
    p.setFloat32(ParamInOffset.CHART_HEIGHT, vp.chartHeight, true);
    p.setFloat32(ParamInOffset.VOL_TOP, vp.volTop, true);
    p.setFloat32(ParamInOffset.VOL_HEIGHT, vp.volHeight, true);
    p.setFloat32(ParamInOffset.CANDLE_PITCH, vp.candlePitch, true);
    p.setFloat32(ParamInOffset.BODY_WIDTH, vp.bodyWidth, true);
    p.setFloat32(ParamInOffset.SCROLL_RIGHT, vp.scrollRightCandles, true);
    p.setFloat32(ParamInOffset.CURSOR_X, vp.cursorX, true);
    p.setFloat32(ParamInOffset.CURSOR_Y, vp.cursorY, true);
    p.setInt32(ParamInOffset.EMA0_PERIOD, vp.emaPeriods[0], true);
    p.setInt32(ParamInOffset.EMA1_PERIOD, vp.emaPeriods[1], true);
    p.setInt32(ParamInOffset.EMA2_PERIOD, vp.emaPeriods[2], true);
    p.setInt32(ParamInOffset.EMA3_PERIOD, vp.emaPeriods[3], true);
    p.setInt32(ParamInOffset.EMA_MASK, vp.emaMask, true);
    p.setInt32(ParamInOffset.FLAGS, flags, true);
    p.setFloat32(ParamInOffset.MANUAL_MIN, vp.manualMinPrice, true);
    p.setFloat32(ParamInOffset.MANUAL_MAX, vp.manualMaxPrice, true);
    p.setFloat32(ParamInOffset.PADDING_RATIO, vp.paddingRatio, true);
    p.setFloat32(ParamInOffset.DPR, vp.dpr, true);
    p.setFloat32(ParamInOffset.RSI_TOP, vp.rsiTop, true);
    p.setFloat32(ParamInOffset.RSI_HEIGHT, vp.rsiHeight, true);
    p.setInt32(ParamInOffset.BB_PERIOD, vp.bbPeriod, true);
    p.setFloat32(ParamInOffset.BB_STDDEV, vp.bbStdDev, true);

    const t0 = performance.now();
    const visibleCount = this.exports.renderProject();
    const t1 = performance.now();

    const o = this.paramOutView;
    const gridCount = o.getInt32(ParamOutOffset.GRID_COUNT, true);
    const out = this.projectionOut;

    out.visibleStart = o.getInt32(ParamOutOffset.VIS_START, true);
    out.visibleEnd = o.getInt32(ParamOutOffset.VIS_END, true);
    out.visibleCount = visibleCount;
    out.minPrice = o.getFloat32(ParamOutOffset.MIN_PRICE, true);
    out.maxPrice = o.getFloat32(ParamOutOffset.MAX_PRICE, true);
    out.rawLow = o.getFloat32(ParamOutOffset.RAW_LOW, true);
    out.rawHigh = o.getFloat32(ParamOutOffset.RAW_HIGH, true);
    out.maxVolume = o.getFloat32(ParamOutOffset.MAX_VOL, true);
    out.hoverIndex = o.getInt32(ParamOutOffset.HOVER_INDEX, true);
    out.hoverSnapX = o.getFloat32(ParamOutOffset.HOVER_SNAP_X, true);
    out.hoverPrice = o.getFloat32(ParamOutOffset.HOVER_PRICE, true);
    out.gridCount = gridCount;
    out.lastClose = o.getFloat32(ParamOutOffset.LAST_CLOSE, true);
    out.firstOpen = o.getFloat32(ParamOutOffset.FIRST_OPEN, true);
    out.changePct = o.getFloat32(ParamOutOffset.CHANGE_PCT, true);
    out.lastPriceY = o.getFloat32(ParamOutOffset.LAST_PRICE_Y, true);
    out.bullCount = o.getInt32(ParamOutOffset.BULL_COUNT, true);
    out.bearCount = o.getInt32(ParamOutOffset.BEAR_COUNT, true);

    out.emaLasts[0] = o.getFloat32(ParamOutOffset.EMA0_LAST, true);
    out.emaLasts[1] = o.getFloat32(ParamOutOffset.EMA1_LAST, true);
    out.emaLasts[2] = o.getFloat32(ParamOutOffset.EMA2_LAST, true);
    out.emaLasts[3] = o.getFloat32(ParamOutOffset.EMA3_LAST, true);

    out.rsiLast = o.getFloat32(ParamOutOffset.RSI_LAST, true);
    out.bbUpperLast = o.getFloat32(ParamOutOffset.BB_UPPER_LAST, true);
    out.bbLowerLast = o.getFloat32(ParamOutOffset.BB_LOWER_LAST, true);
    out.wasmProjectUs = (t1 - t0) * 1000;

    const xyLen = visibleCount * 2;
    const quadLen = visibleCount * 4;
    out.bodies = this.rBodies.subarray(0, quadLen);
    out.wicks = this.rWicks.subarray(0, quadLen);
    out.volumes = this.rVols.subarray(0, quadLen);
    out.colors = this.rColors.subarray(0, visibleCount);
    out.emaXy[0] = this.rEmaXy[0].subarray(0, xyLen);
    out.emaXy[1] = this.rEmaXy[1].subarray(0, xyLen);
    out.emaXy[2] = this.rEmaXy[2].subarray(0, xyLen);
    out.emaXy[3] = this.rEmaXy[3].subarray(0, xyLen);
    out.bbUpperXy = this.rBbUpperXy.subarray(0, xyLen);
    out.bbLowerXy = this.rBbLowerXy.subarray(0, xyLen);
    out.rsiXy = this.rRsiXy.subarray(0, xyLen);
    out.gridPrices = this.rGridPrices.subarray(0, gridCount);
    out.gridYs = this.rGridYs.subarray(0, gridCount);

    return out;
  }

  getCandleAt(index: number): CandleInspection | null {
    const count = this.candleCount;
    if (index < 0 || index >= count) return null;
    const meta = this.cMeta[index];
    return {
      index,
      timestamp: this.cTs[index],
      open: this.cOpen[index],
      high: this.cHigh[index],
      low: this.cLow[index],
      close: this.cClose[index],
      volume: this.cVol[index],
      emas: [
        this.cEmas[0][index],
        this.cEmas[1][index],
        this.cEmas[2][index],
        this.cEmas[3][index],
      ],
      bbUpper: this.cBbUpper[index],
      bbLower: this.cBbLower[index],
      rsi: this.cRsi[index],
      meta,
      isBullish: (meta & 1) !== 0,
      isDoji: (meta & 2) !== 0,
      isPinbar: (meta & 4) !== 0,
      isEngulfing: (meta & 8) !== 0,
    };
  }

  getTimestampAt(index: number): number {
    if (index < 0 || index >= this.candleCount) return 0;
    return this.cTs[index];
  }

  runBenchmark(iterations = 1000, vp: ViewportConfig): {
    iterations: number;
    totalMs: number;
    meanUs: number;
    p99Us: number;
    fpsCapacity: number;
  } {
    const samples = new Float64Array(iterations);
    for (let i = 0; i < 25; i++) {
      this.projectFrame(vp);
    }

    const totalStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const t0 = performance.now();
      this.exports.renderProject();
      const t1 = performance.now();
      samples[i] = (t1 - t0) * 1000;
    }
    const totalEnd = performance.now();

    samples.sort();
    const totalMs = totalEnd - totalStart;
    const meanUs = (totalMs * 1000) / iterations;
    const p99Us = samples[Math.min(iterations - 1, Math.floor(iterations * 0.99))];
    const fpsCapacity = meanUs > 0 ? Math.round(1_000_000 / meanUs) : 999999;

    return { iterations, totalMs, meanUs, p99Us, fpsCapacity };
  }

  wipe(): void {
    this.exports.secure_wipe();
    this.exports.initEngine();
  }

  getMemoryDiagnostics(): ArenaMemoryDiagnostics {
    const wasmBytes = this.memory.buffer.byteLength;
    return {
      wasmPages: wasmBytes / 65536,
      wasmBytes,
      totalArenaBytes: this.totalArenaBytes,
      maxCandles: this.maxCandles,
      maxVisible: this.maxVisible,
      maxEmas: this.maxEmas,
      bytesPerCandle: this.exports.getBytesPerCandle(),
      loadedCandles: this.candleCount,
      worlds: [
        {
          name: "PARAM_IN",
          ptr: this.exports.getParamInPtr(),
          bytes: this.exports.getParamInSize(),
          role: "Viewport, pitch, cursor, 4 EMA periods/mask, BB & RSI",
        },
        {
          name: "PARAM_OUT",
          ptr: this.exports.getParamOutPtr(),
          bytes: this.exports.getParamOutSize(),
          role: "SIMD min/max, visible range & 4-EMA/RSI telemetry",
        },
        {
          name: "SCRATCH_WORK",
          ptr: this.exports.getScratchWorkPtr(),
          bytes: this.exports.getWorkSize(),
          role: "Bump allocator save/restore scratchpad",
        },
        {
          name: "CANDLES_SOA",
          ptr: this.exports.getCandlesSoaPtr(),
          bytes: this.exports.getCandlesSoaSize(),
          role: "14 aligned SoA lanes × 12,288 candles (57 B)",
        },
        {
          name: "RENDER_OUT",
          ptr: this.exports.getRenderOutPtr(),
          bytes: this.exports.getRenderOutSize(),
          role: "Zero-copy GPU/2D rects, 4 EMAs, BB, RSI & grid",
        },
      ],
    };
  }
}
