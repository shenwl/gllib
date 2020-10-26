import { Utils, Matrix4, Model } from '../../lib/index';
import Robot from './robot';


const vShader = `
  attribute vec4 a_Position;
  uniform mat4 u_Mvp;
  uniform mat4 u_World;
  uniform mat4 u_Unit;

  attribute vec3 a_Normal;
  attribute vec2 a_Texcoord;

  varying vec2 v_Texcoord;
  varying vec3 v_Norm;

  void main() {
    gl_Position = u_Mvp * u_World * u_Unit * a_Position;
    v_Texcoord = a_Texcoord;
    v_Norm = mat3(u_World * u_Unit) * a_Normal;
  }
`

const fShader = `
  precision mediump float;

  varying vec2 v_Texcoord;
  varying vec3 v_Norm;
  uniform vec3 u_Light;

  uniform sampler2D u_Texture;

  void main() {
    gl_FragColor = texture2D(u_Texture, v_Texcoord);
    vec3 norm = normalize(v_Norm);
    vec3 light = normalize(u_Light);
    gl_FragColor.rgb *= dot(norm, -light);
  }
`


function __main__() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const gl = Utils.initGl(canvas);
  const program = Utils.initShader(gl, vShader, fShader);

  const robotModel = new Robot(gl, program);
  robotModel.walk();

  let angle = 0;

  const draw = () => {
    angle += 1;
    
    const mvp = new Matrix4()
    mvp.setPerspective(30, 1, 1, 100).lookAt(2, 3, 10, 0, 0, 0, 0, 1, 0);

    robotModel.setMatrixUniform("u_Mvp", mvp.elements)

    robotModel.setWorldMatrix(new Matrix4().rotate(angle, 0, 1, 0));
    robotModel.setVectorUniform('u_Light', new Float32Array([0, -0.1, -1]));
    robotModel.updateMatrix();

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    // gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    robotModel.draw(gl.TRIANGLE_STRIP);
    requestAnimationFrame(draw)
  }

  draw();
}

__main__();
