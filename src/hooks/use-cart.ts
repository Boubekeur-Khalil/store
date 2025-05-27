// hooks/use-cart.ts
"use client"

import { useEffect, useState } from 'react'
import { Product } from "@/lib/types/product"

// Create a custom event for cart updates
export const cartUpdateEvent = typeof window !== 'undefined' 
  ? new CustomEvent('cartUpdate') 
  : null;

export const useCart = () => {
  const [cart, setCart] = useState<Product[]>([])
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) setCart(JSON.parse(savedCart))
      else setCart([])
    }
    
    loadCart()

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart()
      }
    }

    // Setup event listeners
    window.addEventListener('storage', handleStorageChange)
    
    // Add a custom listener for internal cart updates
    const handleCartUpdate = () => {
      loadCart()
    }
    
    // Create and dispatch a custom event
    window.addEventListener('cartUpdate', handleCartUpdate)
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdate', handleCartUpdate)
    }
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
    
    // Notify all components about cart update
    window.dispatchEvent(new Event('cartUpdate'))
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    
    // Notify all components about cart update
    window.dispatchEvent(new Event('cartUpdate'))
  }

  return { cart, addToCart, removeFromCart }
}