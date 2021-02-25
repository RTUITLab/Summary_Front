import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceService } from 'src/app/services/Conference/conference.service';

@Component({
  selector: 'app-connect-conference',
  templateUrl: './connect-conference.component.html',
  styleUrls: ['./connect-conference.component.scss']
})
export class ConnectConferenceComponent implements OnInit {

  readonly key = "conferenceId";
  isOk: boolean;
  conferenceId: string;
  errorText: string;
  constructor(private actRouter: ActivatedRoute,
    private conferenceService: ConferenceService,
    private router: Router) { }

  ngOnInit(): void {
    this.conferenceId = this.actRouter.snapshot.paramMap.get(this.key);
    this.errorText = "";
    if (this.conferenceId) {
      this.isOk = true;
    } else {
      this.isOk = false;
      this.errorText = "Ссылка неверна";
    }
  }

  async join(participantName: string): Promise<void> {
    let conference = await this.conferenceService.joinToConference(this.conferenceId, participantName);
    console.log(conference);
    if (conference === null) {
      this.isOk = false;
      this.errorText = "Ошибка во время подключения к конференции";
    } else {
      this.router.navigate(["/room"]);
    }
  }
}
