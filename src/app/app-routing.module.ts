import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { AuthComponent } from './components/auth/auth.component';
import { ConferenceComponent } from './components/conference/conference.component';
import { ConnectConferenceComponent } from './components/conference/connect-conference/connect-conference.component';
import { RoomComponent } from './components/conference/room/room.component';
import { MainComponent } from './components/main/main.component';
import { TranscriptingComponent } from './components/transcripting/transcripting.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'upload', component: AddVideoComponent },
  { path: 'transcript', component: TranscriptingComponent },
  { path: 'auth/:with', component: AuthComponent },
  { path: 'conference', component: ConferenceComponent },
  { path: 'room', component: RoomComponent },
  { path: 'connect/conference/:conferenceId', component: ConnectConferenceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
