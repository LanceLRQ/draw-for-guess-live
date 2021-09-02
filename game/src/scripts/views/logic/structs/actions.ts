import { DrawBoardPoint } from './points';

export class DrawBoardPencilAction {
  shape: string = 'circle';

  width: number = 11;

  points: DrawBoardPoint[] = [];

  constructor(shape:string, width:number, points:DrawBoardPoint[]) {
    this.shape = shape;
    this.width = width;
    this.points = points;
  }
}
