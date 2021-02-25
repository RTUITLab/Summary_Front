import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MediaService, MediaType } from 'src/app/services/Media/media.service';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';
import { TextService, TextModel } from 'src/app/services/Text/text.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transcripting',
  templateUrl: './transcripting.component.html',
  styleUrls: ['./transcripting.component.scss']
})
export class TranscriptingComponent implements OnInit, OnDestroy {
  public isRecording = false;
  public isLoading = false;
  public transpId = '';
  public speakers: string[];
  public speakersNew: string[];
  public timeRemaining: string;

  public recognize_fail: boolean = false;

  private checkStatusId;
  private recognizeSpeechId;

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService,
    private textService: TextService,
    private mediaService: MediaService,
    private http: HttpClient
  ) {
    this.speakers = [];
    this.speakersNew = [];
  }

  async ngOnInit() {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Перевести');

    this.loadingChange(true);

    this.textService.clear();

    if (this.mediaService.mediaType === MediaType.LocalAudio || this.mediaService.mediaType === MediaType.LocalVideo) {
      this.transpId = await this.mediaService.sendFile();
      if (this.transpId === null) {
        console.log("request failed");
        this.loadingChange(false, true);
      }

      this.checkStatusId = setInterval(async () => {
        if ((await this.textService.checkStatus(this.transpId)) === 'READY') {
          clearInterval(this.checkStatusId);

          await this.textService.loadText(this.transpId);

          (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.body.dispatchEvent(new Event('loadtext', { bubbles: false }));

          this.loadingChange(false);
        }
      }, 1000);
    }
    else {
      this.loadingChange(false);
    }

    let audioContext;
    let input: MediaStreamAudioSourceNode;
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    let rec;

    document.querySelector('app-transcripting').addEventListener('startrecord', async () => {
      this.isRecording = true;

      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      audioContext = new AudioContext();

      input = audioContext.createMediaStreamSource(stream);
      rec = new Recorder(input, { numChannels: 1 });
      rec.record();
    });

    document.querySelector('app-transcripting').addEventListener('stoprecords', () => {
      rec.stop();

      this.loadingChange(true);

      stream.getAudioTracks().forEach(T => T.stop());

      if (this.isRecording) {
        rec.exportWAV((blob: Blob) => {
          this.isRecording = false;
          this.recognizeSpeech(blob, true);
        });
      }
    });

    document.addEventListener("updateAutoSave", (e) => {
      let num = e["detail"]["timeRemaining"];
      num = Math.floor(num / 1000);
      if (num <= 0) {
        num = 0;
      }
      this.timeRemaining = num.toString();
    });
  }

  public getType() {
    return this.mediaService.mediaType;
  }

  public async recognizeSpeech(blob: Blob, wasRecording: boolean = false) {
    const data = new FormData();
    data.append('file', blob);
    data.append('service', 'google');
    data.append('diarizationEnabled', 'false');
    data.append('model', 'command_and_search');

    let id = (await <any>this.http.post(environment.apiUrl + 'upload', data).toPromise()).transcribeId;

    this.recognizeSpeechId = setInterval(async () => {
      let state = (await <any>this.http.get(environment.apiUrl + 'check_state?transcribe_id=' + id).toPromise()).state;
      if (state === 'READY') {
        clearInterval(this.recognizeSpeechId);

        console.log(id);
        console.log(URL.createObjectURL(blob));
        let text = <Array<TextModel>>(await this.http.get<any>(environment.apiUrl + 'get?transcribe_id=' + id).toPromise()).entries;

        if (text) {
          text.map(T => T.time = this.textService.duration || 0);
          if (wasRecording) { // if user was recording his voice, so set speakerId to "Author"
            text.map(T => T.speakerId = "Говорящий не определён");
          }
          this.textService.text.push(...text);
          (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.body.dispatchEvent(new Event('loadtext', { bubbles: false }));
        }

        this.loadingChange(false, text === undefined || text === null || text.length === 0 ? true : false);
      }
    }, 1000)
  }

  public addPoint() {
    this.textService.addPoint();
  }

  public copyTextToClipboard(): string {
    return this.textService.getTextToClipBoard();
  }

  public speakersChanged(): void {
    this.textService.changeSpeakers(this.speakers, this.speakersNew);
    this.speakers = [];
    this.speakersNew = [];
    this.textService.speakers.forEach(sp => {
      this.speakers.push(sp);
      this.speakersNew.push(sp);
    });
    (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0))
      .contentWindow.document.body.dispatchEvent(new Event('loadtext', { bubbles: false }));
  }

  public trackSpeaker(index: number, new_val: string) {
    if (this.speakersNew) {
      this.speakersNew[index] = new_val;
      console.log(`${index} - ${new_val}`);
    }
    return index;
  }

  public startRecording() {
    document.querySelector('app-transcripting').dispatchEvent(new Event('startrecord'));
  }

  public stopRecording() {
    let e = new Event('stoprecords', { bubbles: false });
    document.querySelector('app-transcripting').dispatchEvent(e);
  }

  private loadingChange(isLoading: boolean, noText: boolean = false): void {
    this.isLoading = isLoading;
    this.recognize_fail = noText;

    this.speakers = [];
    this.speakersNew = [];
    this.textService.speakers.forEach(sp => {
      this.speakers.push(sp);
      this.speakersNew.push(sp);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.recognizeSpeechId);
    clearInterval(this.checkStatusId);
    this.textService.clear();
  }
}

declare var window: any;
declare var Recorder: any;
