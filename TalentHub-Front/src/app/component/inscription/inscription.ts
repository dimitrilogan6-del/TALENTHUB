import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { InscriptionService } from '../../services/inscription';
import { AuthService } from '../../services/connexion';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css'],
  standalone: false
})
export class InscriptionComponent implements OnInit {

  inscriptionForm: FormGroup;

  isSubmitting = false;

  showPassword = false;

  showConfirmPassword = false;

  successMessage = '';

  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private router: Router
  ) {

    this.inscriptionForm = this.fb.group(
      {

        // ==========================================
        // INFORMATIONS DE CRÉATION DU COMPTE
        // ==========================================

        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        first_name: [
          '',
          Validators.required
        ],

        last_name: [
          '',
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ],

        role: [
          'candidat',
          Validators.required
        ],

        acceptTerms: [
          false,
          Validators.requiredTrue
        ]

      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }


  ngOnInit(): void {}


  // ==========================================
  // VALIDATION DES MOTS DE PASSE
  // ==========================================

  passwordMatchValidator(
    form: FormGroup
  ) {

    const password =
      form.get('password')?.value;

    const confirmPassword =
      form.get('confirmPassword')?.value;

    if (
      !password ||
      !confirmPassword
    ) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { mismatch: true };
  }


  // ==========================================
  // INSCRIPTION
  // ==========================================

  submitInscription(): void {

    this.successMessage = '';

    this.errorMessage = '';


    // Afficher les erreurs
    // sur tous les champs
    this.inscriptionForm.markAllAsTouched();


    // Vérifier le formulaire
    if (this.inscriptionForm.invalid) {

      this.errorMessage =
        'Veuillez corriger les informations indiquées avant de continuer.';

      return;
    }


    if (this.isSubmitting) {
      return;
    }


    this.isSubmitting = true;


    // ==========================================
    // DONNÉES ENVOYÉES À DJANGO
    // ==========================================

    const formValue =
      this.inscriptionForm.value;


    const userData = {

      username:
        formValue.username.trim(),

      email:
        formValue.email.trim(),

      password:
        formValue.password,

      first_name:
        formValue.first_name.trim(),

      last_name:
        formValue.last_name.trim(),

      role:
        formValue.role

    };


    console.log(
      'Données envoyées à Django :',
      userData
    );


    // ==========================================
    // CRÉATION DU COMPTE
    // ==========================================

    this.inscriptionService
      .submitInscription(userData)
      .subscribe({

        next: (response) => {

          console.log(
            'Inscription réussie :',
            response
          );


          /*
           * Le compte Django vient d'être créé.
           *
           * Nous effectuons maintenant
           * automatiquement la connexion.
           */

          this.loginAutomatically(
            userData.username,
            userData.password
          );

        },


        error: (error) => {

          console.error(
            'Erreur inscription :',
            error
          );


          this.isSubmitting = false;


          this.handleRegistrationError(
            error
          );

        }

      });

  }


  // ==========================================
  // CONNEXION AUTOMATIQUE
  // ==========================================

  private loginAutomatically(
    username: string,
    password: string
  ): void {

    this.authService
      .login({
        username,
        password
      })
      .subscribe({

        next: (response) => {

          console.log(
            'Connexion automatique réussie :',
            response
          );


          if (
            !response ||
            !response.access
          ) {

            this.isSubmitting = false;

            this.errorMessage =
              'Votre compte a été créé, mais la connexion automatique a échoué.';

            return;
          }


          // ==========================================
          // ENREGISTRER LES TOKENS
          // ==========================================

          localStorage.setItem(
            'token',
            response.access
          );


          if (response.refresh) {

            localStorage.setItem(
              'refreshToken',
              response.refresh
            );

          }


          this.successMessage =
            'Votre compte a été créé avec succès ! Bienvenue sur TalentHub.';


          this.isSubmitting = false;


          // ==========================================
          // REDIRECTION
          // ==========================================

          setTimeout(() => {

            this.router.navigate([
              '/dashboard'
            ]);

          }, 800);

        },


        error: (error) => {

          console.error(
            'Erreur connexion automatique :',
            error
          );


          this.isSubmitting = false;


          /*
           * Le compte existe déjà.
           * On redirige vers la connexion
           * si le login automatique échoue.
           */

          this.errorMessage =
            'Votre compte a été créé, mais la connexion automatique a échoué. Vous pouvez vous connecter manuellement.';

        }

      });

  }


  // ==========================================
  // GESTION DES ERREURS DJANGO
  // ==========================================

  private handleRegistrationError(
    error: any
  ): void {

    if (error.status === 0) {

      this.errorMessage =
        'Impossible de contacter le serveur. Vérifiez que Django est démarré.';

      return;
    }


    if (error.status === 400) {

      const errors =
        error.error;


      // Username déjà utilisé
      if (errors?.username) {

        this.errorMessage =
          'Ce nom d’utilisateur est déjà utilisé.';

        return;
      }


      // Email déjà utilisé
      if (errors?.email) {

        this.errorMessage =
          'Cette adresse email est déjà utilisée.';

        return;
      }


      // Erreur générale
      if (errors?.detail) {

        this.errorMessage =
          errors.detail;

        return;
      }


      this.errorMessage =
        'Certaines informations sont invalides. Vérifiez le formulaire.';

      return;
    }


    if (error.status === 409) {

      this.errorMessage =
        'Ce compte existe déjà.';

      return;
    }


    if (error.status >= 500) {

      this.errorMessage =
        'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.';

      return;
    }


    this.errorMessage =
      'Une erreur est survenue lors de la création du compte.';
  }

}