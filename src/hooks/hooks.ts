"use client"
import { useState, useEffect } from 'react';
import { getProducts, getWilayas, createCheckout, addReview, getReviews } from '@/lib/api/api';
import { Product } from '@/lib/types/product';
import { Wilaya } from '@/lib/types/wilaya';
import { CheckoutRequest, CheckoutResponse } from '@/lib/types/checkout';
import { ReviewRequest, ReviewResponse } from '@/lib/types/review';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useWilayas = () => {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setLoading(true);
        const data = await getWilayas();
        setWilayas(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wilayas');
      } finally {
        setLoading(false);
      }
    };

    fetchWilayas();
  }, []);

  return { wilayas, loading, error };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<CheckoutResponse | null>(null);

  const submitCheckout = async (checkoutData: CheckoutRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createCheckout(checkoutData);
      setOrder(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitCheckout,
    loading,
    error,
    order
  };
};

export const useReview = (productId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);

  const submitReview = async (reviewData: ReviewRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await addReview(productId, reviewData);
      setReview(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitReview,
    loading,
    error,
    review
  };
};

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await getReviews(productId);
        setReviews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return { reviews, loading, error };
}; 