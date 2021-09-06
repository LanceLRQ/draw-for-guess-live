import 'antd/dist/antd.less';
import '@/styles/index.scss';
import '@/styles/draw/draw.scss';
import { Layout, Menu, Spin } from 'antd';

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { matchPath } from 'react-router';
import {initGameStatus} from '@/scripts/store/sagas';
import {useDispatch, useSelector} from 'react-redux';
// import { useQuery } from 'react-query';
// import { API } from '../logic/api';

const { Header, Content, Footer } = Layout;

const TabMenu = [
  {
    key: 'index',
    match: '/dashboard/index',
    url: '/dashboard/index',
    title: '设置',
  },
  {
    key: 'sketch',
    match: '/dashboard/sketch',
    url: '/dashboard/sketch',
    title: '画板',
  },
  {
    key: 'live',
    match: '/live',
    url: '/live',
    title: '直播视角',
  }
];

export const RootView = withRouter((props) => {
  const { route, location, history } = props;
  const [tabKey, setTabKey] = useState('home');
  const isInited = useSelector((state) => state.game_status?.init);
  const dispatch = useDispatch();
  // const { status, data: gameStatus } = useQuery('get_game_status', API.Dashboard.GetGameStatus);
  // console.log(gameStatus, status);
  useEffect(() => {
    dispatch(initGameStatus());
  }, []);
  useEffect(() => {
    const rel = TabMenu.find((item) => {
      return matchPath(location.pathname, {
        path: item.match,
      });
    });
    if (rel) setTabKey(rel.key);
  }, [location]);

  return (isInited ? <Layout className="website-main-layout">
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[tabKey]}
        onSelect={({ key }) => {
          setTabKey(key);
          history.push({
            pathname: TabMenu.find((item) => item.key === key).url,
          });
        }}
      >
        {TabMenu.map((item) => <Menu.Item
          key={item.key}
        >
          {item.title}
        </Menu.Item>)}
      </Menu>
    </Header>
    <Content className="website-content-layout">
      {renderRoutes(route.routes)}
    </Content>
    <Footer>&copy; 2021 LanceLRQ </Footer>
  </Layout> : <Spin />);
});
