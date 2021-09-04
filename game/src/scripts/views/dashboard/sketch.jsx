import React, { useEffect } from 'react';
import CatImg from '@/images/cat.jpg';
import {
  Button, Col, Input, Row
} from 'antd';
import { ClearModeDrawPanel } from './clear_mode_draw_panel';
import { GameClient } from '../logic/network';
import { DanmakuList } from './danmaku_list';

let gameClient = null;
let drawBoard = null;

export const SketchView = () => {
  useEffect(() => {
    gameClient = new GameClient();
    gameClient.Connect('ws://localhost:8975/api/dashboard/service').then((res) => {});
    window.game = gameClient;
    return () => {
      gameClient.Close();
    };
  }, []);
  return <div className="app-draw-and-guess-game">
    <div className="sketch-layout">
      <ClearModeDrawPanel
        width={960}
        height={540}
        onInit={(db) => {
          drawBoard = db;
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
        targetImage={CatImg}
      />
    </div>
    <div className="chat-layout">
      <div className="chat-list">
        <DanmakuList />
      </div>
      <div className="input-area">
        <Row gutter={8}>
          <Col flex={1}>
            <Input />
          </Col>
          <Col flex={0}>
            <Button type="primary">发送</Button>
          </Col>
        </Row>
      </div>
    </div>
  </div>;
};
