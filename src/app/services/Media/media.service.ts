import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  public mediaType: MediaType;
  public url;

  public language: string;
  public modelOfRecognize: string;
  public diarizationEnabled: boolean;
  public service: string;

  constructor(private http: HttpClient) {
    this.service = "google";
    this.language = "russian";
    this.diarizationEnabled = false;
    this.modelOfRecognize = "default";
  }

  extractAudio() {
    return new Promise<Blob>(async (resolve, reject) => {
      let blob = await fetch(this.url).then(async r => await r.blob());

      let reader = new FileReader();

      reader.onload = () => {
        var audioContext = new window.AudioContext();

        audioContext.decodeAudioData(<ArrayBuffer>reader.result).then((decodedAudio) => {
          resolve(bufferToWave(decodedAudio, decodedAudio.sampleRate * decodedAudio.duration));
        }).catch(() => reject());
      }

      reader.onerror = reject;

      reader.readAsArrayBuffer(blob);
    })
  }

  async sendFile() {
    let blob: Blob
    if (this.mediaType === MediaType.LocalAudio) {
      blob = await fetch(this.url).then(async r => await r.blob());
    }
    if (this.mediaType === MediaType.LocalVideo) {
      blob = await this.extractAudio();
    }

    console.log(URL.createObjectURL(blob));

    const data = new FormData();
    data.append('file', blob);
    data.append('service', `${this.service}`);
    data.append('diarizationEnabled', `${this.diarizationEnabled}`);
    data.append('model', `${this.modelOfRecognize}`);

    try {
      return (await <any>this.http.post(environment.apiUrl + 'upload', data).toPromise()).transcribeId;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export enum MediaType {
  LocalVideo,
  LocalAudio,
  Voice
}

// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [], i, sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);          // write 16-bit sample
      pos += 2;
    }
    offset++                                     // next source sample
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}
