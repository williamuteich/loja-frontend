import { Component, input, signal, effect } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Banner } from '../../../models';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './banner-form.html',
  styleUrl: './banner-form.css',
})
export class BannerForm {
  itemToEdit = input.required<Banner>();

  form: FormGroup;

  readonly isValid = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      subtitle: [''],
      linkUrl: [''],
      isActive: [true],
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

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  getFormValue() {
    return this.form.value;
  }
}
