import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RestoreDrawing } from '@/scripts/views/logic/restore_common';
import { EraserModeDrawPanel } from '../dashboard/components/eraser_mode';
import { GameClient } from '../logic/network';

let gameClient = null;
let drawBoard = null;

export const LiveBoardView = () => {
  const drawingHistory = useSelector((state) => state.game_status.drawing_history);
  const currentId = useSelector((state) => state.game_status.current_id);
  const currentRiddle = useSelector((state) => state.game_status.current_riddle);
  useEffect(() => {
    gameClient = new GameClient();
    gameClient.handleDrawAction = (msg) => {
      drawBoard?.command(JSON.parse(msg));
    };
    gameClient.handleUndoAction = () => {
      drawBoard?.undo();
    };
    gameClient.handleClearAction = () => {
      drawBoard?.reset();
    };
    gameClient.Connect(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${process.env.API_HOST}/api/dashboard/service`).then(() => {});
    return () => {
      gameClient.Close();
    };
  }, []);
  return <div className="app-draw-and-guess-game live-board">
    {currentId > 0 ? <EraserModeDrawPanel
      key={`board_${currentId}`}
      readonly
      width={960}
      height={540}
      onInit={(db) => {
        drawBoard = db;
        // 恢复画板
        RestoreDrawing(drawingHistory, drawBoard);
      }}
      onDestroy={() => {
        drawBoard = null;
      }}
      targetImage={`//${process.env.API_HOST}/${currentRiddle.image}?m=${currentRiddle.update_time}`}
    /> : <div className="board-placeholder">绘图画板区域</div>}
  </div>;
};
