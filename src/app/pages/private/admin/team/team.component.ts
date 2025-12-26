import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, UserCog, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { TeamMemberService } from '../../../../services/team-member.service';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { TeamMember } from '../../../../models';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { TeamMemberForm } from '../../../../components/dashboard/modals/team-member-form/team-member-form';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-team',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, TeamMemberForm, DateFormatPipe, SkeletonTableComponent, EmptyStateComponent, DeleteConfirmationComponent],
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
  readonly Plus = Plus;
  readonly UserCog = UserCog;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly teamMemberService = inject(TeamMemberService);
  private readonly authService = inject(AuthService);

  protected readonly team = this.teamMemberService.teamMembers;
  protected readonly isAdmin = computed(() => this.authService.hasRole(['ADMIN']));

  isModalVisible = signal(false);
  selectedMember = signal<TeamMember | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  memberToDelete = signal<TeamMember | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.teamMemberService.isLoading;
  error = this.teamMemberService.error;

  ngOnInit(): void {
    this.teamMemberService.loadTeamMembersAdmin();
  }

  openEditModal(member?: TeamMember): void {
    this.selectedMember.set(member);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedMember.set(undefined);
  }

  openDeleteModal(member: TeamMember): void {
    this.memberToDelete.set(member);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.memberToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.teamMemberService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.memberToDelete.set(undefined);
          this.isSaving.set(false);
          this.teamMemberService.loadTeamMembersAdmin();
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        }
      });
    }
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

    const { role, ...updateData } = formValue;

    this.teamMemberService.update(memberId, updateData).subscribe({
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
