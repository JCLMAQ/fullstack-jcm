import { Module } from '@nestjs/common';

import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ZodValidationPipe } from './pipes/data-validation/data-validation.pipe';
import { StringUtilities } from './utilities/string-utilities';

@Module({
  providers: [
      {
      provide: HashingService,
      useClass: BcryptService,
      },
      StringUtilities,
      ZodValidationPipe,
  ],
  exports: [],
})
export class CommonModule {}
