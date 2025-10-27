import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@db/prisma';
import { firstValueFrom, Observable } from 'rxjs';
/**
 * 🆕 SERVICE D'INSCRIPTION IAM - Migration AUTHS → IAM
 *
 * Remplace l'ancien register.service.ts qui utilisait l'endpoint AUTHS
 * Utilise maintenant l'endpoint IAM /api/authentication/register-extended
 */
@Injectable({
  providedIn: 'root'
})
export class IamRegisterService {

  httpClient = inject(HttpClient);

  async register(body: User): Promise<User> {
    try {
      const result = await firstValueFrom(this.userRegister(body));
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * 📝 USER REGISTER avec nouvel endpoint IAM
   * AUTHS: POST /api/auths/auth/registerwithpwd
   * IAM:   POST /api/authentication/register-extended ✅
   */
  userRegister(user: User): Observable<User> {
    // 🆕 Utilisation du nouvel endpoint IAM étendu
    const pathUrl = "api/authentication/register-extended";
    // 🆕 Utilisation du nouvel endpoint IAM étendu
    return this.httpClient.post<User>(`${pathUrl}`, user);
  }
}
