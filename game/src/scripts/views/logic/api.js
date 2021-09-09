import { createApiClient } from '@/scripts/common/http';

const RawAPIClient = createApiClient();

export const API = {
  Dashboard: {
    GetGameStatus: async (params) => {
      const res = await RawAPIClient({
        url: '/dashboard/game_status',
        params,
      });
      return res.result;
    },
    GetRiddleList: async (params) => {
      const res = await RawAPIClient({
        url: '/dashboard/riddle/list',
        params,
      });
      return res.result;
    },
    addRiddle: async (data) => {
      const res = await RawAPIClient({
        url: '/dashboard/riddle/add',
        method: 'post',
        data,
      });
      return res.result;
    },
    editRiddle: async (data) => {
      const res = await RawAPIClient({
        url: '/dashboard/riddle/edit',
        method: 'post',
        data,
      });
      return res.result;
    },
  },
};
