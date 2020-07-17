export function perspective(fov: number, aspect: number, zNear: number, zFar: number) {

  var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  var rangeInv = 1.0 / (zNear- zFar);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2, 0
  ];

}
