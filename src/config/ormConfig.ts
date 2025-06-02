import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import EnvConfig from './envConfig';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

dotenv.config();

const config: DataSourceOptions = {
  type: 'mssql',

  ...EnvConfig.db,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  logging: false,
  synchronize: false,
  entities: ['dist/src/modules/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
};

export const connectionSource = new DataSource(config);

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...config,
    };
  }
}
