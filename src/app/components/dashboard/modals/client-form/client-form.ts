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
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './client-form.html',
})
export class ClientForm {
    itemToEdit = input.required<Client>();

    form: FormGroup;

    readonly isValid = signal(false);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
        });

        this.form.statusChanges.subscribe(() => {
            this.isValid.set(this.form.valid);
        });

        effect(() => {
            const item = this.itemToEdit();
            if (item) {
                this.form.patchValue(item);
                this.isValid.set(this.form.valid);
            }
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

    getFormValue() {
        return this.form.value;
    }
}
