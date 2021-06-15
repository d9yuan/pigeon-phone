import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { EntryScreenComponent } from './entry-screen/entry-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    LockScreenComponent,
    HomeScreenComponent,
    EntryScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
