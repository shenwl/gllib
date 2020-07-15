export function initGl(): WebGLRenderingContext {
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

  const gl: WebGLRenderingContext = canvas.getContext('webgl');

  if (!gl) {
    throw Error('gl init fail');
  }
  return gl;
}
