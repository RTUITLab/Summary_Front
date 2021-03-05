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

  isJsonType: boolean;

  translation: string;
  constructor(private menuOptions: MenuOptionsService,
    private conferenceService: ConferenceService,
    private router: Router) { }

  ngOnInit(): void {
    this.menuOptions.setOption(MenuOptions.Conference);
    this.conferenceService.clearConference();
    this.loading(false);
    this.state = ConferenceState.Default;
    this.isJsonType = true;
  }

  changeState(newState: ConferenceState): void {
    if (newState === ConferenceState.Create) {
      this.state = newState;
    } else if (newState === ConferenceState.Join) {
      this.state = newState;
    } else if (newState === ConferenceState.GetText) {
      this.state = newState;
    } else {
      this.state = ConferenceState.Default;
    }
    this.translation = "";
  }

  async create(conferenceName: string, organizatorName: string): Promise<void> {
    this.loading(true);
    let conference = await this.conferenceService.createConference(conferenceName, organizatorName);
    if (conference === null) {
      alert("Ошибка во время создания конференции");
    } else {
      this.router.navigate(["/room"]);
    }
    this.loading(false);
  }

  async join(conferenceId: string, participantName: string): Promise<void> {
    this.loading(true);
    let conference = await this.conferenceService.joinToConference(conferenceId, participantName);
    console.log(conference);
    if (conference === null) {
      alert("Ошибка во время подключения к конференции");
    } else {
      this.router.navigate(["/room"]);
    }
    this.loading(false);
  }

  async get(conferenceId: string): Promise<void> {
    this.loading(true);

    let result = await this.conferenceService.getConferenceText(conferenceId,
      this.isJsonType === true ? "json" : "plaintext");

    if (result === null) {
      this.translation = "Ошибка во время получения расшифровки";
    } else {
      console.log(result);
      this.translation = result.replace("\n", "<br>");
    }

    this.loading(false);
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
