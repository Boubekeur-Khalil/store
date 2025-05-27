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
      <section className="w-full h-[178px] mt-[200px] rounded-[20px] bg-black mx-[24px] text-white py-9 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h3 className={`${outfit.className} w-[551px] h-[94px] text-[40px] leading-[45px] font-black tracking-normal mb-6 md:mb-0 -ml-[50px]`}>
            STAY UP TO DATE ABOUT
            <br />
            OUR LATEST OFFERS
          </h3>

          <form className="w-full max-w-md space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                className="pl-10 h-12 rounded-full bg-white text-black"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-full bg-white text-black hover:bg-gray-100">
              <span className="font-bold">Subscribe to Newsletter</span>
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
