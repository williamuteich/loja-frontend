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

    private loaded = false;

    public loadTeamMembers() {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<TeamMember[]>('team-members').subscribe({
            next: (teamMembers) => {
                this._teamMembers.set(teamMembers);
                this.loaded = true;
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
        return this.api.patch<TeamMember>(`team-members/${id}`, data).pipe(
            tap((updatedMember) => {
                this._teamMembers.update(members =>
                    members.map(m => m.id === id ? updatedMember : m)
                );
            })
        );
    }
}
