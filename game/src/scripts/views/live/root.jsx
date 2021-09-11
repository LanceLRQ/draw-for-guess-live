import 'antd/dist/antd.less';
import '@/styles/index.scss';
import '@/styles/draw/draw.scss';
import { Spin } from 'antd';

import React, { useEffect } from 'react';
import { initGameStatus } from '@/scripts/store/sagas';
import { useDispatch, useSelector } from 'react-redux';
import { LiveBoardView } from './board';

export const RootView = () => {
  const isInited = useSelector((state) => state.game_status?.init);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initGameStatus());
  }, []);

  return (isInited ? <LiveBoardView /> : <Spin />);
};
