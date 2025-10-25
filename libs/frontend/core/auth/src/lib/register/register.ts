import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AppStore } from '@fe/stores';


interface RegisterFormModel {
  email: string;
  password: string;
  confirmPassword: string;
}

// Validateur personnalisé pour la correspondance des mots de passe
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'lib-register',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

   private appStore = inject(AppStore);
  private router = inject(Router);

  // Signal d'état UI
  hidePassword = signal(true);
  isSubmitting = signal(false);

  // Création du formulaire avec FormBuilder et validations
  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group({
    email: ['user2@test.be', [Validators.required, Validators.email]],
    password: ['Pwd!123456', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['Pwd!123456', [Validators.required]]
  }, {
    validators: [passwordMatchValidator]
  });

  // Signal Forms API - Conversion des observables en signaux
  private formState = toSignal(this.registerForm.valueChanges, {
    initialValue: this.registerForm.value
  });

  private formStatus = toSignal(this.registerForm.statusChanges, {
    initialValue: this.registerForm.status
  });

  // Signal pour détecter les changements sur le formulaire
  private formChangeCounter = signal(0);

  // Signaux pour les valeurs individuelles des champs avec null safety
  email = computed(() => this.formState().email || '');
  password = computed(() => this.formState().password || '');
  confirmPassword = computed(() => this.formState().confirmPassword || '');

  // Signaux computed pour la validation
  isFormValid = computed(() =>
    this.formStatus() === 'VALID'
  );

  isFormInvalid = computed(() =>
    this.formStatus() === 'INVALID'
  );

  passwordsMatch = computed(() => {
    const pwd = this.password();
    const confirmPwd = this.confirmPassword();
    return pwd.length > 0 && confirmPwd.length > 0 && pwd === confirmPwd;
  });

    // Signaux pour les erreurs de validation avec propriétés définies
  emailErrors = computed(() => {
    const control = this.registerForm.get('email');
    const hasErrors = control?.errors && control.touched;

    return {
      required: hasErrors && !!control?.errors?.['required'],
      email: hasErrors && !!control?.errors?.['email'],
      messages: hasErrors && control?.errors ? Object.keys(control.errors).map(key => {
        if (key === 'required') return 'Email requis';
        if (key === 'email') return 'Format email invalide';
        return '';
      }).filter(Boolean) : []
    };
  });

  passwordErrors = computed(() => {
    const control = this.registerForm.get('password');
    const hasErrors = control?.errors && control.touched;

    return {
      required: hasErrors && !!control?.errors?.['required'],
      minlength: hasErrors && !!control?.errors?.['minlength'],
      messages: hasErrors && control?.errors ? Object.keys(control.errors).map(key => {
        if (key === 'required') return 'Mot de passe requis';
        if (key === 'minlength') return '8 caractères minimum';
        return '';
      }).filter(Boolean) : []
    };
  });

  confirmPasswordErrors = computed(() => {
    const control = this.registerForm.get('confirmPassword');
    const hasErrors = control?.errors && control.touched;
    const formHasPasswordMismatch = this.registerForm.errors?.['passwordMismatch'];

    return {
      required: hasErrors && !!control?.errors?.['required'],
      mismatch: formHasPasswordMismatch && control?.touched,
      messages: [
        ...(hasErrors && control?.errors?.['required'] ? ['Confirmation requise'] : []),
        ...(formHasPasswordMismatch && control?.touched ? ['Les mots de passe ne correspondent pas'] : [])
      ]
    };
  });

  // Signal computed pour la force du mot de passe
  passwordStrength = computed(() => {
    const pwd = this.password();
    if (pwd.length === 0) return { score: 0, label: 'Very Weak', color: 'red' };

    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    return {
      score: strength,
      label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength] || 'Very Weak',
      color: ['red', 'orange', 'yellow', 'lightgreen', 'green'][strength] || 'red'
    };
  });

  // Signal computed pour le statut global du formulaire
  formSummary = computed(() => ({
    isValid: this.isFormValid(),
    hasErrors: this.formStatus() === 'INVALID',
    passwordMatch: this.passwordsMatch(),
    emailValid: !this.emailErrors().required && !this.emailErrors().email,
    passwordStrong: this.passwordStrength().score >= 3,
    canSubmit: this.isFormValid()
  }));

  // Signal de debug (à supprimer en production)
  debugInfo = computed(() => ({
    formStatus: this.formStatus(),
    formValue: this.formState(),
    emailValue: this.email(),
    passwordValue: this.password().replace(/./g, '*'), // Masquer le mot de passe
    confirmPasswordValue: this.confirmPassword().replace(/./g, '*'),
    passwordStrength: this.passwordStrength(),
    isValid: this.isFormValid(),
    errors: {
      email: this.emailErrors(),
      password: this.passwordErrors(),
      confirmPassword: this.confirmPasswordErrors()
    }
  }));

  constructor() {
    this.initializeForm();
    this.loadDraft();

    // Sauvegarde automatique du brouillon quand l'email change
    effect(() => {
      const email = this.email();
      if (email.length > 0 && this.registerForm.get('email')?.valid) {
        this.saveDraft();
      }
    });
  }

  private initializeForm() {
    // Charger le brouillon au démarrage
    this.loadDraft();

    // Configuration de la sauvegarde automatique
    this.registerForm.controls.email.valueChanges.subscribe(() => {
      this.saveDraft();
      this.formChangeCounter.update(c => c + 1);
    });

    // Mettre à jour le compteur pour tous les changements du formulaire
    this.registerForm.valueChanges.subscribe(() => {
      this.formChangeCounter.update(c => c + 1);
    });
  }

  async register() {
    if (!this.isFormValid()) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const email = this.email();
      const password = this.password();
      const confirmPassword = this.confirmPassword();

      if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
        await this.appStore['register'](email, password, confirmPassword);
        localStorage.removeItem('register-draft');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  login() {
    this.router.navigate(['auth/login']);
  }

  cancel() {
  this.router.navigate(['/pages/home']);
  }

  // Méthodes utilitaires pour réinitialiser les champs
  resetForm() {
    this.registerForm.reset({
      email: '',
      password: '',
      confirmPassword: ''
    });
    localStorage.removeItem('register-draft');
  }

  // Méthode pour marquer tous les champs comme touchés
  markAllAsTouched() {
    this.registerForm.markAllAsTouched();
  }

  // Sauvegarde automatique du brouillon avec Signal Forms
  private saveDraft() {
    const email = this.email();
    if (email.length > 0) {
      const draft = {
        email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('register-draft', JSON.stringify(draft));
    }
  }

  // Charger le brouillon sauvegardé
  private loadDraft() {
    const saved = localStorage.getItem('register-draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.email) {
          this.registerForm.patchValue({ email: draft.email });
        }
      } catch (error) {
        console.warn('Could not load draft:', error);
      }
    }
  }

  // Validation en temps réel avec signaux
  validateField(fieldName: keyof RegisterFormModel) {
    const control = this.registerForm.get(fieldName);
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  // Reset spécifique d'un champ
  resetField(fieldName: keyof RegisterFormModel) {
    const control = this.registerForm.get(fieldName);
    control?.reset();
    control?.markAsUntouched();
  }

  // Vérification de la force du mot de passe en temps réel
  checkPasswordStrength() {
    return this.passwordStrength();
  }

  // Getters pour un accès facile aux contrôles (pour le template)
  get emailControl() {
    return this.registerForm.controls.email;
  }

  get passwordControl() {
    return this.registerForm.controls.password;
  }

  get confirmPasswordControl() {
    return this.registerForm.controls.confirmPassword;
  }
}
