import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas';

// 创建Saga中间件
const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    // 当Saga出现错误的时候，可以在这里处理错误信息
  },
});

// 让Redux的开发插件可以检测到由中间件带来的Store改变
const disabledReduxExt = (process.env.NODE_ENV === 'production');
const composeEnhancers = disabledReduxExt ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose); // eslint-disable-line
const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware));

const initState = {};
const reducer = require('./reducers').createRootReducer();

export const store = createStore(
  reducer,
  (process.SSR_MODE === 'on') ? (window.__INITIAL_STATE__ || initState) : initState,     // eslint-disable-line
  enhancers
);

// 注册Saga (一定要在createStore完以后才能调用)
sagaMiddleware.run(rootSaga);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(require('./reducers').createRootReducer());
  });
}

export default store;
