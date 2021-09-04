import React, { useEffect, useState } from 'react';
import CatImg from '@/images/cat.jpg';
import {
  Button, Col, Input, Row, Menu
} from 'antd';
import { ClearModeDrawPanel } from './clear_mode_draw_panel';
import { GameClient } from '../logic/network';
import { DanmakuList } from './danmaku_list';

let gameClient = null;
let drawBoard = null;

export const SketchView = () => {
  const [chatTabKey, setChatTabKey] = useState('global');
  useEffect(() => {
    gameClient = new GameClient();
    gameClient.Connect('ws://localhost:8975/api/dashboard/service').then(() => {});
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
      <div className="tab-layout">
        <Menu
          onSelect={({ key }) => { setChatTabKey(key); }}
          selectedKeys={[chatTabKey]}
          mode="horizontal"
        >
          <Menu.Item key="current">当前回合</Menu.Item>
          <Menu.Item key="global">全局弹幕</Menu.Item>
        </Menu>
      </div>
      <div className="chat-list">
        <DanmakuList />
      </div>
    </div>
  </div>;
};
