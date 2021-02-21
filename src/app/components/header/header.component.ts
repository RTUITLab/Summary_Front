import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: SocialUser;
  constructor(private menuService: MenuOptionsService, private socialAuthService: SocialAuthService) { }

  public setOption(option: MenuOptions) {
    this.menuService.setOption(option);
  }

  public isActive(option: MenuOptions) {
    if (option === this.menuService.option) {
      return "active";
    }
    return "";
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });
  }

}
