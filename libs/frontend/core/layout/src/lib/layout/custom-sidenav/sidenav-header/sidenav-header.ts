import { Component, computed, inject, input } from '@angular/core';
import { AppStore } from '@fe/stores';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditorComponent } from '@fe/user-avatar';

@Component({
  selector: 'lib-sidenav-header',
  imports: [],
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
    const dialogRef = this.dialog.open(ProfileEditorComponent, {
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
