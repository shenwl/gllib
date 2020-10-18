import { Shapes, Utils, Matrix4 } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  uniform mat4 u_MvpMatrix;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
  }
`

const fShader = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0,0);
  }
`

function initVertexBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexes: number[],
  indices: number[],
) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw Error('failed to create buffer');

  // const colors = new Float32Array([
  //   0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 0.4, 0.4, 1,
  //   0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4,
  //   1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4,
  //   1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4,
  //   0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1,
  //   1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1,
  // ]);

  Utils.initArrayBuffer(program, gl, 'a_Position', new Float32Array(vertexes), 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
}

function __main__() {
  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Cube = Shapes.d3Cube;
  const { vertexes, indices } = Cube;

  initVertexBuffers(gl, program, vertexes, indices);

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
