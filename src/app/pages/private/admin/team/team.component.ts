import { Component, inject, OnInit, signal, computed, ChangeDetectorRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, UserCog, SquarePen, Trash2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { TeamMemberService } from '../../../../services/team-member.service';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { TeamMember } from '../../../../models';
import { TeamMemberForm } from '../../../../components/dashboard/modals/team-member-form/team-member-form';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { AuthService } from '../../../../services/auth.service';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';

@Component({
  selector: 'app-team',
  imports: [CommonModule, FormsModule, LucideAngularModule, GenericModal, TeamMemberForm, DeleteConfirmationComponent, SkeletonTableComponent, EmptyStateComponent, DateFormatPipe],
  templateUrl: 'team.component.html'
})
export class TeamComponent implements OnInit, OnDestroy {
  readonly Plus = Plus;
  readonly UserCog = UserCog;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly teamMemberService = inject(TeamMemberService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly team = this.teamMemberService.teamMembers;


  readonly totalItems = this.teamMemberService.totalItems;

  protected searchInput = signal<string>('');
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.setupSearchDebounce();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.loadTeam();
    });
  }

  loadTeam(): void {
    const searchTerm = this.searchInput().trim() || undefined;
    this.teamMemberService.loadTeamMembersAdmin(searchTerm);
  }

  protected readonly isAdmin = computed(() => this.authService.hasRole(['ADMIN']));

  isModalVisible = signal(false);
  selectedMember = signal<TeamMember | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  memberToDelete = signal<TeamMember | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.teamMemberService.isLoading;
  error = this.teamMemberService.error;



  ngOnInit(): void {
    this.loadTeam();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.searchSubject.next(value);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.searchSubject.next('');
  }

  openAddModal(): void {
    this.selectedMember.set(undefined);
    this.isModalVisible.set(true);
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
          this.loadTeam();
          alert('Conteúdo deletado com sucesso!');
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

    this.isSaving.set(true);
    const formValue = memberForm.getFormValue();
    const memberId = this.selectedMember()?.id;

    if (memberId) {
      this.teamMemberService.update(memberId, formValue).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Conteúdo atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar membro:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      this.teamMemberService.create(formValue as any).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Membro criado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar membro:', err);
          this.isSaving.set(false);
        }
      });
    }
  }
}
