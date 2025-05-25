import { LandingPageConstants } from "@/utils/constants"

export default function AnnouncementBar() {
  return (
    <div className="w-full h-[122px] bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
      <p className="text-[48px]">{LandingPageConstants.announcementText}</p>
    </div>
  )
} 