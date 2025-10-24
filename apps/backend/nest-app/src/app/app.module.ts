import { DbConfigModule } from '@be/db-config';
import { AllExceptionsFilter, ExceptionFilterModule } from '@be/exception-filter';
import { IamModule } from '@be/iam';
import { TimeUtilModule, TimeUtilService } from '@be/time-util';
import { PrismaClientModule } from '@db/prisma-client';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { ClsModule } from 'nestjs-cls';
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { validateEnvironment } from '../config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaClientModule,
    DbConfigModule,
    ExceptionFilterModule,

    ConfigModule.forRoot({
      // envFilePath: '../.development.env', // Look for .env file in the main directory and not in the backend directory
      envFilePath: '.env', // Look for .env file in the main directory
      isGlobal: true, // No need to import ConfigModule in each module
      expandVariables: true, // Allow expanded variable = ${VARIABLE_NAME}
      cache: true, // To accelarate the env variables loading
      validate: validateEnvironment, // Utilisation de Zod au lieu de Joi
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-CA': 'fr',
        'en-*': 'en',
        'fr-*': 'fr',
        pt: 'pt-BR',
      },
      loader: I18nJsonLoader,
      loaderOptions: {
      path: path.join(__dirname, 'assets/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),

    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('FILES_STORAGE_DEST') || './upload',
        limits: {fileSize: configService.get<number>('FILES_MAX_SIZE') || 2000000}
      }),
      inject: [ConfigService],
    }),

    ClsModule.forRoot({
      // Register the ClsModule and automatically mount the ClsMiddleware
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          const userId = req.headers['x-user-id'];
          const userRole = req.headers['x-user-role'] ?? 'USER';
          cls.set(
            'user',
            userId ? { id: Number(userId), role: userRole } : undefined,
          );
        },
      },
      }),
    PrismaClientModule,
    DbConfigModule,
    ExceptionFilterModule,
    TimeUtilModule,
    IamModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    TimeUtilService,
    AllExceptionsFilter,
  ],
})
export class AppModule {}
