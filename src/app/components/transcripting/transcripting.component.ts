import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
export class TranscriptingComponent implements OnInit {
  public isRecording = false;
  public isLoading = false;
  public transpId = '';

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService,
    private textService: TextService,
    private mediaService: MediaService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Перевести');

    this.isLoading = true;

    this.textService.clear();

    if (this.mediaService.mediaType === MediaType.LocalAudio || this.mediaService.mediaType === MediaType.LocalVideo) {
      this.transpId = await this.mediaService.sendFile();
      let id = setInterval(async () => {
        if ((await this.textService.checkStatus(this.transpId)) === 'READY') {
          clearInterval(id);

          await this.textService.loadText(this.transpId);

          (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.body.dispatchEvent(new Event('loadtext', { bubbles: false }));

          this.isLoading = false;
        }
      }, 1000);
    }
    else {

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
      rec = new Recorder(input, {numChannels:1});
      rec.record();
    });

    document.querySelector('app-transcripting').addEventListener('stoprecords', () => {
      rec.stop();

      this.isLoading = true;

      stream.getAudioTracks().forEach(T => T.stop());
      
      if (this.isRecording) {
        rec.exportWAV((blob) => {
          this.isRecording = false;
          this.recognizeSpeech(blob);
        });
      }
    });
  }

  public getType() {
    return this.mediaService.mediaType;
  }

  public async recognizeSpeech(blob: Blob) {
    const data = new FormData();
    data.append('file', blob);
    data.append('service', 'google');
    data.append('diarizationEnabled', 'false');
    data.append('model', 'command_and_search');

    let id = (await <any>this.http.post(environment.apiUrl + 'upload', data).toPromise()).transcribeId;

    let intId = setInterval(async () => {
      let state = (await <any>this.http.get(environment.apiUrl + 'check_state?transcribe_id=' + id).toPromise()).state;
      if (state === 'READY') {
        clearInterval(intId);

        console.log(id);
        console.log(URL.createObjectURL(blob));
        let text = <Array<TextModel>>(await this.http.get<any>(environment.apiUrl + 'get?transcribe_id=' + id).toPromise()).entries;
    
        if (text) {
          text.map(T => T.time = this.textService.duration || 0);
          this.textService.text.push(...text);
          (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.body.dispatchEvent(new Event('loadtext', { bubbles: false }));
        }

        this.isLoading = false;
      }
    }, 1000)
  }

  public addPoint() {
    this.textService.addPoint();
  }

  public startRecording() {
    document.querySelector('app-transcripting').dispatchEvent(new Event('startrecord'));
  }

  public stopRecording() {
    let e = new Event('stoprecords', { bubbles: false });
    document.querySelector('app-transcripting').dispatchEvent(e);
  }
}

declare var window: any;
declare var Recorder: any;
