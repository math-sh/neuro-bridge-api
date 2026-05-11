import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get<string>('DB_HOST'),
      port: Number(this.config.get<string>('DB_PORT')),
      database: this.config.get<string>('DB_NAME'),
      username: this.config.get<string>('DB_USERNAME'),
      password: this.config.get<string>('DB_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      autoLoadEntities: true,
    };
  }
}
