const EnvConfig = {
  apiBaseUrl: 'https://popbox-studio.onrender.com/api/v1',
  // webClientId: '308017225163-i826kctmutk5f0r4e4o9mse3lpnqijqq.apps.googleusercontent.com',
  // iosClientId: '308017225163-5ke62fghtlreu9gjtv44eqhiuav654he.apps.googleusercontent.com',
  webClientId: '768654878392-lgl5j76ibi1dbi8si172qivsl2otd1ju.apps.googleusercontent.com',
  iosClientId: '768654878392-6mus2qfs53q8jpnhsu3brelgmg7v79uj.apps.googleusercontent.com',
};

const getEnvConfig = () => {
  return Object.freeze({
    ...EnvConfig,
  });
};

export default getEnvConfig;
