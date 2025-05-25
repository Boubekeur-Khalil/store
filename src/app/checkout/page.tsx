"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductHeader from "@/components/section/header"
import Footer from "@/components/product/footer"
import Newsletter from '@/components/section/newsletter'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCheckout, useWilayas } from '@/hooks/hooks'
import { CheckoutRequest } from '@/lib/types/checkout'
import { ApiException } from '@/lib/api/api'

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
  slug?: string
  description?: string
  image?: string
}

type ValidationError = {
  field: string;
  message: string;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [discountCode, setDiscountCode] = useState('ZJ3OOFF')
  const [email, setEmail] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [personalInfo, setPersonalInfo] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    wilaya_id: 0,
    address: '',
    notes: ''
  })
  const router = useRouter()
  const { submitCheckout, loading } = useCheckout()
  const { wilayas, loading: wilayasLoading, error: wilayasError } = useWilayas()

  useEffect(() => {
    // Retrieve items from session storage on component mount
    const storedItems = sessionStorage.getItem('checkoutItems')
    if (storedItems) {
      setCheckoutItems(JSON.parse(storedItems))
    }
  }, [])

  useEffect(() => {
    // Check form validity whenever personalInfo changes
    const errors = validateCheckout();
    const errorMap: Record<string, string> = {};
    errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    setFieldErrors(errorMap);
    setIsFormValid(errors.length === 0 && checkoutItems.length > 0);
  }, [personalInfo, checkoutItems]);

  // Calculate cart totals based on actual items
  const calculateSubtotal = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return total + (price * (item.quantity || 1))
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shippingFee = 15.00
  const tax = 1.29
  const total = subtotal + shippingFee + tax

  const validateCheckout = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!personalInfo.customer_name.trim()) {
      errors.push({ field: 'customer_name', message: 'Full name is required' });
    }

    // Phone number validation
    const phoneRegex = /^\+213[1-9]\d{8}$/;
    if (!personalInfo.customer_phone.trim()) {
      errors.push({ field: 'customer_phone', message: 'Phone number is required' });
    } else if (!phoneRegex.test(personalInfo.customer_phone.trim())) {
      errors.push({ field: 'customer_phone', message: 'Phone number must be in format +213XXXXXXXXX (no leading 0 after +213)' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!personalInfo.customer_email.trim()) {
      errors.push({ field: 'customer_email', message: 'Email is required' });
    } else if (!emailRegex.test(personalInfo.customer_email.trim())) {
      errors.push({ field: 'customer_email', message: 'Please enter a valid email address' });
    }

    if (!personalInfo.address.trim()) {
      errors.push({ field: 'address', message: 'Address is required' });
    }
    if (!personalInfo.wilaya_id) {
      errors.push({ field: 'wilaya_id', message: 'Wilaya is required' });
    }

    return errors;
  }

  const handleCheckout = async () => {
    const errors = validateCheckout();
    if (errors.length > 0) {
      sessionStorage.setItem('checkoutErrors', JSON.stringify(errors));
      router.push('/checkout/failed');
      return;
    }

    try {
      // Ensure we have valid product IDs and convert them to numbers
      const validItems = checkoutItems.filter(item => {
        const productId = Number(item.id);
        return !isNaN(productId) && productId > 0;
      });

      if (validItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      const checkoutData: CheckoutRequest = {
        customer_name: personalInfo.customer_name.trim(),
        customer_email: personalInfo.customer_email.trim(),
        customer_phone: personalInfo.customer_phone.trim(),
        wilaya_id: Number(personalInfo.wilaya_id),
        address: personalInfo.address.trim(),
        notes: personalInfo.notes?.trim() || '',
        items: validItems.map(item => ({
          product_id: Number(item.id),
          quantity: Number(item.quantity || 1)
        }))
      };

      console.log('Submitting checkout data:', JSON.stringify(checkoutData, null, 2));
      await submitCheckout(checkoutData);
      router.push('/checkout/success');
    } catch (err) {
      console.error('Checkout failed:', err);
      
      let errorMessages: ValidationError[] = [];
      
      if (err instanceof ApiException) {
        if (err.errors) {
          // Convert API validation errors to our format
          errorMessages = Object.entries(err.errors).map(([field, messages]) => ({
            field,
            message: messages[0] // Take the first error message for each field
          }));
        } else {
          errorMessages = [{
            field: 'general',
            message: err.message
          }];
        }
      } else {
        errorMessages = [{
          field: 'general',
          message: err instanceof Error ? err.message : 'Failed to process checkout'
        }];
      }

      sessionStorage.setItem('checkoutErrors', JSON.stringify(errorMessages));
      router.push('/checkout/failed');
    }
  }

  // Newsletter form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
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

          {/* Right side - Order Summary */}
          <div className="lg:col-span-4">
            <div className=" w-[341px] h-[686px] top-[213px] left-[1075px] bg-white rounded-[16px] border border-gray-200 p-[32px_21px] space-y-[25px]">
              <div>
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
                    onClick={() => {}}
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
                  {loading ? 'Processing...' : !isFormValid ? 'Please fill all required fields correctly' : 'Checkout'}
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