import { Component } from '@angular/core';
import { Freelance } from './freelance/freelance';

@Component({
  selector: 'app-root',
  imports: [Freelance],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'talenthub-frontend';
}