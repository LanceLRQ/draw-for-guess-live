import React from 'react';
import { List } from 'antd';
// import T from 'prop-types';
import { useSelector } from 'react-redux';

export const DanmakuList = () => {
  const danmakuList = useSelector((state) => {
    return state.danmaku.history;
  });
  return <List
    size="small"
    dataSource={danmakuList}
    renderItem={(item) => <List.Item key={item.id}>
      <div><strong>{item?.uname}：</strong>{item.text}</div>
    </List.Item>}
  />;
};
