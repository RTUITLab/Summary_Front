import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  public text: Array<TextModel> = [];
  public duration: number;
  private id: string;

  constructor(private http: HttpClient) { }

  public async checkStatus(id: string) {
    this.id = id;

    return (await <any>this.http.get(environment.apiUrl + 'check_state?transcribe_id=' + id).toPromise()).state;
  }

  public async loadText(id: string): Promise<Array<TextModel>> {
    this.text = <Array<TextModel>>(await this.http.get<any>(environment.apiUrl + 'get?transcribe_id=' + id).toPromise()).entries;

    this.text = this.text || [];

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

  public getFormatedText(): string {
    return this.text.map((T, i, Ts) => {
      return `
        <div data-container style="${styles.container}">
          <div class="time" contenteditable="true" style="${styles.time}">
            ${this.convertSecondsToTime(T.time)} ${this.convertSecondsToTime(Ts[i + 1] ? Ts[i + 1].time : this.duration)}
          </div>
          <div class="author" contenteditable="true" style="${styles.header}">
            ${T.speakerId}
          </div>
          <div class="text" contenteditable="true" style="${styles.text}">
            ${T.text}
          </div>
        </div>
      `;
    }).join('');
  }

  public convertTextToModel(times: HTMLCollectionOf<Element>, authors: HTMLCollectionOf<Element>, texts: HTMLCollectionOf<Element>): Array<TextModel> {
    let text: Array<TextModel> = [];

    for (let i = 0; i < times.length; i++) {
      if (times.item(i).innerHTML.split(' ').find(T => T.length > 5)) {
        text.push({
          time: this.convertTimeToSeconds(times.item(i).innerHTML),
          speakerId: authors.item(i).innerHTML,
          text: texts.item(i).innerHTML
        });
      }
    }

    text = text.sort((a, b) => a.time - b.time);

    this.text = text;

    if (this.id)
    {
      this.http.post(environment.apiUrl + 'edit?transcribe_id=' + this.id, { entries: text }).toPromise();
    }

    return text;
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
    console.log(seconds);

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

  public clear() {
    this.duration = 0;
    this.id = '';
    this.text = [];
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
  plus: ``
}
