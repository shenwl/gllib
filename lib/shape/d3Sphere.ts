export interface ID3Sphere {
  vertexes: number[];
  indices: number[];
  textCoord: number[];
  randomColors: number[];
}

/**
 * 两次旋转可以得到球面
 * 以三位坐标轴原点为圆心，(r, θ(与x轴的夹角, [0, 2pi]), φ(与y轴夹角, [0, pi]))能确认球面上的一个点：
 * y = r * cosφ, x = r * sinφ * cosθ, z = r * sinφ * sinθ
 * 
 */
export const createD3Sphere = (r: number = 1, n: number = 20, m: number = 10): ID3Sphere => {
  // [0, 2pi]
  const vertexes: number[] = [];
  const indices: number[] = [];
  const textCoord: number[] = [];
  const randomColors: number[] = [];

  for (let y = 0; y <= m; y++) {
    for (let x = 0; x <= n; x++) {
      // 区间映射
      const u = x / n;
      const v = y / m;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // 球面上的点
      const px = Math.sin(phi) * Math.cos(theta) * r;
      const py = Math.cos(phi) * r;
      const pz = Math.sin(phi) * Math.sin(theta) * r;
      vertexes.push(px, py, pz);

      randomColors.push(Math.random(), Math.random(), Math.random(), 1);
    }
  }

  // 生成三角形网格
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < m; y++) {
      // 4组点:
      // (x, y+1), (x+1, y+1)
      // (x, y) (x+1, y)

      // 第一组三角形: (x, y) (x+1, y) (x, y+1)
      indices.push(
        x + y * (n + 1),
        x + 1 + y * (n + 1),
        x + (y + 1) * (n + 1),
      );

      // 第二组三角形: (x, y) (x+1, y) (x+1, y+1)
      indices.push(
        x + 1 + y * (n + 1),
        x + (y + 1) * (n + 1),
        x + 1 + y * (n + 1),
      );
    }
  }

  return {
    vertexes,
    indices,
    textCoord,
    randomColors,
  };
}

export const d3Sphere = createD3Sphere();

