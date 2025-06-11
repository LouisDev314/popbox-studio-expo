import Config from 'react-native-config';

const EnvConfig = {
  apiBaseUrl: Config.API_BASE_URL || '',
  encryptionKey: Config.ENCRYPTION_KEY || '',
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
