import { ConnectionOptions } from 'typeorm';
import { env } from '../env';
import * as entities from '../common/entities-index';
import * as migrations from '../common/migrations-index';

export default {
  type: env.db.type as any,
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true,
  migrationsRun: true,
  dropSchema: false,
  entities: Object.values(entities),
  migrations: Object.values(migrations),
} as ConnectionOptions;
