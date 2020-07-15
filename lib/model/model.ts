import { Mesh } from './mesh';
import RenderContext from '../renderContext';

export class Model {
  mesh: Mesh;
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.gl = RenderContext.getGL();
    this.program = RenderContext.getProgram();
  }

  setVectorUniform(name: string, value: Float32List) {
    const position = this.gl.getUniformLocation(this.program, name)

    if (value.length === 2) {
      return this.gl.uniform2fv(position, value);
    }
    if (value.length === 3) {
      return this.gl.uniform3fv(position, value);
    }
    if (value.length === 4) {
      return this.gl.uniform4fv(position, value);
    }
    throw new Error('setVectorUniform error, value length must be 2/3/4, but get: ' + value.length);
  }

  draw() {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.mesh.draw();
  }
}
