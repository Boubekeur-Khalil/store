"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { images } from "@/app/products/[slug]/images"
import { icons } from "@/lib/icons"; // adjust path as needed
import Image from "next/image"

export default function Header() {
  const { cart } = useCart()
  
  // Calculate total items in cart
const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0)
  
return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold mr-5">
        <Image 
          src={images.logo} 
          alt="Store Logo" 
          width={100} 
          height={40} 
          className="object-contain"
        />
      </Link>

      

      <div className="flex-grow mx-5 relative hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for products..."
          className="w-full h-[49px] pl-10 rounded-full bg-gray-100 border-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Link href="/cart">
            <Image 
              alt="cart" 
              src={icons.cart} 
              width={18.84} 
              height={18} 
              className="cursor-pointer" 
            />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#B4E907] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
        {/* <User className="h-6 w-6 cursor-pointer" /> */}
      </div>
    </header>
  )
}