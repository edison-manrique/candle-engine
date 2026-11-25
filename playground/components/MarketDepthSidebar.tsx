import { For, Show } from "solid-js";
import type { AggTradeItem, OrderBookSnapshot } from "../types";
import { formatPrice } from "../../src/engine/hudOverlay";
import styles from "../styles/MarketDepthSidebar.module.css";

interface MarketDepthSidebarProps {
  orderBook: OrderBookSnapshot | null;
  trades: AggTradeItem[];
  lastPrice: number;
  tickStep: number;
  canDecreaseTick: boolean;
  canIncreaseTick: boolean;
  onDecreaseTick: () => void;
  onIncreaseTick: () => void;
}

function formatQty(q: number): string {
  if (!Number.isFinite(q)) return "0";
  if (q >= 1000) return q.toFixed(1);
  if (q >= 10) return q.toFixed(3);
  return q.toFixed(4);
}

const BUCKET_FORMATTERS = [
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
] as const;

function formatBucketPrice(price: number, step: number): string {
  if (!Number.isFinite(price)) return "0";
  const decimals = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return BUCKET_FORMATTERS[decimals].format(price);
}

function formatTradeTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function MarketDepthSidebar(props: MarketDepthSidebarProps) {
  const asksReversed = () => {
    const book = props.orderBook;
    if (!book) return [];
    return [...book.asks].slice(0, 10).reverse();
  };

  const bids = () => {
    const book = props.orderBook;
    if (!book) return [];
    return book.bids.slice(0, 10);
  };

  const maxDepthTotal = () => {
    const book = props.orderBook;
    if (!book) return 1;
    const maxAsk = book.asks.length > 0 ? book.asks[Math.min(9, book.asks.length - 1)].total : 0;
    const maxBid = book.bids.length > 0 ? book.bids[Math.min(9, book.bids.length - 1)].total : 0;
    return Math.max(1e-9, maxAsk, maxBid);
  };

  const spread = () => {
    const book = props.orderBook;
    if (!book || book.bestAsk <= 0 || book.bestBid <= 0) return null;
    const diff = book.bestAsk - book.bestBid;
    const bps = (diff / book.bestBid) * 10000;
    return { diff, bps };
  };

  return (
    <aside class={styles.sidebar}>
      <div class={styles.header}>
        <h2 class={styles.title}>Order Book (L2)</h2>
        <div class={styles.depthControls} aria-label="Order book depth grouping">
          <button
            type="button"
            class={styles.stepBtn}
            disabled={!props.canDecreaseTick}
            onClick={() => props.onDecreaseTick()}
            title="Reducir agrupacion (mayor precision)"
            aria-label="Decrease depth grouping"
          >
            -
          </button>
          <span class={styles.tickVal}>{props.tickStep}</span>
          <button
            type="button"
            class={styles.stepBtn}
            disabled={!props.canIncreaseTick}
            onClick={() => props.onIncreaseTick()}
            title="Aumentar agrupacion (mayor profundidad)"
            aria-label="Increase depth grouping"
          >
            +
          </button>
        </div>
      </div>

      <div class={styles.bookSection}>
        <div class={styles.cols3}>
          <span>Price (USDT)</span>
          <span class={styles.alignRight}>Size</span>
          <span class={styles.alignRight}>Total</span>
        </div>

        <Show
          when={props.orderBook}
          fallback={<div class={styles.emptyState}>Loading depth snapshot...</div>}
        >
          <div class={styles.rows}>
            <For each={asksReversed()}>
              {(row) => {
                const widthPct = () => Math.min(100, (row.total / maxDepthTotal()) * 100);
                return (
                  <div class={styles.depthRow}>
                    <div class={styles.depthFillAsk} style={{ width: `${widthPct()}%` }} />
                    <span class={`${styles.rel} ${styles.askPrice}`}>
                      {formatBucketPrice(row.price, props.tickStep)}
                    </span>
                    <span class={`${styles.rel} ${styles.qtyText}`}>
                      {formatQty(row.qty)}
                    </span>
                    <span class={`${styles.rel} ${styles.totalText}`}>
                      {formatQty(row.total)}
                    </span>
                  </div>
                );
              }}
            </For>

            <div class={styles.midBar}>
              <span class={styles.midPrice}>{formatPrice(props.lastPrice)}</span>
              <Show when={spread()}>
                {(sp) => (
                  <span class={styles.midSpread}>
                    Spread {formatPrice(sp().diff)} ({sp().bps.toFixed(2)} bps)
                  </span>
                )}
              </Show>
            </div>

            <For each={bids()}>
              {(row) => {
                const widthPct = () => Math.min(100, (row.total / maxDepthTotal()) * 100);
                return (
                  <div class={styles.depthRow}>
                    <div class={styles.depthFillBid} style={{ width: `${widthPct()}%` }} />
                    <span class={`${styles.rel} ${styles.bidPrice}`}>
                      {formatBucketPrice(row.price, props.tickStep)}
                    </span>
                    <span class={`${styles.rel} ${styles.qtyText}`}>
                      {formatQty(row.qty)}
                    </span>
                    <span class={`${styles.rel} ${styles.totalText}`}>
                      {formatQty(row.total)}
                    </span>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
      </div>

      <div class={styles.header}>
        <h3 class={styles.title}>Recent Trades (aggTrade)</h3>
        <span class={styles.spreadMeta}>{props.trades.length}</span>
      </div>

      <div class={styles.tradesSection}>
        <div class={styles.cols4}>
          <span>Price</span>
          <span>Side</span>
          <span class={styles.alignRight}>Qty</span>
          <span class={styles.alignRight}>Time</span>
        </div>

        <Show
          when={props.trades.length > 0}
          fallback={<div class={styles.emptyState}>Waiting for trades...</div>}
        >
          <div class={styles.rows}>
            <For each={props.trades}>
              {(tr) => {
                const isBuy = () => !tr.isBuyerMaker;
                return (
                  <div class={styles.tradeRow}>
                    <span class={isBuy() ? styles.bidPrice : styles.askPrice}>
                      {formatPrice(tr.price)}
                    </span>
                    <span class={isBuy() ? styles.bidPrice : styles.askPrice}>
                      {isBuy() ? "Buy" : "Sell"}
                    </span>
                    <span class={styles.qtyText}>{formatQty(tr.qty)}</span>
                    <span class={styles.timeText}>{formatTradeTime(tr.time)}</span>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </aside>
  );
}
