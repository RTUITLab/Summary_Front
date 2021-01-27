import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { AuthComponent } from './components/auth/auth.component';
import { MainComponent } from './components/main/main.component';
import { TranscriptingComponent } from './components/transcripting/transcripting.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'upload', component: AddVideoComponent },
  { path: 'transcript', component: TranscriptingComponent },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
