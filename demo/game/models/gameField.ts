import { Model } from "../../../lib";

export interface IGame { };

export default class GameField extends Model {
  game: IGame;
  
  constructor(gl: WebGLRenderingContext, program: WebGLProgram, game: IGame) {
    super(gl, program);
    const mapLine: string = getRepeatString(100);
    const map: string[] = [
      mapLine,
      mapLine,
      mapLine,
    ]
    this.game = game;
  }

}

function getRepeatString(num: number, per: string = '.'): string {
  let acc = '';
  for (let i = 0; i < num; i++) {
    acc += per;
  }
  return acc;
}