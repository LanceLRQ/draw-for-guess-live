import { noop } from 'lodash';
import { DrawBoardPoint } from './structs/points';
import { DrawBoardMessage } from './structs/message';
import { DrawBoardPencilAction } from './structs/actions';

export class EraserModeDrawLogic {
  // canvas dom
  canvas:HTMLCanvasElement = null

  // canvas context
  ctx: CanvasRenderingContext2D = null;

  // cursor element
  cursorEl:HTMLElement = null;

  // is drawing
  drawing:boolean = false;

  // 只读模式：只读时mask是纯白色的；否则是有一定透明度的。
  readonly :boolean = false;

  pencilWidth: number = 11;

  pencilShape: string = 'circle';

  // 光标类型
  cursorType: string = 'pencil';

  // 历史命令栈
  cmdHistoryStack: DrawBoardMessage[] = [];

  // 画图操作栈
  drawStack: any[] = [];

  // 监听变更事件
  onChange: Function = noop;

  // 画图监听
  drawingWatcher: any = null;

  constructor(c:HTMLCanvasElement, cursor:HTMLElement) {
    this.canvas = c;
    this.ctx = this.canvas.getContext('2d');
    this.cursorEl = cursor;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.drawingWatcherFunc = this.drawingWatcherFunc.bind(this);
  }

  init() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.reset()
    if (!this.drawingWatcher) {
      clearInterval(this.drawingWatcher);
    }
    this.drawingWatcher = setInterval(this.drawingWatcherFunc, 100);
  }

  destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    if (!this.drawingWatcher) {
      clearInterval(this.drawingWatcher);
    }
    this.drawingWatcher = null;
  }

  command(msg:DrawBoardMessage, inline = false) {
    try {
      switch (msg.action) {
        case 'pencil':
        {
          // this.cmdHistoryStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
          const params:DrawBoardPencilAction = <DrawBoardPencilAction>msg.params;
          this.ctx.globalCompositeOperation = "destination-out";
          this.ctx.strokeStyle = '#FFF';
          this.ctx.lineWidth = params.width;
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';
          this.ctx.beginPath();
          params.points.forEach((point:DrawBoardPoint) => {
            switch (point.a) {
              case 1: /// lineTo:
                this.ctx.lineTo(point.x, point.y);
                this.ctx.stroke();
                break;
              case 0:
                this.ctx.moveTo(point.x, point.y);
                break;
              default:
                break;
            }
          });
          this.ctx.closePath();
          !inline && this.cmdHistoryStack.push(msg);
          break;
        }
        case 'draw_end':
          !inline && this.cmdHistoryStack.push(msg);
          break;
        case 'reset':
          this.reset();
          break;
        case 'undo':
          this.undo();
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(`exec canvas command error: ${e}`);      // eslint-disable-line
      console.error(e);      // eslint-disable-line
    }
  }

  undo() {
    // if (this.cmdHistoryStack.length > 0) {
    //   this.ctx.putImageData(this.cmdHistoryStack.pop(), 0, 0);
    // }
    let cmd: DrawBoardMessage = null;
    do {
      cmd = this.cmdHistoryStack.pop();
    } while (cmd && cmd.action != 'draw_end');
    this.resetSketch();
    this.cmdHistoryStack.forEach(cmd => {
      this.command(cmd, true);
    })
  }

  resetSketch() {
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.readonly) {
      this.ctx.globalAlpha = 0.7;
    }

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  reset() {
    this.cmdHistoryStack = [];
    this.drawStack = [];
    this.resetSketch();
  }


  setPencilStyle(width:number) {
    this.pencilWidth = width;
  }

  setCursorType(type:string) {
    this.cursorType = type;
  }

  handleMouseDown(ev:MouseEvent) {
    if (this.readonly) return;
    // 设置分割线
    const cmd = new DrawBoardMessage(
        'draw_end', null
    );
    this.cmdHistoryStack.push(cmd);
    this.onChange(cmd);
    // 启动画图
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.strokeStyle = '#FFF';
    this.ctx.lineWidth = this.pencilWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.moveTo(ev.offsetX, ev.offsetY);
    this.drawStack.push(new DrawBoardPoint(0, ev.offsetX, ev.offsetY));

  }

  handleMouseMove(ev:MouseEvent) {
    if (this.drawing) {
      this.ctx.lineTo(ev.offsetX, ev.offsetY);
      this.ctx.stroke();
      this.drawStack.push(new DrawBoardPoint(1, ev.offsetX, ev.offsetY));
    }
    this.cursorEl.style.display = 'block';
    this.cursorEl.style.left = `${this.canvas.offsetLeft + ev.offsetX - (this.pencilWidth / 2)}px`;
    this.cursorEl.style.top = `${this.canvas.offsetTop + ev.offsetY - (this.pencilWidth / 2)}px`;
    document.body.style.cursor = 'none';
  }

  handleMouseLeave() {
    this.cursorEl.style.display = 'none';
    document.body.style.cursor = 'default';
    this.closeDrawing();
  }

  handleMouseUp() {
    this.closeDrawing();
  }

  drawingWatcherFunc() {
    if (this.drawStack.length > 1) {
      const cmd = new DrawBoardMessage(
          'pencil',
          new DrawBoardPencilAction( this.pencilShape, this.pencilWidth, [...this.drawStack])
      );
      // 推入命令栈
      this.cmdHistoryStack.push(cmd);
      this.onChange(cmd);
    }
  }

  closeDrawing() {
    if (this.drawing) {
      this.ctx.closePath();
      this.drawing = false;
      // if (this.drawStack.length > 1) {
      //   this.onChange(new DrawBoardMessage(
      //     'pencil',
      //     new DrawBoardPencilAction( this.pencilShape, this.pencilWidth, [...this.drawStack]))
      //   );
      // }
      this.drawStack = [];
    }
  }
}
