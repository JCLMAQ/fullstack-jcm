import { Controller } from '@nestjs/common';
import { PrismaClientService } from './prisma-client.service';

@Controller('prisma-client')
export class PrismaClientController {
  constructor(private prismaClientService: PrismaClientService) {}
}
