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
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Apply headers
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return next.handle(req).pipe(
      tap(
        (x) => x,
        (err) => {
          console.log(err);
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
  constructor(private http: HttpClient) {}

  signInWithGithub(code: string): void {
    // TODO server side authorization
  }

  async signIn(login: string, password: string): Promise<string> {
    try {
      let request = await this.http
        .post<UserModel>(environment.apiUrl1 + `user/login`, {
          login: login,
          password: password,
        })
        .toPromise();
      if (request.success) {
        localStorage.setItem("token", request.authToken);
        return request.authToken;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async signUp(login: string, password: string): Promise<string> {
    try {
      let request = await this.http
        .post<UserModel>(environment.apiUrl1 + `user/create`, {
          login: login,
          password: password,
        })
        .toPromise();
      if (request.success) {
        localStorage.setItem("token", request.authToken);
        return request.authToken;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

export type UserModel = {
  success: boolean;
  authToken: string;
};
