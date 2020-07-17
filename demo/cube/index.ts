import { Model, shapes, renderContext, matrix } from '../../lib/index';

const gl = renderContext.getGL();

function __main() {
  const mesh = shapes.d3Cube();
  const model = new Model(mesh);
  gl.viewport(0, 0, 500, 500);

  const mPerspect = matrix.perspective(
    Math.PI * 0.6, gl.canvas.width / gl.canvas.height, 0, 100
  );

  let angle = 0.0;

  model.setMatrixUniform('u_project', mPerspect);

  function draw() {
    const rotateYMatrix = matrix.rotateY(angle);
    model.setMatrixUniform('u_rotatey', rotateYMatrix);
    model.draw();
    angle += 0.01;
    requestAnimationFrame(draw);
  }

  draw();
}

__main();
