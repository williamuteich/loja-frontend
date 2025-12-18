import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, MessageCircle, Package, FolderTree, TrendingUp, Users, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-12 md:p-24">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <lucide-icon [img]="Eye" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div class="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <lucide-icon [img]="ArrowUpRight" class="w-4 h-4"></lucide-icon>
              +12%
            </div>
          </div>
          <h3 class="text-2xl font-bold text-slate-900">1.234</h3>
          <p class="text-slate-500 text-sm mt-1">Visualizações na Loja</p>
        </div>

        <!-- WhatsApp Clicks -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <lucide-icon [img]="MessageCircle" class="w-6 h-6 text-green-600"></lucide-icon>
            </div>
            <div class="flex items-center gap-1 text-sm font-medium text-emerald-600">
               <lucide-icon [img]="ArrowUpRight" class="w-4 h-4"></lucide-icon>
              +5%
            </div>
          </div>
          <h3 class="text-2xl font-bold text-slate-900">45</h3>
          <p class="text-slate-500 text-sm mt-1">Cliques no WhatsApp</p>
        </div>

        <!-- Active Products -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
               <lucide-icon [img]="Package" class="w-6 h-6 text-purple-600"></lucide-icon>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-slate-900">156</h3>
          <p class="text-slate-500 text-sm mt-1">Produtos Ativos</p>
        </div>

        <!-- Potential Clients (Visitors) -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
               <lucide-icon [img]="Users" class="w-6 h-6 text-orange-600"></lucide-icon>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-slate-900">850</h3>
          <p class="text-slate-500 text-sm mt-1">Novos Visitantes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content / Recent Interactions -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-900">Produtos Mais Visualizados</h2>
          </div>
          <div class="p-6">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-slate-500">
                  <th class="pb-4 font-medium">Produto</th>
                  <th class="pb-4 font-medium">Categoria</th>
                  <th class="pb-4 font-medium text-right">Visualizações</th>
                  <th class="pb-4 font-medium text-right">Cliques Whats</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr class="border-t border-slate-100">
                  <td class="py-4 font-medium text-slate-900">Tênis Nike Air Jordan</td>
                  <td class="py-4 text-slate-600">Calçados</td>
                  <td class="py-4 text-right font-medium text-slate-900">1.203</td>
                  <td class="py-4 text-right text-emerald-600 font-medium">45</td>
                </tr>
                 <tr class="border-t border-slate-100">
                  <td class="py-4 font-medium text-slate-900">Camiseta Oversized</td>
                  <td class="py-4 text-slate-600">Roupas</td>
                  <td class="py-4 text-right font-medium text-slate-900">980</td>
                  <td class="py-4 text-right text-emerald-600 font-medium">32</td>
                </tr>
                 <tr class="border-t border-slate-100">
                  <td class="py-4 font-medium text-slate-900">Boné New Era</td>
                  <td class="py-4 text-slate-600">Acessórios</td>
                  <td class="py-4 text-right font-medium text-slate-900">850</td>
                  <td class="py-4 text-right text-emerald-600 font-medium">28</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Summary -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Catálogo</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <lucide-icon [img]="Package" class="w-5 h-5 text-primary"></lucide-icon>
                  </div>
                  <span class="text-slate-600">Total Produtos</span>
                </div>
                <span class="font-semibold text-slate-900">156</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <lucide-icon [img]="FolderTree" class="w-5 h-5 text-blue-600"></lucide-icon>
                  </div>
                  <span class="text-slate-600">Categorias</span>
                </div>
                <span class="font-semibold text-slate-900">12</span>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-slate-100">
               <button class="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                  Adicionar Novo Produto
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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

