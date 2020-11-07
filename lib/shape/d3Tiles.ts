import { Shape } from "./type";
import { Mesh } from '../model/mesh';

export function d3Tiles(size: number, width: number, height: number): Shape {
  const vertexes = []
  const texCoords = []
  const colors = []
  const ids = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x * size
      const py = y * size

      // 四边形，两个三角形组成
      vertexes.push(
        px, -1, py,
        px + size, -1, py,
        px + size, -1, py + size,

        px, -1, py,
        px, -1, py + size,
        px + size, -1, py + size
      );

      texCoords.push(
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        0, 1,
        1, 1
      );

      const id = x * 1000 + y;

      for (let k = 0; k < 6; k++) {
        colors.push(
          (id & 255) / 255,
          ((id >> 8) & 255) / 255,
          ((id >> 16) & 255) / 255
        );
      }
      ids.push(id, id, id, id, id, id);
    }
  }
  return { vertexes, texCoords, indices: [], colors };
}

d3Tiles.getMesh = function (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  size: number, width: number, height: number
) {
  const { vertexes, texCoords, colors } = d3Tiles(size, width, height);
  const mesh = new Mesh({ gl, program, vertexes, texCoords, colors });
  return mesh;
}