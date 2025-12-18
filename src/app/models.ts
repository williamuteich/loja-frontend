export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  specs: { [key: string]: any };
  createdAt: string;
  brandId: string;
  variants: any[];
  images: { url: string }[];
  categories: {
    category: {
      id: string;
      name: string;
    }
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
  createdAt: string;
  updatedAt: string;
}
