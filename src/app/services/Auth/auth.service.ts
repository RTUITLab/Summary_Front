import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Apply headers
    let token = localStorage.getItem("token");
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: token,
        },
      });
    }
    return next.handle(req).pipe(
      tap(
        (x) => x,
        (err) => {
          // console.log(err);
          // Handle this error
          console.error(
            `Error performing request, status code = ${err.status}`
          );
        }
      )
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  async signIn(login: string, password: string): Promise<UserResponse> {
    try {
      let request = await this.http
        .post<UserResponse>(environment.apiUrl1 + `user/login`, {
          login: login,
          password: password,
        })
        .toPromise();
      request.login = login;
      if (request.success) {
        localStorage.setItem("token", `${request.tokenType} ${request.accessToken}`);
        localStorage.setItem("user", login);
        return request;
      } else {
        return request;
      }
    } catch (error) {
      // console.log(error);
    }
    return null;
  }

  async signUp(login: string, password: string): Promise<UserResponse> {
    try {
      let request = await this.http
        .post<UserResponse>(environment.apiUrl1 + `user/create`, {
          login: login,
          password: password,
        })
        .toPromise();
      request.login = login;
      if (request.success) {
        localStorage.setItem("token", `${request.tokenType} ${request.accessToken}`);
        localStorage.setItem("user", login);
        return request;
      } else {
        return request;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }



  async isUserAuthenticated(): Promise<string> {
    try {
      let current = await this.http.get<CurrentUserModel>(environment.apiUrl1 + `user/current`).toPromise();
      if (current.success) {
        let token = localStorage.getItem("token");
        if (token) {
          let user = localStorage.getItem("user");
          if (user) {
            return user;
          }
        }
      }
    } catch (error) {
      // console.log(error);
    }
    this.clearCurrentUser();
    return null;
  }

  clearCurrentUser(): void {
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
  }
}

export type UserModel = {
  success: boolean;
  accessToken: string;
  tokenType: string;
};

export type CurrentUserModel = {
  success: boolean;
  login: string;
}

export type UserResponse = {
  success: boolean;
  login: string;
  accessToken: string;
  tokenType: string;
  errorMessage: string;
}