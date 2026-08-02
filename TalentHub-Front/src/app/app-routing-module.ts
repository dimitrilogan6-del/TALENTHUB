import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatureModal } from './component/candidature-modal/candidature-modal';
import{ OffreList } from './component/offre-list/offre-list';
import{CandidatPage} from './component/candidat-page/candidat-page';
import { InscriptionComponent } from './component/inscription/inscription';
import { DetailOffreComponent } from './component/detail-offre/detail-offre';
const routes: Routes =[
  { path: '', redirectTo: '/candidat',pathMatch: 'full' },
  { path: 'candidat', component: CandidatPage },
  { path: 'offre', component: OffreList },
    { path: 'offres/:id', component: DetailOffreComponent },
  { path: 'candidature', component: CandidatureModal },
  { path: 'inscription', component: InscriptionComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
