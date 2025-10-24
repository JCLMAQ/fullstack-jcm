import { ActiveUser, ActiveUserData } from '@be/common';
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../authentication/decorators/auth.decorator';
import { AuthType } from '../authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller('upload')
export class UploadController {
  private readonly uploadPath = './files/avatars';

  constructor() {
    // Créer le dossier s'il n'existe pas
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/avatars',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Type de fichier non supporté'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @ActiveUser() user: ActiveUserData
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Construire l'URL publique du fichier
    const fileUrl = `/files/avatars/${file.filename}`;

    console.log(`📤 Avatar uploadé pour l'utilisateur ${user.email}:`, fileUrl);

    return {
      success: true,
      message: 'Avatar uploadé avec succès',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
