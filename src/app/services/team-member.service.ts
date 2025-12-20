import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { TeamMember } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TeamMemberService {
    private readonly api = inject(ApiService);

    private readonly _teamMembers = signal<TeamMember[]>([]);
    readonly teamMembers = this._teamMembers.asReadonly();

    private loaded = false;

    loadTeamMembers(): void {
        if (this.loaded) return;

        this.api.get<TeamMember[]>('team-members')
            .subscribe(teamMembers => {
                this._teamMembers.set(teamMembers);
                this.loaded = true;
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
