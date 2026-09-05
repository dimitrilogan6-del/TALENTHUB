import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-recruteur-layout',
  standalone: false,
  templateUrl: './recruteur-layout.html',
  styleUrl: './recruteur-layout.css',
})
export class RecruteurLayout implements OnInit {
  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private auth:
      AuthService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}
  darkMode = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('recruteur-theme');

    if (savedTheme === 'dark') {
      this.darkMode = true;
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;

    localStorage.setItem(
      'recruteur-theme',
      this.darkMode ? 'dark' : 'light'
    );
  }

   // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  logout(): void {

    this.auth.logout();


    document.body.classList.remove(
      'dark-mode'
    );


    localStorage.removeItem(
      'talenthub-dark-mode'
    );


    this.router.navigate([
      '/login'
    ]);

  }

}