import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.api.post('auth/team/login', credentials, { withCredentials: true });
  }
}
