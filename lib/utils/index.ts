export interface IExtendWebGLBuffer extends WebGLBuffer {
  num: number;
  type: GLenum;
}

interface IExtendWebGLRenderingContext extends WebGLRenderingContext {
  program: WebGLProgram;
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

function createLoadTexture() {
  let g_texUnit0 = false;
  let g_texUnit1 = false;

  return function (
    gl: WebGLRenderingContext,
    n: number,
    texture: WebGLTexture,
    u_Sample: WebGLUniformLocation,
    image: HTMLImageElement,
    texUnit: GLint = 0,
  ) {
    const texUnitKey = `TEXTURE${texUnit}`;
    if (texUnit === 0) {
      g_texUnit0 = true;
    } else if (texUnit === 1) {
      g_texUnit1 = true;
    }

    // reverse image y
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // active texture unit
    gl.activeTexture((gl as any)[texUnitKey]);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // set texture params
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // set image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (g_texUnit0 && g_texUnit1) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }
}

export const loadTexture = createLoadTexture();






