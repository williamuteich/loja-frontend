import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, MessageCircle, Package, FolderTree, TrendingUp, Users, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly Eye = Eye;
  readonly MessageCircle = MessageCircle;
  readonly Package = Package;
  readonly Users = Users;
  readonly ArrowUpRight = ArrowUpRight;
  readonly FolderTree = FolderTree;
  readonly TrendingUp = TrendingUp;
}

