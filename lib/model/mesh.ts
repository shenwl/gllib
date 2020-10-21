import { GLVertexBuffer } from './glVertexBuffer';
import { GLIndexBuffer } from './glIndexBuffer';

interface IOptions {
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexes: number[];
  indices?: number[];
  dimension?: number;
  texCoords?: number;
  colors?: number[];
}

/**
 * 网格类
 * 使用规则：
 * glsl变量名称要求：顶点为a_Position，颜色为a_Color，材质坐标为a_Texcoord
 */
export class Mesh {
  // 顶点坐标数组，描述有哪些顶点
  vertexes: number[];
  // 索引数组：描述顶点怎么组成三角形（3个一组）
  indices: number[];
  dimension: number;  // 维度，默认3维
  texCoords: number;  // 材质映射坐标
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexPosition: GLint;
  vertexBuffer: GLVertexBuffer;
  colorsBuffer: GLVertexBuffer;
  indicesBuffer: GLIndexBuffer;
  texCoordsBuffer: GLIndexBuffer;
  customVerticesBuffer: GLIndexBuffer[];

  constructor(options: IOptions) {
    const { gl, program, vertexes, indices = null, dimension = 3, colors = null, texCoords } = options;
    this.dimension = dimension;
    this.indices = indices;
    this.vertexes = vertexes;
    this.gl = gl;
    this.program = program;

    this.customVerticesBuffer = [];

    this.vertexBuffer = new GLVertexBuffer(gl, program, 'a_Position', new Float32Array(vertexes), dimension);

    if (colors) {
      this.colorsBuffer = new GLVertexBuffer(gl, program, 'a_Color', new Float32Array(colors), dimension);
    }
    if (texCoords) {
      this.texCoordsBuffer = new GLVertexBuffer(gl, program, 'a_Texcoord', new Float32Array(texCoords), 2);
    }
    if (indices) {
      this.indicesBuffer = new GLIndexBuffer(gl, program, new Uint16Array(indices), dimension);
    }
  }

  addVertexBuffer(name: string, data: BufferSource, dimension: number) {
    this.customVerticesBuffer.push(new GLVertexBuffer(
      this.gl,
      this.program,
      name,
      data,
      dimension,
    ));
  }

  draw() {
    const { gl } = this;

    this.vertexBuffer.associate();
    this.colorsBuffer && this.colorsBuffer.associate();
    this.indicesBuffer && this.indicesBuffer.associate();
    this.texCoordsBuffer && this.texCoordsBuffer.associate();

    this.customVerticesBuffer.forEach(buffer => {
      buffer.associate()
    });

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
