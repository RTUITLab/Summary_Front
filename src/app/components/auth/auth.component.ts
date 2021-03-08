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

  constructor(
    private authService: AuthService,
    private menuOptionsService: MenuOptionsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isSignIn = true;

    this.activatedRoute.queryParams.subscribe((qparams) => {
      let ghcode = qparams['code'];
      if (ghcode !== null && ghcode !== undefined && ghcode !== '') {
        this.authService.signInWithGithub(ghcode);
      }
    });
  }

  ngOnInit(): void {
    this.menuOptionsService.setOption(MenuOptions.Auth);
    this.user = this.authService.isUserAuthenticated();

    this.isEnterWith = false;
    this.activatedRoute.params.subscribe((p) => {
      let isWith = p['with'];
      console.log(isWith);

      if (isWith === 'with') {
        this.isEnterWith = true;
      } else if (isWith === 'no') {
        this.isEnterWith = false;
      }
    });
  }

  async sign(login: string, password: string): Promise<void> {
    if (this.isSignIn) {
      this.user = await this.authService.signIn(login, password);
    } else {
      this.user = await this.authService.signUp(login, password);
    }

    let e = new Event('userlogin');
    document.dispatchEvent(e);
  }

  async signOut(): Promise<void> {
    localStorage.setItem('token', '');
    this.user = null;
  }
}
