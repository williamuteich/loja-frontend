import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, Store, Mail, Globe, MapPin, Image, Power, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-angular';
import { StoreConfigService } from '../../../../services/store-config.service';
import { StoreConfig } from '../../../../models';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly configService = inject(StoreConfigService);

  readonly Save = Save;
  readonly Store = Store;
  readonly Mail = Mail;
  readonly Globe = Globe;
  readonly MapPin = MapPin;
  readonly Image = Image;
  readonly Power = Power;
  readonly Search = Search;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;

  settingsForm!: FormGroup;
  isSaving = signal(false);
  saveSuccess = signal(false);
  saveError = signal<string | null>(null);
  isLoading = this.configService.isLoading;

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      maintenanceMode: [false],
      maintenanceMessage: [''],
      storeName: ['', Validators.required],
      cnpj: ['', Validators.required],
      description: [''],
      phone: [''],
      whatsapp: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      logoUrl: [''],
      faviconUrl: [''],
      ogImageUrl: [''],
      googleMapsEmbedUrl: [''],
      businessHours: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      notifyNewOrders: [false],
      automaticNewsletter: [false],
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: [''],
      currency: [{ value: 'BRL', disabled: true }],
      locale: [{ value: 'pt-BR', disabled: true }]
    });
  }

  private loadData(): void {
    this.configService.loadConfigPublic();

    const checkLoaded = setInterval(() => {
      const config = this.configService.config();
      if (config) {
        this.settingsForm.patchValue({
          ...config,
          storeName: config.storeName || (config as any).name,
          contactEmail: config.contactEmail || (config as any).email
        });
        clearInterval(checkLoaded);
      }
    }, 100);

    setTimeout(() => clearInterval(checkLoaded), 5000);
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.saveError.set('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isSaving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);

    const formValue = this.settingsForm.getRawValue();

    const payload = {
      name: formValue.storeName,
      cnpj: formValue.cnpj,
      phone: formValue.phone,
      email: formValue.contactEmail,
      description: formValue.description,
      whatsapp: formValue.whatsapp,
      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      zipCode: formValue.zipCode,
      maintenanceMode: formValue.maintenanceMode,
      maintenanceMessage: formValue.maintenanceMessage,
      businessHours: formValue.businessHours,
      notifyNewOrders: formValue.notifyNewOrders,
      automaticNewsletter: formValue.automaticNewsletter,
      seoTitle: formValue.seoTitle,
      seoDescription: formValue.seoDescription,
      seoKeywords: formValue.seoKeywords,
      currency: formValue.currency,
      locale: formValue.locale
    };

    this.configService.updateAdmin(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        this.configService.loadConfigPublic();
        alert('Conteúdo atualizado com sucesso!');
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Error saving settings:', err.error);
        this.isSaving.set(false);
        const msg = err.error?.message;
        this.saveError.set(Array.isArray(msg) ? msg.join(' | ') : (msg || 'Erro ao salvar.'));
        setTimeout(() => this.saveError.set(null), 8000);
      }
    });
  }

  toggleSwitch(controlName: string): void {
    const control = this.settingsForm.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }
}
