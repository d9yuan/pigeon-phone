import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { EntryScreenComponent } from './entry-screen/entry-screen.component';
import { AuthModule } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './auth/login-button/login-button.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LogoutButtonComponent } from './auth/logout-button/logout-button/logout-button.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateScreenComponent } from './create-screen/create-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    LockScreenComponent,
    HomeScreenComponent,
    EntryScreenComponent,
    LoginButtonComponent,
    WelcomePageComponent,
    LogoutButtonComponent,
    CreateScreenComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: 'dev-slqkp7l7.us.auth0.com',
      clientId: 'UwGxwLk2fMhZLLY46PDf6aslCFBwvFn6',
      audience: environment.apiUrl,
      scope: 'read:current_user'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
