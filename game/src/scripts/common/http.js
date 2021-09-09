import { get  } from 'lodash';
import qs from 'qs';
import axios, { CancelToken } from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const HTTP_SERVER_ERROR = 500;
const HTTP_SERVER_GATEWAY_TIMEOUT = 502;
const HTTP_NOT_FOUND = 404;
const HTTP_NOT_ALLOW = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_METHOD_NOT_ALLOW = 405;
const HTTP_REQUEST_TOO_LARGE = 413;

const customAxios = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true,
});

customAxios.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.data = qs.stringify(config.data);
  return config;
});

export class ApiError extends Error {
  constructor(reason) {
    super();
    this.isApiError = true;
    this.message = get(reason, 'message', '未知的错误类型');
    this.debug = get(reason, 'debug', null);
    this.code = get(reason, 'code', 0);
    console.error(`(${this.code})${this.message}`);
  }
}

export class NetworkError extends Error {
  constructor() {
    super();
    this.message = '网络连接异常，请重试';
    console.warn(this.message);
  }
}

export class UserCancelRequestError extends Error {
  constructor() {
    super();
    this.message = '用户取消了请求操作';
    console.warn('debug', this.message);
  }
}

const defaultOptions = {
  url: '/',
  method: 'get',
  responseType: 'json',
  data: null,
  withCredentials: true,
  headers: {
    // 'Pref-Debug': 1,
  },
};

// 添加响应拦截器
customAxios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // 对响应错误做点什么
  if (axios.isCancel(error)) {
    throw new UserCancelRequestError();
  }
  if (error.response) {
    switch (error.response.status) {
      case HTTP_NOT_FOUND:
        throw new ApiError({
          code: error.response.status,
          message: '请求接口不存在',
        });
      case HTTP_NOT_ALLOW:
      case HTTP_FORBIDDEN:
        throw new ApiError({
          code: error.response.status,
          message: '请求的接口被禁用',
        });
      case HTTP_METHOD_NOT_ALLOW:
        throw new ApiError({
          code: error.response.status,
          message: '请求方式不被允许',
        });
      case HTTP_REQUEST_TOO_LARGE:
        throw new ApiError({
          code: error.response.status,
          message: '请求内容过大，无法正确处理',
        });
      case HTTP_SERVER_ERROR:
        throw new ApiError(get(error.response, 'data', {}));
      case HTTP_SERVER_GATEWAY_TIMEOUT:
        throw new ApiError({
          code: error.response.status,
          message: '服务端开小差啦，请稍后重试',
        });
      default:
        throw new ApiError({
          code: error.response.status,
          message: '未知的错误状态码',
        });
    }
  }
});

export const createApiClient = (path = '/api') => {
  const { API_HOST = '' } = process.env;
  // 如果不设置baseURL，则自动mapping到默认的接口
  const baseURL = `${window.location.protocol === 'http:' ? 'http:' : 'https:'}//${API_HOST}${path}`;
  return (options) => {
    const {
      ...requestOptions
    } = {
      ...defaultOptions,
      ...options,
    };
    const source = CancelToken.source();
    const instance = customAxios({
      baseURL,
      cancelToken: source.token,
      ...requestOptions,
    });
    return {
      result: instance,
      client: source,
    };
  };
};
