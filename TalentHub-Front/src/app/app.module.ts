import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';

import { App } from './app';
import { OffreList } from './component/offre-list/offre-list';
import { CandidatPage } from './component/candidat-page/candidat-page';
import { CandidatureModal } from './component/candidature-modal/candidature-modal';
import { HeaderComponent } from './header/header';
import { Footer } from './footer/footer';
import { InscriptionComponent } from './component/inscription/inscription';
import { SuccessInscriptionModalComponent } from './component/success-inscription-modal/success-inscription-modal';
import { DetailOffreComponent } from './component/detail-offre/detail-offre';
import { APropos } from './component/a-propos/a-propos';
import { Accueil } from './component/accueil/accueil';
import { ConnexionComponent } from './component/connexion/connexion';
import { Entreprise } from './component/entreprise/entreprise';
import { Freelances } from './component/freelances/freelances';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { CandidatLayoutComponent } from './layouts/candidat-layout/candidat-layout';
import { FreelanceLayout } from './layouts/freelance-layout/freelance-layout';
import { RecruteurLayout } from './layouts/recruteur-layout/recruteur-layout';
import { SuccessModalComponent } from './component/success-modal/success-modal';
import { ConnexionRequiredModalComponent } from './component/connexion-required-modal/connexion-required-modal';
import { CandidatDashboardComponent } from './dashboard/candidat/candidat-dashboard/candidat-dashboard';
import { EntretiensCandidatComponent } from './dashboard/candidat/entretiens/entretiens';
import { MesCandidaturesComponent } from './dashboard/candidat/mes-candidatures/mes-candidatures';
import { MessagesComponent } from './dashboard/candidat/messages/messages';
import { NotificationsComponent } from './dashboard/candidat/notifications/notifications';
import { ParametresComponent } from './dashboard/candidat/parametres/parametres';
import { LoginComponent } from './component/login/login';
import { AuthInterceptor } from './auth/auth-interceptor';
@NgModule({
  declarations: [
    App,
    HeaderComponent,
    OffreList,
    CandidatPage,
    CandidatureModal,
    Footer,
    InscriptionComponent,
    SuccessInscriptionModalComponent,
    DetailOffreComponent,
    APropos,
    Accueil,
    ConnexionComponent,
    Freelances,
    PublicLayout,
    AdminLayout,
    CandidatLayoutComponent,
    FreelanceLayout,
    RecruteurLayout,
    SuccessModalComponent,
    ConnexionRequiredModalComponent,
    CandidatDashboardComponent,
    EntretiensCandidatComponent,
    MesCandidaturesComponent,
    MessagesComponent,
    NotificationsComponent,
    ParametresComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Entreprise,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [App],
})
export class AppModule {}
