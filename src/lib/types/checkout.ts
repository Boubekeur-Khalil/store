export interface CheckoutItem {
  product_id: number;
  quantity: number;
}

export interface CheckoutRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  wilaya_id: number;
  address: string;
  notes?: string;
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: string;
  created_at: string;
} 