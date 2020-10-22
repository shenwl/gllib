import { Utils, Matrix4, Model } from '../../lib/index';
import Robot from './robot';


const vShader = `
  attribute vec4 a_Position;
  uniform mat4 u_World;
  uniform mat4 u_Unit;

  attribute vec2 a_Texcoord;
  varying vec2 v_Texcoord;
  

  void main() {
    gl_Position = u_World * u_Unit * a_Position;
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

  const robotModel = new Robot(gl, program);

  let shakeAngle = 0;
  let angleStep = 5;

  const draw = () => {
    shakeAngle += angleStep;
    if (shakeAngle >= 90 || shakeAngle <= 0) {
      angleStep = - angleStep;
    }

    const mat4 = new Matrix4()
    mat4.setPerspective(30, 1, 1, 100).lookAt(2, 3, 10, 0, 0, 0, 0, 1, 0);

    robotModel.setWorldMatrix(mat4);
    robotModel.updateMatrix();
    robotModel.lookAt(shakeAngle);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    robotModel.draw(gl.TRIANGLE_STRIP);
    requestAnimationFrame(draw)
  }

  draw();
}

__main__();
