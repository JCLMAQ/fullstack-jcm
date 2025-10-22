import { Test } from '@nestjs/testing';
import { ExceptionFilterService } from './exception-filter.service';

describe('ExceptionFilterService', () => {
  let service: ExceptionFilterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExceptionFilterService],
    }).compile();

    service = module.get(ExceptionFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
