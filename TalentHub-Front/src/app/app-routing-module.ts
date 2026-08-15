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
import { Freelances } from './component/freelances/freelances';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { CandidatLayoutComponent } from './layouts/candidat-layout/candidat-layout';
import { CandidatDashboardComponent } from './dashboard/candidat/candidat-dashboard/candidat-dashboard';
import { MesCandidaturesComponent } from './dashboard/candidat/mes-candidatures/mes-candidatures';
import { EntretiensCandidatComponent } from './dashboard/candidat/entretiens/entretiens';
import { MessagesComponent } from './dashboard/candidat/messages/messages';
import { NotificationsComponent } from './dashboard/candidat/notifications/notifications';
import { ParametresComponent } from './dashboard/candidat/parametres/parametres';
import { LoginComponent } from './component/login/login';
import { ConnexionRequiredModalComponent } from './component/connexion-required-modal/connexion-required-modal';
const routes: Routes =[
  // {path: 'dashboard', component: Dashboard},
  { path: 'connexion-required', component: ConnexionRequiredModalComponent },
  { path: 'candidat-dashboard', component: CandidatDashboardComponent },

  // =====================================================
  // SITE PUBLIC
  // =====================================================

  {
    path: '',
    component: PublicLayout,

    children: [

      {
        path: '',
        component: Accueil
      },

       { path: 'offres', component: OffreList },


       { path: 'offres/:id', component: DetailOffreComponent },


      {
        path: 'freelances',
        component: Freelances
      },

        { path: 'entreprises', component: Entreprise },


       { path: 'candidats', component: CandidatPage },
       { path: '', component: Accueil },
       { path: 'freelances', component: Freelances },
       { path: 'a-propos', component: APropos },
{
    path: 'login',
    component: LoginComponent
  },      { path: 'register', component: InscriptionComponent },

    ]

  },

  // =====================================================
  // CANDIDAT_DASHBOARD
  // =====================================================

{
  path: 'candidat',
  component: CandidatLayoutComponent,

  children: [

    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },

    {
      path: 'dashboard',
      component: CandidatDashboardComponent
    },

    {
      path: 'candidatures',
      component: MesCandidaturesComponent
    },

    {
      path: 'entretiens',
      component: EntretiensCandidatComponent
    },

  //   {
  //     path: 'profil',
  //     component: ProfilComponent
  //   },

    {
      path: 'messages',
      component: MessagesComponent
    },

    {
      path: 'notifications',
      component: NotificationsComponent
    },

    {
      path: 'parametres',
      component: ParametresComponent
    }
  ]
},

 
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
