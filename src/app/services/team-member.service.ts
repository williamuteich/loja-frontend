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

    private adminLoaded = false;

    public loadTeamMembersAdmin() {
        if (this.adminLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<TeamMember[]>('team-members/admin').subscribe({
            next: (teamMembers) => {
                this._teamMembers.set(teamMembers);
                this.adminLoaded = true;
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
