import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { TeamMember } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamMemberService {
    private readonly api = inject(ApiService);

    private readonly _teamMembers = signal<TeamMember[]>([]);
    readonly teamMembers = this._teamMembers.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    readonly totalItems = signal(0);

    public loadTeamMembersAdmin() {
        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<any>('team-members/admin').subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._teamMembers.set(response);
                    this.totalItems.set(response.length);
                } else if (response && Array.isArray(response.data)) {
                    this._teamMembers.set(response.data);
                    this.totalItems.set(response.data.length);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar membros da equipe', err);
                this.error.set('Não foi possível carregar a lista da equipe.');
                this.isLoading.set(false);
            }
        });
    }

    update(id: string, data: Partial<TeamMember>): Observable<TeamMember> {
        return this.api.patch<TeamMember>(`team-members/admin/${id}`, data).pipe(
            tap((updatedMember) => {
                this._teamMembers.update(members =>
                    members.map(m => m.id === id ? updatedMember : m)
                );
            })
        );
    }

    create(data: TeamMember): Observable<TeamMember> {
        return this.api.post<TeamMember>('team-members/admin', data).pipe(
            tap((newMember) => {
                this._teamMembers.update(members => [...members, newMember]);
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`team-members/admin/${id}`).pipe(
            tap(() => {
                this._teamMembers.update(members =>
                    members.filter(m => m.id !== id)
                );
            })
        );
    }
}
