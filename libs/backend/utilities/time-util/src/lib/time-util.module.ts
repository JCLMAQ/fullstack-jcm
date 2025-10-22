import { Module, Global } from '@nestjs/common';
import { TimeUtilService } from './time-util.service';

@Global()
@Module({
  controllers: [],
  providers: [TimeUtilService],
  exports: [TimeUtilService],
})
export class TimeUtilModule {}
