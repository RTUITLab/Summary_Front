import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/root/app.component';
import { HeaderComponent } from './components/header/header.component';

import { MenuOptionsService } from './services/MenuOptions/menu-options.service';
import { MainComponent } from './components/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    MenuOptionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
