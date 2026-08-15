import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OffreService } from '../../services/offre';
import { Offre } from '../../models/offre.model';
import { CandidatureModal } from '../../component/candidature-modal/candidature-modal';
import { AuthService } from '../../services/connexion';
import { ConnexionRequiredModalComponent } from '../../component/connexion-required-modal/connexion-required-modal';

@Component({
  selector: 'app-detail-offre',
  standalone: false,
  templateUrl: './detail-offre.html',
  styleUrl: './detail-offre.css'
})
export class DetailOffreComponent implements OnInit {

  offre: Offre | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService,
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log(
      '================================='
    );

    console.log(
      'DETAIL OFFRE INITIALISÉ'
    );

    console.log(
      'URL :',
      this.router.url
    );


    const id =
      this.route.snapshot.paramMap.get('id');


    console.log(
      'ID :',
      id
    );


    if (!id) {

      console.error(
        'Aucun ID dans la route'
      );

      return;
    }


    this.offreService
      .getOffreById(Number(id))
      .subscribe({

        next: (data: Offre) => {

          console.log(
            'API DETAIL :',
            data
          );


          this.offre = data;


          console.log(
            'VARIABLE OFFRE :',
            this.offre
          );


          /*
           * Force Angular à mettre à jour
           * immédiatement la vue.
           */
          this.cdr.detectChanges();


          console.log(
            'DETECTION ANGULAR EFFECTUÉE'
          );

        },


        error: (error) => {

          console.error(
            'ERREUR DETAIL OFFRE :',
            error
          );

        }

      });

  }


  goBack(): void {

    this.router.navigate([
      '/offres'
    ]);

  }


  openPostulerModal(): void {

    if (!this.offre) {

      console.log(
        'Aucune offre disponible'
      );

      return;
    }


    if (!this.authService.isLoggedIn()) {

      const dialogRef =
        this.dialog.open(
          ConnexionRequiredModalComponent,
          {
            width: '450px',
            maxWidth: '95vw',

            data: {
              titre: this.offre.titre
            }
          }
        );


      dialogRef
        .afterClosed()
        .subscribe(result => {

          if (result === 'login') {

            this.router.navigate(
              ['/connexion'],
              {
                queryParams: {
                  returnUrl:
                    this.router.url
                }
              }
            );

          }

        });


      return;
    }


    this.dialog.open(
      CandidatureModal,
      {
        width: '500px',
        maxWidth: '95vw',

        data: {
          titre:
            this.offre.titre,

          entreprise:
            this.offre.entrepriseDetail?.nom ||
            'Entreprise inconnue',

          offreId:
            this.offre.id
        }
      }
    );

  }

}