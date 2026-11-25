import { For, Show } from "solid-js";
import {
  CRYPTO_MARKETS,
  type CryptoPair,
  type EmaConfigTuple,
  type Timeframe,
} from "../../src/engine";
import { formatPrice } from "../../src/engine/hudOverlay";
import type { CandleInspection, TelemetrySnapshot, Ticker24h } from "../types";
import styles from "../styles/OhlcvHeader.module.css";

interface OhlcvHeaderProps {
  pair: CryptoPair;
  timeframe: Timeframe;
  hoveredCandle: CandleInspection | null;
  ticker24h: Ticker24h | null;
  telemetry: TelemetrySnapshot;
  showEma: boolean;
  emas: EmaConfigTuple;
  showBb: boolean;
}

const EMA_SLOTS: readonly (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

function formatVol(v: number): string {
  if (!Number.isFinite(v)) return "0";
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K`;
  return v.toFixed(2);
}

function formatPattern(c: CandleInspection | null): string | null {
  if (!c) return null;
  if (c.isEngulfing) return "Engulfing";
  if (c.isPinbar) return "Pinbar";
  if (c.isDoji) return "Doji";
  return null;
}

export function OhlcvHeader(props: OhlcvHeaderProps) {
  const c = () => props.hoveredCandle;
  const isUp = () => {
    const candle = c();
    if (candle) return candle.close >= candle.open;
    return (props.ticker24h?.priceChangePercent ?? props.telemetry.changePct) >= 0;
  };

  const changePct = () => {
    const candle = c();
    if (candle && candle.open > 0) {
      return ((candle.close - candle.open) / candle.open) * 100;
    }
    return props.ticker24h?.priceChangePercent ?? props.telemetry.changePct;
  };

  const pattern = () => formatPattern(c());
  const toneClass = () => (isUp() ? styles.bull : styles.bear);

  return (
    <div class={styles.bar}>
      <div class={styles.left}>
        <span class={styles.pairTitle}>{CRYPTO_MARKETS[props.pair].label}</span>
        <span class={styles.sep} aria-hidden="true">·</span>
        <span class={styles.tf}>{props.timeframe}</span>
        <span class={styles.sep} aria-hidden="true">·</span>

        <Show
          when={c()}
          fallback={
            <div class={styles.metrics}>
              <span class={styles.label}>
                Spot{" "}
                <strong class={toneClass()}>
                  {formatPrice(props.ticker24h?.lastPrice ?? props.telemetry.lastClose)}
                </strong>
              </span>
              <span class={toneClass()}>
                {changePct() >= 0 ? "+" : ""}
                {changePct().toFixed(2)}%
              </span>
              <Show when={props.ticker24h}>
                {(t) => (
                  <>
                    <span class={styles.label}>
                      H <span class={styles.val}>{formatPrice(t().highPrice)}</span>
                    </span>
                    <span class={styles.label}>
                      L <span class={styles.val}>{formatPrice(t().lowPrice)}</span>
                    </span>
                    <span class={styles.label}>
                      Vol <span class={styles.val}>${formatVol(t().quoteVolume)}</span>
                    </span>
                  </>
                )}
              </Show>
            </div>
          }
        >
          {(candle) => (
            <div class={styles.metrics}>
              <span class={styles.label}>
                O <span class={toneClass()}>{formatPrice(candle().open)}</span>
              </span>
              <span class={styles.label}>
                H <span class={toneClass()}>{formatPrice(candle().high)}</span>
              </span>
              <span class={styles.label}>
                L <span class={toneClass()}>{formatPrice(candle().low)}</span>
              </span>
              <span class={styles.label}>
                C <span class={toneClass()}>{formatPrice(candle().close)}</span>
              </span>
              <span class={toneClass()}>
                {changePct() >= 0 ? "+" : ""}
                {changePct().toFixed(2)}%
              </span>
              <span class={styles.label}>
                V <span class={styles.val}>{formatVol(candle().volume)}</span>
              </span>
              <Show when={pattern()}>
                {(pat) => <span class={styles.pattern}>{pat()}</span>}
              </Show>
            </div>
          )}
        </Show>
      </div>

      <div class={styles.right}>
        <Show when={props.showEma}>
          <For each={EMA_SLOTS}>
            {(slot) => {
              const cfg = () => props.emas[slot];
              const val = () =>
                c() ? c()!.emas[slot] : props.telemetry.emaLasts[slot];
              return (
                <Show when={cfg().enabled}>
                  <span class={styles.emaItem}>
                    E{cfg().period}{" "}
                    <span style={{ color: cfg().color }}>
                      {formatPrice(val())}
                    </span>
                  </span>
                </Show>
              );
            }}
          </For>
        </Show>
        <Show when={props.showBb}>
          <span class={styles.emaItem}>
            BB{" "}
            <span class={styles.bbVal}>
              {formatPrice(c() ? c()!.bbUpper : props.telemetry.bbUpperLast)}/
              {formatPrice(c() ? c()!.bbLower : props.telemetry.bbLowerLast)}
            </span>
          </span>
        </Show>
        <span class={styles.sep} aria-hidden="true">·</span>
        <span class={styles.emaItem}>
          WASM{" "}
          <span class={styles.val}>
            {props.telemetry.wasmProjectUs.toFixed(0)}µs
          </span>
        </span>
        <span class={styles.emaItem}>
          Draw{" "}
          <span class={styles.val}>
            {props.telemetry.drawUs.toFixed(0)}µs
          </span>
        </span>
      </div>
    </div>
  );
}
