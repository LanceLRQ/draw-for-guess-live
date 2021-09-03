import React, { useEffect } from 'react';
import CatImg from '@/images/cat.jpg';
import { ClearModeDrawPanel } from '../dashboard/clear_mode_draw_panel';
import { GameClient } from '../logic/network';

let gameClient = null;
let drawBoard = null;

export const LiveBoardView = () => {
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
    gameClient.Connect('ws://localhost:8975/api/dashboard/service').then(() => {});
    window.game = gameClient;
  }, []);
  return <div className="app-draw-and-guess-game live-board">
    <ClearModeDrawPanel
      readonly
      width={960}
      height={540}
      onInit={(db) => {
        drawBoard = db;
      }}
      onDestroy={() => {
        drawBoard = null;
      }}
      targetImage={CatImg}
    />
  </div>;
};
