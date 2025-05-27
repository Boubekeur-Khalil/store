export interface ReviewRequest {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse extends ReviewRequest {
  id?: string;
  created_at?: string;
} 