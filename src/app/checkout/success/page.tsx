"use client"

import Link from 'next/link'
import ProductHeader from "@/components/section/header"
import Footer from "@/components/product/footer"

export default function OrderSuccessPage() {
  return (
    <div>
      <ProductHeader />
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="w-[160.925px] h-[159.727px] px-[9px] py-[19px] mx-auto mb-6 flex items-center justify-center gap-[10px]">
                <img src="/images/Vector1.png" className="w-full h-full object-contain"/>
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank you for shopping!</h1>
            <p className="text-gray-600 mb-8">
              Your order has been successfully placed and is now being processed.
            </p>
            <div className="space-y-4">
              <Link 
                href="/products"
                className="block w-full py-3 px-4 text-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                className="block w-full py-3 px-4 text-center border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                Track order
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}