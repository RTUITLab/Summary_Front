import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  signInWithGithub(code: string): void {
    // TODO server side authorization
  }
}
