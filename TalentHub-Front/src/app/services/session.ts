import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  Profil
} from './profil';


@Injectable({
  providedIn: 'root'
})
export class SessionService {


  private profilSubject =
    new BehaviorSubject<Profil | null>(
      null
    );


  profil$ =
    this.profilSubject.asObservable();


  // =========================================================
  // PROFIL
  // =========================================================

  setProfil(
    profil: Profil
  ): void {

    this.profilSubject.next(
      profil
    );

  }


  // =========================================================
  // RÉCUPÉRER LE PROFIL
  // =========================================================

  getProfil(): Profil | null {

    return this.profilSubject.value;

  }


  // =========================================================
  // RÔLE
  // =========================================================

  getRole(): string | null {

    const profil =
      this.getProfil();


    if (!profil) {

      return null;

    }


    return profil.role;

  }


  // =========================================================
  // ADMIN
  // =========================================================

  isAdmin(): boolean {

    const profil =
      this.getProfil();


    return profil?.est_admin === true;

  }


  // =========================================================
  // VIDER SESSION
  // =========================================================

  clear(): void {

    this.profilSubject.next(
      null
    );

  }

}