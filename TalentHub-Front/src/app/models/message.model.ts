export interface User {

  id: number;

  username: string;

  email: string;

  first_name: string;

  last_name: string;
}

export interface Message {
  id: number;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  expediteur: User;
  destinataire: User;
}

export interface MessageCreation {
  contenu: string;
  destinataire_id: number;
}