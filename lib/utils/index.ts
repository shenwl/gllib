export interface IExtendWebGLBuffer extends WebGLBuffer {
  num: number;
  type: GLenum;
}

interface IExtendWebGLRenderingContext extends WebGLRenderingContext {
  program: WebGLProgram;
}

export function initGl(canvas: HTMLCanvasElement): WebGLRenderingContext {
  const gl: WebGLRenderingContext = canvas.getContext('webgl');

  if (!gl) {
    throw Error('gl init fail');
  }
  return gl;
}


export function initArrayBufferForLaterUse(gl: WebGLRenderingContext, data: GLsizeiptr, num: number, type: GLenum): IExtendWebGLBuffer {
  const buffer = gl.createBuffer() as IExtendWebGLBuffer;

  if (!buffer) {
    throw Error("Fail to create the buffer object");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.num = num;
  buffer.type = type;

  return buffer;
}

export function initArrayBuffer(program: WebGLProgram, gl: WebGLRenderingContext, attribute: string, data: GLsizeiptr, num: number, type: GLenum): void {
  const buffer = gl.createBuffer() as IExtendWebGLBuffer;

  if (!buffer) {
    throw Error("Fail to create the buffer object");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const a_attribute = gl.getAttribLocation(program, attribute);
  if (a_attribute < 0) {
    throw Error("Fail to getAttribLocation of: " + attribute);
  }

  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
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

export function createProgram(gl: WebGLRenderingContext, vertexShader: string, fragShader: string) {
  const vShader = loadShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShader);


  if (!vShader || !fShader) {
    throw Error('fail to vertexShader or fragShader: ' + vertexShader + ', ' + fragShader);
  }

  const program = gl.createProgram();

  if (!program) {
    throw Error('fail to createProgram!' + program);

  }

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter('program', gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    throw Error('fail to link program, ' + err);
  }

  return program;
}

export function initShader(gl: WebGLRenderingContext, vertexShader: string, fragShader: string): WebGLProgram {
  const program = createProgram(gl, vertexShader, fragShader);
  gl.useProgram(program);

  (gl as IExtendWebGLRenderingContext).program = program;

  return program;
}

/**
 * 用于创建加载纹理的工具函数
 * @param {number} texCount 纹理材质总数
 * @returns {function} loadTexture
 */
export function createTextureLoader(texCount: number = 1) {
  const texUnitActive: { [key: string]: boolean } = {};

  for (let i = 0; i < texCount; i++) {
    texUnitActive[`TEXTURE${i}`] = false;
  }

  return function loadTexture(
    gl: WebGLRenderingContext,
    n: number,
    texture: WebGLTexture,
    u_Sample: WebGLUniformLocation,
    image: HTMLImageElement,
    texUnit: GLint = 0,
  ): void {
    const texUnitKey = `TEXTURE${texUnit}`;
    texUnitActive[texUnitKey] = true;

    // 图像y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture((gl as any)[texUnitKey]);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // 将texUnit号纹理传递给着色器的取样器变量
    gl.uniform1i(u_Sample, texUnit);

    // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (Object.values(texUnitActive).every(Boolean)) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }
}





