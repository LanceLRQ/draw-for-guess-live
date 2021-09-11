import React, { useState } from 'react';
import { Menu } from 'antd';
import { ImagesList } from '@/scripts/views/dashboard/components/images_list';
import { DanmakuList } from '@/scripts/views/dashboard/components/danmaku_list';
import { useSelector } from 'react-redux';

export const ChatLayout = () => {
  const currentId = useSelector((state) => state.game_status.current_id);
  const [chatTabKey, setChatTabKey] = useState(currentId <= 0 ? 'select' : 'round');
  return <div className="chat-layout">
    <div className="tab-layout">
      <Menu
        onSelect={({ key }) => { setChatTabKey(key); }}
        selectedKeys={[chatTabKey]}
        mode="horizontal"
      >
        <Menu.Item key="select">选择题目</Menu.Item>
        <Menu.Item key="round" disabled={currentId <= 0}>当前回合</Menu.Item>
        <Menu.Item key="global">全局弹幕</Menu.Item>
      </Menu>
    </div>
    <div className="chat-list">
      {chatTabKey === 'select' ? <ImagesList /> : <DanmakuList mode={chatTabKey} />}
    </div>
  </div>;
};
