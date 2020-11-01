import { powerOf2 } from '../utils';

let counter = 0;
const textures: { [key: string]: { texture: WebGLTexture, id: number } } = {};

export default class ImageTexture {
  static createTextureIfNotExits(gl: WebGLRenderingContext, src: string) {
    if (!textures[src]) {
      const texture = gl.createTexture();
      gl.bindTexture(
        gl.TEXTURE_2D,
        texture
      );

      // @todo 可以在这放Image异步加载之前用的图像
      // gl.texImage2D(
      //   gl.TEXTURE_2D, // bind point(target)
      //   0, // level of detail(0 代表整张图片， n代表第n级的mipmap)
      //   gl.RGBA, // internal format 格式
      //   1, // width
      //   1, // height
      //   0, // border
      //   gl.RGBA, // 格式(format)
      //   gl.UNSIGNED_BYTE,
      //   new Uint8Array([0, 255, 0, 255])
      // );

      const id = counter;
      counter++;

      const texUnitKey = `TEXTURE${id}`;
      textures[src] = { texture, id };

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      const image = new Image();
      image.src = src;

      image.onload = () => {
        gl.activeTexture((gl as any)[texUnitKey]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D, // bind point
          0, // level of detail
          gl.RGBA, // internal format
          gl.RGBA, // format
          gl.UNSIGNED_BYTE, // type
          image
        );

        if (powerOf2(image.width) && powerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }
      };
    };
    return textures[src];
  }

  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniform: string;
  src: string;
  texture: { texture: WebGLTexture, id: number };
  textureLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, src: string, uniform: string = 'u_Texture') {
    this.gl = gl
    this.program = program
    this.uniform = uniform
    this.src = src
    this.texture = ImageTexture.createTextureIfNotExits(gl, src);
  }


  associate() {
    this.textureLocation = this.gl.getUniformLocation(this.program, this.uniform);
    this.gl.uniform1i(this.textureLocation, this.texture.id);
  }
}
