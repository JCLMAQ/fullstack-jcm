import { PrismaClientModule } from '@db/prisma-client';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConfigController } from './db-config.controller';
import { DbConfigService } from './db-config.service';
@Global()
@Module({
   imports: [
    ConfigModule,
    PrismaClientModule,
  ],
  controllers: [DbConfigController],
  providers: [DbConfigService],
  exports: [DbConfigService],
})
export class DbConfigModule {}
