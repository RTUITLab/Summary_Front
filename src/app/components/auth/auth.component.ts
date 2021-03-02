import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser, VKLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { MenuOptions, MenuOptionsService } from 'src/app/services/MenuOptions/menu-options.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  user: SocialUser;
  isSignIn: boolean;

  constructor(private authService: AuthService,
    private menuOptionsService: MenuOptionsService,
    private socialAuthService: SocialAuthService,
    private activatedRoute: ActivatedRoute) {
    this.isSignIn = true;
    this.activatedRoute.queryParams.subscribe(qparams => {
      let ghcode = qparams["code"];
      if (ghcode !== null && ghcode !== undefined && ghcode !== "")
      {
        this.authService.signInWithGithub(ghcode);
      }
    })
  }

  ngOnInit(): void {
    this.menuOptionsService.setOption(MenuOptions.Auth);
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signIn(login: string, password: string): void {

  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithVk(): void {
    this.socialAuthService.signIn(VKLoginProvider.PROVIDER_ID);
  }
}