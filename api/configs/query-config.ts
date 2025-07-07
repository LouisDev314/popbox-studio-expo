import appClient from '@/api/app-client';

const QueryConfigs = {
  fetchAllProducts: async () => {
    return await appClient.get('/product');
  },
};

export default QueryConfigs;
