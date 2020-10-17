interface ISrc {
    elements?: Float32Array
}

declare class Vector3 {
    elements: Float32Array; // length: 3

    constructor(options?: ISrc);

    normalize(): Vector3;
}

declare class Vector4 {
    elements: Float32Array; // length: 4

    constructor(options?: ISrc);
}

declare class Matrix4 {
    elements: Float32Array; // length: 16 (4 * 4)

    constructor(options?: ISrc);

    setIdentity(): Matrix4;
    set(src: ISrc): Matrix4;
    concat(src: ISrc): Matrix4;
    multiply(src: ISrc): Matrix4;
    set(src: ISrc): Matrix4;
    multiplyVector3(vec: Vector3): Vector3;
    multiplyVector4(vec: Vector4): Vector4;
    transpose(): Matrix4;
    setInverseOf(matrix4: Matrix4): Matrix4;
    invert(): Matrix4;
    setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
    perspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
    setScale(x: number, y: number, z: number): Matrix4;
    scale(x: number, y: number, z: number): Matrix4;
    setTranslate(x: number, y: number, z: number): Matrix4;
    translate(x: number, y: number, z: number): Matrix4;
    setRotate(angle: number, x: number, y: number, z: number): Matrix4;
    rotate(angle: number, x: number, y: number, z: number): Matrix4;

    setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): Matrix4;
    lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): Matrix4;

    // dropShadow(): Matrix4;
    // dropShadowDirectionally(): Matrix4;
}