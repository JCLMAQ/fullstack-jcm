import { DbConfigModule } from '@be/db-config';
import { PrismaClientModule } from '@db/prisma-client';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaClientModule,
    DbConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
