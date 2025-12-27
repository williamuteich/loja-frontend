import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, X, Plus, Trash2, Check } from 'lucide-angular';
import { ProductService } from '../../../../services/product.service';
import { BrandService } from '../../../../services/brand.service';
import { CategoryService } from '../../../../services/category.service';
import { Product } from '../../../../models';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-product-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
    readonly backendUrl = environment.BACKEND_URL;
    readonly Save = Save;
    readonly X = X;
    readonly Plus = Plus;
    readonly Trash2 = Trash2;
    readonly Check = Check;

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly productService = inject(ProductService);
    private readonly brandService = inject(BrandService);
    private readonly categoryService = inject(CategoryService);

    protected readonly brands = this.brandService.brands;
    protected readonly categories = this.categoryService.categories;

    product = signal<Product | null>(null);
    isLoading = signal(false);
    selectedFiles: File[] = [];
    keptImageUrls = signal<string[]>([]);
    imageVersion = signal<number>(Date.now());

    form: FormGroup;

    constructor() {
        this.brandService.loadBrandsAdmin();
        this.categoryService.loadCategoriesAdmin();
        this.productService.loadProductsAdmin();

        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            discountPrice: [null, [Validators.min(0)]],
            brandId: [null],
            categoryIds: [[] as string[]],
            specs: [''],
            isActive: [true],
            variants: this.fb.array([])
        });

        effect(() => {
            const products = this.productService.products();
            const productId = this.route.snapshot.paramMap.get('id');

            if (productId && products.length > 0) {
                if (!this.product() || this.product()?.id !== productId) {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        this.loadProductData(product);
                    }
                }
            } else if (!productId) {
                this.product.set(null);
                this.keptImageUrls.set([]);
            }
        });
    }

    get variants(): FormArray {
        return this.form.get('variants') as FormArray;
    }

    loadProductData(product: Product) {
        this.product.set(product);
        this.keptImageUrls.set(product.images.map(img => img.url));
        this.imageVersion.set(Date.now());

        const categoryIds = product.categories?.map(c => c.category.id) || [];
        let specsString = '';
        if (product.specs && typeof product.specs === 'object') {
            specsString = Object.entries(product.specs).map(([key, value]) => `${key}: ${value}`).join(', ');
        }

        this.form.patchValue({
            title: product.title,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            brandId: product.brandId,
            categoryIds: categoryIds,
            specs: specsString,
            isActive: product.isActive
        });

        while (this.variants.length !== 0) {
            this.variants.removeAt(0);
        }

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                this.addVariant(variant.color, variant.name, variant.quantity);
            });
        }
    }

    addVariant(color: string = '#ffffff', name: string = '', quantity: number = 0) {
        const variantGroup = this.fb.group({
            color: [color, Validators.required],
            name: [name, Validators.required],
            quantity: [quantity, [Validators.required, Validators.min(0)]]
        });
        this.variants.push(variantGroup);
    }

    removeVariant(index: number) {
        this.variants.removeAt(index);
    }

    removeExistingImage(url: string) {
        this.keptImageUrls.update(urls => urls.filter(u => u !== url));
    }

    onCategoryChange(categoryId: string, event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const currentIds = this.form.get('categoryIds')?.value || [];

        if (checkbox.checked) {
            this.form.patchValue({ categoryIds: [...currentIds, categoryId] });
        } else {
            this.form.patchValue({ categoryIds: currentIds.filter((id: string) => id !== categoryId) });
        }
    }

    isCategorySelected(categoryId: string): boolean {
        const currentIds = this.form.get('categoryIds')?.value || [];
        return currentIds.includes(categoryId);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.selectedFiles = Array.from(input.files);
        }
    }

    cancel() {
        this.router.navigate(['/dashboard/products']);
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const productId = this.route.snapshot.paramMap.get('id');
        this.isLoading.set(true);
        const formData = this.buildFormData();

        const request = productId
            ? this.productService.update(productId, formData)
            : this.productService.create(formData);

        request.subscribe({
            next: () => {
                alert(productId ? 'Conteúdo atualizado com sucesso!' : 'Produto criado com sucesso!');
                this.router.navigate(['/dashboard/products']);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    private buildFormData(): FormData {
        const formData = new FormData();
        const formValue = this.form.getRawValue();

        formData.append('title', (formValue.title || '').trim());
        formData.append('description', (formValue.description || '').trim());
        formData.append('price', String(formValue.price || 0));

        if (formValue.discountPrice !== null && formValue.discountPrice !== undefined && formValue.discountPrice !== '') {
            formData.append('discountPrice', String(formValue.discountPrice));
        }

        if (formValue.brandId && formValue.brandId !== 'null') {
            formData.append('brandId', formValue.brandId);
        }

        formData.append('isActive', formValue.isActive ? 'true' : 'false');

        const categoryIds = formValue.categoryIds || [];
        formData.append('categoryIds', JSON.stringify(categoryIds));

        const specsObj: any = {};
        if (formValue.specs && formValue.specs.trim()) {
            formValue.specs.split(',').forEach((pair: string) => {
                const [key, ...valueParts] = pair.split(':');
                if (key && valueParts.length > 0) {
                    specsObj[key.trim()] = valueParts.join(':').trim();
                }
            });
        }
        formData.append('specs', JSON.stringify(specsObj));

        formData.append('variants', JSON.stringify(formValue.variants || []));

        if (this.selectedFiles.length > 0) {
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });
        }

        formData.append('imageUrls', JSON.stringify(this.keptImageUrls()));

        return formData;
    }
}
