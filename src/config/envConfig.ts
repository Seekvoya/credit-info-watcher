import * as dotenv from 'dotenv';

dotenv.config();

class EnvConfig {
  get app() {
    return {
      port: process.env.APP_PORT,
      procution: process.env.APP_PRODUCTION_CONFIG,
    };
  }

  get db() {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB,
    };
  }
}

export default new EnvConfig();
