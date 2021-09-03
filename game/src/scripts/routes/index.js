import Views from '../views/index';

export const routes = [
  {
    component: Views.Fragment,
    routes: [
      {
        path: '/',
        exact: true,
        component: Views.HomePage,       // 主页
      },
      {
        path: '/dashboard',
        component: Views.Dashboard.RootView,
        routes: [
          {
            path: '/dashboard/index',
            exact: true,
            component: Views.Dashboard.SettingView,   // 画板页面
          },
          {
            path: '/dashboard/sketch',
            exact: true,
            component: Views.Dashboard.SketchView,   // 画板页面
          }
        ],
      },
      {
        path: '/draw',
        component: Views.Live.LiveBoardView,    // 画板页面
      }
    ],
  }
];
