import * as dotenv from 'dotenv';

dotenv.config();

class EnvConfig {
  get app() {
    return {
      port: process.env.APP_PORT,
      production: process.env.APP_PRODUCTION_CONFIG,
    };
  }

  get db() {
    return {
      host: process.env.DB_HOST_PROD,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name_main: process.env.DB_MAIN,
    };
  }
}

export default new EnvConfig();
