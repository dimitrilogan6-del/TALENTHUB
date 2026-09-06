import { FreelanceProfil } from './services/freelance-dashboard.service';
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
import { FreelanceLayoutComponent } from './layouts/freelance-layout/freelance-layout';
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
import { MesCandidatures } from './dashboard/freelance/mes-candidatures/mes-candidatures';
import { AdminDashboard } from './dashboard/admin/admin-dashboard/admin-dashboard';
import { DashboardRecruteur } from './dashboard/recruteur/dashboard/dashboard';
import { CandidaturesMissions } from './dashboard/recruteur/candidatures-missions/candidatures-missions';
import { EntretiensRecruteur } from './dashboard/recruteur/entretiens-recruteur/entretiens-recruteur';
import { MissionsRecruteur } from './dashboard/recruteur/missions-recruteur/missions-recruteur';
import { OffresRecruteur } from './dashboard/recruteur/offres/offres';
import { CandidaturesRecruteur } from './dashboard/recruteur/candidatures-recruteur/candidatures-recruteur';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FreelanceDashboardComponent } from './dashboard/freelance/freelance-dashboard/freelance-dashboard';
import { MissionsComponent } from './dashboard/freelance/missions/missions';
import { MissionDetailComponent } from './dashboard/freelance/mission-detail/mission-detail';
import { FreelanceProfilComponent } from './dashboard/freelance/profil/profil';
import { Services } from './dashboard/freelance/services/services';
import { MesServices } from './dashboard/freelance/mes-services/mes-services';
import { CommandesRecues } from './dashboard/freelance/commandes-recues/commandes-recues';
import { CandidaturesFreelance } from './dashboard/freelance/candidatures/candidatures';
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
    FreelanceLayoutComponent,
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
    MesCandidatures,
    AdminDashboard,
    DashboardRecruteur,
    CandidaturesMissions,
    EntretiensRecruteur,
    MissionsRecruteur,
    OffresRecruteur,
    CandidaturesRecruteur,
    FreelanceDashboardComponent,
    MissionsComponent,
    MissionDetailComponent,
    FreelanceProfilComponent,
    Services,
    MesServices,
    CommandesRecues,
    CandidaturesFreelance,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    

    // Material Modules
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [App],
})
export class AppModule {}
