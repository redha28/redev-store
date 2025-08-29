import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { DatabaseSeeder } from './database.seeder';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from '../config/env.validation';

// Load environment variables
dotenv.config();

const logger = new Logger('SeederRunner');

function getValidatedEnv(): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(env, { skipMissingProperties: false });
  if (errors.length > 0) {
    logger.error(
      '❌ Invalid environment variables:',
      JSON.stringify(errors, null, 2),
    );
    process.exit(1);
  }
  return env;
}

async function runSeeder() {
  const env = getValidatedEnv();
  const dataSource = new DataSource({
    type: 'mysql',
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Don't auto-sync in production
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    logger.log('📊 Database connection established');

    // Run all seeders
    await DatabaseSeeder.run(dataSource);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      logger.log('🔌 Database connection closed');
    }
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  runSeeder()
    .then(() => {
      logger.log('🎉 Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export { runSeeder };
