"use client"

import Link from "next/link"
import Image from "next/image"
import { useProducts } from "@/hooks/hooks"

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div className="text-center mt-16">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-16 overflow-x-auto">
      <div className="flex gap-4 pb-4 min-w-min">
        {products.map((product) => {
          const productImage = product.images[0]?.image || '/placeholder.png';
          
          return (
            <div key={product.id} className="bg-white w-[295px] h-[406px] rounded-[20px] transition-shadow flex-shrink-0">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="overflow-hidden rounded-lg mb-3">
                  <Image
                    src={productImage}
                    alt={product.name}
                    width={295}
                    height={406}
                    className="w-full h-[295px] transition-transform transform hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{product.current_price}</p>
                  {product.is_sale && (
                    <span className="text-sm text-gray-500 line-through">{product.price}</span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(parseFloat(product.average_rating)) ? '★' : '☆'}
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
    </div>
  )
}