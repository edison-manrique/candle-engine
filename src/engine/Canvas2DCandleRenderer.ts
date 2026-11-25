import type { EmaSlotConfig, FrameProjection, ViewportConfig } from "./constants";
import type { CandleEngineWrapper } from "./CandleEngineWrapper";
import { drawHudOverlay, TERMINAL_THEME } from "./hudOverlay";

export class Canvas2DCandleRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Canvas2D context unavailable");
    }
    this.ctx = ctx;
  }

  render(
    vp: ViewportConfig,
    proj: FrameProjection,
    engine: CandleEngineWrapper,
    timeframe: string,
    showVolume: boolean,
    emaConfigs: readonly EmaSlotConfig[]
  ): number {
    const t0 = performance.now();
    const ctx = this.ctx;
    const { viewportWidth: w, viewportHeight: h, dpr } = vp;

    const pixelW = Math.max(1, Math.floor(w * dpr));
    const pixelH = Math.max(1, Math.floor(h * dpr));
    if (ctx.canvas.width !== pixelW || ctx.canvas.height !== pixelH) {
      ctx.canvas.width = pixelW;
      ctx.canvas.height = pixelH;
    }

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = TERMINAL_THEME.bg;
    ctx.fillRect(0, 0, w, h);

    const n = proj.visibleCount;
    if (n > 0) {
      const bottomArea = showVolume ? vp.volTop + vp.volHeight : vp.chartTop + vp.chartHeight;
      ctx.save();
      ctx.beginPath();
      ctx.rect(vp.chartLeft, vp.chartTop, vp.chartWidth, bottomArea - vp.chartTop);
      ctx.clip();

      const { bodies, wicks, volumes, colors } = proj;

      for (let pass = 1; pass >= 0; pass--) {
        if (showVolume) {
          ctx.fillStyle = pass === 1 ? TERMINAL_THEME.bullVol : TERMINAL_THEME.bearVol;
          for (let i = 0; i < n; i++) {
            if ((colors[i] & 1) !== pass) continue;
            const o = i * 4;
            ctx.fillRect(volumes[o], volumes[o + 1], volumes[o + 2], volumes[o + 3]);
          }
        }

        ctx.fillStyle = pass === 1 ? TERMINAL_THEME.bull : TERMINAL_THEME.bear;
        for (let i = 0; i < n; i++) {
          if ((colors[i] & 1) !== pass) continue;
          const o = i * 4;
          ctx.fillRect(wicks[o], wicks[o + 1], wicks[o + 2], wicks[o + 3]);
          ctx.fillRect(bodies[o], bodies[o + 1], bodies[o + 2], bodies[o + 3]);
        }
      }

      ctx.restore();
    }

    drawHudOverlay(ctx, vp, proj, engine, timeframe, showVolume, emaConfigs);
    ctx.restore();

    const t1 = performance.now();
    return (t1 - t0) * 1000;
  }
}
