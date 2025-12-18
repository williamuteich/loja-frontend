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
