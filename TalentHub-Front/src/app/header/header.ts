import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: false
})
export class HeaderComponent
implements OnInit {

  isLoggedIn = false;

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.auth.isLoggedIn$
      .subscribe(status => {

        this.isLoggedIn = status;

      });

  }

  logout(): void {

    this.auth.logout();

  }
}