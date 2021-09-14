export class DrawBoardPoint {
  a: number = 0;   // 0 - moveTo; 1 - lineTo; 99 - action_divider

  x: number = 0;

  y: number = 0;

  constructor(a:number, x:number, y:number) {
    this.a = a;
    this.x = x;
    this.y = y;
  }
}
