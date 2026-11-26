import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import type {
  EmaPeriodTuple,
  EmaSlotConfig,
  StreamConnectionState,
  Timeframe,
} from "../../src/engine";
import type { ChartSettings, RendererBackend, SidebarTab } from "../types";
import styles from "../styles/ChartToolbar.module.css";

interface ChartToolbarProps {
  settings: ChartSettings;
  sidebarOpen: boolean;
  sidebarTab: SidebarTab;
  streamState: StreamConnectionState;
  backfilling: boolean;
  onTimeframeChange: (tf: Timeframe) => void;
  onToggleSetting: (
    key:
      | "heikinAshi"
      | "logScale"
      | "showEma"
      | "showBb"
      | "showRsi"
      | "showVolume"
      | "magnetCrosshair"
      | "streamActive"
  ) => void;
  onUpdateEma: (slot: 0 | 1 | 2 | 3, patch: Partial<EmaSlotConfig>) => void;
  onApplyEmaPreset: (periods: EmaPeriodTuple) => void;
  onRendererChange: (backend: RendererBackend) => void;
  onSelectSidebarTab: (tab: SidebarTab) => void;
  onToggleSidebar: () => void;
}

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];
const EMA_SLOTS: readonly (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
const EMA_PRESETS: readonly { label: string; periods: EmaPeriodTuple }[] = [
  { label: "9/21/50/200", periods: [9, 21, 50, 200] },
  { label: "7/25/99/200", periods: [7, 25, 99, 200] },
  { label: "12/26/50/100", periods: [12, 26, 50, 100] },
];

export function ChartToolbar(props: ChartToolbarProps) {
  const [emaOpen, setEmaOpen] = createSignal(false);
  let emaWrapRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (!emaOpen()) return;
    const handleOutside = (e: PointerEvent) => {
      if (emaWrapRef && !emaWrapRef.contains(e.target as Node)) {
        setEmaOpen(false);
      }
    };
    window.addEventListener("pointerdown", handleOutside);
    onCleanup(() => window.removeEventListener("pointerdown", handleOutside));
  });

  const enabledEmaCount = () =>
    props.settings.emas.filter((e) => e.enabled).length;

  const streamLabel = () => {
    if (!props.settings.streamActive || props.streamState === "paused") {
      return "Paused";
    }
    if (props.streamState === "connected") return "4 Hz Live";
    if (props.streamState === "reconnecting") return "Reconnecting";
    return "Connecting";
  };

  return (
    <div class={styles.toolbar}>
      <div class={styles.group}>
        <div class={styles.segmented} role="group" aria-label="Timeframe">
          <For each={TIMEFRAMES}>
            {(tf) => (
              <button
                type="button"
                onClick={() => props.onTimeframeChange(tf)}
                class={`${styles.segBtn} ${styles.segBtnMono}`}
                classList={{ [styles.segBtnActive]: props.settings.timeframe === tf }}
              >
                {tf}
              </button>
            )}
          </For>
        </div>

        <div class={styles.divider} aria-hidden="true" />

        <div class={styles.toggles}>
          <button
            type="button"
            onClick={() => props.onToggleSetting("heikinAshi")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActiveBinance]: props.settings.heikinAshi }}
          >
            Heikin-Ashi
          </button>

          <button
            type="button"
            onClick={() => props.onToggleSetting("logScale")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActiveBinance]: props.settings.logScale }}
          >
            Log
          </button>

          <div ref={emaWrapRef} class={styles.emaWrap}>
            <div
              class={styles.emaSplit}
              classList={{ [styles.emaSplitActive]: props.settings.showEma }}
            >
              <button
                type="button"
                onClick={() => props.onToggleSetting("showEma")}
                class={styles.emaMainBtn}
                title="Activar / desactivar EMAs"
              >
                <span>EMAs ({enabledEmaCount()}/4)</span>
                <span class={styles.emaDots} aria-hidden="true">
                  <For each={props.settings.emas}>
                    {(ema) => (
                      <Show when={ema.enabled}>
                        <span
                          class={styles.emaDot}
                          style={{ "background-color": ema.color }}
                        />
                      </Show>
                    )}
                  </For>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEmaOpen((v) => !v)}
                class={styles.emaGearBtn}
                classList={{ [styles.emaGearBtnOpen]: emaOpen() }}
                aria-expanded={emaOpen()}
                aria-label="Configurar hasta 4 EMAs"
                title="Configurar hasta 4 EMAs"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
              </button>
            </div>

            <Show when={emaOpen()}>
              <div class={styles.emaPopover} role="dialog" aria-label="EMA Configuration">
                <div class={styles.popoverHeader}>
                  <span class={styles.popoverTitle}>4 EMAs Configurables (WASM SIMD)</span>
                </div>

                <div class={styles.popoverPresets}>
                  <For each={EMA_PRESETS}>
                    {(preset) => (
                      <button
                        type="button"
                        class={styles.presetBtn}
                        onClick={() => props.onApplyEmaPreset(preset.periods)}
                      >
                        {preset.label}
                      </button>
                    )}
                  </For>
                </div>

                <div class={styles.emaRows}>
                  <For each={EMA_SLOTS}>
                    {(slot) => {
                      const cfg = () => props.settings.emas[slot];
                      return (
                        <div class={styles.emaRow}>
                          <input
                            type="checkbox"
                            class={styles.emaCheck}
                            checked={cfg().enabled}
                            aria-label={`Activar EMA ${slot + 1}`}
                            onChange={(e) =>
                              props.onUpdateEma(slot, {
                                enabled: e.currentTarget.checked,
                              })
                            }
                          />
                          <input
                            type="color"
                            class={styles.colorInput}
                            value={cfg().color}
                            aria-label={`Color EMA ${slot + 1}`}
                            onInput={(e) =>
                              props.onUpdateEma(slot, {
                                color: e.currentTarget.value,
                              })
                            }
                          />
                          <span class={styles.emaSlotLabel}>EMA {slot + 1}</span>
                          <div class={styles.periodWrap}>
                            <span class={styles.periodLabel}>Período</span>
                            <input
                              type="number"
                              min={2}
                              max={500}
                              step={1}
                              class={styles.periodInput}
                              value={cfg().period}
                              aria-label={`Período EMA ${slot + 1}`}
                              onChange={(e) => {
                                const parsed = Math.round(
                                  Number(e.currentTarget.value)
                                );
                                const next = Number.isFinite(parsed)
                                  ? Math.max(2, Math.min(500, parsed))
                                  : cfg().period;
                                e.currentTarget.value = String(next);
                                props.onUpdateEma(slot, { period: next });
                              }}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>

                <div class={styles.popoverNote}>
                  Calculado O(N) en 4 carriles SoA del Arena y proyectado en paralelo con SIMD v128 sin recargar el Order Book.
                </div>
              </div>
            </Show>
          </div>

          <button
            type="button"
            onClick={() => props.onToggleSetting("showBb")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActivePurple]: props.settings.showBb }}
          >
            BB(20,2)
          </button>

          <button
            type="button"
            onClick={() => props.onToggleSetting("showRsi")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActiveViolet]: props.settings.showRsi }}
          >
            RSI(14)
          </button>

          <button
            type="button"
            onClick={() => props.onToggleSetting("showVolume")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActiveSky]: props.settings.showVolume }}
          >
            Vol
          </button>

          <button
            type="button"
            onClick={() => props.onToggleSetting("magnetCrosshair")}
            class={styles.toggleBtn}
            classList={{ [styles.toggleActiveAmber]: props.settings.magnetCrosshair }}
          >
            Magnet
          </button>
        </div>
      </div>

      <div class={styles.rightGroup}>
        {props.backfilling && (
          <span class={styles.backfillStatus}>Loading history...</span>
        )}

        <div class={styles.segmented} role="group" aria-label="Graphics backend">
          <button
            type="button"
            onClick={() => props.onRendererChange("webgl2")}
            class={styles.segBtn}
            classList={{ [styles.segBtnActive]: props.settings.renderer === "webgl2" }}
          >
            WebGL2
          </button>
          <button
            type="button"
            onClick={() => props.onRendererChange("canvas2d")}
            class={styles.segBtn}
            classList={{ [styles.segBtnActive]: props.settings.renderer === "canvas2d" }}
          >
            Canvas2D
          </button>
        </div>

        <button
          type="button"
          onClick={() => props.onToggleSetting("streamActive")}
          class={styles.streamBtn}
          classList={{
            [styles.streamConnected]:
              props.settings.streamActive && props.streamState === "connected",
            [styles.streamConnecting]:
              props.settings.streamActive && props.streamState !== "connected",
          }}
        >
          <span class={styles.streamDot} aria-hidden="true" />
          <span>{streamLabel()}</span>
        </button>

        <div class={styles.segmented}>
          <button
            type="button"
            onClick={() => {
              if (!props.sidebarOpen) props.onToggleSidebar();
              props.onSelectSidebarTab("market");
            }}
            class={styles.segBtn}
            classList={{
              [styles.segBtnActive]:
                props.sidebarOpen && props.sidebarTab === "market",
            }}
          >
            Order Book
          </button>
          <button
            type="button"
            onClick={() => {
              if (!props.sidebarOpen) props.onToggleSidebar();
              props.onSelectSidebarTab("arena");
            }}
            class={styles.segBtn}
            classList={{
              [styles.segBtnActive]:
                props.sidebarOpen && props.sidebarTab === "arena",
            }}
          >
            Arena Lab
          </button>
        </div>
      </div>
    </div>
  );
}
