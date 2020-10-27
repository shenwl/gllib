/**
 * 一个简单的人形模型，树状模型：
 * 
 *          模型
 *    头              身体(概念节点)
 *            手臂*2      身体      腿*2
 *             手臂                  腿（和手臂一样的圆柱体）
 * 
 * 下层的每个节点有个继承而来的矩阵(跟随旋转)，和一个自己的矩阵(自己旋转)
 */
import { Shapes, Matrix4, Mesh, Model, Utils } from '../../lib/index';
import { Shape } from '../../lib/shape/type';
import face from '../common/images/face.jpg';
import body from '../common/images/body.jpg';
import arm from '../common/images/arm.jpg';


const { createD3Cylinder } = Shapes;

const pickShapeParams = (shape: Shape) => {
  const { vertexes, indices, texCoords, norms } = shape;
  return {
    vertexes,
    indices,
    texCoords,
    norms,
  }
}

const timing = new Utils.Timing();

type ArmProps = {
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  isLeft: boolean,
  length: number,
  x: number,
  y: number,
  size: number,
  angleX: number,
  angleZ: number,
  level?: number,
}

class Head extends Model {
  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    super(gl, program, new Mesh({ gl, program, ...pickShapeParams(Shapes.createD3Sphere(0.3))}));

    const mat4 = new Matrix4();
    this.setUnitMatrix(mat4.translate(0, 0.9, 0).rotate(90, 0, 1, 0));
    this.addTextureImage(face);
  }

  lookAt = (angle: number) => {
    const mat4 = new Matrix4();
    this.setUnitMatrix(mat4.translate(0, 0.8, 0).rotate(90 + angle, 0, 1, 0));
  }
}
class Body extends Model {
  name: string;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    super(gl, program, new Mesh({ gl, program, ...pickShapeParams(Shapes.d3Cube) }));
    this.name = 'body';

    const mat4 = new Matrix4();
    this.setUnitMatrix(mat4.scale(0.3, 0.5, 0.25));
    this.addTextureImage(body);
  }
}

class Arm extends Model {
  level: number;
  x: number;
  y: number;
  length: number;
  angleX: number;
  angleZ: number;

  private matrix(angleX: number, angleZ: number) {
    const mat4 = new Matrix4();

    mat4.translate(0, -this.length / 2, 0);
    if (angleX) mat4.rotate(angleX, 1, 0, 0);
    if (angleZ) mat4.rotate(angleZ, 0, 0, 1);
    mat4.translate(0, this.length / 2, 0);
    mat4.translate(this.x, this.y, 0);

    return mat4;
  }

  constructor({ gl, program, isLeft, length, x, y, size, angleX, angleZ, level = 0 }: ArmProps) {
    super(gl, program, new Mesh({ gl, program, ...pickShapeParams(createD3Cylinder(size, length))}));
    this.level = level;
    this.x = x;
    this.y = y;
    this.length = length;

    this.setUnitMatrix(this.matrix(angleX, angleZ));
    this.addTextureImage(arm);

    if (this.level < 1) {
      const sign = isLeft ? 1 : -1
      this.addChild(new Arm({
        gl,
        program,
        isLeft,
        x: 0,
        y: -length,
        angleX: 0,
        angleZ: sign * 0.3 * Math.PI,
        length,
        size: .08,
        level: this.level + 1,
      }))
    }
  }

  rotate(angleX: number, angleZ: number) {
    this.setUnitMatrix(this.matrix(angleX, angleZ))
  }
}

class Leg extends Arm { };

export default class Robot extends Model {
  head: Head;
  body: Body;
  leftArm: Arm;
  rightArm: Arm;
  leftLeg: Leg;
  rightLeg: Leg;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    super(gl, program);
    this.head = new Head(gl, program);
    this.body = new Body(gl, program);
    this.leftArm = new Arm({
      gl, program, isLeft: true, length: 0.5, size: 0.1, x: -0.51, y: -0.1, angleX: 0, angleZ: -36,
    });
    this.rightArm = new Arm({
      gl, program, isLeft: false, length: 0.5, size: 0.1, x: 0.51, y: -0.1, angleX: 0, angleZ: 36,
    });
    this.leftLeg = new Leg({
      gl, program, isLeft: true, length: 0.8, size: 0.15, x: -0.2, y: -0.65, angleX: 0, angleZ: -18,
    });
    this.rightLeg = new Leg({
      gl, program, isLeft: false, length: 0.8, size: 0.15, x: 0.2, y: -0.65, angleX: 0, angleZ: 18,
    });

    this.addChild(this.head);
    this.addChild(this.body);
    this.addChild(this.leftArm);
    this.addChild(this.rightArm);
    this.addChild(this.leftLeg);
    this.addChild(this.rightLeg);
  }

  lookAt = (angleX: number) => {
    this.head.lookAt(angleX);
  }

  /**
   * 产生一个行走动画，包含行走，摆臂，和摇头
   */
  walk = () => {
    let SPEED = 200;
    let MAX_ANGLE = 180 * 0.25;
    timing.listen(({ nowToListenAt }) => {
      // 产生一个挥手的动画
      const stage = Math.floor(nowToListenAt / SPEED) % 4;
      let ax = null;

      // 挥手动画有3个阶段(往前往后)
      // 0 -> | [0, A]
      // 1 <- , 2 <- [A, -A]
      // 3 -> [-A, 0]
      switch (stage) {
        case 0: {
          const t = nowToListenAt % SPEED;
          ax = (t / SPEED) * MAX_ANGLE;
          break
        }
        case 1:
        case 2: {
          const t = (nowToListenAt - SPEED) % (2 * SPEED);
          ax = MAX_ANGLE - 2 * MAX_ANGLE * (t / (2 * SPEED));
          break
        }
        case 3: {
          const t = (nowToListenAt - 3 * SPEED) % SPEED;
          ax = -MAX_ANGLE + MAX_ANGLE * (t / SPEED);
          break;
        }
      }

      this.head.lookAt(ax * 0.3);
      this.leftArm.rotate(ax * 0.3, -18);
      (this.leftArm.children[0] as Arm).rotate(ax * 0.3, 0);
      this.rightArm.rotate(-ax * 0.3, 18);
      (this.rightArm.children[0] as Arm).rotate(-ax * 0.3, 0);
      this.leftLeg.rotate(-ax, -5);
      this.rightLeg.rotate(ax, 5);
    });
    timing.start();
  }
}