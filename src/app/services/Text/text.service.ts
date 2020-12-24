import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  private text: Array<TextModel> = [];
  private duration: number

  constructor() { }

  public loadText(): void {
    this.text = [
      {
        time: 1,
        author: 'Dean',
        text: "Yeah, maybe we've found our witch doctor. All right, I'll see what I can go dig up on boomin' Granny. You go get online, check old obits, freak accidents, that sort of thing, see if she's whacked anybody before."
      },
      {
        time: 4,
        author: 'Sam',
        text: 'Right',
      },
      {
        time: 6,
        author: 'Dean',
        text: "Don't go surfing porn — that's not the kind of whacking I mean.",
      }
    ]
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
            ${T.author}
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
          author: authors.item(i).innerHTML,
          text: texts.item(i).innerHTML
        });
      }
    }

    text = text.sort((a, b) => a.time - b.time);

    this.text = text;

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
      author: '',
      text: ''
    });

    let e = new Event('loadtext');
    (<HTMLIFrameElement>document.getElementsByTagName('iframe').item(0)).contentWindow.document.body.dispatchEvent(e);
  }
}

type TextModel = {
  time: number,
  author: string,
  text: string
}

const styles = {
  container: `
    display: grid;
    grid-template-columns: 12% 1fr;
    width: 100%;
    padding: 10px;
    color: #222222;
    overflow: auto;
  `,
  time: `
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 3;
    margin: auto;
    color: #222222;
    overflow: auto;
  `,
  header: `
    grid-column: 2;
    grid-row: 1;
    font-weight: 700;
    color: #222222;
    overflow: auto;
  `,
  text: `
    grid-column: 2;
    grid-row: 2;
    color: #222222;
    overflow: auto;
  `,
  plus: ``
}
