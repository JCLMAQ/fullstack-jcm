import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IJwt, ILoginResponse, IRegisterResponse, IUserLogged } from '@fe/shared';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';



const USER_STORAGE_KEY = 'user';
const AUTH_TOKEN_STORAGE_KEY = 'authJwtToken';

/**
 * 🆕 SERVICE IAM MODERNE - Migration AUTHS → IAM
 *
 * Ce service utilise les nouveaux endpoints IAM (/api/authentication/*)
 * au lieu des anciens endpoints AUTHS (/api/auths/*)
 *
 * Avantages :
 * - 🔒 Sécurité renforcée avec Guards automatiques
 * - ⚡ Architecture moderne et optimisée
 * - 🧪 Testabilité améliorée
 * - 🚀 Support 2FA et API Keys
 */


@Injectable({
  providedIn: 'root'
})
export class IamAuth {

  httpClient = inject(HttpClient);
  router = inject(Router);

  #userSignal = signal<IUserLogged | undefined>(undefined);
  user = this.#userSignal.asReadonly();

  #authTokenSignal = signal<string | undefined>(undefined);
  authToken = this.#authTokenSignal.asReadonly();

  isLoggedIn = computed(() => !!this.user());

  private authenticated = false;
  private adminRole = false;

  constructor() {
    this.#authTokenSignal.set(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined);
    this.loadUserFromStorage();
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
      const authToken = this.authToken();
      if (authToken) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
      }
    });
  }

  loadUserFromStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#userSignal.set(user);
    }
  }

  /**
   * 🔐 LOGIN avec nouvel endpoint IAM
   * AUTHS: POST /api/auths/auth/loginwithpwd
   * IAM:   POST /api/authentication/sign-in ✅
   */
  async login(email: string, password: string): Promise<ILoginResponse> {
    // 🆕 Utilisation du nouvel endpoint IAM
    const pathUrl = "api/authentication/sign-in";

    const login$ = this.httpClient.post<ILoginResponse>(`${pathUrl}`, {
      email,
      password
    });

    const response = await firstValueFrom(login$);

    this.#authTokenSignal.set(response.accessToken);
    localStorage.setItem("authJwtToken", response.accessToken);

    const userLogged = await this.fetchUser();
    if (userLogged) {
      this.#userSignal.set(userLogged);
    }

    this.loginAsUser();
    return response;
  }

  /**
   * 📝 REGISTER avec nouvel endpoint IAM étendu
   * AUTHS: POST /api/auths/auth/registerwithpwd
   * IAM:   POST /api/authentication/register-extended ✅
   */
  async register(email: string, password: string, confirmPassword: string): Promise<IRegisterResponse | Error> {
    // 🆕 Utilisation du nouvel endpoint IAM étendu
    const pathUrl = "api/authentication/register-extended";

    const payload: {
      email: string;
      password: string;
      verifyPassword: string;
      Roles?: string[];
      Language?: string;
      lastName?: string;
      firstName?: string;
      nickName?: string;
      Gender?: string;
    } = {
      email,
      password,
      verifyPassword: confirmPassword,
    };

    console.log("Registering User Payload (IAM): ", payload);

    const register$ = this.httpClient.post<IRegisterResponse>(`${pathUrl}`, payload);
    const response = await firstValueFrom(register$);

    console.log("Registering User Response (IAM): ", response);

    return response;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem("authJwtToken");
    this.#authTokenSignal.set(undefined);
    this.#userSignal.set(undefined);

    console.log("User logged out: ", this.user());

    this.logoutAsUserOrAdmin();
  }

  /**
   * 👤 FETCH USER avec nouvel endpoint IAM
   * AUTHS: GET /api/auths/auth/loggedUser/:email
   * IAM:   GET /api/authentication/user/:email ✅
   */
  async fetchUser(): Promise<IUserLogged | undefined | null> {
    const authToken = this.authToken();
    if (authToken) {
      const decodedJwt: IJwt = jwtDecode(authToken);
      console.log("Decoded JWT (IAM): ", decodedJwt);
      const emailToCheck = decodedJwt.email; // username = email

      if (emailToCheck) {
        try {
          // 🆕 Utilisation du nouvel endpoint IAM
          const response = await firstValueFrom(
            this.httpClient.get<{ user: IUserLogged, fullName: string } | { success: boolean, message: string}>(`api/authentication/user/${emailToCheck}`)
          );

          if ('success' in response) {
            console.error('Error fetching user (IAM):', response.message);
            return null;
          }

          return response.user;
        } catch (error) {
          console.error('Error fetching user (IAM):', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * ✅ VÉRIFICATION CREDENTIALS avec nouvel endpoint IAM
   * AUTHS: POST /api/auths/checkCredential/ avec body { emailToCheck }
   * IAM:   POST /api/authentication/check-credentials/:email ✅
   */
  async checkUserCredentials(email: string, password: string): Promise<boolean> {
    try {
      // 🆕 Utilisation du nouvel endpoint IAM
      const response = await firstValueFrom(
        this.httpClient.post<{ success: boolean, message: string }>(`api/authentication/check-credentials/${email}`, { password })
      );

      return response.success;
    } catch (error) {
      console.error('Error checking credentials (IAM):', error);
      return false;
    }
  }

  // === MÉTHODES COMPATIBILITÉ (identiques à auth.service.ts) ===

  isAuthenticated() {
    return this.authenticated;
  }

  loginAsUser() {
    this.authenticated = true;
  }

  loginAsAdmin() {
    this.authenticated = true;
    this.adminRole = true;
  }

  hasAdminRole() {
    return this.adminRole;
  }

  logoutAsUserOrAdmin() {
    this.authenticated = false;
    this.adminRole = false;
  }
}
