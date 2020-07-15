import { loadShader } from './loadShader';

export const initProgram = (gl: WebGLRenderingContext): WebGLProgram => {

  const vertexShaderSource: string = (document.getElementById('vertex-shader') as HTMLScriptElement).text;
  const fragShaderSource: string = (document.getElementById('fragment-shader') as HTMLScriptElement).text;

  const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader: WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

  const program: WebGLProgram = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  return program;
}
