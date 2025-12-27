import { Component, input, signal, effect } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../../../models';

@Component({
    selector: 'app-team-member-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './team-member-form.html',
})
export class TeamMemberForm {
    itemToEdit = input<TeamMember | undefined>();

    form: FormGroup;

    readonly isValid = signal(false);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            role: ['COLLABORATOR', [Validators.required]],
        });

        this.form.statusChanges.subscribe(() => {
            this.isValid.set(this.form.valid);
        });

        effect(() => {
            const item = this.itemToEdit();
            if (item) {
                this.form.patchValue(item);
            } else {
                this.form.reset({
                    name: '',
                    lastName: '',
                    email: '',
                    role: 'COLLABORATOR'
                });
            }
            this.isValid.set(this.form.valid);
        });
    }

    get name(): FormControl {
        return this.form.get('name') as FormControl;
    }

    get lastName(): FormControl {
        return this.form.get('lastName') as FormControl;
    }

    get email(): FormControl {
        return this.form.get('email') as FormControl;
    }

    get role(): FormControl {
        return this.form.get('role') as FormControl;
    }

    getFormValue() {
        const { name, lastName, email, role } = this.form.value;
        return { name, lastName, email, role };
    }
}
