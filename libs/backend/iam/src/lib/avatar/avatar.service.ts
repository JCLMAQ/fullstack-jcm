import { PrismaClientService } from '@db/prisma-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarService {
  constructor(private prisma: PrismaClientService) {}

  /**
   * Sauvegarde un avatar en base64 pour un utilisateur
   */
  async saveAvatarBase64(userId: string, base64Data: string, fileName: string): Promise<string> {
    // Extraire les métadonnées du base64
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Format base64 invalide');
    }

    const mimeType = matches[1];
    const actualBase64 = matches[2];
    const fileSize = Buffer.from(actualBase64, 'base64').length;

    // Créer ou mettre à jour le fichier d'avatar
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatarFile: true }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    let avatarFile;

    if (user.avatarFile) {
      // Mettre à jour le fichier existant
      avatarFile = await this.prisma.file.update({
        where: { id: user.avatarFile.id },
        data: {
          name: fileName,
          storageName: `avatar_${userId}_${Date.now()}`,
          type: mimeType,
          data: base64Data, // Stocke le base64 complet avec metadata
          size: fileSize,
          updatedAt: new Date()
        }
      });
    } else {
      // Créer un nouveau fichier
      avatarFile = await this.prisma.file.create({
        data: {
          name: fileName,
          storageName: `avatar_${userId}_${Date.now()}`,
          type: mimeType,
          data: base64Data, // Stocke le base64 complet avec metadata
          size: fileSize,
          owner: { connect: { id: userId } },
          org: { connect: { id: user.orgId || 'default-org-id' } }, // À adapter selon votre logique
          published: true,
          isPublic: false,
          isDeleted: 0
        }
      });

      // Lier le fichier à l'utilisateur
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarFileId: avatarFile.id }
      });
    }

    return avatarFile.id;
  }

  /**
   * Récupère l'avatar base64 d'un utilisateur
   */
  async getAvatarBase64(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatarFile: true }
    });

    return user?.avatarFile?.data || null;
  }

  /**
   * Supprime l'avatar d'un utilisateur
   */
  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatarFile: true }
    });

    if (user?.avatarFile) {
      // Soft delete du fichier
      await this.prisma.file.update({
        where: { id: user.avatarFile.id },
        data: { isDeleted: 1, isDeletedDT: new Date() }
      });

      // Supprimer la référence de l'utilisateur
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarFileId: null }
      });
    }
  }
}
