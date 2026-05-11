import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],

  factories: ['dist/database/factories/**/*.js'],
  logger: 'simple-console',
};

export default new DataSource(options);
