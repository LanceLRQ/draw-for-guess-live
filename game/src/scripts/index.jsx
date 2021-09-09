import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { routes } from './routes/index';

const queryClient = new QueryClient();

const render = (routesConf) => {
  // SSR 的时候用ReactDOM.hydrate，平时开发在dev-server的时候用ReactDOM.render
  const renderer = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderer(
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {renderRoutes(routesConf)}
          </QueryClientProvider>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>,
    document.getElementById('root')
  );
};

export const Startup = (ssr = false, path = '') => {
  if (ssr) {
    return <Provider store={store}>
      <StaticRouter location={path}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>;
  }
  render(routes);
  if (module.hot) {
    module.hot.accept('./routes/index', () => {
      render(require('./routes/index').routes);
    });
  }
  return null;
};
