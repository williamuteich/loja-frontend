import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Instagram, Facebook, Twitter, Youtube, Linkedin, Save } from 'lucide-angular';

@Component({
  selector: 'app-socials',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './socials.component.html'
})
export class SocialsComponent {
  readonly Instagram = Instagram;
  readonly Facebook = Facebook;
  readonly Twitter = Twitter;
  readonly Youtube = Youtube;
  readonly Linkedin = Linkedin;
  readonly Save = Save;

  socials = [
    {
      id: 1,
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/loja',
      enabled: true,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 2,
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/loja',
      enabled: true,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 3,
      name: 'Twitter / X',
      icon: Twitter,
      url: 'https://twitter.com/loja',
      enabled: false,
      color: 'from-slate-700 to-slate-900'
    },
    {
      id: 4,
      name: 'YouTube',
      icon: Youtube,
      url: '',
      enabled: false,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 5,
      name: 'LinkedIn',
      icon: Linkedin,
      url: '',
      enabled: false,
      color: 'from-blue-500 to-blue-700'
    }
  ];
}
