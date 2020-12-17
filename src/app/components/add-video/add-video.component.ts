import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  constructor(
    private titleService: Title,
    private menuService: MenuOptionsService
  ) { }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Transcript);
    this.titleService.setTitle('Загрузить видео');
  }

}
