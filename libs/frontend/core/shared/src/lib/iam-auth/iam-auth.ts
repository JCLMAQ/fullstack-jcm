import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { IJwt, ILoginResponse, IRegisterResponse, IUserLogged } from '../models/auth.model';



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
    console.log("User logged in (IAM): ", userLogged);
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


// Todo Update user photo both backend and frontend signal : chifter vezrs un service spécifique ?
 async updateUserPhoto(photoUrl: string): Promise<{success: boolean, message: string, photoUrl?: string}> {

    const pathUrl = "http://localhost:3500/api/authentication/update-photo";

    try {
      console.log('🔐 Token d\'authentification:', this.authToken());
      console.log('👤 Utilisateur actuel:', this.user());
      console.log('📤 Données envoyées:', { photoUrl });

      const response = await firstValueFrom(
        this.httpClient.put<{success: boolean, message: string, photoUrl?: string}>(`${pathUrl}`, {
          photoUrl
        })
      );

      console.log('✅ Réponse complète du serveur:', response);

      if (response.success && response.photoUrl) {
        // Mettre à jour l'utilisateur local
        const currentUser = this.user();
        if (currentUser) {
          const updatedUser = { ...currentUser, photoUrl: response.photoUrl };
          this.#userSignal.set(updatedUser);
          console.log('🔄 Utilisateur mis à jour localement:', updatedUser);
        }
      }

      return response;
    } catch (error) {
      console.error('💥 Erreur détaillée lors de la mise à jour de la photo:', error);
      console.error('💥 Type d\'erreur:', typeof error);
      console.error('💥 Message d\'erreur:', (error as any)?.message);
      console.error('💥 Status de l\'erreur:', (error as any)?.status);
      console.error('💥 Error object complet:', error);

      return {
        success: false,
        message: `Failed to update photo: ${(error as any)?.message || 'Unknown error'}`
      };
    }
  }

  /**
   * 👤 FETCH USER avec nouvel endpoint IAM
   * AUTHS: GET /api/auths/auth/loggedUser/:email
   * IAM:   GET /api/authentication/user/:email ✅
   */
    async fetchUser(): Promise<IUserLogged | undefined | null> {
      const pathUrl = "api/authentication/user";
      //  get user data from backend with authToken
      // const apiUrl = "api/auths/auth/loggedUser/";
      const authToken = this.authToken();
      if (authToken) {
        const decodedJwt: IJwt = jwtDecode(authToken);
        console.log("Decoded JWT: ", decodedJwt);
        const emailToCheck = decodedJwt.email; // username = email
        if (emailToCheck) {

          try {
            const response = await firstValueFrom(
              // this.httpClient.get<{ user: IUserLogged, fullName: string  } | { success: boolean, message: string}>(`${pathUrl}/${emailToCheck}`)
               this.httpClient.get<{user: IUserLogged, fullName: string}>('api/authentication/profile')

            );
            console.log("Profil récupéré depuis l'API:", response);
            if ('success' in response) {
              // console.error(response.message);
              return null;
            }

            const user: IUserLogged = {
              email: response.user.email || '',
              lastName: response.user.lastName || null,
              firstName: response.user.firstName || null,
              nickName: response.user.nickName || null,
              title: response.user.title || null,
              Gender: response.user.Gender || null,
              Roles: response.user.Roles || [],
              Language: response.user.Language || null,
              fullName: response.fullName || null,
              photoUrl: response.user.photoUrl || ''  // ✅ Récupère la vraie photoUrl depuis la DB
            };

            return user;
          } catch (error) {

            console.error("Error fetching user data: ", error);

            // Fallback : utiliser les infos du JWT si l'API échoue
            const decodedJwt: IJwt = jwtDecode(authToken);
            console.log("Fallback - Decoded JWT: ", decodedJwt);

            const user: IUserLogged = {
              email: decodedJwt.email || '',
              lastName: null,
              firstName: null,
              nickName: null,
              title: null,
              Gender: null,
              Roles: decodedJwt.role || [],
              Language: null,
              fullName: null,
              photoUrl: ''  // Sera remplacé par person-placeholder.png dans le template
            };

            return user;
          }
      }
    }
    console.log("Error fetching user data: No auth token found");
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

// 🆕 Méthode pour actualiser le profil utilisateur et mettre à jour le signal
  async refreshUserProfile(): Promise<void> {
    try {
      const updatedUser = await this.fetchUser();
      if (updatedUser) {
        this.#userSignal.set(updatedUser);
        console.log('🔄 Profil utilisateur actualisé:', updatedUser);
      }
    } catch (error) {
      console.error('⚠️ Erreur lors de l\'actualisation du profil utilisateur:', error);
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
