import Config from 'react-native-config';

const EnvConfig = {
  apiBaseUrl: Config.API_BASE_URL || '',
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
