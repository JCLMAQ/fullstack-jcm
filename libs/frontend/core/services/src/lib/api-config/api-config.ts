import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '@fe/tokens';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  ;
  private readonly environment = inject(ENVIRONMENT_TOKEN);

  private readonly apiUrl: string = this.environment.API_BACKEND_URL || 'http://localhost:3500';

  getApiUrl(): string {
    return this.apiUrl;
  }

  getFileUrl(relativePath: string): string {
    // Si le chemin commence par /files/, construire l'URL complète
    if (relativePath.startsWith('/files/')) {
      return `${this.apiUrl}${relativePath}`;
    }

    // Si c'est déjà une URL complète, la retourner telle quelle
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // Pour tout autre cas, retourner le chemin tel quel
    return relativePath;
  }
}
