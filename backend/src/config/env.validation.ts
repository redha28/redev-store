import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvironmentVariables {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  PORT?: number = 3000;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string = 'your-secret-key';

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string = '15m';

  @IsOptional()
  @IsString()
  JWT_REFRESH_SECRET?: string = 'your-refresh-secret-key';

  @IsOptional()
  @IsString()
  DATABASE_HOST?: string = 'localhost';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  DATABASE_PORT?: number = 3306;

  @IsOptional()
  @IsString()
  DATABASE_USERNAME?: string = 'root';

  @IsOptional()
  @IsString()
  DATABASE_PASSWORD?: string = 'password';

  @IsOptional()
  @IsString()
  DATABASE_NAME?: string = 'nestjs_app';

  @IsOptional()
  @IsString()
  NODE_ENV?: string = 'development';
}
