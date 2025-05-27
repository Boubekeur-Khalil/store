"use client"
import { notFound } from 'next/navigation'
import Image from "next/image"
import { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import Newsletter from "@/components/section/newsletter"
import ProductHeader from "@/components/section/header"
import { useState, useEffect } from "react"
import Footer from '@/components/product/footer'
import { ProductIcons } from './icons'
import { ProductImages } from './images'
import { useCart } from "@/hooks/use-cart"
import { toast } from 'react-toastify'
import { Product } from '@/lib/types/product'
import { getProducts } from '@/lib/api/api'
import { useReview, useReviews } from "@/hooks/hooks"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeColorIndex, setActiveColorIndex] = useState(0)
  const [activeSizeIndex, setActiveSizeIndex] = useState(0)
  const { addToCart } = useCart()
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  })
  const { submitReview, loading: reviewLoading } = useReview(product?.id || '')
  const { reviews, loading: reviewsLoading } = useReviews(product?.id?.toString() || '')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts()
        const foundProduct = products.find(p => p.slug === resolvedParams.slug)
        setProduct(foundProduct || null)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.slug])

  // Helper function to format details with bold titles
  const formatDetail = (detail: { key: string; value: string }) => {
    return (
      <span key={detail.key}>
        <strong>{detail.key}:</strong> {detail.value}
      </span>
    );
  };

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      ...product,
      quantity: quantity
    })
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={product.images[0]?.image || ProductImages.placeholder}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{product.name} added to cart!</p>
          <p className="text-xs text-gray-500">
            Qty: {quantity}
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitReview(reviewForm)
      toast.success('Review submitted successfully!')
      setReviewForm({
        name: '',
        email: '',
        rating: 5,
        comment: ''
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review'
      toast.error(errorMessage)
    }
  }
  
  if (loading) {
    return <div className="text-center mt-16">Loading product...</div>
  }

  if (!product) {
    return notFound()
  }

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
              {product.images.length > 0 ? (
                <div className="flex flex-col gap-2 w-1/4 h-full justify-between">
                  {product.images.slice(0, 3).map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden h-[32%]">
                      <Image
                        src={image.image}
                        alt={image.alt_text}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              
              {/* Main Image - On the right */}
              <div className={`rounded-xl overflow-hidden ${product.images.length > 0 ? 'w-3/4' : 'w-full'} h-full`}>
                <Image
                  src={product.images[0]?.image || ProductImages.placeholder}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => window.open('http://localhost:5173/', '_blank')}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                View in VR
              </Button>
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
                    {ProductIcons.star(i < Math.floor(parseFloat(product.average_rating)))}
                  </span>
                ))}
                <span className="ml-1 text-base">{product.average_rating}</span>
              </div>
              <span className="text-sm text-gray-500 ml-3">{product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-5">
              <span className="text-3xl font-medium mr-4">{product.current_price}</span>
              {product.is_sale && (
                <>
                  <span className="text-3xl text-gray-400 font-sm line-through mr-3">{product.price}</span>
                  <span className="ml-2 flex items-center justify-center bg-red-100 text-red-600 text-sm font-medium px-3 py-1.5 rounded-full">
                    {Math.round((1 - parseFloat(product.current_price) / parseFloat(product.price)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div 
              className="text-gray-600 mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Color Options */}
            {product.attributes.find(attr => attr.name.toLowerCase() === 'color') && (
              <div className="mb-8">
                <div className="font-medium mb-4">Choose Color</div>
                <div className="flex gap-3">
                  {product.attributes
                    .find(attr => attr.name.toLowerCase() === 'color')
                    ?.values.map((color, index) => (
                      <button
                        key={color.id}
                        className={`cursor-pointer w-8 h-8 rounded-full ${index === activeColorIndex ? "ring-2 ring-black ring-offset-2" : ""}`}
                        style={{ backgroundColor: color.color_code }}
                        onClick={() => setActiveColorIndex(index)}
                        aria-label={`Select ${color.value} color`}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {product.attributes.find(attr => attr.name.toLowerCase() === 'size') && (
              <div className="mb-8">
                <div className="font-medium mb-4">Choose Size</div>
                <div className="flex gap-3">
                  {product.attributes
                    .find(attr => attr.name.toLowerCase() === 'size')
                    ?.values.map((size, index) => (
                      <button
                        key={size.id}
                        className={`cursor-pointer px-4 h-12 rounded-lg border ${
                          index === activeSizeIndex
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-200"
                        }`}
                        onClick={() => setActiveSizeIndex(index)}
                      >
                        {size.value}
                      </button>
                    ))}
                </div>
              </div>
            )}

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
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="w-full mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b mb-5 bg-transparent">
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                Ratings & Reviews
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              >
                FAQs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail) => (
                  <li key={detail.id}>{formatDetail(detail)}</li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    All Reviews <span className="text-gray-500">({product.reviews})</span>
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Write a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={reviewForm.email}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comment">Comment</Label>
                          <Textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                            required
                            rows={4}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={reviewLoading}>
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="text-center py-4">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No reviews yet. Be the first to review!</div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{review.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.created_at || '').toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < review.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faqs">
              <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {product.faqs.map((faq) => (
                  <div key={faq.id} className="mb-4">
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
          Related Products
        </h2>
        <ProductGrid />
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}