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
        document.execCommand(btn.dataset['command'], false, null);
      })
    }
  }

}
