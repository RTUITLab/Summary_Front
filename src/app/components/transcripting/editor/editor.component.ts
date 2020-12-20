import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let btns = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName('control-btn');
    
    for (let i = 0; i < btns.length; i++) {
      let btn = btns.item(i);

      btn.addEventListener('click', () => {
        if (btn.dataset['command'] === 'print') {
          var mywindow = window.open('', 'PRINT', 'height=400,width=600');

          mywindow.document.write('<html><head><title>' + document.title  + '</title>');
          mywindow.document.write('</head><body >');
          mywindow.document.write('<h1>' + document.title  + '</h1>');
          mywindow.document.write(document.getElementById('list').innerHTML);
          mywindow.document.write('</body></html>');

          mywindow.document.close(); // necessary for IE >= 10
          mywindow.focus(); // necessary for IE >= 10*/

          mywindow.print();
          mywindow.close();
          return;
        }
        document.execCommand(btn.dataset['command'], false, null);
      })
    }
  }

}
