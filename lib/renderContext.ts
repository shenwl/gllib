import { initGl } from './boot/initGl';
import { initProgram } from './boot/initProgram';

export default class RenderContext {
  static gl: WebGLRenderingContext = null;
  static program: WebGLProgram = null;

  static init() {
    if (RenderContext.gl) return;

    const gl = initGl(document.getElementById('canvas') as HTMLCanvasElement);
    const program = initProgram(
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
