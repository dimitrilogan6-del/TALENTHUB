import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';

import { App } from './app';
import { OffreList } from './component/offre-list/offre-list';
import { CandidatPage } from './component/candidat-page/candidat-page';
import { CandidatureModal } from './component/candidature-modal/candidature-modal';

import { Header } from './component/header/header';
import { Footer } from './component/footer/footer';
import { InscriptionComponent } from './component/inscription/inscription';
import { SuccessInscriptionModalComponent } from './component/success-inscription-modal/success-inscription-modal';
import { DetailOffreComponent } from './component/detail-offre/detail-offre';
import { APropos } from './component/a-propos/a-propos';
import { Accueil } from './component/accueil/accueil';
import { ConnexionComponent } from './component/connexion/connexion';
import { Entreprise } from './component/entreprise/entreprise';
@NgModule({
  declarations: [
    App,
    OffreList,
    CandidatPage,
    CandidatureModal,
    Header,
    Footer,
    InscriptionComponent,
    SuccessInscriptionModalComponent,
    DetailOffreComponent,
    APropos,
    Accueil,
    ConnexionComponent,
  
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, Entreprise],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
