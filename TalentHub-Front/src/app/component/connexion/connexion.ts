import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Connexion } from '../../services/connexion';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ConnexionComponent {
  rememberMe: boolean = false;
  showPassword: boolean = false;
  message: string = '';

  credentials = {
    email: '',
    password: ''
  };

  constructor(private auth: Connexion, private router: Router) {}

  onSubmit(): void {
    console.log('Tentative de connexion avec :', this.credentials);
    // Ajoutez ici la logique d'appel au service de connexion
  }
}