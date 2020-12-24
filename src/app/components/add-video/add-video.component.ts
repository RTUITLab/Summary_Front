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

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService,
    private router: Router,
    private mediaService: MediaService
  ) { }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Загрузить видео');

    let videoInput = <HTMLInputElement>document.getElementById('video');
    videoInput.addEventListener('change', () => {
      this.mediaService.mediaType = MediaType.LocalVideo;
      this.mediaService.url = URL.createObjectURL(videoInput.files[0]);
      this.router.navigate(['/transcript']);
    })

    let audioInput = <HTMLInputElement>document.getElementById('audio');
    audioInput.addEventListener('change', () => {
      this.mediaService.mediaType = MediaType.LocalAudio;
      this.mediaService.url = URL.createObjectURL(audioInput.files[0]);
      this.router.navigate(['/transcript']);
    })
  }

}
