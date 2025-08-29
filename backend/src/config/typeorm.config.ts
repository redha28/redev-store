import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 3306),
    username: configService.get<string>('DATABASE_USERNAME', 'root'),
    password: configService.get<string>('DATABASE_PASSWORD', 'password'),
    database: configService.get<string>('DATABASE_NAME', 'nestjs_app'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    logging: configService.get<string>('NODE_ENV') === 'development',
    namingStrategy: new SnakeNamingStrategy(),
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
  }),
  inject: [ConfigService],
};
