export function initGl(canvas: HTMLCanvasElement): WebGLRenderingContext {
  const gl: WebGLRenderingContext = canvas.getContext('webgl');

  if (!gl) {
    throw Error('gl init fail');
  }
  return gl;
}
