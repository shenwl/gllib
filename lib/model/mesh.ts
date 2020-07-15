import RenderContext from '../renderContext';

interface IProps {
  vertexes: number[];
  indexes?: any;
  dimension?: number;
}

export class Mesh {
  dimension: number;
  vertexes: number[];
  indexes: any;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexPosition: GLint;
  vertexBuffer: WebGLBuffer;

  constructor(
    { vertexes, indexes = null, dimension = 3 }: IProps
  ) {
    this.dimension = dimension;
    this.vertexes = vertexes;
    this.indexes = indexes;

    // webGL实例
    this.gl = RenderContext.getGL();
    this.program = RenderContext.getProgram();
    this.vertexPosition = this.gl.getAttribLocation(this.program, 'a_position');
    // 绘制网格需要buffer
    this.vertexBuffer = null;
    this.init();
  }

  init() {
    // 创建缓冲区
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    // bufferData需要32位Float数组
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexes),
      this.gl.STATIC_DRAW,
    );
  }

  draw() {
    this.gl.enableVertexAttribArray(this.vertexPosition);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    const type = this.gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    this.gl.vertexAttribPointer(
      this.vertexPosition,
      this.dimension,
      type,
      normalized,
      stride,
      offset,
    );
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexes.length / this.dimension);
  }
}
