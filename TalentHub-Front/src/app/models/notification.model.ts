export interface User {

  id: number;

  username: string;

  email: string;

  first_name: string;

  last_name: string;
}
export interface Notification {
  id: number;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  destinataire: User;
}