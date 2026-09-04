import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Message,
  MessageCreation
} from '../../../models/message.model';

import {
  MessageService
} from '../../../services/message.service';

import {
  AuthService
} from '../../../services/auth';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.html',
  styleUrls: ['./messages.css'],
  standalone: false
})
export class MessagesRecruteur
implements OnInit {


  // =========================================================
  // DONNÉES
  // =========================================================

  messages: Message[] = [];

  conversations: any[] = [];

  conversationSelectionnee: any = null;

  messagesConversation: Message[] = [];


  // =========================================================
  // ÉTAT
  // =========================================================

  loading = true;

  erreur = '';

  utilisateurConnecteId: number | null = null;


  // =========================================================
  // FORMULAIRE
  // =========================================================

  nouveauMessage = '';

  destinataireId: number | null = null;

  envoiEnCours = false;


  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {

    console.log(
      'MessagesComponent initialisé'
    );

    this.recupererUtilisateurConnecte();

    this.chargerMessages();

  }


  // =========================================================
  // UTILISATEUR CONNECTÉ
  // =========================================================

  recupererUtilisateurConnecte(): void {

    const utilisateur =
      this.authService.getCurrentUser();

    console.log(
      'Utilisateur connecté :',
      utilisateur
    );

    if (utilisateur) {

      this.utilisateurConnecteId =
        Number(utilisateur.user_id);

    }

    console.log(
      'ID utilisateur connecté :',
      this.utilisateurConnecteId
    );

  }


  // =========================================================
  // CHARGER LES MESSAGES
  // =========================================================

chargerMessages(): void {

  this.loading = true;
  this.erreur = '';

  // Important :
  // aucune conversation ne doit être ouverte
  this.conversationSelectionnee = null;
  this.messagesConversation = [];
  this.destinataireId = null;
  this.nouveauMessage = '';

  this.messageService
    .getMessages()
    .subscribe({

      next: (data: Message[]) => {

        console.log(
          'Messages reçus :',
          data
        );

        // ---------------------------------------------------
        // VÉRIFICATION
        // ---------------------------------------------------

        if (!Array.isArray(data)) {

          console.error(
            'Les messages reçus ne sont pas un tableau :',
            data
          );

          this.messages = [];
          this.conversations = [];

          this.loading = false;

          this.erreur =
            'Format de données incorrect reçu depuis le serveur.';

          this.cdr.detectChanges();

          return;
        }


        // ---------------------------------------------------
        // STOCKAGE
        // ---------------------------------------------------

        this.messages = [...data];


        // ---------------------------------------------------
        // CONSTRUIRE LES CONVERSATIONS
        // ---------------------------------------------------

        this.construireConversations();


        // ---------------------------------------------------
        // IMPORTANT :
        // NE PAS OUVRIR AUTOMATIQUEMENT
        // UNE CONVERSATION
        // ---------------------------------------------------

        this.conversationSelectionnee = null;

        this.messagesConversation = [];

        this.destinataireId = null;

        this.nouveauMessage = '';


        // ---------------------------------------------------
        // FIN CHARGEMENT
        // ---------------------------------------------------

        this.loading = false;

        console.log(
          'Conversations disponibles :',
          this.conversations
        );

        console.log(
          'Total messages non lus :',
          this.totalMessagesNonLus
        );


        this.cdr.detectChanges();

      },


      error: (err) => {

        console.error(
          'Erreur chargement messages :',
          err
        );

        this.messages = [];

        this.conversations = [];

        this.conversationSelectionnee = null;

        this.messagesConversation = [];

        this.destinataireId = null;

        this.nouveauMessage = '';

        this.loading = false;

        this.erreur =
          'Impossible de charger vos messages.';

        this.cdr.detectChanges();

      }

    });

}

  // =========================================================
  // CONSTRUIRE LES CONVERSATIONS
  // =========================================================

  construireConversations(): void {

    const map =
      new Map<number, any>();


    this.messages.forEach(
      message => {

        let autreUtilisateur: any;


        // -----------------------------------------------------
        // SI JE SUIS L'EXPÉDITEUR
        // -----------------------------------------------------

        if (
          message.expediteur?.id ===
          this.utilisateurConnecteId
        ) {

          autreUtilisateur =
            message.destinataire;

        }


        // -----------------------------------------------------
        // SI JE SUIS LE DESTINATAIRE
        // -----------------------------------------------------

        else {

          autreUtilisateur =
            message.expediteur;

        }


        if (!autreUtilisateur) {

          return;

        }


        const autreId =
          Number(autreUtilisateur.id);


        // -----------------------------------------------------
        // CRÉER LA CONVERSATION
        // -----------------------------------------------------

        if (!map.has(autreId)) {

          map.set(
            autreId,
            {

              utilisateur:
                autreUtilisateur,

              messages: [],

              dernierMessage:
                message,

              messagesNonLus: 0

            }
          );

        }


        const conversation =
          map.get(autreId);


        conversation.messages.push(
          message
        );


        // -----------------------------------------------------
        // COMPTER LES MESSAGES NON LUS
        //
        // Seulement les messages reçus
        // -----------------------------------------------------

        if (
          !message.lu &&
          message.expediteur?.id !==
          this.utilisateurConnecteId
        ) {

          conversation.messagesNonLus++;

        }


        // -----------------------------------------------------
        // DERNIER MESSAGE
        // -----------------------------------------------------

        if (
          new Date(
            message.dateEnvoi
          ).getTime()
          >
          new Date(
            conversation.dernierMessage.dateEnvoi
          ).getTime()
        ) {

          conversation.dernierMessage =
            message;

        }

      }
    );


    // ---------------------------------------------------------
    // TRANSFORMER EN TABLEAU
    // ---------------------------------------------------------

    this.conversations =
      Array.from(
        map.values()
      );


    // ---------------------------------------------------------
    // TRIER PAR DERNIER MESSAGE
    // ---------------------------------------------------------

    this.conversations.sort(
      (a, b) =>
        new Date(
          b.dernierMessage.dateEnvoi
        ).getTime()
        -
        new Date(
          a.dernierMessage.dateEnvoi
        ).getTime()
    );

  }


  // =========================================================
  // SÉLECTIONNER UNE CONVERSATION
  // =========================================================

  selectionnerConversation(
    conversation: any
  ): void {

    this.conversationSelectionnee =
      conversation;


    this.messagesConversation =
      this.messages
        .filter(
          message => {

            const autreId =
              message.expediteur?.id ===
              this.utilisateurConnecteId

                ? message.destinataire?.id

                : message.expediteur?.id;


            return (
              Number(autreId) ===
              Number(
                conversation.utilisateur.id
              )
            );

          }
        )
        .sort(
          (a, b) =>
            new Date(
              a.dateEnvoi
            ).getTime()
            -
            new Date(
              b.dateEnvoi
            ).getTime()
        );


    // ---------------------------------------------------------
    // DESTINATAIRE
    // ---------------------------------------------------------

    this.destinataireId =
      conversation.utilisateur.id;


    // ---------------------------------------------------------
    // MARQUER LES MESSAGES REÇUS COMME LUS
    // ---------------------------------------------------------

    const messagesNonLus =
      this.messagesConversation.filter(
        message =>
          !message.lu &&
          message.expediteur?.id !==
          this.utilisateurConnecteId
      );


    messagesNonLus.forEach(
      message => {

        this.marquerLu(
          message,
          false
        );

      }
    );


    // ---------------------------------------------------------
    // RÉINITIALISER LE COMPTEUR
    // ---------------------------------------------------------

    conversation.messagesNonLus = 0;


    this.cdr.detectChanges();

  }


  // =========================================================
  // MARQUER COMME LU
  // =========================================================

  marquerLu(
    message: Message,
    refresh = true
  ): void {

    if (message.lu) {

      return;

    }


    // Mise à jour immédiate de l'interface

    message.lu = true;


    this.messageService
      .marquerCommeLu(
        message.id
      )
      .subscribe({

        next: () => {

          console.log(
            'Message marqué comme lu :',
            message.id
          );


          if (refresh) {

            this.construireConversations();

            this.cdr.detectChanges();

          }

        },


        error: (err) => {

          console.error(
            'Erreur marquage message :',
            err
          );

        }

      });

  }


  // =========================================================
  // ENVOYER UN MESSAGE
  // =========================================================

  envoyerMessage(): void {

    const contenu =
      this.nouveauMessage.trim();


    if (
      !contenu ||
      !this.destinataireId
    ) {

      return;

    }


    this.envoiEnCours = true;


    const messageCreation:
      MessageCreation = {

      contenu,

      destinataire_id:
        this.destinataireId

    };


    this.messageService
      .envoyerMessage(
        messageCreation
      )
      .subscribe({

        next: (message: Message) => {

          console.log(
            'Message envoyé :',
            message
          );


          // Ajouter le nouveau message

          this.messages.push(
            message
          );


          // Vider le formulaire

          this.nouveauMessage = '';


          // Reconstruire les conversations

          this.construireConversations();


          // Recharger la conversation actuelle

          if (
            this.conversationSelectionnee
          ) {

            const conversation =
              this.conversations.find(
                c =>
                  Number(
                    c.utilisateur.id
                  ) ===
                  Number(
                    this.destinataireId
                  )
              );


            if (conversation) {

              this.selectionnerConversation(
                conversation
              );

            }

          }


          this.envoiEnCours = false;


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'Erreur envoi message :',
            err
          );

          this.envoiEnCours = false;

          alert(
            'Impossible d’envoyer le message.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // NOM UTILISATEUR
  // =========================================================

  getNomUtilisateur(
    utilisateur: any
  ): string {

    if (!utilisateur) {

      return 'Utilisateur';

    }


    const nom =
      `${utilisateur.first_name || ''} ${
        utilisateur.last_name || ''
      }`.trim();


    return (
      nom ||
      utilisateur.username ||
      'Utilisateur'
    );

  }


  // =========================================================
  // INITIALLES
  // =========================================================

  getInitiales(
    utilisateur: any
  ): string {

    if (!utilisateur) {

      return '?';

    }


    const prenom =
      utilisateur.first_name || '';

    const nom =
      utilisateur.last_name || '';


    if (
      prenom &&
      nom
    ) {

      return (
        prenom.charAt(0) +
        nom.charAt(0)
      ).toUpperCase();

    }


    return (
      utilisateur.username ||
      '?'
    )
      .substring(0, 2)
      .toUpperCase();

  }


  // =========================================================
  // DATE
  // =========================================================

  formaterDate(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }


  // =========================================================
  // DERNIER MESSAGE
  // =========================================================

  apercuMessage(
    message: Message
  ): string {

    if (!message?.contenu) {

      return '';

    }


    if (
      message.contenu.length > 45
    ) {

      return (
        message.contenu.substring(
          0,
          45
        ) + '...'
      );

    }


    return message.contenu;

  }


  // =========================================================
  // MESSAGE ENVOYÉ PAR MOI ?
  // =========================================================

  estMonMessage(
    message: Message
  ): boolean {

    return (
      Number(
        message.expediteur?.id
      ) ===
      Number(
        this.utilisateurConnecteId
      )
    );

  }


  // =========================================================
  // NOMBRE TOTAL DE NON LUS
  // =========================================================

  get totalMessagesNonLus(): number {

    return this.messages.filter(
      message =>
        !message.lu &&
        message.expediteur?.id !==
        this.utilisateurConnecteId
    ).length;

  }
gererToucheEntree(event: Event): void {

  const clavier =
    event as KeyboardEvent;

  if (clavier.shiftKey) {
    return;
  }

  event.preventDefault();

  if (
    !this.envoiEnCours &&
    this.destinataireId &&
    this.nouveauMessage.trim()
  ) {

    this.envoyerMessage();

  }

}


}