import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isSignIn: boolean;
  constructor(private authService: AuthService,
    private menuOptionsService: MenuOptionsService) {
    this.isSignIn = true;
  }

  ngOnInit(): void {
    this.menuOptionsService.setOption(MenuOptions.Auth);
  }

  signIn(login: string, password: string): void {

  }
}
