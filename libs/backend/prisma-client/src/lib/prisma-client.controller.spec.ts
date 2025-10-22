import { Test } from '@nestjs/testing';
import { PrismaClientController } from './prisma-client.controller';
import { PrismaClientService } from './prisma-client.service';

describe('PrismaClientController', () => {
  let controller: PrismaClientController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaClientService],
      controllers: [PrismaClientController],
    }).compile();

    controller = module.get(PrismaClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
