import { GLVertexBuffer } from './glVertexBuffer';
import { GLIndexBuffer } from './glIndexBuffer';

interface IProps {
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexes: number[];
  indices?: number[];
  dimension?: number;
  colors?: number[];
}

export class Mesh {
  // 顶点坐标数组，描述有哪些顶点
  vertexes: number[];
  // 索引数组：描述顶点怎么组成三角形（3个一组）
  indices: number[];
  dimension: number;  // 维度，默认3维
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexPosition: GLint;
  vertexBuffer: GLVertexBuffer;
  colorsBuffer: GLVertexBuffer;
  indicesBuffer: GLIndexBuffer;

  constructor(
    { gl, program, vertexes, indices = null, dimension = 3, colors = null }: IProps
  ) {
    this.dimension = dimension;
    this.indices = indices;
    this.vertexes = vertexes;
    this.gl = gl;
    this.program = program;

    this.vertexPosition = this.gl.getAttribLocation(this.program, 'a_Position');
    // 绘制网格需要buffer
    this.vertexBuffer = new GLVertexBuffer(gl, program, 'a_Position', new Float32Array(vertexes), dimension);

    if (colors) {
      this.colorsBuffer = new GLVertexBuffer(gl, program, 'a_Color', new Float32Array(colors), dimension);
    }
    if (indices) {
      this.indicesBuffer = new GLIndexBuffer(gl, program, new Uint16Array(indices), dimension);
    }
  }

  draw() {
    const { gl } = this;

    this.vertexBuffer.associate();
    this.colorsBuffer && this.colorsBuffer.associate();
    this.indicesBuffer && this.indicesBuffer.associate();

    if (this.indicesBuffer) {
      gl.drawElements(
        gl.TRIANGLES,
        this.indices.length,
        gl.UNSIGNED_SHORT,
        0,
      );
      return;
    }
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      this.vertexes.length / this.dimension,
    );
  }
}
