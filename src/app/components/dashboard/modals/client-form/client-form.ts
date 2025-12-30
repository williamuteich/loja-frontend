import { Component, input, signal, effect } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../models';

@Component({
    selector: 'app-client-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './client-form.html',
})
export class ClientForm {
    itemToEdit = input<Client | undefined>();

    form: FormGroup;

    readonly isValid = signal(false);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['']
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
                this.form.reset();
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

    get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    getFormValue() {
        return this.form.value;
    }
}
