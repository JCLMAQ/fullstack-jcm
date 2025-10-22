import { DbConfigModule } from '@be/db-config';
import { PrismaClientModule } from '@db/prisma-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from '../config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaClientModule,
    DbConfigModule,

    ConfigModule.forRoot({
      // envFilePath: '../.development.env', // Look for .env file in the main directory and not in the backend directory
      envFilePath: '.env', // Look for .env file in the main directory
      isGlobal: true, // No need to import ConfigModule in each module
      expandVariables: true, // Allow expanded variable = ${VARIABLE_NAME}
      cache: true, // To accelarate the env variables loading
      validate: validateEnvironment, // Utilisation de Zod au lieu de Joi
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
