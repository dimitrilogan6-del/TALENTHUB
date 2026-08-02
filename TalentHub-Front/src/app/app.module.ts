import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
