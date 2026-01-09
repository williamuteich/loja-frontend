export interface Product {
  imageUrl: any;
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  specs: { [key: string]: any };
  isActive: boolean;
  createdAt: string;
  brandId: string;
  variants: any[];
  images: { url: string }[];
  categories: {
    productId: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      isActive: boolean;
      isHome: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  brand: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  linkUrl: string | null;
  imageDesktop: string | null;
  imageMobile: string | null;
  resolutionDesktop: string | null;
  resolutionMobile: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isHome: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  }
}

export interface Brand {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  }
}

export interface Client {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'COLLABORATOR' | 'CLIENT';
  createdAt: string;
  updatedAt: string;
}

export interface Social {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreConfig {
  id: string;
  isActive: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  storeName: string;
  cnpj: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  logoUrl?: string;
  faviconUrl?: string;
  googleMapsEmbedUrl?: string;
  businessHours?: string;
  contactEmail: string;
  notifyNewOrders?: boolean;
  automaticNewsletter?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  currency?: string;
  locale?: string;
  ogImageUrl?: string;
  socialMedias?: Social[];
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  whatsapp?: string;
  createdAt: string;
  updatedAt: string;
}