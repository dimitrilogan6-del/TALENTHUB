export interface InscriptionData {
  // Champs pour l'utilisateur (User)
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  
  // Champs pour le Profil
  role: 'candidat' | 'recruteur' | 'freelance' | 'admin';
  telephone: string;
  numCni: string;
  dateNaissance: string; 
  lieuNaissance: string;
  sexe: 'M' | 'F' | '';
  niveauEtude: string;
  nationalite: string;
  specialite: string;
  statut?: string;
  dernierDiplome: string;
  dateObtentionDiplome?: string;
  numPassport?: string;
  dateEmbauche?: string;
}