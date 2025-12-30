import { Component, input, signal, effect } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../models';

@Component({
    selector: 'app-category-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './category-form.html',
})
export class CategoryForm {
    itemToEdit = input<Category | undefined>();

    form: FormGroup;

    readonly isValid = signal(false);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required]],
            isHome: [false],
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
                    description: '',
                    isHome: false,
                    isActive: true
                });
            }
            this.isValid.set(this.form.valid);
        });
    }

    get name(): FormControl {
        return this.form.get('name') as FormControl;
    }

    get description(): FormControl {
        return this.form.get('description') as FormControl;
    }

    get isHome(): FormControl {
        return this.form.get('isHome') as FormControl;
    }

    get isActive(): FormControl {
        return this.form.get('isActive') as FormControl;
    }

    selectedFile: File | null = null;

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    getFormValue() {
        return this.form.value;
    }
}
