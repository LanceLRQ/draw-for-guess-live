import React from 'react';
import {
  List, Image, Alert, Button
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { changeCurrentRiddle } from '@/scripts/store/sagas';

export const ImagesList = () => {
  const riddleList = useSelector((state) => state.riddles.list);
  const currentId = useSelector((state) => state.game_status.current_id);
  const dispatch = useDispatch();

  const handleChangeRiddle = (id) => {
    dispatch(changeCurrentRiddle({
      data: { id },
    }));
  };

  const riddleListSorted = [...riddleList];
  riddleListSorted.sort((a, b) => b.id - a.id);

  return <div className="images-list">
    {currentId > 0 && <Alert
      message="游戏正在进行中"
      type="success"
      banner
      action={
        <Button size="small" type="danger" onClick={() => handleChangeRiddle(0)}>结束游戏</Button>
      }
    />}
    <div className="list-content">
      <List
        itemLayout="horizontal"
        dataSource={riddleListSorted}
        renderItem={(item) => <List.Item>
          <List.Item.Meta
            avatar={<Image width={80} src={`//${process.env.API_HOST}/${item.image}?m=${item.update_time}`} />}
            title={item.keywords.join(',')}
          />
          {currentId === item.id ? <span>当前使用</span> : <a
            onClick={() => handleChangeRiddle(item.id)}
          >选用</a>}
        </List.Item>}
      />
    </div>
  </div>;
};
