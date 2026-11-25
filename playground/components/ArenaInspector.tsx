import { For, Show } from "solid-js";
import type { ArenaMemoryDiagnostics, BenchmarkSummary, TelemetrySnapshot } from "../types";
import styles from "../styles/ArenaInspector.module.css";

interface ArenaInspectorProps {
  diagnostics: ArenaMemoryDiagnostics | null;
  telemetry: TelemetrySnapshot;
  benchmark: BenchmarkSummary | null;
  benchmarkRunning: boolean;
  onLoadStressMax: () => void;
  onBurstTicks: () => void;
  onRunBenchmark: () => void;
  onWipeAndReload: () => void;
}

const WORLD_CLASS: Record<string, string> = {
  PARAM_IN: styles.colorPARAM_IN,
  PARAM_OUT: styles.colorPARAM_OUT,
  SCRATCH_WORK: styles.colorSCRATCH_WORK,
  CANDLES_SOA: styles.colorCANDLES_SOA,
  RENDER_OUT: styles.colorRENDER_OUT,
};

function formatKb(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

export function ArenaInspector(props: ArenaInspectorProps) {
  const fillPct = () => {
    const d = props.diagnostics;
    if (!d || d.maxCandles === 0) return 0;
    return Math.min(100, (props.telemetry.loadedCandles / d.maxCandles) * 100);
  };

  return (
    <aside class={styles.sidebar}>
      <div class={styles.header}>
        <h2 class={styles.title}>Arena Memory & Stress Lab</h2>
        <p class={styles.subtitle}>
          57 B/candle SoA Arena · 4 EMAs + v128 OHLC/EMA SIMD projection.
        </p>
      </div>

      <div class={styles.body}>
        <section class={styles.section}>
          <h3 class={styles.sectionTitle}>Frame Execution</h3>
          <div class={styles.kpiGrid}>
            <div class={styles.kpiCard}>
              <div class={styles.kpiLabel}>WASM SIMD</div>
              <div class={styles.kpiValue}>
                {props.telemetry.wasmProjectUs.toFixed(1)} µs
              </div>
            </div>
            <div class={styles.kpiCard}>
              <div class={styles.kpiLabel}>GPU / 2D Draw</div>
              <div class={styles.kpiValue}>
                {props.telemetry.drawUs.toFixed(1)} µs
              </div>
            </div>
            <div class={styles.kpiCard}>
              <div class={styles.kpiLabel}>Visible Window</div>
              <div class={styles.kpiValue}>
                {props.telemetry.visibleCount} velas
              </div>
            </div>
            <div class={styles.kpiCard}>
              <div class={styles.kpiLabel}>RSI(14)</div>
              <div class={`${styles.kpiValue} ${styles.kpiRsi}`}>
                {props.telemetry.rsiLast.toFixed(1)}
              </div>
            </div>
          </div>
        </section>

        <Show when={props.diagnostics}>
          {(diag) => (
            <section class={`${styles.section} ${styles.sectionDivided}`}>
              <div class={styles.sectionHeader}>
                <h3 class={styles.sectionTitle}>Static WASM Arena</h3>
                <span class={styles.metaMono}>
                  {diag().wasmPages} pages · {formatKb(diag().totalArenaBytes)}
                </span>
              </div>

              <div class={styles.arenaBar}>
                <For each={diag().worlds}>
                  {(w) => {
                    const pct = () => Math.max(1.5, (w.bytes / diag().totalArenaBytes) * 100);
                    return (
                      <div
                        class={WORLD_CLASS[w.name] || ""}
                        style={{ width: `${pct()}%` }}
                        title={`${w.name}: ${formatKb(w.bytes)}`}
                      />
                    );
                  }}
                </For>
              </div>

              <div class={styles.worldList}>
                <For each={diag().worlds}>
                  {(w) => (
                    <div class={styles.worldRow}>
                      <div class={styles.worldLeft}>
                        <div class={styles.worldNameRow}>
                          <span class={`${styles.swatch} ${WORLD_CLASS[w.name] || ""}`} />
                          <span class={styles.worldName}>{w.name}</span>
                        </div>
                        <div class={styles.worldRole}>{w.role}</div>
                      </div>
                      <div class={styles.worldRight}>
                        <div class={styles.worldBytes}>{formatKb(w.bytes)}</div>
                        <div class={styles.worldPtr}>@{w.ptr}</div>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              <div class={styles.fillWrap}>
                <div class={styles.fillMeta}>
                  <span class={styles.kpiLabel}>SoA Buffer Fill</span>
                  <span class={styles.metaMono}>
                    {props.telemetry.loadedCandles.toLocaleString()} /{" "}
                    {diag().maxCandles.toLocaleString()}
                  </span>
                </div>
                <div class={styles.fillTrack}>
                  <div class={styles.fillBar} style={{ width: `${fillPct()}%` }} />
                </div>
              </div>
            </section>
          )}
        </Show>

        <section class={`${styles.section} ${styles.sectionDivided}`}>
          <h3 class={styles.sectionTitle}>Engine Stress Tests</h3>
          <div class={styles.btnStack}>
            <button
              type="button"
              onClick={() => props.onLoadStressMax()}
              class={styles.actionBtn}
            >
              <span>Load 12,288 Candles (Max SoA)</span>
              <span class={`${styles.tagMono} ${styles.tagBull}`}>684 KiB</span>
            </button>

            <button
              type="button"
              onClick={() => props.onBurstTicks()}
              class={styles.actionBtn}
            >
              <span>Burst +500 Ticks (Compact Test)</span>
              <span class={`${styles.tagMono} ${styles.tagSky}`}>Zero-Alloc</span>
            </button>

            <button
              type="button"
              disabled={props.benchmarkRunning}
              onClick={() => props.onRunBenchmark()}
              class={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              <span>
                {props.benchmarkRunning
                  ? "Running Benchmark..."
                  : "Benchmark 1,000 Frames"}
              </span>
              <span class={styles.tagMono}>SIMD v128</span>
            </button>

            <button
              type="button"
              onClick={() => props.onWipeAndReload()}
              class={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            >
              <span>Arena.wipe() & Reload Binance</span>
              <span class={styles.tagMono}>secure_wipe</span>
            </button>
          </div>

          <Show when={props.benchmark}>
            {(b) => (
              <div class={styles.benchCard}>
                <div class={styles.benchRow}>
                  <span class={styles.kpiLabel}>Iterations</span>
                  <span class={styles.benchVal}>{b().iterations}</span>
                </div>
                <div class={styles.benchRow}>
                  <span class={styles.kpiLabel}>Total Time</span>
                  <span class={styles.benchVal}>{b().totalMs.toFixed(2)} ms</span>
                </div>
                <div class={styles.benchRow}>
                  <span class={styles.kpiLabel}>Mean Frame</span>
                  <span class={styles.benchMean}>{b().meanUs.toFixed(2)} µs</span>
                </div>
                <div class={styles.benchRow}>
                  <span class={styles.kpiLabel}>P99 Frame</span>
                  <span class={styles.benchP99}>{b().p99Us.toFixed(2)} µs</span>
                </div>
                <div class={styles.benchRow}>
                  <span class={styles.kpiLabel}>Throughput</span>
                  <span class={styles.benchFps}>
                    {b().fpsCapacity.toLocaleString()} frames/s
                  </span>
                </div>
              </div>
            )}
          </Show>
        </section>
      </div>
    </aside>
  );
}
