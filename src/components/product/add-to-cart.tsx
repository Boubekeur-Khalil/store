// components/product/add-to-cart.tsx
"use client"

import { useCart } from "@//hooks/use-cart"
import { Product } from "@/lib/types/product"
import { Button } from "../ui/button"

export const AddToCart = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1
    })
  }

  return (
    <Button className="w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  )
}