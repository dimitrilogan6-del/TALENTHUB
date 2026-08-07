import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatureModal } from './component/candidature-modal/candidature-modal';
import{ OffreList } from './component/offre-list/offre-list';
import{CandidatPage} from './component/candidat-page/candidat-page';
import { Accueil } from './component/accueil/accueil';
const routes: Routes =[
  { path: '', redirectTo: '/accueil',pathMatch: 'full' },
  { path: 'accueil', component: Accueil },
  { path: 'candidat', component: CandidatPage },
  { path: 'offre', component: OffreList },
  { path: 'candidature', component: CandidatureModal },
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
