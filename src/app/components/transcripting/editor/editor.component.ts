import { Component, OnDestroy, OnInit } from '@angular/core';
import { TextService } from 'src/app/services/Text/text.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  text: string;
  id: any = null;
  currentTime: number;

  private disableEditorId;

  constructor(private textService: TextService) {}

  ngOnInit(): void {
    this.disableEditor();

    document.addEventListener('updateHighlights', (e) => {
      this.currentTime = e['detail']['currentTime'];

      (<HTMLIFrameElement>(
        document.getElementsByClassName('tox-edit-area__iframe').item(0)
      )).contentWindow.document.body.dispatchEvent(
        new Event('loadtext', { bubbles: false })
      );
    });
  }

  public getWindowHeight(): number {
    return document.documentElement.clientHeight - 150 - 68 - 40;
  }

  private async disableEditor() {
    this.disableEditorId = setInterval(() => {
      let editor = <HTMLIFrameElement>(
        document.getElementsByClassName('tox-edit-area__iframe').item(0)
      );
      if (editor) {
        let editorBody = editor.contentWindow.document.getElementById(
          'tinymce'
        );
        if (editorBody) {
          // editor.contentWindow.document.head.innerHTML += '<style>*:focus { outline: none; }</style>';
          // console.log(editor.contentWindow.document.head.innerHTML);
          // editorBody.contentEditable = 'false';
          clearInterval(this.disableEditorId);

          document.addEventListener('playerready', () => {
            this.text = this.textService.getFormatedText(this.currentTime);
          });
          this.text = this.textService.getFormatedText(this.currentTime);
          editorBody.innerHTML = this.text;

          editorBody.addEventListener('loadtext', () => {
            let editor = <HTMLIFrameElement>(
              document.getElementsByClassName('tox-edit-area__iframe').item(0)
            );
            let editorBody = editor.contentWindow.document.getElementById(
              'tinymce'
            );

            this.text = this.textService.getFormatedText(this.currentTime);
            editorBody.innerHTML = this.text;

            let e = new Event('loadpoints');
            document.dispatchEvent(e);

            if (this.id === null) {
              console.log('text was loaded - convert text to model');
              this.startAutoSave();
            }
          });
        }
      }
    }, 100);
  }

  autoSaveStartTime = 0;
  timerId;
  private startAutoSave(): void {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      let e = new CustomEvent('updateAutoSave', {
        detail: {
          timeRemaining: this.getRemainingTime(),
        },
      });
      document.dispatchEvent(e);
    }, 1000);

    this.autoSaveStartTime = new Date().getTime();
    this.id = setInterval(() => {
      let editor = <HTMLIFrameElement>(
        document.getElementsByClassName('tox-edit-area__iframe').item(0)
      );

      let docs = editor.contentWindow.document.querySelectorAll('[data-container]');
      console.log(docs);

      let times = [];
      let authors = [];
      let texts = [];
      let pattern = /<div class="(time|author|text)[a-zA-Z=" -:;\n]*>([^<]*)<\/div>/gi;
      for (let i = 0; i < docs.length; i++) {
        let elems = [...docs[i].innerHTML['matchAll'](pattern)];

        elems.forEach(e => {
          if (e[1] === "time") {
            times.push(e[2])
          } else if (e[1] === "author") {
            authors.push(e[2])
          } else if (e[1] === "text") {
            texts.push(e[2])
          }
        });

        let ml = Math.max(times.length, authors.length, texts.length);
        if (times.length !== ml || authors.length !== ml || texts.length !== ml) {
          if (times.length < ml) {
            times.push("00:00:00 00:00:00");
          }
          if (authors.length < ml) {
            // authors.push("Говорящий не определён");
            authors.push("-1");
          }
          if (texts.length < ml) {
            texts.push("Нет расшифровки");
          }
        }
      }

      console.log(this.textService.convertTextToModel(times, authors, texts));

      this.text = this.textService.getFormatedText(this.currentTime);
      let editorBody = editor.contentWindow.document.getElementById('tinymce');
      editorBody.innerHTML = this.text;

      let e = new Event('loadpoints');
      document.dispatchEvent(e);

      clearTimeout(this.id);
      this.startAutoSave();
    }, 20000);
  }

  public getRemainingTime() {
    return 20000 - (new Date().getTime() - this.autoSaveStartTime);
  }

  // public print(): void {
  //   var mywindow = window.open('', 'PRINT', 'height=400,width=600');

  //   mywindow.document.write('<html><head></head><body>');
  //   mywindow.document.write(document.getElementById('tinymce').innerHTML);
  //   mywindow.document.write('</body></html>');
  //   document.getElementsByClassName('s');
  //   mywindow.document.close(); // necessary for IE >= 10
  //   mywindow.focus(); // necessary for IE >= 10

  //   mywindow.print();
  // }

  public change() {}

  public getApiKey(): string {
    return environment.apiKey || 'null';
  }

  ngOnDestroy(): void {
    clearInterval(this.disableEditorId);
    clearInterval(this.timerId);
    clearInterval(this.id);
  }
}
