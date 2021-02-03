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

// Google auth
import { SocialLoginModule, SocialAuthServiceConfig, VKLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

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

    // Google auth
    SocialLoginModule,

  ],
  providers: [
    MenuOptionsService,
    MediaService,
    TextService,
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1021497487230-qciqlan3dmg1ls237o8ddsos2v272htd.apps.googleusercontent.com'
            )
          },
          {
            id: VKLoginProvider.PROVIDER_ID,
            provider: new VKLoginProvider(
              '7750181'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
