import { getBaseUrl, API_ENDPOINTS } from '@/utils/apiConstants';
import { Product } from '@/lib/types/product';
import { Wilaya } from '@/lib/types/wilaya';
import { CheckoutRequest, CheckoutResponse } from '@/lib/types/checkout';
import { ReviewRequest, ReviewResponse } from '@/lib/types/review';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export class ApiException extends Error {
  public errors?: Record<string, string[]>;
  public status?: number;

  constructor(message: string, errors?: Record<string, string[]>, status?: number) {
    super(message);
    this.name = 'ApiException';
    this.errors = errors;
    this.status = status;
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorData: any;

    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    }

    throw new ApiException(
      errorData?.message || 'An error occurred',
      errorData?.errors,
      response.status
    );
  }

  return response.json();
}

// Function to fetch products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${getBaseUrl()}${API_ENDPOINTS.PRODUCTS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to fetch wilayas
export const getWilayas = async (): Promise<Wilaya[]> => {
  try {
    const response = await fetch(`${getBaseUrl()}${API_ENDPOINTS.WILAYAS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wilayas:', error);
    throw error;
  }
};

// Function to create a checkout order
export const createCheckout = async (checkoutData: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const response = await fetch(`${getBaseUrl()}${API_ENDPOINTS.CHECKOUT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    return handleApiResponse<CheckoutResponse>(response);
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException('Failed to create checkout');
  }
};

// Function to add a review for a product
export const addReview = async (productId: string, reviewData: ReviewRequest): Promise<ReviewResponse> => {
  try {
    if (!productId) {
      throw new ApiException('Product ID is required');
    }

    const response = await fetch(`${getBaseUrl()}${API_ENDPOINTS.PRODUCTS}${productId}/add_review/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData: Record<string, any> = {};

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      }

      throw new ApiException(
        errorData?.message || 'Failed to add review',
        errorData?.errors,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException('Failed to add review');
  }
};

// Function to get reviews for a product
export const getReviews = async (productId: string): Promise<ReviewResponse[]> => {
  try {
    if (!productId) {
      throw new ApiException('Product ID is required');
    }

    const response = await fetch(`${getBaseUrl()}${API_ENDPOINTS.PRODUCTS}${productId}/get_reviews/`);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData: Record<string, any> = {};

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      }

      throw new ApiException(
        errorData?.message || 'Failed to fetch reviews',
        errorData?.errors,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException('Failed to fetch reviews');
  }
};
