import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppStore } from '@fe/stores';
import { UserAvatar } from '@fe/user-avatar';
import { UserAvatarEditor } from '@fe/user-avatar-editor';

@Component({
  selector: 'lib-sidenav-header',
  imports: [
    UserAvatar
  ],
  templateUrl: './sidenav-header.html',
  styleUrl: './sidenav-header.scss',
})
export class SidenavHeader {

  collapsed = input(false);

  appStore = inject(AppStore);

  dialog = inject(MatDialog);

  profilePicSize = computed(() => (this.collapsed() ? '32' : '100'));

  avatarClasses = computed(() =>
    `object-cover object-center rounded-full mb-3 aspect-square w-[${this.profilePicSize()}px] h-[${this.profilePicSize()}px]`
  );

  openProfileEditor() {
    const dialogRef = this.dialog.open(UserAvatarEditor, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated successfully');
      }
    });
  }
}
