import { Component, OnInit } from '@angular/core';
import { MediaService, MediaType } from 'src/app/services/Media/media.service';
import { TextService } from 'src/app/services/Text/text.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  public url;

  private player: HTMLVideoElement;
  private progress: HTMLDivElement;
  private btnPlayPause: HTMLElement;
  private volumeBar: HTMLElement;

  public canPlay = false;
  private speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];
  private currentSpeed = 3;
  icon = 'Play';

  public times = [];

  constructor(
    private mediaService: MediaService,
    private textService: TextService
  ) { }

  ngOnInit(): void {
    this.player = <HTMLVideoElement>document.getElementById('player');
    console.log(this.player)

    if (this.mediaService.url) {
      if (this.mediaService.mediaType === MediaType.LocalVideo) {
        this.player.src = this.mediaService.url;
      }
      if (this.mediaService.mediaType === MediaType.LocalAudio) {
        this.player.src = this.mediaService.url;
      }
    } else {
      this.player.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    }

    this.btnPlayPause = document.getElementById('btnPlayPause');
    this.volumeBar = document.getElementById('player');

    this.player.addEventListener('click', () => this.playVideo());
    this.player.addEventListener('ended', () => this.icon = 'Play');

    this.player.addEventListener('canplay', () => {
      this.textService.setDuration(this.player.duration);
      this.canPlay = true;

      let e = new Event('playerready', { bubbles: false });

      document.dispatchEvent(e);
      this.times = this.textService.getTimes();

      setTimeout(() => this.progress = <HTMLDivElement>document.getElementById('progress'), 1000);

      this.player.addEventListener('timeupdate', () => {
        this.progress.style.width = 100 * this.player.currentTime / this.player.duration + '%'
        let e = new CustomEvent("updateHighlights", {
          detail: {
            currentTime: this.player.currentTime ? this.player.currentTime : 0
          }
        })
        document.dispatchEvent(e);
      });
    });

    document.addEventListener('loadpoints', () => this.times = this.textService.getTimes());
  }

  public getType() {
    return this.mediaService.mediaType;
  }

  public playVideo() {
    if (this.player.paused || this.player.ended) {
      this.player.play();
      this.icon = 'Pause';
    }
    else {
      this.player.pause();
      this.icon = 'Play';
    }
  }

  public again() {
    this.player.currentTime = 0;
    if (this.player.paused || this.player.ended) {
      this.playVideo();
    }
  }

  public slowlier() {
    if (this.currentSpeed > 0) {
      this.currentSpeed -= 1;
      this.player.playbackRate = this.speeds[this.currentSpeed];
    }
  }

  public faster() {
    if (this.currentSpeed + 1 !== this.speeds.length) {
      this.currentSpeed += 1;
      this.player.playbackRate = this.speeds[this.currentSpeed];
    }
  }

  public getProgress(): Array<number> {
    return this.times.map(T => T / this.player.duration);
  }

  public getUrl(): string {
    return this.mediaService.url;
  }
}
