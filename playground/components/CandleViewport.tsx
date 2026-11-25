import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import {
  buildEmaMask,
  type CandleEngineWrapper,
  type CandleInspection,
  Canvas2DCandleRenderer,
  type ViewportConfig,
  WebGLCandleRenderer,
} from "../../src/engine";
import type { ChartSettings, TelemetrySnapshot } from "../types";
import styles from "../styles/CandleViewport.module.css";

interface CandleViewportProps {
  engine: CandleEngineWrapper | null;
  settings: ChartSettings;
  dataVersion: number;
  resetSignal: number;
  onTelemetry: (snap: TelemetrySnapshot) => void;
  onHoverCandle: (candle: CandleInspection | null) => void;
  onReachLeftEdge: () => void;
  onRegisterViewportAccessor: (getter: () => ViewportConfig | null) => void;
}

export function CandleViewport(props: CandleViewportProps) {
  let containerEl: HTMLDivElement | undefined;
  let glCanvasEl: HTMLCanvasElement | undefined;
  let hudCanvasEl: HTMLCanvasElement | undefined;
  let c2dCanvasEl: HTMLCanvasElement | undefined;

  const [pitch, setPitch] = createSignal(10);
  const [scrollRight, setScrollRight] = createSignal(2.5);
  const [cursorX, setCursorX] = createSignal(-1);
  const [cursorY, setCursorY] = createSignal(-1);
  const [size, setSize] = createSignal({ width: 960, height: 560 });
  const [isDragging, setIsDragging] = createSignal(false);

  let dragStartX = 0;
  let dragStartScroll = 0;
  let webglRenderer: WebGLCandleRenderer | null = null;
  let c2dRenderer: Canvas2DCandleRenderer | null = null;
  let dirty = true;
  let rafId = 0;
  let lastHoverIdx = -2;
  let lastHoverDataVersion = -1;

  const buildViewportConfig = (): ViewportConfig | null => {
    const { width, height } = size();
    if (width < 64 || height < 64) return null;

    const axisRightW = 88;
    const axisBottomH = 28;
    const chartLeft = 10;
    const chartTop = 12;
    const chartWidth = Math.max(40, width - chartLeft - axisRightW);
    const totalPlotH = Math.max(80, height - chartTop - axisBottomH);

    const rsiHeight = props.settings.showRsi ? Math.max(66, Math.floor(totalPlotH * 0.17)) : 0;
    const rsiGap = props.settings.showRsi ? 10 : 0;
    const volHeight = props.settings.showVolume ? Math.max(46, Math.floor(totalPlotH * 0.16)) : 0;
    const volGap = props.settings.showVolume ? 10 : 0;

    const chartHeight = Math.max(40, totalPlotH - volHeight - volGap - rsiHeight - rsiGap);
    const volTop = chartTop + chartHeight + volGap;
    const rsiTop = volTop + volHeight + rsiGap;

    const p = pitch();
    const bodyWidth = p <= 3 ? Math.max(1, p * 0.72) : Math.max(1.5, Math.floor(p * 0.7));
    const emas = props.settings.emas;

    return {
      viewportWidth: width,
      viewportHeight: height,
      chartLeft,
      chartTop,
      chartWidth,
      chartHeight,
      volTop,
      volHeight,
      rsiTop,
      rsiHeight,
      candlePitch: p,
      bodyWidth,
      scrollRightCandles: scrollRight(),
      cursorX: cursorX(),
      cursorY: cursorY(),
      emaPeriods: [emas[0].period, emas[1].period, emas[2].period, emas[3].period],
      emaMask: buildEmaMask(emas),
      bbPeriod: 20,
      bbStdDev: 2.0,
      autoScaleY: true,
      emaEnabled: props.settings.showEma,
      bbEnabled: props.settings.showBb,
      rsiEnabled: props.settings.showRsi,
      logScale: props.settings.logScale,
      heikinAshi: props.settings.heikinAshi,
      magnetCrosshair: props.settings.magnetCrosshair,
      manualMinPrice: 0,
      manualMaxPrice: 1,
      paddingRatio: 0.08,
      dpr: Math.min(2, window.devicePixelRatio || 1),
    };
  };

  onMount(() => {
    props.onRegisterViewportAccessor(() => buildViewportConfig());

    if (glCanvasEl && hudCanvasEl) {
      try {
        webglRenderer = new WebGLCandleRenderer(glCanvasEl, hudCanvasEl);
      } catch {
        webglRenderer = null;
      }
    }
    if (c2dCanvasEl) {
      try {
        c2dRenderer = new Canvas2DCandleRenderer(c2dCanvasEl);
      } catch {
        c2dRenderer = null;
      }
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({
          width: Math.max(120, Math.floor(cr.width)),
          height: Math.max(180, Math.floor(cr.height)),
        });
        dirty = true;
      }
    });
    if (containerEl) {
      ro.observe(containerEl);
    }

    let lastTelemetryTs = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const engine = props.engine;
      if (!engine || !dirty) return;
      dirty = false;

      const vp = buildViewportConfig();
      if (!vp) return;

      const proj = engine.projectFrame(vp);

      let drawUs = 0;
      const useWebgl = props.settings.renderer === "webgl2" && webglRenderer !== null;
      if (useWebgl && webglRenderer) {
        drawUs = webglRenderer.render(
          vp,
          proj,
          engine,
          props.settings.timeframe,
          props.settings.showVolume,
          props.settings.emas
        );
      } else if (c2dRenderer) {
        drawUs = c2dRenderer.render(
          vp,
          proj,
          engine,
          props.settings.timeframe,
          props.settings.showVolume,
          props.settings.emas
        );
      }

      // Only inspect & emit hover candle when index or candle data version actually changed
      const dv = props.dataVersion;
      if (proj.hoverIndex !== lastHoverIdx || (proj.hoverIndex >= 0 && dv !== lastHoverDataVersion)) {
        lastHoverIdx = proj.hoverIndex;
        lastHoverDataVersion = dv;
        props.onHoverCandle(
          proj.hoverIndex >= 0 ? engine.getCandleAt(proj.hoverIndex) : null
        );
      }

      if (proj.visibleStart <= 8 && engine.candleCount < engine.maxCandles) {
        props.onReachLeftEdge();
      }

      // Emitir telemetría cada 250 ms (4 actualizaciones por segundo)
      if (now - lastTelemetryTs >= 250) {
        lastTelemetryTs = now;
        props.onTelemetry({
          wasmProjectUs: proj.wasmProjectUs,
          drawUs,
          visibleCount: proj.visibleCount,
          visibleStart: proj.visibleStart,
          visibleEnd: proj.visibleEnd,
          loadedCandles: engine.candleCount,
          bullCount: proj.bullCount,
          bearCount: proj.bearCount,
          lastClose: proj.lastClose,
          changePct: proj.changePct,
          emaLasts: [
            proj.emaLasts[0],
            proj.emaLasts[1],
            proj.emaLasts[2],
            proj.emaLasts[3],
          ],
          rsiLast: proj.rsiLast,
          bbUpperLast: proj.bbUpperLast,
          bbLowerLast: proj.bbLowerLast,
        });
      }
    };

    rafId = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      webglRenderer?.dispose();
    });
  });

  createEffect(() => {
    void props.engine;
    void props.dataVersion;
    void props.settings.pair;
    void props.settings.timeframe;
    void props.settings.heikinAshi;
    void props.settings.logScale;
    void props.settings.showEma;
    void props.settings.emas;
    void props.settings.showBb;
    void props.settings.showRsi;
    void props.settings.showVolume;
    void props.settings.magnetCrosshair;
    void props.settings.renderer;
    void pitch();
    void scrollRight();
    void cursorX();
    void cursorY();
    void size();
    dirty = true;
  });

  createEffect(() => {
    const sig = props.resetSignal;
    if (sig > 0) {
      setPitch(10);
      setScrollRight(2.5);
      dirty = true;
    }
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartX = e.clientX;
    dragStartScroll = scrollRight();
  };

  const handlePointerMove = (e: PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorX(x);
    setCursorY(y);

    if (isDragging()) {
      const dx = e.clientX - dragStartX;
      const p = pitch();
      const total = props.engine?.candleCount ?? 0;
      const nextScroll = dragStartScroll + dx / p;
      const clamped = Math.max(-18, Math.min(Math.max(10, total - 4), nextScroll));
      setScrollRight(clamped);
    }
    dirty = true;
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (isDragging()) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(false);
    }
  };

  const handlePointerLeave = () => {
    setCursorX(-1);
    setCursorY(-1);
    if (lastHoverIdx !== -1) {
      lastHoverIdx = -1;
      props.onHoverCandle(null);
    }
    dirty = true;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const vp = buildViewportConfig();
    if (!vp) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      const deltaPx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const total = props.engine?.candleCount ?? 0;
      const nextScroll = scrollRight() - deltaPx / pitch();
      setScrollRight(Math.max(-18, Math.min(Math.max(10, total - 4), nextScroll)));
      dirty = true;
      return;
    }

    const oldPitch = pitch();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newPitch = Math.max(2.2, Math.min(44, oldPitch * zoomFactor));
    if (Math.abs(newPitch - oldPitch) < 0.001) return;

    const rightMarginPx = vp.chartLeft + vp.chartWidth - oldPitch * 0.5;
    const oldLastCenterX = rightMarginPx + scrollRight() * oldPitch;
    const candlesFromLast = (oldLastCenterX - x) / oldPitch;

    const newRightMarginPx = vp.chartLeft + vp.chartWidth - newPitch * 0.5;
    const newLastCenterX = x + candlesFromLast * newPitch;
    const newScroll = (newLastCenterX - newRightMarginPx) / newPitch;

    setPitch(newPitch);
    setScrollRight(Math.max(-18, newScroll));
    dirty = true;
  };

  const handleDblClick = () => {
    setPitch(10);
    setScrollRight(2.5);
    dirty = true;
  };

  const isWebgl = () => props.settings.renderer === "webgl2";

  return (
    <div
      ref={containerEl}
      class={styles.viewport}
      classList={{ [styles.dragging]: isDragging() }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      onDblClick={handleDblClick}
    >
      <canvas
        ref={glCanvasEl}
        class={styles.canvas}
        classList={{ [styles.hidden]: !isWebgl() }}
      />
      <canvas
        ref={hudCanvasEl}
        class={`${styles.canvas} ${styles.hudCanvas}`}
        classList={{ [styles.hidden]: !isWebgl() }}
      />
      <canvas
        ref={c2dCanvasEl}
        class={styles.canvas}
        classList={{ [styles.hidden]: isWebgl() }}
      />
    </div>
  );
}
