import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenResult } from 'app/TokenResult';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  redirectURL: string;
  public token: string;
  currentUser: string;

  authURL = 'http://localhost:3000/users/auth';

  constructor(private http: HttpClient, private router: Router) {
    // set token if saved in local storage
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.token = this.currentUser && this.currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.authURL, { email: username, password: password }, httpOptions)
      .map((response: TokenResult) => {
        // login successful if there's a jwt token in the response
        if (response && response.status === '00') {
          // set token property
          this.token = response.token;
          // // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(response));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });


    // return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
