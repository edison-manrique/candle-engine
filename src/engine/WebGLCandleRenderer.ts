import type { EmaSlotConfig, FrameProjection, ViewportConfig } from "./constants";
import type { CandleEngineWrapper } from "./CandleEngineWrapper";
import { drawHudOverlay } from "./hudOverlay";

const VERT_SRC = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aUnitQuad;     // [0..1, 0..1]
layout(location = 1) in vec4 aRect;         // [x, y, w, h] in CSS px
layout(location = 2) in uint aMeta;         // bit 0 = bullish

uniform vec2 uViewport;
uniform vec4 uBullColor;
uniform vec4 uBearColor;

out vec4 vColor;

void main() {
  vec2 px = aRect.xy + aUnitQuad * aRect.zw;
  vec2 ndc = (px / uViewport) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
  vColor = (aMeta & 1u) == 1u ? uBullColor : uBearColor;
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

in vec4 vColor;
out vec4 fragColor;

void main() {
  fragColor = vColor;
}
`;

const BULL_VOL: readonly [number, number, number, number] = [0.063, 0.725, 0.506, 0.28];
const BEAR_VOL: readonly [number, number, number, number] = [0.937, 0.267, 0.267, 0.28];
const BULL_WICK: readonly [number, number, number, number] = [0.063, 0.725, 0.506, 0.92];
const BEAR_WICK: readonly [number, number, number, number] = [0.937, 0.267, 0.267, 0.92];
const BULL_BODY: readonly [number, number, number, number] = [0.063, 0.725, 0.506, 1.0];
const BEAR_BODY: readonly [number, number, number, number] = [0.937, 0.267, 0.267, 1.0];

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create WebGL2 shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader) || "Shader compile error";
    gl.deleteShader(shader);
    throw new Error(err);
  }
  return shader;
}

export class WebGLCandleRenderer {
  private gl: WebGL2RenderingContext;
  private hudCtx: CanvasRenderingContext2D;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private quadBuf: WebGLBuffer;
  private rectBuf: WebGLBuffer;
  private metaBuf: WebGLBuffer;

  private uViewport: WebGLUniformLocation | null;
  private uBullColor: WebGLUniformLocation | null;
  private uBearColor: WebGLUniformLocation | null;

  private capacityInstances = 3072;

  constructor(glCanvas: HTMLCanvasElement, hudCanvas: HTMLCanvasElement) {
    const gl = glCanvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      throw new Error("WebGL2 context unavailable");
    }
    const hudCtx = hudCanvas.getContext("2d");
    if (!hudCtx) {
      throw new Error("2D HUD context unavailable");
    }

    this.gl = gl;
    this.hudCtx = hudCtx;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const prog = gl.createProgram();
    if (!prog) throw new Error("Failed to create WebGL2 program");
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "Program link error");
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = prog;

    this.uViewport = gl.getUniformLocation(prog, "uViewport");
    this.uBullColor = gl.getUniformLocation(prog, "uBullColor");
    this.uBearColor = gl.getUniformLocation(prog, "uBearColor");

    const vao = gl.createVertexArray();
    if (!vao) throw new Error("Failed to create VAO");
    this.vao = vao;
    gl.bindVertexArray(vao);

    const quadData = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);
    this.quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.rectBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.capacityInstances * 16, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);

    this.metaBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.metaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.capacityInstances, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribIPointer(2, 1, gl.UNSIGNED_BYTE, 0, 0);
    gl.vertexAttribDivisor(2, 1);

    gl.bindVertexArray(null);

    // Static GL pipeline setup once
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.035, 0.051, 0.078, 1.0); // #090D14
  }

  private drawInstancedBatch(
    rects: Float32Array,
    count: number,
    bullRgba: readonly [number, number, number, number],
    bearRgba: readonly [number, number, number, number]
  ): void {
    if (count <= 0) return;
    const gl = this.gl;

    gl.uniform4f(this.uBullColor, bullRgba[0], bullRgba[1], bullRgba[2], bullRgba[3]);
    gl.uniform4f(this.uBearColor, bearRgba[0], bearRgba[1], bearRgba[2], bearRgba[3]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, rects);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
  }

  render(
    vp: ViewportConfig,
    proj: FrameProjection,
    engine: CandleEngineWrapper,
    timeframe: string,
    showVolume: boolean,
    emaConfigs: readonly EmaSlotConfig[]
  ): number {
    const t0 = performance.now();
    const gl = this.gl;
    const { viewportWidth: w, viewportHeight: h, dpr } = vp;

    const pixelW = Math.max(1, Math.floor(w * dpr));
    const pixelH = Math.max(1, Math.floor(h * dpr));

    if (gl.canvas.width !== pixelW || gl.canvas.height !== pixelH) {
      gl.canvas.width = pixelW;
      gl.canvas.height = pixelH;
      gl.viewport(0, 0, pixelW, pixelH);
    }
    if (this.hudCtx.canvas.width !== pixelW || this.hudCtx.canvas.height !== pixelH) {
      this.hudCtx.canvas.width = pixelW;
      this.hudCtx.canvas.height = pixelH;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    const sx = Math.max(0, Math.floor(vp.chartLeft * dpr));
    const sw = Math.max(1, Math.floor(vp.chartWidth * dpr));
    const bottomArea = showVolume ? vp.volTop + vp.volHeight : vp.chartTop + vp.chartHeight;
    const sy = Math.max(0, Math.floor((h - bottomArea) * dpr));
    const sh = Math.max(1, Math.floor((bottomArea - vp.chartTop) * dpr));

    if (proj.visibleCount > 0) {
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(sx, sy, sw, sh);

      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);
      gl.uniform2f(this.uViewport, w, h);

      // Upload meta color buffer ONCE per frame (shared across volume, wick, and body passes!)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.metaBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, proj.colors);

      if (showVolume) {
        this.drawInstancedBatch(proj.volumes, proj.visibleCount, BULL_VOL, BEAR_VOL);
      }

      this.drawInstancedBatch(proj.wicks, proj.visibleCount, BULL_WICK, BEAR_WICK);
      this.drawInstancedBatch(proj.bodies, proj.visibleCount, BULL_BODY, BEAR_BODY);

      gl.bindVertexArray(null);
      gl.disable(gl.SCISSOR_TEST);
    }

    const ctx = this.hudCtx;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    drawHudOverlay(ctx, vp, proj, engine, timeframe, showVolume, emaConfigs);
    ctx.restore();

    const t1 = performance.now();
    return (t1 - t0) * 1000;
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteBuffer(this.quadBuf);
    gl.deleteBuffer(this.rectBuf);
    gl.deleteBuffer(this.metaBuf);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }
}
