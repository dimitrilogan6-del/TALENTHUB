import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Notification
} from '../../../models/notification.model';

import {
  NotificationService
} from '../../../services/notification.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css'],
  standalone: false
})
export class NotificationsComponent
  implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  notifications: Notification[] = [];


  // ==========================================================
  // ÉTAT
  // ==========================================================

  loading = true;

  erreur = '';


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    console.log(
      'NotificationsComponent initialisé'
    );

    this.chargerNotifications();

  }


  // ==========================================================
  // CHARGER LES NOTIFICATIONS
  // ==========================================================

  chargerNotifications(): void {

    console.log(
      'Chargement des notifications...'
    );

    this.loading = true;
    this.erreur = '';

    this.notificationService
      .getNotifications()
      .subscribe({

        next: (data: Notification[]) => {

          console.log(
            'Notifications reçues :',
            data
          );


          // --------------------------------------------------
          // VÉRIFICATION
          // --------------------------------------------------

          if (!Array.isArray(data)) {

            console.error(
              'La réponse API n\'est pas un tableau :',
              data
            );

            this.notifications = [];

            this.erreur =
              'Format de données incorrect reçu depuis le serveur.';

            this.loading = false;

            this.cdr.detectChanges();

            return;

          }


          // --------------------------------------------------
          // STOCKAGE
          // --------------------------------------------------

          this.notifications = [...data];


          console.log(
            'Notifications affichées :',
            this.notifications
          );


          console.log(
            'Nombre de notifications :',
            this.notifications.length
          );


          // --------------------------------------------------
          // FIN CHARGEMENT
          // --------------------------------------------------

          this.loading = false;


          // --------------------------------------------------
          // FORCE ANGULAR À RAFRAÎCHIR LE TEMPLATE
          // --------------------------------------------------

          this.cdr.detectChanges();

        },


        // ----------------------------------------------------
        // ERREUR
        // ----------------------------------------------------

        error: (error) => {

          console.error(
            'Erreur chargement notifications :',
            error
          );

          this.notifications = [];

          this.erreur =
            'Impossible de charger vos notifications.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // ==========================================================

  marquerLue(
    notification: Notification
  ): void {

    console.log(
      'Marquage notification comme lue :',
      notification
    );


    this.notificationService
      .marquerCommeLue(
        notification.id
      )
      .subscribe({

        next: () => {

          notification.lu = true;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur marquage notification :',
            error
          );

        }

      });

  }


  // ==========================================================
  // TOUT MARQUER COMME LU
  // ==========================================================

  toutMarquerLu(): void {

    console.log(
      'Marquage de toutes les notifications comme lues...'
    );


    this.notificationService
      .toutMarquerLu()
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.map(
              notification => ({
                ...notification,
                lu: true
              })
            );


          console.log(
            'Toutes les notifications sont maintenant lues.'
          );


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur marquage de toutes les notifications :',
            error
          );

        }

      });

  }


  // ==========================================================
  // NOMBRE DE NOTIFICATIONS NON LUES
  // ==========================================================

  get notificationsNonLues(): number {

    return this.notifications.filter(
      notification => !notification.lu
    ).length;

  }


  // ==========================================================
  // VÉRIFIER S'IL Y A DES NOTIFICATIONS
  // ==========================================================

  get aDesNotifications(): boolean {

    return this.notifications.length > 0;

  }

}