import { Component, input, signal, effect } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Brand } from '../../../../models';

@Component({
    selector: 'app-brand-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './brand-form.html',
})
export class BrandForm {
    itemToEdit = input<Brand | undefined>();

    form: FormGroup;

    readonly isValid = signal(false);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            isActive: [true],
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
                    isActive: true
                });
            }
            this.isValid.set(this.form.valid);
        });
    }

    get name(): FormControl {
        return this.form.get('name') as FormControl;
    }

    get isActive(): FormControl {
        return this.form.get('isActive') as FormControl;
    }

    getFormValue() {
        return this.form.value;
    }
}
