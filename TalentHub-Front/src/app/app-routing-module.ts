import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CandidatureModal } from './component/candidature-modal/candidature-modal';
import { OffreList } from './component/offre-list/offre-list';
import { CandidatPage } from './component/candidat-page/candidat-page';
import { Accueil } from './component/accueil/accueil';
import { InscriptionComponent } from './component/inscription/inscription';
import { DetailOffreComponent } from './component/detail-offre/detail-offre';
import { APropos } from './component/a-propos/a-propos';
import { ConnexionComponent } from './component/connexion/connexion';
import { Freelances } from './component/freelances/freelances';
// 1. Ajouter l'importation ici (ajustez le chemin selon l'emplacement de votre fichier)
import { EntreprisesComponent } from './entreprises/entreprises'; 

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: Accueil },
  { path: 'candidat', component: CandidatPage },
  { path: 'offre', component: OffreList },
  { path: 'offre/:id', component: DetailOffreComponent },
  { path: 'candidature', component: CandidatureModal },
  { path: 'inscription', component: InscriptionComponent },
  // 2. Placer la route à l'intérieur du tableau
  { path: 'entreprises', component: EntreprisesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }