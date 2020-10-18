import { Shapes, Utils, Matrix4 } from '../../lib/index';
import texImage from './images/tex.jpg';

const loadTexture = Utils.createTextureLoader();

const vShader = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec2 a_Texcoord;

  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  varying vec2 v_Texcoord;
  

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
    v_Texcoord = a_Texcoord;
  }
`

const fShader = `
  precision mediump float;
  varying vec2 v_Texcoord;
  uniform sampler2D u_Texture;

  void main() {
    gl_FragColor = texture2D(u_Texture, v_Texcoord);
  }
`

function initBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexes: number[],
  indices: number[],
) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw Error('failed to create buffer');

  const textCoord = new Float32Array([
    0, 0, 0, 1, 1, 1, 1, 0,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 1, 1, 1, 1, 0,
  ])

  Utils.initArrayBuffer(program, gl, 'a_Position', new Float32Array(vertexes), 3);
  Utils.initArrayBuffer(program, gl, 'a_Texcoord', textCoord, 2);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
}

function initTexture(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  n: number,
) {
  const u_Texture = gl.getUniformLocation(program, 'u_Texture');
  const img = new Image();
  img.src = texImage;

  img.onload = function () {
    const texture = gl.createTexture();
    loadTexture(gl, n, texture, u_Texture, img);
  }
}

function __main__() {
  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Cube = Shapes.d3Cube;
  const { vertexes, indices } = Cube;

  initBuffers(gl, program, vertexes, indices);
  initTexture(gl, program, indices.length);

  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST);

  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

  const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

__main__();
