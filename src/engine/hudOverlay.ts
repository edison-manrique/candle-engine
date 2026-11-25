import type {
  EmaSlotConfig,
  FrameProjection,
  ViewportConfig,
} from "./constants";
import type { CandleEngineWrapper } from "./CandleEngineWrapper";

export interface ChartThemeColors {
  bg: string;
  gridLine: string;
  axisText: string;
  bull: string;
  bear: string;
  bullVol: string;
  bearVol: string;
  bbLine: string;
  bbFill: string;
  rsiLine: string;
  crosshair: string;
  priceTagBg: string;
  priceTagText: string;
}

export const TERMINAL_THEME: ChartThemeColors = {
  bg: "#090D14",
  gridLine: "rgba(148, 163, 184, 0.09)",
  axisText: "#7C8BA1",
  bull: "#10B981",
  bear: "#EF4444",
  bullVol: "rgba(16, 185, 129, 0.28)",
  bearVol: "rgba(239, 68, 68, 0.28)",
  bbLine: "rgba(168, 85, 247, 0.65)",
  bbFill: "rgba(168, 85, 247, 0.06)",
  rsiLine: "#A78BFA",
  crosshair: "rgba(203, 213, 225, 0.38)",
  priceTagBg: "#1E293B",
  priceTagText: "#F8FAFC",
};

const NF_PRICE_2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const SHARED_DATE = new Date(0);

export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return "0.00";
  const abs = Math.abs(price);
  if (abs >= 1000) return NF_PRICE_2.format(price);
  if (abs >= 1) return price.toFixed(2);
  if (abs >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}

export function formatTimestamp(tsMs: number, timeframe: string): string {
  if (!tsMs) return "";
  SHARED_DATE.setTime(tsMs);
  if (timeframe === "1d" || timeframe === "4h") {
    return `${MONTH_NAMES[SHARED_DATE.getMonth()]} ${SHARED_DATE.getDate()}`;
  }
  const hh = SHARED_DATE.getHours();
  const mm = SHARED_DATE.getMinutes();
  return `${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}`;
}

function formatCrosshairTimestamp(tsMs: number): string {
  SHARED_DATE.setTime(tsMs);
  const mon = MONTH_NAMES[SHARED_DATE.getMonth()];
  const day = SHARED_DATE.getDate();
  const hh = SHARED_DATE.getHours();
  const mm = SHARED_DATE.getMinutes();
  return `${mon} ${day} ${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}`;
}

function getWickCenterX(i: number, proj: FrameProjection): number {
  const base = i * 4;
  return proj.wicks[base] + proj.wicks[base + 2] * 0.5;
}

function drawPolyline(
  ctx: CanvasRenderingContext2D,
  xy: Float32Array,
  count: number,
  color: string,
  width: number
): void {
  if (count < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(xy[0], xy[1]);
  for (let i = 1; i < count; i++) {
    ctx.lineTo(xy[i * 2], xy[i * 2 + 1]);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBollingerBand(
  ctx: CanvasRenderingContext2D,
  upperXy: Float32Array,
  lowerXy: Float32Array,
  count: number
): void {
  if (count < 2) return;
  ctx.save();
  ctx.fillStyle = TERMINAL_THEME.bbFill;
  ctx.beginPath();
  ctx.moveTo(upperXy[0], upperXy[1]);
  for (let i = 1; i < count; i++) {
    ctx.lineTo(upperXy[i * 2], upperXy[i * 2 + 1]);
  }
  for (let i = count - 1; i >= 0; i--) {
    ctx.lineTo(lowerXy[i * 2], lowerXy[i * 2 + 1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawPolyline(ctx, upperXy, count, TERMINAL_THEME.bbLine, 1.1);
  drawPolyline(ctx, lowerXy, count, TERMINAL_THEME.bbLine, 1.1);
}

const FONT_MONO_11 = '500 11px "JetBrains Mono", ui-monospace, monospace';
const FONT_MONO_11_BOLD = '600 11px "JetBrains Mono", ui-monospace, monospace';
const FONT_MONO_10 = '500 10px "JetBrains Mono", ui-monospace, monospace';

export function drawHudOverlay(
  ctx: CanvasRenderingContext2D,
  vp: ViewportConfig,
  proj: FrameProjection,
  engine: CandleEngineWrapper,
  timeframe: string,
  showVolume: boolean,
  emaConfigs: readonly EmaSlotConfig[]
): void {
  const {
    viewportWidth: w,
    chartLeft,
    chartTop,
    chartWidth,
    chartHeight,
    volTop,
    volHeight,
    rsiTop,
    rsiHeight,
    rsiEnabled,
  } = vp;
  const theme = TERMINAL_THEME;

  ctx.lineWidth = 1;
  ctx.font = FONT_MONO_11;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const axisX = chartLeft + chartWidth;
  const hasRsi = rsiEnabled && rsiHeight > 10;
  const bottomY = hasRsi
    ? rsiTop + rsiHeight
    : showVolume
    ? volTop + volHeight
    : chartTop + chartHeight;

  // Horizontal price grid & right axis ticks (batched stroke)
  ctx.strokeStyle = theme.gridLine;
  ctx.fillStyle = theme.axisText;
  ctx.beginPath();
  for (let i = 0; i < proj.gridCount; i++) {
    const y = proj.gridYs[i];
    if (y < chartTop || y > chartTop + chartHeight) continue;
    ctx.moveTo(chartLeft, y + 0.5);
    ctx.lineTo(axisX, y + 0.5);
  }
  ctx.stroke();

  for (let i = 0; i < proj.gridCount; i++) {
    const y = proj.gridYs[i];
    if (y < chartTop || y > chartTop + chartHeight) continue;
    ctx.fillText(formatPrice(proj.gridPrices[i]), axisX + 8, y);
  }

  // Vertical time grid & bottom axis labels (batched stroke)
  const visCount = proj.visibleCount;
  if (visCount > 0) {
    const minLabelSpacingPx = 110;
    const stepCandles = Math.max(
      1,
      Math.ceil(minLabelSpacingPx / Math.max(2, vp.candlePitch))
    );
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const timeY = bottomY + 8;

    ctx.strokeStyle = theme.gridLine;
    ctx.beginPath();
    for (let i = 0; i < visCount; i++) {
      const globalIdx = proj.visibleStart + i;
      if (globalIdx % stepCandles !== 0) continue;
      const x = getWickCenterX(i, proj);
      if (x < chartLeft + 24 || x > axisX - 24) continue;
      const rx = Math.round(x) + 0.5;
      ctx.moveTo(rx, chartTop);
      ctx.lineTo(rx, bottomY);
    }
    ctx.stroke();

    ctx.fillStyle = theme.axisText;
    for (let i = 0; i < visCount; i++) {
      const globalIdx = proj.visibleStart + i;
      if (globalIdx % stepCandles !== 0) continue;
      const x = getWickCenterX(i, proj);
      if (x < chartLeft + 24 || x > axisX - 24) continue;
      const ts = engine.getTimestampAt(globalIdx);
      const label = formatTimestamp(ts, timeframe);
      if (label) {
        ctx.fillText(label, x, timeY);
      }
    }
  }

  // Volume panel divider
  if (showVolume) {
    ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, Math.round(volTop) - 4.5);
    ctx.lineTo(axisX, Math.round(volTop) - 4.5);
    ctx.stroke();
  }

  // Clipped indicator overlays inside main price chart
  if (visCount > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartLeft, chartTop, chartWidth, chartHeight);
    ctx.clip();

    if (vp.bbEnabled) {
      drawBollingerBand(ctx, proj.bbUpperXy, proj.bbLowerXy, visCount);
    }

    if (vp.emaEnabled) {
      for (let slot = 0; slot < 4; slot++) {
        const cfg = emaConfigs[slot];
        if (!cfg || !cfg.enabled) continue;
        drawPolyline(ctx, proj.emaXy[slot], visCount, cfg.color, 1.35);
      }
    }

    ctx.restore();
  }

  // RSI(14) Sub-Panel
  if (hasRsi) {
    ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, Math.round(rsiTop) - 4.5);
    ctx.lineTo(axisX, Math.round(rsiTop) - 4.5);
    ctx.stroke();

    const y70 = Math.round(rsiTop + rsiHeight * 0.3) + 0.5;
    const y50 = Math.round(rsiTop + rsiHeight * 0.5) + 0.5;
    const y30 = Math.round(rsiTop + rsiHeight * 0.7) + 0.5;

    ctx.save();
    ctx.fillStyle = "rgba(167, 139, 250, 0.04)";
    ctx.fillRect(chartLeft, y70, chartWidth, y30 - y70);

    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, y70);
    ctx.lineTo(axisX, y70);
    ctx.moveTo(chartLeft, y30);
    ctx.lineTo(axisX, y30);
    ctx.stroke();

    ctx.strokeStyle = "rgba(148, 163, 184, 0.1)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, y50);
    ctx.lineTo(axisX, y50);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = theme.axisText;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = FONT_MONO_10;
    ctx.fillText("70", axisX + 8, y70);
    ctx.fillText("30", axisX + 8, y30);

    ctx.fillStyle = theme.rsiLine;
    ctx.fillText(`RSI(14) ${proj.rsiLast.toFixed(1)}`, chartLeft + 6, rsiTop + 9);

    if (visCount > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(chartLeft, rsiTop, chartWidth, rsiHeight);
      ctx.clip();
      drawPolyline(ctx, proj.rsiXy, visCount, theme.rsiLine, 1.4);
      ctx.restore();
    }
  }

  // Axis frame lines
  ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
  ctx.beginPath();
  ctx.moveTo(axisX + 0.5, chartTop);
  ctx.lineTo(axisX + 0.5, bottomY);
  ctx.moveTo(chartLeft, bottomY + 0.5);
  ctx.lineTo(axisX, bottomY + 0.5);
  ctx.stroke();

  // Last price horizontal dashed guide + tag
  if (
    proj.visibleCount > 0 &&
    proj.lastPriceY >= chartTop &&
    proj.lastPriceY <= chartTop + chartHeight
  ) {
    const isUp = proj.changePct >= 0;
    const tagColor = isUp ? "#059669" : "#DC2626";
    const y = Math.round(proj.lastPriceY) + 0.5;

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isUp ? "rgba(16, 185, 129, 0.55)" : "rgba(239, 68, 68, 0.55)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(axisX, y);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = tagColor;
    ctx.fillRect(axisX + 2, proj.lastPriceY - 10, w - axisX - 6, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = FONT_MONO_11_BOLD;
    ctx.fillText(formatPrice(proj.lastClose), axisX + 8, proj.lastPriceY);
  }

  // Crosshair snap
  if (
    vp.cursorX >= chartLeft &&
    vp.cursorX <= axisX &&
    vp.cursorY >= chartTop &&
    vp.cursorY <= bottomY
  ) {
    const cx =
      proj.hoverIndex >= 0
        ? Math.round(proj.hoverSnapX) + 0.5
        : Math.round(vp.cursorX) + 0.5;
    const cy = Math.round(vp.cursorY) + 0.5;

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = theme.crosshair;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, chartTop);
    ctx.lineTo(cx, bottomY);
    if (vp.cursorY <= chartTop + chartHeight) {
      ctx.moveTo(chartLeft, cy);
      ctx.lineTo(axisX, cy);
    }
    ctx.stroke();
    ctx.restore();

    if (vp.cursorY <= chartTop + chartHeight && proj.hoverPrice > 0) {
      ctx.fillStyle = theme.priceTagBg;
      ctx.fillRect(axisX + 2, vp.cursorY - 10, w - axisX - 6, 20);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.strokeRect(axisX + 2.5, vp.cursorY - 9.5, w - axisX - 7, 19);
      ctx.fillStyle = theme.priceTagText;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = FONT_MONO_11;
      ctx.fillText(formatPrice(proj.hoverPrice), axisX + 8, vp.cursorY);
    }

    if (proj.hoverIndex >= 0) {
      const ts = engine.getTimestampAt(proj.hoverIndex);
      if (ts > 0) {
        const label = formatCrosshairTimestamp(ts);
        ctx.font = FONT_MONO_11;
        const boxW = Math.max(92, ctx.measureText(label).width + 14);
        const boxY = bottomY + 2;
        const boxX = Math.max(chartLeft, Math.min(axisX - boxW, cx - boxW / 2));

        ctx.fillStyle = theme.priceTagBg;
        ctx.fillRect(boxX, boxY, boxW, 20);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
        ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, 19);
        ctx.fillStyle = theme.priceTagText;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, boxX + boxW / 2, boxY + 10);
      }
    }
  }
}
