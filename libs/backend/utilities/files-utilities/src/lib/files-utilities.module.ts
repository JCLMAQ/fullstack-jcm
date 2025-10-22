import { Module, Global } from '@nestjs/common';
import { FilesUtilitiesController } from './files-utilities.controller';
import { FilesUtilitiesService } from './files-utilities.service';

@Global()
@Module({
  controllers: [FilesUtilitiesController],
  providers: [FilesUtilitiesService],
  exports: [FilesUtilitiesService],
})
export class FilesUtilitiesModule {}
