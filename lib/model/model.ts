import { Mesh } from './mesh';

export class Model {
  mesh: Mesh;
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, mesh: Mesh) {
    this.mesh = mesh;
    this.gl = gl;
    this.program = program;
    this.gl.useProgram(this.program);
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

  setMatrixUniform(name: string, value: Float32List) {
    const position = this.gl.getUniformLocation(this.program, name)

    if (value.length === 4) {
      this.gl.uniformMatrix2fv(position, false, value)
    } else if (value.length === 9) {
      this.gl.uniformMatrix3fv(position, false, value)
    } else if (value.length === 16) {
      this.gl.uniformMatrix4fv(position, false, value)
    }
  }

  draw(mode: GLenum = WebGLRenderingContext.TRIANGLES) {
    const gl = this.gl;
    // 加一些参数
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0, 0, 0, 1)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    this.mesh.draw(mode);
  }
}
