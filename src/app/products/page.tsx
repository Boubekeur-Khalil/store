// app/products/page.tsx
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductImages } from './[slug]/images'
import ProductHeader from "@/components/section/header"
import Footer from "@/components/product/footer"
import { ProductIcons } from './[slug]/icons'
import Newsletter from '@/components/section/newsletter'
import { useProducts } from '@/hooks/hooks'

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  promotional_price: string;
  is_sale: boolean;
  current_price: string;
  currency: string;
  average_rating: string;
  category_name: string;
  primary_image: string | null;
}

interface Filters {
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  minRating: number
}

export default function ProductFilterPage() {
  const { products: apiProducts, loading, error } = useProducts();
  const [filters, setFilters] = useState<Filters>({
    sizes: [],
    colors: [],
    priceRange: [0, 1000],
    minRating: 0
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Price conversion helper
  const parsePrice = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ''))

  // Filtered products
  const filteredProducts = apiProducts?.filter(product => {
    const price = parsePrice(product.price)
    
    // Price range check
    const priceInRange = price >= filters.priceRange[0] && price <= filters.priceRange[1]
    
    // Rating check
    const ratingValid = parseFloat(product.average_rating) >= filters.minRating

    return priceInRange && ratingValid
  }) || []

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold">Error loading products</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-container">
      <ProductHeader />
      <div className="product-wrapper">
        <div className="product-layout">
          {/* Filters Sidebar */}
          <div className="filter-sidebar">
            {/* Price Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={e => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
                <div className="price-labels">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => setFilters({
                sizes: [],
                colors: [],
                priceRange: [0, 1000],
                minRating: 0
              })}
              className="reset-button"
            >
              Reset Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            <div className="product-grid-layout">
              {paginatedProducts.map((product) => {
                const productImage = product.primary_image || ProductImages.placeholder

                return (
                  <div key={product.id} className="product-card">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="product-image-container">
                        <Image
                          src={productImage}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="product-image"
                        />
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price">
                        <p className="font-bold text-lg">{product.current_price} {product.currency}</p>
                        {product.is_sale && (
                          <span className="product-original-price">{product.price}</span>
                        )}
                      </div>
                      <div className="product-rating">
                        <span className="rating-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={`star-${product.id}-${i}`}>
                              {ProductIcons.star(i < Math.floor(parseFloat(product.average_rating)))}
                            </span>
                          ))}
                        </span>
                        <span className="rating-text">({product.average_rating})</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`pagination-button ${currentPage === 1 ? 'pagination-button-disabled' : 'pagination-button-active'}`}
                >
                  Previous
                </button>
                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`pagination-button ${currentPage === totalPages ? 'pagination-button-disabled' : 'pagination-button-active'}`}
                >
                  Next
                </button>
              </div>
            )}

            {paginatedProducts.length === 0 && (
              <div className="no-products">
                <div className="mb-4">{ProductIcons.star(false)}</div>
                <h3 className="no-products-title">No products found</h3>
                <p className="no-products-text">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  )
}