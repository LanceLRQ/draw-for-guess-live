import { message } from 'antd';
import { createApiClient } from '@/scripts/common/http';

const apiClient = createApiClient();

const LoginCheck = async () => {
  try {
    const resp = await apiClient({
      url: '/account/login',
    }).result;
    return resp.data;
  } catch (e) {
    return null;
  }
};

const DoLogin = async (data) => {
  try {
    const resp = await apiClient({
      method: 'post',
      url: '/account/login',
      data,
    }).result;
    return resp.data;
  } catch (e) {
    message.error(e.message);
    return null;
  }
};

export default {
  API: {
    LoginCheck,
    DoLogin,
  },
};
