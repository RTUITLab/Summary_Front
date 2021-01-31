import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/root/app.component';
import { HeaderComponent } from './components/header/header.component';

import { MenuOptionsService } from './services/MenuOptions/menu-options.service';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { TranscriptingComponent } from './components/transcripting/transcripting.component';
import { VideoComponent } from './components/transcripting/video/video.component';
import { EditorComponent } from './components/transcripting/editor/editor.component';
import { MediaService } from './services/Media/media.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { TextService } from './services/Text/text.service';
import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from './services/Auth/auth.service';

// Angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    AddVideoComponent,
    TranscriptingComponent,
    VideoComponent,
    EditorComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
    HttpClientModule,

    // Angular material
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,

  ],
  providers: [
    MenuOptionsService,
    MediaService,
    TextService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
