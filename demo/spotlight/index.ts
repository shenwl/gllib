import { Shapes, Utils, Matrix4, Model, Mesh } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  attribute vec3 a_Normal;

  uniform mat4 u_World;
  uniform mat4 u_Unit;
  uniform vec3 u_Light; // 光源位置
  uniform vec3 u_Camera;

  varying vec3 v_Norm;
  varying vec3 v_SurfaceToCamera;
  varying vec3 v_SurfaceToLight;

  void main() {
    vec3 surface = (u_World * u_Unit * a_Position).xyz;
    gl_Position = u_World * u_Unit * a_Position;
    v_Norm = mat3(u_World * u_Unit) * a_Normal;
    v_SurfaceToLight = u_Light - surface;
    v_SurfaceToCamera = u_Camera - surface;
  }
`

const fShader = `
  precision mediump float;
  uniform vec3 u_LightDir;  // 光照方向
  uniform float u_InnerLimit; // 光照范围
  uniform float u_OutterLimit;
  uniform float u_Shininess; // 光照强度

  varying vec4 v_Color;
  varying vec3 v_Norm;
  varying vec3 v_SurfaceToCamera;
  varying vec3 v_SurfaceToLight;

  void main() {
    vec3 normal = normalize(v_Norm);
    vec3 halfVec = normalize(v_SurfaceToCamera + v_SurfaceToLight);
    vec3 surfaceToLight = normalize(v_SurfaceToLight);
    vec3 lightDir = normalize(u_LightDir);
    
    float specular = 0.0;
    float dotFromDir = dot(surfaceToLight, -lightDir);
    float limitRange = u_InnerLimit - u_OutterLimit;

    // x = (dotFromDir - u_OutterLimit) / limitRange
    // x: -5, 0.4, 1.5
    // light取值在0-1.0之间，所以用了clamp
    float light = clamp((dotFromDir - u_OutterLimit) / limitRange, 0.0, 1.0);

    if (light > 0.0) {
      specular = pow(dot(normal, halfVec), u_Shininess);
    }

    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;
    gl_FragColor += pow(specular, 100.0);
  }
`

function __main__() {
  // 光源位置，范围，亮度
  const light = new Proxy({ x: 0, y: 0, z: 0, innerlimit: 1, outterlimit: 10, shininess: 1 }, {
    set: (target, key, val) => {
      (target as any)[key] = parseFloat(val);
      return true;
    }
  });

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
    model.setVectorUniform('u_LightDir', new Float32Array([light.x, light.y, -1]));
    model.setVectorUniform('u_Camera', new Float32Array(camera));
    model.setFloatUniform('u_InnerLimit', light.innerlimit);
    model.setFloatUniform('u_OutterLimit', light.outterlimit);
    model.setFloatUniform('u_Shininess', light.shininess);
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
    light.innerlimit = (document.getElementById('innerlimit') as any).value;
    light.outterlimit = (document.getElementById('outterlimit') as any).value;
    light.shininess = (document.getElementById('shininess') as any).value;
  }
}

__main__();
