import { createProgram, initGl } from './utils';

export default class RenderContext {
  static gl: WebGLRenderingContext = null;
  static program: WebGLProgram = null;

  static init(canvasSelector: string = '#canvas') {
    if (RenderContext.gl) return;

    const gl = initGl(document.querySelector(canvasSelector) as HTMLCanvasElement);
    const program = createProgram(
      gl,
      document.getElementById('vertex-shader').innerText,
      document.getElementById('frag-shader').innerText,
    );

    RenderContext.gl = gl;
    RenderContext.program = program;
  }

  static getGL(): WebGLRenderingContext {
    RenderContext.init();
    return RenderContext.gl;
  }

  static getProgram(): WebGLProgram {
    RenderContext.init();
    return RenderContext.program;
  }
}
