export class DrawBoardMessage {
  action: string = '';

  params: any = null;

  constructor(action:string, params:any) {
    this.action = action;
    this.params = params;
  }
}
