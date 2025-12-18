import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Save, Store, Mail, Globe, MapPin, Image, Power, Search } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  readonly Save = Save;
  readonly Store = Store;
  readonly Mail = Mail;
  readonly Globe = Globe;
  readonly MapPin = MapPin;
  readonly Image = Image;
  readonly Power = Power;
  readonly Search = Search;

  settings = {
    isActive: true,
    maintenanceMode: false,
    maintenanceMessage: 'Estamos em manutenção, voltamos logo!',

    storeName: 'Minha Loja de Cosméticos',
    cnpj: '12.345.678/0001-90',
    description: 'Loja especializada em cosméticos e produtos de beleza de alta qualidade.',
    phone: '(11) 99999-9999',
    whatsapp: '(11) 99999-9999',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',

    logoUrl: 'https://example.com/logo.png',
    faviconUrl: 'https://example.com/favicon.ico',
    ogImageUrl: 'https://example.com/og-image.png',

    googleMapsEmbedUrl: '<iframe src="..."></iframe>',

    businessHours: 'Seg-Sex, 9h às 18h',

    contactEmail: 'contato@minhaloja.com',
    notifyNewOrders: true,
    automaticNewsletter: false,

    seoTitle: 'Minha Loja - Os melhores cosméticos',
    seoDescription: 'Compre os melhores cosméticos na Minha Loja.',
    seoKeywords: 'cosméticos, beleza, maquiagem, skincare',

    currency: 'BRL',
    locale: 'pt-BR'
  };
}
