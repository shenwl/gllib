import { RenderContext, Shapes, Mesh } from '../../lib/index';

const vShader = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;

  void main() {
    gl_Position
  }
`

const fShader = `
  precision mediump float;
  uniform vec4 u_Color;

  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0,0);
  }
`

function __main__() {
  RenderContext.init('#canvas', vShader, fShader);

  const Cube: Mesh = Shapes.d3Cube(RenderContext.gl, RenderContext.program);
  const gl = RenderContext.getGL();

  Cube.draw();
}

__main__();
