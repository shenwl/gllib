export const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
  const shader: WebGLShader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(err);
  }

  return shader;
}
