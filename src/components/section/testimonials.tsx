import TestimonialSlider from "@/components/product/testimonial-slider"
import { LandingPageConstants } from "@/utils/constants"

export default function Testimonials() {
  return (
    <section className="py-12 px-4 bg-white">
      <h2 className="text-[48px] font-bold px-4 mb-8">
        {LandingPageConstants.happyCustomersTitle}
      </h2>
      <TestimonialSlider />
    </section>
  )
} 