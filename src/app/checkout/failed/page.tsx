"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductHeader from "@/components/section/header"
import Footer from "@/components/product/footer"

type ValidationError = {
  field: string;
  message: string;
}

export default function OrderFailedPage() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const storedErrors = sessionStorage.getItem('checkoutErrors');
    if (storedErrors) {
      setErrors(JSON.parse(storedErrors));
      sessionStorage.removeItem('checkoutErrors'); // Clean up after reading
    }
  }, []);

  return (
    <div>
      <ProductHeader />
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            
              <div className="w-[160.925px] h-[159.727px] px-[9px] py-[19px] mx-auto mb-6 flex items-center justify-center gap-[10px]">
                <img src="/images/Vector0.png" className="w-full h-full object-contain"/>
            
            </div>
            <h1 className="text-3xl font-bold mb-4">Oops! There was an issue</h1>
            
            {/* Display specific errors */}
            <div className="text-left bg-red-50 p-4 rounded-lg mb-8">
              <h2 className="font-semibold mb-2">Please fix the following issues:</h2>
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/checkout"
              className="block w-full py-3 px-4 text-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Return to Checkout
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}