import RenderContext from '../lib/renderContext';
import { Model, shapes, Mesh } from '../lib/index';

function __main() {
  const gl = RenderContext.getGL();
  const program = RenderContext.getProgram();

  const mesh: Mesh = shapes.d2F(100, 100, 100, 150, 30);
  const model: Model = new Model(mesh);
  // 随机颜色
  model.setVectorUniform('u_color', [
    Math.random(),
    Math.random(),
    Math.random(),
    1.0
  ]);
  // 分辨率
  model.setVectorUniform('u_resolution', [
    gl.canvas.width,
    gl.canvas.height,
  ]);
  model.draw();
}

__main()


