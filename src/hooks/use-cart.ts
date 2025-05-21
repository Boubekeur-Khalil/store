// hooks/use-cart.ts
"use client"

import { useEffect, useState } from 'react'
import { Product } from "@/lib/types/product"

export const useCart = () => {
  const [cart, setCart] = useState<Product[]>([])
  

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => 
      item.id === product.id &&
      item.selectedColor === product.selectedColor &&
      item.selectedSize === product.selectedSize
    )

    const newCart = existingItem
      ? cart.map(item => 
          item.id === product.id &&
          item.selectedColor === product.selectedColor &&
          item.selectedSize === product.selectedSize
            ? { ...item, quantity: (item.quantity || 0) + product.quantity! }
            : item
        )
      : [...cart, product]

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return { cart, addToCart, removeFromCart }
}