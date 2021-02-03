import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MediaService, MediaType } from 'src/app/services/Media/media.service';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  showHelp: boolean = false;
  languages: any[] = [
    { value: 'russian', viewValue: 'Русский' },
    { value: 'english', viewValue: 'Английский' },
  ];
  selectedLanguage: string;
  types: any[] = [
    { value: 'default', viewValue: 'По умолчанию' },
    { value: 'phone_call', viewValue: 'Телефонный звонок' },
    { value: 'command_and_search', viewValue: 'Командование и поиск' },
  ];
  selectedType: string;
  // Change the value to real
  speakers: any[] = [
    { value: false, viewValue: 'Автоматически' },
    { value: false, viewValue: '2' },
    { value: false, viewValue: '3' },
  ];
  selectedSpeaker: boolean;
  // Change the value to real
  services: any[] = [
    { value: 'google', viewValue: 'Гугл' },
    { value: 'AAAAAAAAAAAAAAAAAAAAAAAAA', viewValue: 'Фонексия' },
  ];
  selectedService: string;
  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService,
    private router: Router,
    private mediaService: MediaService
  ) { 
    this.selectedLanguage = this.languages[0].value;
    this.selectedType = this.types[0].value;
    this.selectedSpeaker = this.speakers[0].value;
    this.selectedService = this.services[0].value;
  }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Загрузить видео');

    let videoInput = <HTMLInputElement>document.getElementById('video');
    videoInput.addEventListener('change', () => {
      this.setParameters();
      this.mediaService.mediaType = MediaType.LocalVideo;
      this.mediaService.url = URL.createObjectURL(videoInput.files[0]);
      this.router.navigate(['/transcript']);
    })

    let audioInput = <HTMLInputElement>document.getElementById('audio');
    audioInput.addEventListener('change', () => {
      this.setParameters();
      this.mediaService.mediaType = MediaType.LocalAudio;
      this.mediaService.url = URL.createObjectURL(audioInput.files[0]);
      this.router.navigate(['/transcript']);
    })
  }

  loadVoice() {
    this.mediaService.mediaType = MediaType.Voice;
    this.router.navigate(['/transcript']);
  }

  setParameters(): void {
    this.mediaService.language = this.selectedLanguage;
    this.mediaService.modelOfRecognize = this.selectedType;
    this.mediaService.diarizationEnabled = this.selectedSpeaker;
    this.mediaService.service = this.selectedService;
  }
}
