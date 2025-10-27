import { Component, inject, input } from '@angular/core';
import { ApiConfig } from '@fe/services';

@Component({
  selector: 'lib-user-avatar',
  imports: [],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
})
export class UserAvatar {
  constructor() {'//test'}

  photoUrl = input<string | null | undefined>('');
  alt = input<string>('User profile picture');
  cssClass = input<string>('w-[40px] h-[40px] rounded-full');

  private apiConfigService = inject(ApiConfig);
  private defaultImage = 'person-placeholder.png';
  private hasErrored = false;

  isEmoji(): boolean {
    const url = this.photoUrl();
    if (!url || url.trim() === '') return false;

    // Vérifier si c'est un emoji (caractère Unicode, pas une URL)
    const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]$/u;
    return emojiRegex.test(url.trim()) || (url.length <= 4 && !url.includes('http') && !url.includes('.'));
  }

  getEmojiSize(): number {
    const cssClasses = this.cssClass();
    // Extraire la taille des classes CSS (par exemple w-[40px] -> 40)
    const widthMatch = cssClasses.match(/w-\[(\d+)px\]/);
    if (widthMatch) {
      const size = parseInt(widthMatch[1], 10);
      return Math.floor(size * 0.6); // Les emojis sont plus lisibles à ~60% de la taille du conteneur
    }
    return 24; // Taille par défaut
  }

  getImageSrc(): string {
    const url = this.photoUrl();

    // Si l'image a déjà eu une erreur ou si l'URL est vide/null, retourner l'image par défaut
    if (this.hasErrored || !url || url.trim() === '') {
      return this.defaultImage;
    }

    // Utiliser le service pour construire l'URL appropriée
    return this.apiConfigService.getFileUrl(url);
  }

  onImageError(event: Event): void {
    this.hasErrored = true;
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }

}
