import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { MainComponent } from './components/main/main.component';
import { TranscriptingComponent } from './components/transcripting/transcripting.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'upload', component: AddVideoComponent},
  {path: 'transcript', component: TranscriptingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
