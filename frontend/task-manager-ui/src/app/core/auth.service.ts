import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })

export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';
  tokenKey = 'tm_token';
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }
  register(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.authUrl}/register`, { username, password }).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }
  
  token() { return localStorage.getItem(this.tokenKey); }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
