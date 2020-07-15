import { initGl } from './boot/initGl';
import { initProgram } from './boot/initProgram';

export default class RenderContext {
  static gl: WebGLRenderingContext = null;
  static program: WebGLProgram = null;

  static init() {
    if (RenderContext.gl) return;

    const gl = initGl();
    const program = initProgram(gl);

    RenderContext.gl = gl;
    RenderContext.program = program;
  }

  static getGL(): WebGLRenderingContext {
    RenderContext.init();
    return RenderContext.gl;
  }

  static getProgram() {
    RenderContext.init();
    return RenderContext.program;
  }
}
