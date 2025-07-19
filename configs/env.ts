const EnvConfig = {
  apiBaseUrl: 'https://popbox-studio.onrender.com/api/v1',
  encryptionKey: 'mmkv-storage-encryption-key',
  webClientId: '514703306740-k198nhqpicru8gtlfr71ulk9qu963dhb.apps.googleusercontent.com',
  iosClientId: '514703306740-h4gt50d8r59ht4m7pa5uv49820iu7l5r.apps.googleusercontent.com',
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: 'AIzaSyCKThvpTIAri-VR-6Ri6Srr3ryu1ru-p5g',
    authDomain: 'popbox-studio-4d450.firebaseapp.com',
    projectId: 'popbox-studio-4d450',
    storageBucket: 'popbox-studio-4d450.firebasestorage.app',
    messagingSenderId: '514703306740',
    appId: '1:514703306740:web:5987c5572d56ae913793a1',
    measurementId: 'G-N3TZG44VCT',
  },
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
