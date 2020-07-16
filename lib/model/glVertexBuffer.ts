import RenderContext from '../renderContext';

const gl: WebGLRenderingContext = RenderContext.getGL();

enum Mode {
  STATIC_DRAW = gl.STATIC_DRAW,
  DYNAMIC_DRAW = gl.DYNAMIC_DRAW,
}

export class GLVertexBuffer {
  dimension: number;
  mode: Mode;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  location: GLint;
  buffer: WebGLBuffer;

  constructor(name: string, data: BufferSource, dimension: number = 3, mode: Mode = Mode.STATIC_DRAW) {
    this.dimension = dimension;
    this.gl = gl;
    this.program = RenderContext.getProgram();
    this.location = this.gl.getAttribLocation(this.program, name);

    /* 初始化Buffer */
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, mode);
    this.gl.enableVertexAttribArray(this.location);
  }

  /**
   * 关联，绘制过程中
   */
  associate() {
    // 绘制过程中需要再bind一次buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    const type = this.gl.FLOAT;
    const normalized = false;
    const stride = 0; // 数据间隔
    const offset = 0; // 从第几个数据开始读
    // 告诉glsl怎么去使用buffer
    this.gl.vertexAttribPointer(
      this.location,
      this.dimension,
      type,
      normalized,
      stride,
      offset,
    );
  }

}
