import { Component, OnInit } from '@angular/core';
import { TextService } from 'src/app/services/Text/text.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  text: string;
  id: any = null;

  constructor(private textService: TextService) { }

  ngOnInit(): void {
    this.disableEditor();
  }

  public getWindowHeight(): number {
    return document.documentElement.clientHeight - 150 - 68 - 40;
  }

  private async disableEditor() {
    let id = setInterval(() => {
      let editor = <HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0);
      if (editor) {
        let editorBody = editor.contentWindow.document.getElementById('tinymce');
        if (editorBody) {
          editor.contentWindow.document.head.innerHTML += '<style>*:focus { outline: none; }</style>';
          console.log(editor.contentWindow.document.head.innerHTML);
          editorBody.contentEditable = 'false';
          clearInterval(id);
          
          document.addEventListener('playerready', () => {
            this.text = this.textService.getFormatedText();
          });
          this.text = this.textService.getFormatedText();
          editorBody.innerHTML = this.text;

          editorBody.addEventListener('loadtext', () => {
            this.text = this.textService.getFormatedText();
            editorBody.innerHTML = this.text;

            let e = new Event('loadpoints');
            document.dispatchEvent(e);

            if (this.id === null) {
              console.log('null id')
              this.id = setInterval(() => {
                console.log(this.textService.convertTextToModel(
                  (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.getElementsByClassName('time'),
                  (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.getElementsByClassName('author'),
                  (<HTMLIFrameElement>document.getElementsByClassName('tox-edit-area__iframe').item(0)).contentWindow.document.getElementsByClassName('text'),
                ));
                
                this.text = this.textService.getFormatedText();
                editorBody.innerHTML = this.text;
    
                let e = new Event('loadpoints');
                document.dispatchEvent(e);
              }, 20000);
            }
          })
        }
      }
    }, 100);
  }

  public print(): void {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head></head><body>');
    mywindow.document.write(document.getElementById('tinymce').innerHTML);
    mywindow.document.write('</body></html>');
document.getElementsByClassName('s');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
  }

  public change() {
  }

  public getApiKey(): string {
    return environment.apiKey || 'null';
  }
}
