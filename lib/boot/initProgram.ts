import { loadShader } from './loadShader';
import { vertexShaderSource, fragShaderSource } from '../shaders/index';


export const initProgram = (gl: WebGLRenderingContext): WebGLProgram => {
  const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader: WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

  const program: WebGLProgram = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  return program;
}
