import { Shapes, Utils, Matrix4 } from '../../lib/index';
import texImage from './images/map.jpg';
// import texImage from './images/face.jpg';

const loadTexture = Utils.createTextureLoader();

const vShader = `
  attribute vec4 a_Position;
  uniform mat4 u_MvpMatrix;

  attribute vec2 a_Texcoord;
  varying vec2 v_Texcoord;
  

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
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
  texCoords: number[],
) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw Error('failed to create buffer');

  Utils.initArrayBuffer(program, gl, 'a_Position', new Float32Array(vertexes), 3);
  Utils.initArrayBuffer(program, gl, 'a_Texcoord', new Float32Array(texCoords), 2);

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
      gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_BYTE, 0);
    });
  }
}

function __main__() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const gl = Utils.initGl(canvas);
  const program = Utils.initShader(gl, vShader, fShader);

  const Sphere = Shapes.d3Sphere;
  const { vertexes, indices, texCoords } = Sphere;

  initBuffers(gl, program, vertexes, indices, texCoords);
  initTexture(gl, program, indices.length);

  let angle = 0;

  const draw = () => {
    angle += 1;
    if (angle > 360) angle = 0;


    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100).lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0).rotate(angle, 0, 1, 0);

    gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.DEPTH_TEST);

    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(draw);
  };

  draw();
}

__main__();
