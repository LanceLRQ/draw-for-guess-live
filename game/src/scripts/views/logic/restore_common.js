export const RestoreDrawing = (drawingHistory, drawBoard) => {
  // 恢复数据
  drawingHistory.forEach((item) => {
    switch (item.type) {
      case 'draw':
        drawBoard?.command(JSON.parse(item.msg));
        break;
      case 'undo':
        drawBoard?.undo();
        break;
      case 'reset':
        drawBoard?.reset();
        break;
      default:
        break;
    }
  });
};
