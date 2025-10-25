import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'lib-login',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInput,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);

  email = signal('user1@test.be');
  password = signal('Pwd!123456');

  hidePassword = signal(true);

  register() {
    this.router.navigate(['auth/register']);
  }

  login() {
    this.authService.login(this.email(), this.password());
  }

  cancel() {
    this.router.navigate(['/pages/home']);
  }



}
