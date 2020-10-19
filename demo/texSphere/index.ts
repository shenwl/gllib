import { Shapes, Utils, Matrix4 } from '../../lib/index';
import texImage from './images/tex256.jpg';

const loadTexture = Utils.createTextureLoader();

const vShader = `
  attribute vec4 a_Position;
  uniform mat4 u_MvpMatrix;

  attribute vec4 a_Color;
  varying vec4 v_Color;

  // attribute vec2 a_Texcoord;
  // varying vec2 v_Texcoord;
  

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
    // v_Texcoord = a_Texcoord;
  }
`

const fShader = `
  precision mediump float;
  // varying vec2 v_Texcoord;
  // uniform sampler2D u_Texture;

  varying vec4 v_Color;

  void main() {
    // gl_FragColor = texture2D(u_Texture, v_Texcoord);
    gl_FragColor = v_Color;
  }
`

function initBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexes: number[],
  indices: number[],
  randomColors: number[],
) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw Error('failed to create buffer');

  Utils.initArrayBuffer(program, gl, 'a_Position', new Float32Array(vertexes), 3);
  Utils.initArrayBuffer(program, gl, 'a_Color', new Float32Array(randomColors), 4);

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
    loadTexture(gl, n, texture, u_Texture, img, () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    });
  }
}

function __main__() {
  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Sphere = Shapes.d3Sphere;
  const { vertexes, indices, textCoords, randomColors } = Sphere;

  initBuffers(gl, program, vertexes, indices, randomColors);
  initTexture(gl, program, indices.length);

  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST);

  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

  let angle = 0;

  const draw = () => {
    angle += 0.01;

    mvpMatrix.rotate(angle, 0, 1, 0);
    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(draw);
  };

  draw();
}

__main__();
