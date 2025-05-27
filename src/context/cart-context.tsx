// context/cart-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/lib/types/product'

interface CartContextType {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: React.ReactNode }) {
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

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)