import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConferenceService } from 'src/app/services/Conference/conference.service';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  state: ConferenceState;
  conferenceState = ConferenceState;
  isLoading: boolean;
  constructor(private menuOptions: MenuOptionsService,
      private conferenceService: ConferenceService,
      private router: Router) { 
    this.state = ConferenceState.Default;
  }

  ngOnInit(): void {
    this.menuOptions.setOption(MenuOptions.Conference);
    this.conferenceService.clearConference();
    this.loading(false);
  }

  async create(conferenceName: string, organizatorName: string): Promise<void> {
    this.loading(true);
    let conference = await this.conferenceService.createConference(conferenceName, organizatorName);
    if (conference === null) {
      alert("Ошибка во время создания конференции");
    }
    this.loading(false);
    this.router.navigate(["/room"]);;
  }

  async join(conferenceId: string, participantName: string): Promise<void> {
    this.loading(true);
    let conference = await this.conferenceService.joinToConference(conferenceId, participantName);
    console.log(conference);
    if (conference === null) {
      alert("Ошибка во время подключения к конференции");
    }
    this.loading(false);
    this.router.navigate(["/room"]);
  }

  loading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }
}

export enum ConferenceState {
  Default,
  Create,
  Join,
  GetText
}
