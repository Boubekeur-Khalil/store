"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductHeader from "@/components/product/header"
import Footer from "@/components/product/footer"
import Newsletter from '@/components/product/newsletter'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
  slug?: string
  description?: string
  image?: string  // Add this line
}

type ValidationError = {
  field: string;
  message: string;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [discountCode, setDiscountCode] = useState('ZJ3OOFF')
  const [appliedDiscount, setAppliedDiscount] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState('')
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })
  const router = useRouter()

  useEffect(() => {
    // Retrieve items from session storage on component mount
    const storedItems = sessionStorage.getItem('checkoutItems')
    if (storedItems) {
      setCheckoutItems(JSON.parse(storedItems))
    }
  }, [])

  // Calculate cart totals based on actual items
  const calculateSubtotal = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return total + (price * (item.quantity || 1))
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shippingFee = 1500 // $ fixed shipping
  const tax = 129 // $ fixed tax
  const total = subtotal + shippingFee + tax

  const applyDiscount = () => {
    if (discountCode === 'Z.BOOFF') {
      setAppliedDiscount(true)
      // Discount logic here
    }
  }

  const validateCheckout = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!personalInfo.fullName.trim()) {
      errors.push({ field: 'fullName', message: 'Full name is required' });
    }
    if (!personalInfo.phoneNumber.trim()) {
      errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
    }
    if (!personalInfo.streetAddress.trim()) {
      errors.push({ field: 'streetAddress', message: 'Street address is required' });
    }
    if (!personalInfo.city.trim()) {
      errors.push({ field: 'city', message: 'City is required' });
    }
    if (!personalInfo.state.trim()) {
      errors.push({ field: 'state', message: 'State is required' });
    }
    if (!personalInfo.zipCode.trim()) {
      errors.push({ field: 'zipCode', message: 'Zip code is required' });
    }
    if (!personalInfo.country.trim()) {
      errors.push({ field: 'country', message: 'Country is required' });
    }
    if (!selectedShipping) {
      errors.push({ field: 'shipping', message: 'Please select a shipping method' });
    }

    return errors;
  }

  // Add this function before the return statement
  const validateForm = () => {
    return (
      personalInfo.fullName.trim() !== '' &&
      personalInfo.phoneNumber.trim() !== '' &&
      personalInfo.streetAddress.trim() !== '' &&
      personalInfo.city.trim() !== '' &&
      personalInfo.state.trim() !== '' &&
      personalInfo.zipCode.trim() !== '' &&
      personalInfo.country.trim() !== '' &&
      selectedShipping !== ''
    )
  }

  return (
    <div>
      <ProductHeader/>
      <div className="max-w-6xl mx-auto py-7 my-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Forms (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <section>
              <h2 className="text-base font-medium mb-4 border-b border-gray-200 pb-2">Personnel informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div>
                  <label className="block text-sm font-bold mb-1">Full name</label>
                  <input 
                    type="text" 
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Number phone</label>
                  <input 
                    type="tel" 
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    required
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-base font-medium mb-4 border-b border-gray-200 pb-2">Shipping address</h2>
              <div className="space-y-4 my-8">
                <div>
                  <label className="block text-sm font-bold mb-1">Street Address</label>
                  <input 
                    type="text" 
                    value={personalInfo.streetAddress}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, streetAddress: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">City</label>
                    <input 
                      type="text" 
                      value={personalInfo.city}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">State</label>
                    <input 
                      type="text" 
                      value={personalInfo.state}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Zip Code</label>
                    <input 
                      type="text" 
                      value={personalInfo.zipCode}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Country</label>
                    <input 
                      type="text" 
                      value={personalInfo.country}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="text-base font-medium mb-4 border-b border-gray-200 pb-2 my-8">Delivry method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setSelectedShipping('MAYSTRO DELIVRY')}
                  className={`p-4 border rounded-full flex items-center justify-center gap-2 transition-colors ${
                    selectedShipping === 'MAYSTRO DELIVRY' 
                      ? 'border-black bg-gray-100' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                   <img src="/images/maystro.png" />
                  </div>
                  <span className="font-medium">MAYSTRO DELIVRY</span>
                </button>

                <button 
                  onClick={() => setSelectedShipping('YALIDINE EXPRESS')}
                  className={`p-4 border rounded-full flex items-center justify-center gap-2 transition-colors ${
                    selectedShipping === 'YALIDINE EXPRESS' 
                      ? 'border-black bg-gray-100' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
                    <img src="/images/yalidin.png" />
                  </div>
                  <span className="font-medium">YALIDINE EXPRESS</span>
                </button>

                <button 
                  onClick={() => setSelectedShipping('ZR EXPRESS')}
                  className={`p-4 border rounded-full flex items-center justify-center gap-2 transition-colors ${
                    selectedShipping === 'ZR EXPRESS' 
                      ? 'border-black bg-gray-100' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black">
                    <img src="/images/ZR.png" />
                  </div>
                  <span className="font-medium">ZR EXPRESS</span>
                </button>
              </div>
            </section>
          </div>
          
          {/* Right column - Order Summary (1/3 width) */}
          <div className="lg:col-span-1 mx-auto">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              {/* Your Orders */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-4">Your orders</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">{item.name.charAt(0)}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {checkoutItems.map((item) => {
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.selectedColor && (
                            <p className="text-gray-500">Color: {item.selectedColor}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-gray-500">Size: {item.selectedSize}</p>
                          )}
                          <p className="text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="font-medium">$ {(price * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-4">Discount code</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black"
                  />
                  <button 
                    onClick={applyDiscount}
                    className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">$ {shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">$ {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Replace the existing checkout button with this */}
                <button 
                  onClick={() => {
                    const errors = validateCheckout();
                    if (errors.length === 0) {
                      router.push('/checkout/success');
                    } else {
                      // Store errors in session storage to show them on the failed page
                      sessionStorage.setItem('checkoutErrors', JSON.stringify(errors));
                      router.push('/checkout/failed');
                    }
                  }}
                  className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors mt-6"
                >
                  Checkout
                </button>
                
                <div className="text-center mt-4">
                  <Link href="/products" className="text-sm text-gray-600 hover:text-gray-800">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer/>
    </div>
  )
}