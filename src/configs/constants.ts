type envConfig = {
  MONGO_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRESIN: string;
};
const devConfig: envConfig = {
  MONGO_URL: `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PW}@cluster0-fyne9.mongodb.net/message-dev?retryWrites=true&w=majority`,
  JWT_SECRET: 'thisisasecret',
  JWT_EXPIRESIN: '24h',
};

const testConfig: envConfig = {
  MONGO_URL: `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PW}@cluster0-fyne9.mongodb.net/message-test?retryWrites=true&w=majority`,
  JWT_SECRET: 'thisisasecret',
  JWT_EXPIRESIN: '24h',
};

const prodConfig: envConfig = {
  MONGO_URL: `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PW}@cluster0-fyne9.mongodb.net/message-prod?retryWrites=true&w=majority`,
  JWT_SECRET: 'thisisasecret',
  JWT_EXPIRESIN: '1h',
};

const defaultConfig = {
  PORT: process.env.PORT || 3000,
};

/**
 * export configs through  func
 * @param env
 */
function envConfig(env: string): envConfig {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export const constants = {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV as string),
};
