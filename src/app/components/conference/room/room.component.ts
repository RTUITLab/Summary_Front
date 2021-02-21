import { Component, OnInit } from '@angular/core';
import { ConferenceService } from 'src/app/services/Conference/conference.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  conferenceId: string;
  hostId: string;
  conferenceName: string;
  participantId: string;
  constructor(private conferenceService: ConferenceService) { }

  ngOnInit(): void {
    this.conferenceId = this.conferenceService.conferenceId;
    this.hostId = this.conferenceService.hostId;
    this.conferenceName = this.conferenceService.conferenceName;
    this.participantId = this.conferenceService.participantId;
    console.log(this.participantId);
    console.log(this.hostId);
    
  }

  async end(): Promise<void> {
    alert(await this.conferenceService.endConference(this.conferenceId));
  }

}
