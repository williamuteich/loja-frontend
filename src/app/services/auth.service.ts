import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { TeamMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  currentUser = signal<TeamMember | null>(null);

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.api.post('auth/team/login', credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response?.user) {
          this.currentUser.set(response.user);
        }
      })
    );
  }


  getCurrentUser(): Observable<TeamMember | null> {
    return this.api.get<TeamMember>('auth/me', { withCredentials: true }).pipe(
      tap(user => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return roles.includes(user.role);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
