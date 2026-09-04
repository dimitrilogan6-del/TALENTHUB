import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../../services/auth';

import {
  ParametresService
} from '../../../services/parametres.service';


@Component({
  selector: 'app-parametres',

  templateUrl: './parametres.html',

  styleUrls: [
    './parametres.css'
  ],

  standalone: false
})
export class FreelanceParametresComponent
implements OnInit {


  // ==========================================================
  // ÉTATS GÉNÉRAUX
  // ==========================================================

  isSaving = false;

  saveSuccess = false;

  saveError = '';


  // ==========================================================
  // PARAMÈTRES
  // ==========================================================

  settings = {

    notifications: true,

    messages: true,

    candidatures: true,

    entretiens: true,

    emailNotifications: true,

    profileVisible: true,

    darkMode: false

  };


  // ==========================================================
  // CHANGEMENT MOT DE PASSE
  // ==========================================================

  password = {

    ancien: '',

    nouveau: '',

    confirmation: ''

  };


  showOldPassword = false;

  showNewPassword = false;

  showConfirmPassword = false;


  passwordError = '';

  passwordSuccess = '';

  isChangingPassword = false;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private auth: AuthService,

    private router: Router,

    private cdr: ChangeDetectorRef,

    private parametresService: ParametresService

  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.loadSettings();

  }


  // ==========================================================
  // CHARGER LES PARAMÈTRES
  // ==========================================================

  loadSettings(): void {

    const savedSettings =
      localStorage.getItem(
        'talenthub_settings'
      );


    if (savedSettings) {

      try {

        this.settings = {

          ...this.settings,

          ...JSON.parse(
            savedSettings
          )

        };

      }

      catch (error) {

        console.error(
          'Erreur chargement paramètres :',
          error
        );

      }

    }


    // ========================================================
    // APPLIQUER LE MODE SOMBRE
    // ========================================================

    this.applyDarkMode();


    this.cdr.detectChanges();

  }


  // ==========================================================
  // ENREGISTRER LES PARAMÈTRES
  // ==========================================================

  saveSettings(): void {

    this.isSaving = true;

    this.saveSuccess = false;

    this.saveError = '';


    try {

      // ------------------------------------------------------
      // LOCAL STORAGE
      // ------------------------------------------------------

      localStorage.setItem(

        'talenthub_settings',

        JSON.stringify(
          this.settings
        )

      );


      // ------------------------------------------------------
      // MODE SOMBRE
      // ------------------------------------------------------

      this.applyDarkMode();


      // ------------------------------------------------------
      // SIMULATION DU TEMPS DE SAUVEGARDE
      // ------------------------------------------------------

      setTimeout(() => {

        this.isSaving = false;

        this.saveSuccess = true;

        this.cdr.detectChanges();


        setTimeout(() => {

          this.saveSuccess = false;

          this.cdr.detectChanges();

        }, 3000);

      }, 500);

    }

    catch (error) {

      console.error(
        'Erreur sauvegarde paramètres :',
        error
      );

      this.isSaving = false;

      this.saveError =
        'Impossible d’enregistrer les paramètres.';

      this.cdr.detectChanges();

    }

  }


  // ==========================================================
  // APPLIQUER LE MODE SOMBRE
  // ==========================================================

  applyDarkMode(): void {

    if (this.settings.darkMode) {

      document.body.classList.add(
        'dark-mode'
      );

    }

    else {

      document.body.classList.remove(
        'dark-mode'
      );

    }

  }


  // ==========================================================
  // MODE SOMBRE
  // ==========================================================

  toggleDarkMode(): void {

    this.settings.darkMode =
      !this.settings.darkMode;


    this.applyDarkMode();


    // --------------------------------------------------------
    // SAUVEGARDER IMMÉDIATEMENT
    // --------------------------------------------------------

    localStorage.setItem(

      'talenthub_settings',

      JSON.stringify(
        this.settings
      )

    );


    this.cdr.detectChanges();

  }


  // ==========================================================
  // AFFICHER / MASQUER ANCIEN MOT DE PASSE
  // ==========================================================

  toggleOldPassword(): void {

    this.showOldPassword =
      !this.showOldPassword;

  }


  // ==========================================================
  // AFFICHER / MASQUER NOUVEAU MOT DE PASSE
  // ==========================================================

  toggleNewPassword(): void {

    this.showNewPassword =
      !this.showNewPassword;

  }


  // ==========================================================
  // AFFICHER / MASQUER CONFIRMATION
  // ==========================================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }


  // ==========================================================
  // CHANGER MOT DE PASSE
  // ==========================================================

  changePassword(): void {

    // --------------------------------------------------------
    // RÉINITIALISER LES MESSAGES
    // --------------------------------------------------------

    this.passwordError = '';

    this.passwordSuccess = '';


    // --------------------------------------------------------
    // VÉRIFIER LES CHAMPS
    // --------------------------------------------------------

    if (

      !this.password.ancien ||

      !this.password.nouveau ||

      !this.password.confirmation

    ) {

      this.passwordError =
        'Veuillez remplir tous les champs.';

      this.cdr.detectChanges();

      return;

    }


    // --------------------------------------------------------
    // LONGUEUR
    // --------------------------------------------------------

    if (
      this.password.nouveau.length < 8
    ) {

      this.passwordError =
        'Le nouveau mot de passe doit contenir au moins 8 caractères.';

      this.cdr.detectChanges();

      return;

    }


    // --------------------------------------------------------
    // CONFIRMATION
    // --------------------------------------------------------

    if (

      this.password.nouveau !==
      this.password.confirmation

    ) {

      this.passwordError =
        'Les mots de passe ne correspondent pas.';

      this.cdr.detectChanges();

      return;

    }


    // --------------------------------------------------------
    // EMPÊCHER LE MÊME MOT DE PASSE
    // --------------------------------------------------------

    if (

      this.password.ancien ===
      this.password.nouveau

    ) {

      this.passwordError =
        'Le nouveau mot de passe doit être différent de l’ancien.';

      this.cdr.detectChanges();

      return;

    }


    // --------------------------------------------------------
    // CHARGEMENT
    // --------------------------------------------------------

    this.isChangingPassword = true;


    this.cdr.detectChanges();


    // --------------------------------------------------------
    // APPEL DJANGO
    // --------------------------------------------------------

    this.parametresService

      .changerMotDePasse({

        ancien_mot_de_passe:
          this.password.ancien,

        nouveau_mot_de_passe:
          this.password.nouveau,

        confirmation_mot_de_passe:
          this.password.confirmation

      })

      .subscribe({

        // ====================================================
        // SUCCÈS
        // ====================================================

        next: (response) => {

          console.log(
            'Mot de passe modifié :',
            response
          );


          this.isChangingPassword =
            false;


          this.passwordSuccess =
            response.message ||
            'Votre mot de passe a été modifié avec succès.';


          // --------------------------------------------------
          // VIDER LES CHAMPS
          // --------------------------------------------------

          this.password = {

            ancien: '',

            nouveau: '',

            confirmation: ''

          };


          // --------------------------------------------------
          // MASQUER LES MOTS DE PASSE
          // --------------------------------------------------

          this.showOldPassword = false;

          this.showNewPassword = false;

          this.showConfirmPassword = false;


          this.cdr.detectChanges();


          // --------------------------------------------------
          // DISPARITION DU MESSAGE
          // --------------------------------------------------

          setTimeout(() => {

            this.passwordSuccess = '';

            this.cdr.detectChanges();

          }, 4000);

        },


        // ====================================================
        // ERREUR
        // ====================================================

        error: (error) => {

          console.error(
            'Erreur changement mot de passe :',
            error
          );


          this.isChangingPassword =
            false;


          // --------------------------------------------------
          // ERREUR 400
          // --------------------------------------------------

          if (
            error.status === 400
          ) {

            const errors =
              error.error;


            // Ancien mot de passe

            if (
              errors?.ancien_mot_de_passe
            ) {

              const message =
                errors.ancien_mot_de_passe;

              this.passwordError =
                Array.isArray(message)
                  ? message.join(' ')
                  : message;

            }


            // Nouveau mot de passe

            else if (
              errors?.nouveau_mot_de_passe
            ) {

              const message =
                errors.nouveau_mot_de_passe;

              this.passwordError =
                Array.isArray(message)
                  ? message.join(' ')
                  : message;

            }


            // Confirmation

            else if (
              errors?.confirmation_mot_de_passe
            ) {

              const message =
                errors.confirmation_mot_de_passe;

              this.passwordError =
                Array.isArray(message)
                  ? message.join(' ')
                  : message;

            }


            // Erreur générale

            else if (
              errors?.detail
            ) {

              this.passwordError =
                errors.detail;

            }


            else {

              this.passwordError =
                'Impossible de modifier le mot de passe.';

            }

          }


          // --------------------------------------------------
          // ERREUR AUTHENTIFICATION
          // --------------------------------------------------

          else if (
            error.status === 401
          ) {

            this.passwordError =
              'Votre session a expiré. Veuillez vous reconnecter.';

            this.cdr.detectChanges();


            setTimeout(() => {

              this.auth.logout();

              this.router.navigate([
                '/login'
              ]);

            }, 1500);

            return;

          }


          // --------------------------------------------------
          // ERREUR SERVEUR
          // --------------------------------------------------

          else if (
            error.status === 500
          ) {

            this.passwordError =
              'Erreur du serveur. Veuillez réessayer plus tard.';

          }


          // --------------------------------------------------
          // AUTRE ERREUR
          // --------------------------------------------------

          else {

            this.passwordError =
              'Une erreur est survenue. Veuillez réessayer.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  logout(): void {

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}