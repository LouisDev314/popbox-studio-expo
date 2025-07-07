const EnvConfig = {
  apiBaseUrl: 'https://popbox-studio.onrender.com/api/v1',
  encryptionKey: 'mmkv-storage-encryption-key',
  // webClientId: '308017225163-i826kctmutk5f0r4e4o9mse3lpnqijqq.apps.googleusercontent.com',
  iosClientId: '1096354518994-1drt1oq3davk9bgab61v89t917a8kbpo.apps.googleusercontent.com',
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
