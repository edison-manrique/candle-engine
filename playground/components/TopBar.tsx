import { For, Show } from "solid-js";
import type { CryptoPair, Ticker24h } from "../../src/engine";
import { formatPrice } from "../../src/engine/hudOverlay";
import styles from "../styles/TopBar.module.css";

interface TopBarProps {
  activePair: CryptoPair;
  tickers: Partial<Record<CryptoPair, Ticker24h>>;
  onSelectPair: (pair: CryptoPair) => void;
  onResetView: () => void;
}

const PAIRS: { id: CryptoPair; base: string; quote: string }[] = [
  { id: "BTCUSDT", base: "BTC", quote: "USDT" },
  { id: "ETHUSDT", base: "ETH", quote: "USDT" },
  { id: "SOLUSDT", base: "SOL", quote: "USDT" },
  { id: "BNBUSDT", base: "BNB", quote: "USDT" },
];

export function TopBar(props: TopBarProps) {
  return (
    <header class={styles.header}>
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          props.onResetView();
        }}
        class={styles.brand}
      >
        <svg
          class={styles.brandMark}
          width="22"
          height="22"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="14" fill="#0B0E11" />
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="12"
            stroke="#2B3139"
            stroke-width="2"
          />
          <line x1="18" y1="18" x2="18" y2="48" stroke="#F6465D" stroke-width="2.5" stroke-linecap="round" />
          <rect x="13" y="25" width="10" height="15" rx="2" fill="#F6465D" />
          <line x1="32" y1="12" x2="32" y2="45" stroke="#0ECB81" stroke-width="2.5" stroke-linecap="round" />
          <rect x="27" y="18" width="10" height="19" rx="2" fill="#0ECB81" />
          <line x1="46" y1="14" x2="46" y2="41" stroke="#0ECB81" stroke-width="2.5" stroke-linecap="round" />
          <rect x="41" y="19" width="10" height="14" rx="2" fill="#0ECB81" />
          <path
            d="M11 46 C22 43, 30 33, 53 20"
            stroke="#F0B90B"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <span class={styles.brandName}>candle-engine</span>
        <span class={styles.brandBadge}>WASM SIMD</span>
      </a>

      <nav class={styles.nav} aria-label="Pares crypto">
        <For each={PAIRS}>
          {(item) => {
            const isActive = () => props.activePair === item.id;
            const t = () => props.tickers[item.id];
            return (
              <button
                type="button"
                onClick={() => props.onSelectPair(item.id)}
                class={styles.pairBtn}
                classList={{ [styles.pairBtnActive]: isActive() }}
              >
                <span class={styles.pairLabel}>
                  <span class={styles.pairBase}>{item.base}</span>
                  <span class={styles.pairQuote}>/{item.quote}</span>
                </span>
                <Show when={t()}>
                  {(ticker) => (
                    <span
                      class={styles.pairPrice}
                      classList={{
                        [styles.bull]: ticker().priceChangePercent >= 0,
                        [styles.bear]: ticker().priceChangePercent < 0,
                      }}
                    >
                      {formatPrice(ticker().lastPrice)}
                    </span>
                  )}
                </Show>
              </button>
            );
          }}
        </For>
      </nav>

      <div class={styles.actions}>
        <button
          type="button"
          onClick={() => props.onResetView()}
          class={styles.resetBtn}
        >
          Reset View
        </button>
      </div>
    </header>
  );
}
