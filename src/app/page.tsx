import Header from "@/components/section/header"
import Newsletter from "@/components/section/newsletter"
import Footer from "@/components/product/footer"
import HeroBanner from "@/components/section/hero-banner"
import AnnouncementBar from "@/components/section/announcement-bar"
import NewArrivals from "@/components/section/new-arrivals"
import TopSelling from "@/components/section/top-selling"
import Testimonials from "@/components/section/testimonials"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeroBanner />
      <AnnouncementBar />
      <NewArrivals />
      <TopSelling />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}