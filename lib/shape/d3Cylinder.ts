export interface ID3Cylinder {
  vertexes: number[];
  indices: number[];
  texCoords: number[];
}

/**
 * 创建圆柱体
 * @param r 半径
 * @param l 长
 * @param n 点的个数
 */
export const createD3Cylinder = (r: number, l: number, n: number = 100): ID3Cylinder => {
  const vertexes: number[] = [];
  const indices: number[] = [];
  const texCoords: number[] = [];

  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const theta = Math.PI * 2 * u;

    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);

    vertexes.push(x, -l / 2, z)
    texCoords.push(u, 0)
    vertexes.push(x, l / 2, z)
    texCoords.push(u, 1)
  }

  for (let i = 0; i < n; i++) {
    indices.push(i * 2, i * 2 + 1, (i + 1) * 2)
    indices.push(i * 2 + 1, (i + 1) * 2, (i + 1) * 2 + 1)
  }

  return {
    vertexes,
    indices,
    texCoords,
  };
}

