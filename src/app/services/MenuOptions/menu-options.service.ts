import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {
  public option: MenuOptions;

  constructor(private titleService: Title) {
    this.setOption(MenuOptions.Main);
  }

  public setOption(_option: MenuOptions) {
    this.option = _option;

    switch (_option) {
      case MenuOptions.Info: {
        this.titleService.setTitle('Справка');
        break;
      }
      case MenuOptions.Language: {
        this.titleService.setTitle('Язык');
        break;
      }
      case MenuOptions.Settings: {
        this.titleService.setTitle('Настройки');
        break;
      }
      case MenuOptions.Transcript: {
        this.titleService.setTitle('Расшифровка');
        break;
      }
      case MenuOptions.Conference: {
        this.titleService.setTitle('Конференции');
        break;
      }
      case MenuOptions.Auth: {
        this.titleService.setTitle('Авторизация');
        break;
      }
      default: {
        this.titleService.setTitle('Summary');
        break;
      }
    }
  }
}

export enum MenuOptions {
  Main,
  Info,
  Language,
  Transcript,
  Conference,
  Settings,
  Auth
}
