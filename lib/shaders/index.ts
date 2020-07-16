export const vertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;

  void main() {
    // [0, 1]
    vec2 zeroToOne = a_position / u_resolution;
    // [0, 2]
    vec2 zeroToTwo = zeroToOne * 2.0;
    // [-1, 1]
    vec2 clipSpace = zeroToTwo - 1.0;

    // 内置变量
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`

export const fragShaderSource = `
  // 声明浮点数精度
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`
