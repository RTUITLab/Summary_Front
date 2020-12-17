import { Component, OnInit } from '@angular/core';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private menuService: MenuOptionsService) { }

  ngOnInit(): void {
    this.menuService.setOption(MenuOptions.Main);
  }

}
