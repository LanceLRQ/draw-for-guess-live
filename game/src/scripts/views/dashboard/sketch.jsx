import React, { useEffect } from 'react';
import {
  Result
} from 'antd';
import { RestoreDrawing } from '@/scripts/views/logic/restore_common';
import { ChatLayout } from '@/scripts/views/dashboard/components/chat_layout';
import { useSelector } from 'react-redux';
import { EraserModeDrawPanel } from './components/eraser_mode';
import { GameClient } from '../logic/network';

let gameClient = null;
let drawBoard = null;

export const SketchView = () => {
  const drawingHistory = useSelector((state) => state.game_status.drawing_history);
  const currentId = useSelector((state) => state.game_status.current_id);
  const currentRiddle = useSelector((state) => state.game_status.current_riddle);

  useEffect(() => {
    gameClient = new GameClient();
    gameClient.Connect(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${process.env.API_HOST}/api/dashboard/service`).then(() => {});
    return () => {
      gameClient.Close();
    };
  }, []);
  return <div className="app-draw-and-guess-game">
    <div className="sketch-layout">
      {currentId > 0 ? <EraserModeDrawPanel
        key="board"
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
        onChange={(msg) => {
          gameClient?.client.emit('draw', msg);
        }}
        onReset={() => {
          gameClient?.client.emit('clear');
        }}
        onUndo={() => {
          gameClient?.client.emit('undo');
        }}
        targetImage={`//${process.env.API_HOST}/${currentRiddle.image}?m=${currentRiddle.update_time}`}
      /> : <div className="game-ready">
        <Result
          title="请在右边选择图片开始游戏"
        />
      </div>}
    </div>
    <ChatLayout />
  </div>;
};
