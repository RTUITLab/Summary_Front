import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  public mediaType: MediaType;
  public url; 

  constructor() { }
}

export enum MediaType {
  LocalVideo,
  LocalAudio
}
