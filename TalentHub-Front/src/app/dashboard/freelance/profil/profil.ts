import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  ProfilService,
  Profil
} from '../../../services/profil';


@Component({
  selector: 'app-profil',

  templateUrl:
    './profil.html',

  styleUrls: [
    './profil.css'
  ],

  standalone: false
})
export class FreelanceProfilComponent
implements OnInit {


  // ==========================================================
  // PROFIL
  // ==========================================================

  profil: Profil | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  isEditing = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  formData: Partial<Profil> = {};


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private profilService: ProfilService,

    private cdr: ChangeDetectorRef

  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.loadProfil();

  }


  // ==========================================================
  // RÉCUPÉRER LE PROFIL CONNECTÉ
  // ==========================================================

  loadProfil(): void {

    this.isLoading = true;

    this.errorMessage = '';

    console.log(
      'Chargement du profil freelance connecté...'
    );


    this.profilService
      .getMonProfil()
      .subscribe({

next: (profil: Profil) => {

  console.log(
    'PROFIL FREELANCE REÇU :',
    profil
  );

  this.profil = profil;

  this.formData = {
    telephone: profil.telephone,
    nationalite: profil.nationalite,
    dateNaissance: profil.dateNaissance,
    lieuNaissance: profil.lieuNaissance,
    sexe: profil.sexe,
    niveauEtude: profil.niveauEtude,
    dernierDiplome: profil.dernierDiplome,
    dateObtentionDiplome: profil.dateObtentionDiplome,
    titreProfessionnel: profil.titreProfessionnel,
    specialite: profil.specialite,
    biographie: profil.biographie,
    anneesExperience: profil.anneesExperience,
    tarifHoraire: profil.tarifHoraire,
    deviseTarif: profil.deviseTarif,
    disponibilite: profil.disponibilite,
    portfolioUrl: profil.portfolioUrl,
    linkedinUrl: profil.linkedinUrl,
    githubUrl: profil.githubUrl
  };

  this.isLoading = false;

  this.cdr.detectChanges();
},

        error: (error) => {

          console.error(
            'ERREUR PROFIL :',
            error
          );


          this.isLoading = false;


          if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré. Veuillez vous reconnecter.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'Vous n’avez pas accès à ce profil.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'Profil utilisateur introuvable.';

          }

          else {

            this.errorMessage =
              'Impossible de récupérer votre profil.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // NOM COMPLET
  // ==========================================================

  get nomComplet(): string {

    if (this.profil?.nom_complet) {

      return this.profil.nom_complet;

    }


    if (this.profil?.user) {

      return (

        `${this.profil.user.first_name || ''} ` +
        `${this.profil.user.last_name || ''}`

      ).trim();

    }


    return 'Freelance';

  }


  // ==========================================================
  // INITIALES
  // ==========================================================

  get initiales(): string {

    if (!this.profil) {

      return 'F';

    }


    const prenom =
      this.profil.user?.first_name || '';

    const nom =
      this.profil.user?.last_name || '';


    const initialePrenom =
      prenom.charAt(0);

    const initialeNom =
      nom.charAt(0);


    return (
      initialePrenom +
      initialeNom
    ).toUpperCase() || 'F';

  }


  // ==========================================================
  // PHOTO
  // ==========================================================

  get photoProfil(): string {

    return (
      this.profil?.photoProfil
    ) || 'assets/images/default-avatar.png';

  }


  // ==========================================================
  // TITRE
  // ==========================================================

  get titreProfessionnel(): string {

    return (
      this.profil?.titreProfessionnel
    ) || 'Freelance';

  }


  // ==========================================================
  // DISPONIBILITÉ
  // ==========================================================

  get disponibilite(): boolean {

    return (
      this.profil?.disponibilite
    ) ?? false;

  }


  // ==========================================================
  // STATUT
  // ==========================================================

  get statutCompte(): string {

    return (
      this.profil?.statut_compte
    ) || 'actif';

  }


  // ==========================================================
  // LABEL STATUT
  // ==========================================================

  get statutCompteLabel(): string {

    switch (this.statutCompte) {

      case 'actif':
        return 'Compte actif';

      case 'en_attente':
        return 'En attente';

      case 'suspendu':
        return 'Compte suspendu';

      default:
        return this.statutCompte;

    }

  }


  // ==========================================================
  // COMPLETION
  // ==========================================================

  get profileCompletion(): number {

    return (
      this.profil?.profile_completion
    ) ?? 0;

  }


  // ==========================================================
  // TARIF
  // ==========================================================

  get tarifFormate(): string {

    if (
      this.profil?.tarifHoraire === null ||
      this.profil?.tarifHoraire === undefined
    ) {

      return 'Non renseigné';

    }


    return (
      `${this.profil.tarifHoraire} ` +
      `${this.profil.deviseTarif || 'FCFA'} / heure`
    );

  }


  // ==========================================================
  // COMMENCER MODIFICATION
  // ==========================================================

  startEditing(): void {

    if (!this.profil) {

      return;

    }


    this.isEditing = true;

    this.successMessage = '';

    this.errorMessage = '';


    /*
     * On recharge le formulaire
     * avec les valeurs actuelles.
     */

    this.formData = {

      telephone:
        this.profil.telephone,

      nationalite:
        this.profil.nationalite,

      dateNaissance:
        this.profil.dateNaissance,

      lieuNaissance:
        this.profil.lieuNaissance,

      sexe:
        this.profil.sexe,

      niveauEtude:
        this.profil.niveauEtude,

      dernierDiplome:
        this.profil.dernierDiplome,

      dateObtentionDiplome:
        this.profil.dateObtentionDiplome,

      titreProfessionnel:
        this.profil.titreProfessionnel,

      specialite:
        this.profil.specialite,

      biographie:
        this.profil.biographie,

      anneesExperience:
        this.profil.anneesExperience,

      tarifHoraire:
        this.profil.tarifHoraire,

      deviseTarif:
        this.profil.deviseTarif,

      disponibilite:
        this.profil.disponibilite,

      portfolioUrl:
        this.profil.portfolioUrl,

      linkedinUrl:
        this.profil.linkedinUrl,

      githubUrl:
        this.profil.githubUrl

    };

  }


  // ==========================================================
  // ANNULER
  // ==========================================================

  cancelEditing(): void {

    this.isEditing = false;

    this.successMessage = '';

    this.errorMessage = '';


    if (this.profil) {

      this.formData = {

        telephone:
          this.profil.telephone,

        nationalite:
          this.profil.nationalite,

        dateNaissance:
          this.profil.dateNaissance,

        lieuNaissance:
          this.profil.lieuNaissance,

        sexe:
          this.profil.sexe,

        niveauEtude:
          this.profil.niveauEtude,

        dernierDiplome:
          this.profil.dernierDiplome,

        dateObtentionDiplome:
          this.profil.dateObtentionDiplome,

        titreProfessionnel:
          this.profil.titreProfessionnel,

        specialite:
          this.profil.specialite,

        biographie:
          this.profil.biographie,

        anneesExperience:
          this.profil.anneesExperience,

        tarifHoraire:
          this.profil.tarifHoraire,

        deviseTarif:
          this.profil.deviseTarif,

        disponibilite:
          this.profil.disponibilite,

        portfolioUrl:
          this.profil.portfolioUrl,

        linkedinUrl:
          this.profil.linkedinUrl,

        githubUrl:
          this.profil.githubUrl

      };

    }

  }


  // ==========================================================
  // ENREGISTRER
  // ==========================================================

  saveProfil(): void {

    if (!this.profil) {

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    /*
     * On n'envoie que les champs
     * que le freelance peut modifier.
     */

    const data: Partial<Profil> = {

      telephone:
        this.formData.telephone,

      nationalite:
        this.formData.nationalite,

      dateNaissance:
        this.formData.dateNaissance,

      lieuNaissance:
        this.formData.lieuNaissance,

      sexe:
        this.formData.sexe,

      niveauEtude:
        this.formData.niveauEtude,

      dernierDiplome:
        this.formData.dernierDiplome,

      dateObtentionDiplome:
        this.formData.dateObtentionDiplome,

      titreProfessionnel:
        this.formData.titreProfessionnel,

      specialite:
        this.formData.specialite,

      biographie:
        this.formData.biographie,

      anneesExperience:
        this.formData.anneesExperience,

      tarifHoraire:
        this.formData.tarifHoraire,

      deviseTarif:
        this.formData.deviseTarif,

      disponibilite:
        this.formData.disponibilite,

      portfolioUrl:
        this.formData.portfolioUrl,

      linkedinUrl:
        this.formData.linkedinUrl,

      githubUrl:
        this.formData.githubUrl

    };


    console.log(
      'DONNÉES ENVOYÉES :',
      data
    );


    this.profilService
      .updateProfil(data)
      .subscribe({

        next: (profil) => {

          console.log(
            'PROFIL MODIFIÉ :',
            profil
          );


          this.profil = profil;

          this.isEditing = false;

          this.isSaving = false;

          this.successMessage =
            'Votre profil a été mis à jour avec succès.';


          this.cdr.detectChanges();


          /*
           * Faire disparaître le message
           * après quelques secondes.
           */

          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 4000);

        },


        error: (error) => {

          console.error(
            'ERREUR MODIFICATION PROFIL :',
            error
          );


          this.isSaving = false;


          if (error.status === 400) {

            this.errorMessage =
              'Certaines informations sont invalides. Vérifiez les champs.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'Vous n’avez pas l’autorisation de modifier ce profil.';

          }

          else {

            this.errorMessage =
              'Une erreur est survenue lors de la modification.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}