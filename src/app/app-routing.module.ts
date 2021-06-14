import { NgModule } from '@angular/core';
import { MainContentComponent } from './main-content/main-content.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path : '', component: MainContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
