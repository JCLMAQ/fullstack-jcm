// validation.pipe.ts base on : https://www.notion.so/jclmaq5510/Data-validation-with-Joi-502789ddb6f349ea9d79d0447899cf3d?pvs=4

import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { z, ZodError } from 'zod';

export class ZodValidationPipe<T = unknown> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    try {
      const validatedValue = this.schema.parse(value);
      return validatedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        throw new BadRequestException({
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      throw error;
    }
  }
}


/*
**** Example: registration.dto.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only alphanumeric characters'),
  email: z.string()
    .email('Please provide a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long'),
});

export type RegistrationDto = z.infer<typeof registrationSchema>;
*/

/*
**** Example of implementation:
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { registrationSchema, RegistrationDto } from './registration.dto';
import { ZodValidationPipe } from './data-validation.pipe';

@Controller('auth')
export class AuthController {
  @Post('register')
  @UsePipes(new ZodValidationPipe(registrationSchema))
  async register(@Body() body: RegistrationDto) {
    // If the data passes validation, it will reach this point
    // body is now fully typed thanks to Zod inference
    return 'Registration successful';
  }
}
*/
