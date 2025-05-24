"use client"
import { notFound } from 'next/navigation'
import Image from "next/image"
import { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import Newsletter from "@/components/product/newsletter"
import ProductHeader from "@/components/product/header"
import { products } from "@/lib/products/products"
import { useState } from "react"
import Footer from '@/components/product/footer'
import { ProductConstants } from '../../../utils/constants'
import { ProductIcons } from './icons'
import { ProductImages } from './images'
import { useCart } from "@/hooks/use-cart"
import { toast } from 'react-toastify'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const product = products.find(p => p.slug === resolvedParams.slug)
  const { addToCart } = useCart()

  // Helper function to format details with bold titles
  const formatDetail = (detail: string) => {
    const titlesToFormat = [
      "Resolution", "Refresh Rate", "Panel Type", "Response Time", 
      "Connectivity", "Features", "Dimensions", "Weight",
      "Screen Size", "Color", "Material", "Storage", "Battery",
      "Built-in Speakers", "Eye Care Technology", "Color Gamut",
      "Brightness", "VESA Mount Compatible", "Adaptive Sync",
      "RGB Lighting", "Gaming Features"
    ];
    
    for (const title of titlesToFormat) {
      if (detail.startsWith(`${title}:`)) {
        return (
          <span key={detail}>
            <strong>{title}:</strong>{detail.substring(title.length + 1)}
          </span>
        );
      }
    }
    
    return <span key={detail}>{detail}</span>;
  };

  const handleAddToCart = () => {
    if (!product) return
    
    const selectedColor = product.colors[activeColorIndex]?.name
    const selectedSize = product.sizes[activeSizeIndex]?.name

    addToCart({
      ...product,
      quantity: quantity,
      selectedColor,
      selectedSize
    })
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={productImages.main}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{product.name} added to cart!</p>
          <p className="text-xs text-gray-500">
            {selectedSize} • {selectedColor} • Qty: {quantity}
          </p>
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
  
  if (!product) {
    return notFound()
  }

  // Get product images from images.ts
  const productImages = ProductImages.products[product.slug as keyof typeof ProductImages.products] || {
    main: ProductImages.placeholder,
    gallery: []
  }

  const [quantity, setQuantity] = useState(ProductConstants.defaultQuantity)
  const [activeColorIndex, setActiveColorIndex] = useState(
    product.colors.findIndex(color => color.active)
  )
  const [activeSizeIndex, setActiveSizeIndex] = useState(
    product.sizes.findIndex(size => size.active)
  )

  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1)
  const increaseQuantity = () => setQuantity(quantity + 1)

  return (
    <div className="bg-white">
      <ProductHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 lg:pr-10">
            <div className="flex flex-row gap-4 h-[500px]">
              {/* Image Gallery - Vertical on the left */}
              {productImages.gallery.length > 0 ? (
                <div className="flex flex-col gap-2 w-1/4 h-full justify-between">
                  {productImages.gallery.slice(0, 3).map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden h-[32%]">
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              
              {/* Main Image - On the right */}
              <div className={`rounded-xl overflow-hidden ${productImages.gallery.length > 0 ? 'w-3/4' : 'w-full'} h-full`}>
                <Image
                  src={productImages.main}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 lg:pl-5">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            {/* Stars/Rating moved between title and price */}
            <div className="flex items-center mb-4">
              <div className="stars text-xl">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={`star-${i}`}>
                    {ProductIcons.star(i < Math.floor(product.rating))}
                  </span>
                ))}
                <span className="ml-1 text-base">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500 ml-3">{product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-5">
              <span className="text-3xl font-medium mr-4">{product.price}</span>
              <span className="text-3xl text-gray-400 font-sm line-through mr-3">{product.originalPrice}</span>
              {product.discount && (
                <span className="ml-2 flex items-center justify-center bg-red-100 text-red-600 text-md px-2 py-1 rounded-full w-17">{product.discount}</span>
              )}
            </div>

            <div className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </div>

            {/* Color Options */}
            <div className="mb-8">
              <div className="font-medium mb-4">Choose Color</div>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    className={`cursor-pointer w-8 h-8 rounded-full ${index === activeColorIndex ? "ring-2 ring-black ring-offset-2" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setActiveColorIndex(index)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size Options */}
            <div className="mb-8">
              <div className="font-medium mb-4 ">Choose Size</div>
              <div className="flex gap-3 ">
                {product.sizes.map((size, index) => (
                  <button
                    key={size.name}
                    className={`cursor-pointer w-12 h-12 rounded-lg border  ${
                      index === activeSizeIndex
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-200"
                    }`}
                    onClick={() => setActiveSizeIndex(index)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector and Add to Cart side by side */}
            <div className="flex flex-row gap-4 items-center mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <button
                  className="w-auto h-9 px-3 text-black flex items-center justify-center cursor-pointer"
                  onClick={decreaseQuantity}
                >
                  {ProductIcons.minus}
                </button>
                <div className="mx-3 font-medium">
                  {quantity}
                </div>
                <button
                  className="w-auto h-9 px-3 text-black flex items-center justify-center cursor-pointer"
                  onClick={increaseQuantity}
                >
                  {ProductIcons.plus}
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="flex-1 py-6 rounded-full bg-black hover:bg-gray-800 text-white cursor-pointer"
                onClick={handleAddToCart} 
              >
                {ProductConstants.addToCartText}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Tabs - Now full width */}
        <div className="w-full mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b mb-5 bg-transparent">
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                {ProductConstants.productDetailsTab}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                {ProductConstants.ratingsReviewsTab}
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                {ProductConstants.faqsTab}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <h3 className="text-lg font-medium mb-4">{ProductConstants.productDetailsTab}</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index}>{formatDetail(detail)}</li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    All Reviews <span className="text-gray-500">({product.reviews})</span>
                  </h3>
                  <div className="flex gap-2">
                    {ProductConstants.reviewFilterOptions.map(option => (
                      <Button key={option} variant="outline" size="sm" className="rounded-full">
                        {option}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full">
                      {ProductConstants.writeReviewText}
                    </Button>
                  </div>
                </div>

                {product.reviewList.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="stars text-yellow-400">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="font-medium">{review.name}</span>
                      </div>
                      <div className="text-gray-500 text-sm">Posted on {review.date}</div>
                    </div>
                    <p className="text-gray-600">{review.content}</p>
                  </div>
                ))}

                <Button variant="outline" className="mx-auto block rounded-full border-black">
                  {ProductConstants.loadMoreReviewsText}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="faqs">
              <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {product.faqs.map((faq, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium mb-2">Q: {faq.question}</h4>
                    <p className="text-gray-600">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          {ProductConstants.relatedProductsTitle}
        </h2>
        <ProductGrid />
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}