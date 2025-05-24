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
    <div className="bg-white">
      <ProductHeader />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 space-y-8">
            {/* Price Filter */}
            <div className="border-b pb-6">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
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
                <div className="flex justify-between text-sm">
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
              className="w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => {
                const productImage = product.primary_image || ProductImages.placeholder

                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="overflow-hidden rounded-lg mb-3">
                        <Image
                          src={productImage}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-auto aspect-square object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">{product.current_price} {product.currency}</p>
                        {product.is_sale && (
                          <span className="text-sm text-gray-500 line-through">{product.price}</span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={`star-${product.id}-${i}`}>
                              {ProductIcons.star(i < Math.floor(parseFloat(product.average_rating)))}
                            </span>
                          ))}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">({product.average_rating})</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1 ? 'bg-gray-100' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages ? 'bg-gray-100' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {paginatedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">{ProductIcons.star(false)}</div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
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