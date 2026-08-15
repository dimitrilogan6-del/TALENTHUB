import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  NgForm
} from '@angular/forms';

import {
  AuthService
} from '../../services/auth';

import {
  ProfilService
} from '../../services/profil';

import {
  SessionService
} from '../../services/session';

@Component({
  selector: 'app-login',

  templateUrl: './login.html',

  styleUrl: './login.css',

  standalone: false
})
export class LoginComponent
  implements OnInit {


  credentials = {
    username: '',
    password: ''
  };


  rememberMe = false;

  showPassword = false;

  isLoading = false;

  successMessage = '';

  errorMessage = '';

constructor(

  private auth: AuthService,

  private router: Router,

  private profilService: ProfilService,

  private sessionService: SessionService

) {}



  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {

    if (
      this.auth.isLoggedIn()
    ) {

      this.router.navigate([
        '/offres'
      ]);

    }

  }


  // ============================================================
  // CONNEXION
  // ============================================================

  onSubmit(
    loginForm: NgForm
  ): void {

    this.successMessage = '';

    this.errorMessage = '';


    loginForm.control.markAllAsTouched();


    if (
      loginForm.invalid
    ) {

      this.errorMessage =
        'Veuillez renseigner tous les champs obligatoires.';

      return;

    }


    this.isLoading = true;


    this.auth.login(
      this.credentials
    ).subscribe({

      next: (response) => {


        // ================================================
        // SAUVEGARDE JWT
        // ================================================

 this.auth.saveTokens(
  response.access,
  response.refresh,
  this.rememberMe
);


this.profilService
  .getMonProfil()
  .subscribe({

    next: (profil) => {

      console.log(
        'Profil connecté :',
        profil
      );


      this.sessionService
        .setProfil(profil);


      this.successMessage =
        'Connexion réussie.';


      this.isLoading = false;


      // ==========================================
      // REDIRECTION SELON LE RÔLE
      // ==========================================

      if (profil.est_admin) {

        this.router.navigate([
          '/dashboard/admin'
        ]);

        return;

      }


      switch (profil.role) {

        case 'candidat':

          this.router.navigate([
            '/dashboard/candidat'
          ]);

          break;


        case 'freelance':

          this.router.navigate([
            '/dashboard/freelance'
          ]);

          break;


        case 'recruteur':

          this.router.navigate([
            '/dashboard/recruteur'
          ]);

          break;


        default:

          this.router.navigate([
            '/offres'
          ]);

      }

    },


    error: (error) => {

      console.error(
        'Erreur récupération profil :',
        error
      );


      this.isLoading = false;


      this.errorMessage =
        'Connexion réussie, mais impossible de récupérer votre profil.';

    }

  });


        this.successMessage =
          'Connexion réussie.';


        this.isLoading = false;


        // ================================================
        // REDIRECTION
        // ================================================

        setTimeout(() => {

          this.router.navigate([
            '/offres'
          ]);

        }, 1000);

      },


      error: (error) => {

        this.isLoading = false;

        console.error(
          'Erreur connexion :',
          error
        );


        if (
          error.status === 400 ||
          error.status === 401
        ) {

          this.errorMessage =
            'Nom d’utilisateur ou mot de passe incorrect.';

          return;

        }


        if (
          error.status === 403
        ) {

          this.errorMessage =
            'Votre compte est bloqué ou suspendu.';

          return;

        }


        if (
          error.status === 404
        ) {

          this.errorMessage =
            'Service de connexion introuvable.';

          return;

        }


        if (
          error.status === 0
        ) {

          this.errorMessage =
            'Impossible de joindre le serveur Django.';

          return;

        }


        this.errorMessage =
          'Une erreur est survenue.';

      }

    });

  }


  // ============================================================
  // AFFICHER / CACHER MOT DE PASSE
  // ============================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

}