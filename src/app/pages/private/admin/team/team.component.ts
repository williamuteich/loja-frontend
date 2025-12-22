import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, UserCog, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { TeamMemberService } from '../../../../services/team-member.service';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { TeamMember } from '../../../../models';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { TeamMemberForm } from '../../../../components/dashboard/modals/team-member-form/team-member-form';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';

@Component({
  selector: 'app-team',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, TeamMemberForm, DateFormatPipe, SkeletonTableComponent, EmptyStateComponent],
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
  readonly Plus = Plus;
  readonly UserCog = UserCog;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly teamMemberService = inject(TeamMemberService);
  protected readonly team = this.teamMemberService.teamMembers;

  isModalVisible = signal(false);
  selectedMember = signal<TeamMember | undefined>(undefined);
  isSaving = signal(false);
  isLoading = this.teamMemberService.isLoading;
  error = this.teamMemberService.error;

  ngOnInit(): void {
    this.teamMemberService.loadTeamMembersAdmin();
  }

  openEditModal(member: TeamMember): void {
    this.selectedMember.set(member);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedMember.set(undefined);
  }

  handleSave(memberForm: TeamMemberForm): void {
    if (!memberForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    const memberId = this.selectedMember()?.id;
    if (!memberId) {
      console.error("Member ID não encontrado!");
      return;
    }

    this.isSaving.set(true);

    const formValue = memberForm.getFormValue();

    this.teamMemberService.update(memberId, formValue).subscribe({
      next: () => {
        this.teamMemberService.loadTeamMembersAdmin();
        this.closeModal();
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar membro:', err);
        this.isSaving.set(false);
      }
    });
  }
}
