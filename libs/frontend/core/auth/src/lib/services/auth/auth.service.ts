import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { firstValueFrom } from "rxjs";
import { IJwt, ILoginResponse, IRegisterResponse, IUserLogged } from "../../models/auth.model";


const USER_STORAGE_KEY = 'user';
const AUTH_TOKEN_STORAGE_KEY = 'authJwtToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpClient = inject(HttpClient);
  router = inject(Router);

  #userSignal = signal<IUserLogged | undefined>(undefined);
  user = this.#userSignal.asReadonly();

  #authTokenSignal= signal<string | undefined>(undefined);
  authToken = this.#authTokenSignal.asReadonly();

  isLoggedIn = computed(() => !!this.user());

  private authenticated = false;
  private adminRole = false;

  constructor() {
    this.#authTokenSignal.set(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined )
    this.loadUserFromStorage();
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY,
          JSON.stringify(user));
      };
      const authToken = this.authToken();
      if (authToken) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
      };
    });

    // this.#authTokenSignal.set(localStorage["authJwtToken"] || undefined ) ; //this.#authToken = localStorage["authJwtToken"] || '';
    // this.#authTokenSignal.set(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined )
  }

  loadUserFromStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#userSignal.set(user);
    }
  }

  async login(email:string, password:string): Promise<ILoginResponse> {

    // const pathUrl = environment.apiRoot + "api/auths/auth/loginwithpwd";
    const pathUrl = "api/auths/auth/loginwithpwd";
    const login$ = this.httpClient.post<ILoginResponse>(`${pathUrl}`, {
      // const login$ = this.httpClient.post<User>(`${environment.apiRoot}/login`, {
      email,
      password});
    const response = await firstValueFrom(login$);

    this.#authTokenSignal.set(response.accessToken);
    localStorage.setItem("authJwtToken", response.accessToken);

    // console.log("User logged: ", response)

    const userLogged = await this.fetchUser();
    if (userLogged) {
      this.#userSignal.set(userLogged);
    }

    this.loginAsUser();
    return response;
  }

  async register(email:string, password:string, confirmPassword:string): Promise<IRegisterResponse | Error> {

        // 🆕 MIGRATION VERS ENDPOINT IAM
    // ANCIEN: const pathUrl = "api/auths/auth/registerwithpwd";
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
      // Roles: ["GUEST"],
      // Language: "fr"
    };

   // N'ajouter les champs optionnels que s'ils ont des valeurs valides
    // (évite les erreurs de validation sur chaînes vides)

    console.log("Registering User Payload: ", payload);


    const register$ = this.httpClient.post<IRegisterResponse>(`${pathUrl}`, payload);
    const response = await firstValueFrom(register$);

    console.log("Registering User Response: ", response)

    return response;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem("authJwtToken");
    this.#authTokenSignal.set(undefined);
    this.#userSignal.set(undefined);
    console.log("User: ", this.user)

    this.logoutAsUserOrAdmin();

    // await this.router.navigateByUrl('/login');
  }

// Todo Update user photo both backend and frontend signal : chifeter vezrs un service spécifique ?
 async updateUserPhoto(photoUrl: string): Promise<{success: boolean, message: string, photoUrl?: string}> {
    try {
      console.log('🔐 Token d\'authentification:', this.authToken());
      console.log('👤 Utilisateur actuel:', this.user());
      console.log('📤 Données envoyées:', { photoUrl });

      const response = await firstValueFrom(
        this.httpClient.put<{success: boolean, message: string, photoUrl?: string}>('http://localhost:3100/api/authentication/update-photo', {
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

  async fetchUser(): Promise<IUserLogged | undefined | null> {

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
            this.httpClient.get<{ user: IUserLogged, fullName: string  } | { success: boolean, message: string}>(`api/auths/auth/loggedUser/${emailToCheck}`)
          //    this.httpClient.get<{user: IUserLogged, fullName: string}>('http://localhost:3100/api/authentication/profile')

          );
          if ('success' in response) {
            console.error(response.message);
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
    return null;
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
  // Log out the user
  logoutAsUserOrAdmin() {
    this.authenticated = false;
    this.adminRole = false;
  }

}
