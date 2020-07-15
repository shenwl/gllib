import { Mesh } from '../model/mesh';

// 用顶点画三角形组成“F”
export function d2F (
  x: number, y: number, width: number, height: number, thickness: number
): Mesh {
  const data = [
    // 左边竖
    x, y,
    x + thickness, y,
    x, y + height,
    x + thickness, y,
    x + thickness, y + height,
    // 第一个横杠
    x + thickness, y,
    x + width, y,
    x + thickness, y + thickness,
    x + thickness, y + thickness,
    x + width, y + thickness,
    // 第二个横杠
    x + thickness, y + thickness * 2,
    x + width, y + thickness * 2,
    x + thickness, y + thickness * 3,
    x + thickness, y + thickness * 3,
    x + width, y + thickness * 2,
    x + width, y + thickness * 3,
  ];
  return new Mesh({vertexes: data, dimension: 2 })
}
