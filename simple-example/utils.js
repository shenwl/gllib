
function initGl(canvas) {
  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw Error('gl init fail');
  }
  return gl;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(err);
  }

  return shader;
}

function createProgram(gl, vertexShader, fragShader) {
  const vShader = loadShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShader);


  if (!vShader || !fShader) {
    throw Error('vertexShader or fragShader is empty: ' + vertexShader + ', ' + fragShader);
  }

  const program = gl.createProgram();

  if (!program) {
    throw Error('fail to createProgram!' + program);
  }

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    throw Error('fail to link program, ' + err);
  }

  return program;
}

function initShader(gl, vertexShader, fragShader) {
  const program = createProgram(gl, vertexShader, fragShader);
  gl.useProgram(program);

  gl.program = program;

  return program;
}


const handlerMap = new Map();
const reactivities = new Map();

let usedReactivities = [];

function reactive(obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj);
  }

  const proxy = new Proxy(obj, {
    get(obj, key) {
      usedReactivities.push([obj, key]);

      if (typeof obj[key] === 'object') {
        return reactive(obj[key]);
      }

      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      if (handlerMap.get(obj)) {
        (handlerMap.get(obj).get(key)).forEach(handler => handler && handler());
      }
      return true;
    }
  });
  reactivities.set(obj, proxy);
  reactivities.set(proxy, proxy);
  return proxy;
}

function effect(handler) {
  usedReactivities = [];
  handler();
  for (let usedReactivity of usedReactivities) {
    let [obj, key] = usedReactivity;
    if (!handlerMap.has(obj)) {
      handlerMap.set(obj, new Map());
    }
    if (!handlerMap.get(obj).has(key)) {
      handlerMap.get(obj).set(key, new Set());
    }
    handlerMap.get(obj).get(key).add(handler)
  }
}

function convertCanvasCoordinateToGl(x, y, z, canvas) {
  return [
    (x - canvas.width / 2) / (canvas.width / 2),
    (canvas.height / 2 - y) / (canvas.height / 2),
    z,
  ];
}

function createBuffer(gl, data, target, mode) {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw Error("[createBuffer] Fail to create the buffer object");
  }
  if (!data) return buffer;

  gl.bindBuffer(target || gl.ARRAY_BUFFER, buffer);
  gl.bufferData(target || gl.ARRAY_BUFFER, data, mode || gl.STATIC_DRAW);

  return buffer;
}

function powerOf2(num) {
  return (num & (num - 1)) == 0
}

/**
 * 用于创建加载纹理的工具函数
 * @param {number} texCount 纹理材质总数
 * @param {function} afterAllLoad 所有材质都load之后
 * @returns {function} loadTexture
 */
function createTextureLoader(texCount, afterAllLoad) {
  const texUnitActive = {};

  for (let i = 0; i < texCount; i++) {
    texUnitActive[`TEXTURE${i}`] = false;
  }

  return (
    gl, texture, sampleLocation,
    image, texUnit,
  ) => {
    const texUnitKey = `TEXTURE${texUnit}`;
    texUnitActive[texUnitKey] = true;

    // 图像y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl[texUnitKey]);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (powerOf2(image.width) && powerOf2(image.height)) {
      // mipmap 图片被预处理成多个相差2的指数倍数的图片
      // 需要宽高都是2的指数次方才可以生成
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // 配置纹理参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // 纹理水平填充
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // 纹理垂直填充
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);    // 纹理缩小方式
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);    // 纹理放大方式
    }

    // 将texUnit号纹理传递给着色器的取样器变量
    gl.uniform1i(sampleLocation, texUnit);

    // 所有纹理都load了，可以进行绘制
    if (Object.values(texUnitActive).every(Boolean)) {
      afterAllLoad();
    }
  }
}

const Utils = {
  initShader,
  initGl,
  reactive,
  effect,
  convertCanvasCoordinateToGl,
  createBuffer,
  createTextureLoader,
}






