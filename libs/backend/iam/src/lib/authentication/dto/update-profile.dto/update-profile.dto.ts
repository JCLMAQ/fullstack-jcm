import { IsString } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  photoUrl!: string;  // URL d'image ou emoji
}
