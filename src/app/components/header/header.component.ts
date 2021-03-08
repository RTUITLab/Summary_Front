import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth.service';
import {
  MenuOptions,
  MenuOptionsService,
} from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: string;
  constructor(
    private menuService: MenuOptionsService,
    private authService: AuthService
  ) {}

  public setOption(option: MenuOptions) {
    this.menuService.setOption(option);
  }

  public isActive(option: MenuOptions) {
    if (option === this.menuService.option) {
      return 'active';
    }
    return '';
  }

  ngOnInit(): void {
    this.user = this.authService.isUserAuthenticated();
    document.addEventListener('userlogin', () => {
      this.user = this.authService.isUserAuthenticated();
    });
  }
}
