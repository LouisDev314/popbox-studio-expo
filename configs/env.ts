import Config from 'react-native-config';

const EnvConfig = {
  apiBaseUrl: Config.API_BASE_URL || 'https://popbox-studio.onrender.com/api/v1',
  encryptionKey: Config.ENCRYPTION_KEY || '',
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
