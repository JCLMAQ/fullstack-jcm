import { Controller } from '@nestjs/common';
import { FilesUtilitiesService } from './files-utilities.service';

@Controller('files-utilities')
export class FilesUtilitiesController {
  constructor(private filesUtilitiesService: FilesUtilitiesService) {}
}
