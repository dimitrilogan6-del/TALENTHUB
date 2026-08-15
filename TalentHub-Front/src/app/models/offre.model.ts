// ============================================================
// ENTREPRISE
// ============================================================

export interface Entreprise {
  id: number;
  nom: string;
  secteur?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  siteweb?: string | null;
  description?: string | null;
  logo?: string | null;
  statut?: string;
  verifiee?: boolean;
  created_at?: string;
  updated_at?: string;
}


// ============================================================
// COMPETENCE D'UNE OFFRE
// ============================================================

export interface NiveauCompetenceOffre {
  id: number;

  competence: number;

  competenceNom?: string;

  niveauRequis:
    | 'debutant'
    | 'intermediaire'
    | 'avance'
    | 'expert'
    | string;

  estObligatoire: boolean;
}


// ============================================================
// OFFRE
// ============================================================

export interface Offre {

  id: number;

  titre: string;

  description: string;

  typeOffre:
    | 'CDI'
    | 'CDD'
    | 'stage'
    | 'freelance'
    | 'alternance'
    | 'interim'
    | string;

  localisation?: string | null;

  salaireMin?: number | string | null;

  salaireMax?: number | string | null;

  deviseSalaire?: string;

  datePublication?: string;

  dateLimite?: string;

  statut?:
    | 'brouillon'
    | 'en_attente'
    | 'publiee'
    | 'suspendue'
    | 'expiree'
    | 'fermee'
    | string;

  // ==========================================================
  // RELATIONS
  // ==========================================================

  /**
   * ID de l'entreprise envoyé par Django.
   *
   * Exemple :
   * "entreprise": 3
   */
  entreprise: number;

  /**
   * Objet entreprise détaillé envoyé par
   * entrepriseDetail dans OffreSerializer.
   */
  entrepriseDetail?: Entreprise | null;

  /**
   * ID du recruteur.
   */
  recruteur: number;

  /**
   * Nom du recruteur calculé par Django.
   */
  recruteurNom?: string;

  /**
   * Compétences avec leur niveau requis.
   */
  competences?: NiveauCompetenceOffre[];

  created_at?: string;

  updated_at?: string;
}