import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import TestimonialSlider from "@/components/product/testimonial-slider"
import Newsletter from "@/components/product/newsletter"
import ProductHeader from "@/components/product/header"
import Footer from "@/components/product/footer"
import { ProductConstants } from "../utils/constants"
import { ProductImages } from "./products/[slug]/images"
import { products } from "@/lib/products/products"
import CountUp from "@/components/common/CountUp"

export default function Home() {
  /*// Get first 4 products for each section
  const newArrivals = products.slice(0, 4)
  const topSelling = products.slice(4, 8)
*/
  return (
    <div className="flex flex-col min-h-screen">
      <ProductHeader />
      
      {/* Hero Banner */}
      <div 
        className="w-full h-[529px] bg-gray-900 relative flex items-start p-10"
        style={{ 
          backgroundImage: `url(${ProductImages.heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            {ProductConstants.heroTitle}
          </h1>
          <p className="text-sm leading-relaxed mb-6">
            {ProductConstants.heroDescription}
          </p>
          <Button asChild className="rounded-full bg-white text-black hover:bg-gray-100 w-[218px] h-[52px] text-[16px]">
            <Link href="/products">{ProductConstants.shopNowText}</Link>
          </Button>

          <div className="flex gap-10 mt-20">
            {ProductConstants.stats.map((stat, index) => {
              // Extract numeric value by removing non-digit characters
              const numericValue = parseInt(stat.value.replace(/\D/g, ''));
              
              return (
                <div key={index}>
                  <div className="text-4xl font-bold mb-1">
                    <CountUp 
                      from={0} 
                      to={numericValue} 
                      duration={2.5} 
                      delay={0.5} 
                    />
                    {stat.value.includes('+') ? '+' : ''}
                  </div>
                  <div className="text-xs opacity-80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="w-full h-[122px] bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
        <p className="text-[48px]">{ProductConstants.announcementText}</p>
      </div>

      {/* New Arrivals Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center">
          <p className="text-[48px]">{ProductConstants.newArrivalsTitle}</p>
        </h2>
        <ProductGrid />
        <div className="text-center mt-8">
          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-[62px] w-[218px] h-[52px] text-[16px]">
            <Link href="/products">{ProductConstants.viewAllText}</Link>
          </Button>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {ProductConstants.topSellingTitle}
        </h2>
        <ProductGrid/>
        <div className="text-center mt-8">
          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-[62px] w-[218px] h-[52px] text-[16px]">
            <Link href="/products">{ProductConstants.viewAllText}</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-[48px] font-bold px-4 mb-8">
          {ProductConstants.happyCustomersTitle}
        </h2>
        <TestimonialSlider />
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}