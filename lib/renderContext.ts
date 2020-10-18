import { createProgram, initGl } from './utils';

export default class RenderContext {
  static gl: WebGLRenderingContext = null;
  static program: WebGLProgram = null;

  static init(
    canvasSelector: string = '#canvas',
    vShader?: string,
    fShader?: string,
  ) {
    if (RenderContext.gl) return;

    const gl = initGl(document.querySelector(canvasSelector) as HTMLCanvasElement);
    RenderContext.gl = gl;


    if (vShader && fShader) {
      const program = createProgram(gl, vShader, fShader);

      RenderContext.program = program;
    }
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
