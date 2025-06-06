declare namespace NodeJS {
  type ProcessEnv = {
    APP_PRODUCTION_CONFIG: string;
    APP_PORT: number;

    DB_HOST_PROD: string;
    DB_HOST_TEST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_MAIN: string;
  }
}
