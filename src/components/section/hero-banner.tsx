import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingPageConstants } from "@/utils/constants"
import { ProductImages } from "@/app/products/[slug]/images"

export default function HeroBanner() {
  return (
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
          {LandingPageConstants.heroTitle}
        </h1>
        <p className="text-sm leading-relaxed mb-6">
          {LandingPageConstants.heroDescription}
        </p>
        <Button asChild className="rounded-full bg-white text-black hover:bg-gray-100">
          <Link href="/products">{LandingPageConstants.shopNowText}</Link>
        </Button>

        <div className="flex gap-10 mt-20">
          {LandingPageConstants.stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 