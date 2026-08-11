import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatureModal } from './component/candidature-modal/candidature-modal';
import{ OffreList } from './component/offre-list/offre-list';
import{CandidatPage} from './component/candidat-page/candidat-page';

import { Accueil } from './component/accueil/accueil';

import { InscriptionComponent } from './component/inscription/inscription';
import { DetailOffreComponent } from './component/detail-offre/detail-offre';
import { APropos } from './component/a-propos/a-propos';
import { ConnexionComponent} from './component/connexion/connexion';
import { Entreprise } from './component/entreprise/entreprise';
const routes: Routes =[
  { path: '', redirectTo: '/accueil',pathMatch: 'full' },
  { path: 'accueil', component: Accueil },
  { path: 'candidat', component: CandidatPage },
  { path: 'offre', component: OffreList },
    { path: 'offre/:id', component: DetailOffreComponent },
  { path: 'candidature', component: CandidatureModal },
  { path: 'inscription', component: InscriptionComponent },
  {path: 'a-propos', component: APropos},
  {path: 'connexion', component: ConnexionComponent},
  {path: 'entreprise', component: Entreprise}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
