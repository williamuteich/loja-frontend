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
            password: [''],
        });

        this.form.statusChanges.subscribe(() => {
            this.isValid.set(this.form.valid);
        });

        effect(() => {
            const item = this.itemToEdit();
            const passwordControl = this.form.get('password');

            if (item) {
                passwordControl?.clearValidators();
                passwordControl?.updateValueAndValidity();
                this.form.patchValue(item);
            } else {
                passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
                passwordControl?.updateValueAndValidity();
                this.form.reset({
                    name: '',
                    lastName: '',
                    email: '',
                    role: 'COLLABORATOR',
                    password: ''
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

    get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    getFormValue() {
        const { name, lastName, email, role, password } = this.form.value;
        return { name, lastName, email, role, password };
    }
}
