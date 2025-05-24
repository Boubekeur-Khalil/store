import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import localFont from 'next/font/local'

const outfit = localFont({
  src: '../../../public/fonts/Outfit-Black.ttf',
  variable: '--font-outfit'
})

export default function Newsletter() {
  return (
    <div className="flex justify-center w-full">
      <section className="w-[1392px] h-[178px] mt-[200px] bg-black text-white py-9 px-16 rounded-[50px] mr-10 ml-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className={`${outfit.className} w-[551px] h-[94px] text-[40px] leading-[45px] font-black tracking-normal mb-6 md:mb-0`}>
            STAY UP TO DATE ABOUT
            <br />
            OUR LATEST OFFERS
          </h3>

          <form className="w-full max-w-md space-y-3">
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" 
                size={20} 
                color="black" 
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
              />
              <Input
                type="email"
                placeholder="Enter your email address"
                className="pl-12 h-12 rounded-full bg-white text-black"
                required
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-full h-12 rounded-full bg-white text-black hover:bg-gray-100 cursor-pointer">
                <span className="font-bold">Subscribe to Newsletter</span>
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
