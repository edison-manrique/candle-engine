import {
  MAX_CANDLES,
  MAX_VISIBLE,
  MAX_GRID_TICKS,
  MAX_EMAS,
  BYTES_PER_CANDLE,
  PARAM_IN_SIZE,
  PARAM_OUT_SIZE,
  WORK_SIZE,
  CANDLES_SOA_SIZE,
  RENDER_OUT_SIZE,
  TOTAL_ARENA_SIZE,
  PARAM_IN_PTR,
  PARAM_OUT_PTR,
  SCRATCH_WORK_PTR,
  CANDLES_SOA_PTR,
  RENDER_OUT_PTR,
  C_TS_PTR,
  C_OPEN_PTR,
  C_HIGH_PTR,
  C_LOW_PTR,
  C_CLOSE_PTR,
  C_VOL_PTR,
  C_EMA0_PTR,
  C_EMA1_PTR,
  C_EMA2_PTR,
  C_EMA3_PTR,
  C_BB_UPPER_PTR,
  C_BB_LOWER_PTR,
  C_RSI_PTR,
  C_META_PTR,
  R_BODY_INST_PTR,
  R_WICK_INST_PTR,
  R_VOL_INST_PTR,
  R_COLOR_PTR,
  R_EMA0_XY_PTR,
  R_EMA1_XY_PTR,
  R_EMA2_XY_PTR,
  R_EMA3_XY_PTR,
  R_BB_UPPER_XY_PTR,
  R_BB_LOWER_XY_PTR,
  R_RSI_XY_PTR,
  R_GRID_PRICES_PTR,
  R_GRID_YS_PTR,
  secure_wipe,
} from "./arena";

import {
  initEngine,
  shiftForPrepend,
  appendCandle,
  updateLastCandle,
  computeIndicators,
  renderProject,
} from "./engine";

export {
  initEngine,
  shiftForPrepend,
  appendCandle,
  updateLastCandle,
  computeIndicators,
  renderProject,
  secure_wipe,
};

export function getMaxCandles(): i32 { return MAX_CANDLES; }
export function getMaxVisible(): i32 { return MAX_VISIBLE; }
export function getMaxGridTicks(): i32 { return MAX_GRID_TICKS; }
export function getMaxEmas(): i32 { return MAX_EMAS; }
export function getBytesPerCandle(): i32 { return BYTES_PER_CANDLE; }

export function getParamInSize(): i32 { return <i32>PARAM_IN_SIZE; }
export function getParamOutSize(): i32 { return <i32>PARAM_OUT_SIZE; }
export function getWorkSize(): i32 { return <i32>WORK_SIZE; }
export function getCandlesSoaSize(): i32 { return <i32>CANDLES_SOA_SIZE; }
export function getRenderOutSize(): i32 { return <i32>RENDER_OUT_SIZE; }
export function getTotalArenaSize(): i32 { return <i32>TOTAL_ARENA_SIZE; }

export function getParamInPtr(): usize { return PARAM_IN_PTR; }
export function getParamOutPtr(): usize { return PARAM_OUT_PTR; }
export function getScratchWorkPtr(): usize { return SCRATCH_WORK_PTR; }
export function getCandlesSoaPtr(): usize { return CANDLES_SOA_PTR; }
export function getRenderOutPtr(): usize { return RENDER_OUT_PTR; }

export function getCTsPtr(): usize { return C_TS_PTR; }
export function getCOpenPtr(): usize { return C_OPEN_PTR; }
export function getCHighPtr(): usize { return C_HIGH_PTR; }
export function getCLowPtr(): usize { return C_LOW_PTR; }
export function getCClosePtr(): usize { return C_CLOSE_PTR; }
export function getCVolPtr(): usize { return C_VOL_PTR; }
export function getCEma0Ptr(): usize { return C_EMA0_PTR; }
export function getCEma1Ptr(): usize { return C_EMA1_PTR; }
export function getCEma2Ptr(): usize { return C_EMA2_PTR; }
export function getCEma3Ptr(): usize { return C_EMA3_PTR; }
export function getCBbUpperPtr(): usize { return C_BB_UPPER_PTR; }
export function getCBbLowerPtr(): usize { return C_BB_LOWER_PTR; }
export function getCRsiPtr(): usize { return C_RSI_PTR; }
export function getCMetaPtr(): usize { return C_META_PTR; }

export function getRBodyInstPtr(): usize { return R_BODY_INST_PTR; }
export function getRWickInstPtr(): usize { return R_WICK_INST_PTR; }
export function getRVolInstPtr(): usize { return R_VOL_INST_PTR; }
export function getRColorPtr(): usize { return R_COLOR_PTR; }
export function getREma0XyPtr(): usize { return R_EMA0_XY_PTR; }
export function getREma1XyPtr(): usize { return R_EMA1_XY_PTR; }
export function getREma2XyPtr(): usize { return R_EMA2_XY_PTR; }
export function getREma3XyPtr(): usize { return R_EMA3_XY_PTR; }
export function getRBbUpperXyPtr(): usize { return R_BB_UPPER_XY_PTR; }
export function getRBbLowerXyPtr(): usize { return R_BB_LOWER_XY_PTR; }
export function getRRsiXyPtr(): usize { return R_RSI_XY_PTR; }
export function getRGridPricesPtr(): usize { return R_GRID_PRICES_PTR; }
export function getRGridYsPtr(): usize { return R_GRID_YS_PTR; }
