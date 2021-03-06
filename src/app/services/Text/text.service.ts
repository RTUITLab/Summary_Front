import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  public text: Array<TextModel> = [];
  public speakers = new Set<string>();
  public duration: number;
  private id: string;

  public isPhonexia: boolean;
  public headersForPhonexia: HttpHeaders;
  public fileIdPhonexia: string;
  constructor(private http: HttpClient) {
    this.isPhonexia = false;
    this.headersForPhonexia = new HttpHeaders({});
    this.fileIdPhonexia = "";
  }

  public async checkStatus(id: string) {
    this.id = id;

    if (this.isPhonexia) {
      let req = await this.http.get<any>(environment.phonexiaApiUrl + `pending/${id}`, { headers: this.headersForPhonexia }).toPromise();
      return req.result;
    } else {
      let req = await <any>this.http.get(environment.apiUrl + 'check_state?transcribe_id=' + id).toPromise();
      return req.state;
    }
  }

  public async loadText(id: string): Promise<Array<TextModel>> {
    this.text = <Array<TextModel>>(await this.http.get<any>(environment.apiUrl + 'get?transcribe_id=' + id).toPromise())
      .entries;

    this.text = this.text || [];

    if (this.text !== []) {
      this.text.forEach(T => {
        this.speakers.add(T.speakerId.toString());
      });
    }

    return this.text;
  }

  public async loadTextPhonexia(text: Array<any>): Promise<Array<TextModel>> {
    text.forEach(t => {
      if (t.variant[0] !== null && t.variant[0] !== undefined) {
        this.text.push({
          time: t.variant[0].start / 10000000,
          speakerId: "-1",
          text: t.variant[0].phrase
        });
      }
    });
    return this.text;
  }

  public setDuration(_duration: number): void {
    this.duration = _duration;
  }

  public getTimes(): Array<number> {
    let result: Array<number> = [];

    this.text.forEach(T => result.push(T.time));
    return result;
  }

  public getFormatedText(currentTime: number): string {
    return this.text.map((T, i, Ts) => {
      if (currentTime === null || currentTime === undefined) {
        currentTime = 0
      }
      let startTime = T.time;
      let endTime = Ts[i + 1] ? Ts[i + 1].time : this.duration;
      let textStyle = styles.text;

      if (currentTime <= endTime && currentTime >= startTime) {
        textStyle = styles.highlighted_text;
      }

      return `
        <div data-container style="${styles.container}">
          <div class="time" contenteditable="true" style="${styles.time}">${this.convertSecondsToTime(startTime)} ${this.convertSecondsToTime(endTime)}</div>
          <div class="author" contenteditable="true" style="${styles.header}">${T.speakerId}</div>
          <div class="text" contenteditable="true" style="${textStyle}">${T.text}</div>
        </div>
      `;
    }).join('');
  }

  public convertTextToModel(times: any[], authors: any[], texts: any[]): Array<TextModel> {
    let text: Array<TextModel> = [];

    for (let i = 0; i < times.length; i++) {
      if (times[i].split(' ').find(T => T.length > 5)) {
        text.push({
          time: this.convertTimeToSeconds(times[i]),
          speakerId: authors[i],
          text: texts[i]
        });
      }
    }

    text = text.sort((a, b) => a.time - b.time);

    this.text = text;

    if (this.isPhonexia) {
      console.log("Here should be a request to save project");
    } else {
      if (this.id) {
        this.http.post(environment.apiUrl + 'edit?transcribe_id=' + this.id, { entries: text }).toPromise();
      }
    }

    return text;
  }

  public getTextToClipBoard(): string {
    let clipText = "";
    this.text.forEach((T, i, Ts) => {
      let startTime = T.time;
      let endTime = Ts[i + 1] ? Ts[i + 1].time : this.duration;
      clipText += `Говорящий: ${T.speakerId}\nВремя (в секундах): ${startTime} - ${endTime}\nРасшифровка: ${T.text}\n\n`;
    })
    return clipText;
  }

  private convertTimeToSeconds(time: string): number {
    let splitedTime = time.split(' ').find(T => T.length > 5).split(':');

    let seconds: number = parseInt(splitedTime[0]) * 3600 + parseInt(splitedTime[1]) * 60 + parseInt(splitedTime[2]);
    return seconds;
  }

  private convertSecondsToTime(seconds: number): string {
    let time: string = '';

    let hours: number = Math.floor(seconds / 3600);
    if (hours <= 9) {
      time += '0';
    }
    time += hours + ':';
    seconds = seconds % 3600;

    let minutes: number = Math.floor(seconds / 60);
    if (minutes <= 9) {
      time += '0';
    }
    time += minutes + ':';
    seconds = Math.floor(seconds % 60);

    if (seconds <= 9) {
      time += '0';
    }
    time += seconds;

    return time
  }

  public addPoint() {
    this.text.unshift({
      time: 0,
      speakerId: '',
      text: ''
    });

    let e = new Event('loadtext');
    (<HTMLIFrameElement>document.getElementsByTagName('iframe').item(0)).contentWindow.document.body.dispatchEvent(e);
  }

  public changeSpeakers(old_vals: string[], new_vals: string[]): void {
    this.text.forEach(T => {
      old_vals.forEach((val, i, arr) => {
        if (T.speakerId.toString() == val) {
          T.speakerId = new_vals[i];
        }
      });
    });

    this.speakers.clear();
    this.text.forEach(T => {
      this.speakers.add(T.speakerId);
    });

    // return this.speakers;
  }

  public clear() {
    this.duration = 0;
    this.id = '';
    this.text = [];
    this.speakers.clear();
  }
}

export type TextModel = {
  time: number,
  speakerId: string,
  text: string
}

const styles = {
  container: `
    display: grid;
    grid-template-columns: 70px 1fr;
    width: 100%;
    padding: 10px;
    color: #222222;
    overflow: hidden;
  `,
  time: `
    max-width: 70px;
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 3;
    margin: auto;
    color: #222222;
    overflow: hidden;
  `,
  header: `
    grid-column: 2;
    grid-row: 1;
    font-weight: 700;
    color: #222222;
    overflow: hidden;
  `,
  text: `
    grid-column: 2;
    grid-row: 2;
    color: #222222;
    overflow: hidden;
  `,
  highlighted_text: `
    grid-column: 2;
    grid-row: 2;
    color: #222;
    background-color: #f0ff1f;
    overflow: hidden;
  `,
  plus: ``
}
