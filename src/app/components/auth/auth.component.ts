import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';
import {
  MenuOptions,
  MenuOptionsService,
} from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  user: string;
  isSignIn: boolean;
  isEnterWith: boolean;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private menuOptionsService: MenuOptionsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isSignIn = true;
  }

  async ngOnInit(): Promise<void> {
    this.menuOptionsService.setOption(MenuOptions.Auth);
    this.user = await this.authService.isUserAuthenticated();
    this.errorMessage = "";

    this.isEnterWith = false;
    this.activatedRoute.params.subscribe((p) => {
      let isWith = p['with'];

      if (isWith === 'with') {
        this.isEnterWith = true;
      } else if (isWith === 'no') {
        this.isEnterWith = false;
      }
    });
  }

  async sign(login: string, password: string): Promise<void> {
    if (this.isSignIn) {
      let u = await this.authService.signIn(login, password);
      if (u.success) {
        this.setUser(u.login);
      } else {
        this.errorMessage = u.errorMessage;
      }
    } else {
      let u = await this.authService.signUp(login, password);
      if (u.success) {
        this.setUser(u.login);
      } else {
        this.errorMessage = u.errorMessage;
      }
    }

  }

  setUser(login: string): void {
    this.user = login;
    let e = new Event('userlogin');
    document.dispatchEvent(e);
  }

  async signOut(): Promise<void> {
    this.authService.clearCurrentUser();
    this.user = null;

    let e = new Event('userlogin');
    document.dispatchEvent(e);
  }
}
