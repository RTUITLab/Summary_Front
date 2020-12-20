import { Component, OnInit } from '@angular/core';
import { MediaService, MediaType } from 'src/app/services/Media/media.service';

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
  private progressBar: HTMLElement;
  private volumeBar: HTMLElement;

  private speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];
  private currentSpeed = 3;
  icon = 'Play';

  constructor(private mediaService: MediaService) { }

  ngOnInit(): void {
    this.player = <HTMLVideoElement>document.getElementById('player');

    if (this.mediaService.url) {
      if (this.mediaService.mediaType === MediaType.LocalFile) {
        this.player.src = this.mediaService.url;
      }
    } else {
      this.player.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    }

    this.progress = <HTMLDivElement>document.getElementById('progress');
    this.btnPlayPause = document.getElementById('btnPlayPause');
    this.progressBar = document.getElementById('player');
    this.volumeBar = document.getElementById('player');
    
    //this.progress.addEventListener('mousemove', (e) => console.log(e))
    this.player.addEventListener('click', () => this.playVideo());
    this.player.addEventListener('ended', () => this.icon = 'Play');
    this.player.addEventListener('timeupdate', () => this.progress.style.width = 100 * this.player.currentTime / this.player.duration + '%');
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

}
