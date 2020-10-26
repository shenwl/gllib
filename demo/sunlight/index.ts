import { Shapes, Utils, Matrix4, Model, Mesh } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec3 a_Normal;

  uniform mat4 u_World;
  uniform mat4 u_MvpMatrix;

  varying vec4 v_Color;
  varying vec3 v_Norm;

  void main() {
    gl_Position = u_MvpMatrix * u_World * a_Position;
    v_Color = a_Color;
    v_Norm = mat3(u_World) * a_Normal;
  }
`

const fShader = `
  precision mediump float;
  uniform vec3 u_Light; // 光照方向

  varying vec4 v_Color;
  varying vec3 v_Norm;

  void main() {
    vec3 normal = normalize(v_Norm);
    vec3 lightDir = normalize(u_Light);
    float light = dot(normal, -lightDir);
    gl_FragColor = v_Color;
    gl_FragColor.rgb *= light;
  }
`

const colors = [
  0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1,
  0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4,
  1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4, 1, 0.4, 0.4,
  1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4,
  0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1,
  1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1,
];

function __main__() {
  const light = { x: 10, y: 100, z: -100 };

  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Cube = Shapes.d3Cube;
  const { vertexes, indices, norms } = Cube;

  const model = new Model(gl, program, new Mesh({ gl, program, vertexes, indices, colors, norms }));

  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100).lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
  model.setMatrixUniform('u_MvpMatrix', mvpMatrix.elements);

  let angle = 0;

  const draw = () => {
    angle += 1;


    model.setWorldMatrix(new Matrix4().rotate(angle, 0, 1, 0));
    model.setVectorUniform('u_Light', new Float32Array([light.x, light.y, light.z]));
    model.updateMatrix();

    gl.clearColor(0, 0, 0, 1)
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
