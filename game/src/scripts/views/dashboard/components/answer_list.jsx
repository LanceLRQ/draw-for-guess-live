import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, List } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';

const rankColor = { 0: '#95de64', 1: '#ffd666', 2: '#ff7875' };

export const AnswerList = () => {
  const danmakuRankList = useSelector((state) => {
    const danmakuList = state.danmaku?.current;
    const keywords = state.game_status?.current_riddle?.keywords ?? [];
    let i = 0;
    const rankList = danmakuList.filter((item) => {
      for (i = 0; i < keywords.length; i++) {
        if (item.text === keywords[i]) {
          return true;
        }
      }
      return false;
    });
    rankList.sort((a, b) => (b.receive_time < a.receive_time ? 1 : -1));
    return uniqBy(rankList, 'uid');
  });
  return <div className="answer-list">
    <List
      itemLayout="horizontal"
      dataSource={danmakuRankList}
      renderItem={(item, index) => <List.Item>
        <List.Item.Meta
          avatar={<Avatar size={40} style={{ backgroundColor: rankColor[index] || '#bfbfbf' }}>{index + 1}</Avatar>}
          title={item.uname}
          description={dayjs((item.receive_time * 1000)).format('YYYY-MM-DD HH:mm:ss')}
        />
        <div>{item.text}</div>
      </List.Item>}
    />
  </div>;
};
