# candle-engine

Motor gráfico financiero de velas japonesas de alto rendimiento escrito en **AssemblyScript (WebAssembly + SIMD `v128`)** con **Arena global zero-alloc (< 1 MiB, 16 páginas WASM fijas)**, wrapper TypeScript *zero-copy*, renderizadores **WebGL2 Instanced** y **Canvas2D**, conexión en vivo con **Binance REST + WebSocket a 4 Hz (250 ms)** y playground modular en **SolidJS + CSS Modules nativos**.

**Autor:** Edison Manrique Chocce

---

## Características principales

- **Arena global estática zero-alloc (`assembly/arena.ts`)**: reserva única en *data segment* (`memory.data(..., 16)`), sin `heap.alloc` ni `memory.grow`, dividida en 5 mundos disjuntos alineados a 16 bytes dentro de **989,952 B** (< 1 MiB / 16 páginas fijas):
  1. `PARAM_IN` (2 KiB): parámetros de viewport, zoom, desplazamiento, cursor, banderas y configuración de indicadores.
  2. `PARAM_OUT` (2 KiB): métricas proyectadas, rango visible, min/max SIMD, precios de grilla y últimos valores de indicadores.
  3. `SCRATCH_WORK` (16 KiB): *bump allocator* con `Arena.save()` / `Arena.restore()` para cómputo temporal por frame.
  4. `CANDLES_SOA` (684 KiB): estructura *Structure of Arrays* para **12,288 velas × 57 B** en 14 carriles alineados (`TS` `f64`, `OHLCV`, `EMA0..EMA3`, `BB_UPPER/LOWER`, `RSI` `f32` y `META` `u8`).
  5. `RENDER_OUT` (262.8 KiB): rectángulos instanciados para cuerpos, mechas y volumen (hasta **2,560 velas visibles**), polilíneas XY para 4 EMAs, Bollinger Bands y RSI, además de ticks de grilla.
- **Aceleración WASM SIMD `v128` (`assembly/engine.ts`)**:
  - Escaneo paralelo `f32x4.min` / `f32x4.max` para `LOW`, `HIGH`, `VOL`, Bollinger Bands y las EMAs activas.
  - Proyección lineal vectorizada simultánea de `[O, H, L, C]` y de las **4 EMAs `[EMA0..EMA3]`** a coordenadas de pantalla.
  - Cálculo O(1) incremental de **Wilder RSI(14)** y EMAs en cada tick en vivo, Bollinger Bands `(20, 2)` en ventana deslizante, velas **Heikin-Ashi**, escala **Logarítmica** y detección automática de patrones (`Doji`, `Pinbar`, `Engulfing`).
- **Wrapper TypeScript Zero-Copy y Renderizadores (`src/engine/`)**:
  - `CandleEngineWrapper`: vistas `TypedArray` directas sobre `wasm.memory.buffer` y objeto `FrameProjection` reutilizable por frame sin presión de GC.
  - `WebGLCandleRenderer`: renderizado por lotes mediante `drawArraysInstanced` compartiendo un único upload por frame del buffer de color/meta (`metaBuf`).
  - `Canvas2DCandleRenderer` y `hudOverlay`: trazado agrupado de grilla, ejes con formato numérico cacheado y lookup de fechas O(1).
- **Datos reales de mercado Binance (`src/engine/binanceClient.ts`)**:
  - Klines históricos (`fetchBinanceKlines`) con carga incremental (*backfill*) al desplazarse al borde izquierdo usando `shiftForPrepend` en WASM.
  - Libro de órdenes L2 de 500 niveles (`@depth@100ms`) con agrupación de profundidad configurable (`-` / `+`) y cinta de operaciones `aggTrade`.
  - Stream WebSocket multiplexado con *flush* consolidado cada **250 ms (4 actualizaciones/s)** y cambio de temporalidad en caliente sin recargar el Order Book.
- **Playground modular en SolidJS (`playground/`)**:
  - Interfaz 100% en CSS Modules nativos dentro de `playground/styles/` (sin librerías externas de UI ni CSS).
  - Soporte hasta para **4 EMAs configurables** (activación independiente, color, período `2–500` y presets rápidos).
  - **Arena Lab** integrado para pruebas de estrés (12,288 velas, ráfaga de +500 ticks, benchmark de 1,000 frames y `Arena.wipe()`).

---

## Estructura del proyecto

```text
├── asconfig.json                # Perfiles release/debug y flags SIMD/memoria fija para asc
├── assembly/
│   ├── arena.ts                 # Arena estática de 5 mundos y carriles SoA/RENDER_OUT
│   ├── engine.ts                # Núcleo matemático, SIMD v128 e indicadores
│   ├── index.ts                 # Exportaciones WASM y punteros de Arena
│   └── tsconfig.json            # Configuración de tipos para AssemblyScript
├── src/engine/
│   ├── CandleEngineWrapper.ts   # Wrapper TypeScript zero-copy sobre memoria WASM
│   ├── WebGLCandleRenderer.ts   # Renderizador WebGL2 instanciado
│   ├── Canvas2DCandleRenderer.ts# Renderizador Canvas2D por lotes
│   ├── hudOverlay.ts            # Grilla, ejes, EMAs, BB, RSI y crosshair con imán
│   ├── binanceClient.ts         # API REST + WebSocket multiplexado (4 Hz) y Order Book L2
│   ├── constants.ts             # Banderas, offsets ABI y configuración de 4 EMAs
│   ├── cryptoFeed.ts            # Definición de mercados y generador sintético de respaldo
│   └── index.ts                 # Punto de entrada de la librería
├── playground/
│   ├── App.tsx                  # Orquestación reactiva desacoplada en SolidJS
│   ├── components/              # TopBar, ChartToolbar, OhlcvHeader, CandleViewport, etc.
│   └── styles/                  # Estilos globales y CSS Modules dedicados
└── .github/workflows/deploy.yml # Despliegue automático a GitHub Pages
```

---

## Scripts y desarrollo local

```bash
# Instalar dependencias
npm install

# Compilar el módulo WASM en modo release (usa asconfig.json)
npm run build:wasm

# Compilar el módulo WASM con mapas de depuración
npm run build:wasm:debug

# Iniciar servidor de desarrollo en el puerto 3000
npm run dev

# Verificar tipos TypeScript (SolidJS + Engine)
npm run lint

# Compilar WASM + bundle de producción en ./dist
npm run build
```

---

## Configuración WASM (`asconfig.json`)

La compilación del motor WebAssembly se controla desde `asconfig.json` con dos objetivos:

- **`release`**: `optimizeLevel: 3`, `shrinkLevel: 0`, `converge: true`, `noAssert: true`, salida en `public/wasm/candle-engine.wasm` y `.wat`.
- **`debug`**: `sourceMap: true`, `debug: true`, salida en `public/wasm/candle-engine.debug.wasm`.
- **Opciones globales**: `--enable simd`, `--runtime stub`, `initialMemory: 16`, `maximumMemory: 16`.

---

## Despliegue en GitHub Pages

El repositorio incluye el workflow `.github/workflows/deploy.yml` que ejecuta automáticamente:

1. Instalación de dependencias y verificación de tipos (`npm run lint`).
2. Compilación de AssemblyScript + Vite inyectando `VITE_BASE_PATH` con el `base_path` de GitHub Pages.
3. Publicación del directorio `./dist` mediante `actions/deploy-pages@v4`.
