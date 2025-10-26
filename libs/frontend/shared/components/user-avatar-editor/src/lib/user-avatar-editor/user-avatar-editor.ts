import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiConfig, AvatarBase64 } from '@fe/services';
import { IamAuth } from '@fe/shared';
import { UserAvatar } from '@fe/user-avatar';

@Component({
  selector: 'lib-user-avatar-editor',
  imports: [
    UserAvatar,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './user-avatar-editor.html',
  styleUrl: './user-avatar-editor.scss',
})
export class UserAvatarEditor {

  authService = inject(IamAuth);
  snackbar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<UserAvatarEditor>);
  avatarBase64Service = inject(AvatarBase64);
  private apiConfig = inject(ApiConfig);

  selectedPhoto = signal<string>('');
  imageUrl = signal<string>('');
  saving = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  uploading = signal<boolean>(false);
  isDragOver = signal<boolean>(false);

  // Signaux pour Base64
  selectedFileBase64 = signal<File | null>(null);
  base64Preview = signal<string>('');
  isUploadingBase64 = signal<boolean>(false);

  // Validation des fichiers
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Liste d'emojis populaires pour les avatars
  availableEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓',
    '👴', '👵', '👮', '🕵️', '💂', '👷', '🤴', '👸', '👳', '👲',
    '🧕', '🤵', '👰', '🤰', '👼', '🎅', '🤶', '🦸', '🦹', '🧙',
    '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🤖', '😺', '😸', '😹',
    '😻', '😼', '😽', '🙀', '😿', '😾', '🐶', '🐱', '🐭', '🐹',
    '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'
  ];

  selectPhoto(photo: string) {
    console.log('Selecting photo:', photo);
    this.selectedPhoto.set(photo);
    this.imageUrl.set(''); // Reset URL when emoji is selected
    console.log('Selected photo is now:', this.selectedPhoto());
  }

  onImageUrlChange() {
    const url = this.imageUrl();
    if (url && url.trim()) {
      this.selectedPhoto.set(url);
    }
  }

  // === MÉTHODES POUR L'UPLOAD DE FICHIERS ===

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
    // Validation du type de fichier
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.snackbar.open('Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }

    // Validation de la taille
    if (file.size > this.MAX_FILE_SIZE) {
      this.snackbar.open('Fichier trop volumineux. Maximum 5MB autorisé.', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }

    this.selectedFile.set(file);
    this.createPreview(file);
  }

  private createPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.previewUrl.set(result);
      this.selectedPhoto.set(result); // Sélectionner automatiquement l'aperçu
    };
    reader.readAsDataURL(file);
  }

  clearSelectedFile(event: Event) {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.previewUrl.set('');
    if (this.selectedPhoto() === this.previewUrl()) {
      this.selectedPhoto.set('');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Méthodes pour Base64
  onFileSelectedBase64(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.handleFileBase64(files[0]);
    }
  }

  onDropBase64(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileBase64(files[0]);
    }
  }

  private handleFileBase64(file: File) {
    // Validation du type de fichier
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.snackbar.open('Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }

    // Validation de la taille
    if (file.size > this.MAX_FILE_SIZE) {
      this.snackbar.open('Fichier trop volumineux. Maximum 5MB autorisé.', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }

    this.selectedFileBase64.set(file);

    // Convertir en base64 pour l'aperçu
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.base64Preview.set(base64String);
      this.selectedPhoto.set(base64String); // Préparer la photo pour sauvegarde via le bouton
    };
    reader.readAsDataURL(file);
  }  private uploadToBase64(base64Data: string) {
    this.isUploadingBase64.set(true);

    this.avatarBase64Service.uploadAvatarBase64(base64Data).subscribe({
      next: () => {
        this.isUploadingBase64.set(false);
        this.selectedPhoto.set(base64Data); // Utiliser le base64 comme photo sélectionnée
        this.snackbar.open('Avatar sauvegardé en base de données avec succès !', 'Fermer', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.isUploadingBase64.set(false);
        console.error('Erreur upload base64:', error);
        this.snackbar.open('Erreur lors de la sauvegarde', 'Fermer', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  clearSelectedFileBase64(event: Event) {
    event.stopPropagation();
    this.selectedFileBase64.set(null);
    this.base64Preview.set('');
    if (this.selectedPhoto() === this.base64Preview()) {
      this.selectedPhoto.set('');
    }
  }

  async uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const urlToUse = this.apiConfig.getApiUrl() + '/api/upload/avatar';
      const response = await fetch(urlToUse, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authService.authToken()}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📤 Upload réussi:', result);

        // Utiliser l'URL retournée par le serveur
        this.selectedPhoto.set(result.url);
        this.snackbar.open('Image uploadée avec succès !', 'Fermer', {
          duration: 3000,
          verticalPosition: 'top'
        });
      } else {
        throw new Error('Upload échoué');
      }
    } catch (error) {
      console.error('💥 Erreur lors de l\'upload:', error);
      this.snackbar.open('Erreur lors de l\'upload de l\'image', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
    } finally {
      this.uploading.set(false);
    }
  }

  async save() {
    const photo = this.selectedPhoto();
    console.log('💾 Tentative de sauvegarde de la photo:', photo);

    if (!photo) {
      console.log('❌ Aucune photo sélectionnée, abandon');
      return;
    }

    this.saving.set(true);

    try {
      // Détecter si c'est du base64 (commence par data:image/)
      if (photo.startsWith('data:image/')) {
        console.log('�️ Sauvegarde base64 en base de données');

        this.avatarBase64Service.uploadAvatarBase64(photo).subscribe({
          next: async () => {
            console.log('✅ Mise à jour base64 réussie');

            // 🔄 Actualiser le profil utilisateur pour récupérer la nouvelle photoUrl
            await this.authService.refreshUserProfile();

            this.saving.set(false);
            this.snackbar.open('Avatar sauvegardé en base de données avec succès !', 'Fermer', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log('❌ Échec de la mise à jour base64:', error);
            this.saving.set(false);
            this.snackbar.open('Erreur lors de la sauvegarde en base de données', 'Fermer', {
              duration: 5000,
              verticalPosition: 'top'
            });
          }
        });
      } else {
        // Utiliser l'ancienne méthode pour les autres types (emoji, URL)
        console.log('�🚀 Appel de updateUserPhoto avec:', photo);
        const result = await this.authService.updateUserPhoto(photo);
        console.log('📡 Réponse du serveur:', result);

        if (result.success) {
          console.log('✅ Mise à jour réussie');
          this.snackbar.open(result.message, 'Fermer', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        } else {
          console.log('❌ Échec de la mise à jour:', result.message);
          this.snackbar.open(result.message, 'Fermer', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      }
    } catch (error) {
      console.error('💥 Erreur lors de la mise à jour:', error);
      this.snackbar.open('Erreur lors de la mise à jour', 'Fermer', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.saving.set(false);
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
