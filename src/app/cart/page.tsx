// app/cart/page.tsx
"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ProductImages } from "../products/[slug]/images"
import { ProductIcons } from "../products/[slug]/icons"
import { Product } from "@/lib/types/product"
import ProductHeader from "@/components/section/header"
import Footer from "@/components/product/footer"
import Newsletter from '@/components/section/newsletter'
import { toast } from 'react-toastify'
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { cart: cartItems, addToCart, removeFromCart } = useCart()

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleRemoveFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(item => item.id === productId)
    
    if (itemToRemove) {
      const productImage = ProductImages.products[itemToRemove.slug as keyof typeof ProductImages.products]?.main || 
        ProductImages.placeholder
        
      removeFromCart(productId)
      
      toast.error(
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={productImage}
              alt={itemToRemove.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{itemToRemove.name} removed from cart</p>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "rounded-xl",
        }
      )
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = cartItems.find(item => item.id === productId)
    if (!product) return

    // If quantity is 0, remove item
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    
    // First remove the item
    removeFromCart(productId)
    
    // Then add it back with new quantity
    addToCart({
      ...product,
      quantity: newQuantity
    })
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return total + (price * (item.quantity || 1))
    }, 0)
  }

  const handleCheckout = () => {
    // Enhance cart items with full image information before sending
    const enhancedCartItems = cartItems.map(item => ({
      ...item,
      // Ensure we have the full image path
      image: ProductImages.products[item.slug as keyof typeof ProductImages.products]?.main || 
             ProductImages.placeholder
    }))
    
    sessionStorage.setItem('checkoutItems', JSON.stringify(enhancedCartItems))
    router.push('/checkout')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <Image
              src="/images/empty-cart.png"
              alt="Empty Cart"
              width={200}
              height={200}
            />
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800 cursor-pointer">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((product) => {
                const productImage = ProductImages.products[product.slug as keyof typeof ProductImages.products]?.main || 
                  ProductImages.placeholder
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''))

                return (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                    <Image
                      src={productImage}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{product.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, Math.max(1, (product.quantity || 1) - 1))}
                            >
                              {ProductIcons.minus}
                            </Button>
                            <span className="w-8 text-center">{product.quantity || 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, (product.quantity || 1) + 1)}
                            >
                              {ProductIcons.plus}
                            </Button>
                          </div>
                          <Button
                            variant="link"
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleRemoveFromCart(product.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        <p className="font-bold">${(price * (product.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total</span>
                  <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Link href="/products" className="block text-center text-sm text-gray-600 mt-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Newsletter />
      <Footer/>
    </div>
  )
}