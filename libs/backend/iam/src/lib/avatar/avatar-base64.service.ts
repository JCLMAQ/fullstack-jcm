import { PrismaClientService } from '@db/prisma-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarBase64Service {
  constructor(private prisma: PrismaClientService) {}

  /**
   * Sauvegarde un avatar en base64 dans le champ photoUrl
   */
  async saveAvatarBase64(userId: string, base64Data: string): Promise<void> {
    console.log('🔍 AvatarBase64Service.saveAvatarBase64 called');
    console.log('👤 UserId:', userId);
    console.log('📊 Base64 data length:', base64Data?.length);
    console.log('🏷️ Base64 starts with:', base64Data?.substring(0, 50));

    // Valider le format base64
    if (!base64Data.startsWith('data:image/')) {
      console.log('❌ Format base64 invalide');
      throw new Error('Format base64 invalide - doit être une image');
    }

    console.log('✅ Validation base64 OK, mise à jour utilisateur...');

    // Sauvegarder directement dans photoUrl
    await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: base64Data }
    });

    console.log('✅ Utilisateur mis à jour avec succès');
  }

  /**
   * Récupère l'avatar base64 d'un utilisateur
   */
  async getAvatarBase64(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true }
    });

    // Retourner seulement si c'est du base64 (commence par data:image/)
    if (user?.photoUrl?.startsWith('data:image/')) {
      return user.photoUrl;
    }

    return null;
  }

  /**
   * Supprime l'avatar d'un utilisateur
   */
  async deleteAvatar(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null }
    });
  }
}
