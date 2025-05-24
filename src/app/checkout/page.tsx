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
              <h2 className="text-base font-medium mb-4 border-b border-gray-200 pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div>
                  <label className="block text-sm font-bold mb-1">Full name</label>
                  <input 
                    type="text" 
                    value={personalInfo.customer_name}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, customer_name: e.target.value }))}
                    className={`w-full p-3 border ${fieldErrors.customer_name ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-black focus:border-black`}
                    required
                  />
                  {fieldErrors.customer_name && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.customer_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={personalInfo.customer_phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, customer_phone: e.target.value }))}
                    className={`w-full p-3 border ${fieldErrors.customer_phone ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-black focus:border-black`}
                    required
                  />
                  {fieldErrors.customer_phone && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.customer_phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <input 
                    type="email" 
                    value={personalInfo.customer_email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, customer_email: e.target.value }))}
                    className={`w-full p-3 border ${fieldErrors.customer_email ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-black focus:border-black`}
                    required
                  />
                  {fieldErrors.customer_email && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.customer_email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Wilaya</label>
                  <select
                    value={personalInfo.wilaya_id}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, wilaya_id: parseInt(e.target.value) }))}
                    className={`w-full p-3 border ${fieldErrors.wilaya_id ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-black focus:border-black`}
                    required
                    disabled={wilayasLoading}
                  >
                    <option value="">Select Wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.wilaya_id && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.wilaya_id}</p>
                  )}
                  {wilayasError && (
                    <p className="text-red-500 text-sm mt-1">Failed to load wilayas. Please try again.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-base font-medium mb-4 border-b border-gray-200 pb-2">Shipping address</h2>
              <div className="space-y-4 my-8">
                <div>
                  <label className="block text-sm font-bold mb-1">Address</label>
                  <input 
                    type="text" 
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full p-3 border ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-black focus:border-black`}
                    required
                  />
                  {fieldErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Notes (Optional)</label>
                  <textarea
                    value={personalInfo.notes}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="relative w-full py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
              <div className="container mx-auto px-4 md:px-6">
                <div className="relative flex items-center justify-center min-h-[600px]">
                  {/* Left Model */}
                  <div className="absolute left-0 top-0 hidden lg:block">
                    <Image
                      src="/images/male-model.png"
                      alt="Male model in mustard coat"
                      width={300}
                      height={600}
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Right Model */}
                  <div className="absolute right-0 top-0 hidden lg:block">
                    <Image
                      src="/images/female-model.png"
                      alt="Female model in gray blazer"
                      width={300}
                      height={600}
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Center Content */}
                  <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-8 tracking-tight">
                      Subscribe To Our Newsletter
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-12 max-w-xl mx-auto">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam
                      sem. Scelerisque duis ultrices sollicitudin
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="relative max-w-md mx-auto">
                        <Input
                          type="email"
                          placeholder="michael@ymail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-6 py-4 text-left text-gray-500 bg-white border-0 border-b-2 border-gray-200 rounded-full focus:border-gray-400 focus:ring-0 text-lg placeholder:text-gray-400 shadow-[0_20px_25px_rgba(0,0,0,0.1)]"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white px-14 py-5 rounded-full text-lg font-medium transition-colors duration-200 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                      >
                        Subscribe Now
                      </Button>
                    </form>
                  </div>
                </div>
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
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading || !isFormValid}
                  className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors mt-6 disabled:bg-gray-400"
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