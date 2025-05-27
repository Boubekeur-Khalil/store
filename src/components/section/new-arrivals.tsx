import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import { LandingPageConstants } from "@/utils/constants"

export default function NewArrivals() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center">
        <p className="text-[48px]">{LandingPageConstants.newArrivalsTitle}</p>
      </h2>
      <ProductGrid />
      <div className="text-center mt-8">
        <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-[62px] w-[218px] h-[52px] text-[16px]">
          <Link href="/products">{LandingPageConstants.viewAllText}</Link>
        </Button>
      </div>
    </section>
  )
} 