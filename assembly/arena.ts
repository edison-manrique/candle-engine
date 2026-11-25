/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  arena.ts — Arena global zero-alloc (< 1 MiB total, 16 páginas WASM fijas)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Reserva TODO en el DATA SEGMENT (`memory.data`): NUNCA heap.alloc, NUNCA
 * memory.grow. Cinco mundos disjuntos empaquetados bajo 1 MiB (16 páginas):
 *
 *   1) PARAM_IN       [0, 2048)           I/O entrada (2 KiB)
 *   2) PARAM_OUT      [2048, 4096)        I/O salida  (2 KiB)
 *   3) SCRATCH_WORK   [4096, 20480)       arena bump save/restore (16 KiB)
 *   4) CANDLES_SOA    [20480, 720896)     SoA 12,288 velas × 57 B (14 carriles, 16B SIMD)
 *   5) RENDER_OUT     [720896, 989952)    Instancias GPU/2D + 4 EMAs + BB + RSI + Grid
 */

// ═══════════════════════════════════════════════════════════════════════════
// TAMAÑOS Y CAPACIDAD ESTÁTICA (< 1 MiB)
// ═══════════════════════════════════════════════════════════════════════════

export const MAX_CANDLES: i32 = 12288; // Múltiplo de 16 para SIMD v128
export const MAX_VISIBLE: i32 = 2560;  // Máximo de velas proyectadas por frame (múltiplo de 16)
export const MAX_GRID_TICKS: i32 = 32; // Máximo de líneas de grilla de precio
export const MAX_EMAS: i32 = 4;        // Hasta 4 EMAs configurables simultáneas

export const PARAM_IN_SIZE: usize = 2048;  // 2 KiB
export const PARAM_OUT_SIZE: usize = 2048; // 2 KiB
export const WORK_SIZE: usize = 16384;     // 16 KiB bump scratch

export const F64_CANDLE_BYTES: usize = (<usize>MAX_CANDLES) << 3; // 98,304 B (16B aligned)
export const F32_CANDLE_BYTES: usize = (<usize>MAX_CANDLES) << 2; // 49,152 B (16B aligned)
export const U8_CANDLE_BYTES: usize = <usize>MAX_CANDLES;         // 12,288 B (16B aligned)

// 1 carril f64 (8 B) + 12 carriles f32 (48 B) + 1 carril u8 meta (1 B) = 57 B / vela
export const BYTES_PER_CANDLE: i32 = 57;
export const CANDLES_SOA_SIZE: usize =
  F64_CANDLE_BYTES + F32_CANDLE_BYTES * 12 + U8_CANDLE_BYTES; // 700,416 B

// Render output SoA / interleaved quad instances (16B aligned)
export const INST_QUAD_BYTES: usize = (<usize>MAX_VISIBLE) << 4;   // 2560 * 16 B = 40,960 B
export const VIS_U8_BYTES: usize = <usize>MAX_VISIBLE;              // 2,560 B (16B aligned)
export const LINE_XY_BYTES: usize = (<usize>MAX_VISIBLE) << 3;      // 2560 * 8 B = 20,480 B
export const GRID_F32_BYTES: usize = (<usize>MAX_GRID_TICKS) << 2;  // 32 * 4 B = 128 B

// 3 quad batches (body/wick/vol) + color u8 + 7 XY polylines (4 EMAs + BB U/L + RSI) + 2 grid f32
export const RENDER_OUT_SIZE: usize =
  INST_QUAD_BYTES * 3 + VIS_U8_BYTES + LINE_XY_BYTES * 7 + GRID_F32_BYTES * 2; // 269,056 B

export const HEADER_WORK_SIZE: usize =
  PARAM_IN_SIZE + PARAM_OUT_SIZE + WORK_SIZE; // 20,480 B

export const TOTAL_ARENA_SIZE: usize =
  HEADER_WORK_SIZE + CANDLES_SOA_SIZE + RENDER_OUT_SIZE; // 989,952 B (< 1 MiB)

// ═══════════════════════════════════════════════════════════════════════════
// RESERVA ÚNICA EN DATA SEGMENT (alineada a 16 bytes para WASM SIMD v128)
// ═══════════════════════════════════════════════════════════════════════════

const ARENA_BASE: usize = memory.data(<i32>TOTAL_ARENA_SIZE, 16);

// ═══════════════════════════════════════════════════════════════════════════
// PUNTEROS COMPILADOS EN TIEMPO DE COMPILACIÓN (Mundos 1..5)
// ═══════════════════════════════════════════════════════════════════════════

export const PARAM_IN_PTR: usize = ARENA_BASE;
export const PARAM_OUT_PTR: usize = ARENA_BASE + PARAM_IN_SIZE;
export const SCRATCH_WORK_PTR: usize = PARAM_OUT_PTR + PARAM_OUT_SIZE;
export const CANDLES_SOA_PTR: usize = SCRATCH_WORK_PTR + WORK_SIZE;
export const RENDER_OUT_PTR: usize = CANDLES_SOA_PTR + CANDLES_SOA_SIZE;

// 14 Carriles SoA de Velas (alineados a 16 bytes)
export const C_TS_PTR: usize = CANDLES_SOA_PTR;
export const C_OPEN_PTR: usize = C_TS_PTR + F64_CANDLE_BYTES;
export const C_HIGH_PTR: usize = C_OPEN_PTR + F32_CANDLE_BYTES;
export const C_LOW_PTR: usize = C_HIGH_PTR + F32_CANDLE_BYTES;
export const C_CLOSE_PTR: usize = C_LOW_PTR + F32_CANDLE_BYTES;
export const C_VOL_PTR: usize = C_CLOSE_PTR + F32_CANDLE_BYTES;
export const C_EMA0_PTR: usize = C_VOL_PTR + F32_CANDLE_BYTES;
export const C_EMA1_PTR: usize = C_EMA0_PTR + F32_CANDLE_BYTES;
export const C_EMA2_PTR: usize = C_EMA1_PTR + F32_CANDLE_BYTES;
export const C_EMA3_PTR: usize = C_EMA2_PTR + F32_CANDLE_BYTES;
export const C_BB_UPPER_PTR: usize = C_EMA3_PTR + F32_CANDLE_BYTES;
export const C_BB_LOWER_PTR: usize = C_BB_UPPER_PTR + F32_CANDLE_BYTES;
export const C_RSI_PTR: usize = C_BB_LOWER_PTR + F32_CANDLE_BYTES;
export const C_META_PTR: usize = C_RSI_PTR + F32_CANDLE_BYTES;

// Carriles de Salida de Renderizado (consumidos zero-copy por WebGL2 / Canvas2D)
export const R_BODY_INST_PTR: usize = RENDER_OUT_PTR;
export const R_WICK_INST_PTR: usize = R_BODY_INST_PTR + INST_QUAD_BYTES;
export const R_VOL_INST_PTR: usize = R_WICK_INST_PTR + INST_QUAD_BYTES;
export const R_COLOR_PTR: usize = R_VOL_INST_PTR + INST_QUAD_BYTES;
export const R_EMA0_XY_PTR: usize = R_COLOR_PTR + VIS_U8_BYTES;
export const R_EMA1_XY_PTR: usize = R_EMA0_XY_PTR + LINE_XY_BYTES;
export const R_EMA2_XY_PTR: usize = R_EMA1_XY_PTR + LINE_XY_BYTES;
export const R_EMA3_XY_PTR: usize = R_EMA2_XY_PTR + LINE_XY_BYTES;
export const R_BB_UPPER_XY_PTR: usize = R_EMA3_XY_PTR + LINE_XY_BYTES;
export const R_BB_LOWER_XY_PTR: usize = R_BB_UPPER_XY_PTR + LINE_XY_BYTES;
export const R_RSI_XY_PTR: usize = R_BB_LOWER_XY_PTR + LINE_XY_BYTES;
export const R_GRID_PRICES_PTR: usize = R_RSI_XY_PTR + LINE_XY_BYTES;
export const R_GRID_YS_PTR: usize = R_GRID_PRICES_PTR + GRID_F32_BYTES;

// ═══════════════════════════════════════════════════════════════════════════
// OFFSETS DE PARAM_IN & PARAM_OUT
// ═══════════════════════════════════════════════════════════════════════════

export const IN_CANDLE_COUNT: usize = 0;        // i32
export const IN_VP_WIDTH: usize = 4;            // f32
export const IN_VP_HEIGHT: usize = 8;           // f32
export const IN_CHART_LEFT: usize = 12;         // f32
export const IN_CHART_TOP: usize = 16;          // f32
export const IN_CHART_WIDTH: usize = 20;        // f32
export const IN_CHART_HEIGHT: usize = 24;       // f32
export const IN_VOL_TOP: usize = 28;            // f32
export const IN_VOL_HEIGHT: usize = 32;         // f32
export const IN_CANDLE_PITCH: usize = 36;       // f32
export const IN_BODY_WIDTH: usize = 40;         // f32
export const IN_SCROLL_RIGHT: usize = 44;       // f32
export const IN_CURSOR_X: usize = 48;           // f32
export const IN_CURSOR_Y: usize = 52;           // f32
export const IN_EMA0_PERIOD: usize = 56;        // i32
export const IN_EMA1_PERIOD: usize = 60;        // i32
export const IN_FLAGS: usize = 64;              // i32
export const IN_MANUAL_MIN: usize = 68;         // f32
export const IN_MANUAL_MAX: usize = 72;         // f32
export const IN_PADDING_RATIO: usize = 76;      // f32
export const IN_DPR: usize = 80;                // f32
export const IN_RSI_TOP: usize = 84;            // f32
export const IN_RSI_HEIGHT: usize = 88;         // f32
export const IN_BB_PERIOD: usize = 92;          // i32
export const IN_BB_STDDEV: usize = 96;          // f32
export const IN_EMA2_PERIOD: usize = 100;       // i32
export const IN_EMA3_PERIOD: usize = 104;       // i32
export const IN_EMA_MASK: usize = 108;          // i32 (bitmask 0..15)

export const OUT_VIS_START: usize = 0;          // i32
export const OUT_VIS_END: usize = 4;            // i32
export const OUT_VIS_COUNT: usize = 8;          // i32
export const OUT_MIN_PRICE: usize = 12;         // f32
export const OUT_MAX_PRICE: usize = 16;         // f32
export const OUT_RAW_LOW: usize = 20;           // f32
export const OUT_RAW_HIGH: usize = 24;          // f32
export const OUT_MAX_VOL: usize = 28;           // f32
export const OUT_HOVER_INDEX: usize = 32;       // i32
export const OUT_HOVER_SNAP_X: usize = 36;      // f32
export const OUT_HOVER_PRICE: usize = 40;       // f32
export const OUT_GRID_COUNT: usize = 44;        // i32
export const OUT_LAST_CLOSE: usize = 48;        // f32
export const OUT_FIRST_OPEN: usize = 52;        // f32
export const OUT_CHANGE_PCT: usize = 56;        // f32
export const OUT_LAST_PRICE_Y: usize = 60;      // f32
export const OUT_BULL_COUNT: usize = 64;        // i32
export const OUT_BEAR_COUNT: usize = 68;        // i32
export const OUT_EMA0_LAST: usize = 72;         // f32
export const OUT_EMA1_LAST: usize = 76;         // f32
export const OUT_RSI_LAST: usize = 80;          // f32
export const OUT_BB_UPPER_LAST: usize = 84;     // f32
export const OUT_BB_LOWER_LAST: usize = 88;     // f32
export const OUT_EMA2_LAST: usize = 92;         // f32
export const OUT_EMA3_LAST: usize = 96;         // f32

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES DE ALINEACIÓN Y ARENA BUMP (Mundo 3: SCRATCH_WORK)
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore
@inline
export function align8(ptr: usize): usize {
  return (ptr + 7) & ~7;
}

// @ts-ignore
@inline
export function align16(ptr: usize): usize {
  return (ptr + 15) & ~15;
}

// @ts-ignore
@final
export class Arena {
  static current: usize = SCRATCH_WORK_PTR;

  // @ts-ignore
  @inline
  static alloc(size: usize): usize {
    const ptr = align8(Arena.current);
    const next = ptr + size;
    if (next > SCRATCH_WORK_PTR + WORK_SIZE) unreachable();
    Arena.current = next;
    return ptr;
  }

  // @ts-ignore
  @inline
  static alloc16(size: usize): usize {
    const ptr = align16(Arena.current);
    const next = ptr + size;
    if (next > SCRATCH_WORK_PTR + WORK_SIZE) unreachable();
    Arena.current = next;
    return ptr;
  }

  // @ts-ignore
  @inline
  static reset(): void {
    Arena.current = SCRATCH_WORK_PTR;
  }

  // @ts-ignore
  @inline
  static save(): usize {
    return Arena.current;
  }

  // @ts-ignore
  @inline
  static restore(savedPtr: usize): void {
    Arena.current = savedPtr;
  }

  // @ts-ignore
  @inline
  static wipe(): void {
    memory.fill(ARENA_BASE, 0, TOTAL_ARENA_SIZE);
    Arena.current = SCRATCH_WORK_PTR;
  }
}

export function secure_wipe(): void {
  Arena.wipe();
}
