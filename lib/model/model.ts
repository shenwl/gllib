import { Matrix4 } from '../matrix/matrix';
import { Mesh } from './mesh';
import ImageTexture from './imageTexture';

/**
 * 世界矩阵变量名必须为u_World
 * 自己的矩阵变量名必须为u_Unit
 */
export class Model {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  children: Model[];
  mesh?: Mesh;
  parent?: Model;
  textures: ImageTexture[];
  worldMatrix?: Matrix4;  // 继承而来的矩阵(跟随旋转)
  unitMatrix?: Matrix4;   // 自己的矩阵(自己旋转)

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, mesh?: Mesh) {
    this.mesh = mesh;
    this.gl = gl;
    this.program = program;
    this.children = [];
    this.textures = [];

    this.gl.useProgram(this.program);
  }

  setVectorUniform = (name: string, value: Float32List) => {
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

  setMatrixUniform = (name: string, value: Float32List) => {
    const position = this.gl.getUniformLocation(this.program, name)
    
    if (value.length === 4) {
      this.gl.uniformMatrix2fv(position, false, value)
    } else if (value.length === 9) {
      this.gl.uniformMatrix3fv(position, false, value)
    } else if (value.length === 16) {
      this.gl.uniformMatrix4fv(position, false, value)
    }
  }

  setFloatUniform = (name: string, value: GLfloat) => {
    const position = this.gl.getUniformLocation(this.program, name)
    this.gl.uniform1f(position, value)
  }

  setUnitMatrix = (unitMatrix: Matrix4) => {
    this.unitMatrix = unitMatrix;
  }

  setWorldMatrix = (worldMatrix: Matrix4) => {
    this.worldMatrix = worldMatrix;
  }

  addChild = (model: Model) => {
    model.parent = this;
    this.children.push(model);
  }

  addTextureImage = (url: string) => {
    this.textures.push(new ImageTexture(this.gl, this.program, url))
  }

  /**
   * 递归更新世界矩阵 
   * @param {Matrix4} parentWorldMatrix 
   * @param {Matrix4} parentUnitMatrix 
   */
  updateMatrix = (parentWorldMatrix?: Matrix4, parentUnitMatrix?: Matrix4) => {
    if (parentWorldMatrix && parentUnitMatrix) {
      this.worldMatrix = new Matrix4().multiply(parentWorldMatrix).multiply(parentUnitMatrix);
    }
    for (let child of this.children) {
      child.updateMatrix(this.worldMatrix, this.unitMatrix);
    }
  }

  draw = (mode: GLenum = WebGLRenderingContext.TRIANGLES) => {
    const gl = this.gl;

    this.unitMatrix && this.setMatrixUniform('u_Unit', this.unitMatrix.elements);
    this.worldMatrix && this.setMatrixUniform('u_World', this.worldMatrix.elements);

    if (this.mesh) {
      this.textures.forEach(tex => tex.associate());

      this.mesh.draw(mode);
    }
    this.children.forEach(child => child.draw(mode));
  }
}
