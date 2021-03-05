import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  public service: string;
  public headersForPhonexia: HttpHeaders;

  public diarizationEnabled: boolean;
  public minSpeakers: number;
  public maxSpeakers: number;

  constructor(private http: HttpClient) {
    this.service = "google";
    this.headersForPhonexia = new HttpHeaders({});

    this.language = "russian";
    this.modelOfRecognize = "default";
    this.diarizationEnabled = false;
    this.minSpeakers = 0;
    this.maxSpeakers = 0;
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

    let blob: Blob;
    if (this.mediaType === MediaType.LocalAudio) {
      blob = await fetch(this.url).then(async r => await r.blob());
    }
    if (this.mediaType === MediaType.LocalVideo) {
      blob = await this.extractAudio();
    }

    if (this.isPhonexia()) {
      return await this.usePhonexia(blob);
    }
    console.log(`file size = ${blob.size} bytes`);
    console.log(URL.createObjectURL(blob));

    if (this.isBigFile(blob)) {
      console.log(`file is big`);
      try {
        let request = await this.http.post<any>(environment.apiUrl + `generate_upload_url?service=${this.service}`, {}).toPromise();
        if (request.success) {
          console.log("start uploading file");
          console.log(request.url);
          let upload_request = await this.http.put<any>(request.url, blob, {
            headers: new HttpHeaders({
              "Content-Type": ""
            })
          }).toPromise();
          if (!upload_request.ok) {
            console.log("Error while uploading file to google service");
            return null;
          }
          console.log("end uploading file");

          let params = `transcribe_id=${request.transcribeId}&model=${this.modelOfRecognize}&`;
          if (this.diarizationEnabled) {
            params += `diarization_enabled=${this.diarizationEnabled}&`;
            params += `min_speaker_count =${this.minSpeakers}&`;
            params += `max_speaker_count =${this.maxSpeakers}`;
          } else {
            params += `diarization_enabled=${this.diarizationEnabled}`;
          }
          let start_request = await this.http.post<any>(environment.apiUrl +
            `start?${params}`, {}).toPromise();

          if (start_request.success) {
            return request.transcribeId;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      console.log(`file is small`);
      const data = new FormData();
      data.append('file', blob);
      data.append('service', `${this.service}`);
      if (this.diarizationEnabled) {
        data.append('diarizationEnabled', `${this.diarizationEnabled}`);
        data.append('minSpeakerCount', `${this.minSpeakers}`);
        data.append('maxSpeakerCount', `${this.maxSpeakers}`);
      } else {
        data.append('diarizationEnabled', `${this.diarizationEnabled}`);
      }
      data.append('model', `${this.modelOfRecognize}`);

      try {
        return (await <any>this.http.post(environment.apiUrl + 'upload', data).toPromise()).transcribeId;
      } catch (e) {
        console.log(e);
        return null;
      }
    }

    return null;
  }

  async usePhonexia(blob: Blob): Promise<string> {
    try {
      let user = {
        username: "Maxim Mikhalovich",
        password: "proverka"
      };
      let userForAuth = window.btoa(user.username + ":" + user.password);

      // Authenticate to Phonexia
      let request = await this.http.post<any>(environment.phonexiaApiUrl + "login", {}, {
        headers: new HttpHeaders({
          Authorization: `Basic ${userForAuth}`
        })
      }).toPromise();
      if (!request.result) {
        return null;
      }
      let sessionId = request.result.session.id;
      console.log(`sessionId = ${sessionId}`);
      this.headersForPhonexia = new HttpHeaders({
        "X-SessionID": sessionId
      });

      // Load file to Phonexia
      request = await this.http.post<any>(environment.phonexiaApiUrl +
        "audiofile?path=/recording.wav", blob, {
        headers: this.headersForPhonexia
      }).toPromise();
      if (!request.result) {
        return null;
      }
      return await this.startTranslatingPhonexia();
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async startTranslatingPhonexia(): Promise<string> {
    let request = await this.http.get<any>(environment.phonexiaApiUrl +
      "technologies/stt?path=/recording.wav&model=RU_RU_5&result_type=n_best", { headers: this.headersForPhonexia }).toPromise();
    if (request.result.name && request.result.name === "PendingInfoResult") {
      return request.result.info.id;
    }

    return null;
  }

  isBigFile(blob: Blob): boolean {
    // 33 554 432 bytes = 32 Mb
    return blob.size > 30000000;
  }

  public isPhonexia(): boolean {
    return this.service === "phonexia";
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
