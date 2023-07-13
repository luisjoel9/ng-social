import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenData } from '../../models/token-data.model';
import { isPlatformBrowser } from '@angular/common';
import { UserStateService } from '../state/user-state.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    
    return null;
  }
  
  private readonly AUTH_TOKEN_KEY = 'ngsocial_auth_token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,  
    private userService: UserService,
    private userState: UserStateService,
    private router: Router,
  ) { }

  login(userData: User): Observable<Partial<User>> {
    return this.http
      .post<TokenData>('http://localhost:3000/auth/login', userData)
      .pipe(
        switchMap((tokenData) => {
          this.saveToken(tokenData.access_token);

          return this.userService.getUserProfile();
        }),
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }

    this.userState.clearUser();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.token;
    }

    return false;
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('ngsocial_auth_token', token);
    }
  }
}
