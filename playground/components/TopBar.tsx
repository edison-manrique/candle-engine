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

const PAIRS: { id: CryptoPair; label: string }[] = [
  { id: "BTCUSDT", label: "BTC/USDT" },
  { id: "ETHUSDT", label: "ETH/USDT" },
  { id: "SOLUSDT", label: "SOL/USDT" },
  { id: "BNBUSDT", label: "BNB/USDT" },
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
        candle-engine
      </a>

      <nav class={styles.nav} aria-label="Crypto pairs">
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
                <span>{item.label}</span>
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
