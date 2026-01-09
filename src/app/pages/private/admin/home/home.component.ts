import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, MessageCircle, Package, FolderTree, TrendingUp, Users, ArrowUpRight, Award } from 'lucide-angular';
import { CategoryService } from '../../../../services/category.service';
import { BrandService } from '../../../../services/brand.service';
import { ProductService } from '../../../../services/product.service';
import { ClientService } from '../../../../services/client.service';
import { TeamMemberService } from '../../../../services/team-member.service';
import { User, Mail } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  readonly Eye = Eye;
  readonly MessageCircle = MessageCircle;
  readonly Package = Package;
  readonly Users = Users;
  readonly ArrowUpRight = ArrowUpRight;
  readonly FolderTree = FolderTree;
  readonly TrendingUp = TrendingUp;
  readonly Award = Award;
  readonly User = User;
  readonly Mail = Mail;

  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly productService = inject(ProductService);
  private readonly clientService = inject(ClientService);
  private readonly teamMemberService = inject(TeamMemberService);

  protected readonly categories = this.categoryService.categories;
  protected readonly brands = this.brandService.brands;
  protected readonly products = this.productService.products;
  protected readonly clients = this.clientService.clients;
  protected readonly teamMembers = this.teamMemberService.teamMembers;

  protected get activeProductsCount(): number {
    return this.products().filter(p => p.isActive).length;
  }

  protected get activeCategoriesCount(): number {
    return this.categories().filter(c => c.isActive).length;
  }

  protected get activeBrandsCount(): number {
    return this.brands().filter(b => b.isActive).length;
  }

  ngOnInit(): void {
    this.categoryService.loadCategoriesAdmin();
    this.brandService.loadBrandsAdmin();
    this.productService.loadProductsAdmin();
    this.clientService.loadClientsAdmin(1, 10);
    this.teamMemberService.loadTeamMembersAdmin();
  }
}

