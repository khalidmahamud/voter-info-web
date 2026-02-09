import { Users } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b-2 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="p-1.5 md:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex-shrink-0 shadow-sm">
              <Users className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                ভোটার তথ্য সিস্টেম
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <p className="text-[9px] sm:text-[10px] md:text-sm text-gray-600 md:font-medium leading-tight">ধর্মপুর, সীতাকুন্ড</p>
            <p className="text-[8px] sm:text-[9px] md:text-xs text-gray-500 leading-tight">চট্টগ্রাম, বাংলাদেশ</p>
          </div>
        </div>
      </div>
    </header>
  )
}
