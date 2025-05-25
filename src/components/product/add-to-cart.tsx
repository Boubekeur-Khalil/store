// components/product/add-to-cart.tsx
"use client"

import { useCart } from "@/hooks/use-cart"
import { Product } from "@/lib/types/product"
import { Button } from "../ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AddToCartProps {
  product: Product
  className?: string
  disabled?: boolean
}

export const AddToCart = ({ 
  product, 
  className,
  disabled = false 
}: AddToCartProps) => {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (disabled || isLoading) return

    try {
      setIsLoading(true)
      await addToCart({
        ...product,
        quantity: 1
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className={cn(
        'cart-button-base',
        {
          'cart-button-default': !disabled && !isLoading,
          'cart-button-disabled': disabled,
          'cart-button-loading': isLoading
        },
        className
      )}
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
    </Button>
  )
}