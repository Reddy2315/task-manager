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

  getUsername(): string | null {
    const t = localStorage.getItem(this.tokenKey);
    if (!t) return null;
    try {
      const p = JSON.parse(decodeURIComponent(escape(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
      return p.username || p.preferred_username || p.sub || null;
    } catch { return null; }
  }

}
