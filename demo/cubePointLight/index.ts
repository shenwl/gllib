import { Shapes, Utils, Matrix4, Model, Mesh } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  attribute vec3 a_Normal;

  uniform mat4 u_World;
  uniform mat4 u_Unit;
  uniform vec3 u_Light;
  uniform vec3 u_Camera;

  varying vec3 v_Norm;
  varying vec3 v_SurfaceToCamera;
  varying vec3 v_SurfaceToLight;

  void main() {
    vec3 surface = (u_World * a_Position).xyz;
    gl_Position = u_World * u_Unit * a_Position;
    v_Norm = mat3(u_World * u_Unit) * a_Normal;
    v_SurfaceToLight = u_Light - surface;
    v_SurfaceToCamera = u_Camera - surface;
  }
`

const fShader = `
  precision mediump float;

  varying vec4 v_Color;
  varying vec3 v_Norm;
  varying vec3 v_SurfaceToCamera;
  varying vec3 v_SurfaceToLight;

  void main() {
    vec3 normal = normalize(v_Norm);
    vec3 halfVec = normalize(v_SurfaceToCamera + v_SurfaceToLight);
    vec3 surfaceToLight = normalize(halfVec);
    float light = dot(normal, surfaceToLight);
    float specular = dot(normal, halfVec);
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;
    gl_FragColor += pow(specular, 100.0);
  }
`

function __main__() {
  const light = { x: 0, y: 0, z: 0 };

  const gl = Utils.initGl(document.getElementById('canvas') as HTMLCanvasElement);
  const program = Utils.initShader(gl, vShader, fShader);

  const Cube = Shapes.d3Cube;
  const { vertexes, indices, norms } = Cube;

  const model = new Model(gl, program, new Mesh({ gl, program, vertexes, indices, norms }));

  let angle = 0;
  const camera: [number, number, number] = [6, 6, 14];

  const draw = () => {
    angle += 1;

    model.setWorldMatrix(
      new Matrix4()
        .setPerspective(30, 1, 1, 100)
        .lookAt(camera[0], camera[1], camera[2], 0, 0, 0, 0, 1, 0)
        .rotate(angle, 0, 1, 0)
    );
    model.setVectorUniform('u_Light', new Float32Array([light.x, light.y, light.z]));
    model.setVectorUniform('u_Camera', new Float32Array(camera));
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
