import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';
import { TextService } from 'src/app/services/Text/text.service';

@Component({
  selector: 'app-transcripting',
  templateUrl: './transcripting.component.html',
  styleUrls: ['./transcripting.component.scss']
})
export class TranscriptingComponent implements OnInit {

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService,
    private textService: TextService
  ) { }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Перевести');

    this.textService.loadText();
  }

  public addPoint() {
    this.textService.addPoint();
  }
}
