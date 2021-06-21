import { NgModule } from '@angular/core';
import { MainContentComponent } from './main-content/main-content.component';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
const routes: Routes = [
  { path : '', redirectTo : 'welcome', pathMatch : 'full'},
  { path: 'welcome', component: WelcomePageComponent },
  { path : 'phone', component: MainContentComponent, pathMatch : 'full', canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
