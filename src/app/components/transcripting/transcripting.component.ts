import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-transcripting',
  templateUrl: './transcripting.component.html',
  styleUrls: ['./transcripting.component.scss']
})
export class TranscriptingComponent implements OnInit {

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService
  ) { }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Перевести');
  }

}
