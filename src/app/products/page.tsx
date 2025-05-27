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
import * as Slider from "@radix-ui/react-slider"
import { useProducts } from '@/hooks/hooks'

interface Filters {
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  minRating: number
}

export default function ProductFilterPage() {
  const { products, loading, error } = useProducts()
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

  // Available filter options - only if products have these attributes
  const hasSizes = products.some(p => p.attributes.some(attr => attr.name.toLowerCase() === 'size'))
  const hasColors = products.some(p => p.attributes.some(attr => attr.name.toLowerCase() === 'color'))

  const allSizes = hasSizes ? Array.from(new Set(products.flatMap(p => 
    p.attributes
      .find(attr => attr.name.toLowerCase() === 'size')
      ?.values.map(v => v.value) || []
  ))) : []

  const allColors = hasColors ? Array.from(new Set(products.flatMap(p => 
    p.attributes
      .find(attr => attr.name.toLowerCase() === 'color')
      ?.values.map(v => v.value) || []
  ))) : []

  // Price conversion helper
  const parsePrice = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ''))

  // Filtered products
  const filteredProducts = products.filter(product => {
    const price = parsePrice(product.current_price)
    
    // Price range check
    const priceInRange = price >= filters.priceRange[0] && price <= filters.priceRange[1]
    
    // Rating check
    const ratingValid = parseFloat(product.average_rating) >= filters.minRating
    
    // Size check - product must have ALL selected sizes
    const sizesValid = !hasSizes || filters.sizes.length === 0 || 
      filters.sizes.every(selectedSize => 
        product.attributes
          .find(attr => attr.name.toLowerCase() === 'size')
          ?.values.some(v => v.value === selectedSize)
      )
    
    // Color check - product must have ALL selected colors
    const colorsValid = !hasColors || filters.colors.length === 0 || 
      filters.colors.every(selectedColor => 
        product.attributes
          .find(attr => attr.name.toLowerCase() === 'color')
          ?.values.some(v => v.value === selectedColor)
      )

    return priceInRange && ratingValid && sizesValid && colorsValid
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  if (loading) {
    return (
      <div className="bg-white">
        <ProductHeader />
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          Loading products...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white">
        <ProductHeader />
        <div className="max-w-7xl mx-auto px-4 py-10 text-center text-red-500">
          Error: {error}
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
              <h3 className="font-semibold mb-4">
                Price Range: <span className="text-gray-900">{filters.priceRange[0]} DZD - {filters.priceRange[1]} DZD</span>
              </h3>
              <div className="mt-6 px-2">
                <div className="relative pt-5">
                  <div className="absolute -top-2 inset-x-0 flex justify-between text-xs text-gray-500">
                    <span>0 DZD</span>
                    <span>1000 DZD</span>
                  </div>
                  <Slider.Root
                    className="relative flex w-full touch-none select-none items-center"
                    defaultValue={filters.priceRange}
                    value={filters.priceRange}
                    max={1000}
                    step={10}
                    minStepsBetweenThumbs={1}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      priceRange: value as [number, number]
                    }))}
                    aria-label="Price Range"
                  >
                    <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                      <Slider.Range className="absolute h-full bg-black" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block h-5 w-5 rounded-full border border-black bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring focus:ring-black"
                      aria-label="Minimum price"
                    />
                    <Slider.Thumb
                      className="block h-5 w-5 rounded-full border border-black bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring focus:ring-black"
                      aria-label="Maximum price"
                    />
                  </Slider.Root>
                </div>

                {/* Price labels */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Min:</span>
                    <input
                      type="number"
                      min="0"
                      max={filters.priceRange[1]}
                      value={filters.priceRange[0]}
                      onChange={(e) => {
                        const value = Math.min(parseInt(e.target.value) || 0, filters.priceRange[1]);
                        setFilters(prev => ({
                          ...prev,
                          priceRange: [value, prev.priceRange[1]]
                        }));
                      }}
                      className="w-20 px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      aria-label="Minimum price input"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Max:</span>
                    <input
                      type="number"
                      min={filters.priceRange[0]}
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const value = Math.max(parseInt(e.target.value) || 0, filters.priceRange[0]);
                        setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], value]
                        }));
                      }}
                      className="w-20 px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      aria-label="Maximum price input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter - Only show if products have sizes */}
            {hasSizes && (
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-4">Screen Sizes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allSizes.map(size => (
                    <label 
                      key={size} 
                      className={`flex items-center justify-center p-2 rounded-md border cursor-pointer transition-all ${
                        filters.sizes.includes(size) 
                          ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium shadow-sm' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.sizes.includes(size)}
                        onChange={e => {
                          const newSizes = e.target.checked
                            ? [...filters.sizes, size]
                            : filters.sizes.filter(s => s !== size)
                          setFilters(prev => ({ ...prev, sizes: newSizes }))
                        }}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        {filters.sizes.includes(size) && (
                          <svg className="w-3.5 h-3.5 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span>{size}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter - Only show if products have colors */}
            {hasColors && (
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-4">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {allColors.map(color => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => {
                        const newColors = filters.colors.includes(color)
                          ? filters.colors.filter(c => c !== color)
                          : [...filters.colors, color]
                        setFilters(prev => ({ ...prev, colors: newColors }))
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        filters.colors.includes(color)
                          ? 'border-black ring-2 ring-offset-2'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: products
                        .flatMap(p => p.attributes.find(attr => attr.name.toLowerCase() === 'color')?.values || [])
                        .find(v => v.value === color)?.color_code }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

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
    const productImage = product.images[0]?.image || ProductImages.placeholder;

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
          <p className="text-xs text-gray-500 mb-1">{product.description}</p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-lg">{product.current_price}</p>
            {product.is_sale && (
              <span className="text-sm text-gray-500 line-through">{product.price}</span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <

span className="text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={`star-${product.id}-${i}`}>
                  {ProductIcons.star(i < Math.floor(parseFloat(product.average_rating)))}
                </span>
              ))}
            </span>
            <span className="text-xs text-gray-500 ml-1">({product.reviews.length})</span>
          </div>
        </Link>
      </div>
    );
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