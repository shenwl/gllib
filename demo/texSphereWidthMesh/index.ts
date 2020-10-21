import { Shapes, Utils, Matrix4, Mesh, Model } from '../../lib/index';
import texImage from './images/mon.jpg';

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

function initTexture(gl: WebGLRenderingContext, program: WebGLProgram, n: number, onLoad: () => void) {
  const u_Texture = gl.getUniformLocation(program, 'u_Texture');
  const img = new Image();

  img.onload = function () {
    const texture = gl.createTexture();
    loadTexture(gl, n, texture, u_Texture, img, () => {
      onLoad();
    });
  }

  img.src = texImage;
}

function __main__() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const gl = Utils.initGl(canvas);
  const program = Utils.initShader(gl, vShader, fShader);

  const sphere = Shapes.d3Sphere;
  const { vertexes, indices, texCoords } = sphere;

  const mesh = new Mesh({ gl, program, vertexes, indices, texCoords });
  const model = new Model(gl, program, mesh);

  let angle = 0;
  
  const draw = () => {
    angle += 1;

    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100).lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0).rotate(angle, 0, 1, 0);
    model.setMatrixUniform('u_MvpMatrix', mvpMatrix.elements)

    model.draw(gl.TRIANGLE_STRIP);

    requestAnimationFrame(draw);
  };

  initTexture(gl, program, indices.length, () => {
    draw();
  });
}

__main__();
