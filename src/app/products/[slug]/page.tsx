"use client"
import { notFound } from 'next/navigation'
import Image from "next/image"
import { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import Newsletter from "@/components/section/newsletter"
import ProductHeader from "@/components/section/header"
import { useState } from "react"
import Footer from '@/components/product/footer'
import { LandingPageConstants } from '../../../utils/constants'
import { ProductIcons } from './icons'
import { useCart } from "@/hooks/use-cart"
import { useProducts, useReviews } from "@/hooks/hooks"
import { useReview } from "@/hooks/hooks"
import { ReviewRequest } from "@/lib/types/review"


export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { products, loading, error } = useProducts()
  const { addToCart } = useCart()
  const product = products.find(p => p.slug === resolvedParams.slug)
  const { submitReview, loading: reviewLoading, error: reviewError } = useReview(product?.id.toString() || '')
  const { reviews, loading: reviewsLoading, error: reviewsError } = useReviews(product?.id.toString() || '')

  const [quantity, setQuantity] = useState(LandingPageConstants.defaultQuantity)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState<ReviewRequest>({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  })

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      ...product,
      quantity,
      selectedVariant: product.variants[selectedVariant]
    })
  }
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (!product) {
    return notFound()
  }

  const primaryImage = product.images.find(img => img.is_primary)?.image || '/placeholder.png'

  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1)
  const increaseQuantity = () => setQuantity(quantity + 1)

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitReview(reviewForm)
      setShowReviewForm(false)
      setReviewForm({
        name: '',
        email: '',
        rating: 5,
        comment: ''
      })
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  return (
    <div className="bg-white">
      <ProductHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 lg:pr-10">
            <div className="rounded-xl overflow-hidden mb-5">
              <Image
                src={primaryImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.filter(img => !img.is_primary).map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <Image
                      src={image.image}
                      alt={image.alt_text}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 lg:pl-5">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="stars text-xl">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={`star-${i}`}>
                    {ProductIcons.star(i < Math.floor(parseFloat(product.average_rating)))}
                  </span>
                ))}
                <span className="ml-1 text-base">{product.average_rating}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-5">{product.reviews} reviews</div>

            <div className="flex items-center mb-5">
              <span className="text-2xl font-bold mr-4">{product.current_price}</span>
              <span className="text-lg text-gray-400 line-through mr-3">{product.price}</span>
              {product.is_sale && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
              )}
            </div>

            <div 
              className="text-gray-600 mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Variants */}
            {product.has_variants && product.variants.length > 0 && (
              <div className="mb-8">
                <div className="font-medium mb-4">Available Variants</div>
                <div className="grid grid-cols-2 gap-4">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      className={`p-4 border rounded-lg ${
                        index === selectedVariant
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      <div className="font-medium">{variant.sku}</div>
                      <div className="text-sm text-gray-500">
                        Price: {variant.final_price}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {variant.stock_quantity}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <button
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={decreaseQuantity}
              >
                {ProductIcons.minus}
              </button>
              <input 
                type="text" 
                className="w-16 h-9 mx-3 text-center border-none" 
                value={quantity} 
                readOnly 
              />
              <button
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={increaseQuantity}
              >
                {ProductIcons.plus}
              </button>
            </div>

            {/* Add to Cart Button */}
            {product.has_variants ? (
              product.variants[selectedVariant]?.stock_quantity > 0 ? (
                <Button
                  className="w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white mb-8 cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {LandingPageConstants.addToCartText}
                </Button>
              ) : (
                <div className="w-full py-6 rounded-full bg-gray-200 text-gray-600 text-center mb-8">
                  Out of Stock
                </div>
              )
            ) : (
              product.stock_quantity > 0 ? (
                <Button
                  className="w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white mb-8 cursor-pointer"
                  onClick={handleAddToCart}
                >
                  {LandingPageConstants.addToCartText}
                </Button>
              ) : (
                <div className="w-full py-6 rounded-full bg-gray-200 text-gray-600 text-center mb-8">
                  Out of Stock
                </div>
              )
            )}

            {/* Product Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start border-b mb-5 bg-transparent">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  {LandingPageConstants.productDetailsTab}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  {LandingPageConstants.ratingsReviewsTab}
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  {LandingPageConstants.faqsTab}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <h3 className="text-lg font-medium mb-4">{LandingPageConstants.productDetailsTab}</h3>
                <ul className="space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail.id}>
                      <span className="font-medium">{detail.key}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      All Reviews <span className="text-gray-500">({reviews.length})</span>
                    </h3>
                    <div className="flex gap-2">
                      {LandingPageConstants.reviewFilterOptions.map(option => (
                        <Button key={option} variant="outline" size="sm" className="rounded-full">
                          {option}
                        </Button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                      >
                        {LandingPageConstants.writeReviewText}
                      </Button>
                    </div>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={reviewForm.email}
                            onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="text-2xl"
                            >
                              {ProductIcons.star(star <= reviewForm.rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Comment</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className="w-full p-2 border rounded-md h-32"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                      {reviewError && (
                        <p className="text-red-500 text-sm">{reviewError}</p>
                      )}
                    </form>
                  )}

                  {reviewsLoading ? (
                    <div className="text-center py-4">Loading reviews...</div>
                  ) : reviewsError ? (
                    <div className="text-center py-4 text-red-500">{reviewsError}</div>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No reviews yet</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{review.name}</h4>
                              <p className="text-sm text-gray-500">{review.email}</p>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-xl">
                                  {ProductIcons.star(i < review.rating)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          {review.created_at && (
                            <p className="text-sm text-gray-400 mt-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {reviews.length > 0 && (
                    <Button variant="outline" className="mx-auto block rounded-full border-black">
                      {LandingPageConstants.loadMoreReviewsText}
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="faqs">
                <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {product.faqs.length > 0 ? (
                    product.faqs.map((faq) => (
                      <div key={faq.id} className="mb-4">
                        <h4 className="font-medium mb-2">Q: {faq.question}</h4>
                        <p className="text-gray-600">A: {faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No FAQs available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          {LandingPageConstants.relatedProductsTitle}
        </h2>
        <ProductGrid />
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}