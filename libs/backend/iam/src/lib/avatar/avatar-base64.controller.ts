import { ActiveUser, ActiveUserData } from '@be/common';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Auth } from '../authentication/decorators/auth.decorator';
import { AuthType } from '../authentication/enums/auth-type.enum';
import { AvatarBase64Service } from './avatar-base64.service';

class AvatarBase64Dto {
  @ApiProperty({ description: 'Base64 image data with data URL prefix' })
  @IsString()
  base64Data!: string;

  @ApiProperty({ description: 'Original filename', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;
}

@ApiTags('avatar-base64')
@Auth(AuthType.None) // Autoriser l'accès public par défaut
@Controller('avatar-base64')
export class AvatarBase64Controller {
  constructor(private readonly avatarService: AvatarBase64Service) {}

  @Post('test')
  @ApiOperation({ summary: 'Test endpoint' })
  async testEndpoint(@Body() body: Record<string, unknown>) {
    console.log('🧪 Test endpoint called with body:', body);
    return { message: 'Test successful', received: body };
  }

  @Auth(AuthType.Bearer) // Authentification requise pour l'upload
  @Post('upload')
  @ApiOperation({ summary: 'Upload avatar as base64' })
  @ApiBody({ type: AvatarBase64Dto })
  async uploadAvatarBase64(
    @ActiveUser() user: ActiveUserData,
    @Body() { base64Data }: AvatarBase64Dto,
  ) {
    console.log('🔍 AvatarBase64Controller.uploadAvatarBase64 called');
    console.log('👤 User:', user);
    console.log('📊 Received base64Data length:', base64Data?.length);
    console.log('🏷️ Base64 prefix:', base64Data?.substring(0, 50));

    try {
      await this.avatarService.saveAvatarBase64(user.sub, base64Data);
      console.log('✅ Avatar sauvegardé avec succès');
      return { message: 'Avatar uploaded successfully' };
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  @Auth(AuthType.Bearer) // Authentification requise pour récupérer l'avatar
  @Get('current')
  @ApiOperation({ summary: 'Get current user avatar as base64' })
  async getCurrentAvatar(@ActiveUser() user: ActiveUserData) {
    const avatarData = await this.avatarService.getAvatarBase64(user.sub);
    return { avatarData };
  }
}
