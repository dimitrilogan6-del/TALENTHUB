import { Component } from '@angular/core';
import { Connexion} from '../../services/connexion';
import { Router } from '@angular/router';
@Component({
  selector: 'app-connexion',
  standalone: false,
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class ConnexionComponent {
   credentials = {
    email: '',
    password: ''
  };
  rememberMe: boolean = false;
  showPassword: boolean = false;
  message: string = '';

  constructor(private auth: Connexion, private router: Router) {}

  onSubmit() {
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access);
        this.router.navigate(['/offres']);
      },
      error: (err) => {
        this.message = 'Identifiants incorrects.';
      }
    });
  }
}