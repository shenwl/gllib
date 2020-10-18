enum Mode {
  STATIC_DRAW = WebGLRenderingContext.STATIC_DRAW,
  DYNAMIC_DRAW = WebGLRenderingContext.DYNAMIC_DRAW,
}

export class GLIndexBuffer {
  dimension: number;
  mode: Mode;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;

  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    data: BufferSource,
    dimension: number = 3,
    mode: Mode = Mode.STATIC_DRAW
  ) {
    this.dimension = dimension;
    this.gl = gl;
    this.program = program;

    /* 初始化Buffer */
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, mode);
  }

  associate() {
    // 绘制过程中需要再bind一次buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

}
