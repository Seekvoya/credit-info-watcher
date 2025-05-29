declare namespace NodeJS {
  type ProcessEnv = {
    APP_PRODUCTION_CONFIG: number;
    APP_PORT: number;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB: string;
  }
}
