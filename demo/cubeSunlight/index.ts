import { Shapes, Utils, Matrix4, Model, Mesh } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  attribute vec3 a_Normal;

  uniform mat4 u_World;
  uniform mat4 u_Unit;

  varying vec3 v_Norm;

  void main() {
    gl_Position = u_World * u_Unit * a_Position;
    v_Norm = mat3(u_World * u_Unit) * a_Normal;
  }
`

const fShader = `
  precision mediump float;
  uniform vec3 u_Light; // 光照方向

  varying vec3 v_Norm;

  void main() {
    vec3 normal = normalize(v_Norm);
    float light = dot(normal, -u_Light);
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    gl_FragColor.rgb *= light;
  }
`


function __main__() {
  const light = { x: 10, y: 100, z: -100 };

  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Cube = Shapes.d3Cube;
  const { vertexes, indices, norms } = Cube;

  const model = new Model(gl, program, new Mesh({ gl, program, vertexes, indices, norms }));

  model.setWorldMatrix(new Matrix4().setPerspective(30, 1, 1, 100).lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0));

  let angle = 0;

  const draw = () => {
    angle += 1;

    model.setUnitMatrix(new Matrix4().rotate(angle, 0, 1, 0))
    model.setVectorUniform('u_Light', new Float32Array([light.x, light.y, light.z]));
    model.updateMatrix();

    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    model.draw(gl.TRIANGLES);

    requestAnimationFrame(draw);
  };

  draw();

  document.getElementById('submit').onclick = () => {
    light.x = (document.getElementById('x') as any).value;
    light.y = (document.getElementById('y') as any).value;
    light.z = (document.getElementById('z') as any).value;
  }
}

__main__();
