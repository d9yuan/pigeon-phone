import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  template: '<button class="big-button" (click)="auth.loginWithRedirect({redirect_uri: redirect_uri, appState: {target: redirect_to}})">Log in</button>',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent {
  public redirect_uri = location.origin;
  public redirect_to: string = '/phone';
  constructor(public auth: AuthService) { 
  }
}
