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
  minSpeakers: number = 1;
  maxSpeakers: number = 3;
  // Change the value to real
  services: any[] = [
    { value: 'google', viewValue: 'Гугл' },
    { value: 'phonexia', viewValue: 'Фонексия' },
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
      alert("Вы загрузили видео");
      console.log("Ждём реализации на фронте - 'Красивое отображение нотификаций'");
      // this.navigateToTransript();
    })

    let audioInput = <HTMLInputElement>document.getElementById('audio');
    audioInput.addEventListener('change', () => {
      this.setParameters();
      this.mediaService.mediaType = MediaType.LocalAudio;
      this.mediaService.url = URL.createObjectURL(audioInput.files[0]);
      alert("Вы загрузили аудио");
      console.log("Ждём реализации на фронте - 'Красивое отображение нотификаций'");
      // this.navigateToTransript();
    })
  }

  loadVoice() {
    this.mediaService.mediaType = MediaType.Voice;
    alert("Вы выбрали запись голосом");
    console.log("Ждём реализации на фронте - 'Красивое отображение нотификаций'");
    // this.navigateToTransript();
  }

  uploadLink(): void {
    alert("Временно не работает");
    console.log("Ждём реализации на фронте - 'Загрузить видео по ссылке'");
  }

  setParameters(): void {
    this.mediaService.language = this.selectedLanguage;
    this.mediaService.modelOfRecognize = this.selectedType;
    this.mediaService.service = this.selectedService;

    if (this.minSpeakers <= 0 && this.maxSpeakers <= 0) {
      this.minSpeakers = 0;
      this.maxSpeakers = 0;
      this.mediaService.diarizationEnabled = false;
      this.mediaService.minSpeakers = this.minSpeakers;
      this.mediaService.maxSpeakers = this.maxSpeakers;
    } else {
      this.mediaService.diarizationEnabled = true;
      this.mediaService.minSpeakers = this.minSpeakers;
      this.mediaService.maxSpeakers = this.maxSpeakers;
    }
  }

  navigateToTransript(): void {
    this.router.navigate(["/transcript"]);
  }
}
