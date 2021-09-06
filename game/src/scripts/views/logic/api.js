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
  },
};
