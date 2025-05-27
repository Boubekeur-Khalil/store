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
  const [appliedDiscount, setAppliedDiscount] = useState(false)
  const [email, setEmail] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const { submitCheckout, loading, error } = useCheckout()
  const { wilayas, loading: wilayasLoading } = useWilayas()
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    wilaya: '',
    email: ''
  })
  const [wilayaId, setWilayaId] = useState<number>(1)
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
  const shippingFee = 15.00 // Fixed shipping fee (was incorrectly 1500)
  const tax = 1.29 // Fixed tax amount (was incorrectly 129)
  const total = subtotal + shippingFee + tax

  const applyDiscount = () => {
    // Fixed discount code comparison
    if (discountCode === 'ZJ3OOFF') {
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
    } else {
      // Validate Algerian phone number format with +213
      const phoneRegex = /^\+213[5-7][0-9]{8}$/;
      const cleanNumber = personalInfo.phoneNumber.replace(/\s/g, '');
      if (!phoneRegex.test(cleanNumber)) {
        errors.push({ 
          field: 'phoneNumber', 
          message: 'Please enter a valid Algerian phone number (e.g., +213 5XX XX XX XX)' 
        });
      }
    }
    if (!personalInfo.streetAddress.trim()) {
      errors.push({ field: 'streetAddress', message: 'Street address is required' });
    }
    if (!personalInfo.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    }

    return errors;
  }

  // Newsletter form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    // Add your newsletter subscription logic here
  }

  // Newsletter form handler for the checkout page newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', newsletterEmail)
    // Add your newsletter subscription logic here
    // You might want to show a success message or clear the form
    setNewsletterEmail('')
    alert('Thank you for subscribing to our newsletter!')
  }

  return (
    <div className="relative overflow-x-hidden">
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
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={personalInfo.phoneNumber}
                    onChange={(e) => {
                      // Remove any non-digit characters except + and spaces
                      let value = e.target.value.replace(/[^\d\s+]/g, '');
                      
                      // Ensure +213 is at the start
                      if (!value.startsWith('+213')) {
                        if (value.startsWith('+')) {
                          value = '+213' + value.substring(1);
                        } else if (value.startsWith('213')) {
                          value = '+' + value;
                        } else if (value.startsWith('0')) {
                          value = '+213' + value.substring(1);
                        } else {
                          value = '+213' + value;
                        }
                      }
                      
                      // Format the number as user types (add spaces after +213)
                      const formattedValue = value.replace(/(\+213)(\d{2})(?=\d)/g, '$1 $2');
                      setPersonalInfo(prev => ({ ...prev, phoneNumber: formattedValue }));
                    }}
                    placeholder="+213 5XX XX XX XX"
                    maxLength={15} // +213 + 9 digits + 2 spaces
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black" 
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: +213 5XX XX XX XX</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <input 
                    type="email" 
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
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
                <div>
                  <label className="block text-sm font-bold mb-1">Wilaya</label>
                  <select
                    value={wilayaId}
                    onChange={(e) => setWilayaId(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black"
                    required
                  >
                    {wilayasLoading ? (
                      <option value="">Loading wilayas...</option>
                    ) : (
                      wilayas.map((wilaya) => (
                        <option key={wilaya.id} value={wilaya.id}>
                          {wilaya.name}
                        </option>
                      ))
                    )}
                  </select>
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
                
                <button 
                  onClick={async () => {
                    const errors = validateCheckout();
                    if (errors.length === 0) {
                      try {
                        const checkoutData = {
                          customer_name: personalInfo.fullName,
                          customer_email: personalInfo.email,
                          customer_phone: personalInfo.phoneNumber.replace(/\s/g, ''), // Remove spaces for API
                          wilaya_id: wilayaId,
                          address: personalInfo.streetAddress,
                          items: checkoutItems.map(item => ({
                            product_id: parseInt(item.id),
                            quantity: item.quantity || 1
                          })),
                          notes: appliedDiscount ? `Discount Code: ${discountCode}` : ''
                        };
                        
                        await submitCheckout(checkoutData);
                        router.push('/checkout/success');
                      } catch {
                        sessionStorage.setItem('checkoutErrors', JSON.stringify([{ field: 'general', message: error || 'Failed to process checkout' }]));
                        router.push('/checkout/failed');
                      }
                    } else {
                      sessionStorage.setItem('checkoutErrors', JSON.stringify(errors));
                      router.push('/checkout/failed');
                    }
                  }}
                  disabled={loading}
                  className={`w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : 'Checkout'}
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

      {/* Newsletter Section - Full Width */}
      <section className="relative w-screen overflow-hidden bg-white" style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
        <div className="px-6 py-12 md:py-16">
          <div className="relative flex flex-col items-center">
            {/* Left Model */}
            <div className="absolute left-50 bottom-0 hidden lg:block" style={{ maxHeight: '300px', opacity: '0.8' }}>
              <Image
                src="/images/male-model.png"
                alt="Male model in mustard coat"
                width={150}
                height={300}
                className="object-contain"
                priority
              />
            </div>

            {/* Right Model */}
            <div className="absolute right-50 bottom-0 hidden lg:block" style={{ maxHeight: '300px', opacity: '0.8' }}>
              <Image
                src="/images/female-model.png"
                alt="Female model in gray blazer"
                width={150}
                height={300}
                className="object-contain"
                priority
              />
            </div>

            {/* Center Content */}
            <div className="relative z-10 text-center max-w-xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight">
                Stay Updated with Our Latest Offers
              </h2>

              <p className="text-gray-600 text-sm font-medium md:text-base leading-relaxed mb-6 max-w-md mx-auto">
                Get exclusive deals, new arrivals, and fashion tips delivered straight to your inbox. Don't miss out on special promotions!
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="relative max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-4 py-3 text-left text-gray-700 bg-white border border-gray-300 rounded-full focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 text-base placeholder:text-gray-400 shadow-sm transition-all duration-200 box-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
                >
                  Subscribe Now
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
            
      <Footer/>
    </div>
  )
}