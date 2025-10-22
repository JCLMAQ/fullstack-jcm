import { Global, Module } from '@nestjs/common';
import { AllExceptionsFilter } from './exception-filter.service';

@Global()
@Module({
  controllers: [],
  providers: [AllExceptionsFilter],
  exports: [AllExceptionsFilter],
})
export class ExceptionFilterModule {}
