import React, { useEffect, useState } from 'react';
import CatImg from '@/images/cat.jpg';
import {
  Menu
} from 'antd';
import { EraserModeDrawPanel } from './components/eraser_mode';
import { GameClient } from '../logic/network';
import { DanmakuList } from './components/danmaku_list';

let gameClient = null;
let drawBoard = null;

export const SketchView = () => {
  const [chatTabKey, setChatTabKey] = useState('global');
  useEffect(() => {
    gameClient = new GameClient();
    gameClient.Connect(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${process.env.API_HOST}/api/dashboard/service`).then(() => {});
    window.game = gameClient;
    return () => {
      gameClient.Close();
    };
  }, []);
  return <div className="app-draw-and-guess-game">
    <div className="sketch-layout">
      <EraserModeDrawPanel
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
