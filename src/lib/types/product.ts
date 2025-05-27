export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface ProductVideo {
  id: number;
  video_url: string;
  thumbnail_url: string;
  title: string;
}

export interface AttributeValue {
  id: number;
  attribute_name: string;
  value: string;
  color_code: string;
  image_url: string;
}

export interface AttributeValueData {
  attribute_name: string;
  value_data: AttributeValue;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price_adjustment: string;
  stock_quantity: number;
  attribute_values: AttributeValueData[];
  final_price: string;
}

export interface ProductDetail {
  id: number;
  key: string;
  value: string;
}

export interface ProductFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Product {
  primary_image: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  promotional_price: string;
  currency: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  average_rating: string;
  has_variants: boolean;
  category_name: string;
  images: ProductImage[];
  videos: ProductVideo[];
  variants: ProductVariant[];
  details: ProductDetail[];
  faqs: ProductFAQ[];
  reviews: string;
  is_sale: boolean;
  current_price: string;
  attributes: string;
  status: 'draft' | 'published' | 'archived';
  selectedVariant?: ProductVariant;
  quantity?: number;
} 