import { Shapes, Utils, Matrix4, Mesh, Model } from '../../lib/index';
import texImage from './images/mon.jpg';

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

function __main__() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const gl = Utils.initGl(canvas);
  const program = Utils.initShader(gl, vShader, fShader);

  const sphere = Shapes.d3Sphere;
  const { vertexes, indices, texCoords } = sphere;

  const mesh = new Mesh({ gl, program, vertexes, indices, texCoords });
  const model = new Model(gl, program, mesh);

  model.addTextureImage(texImage);

  let angle = 0;

  const draw = () => {
    angle += 1;

    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100).lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0).rotate(angle, 0, 1, 0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    model.setMatrixUniform('u_MvpMatrix', mvpMatrix.elements)
    model.draw(gl.TRIANGLE_STRIP);

    requestAnimationFrame(draw);
  };

  draw();
}

__main__();
