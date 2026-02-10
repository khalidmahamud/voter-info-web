'use client'

import { useAllWardsData } from '@/hooks/use-voter-data'
import { Header } from '@/components/layout/header'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Loader2, Users, MapPin } from 'lucide-react'
import Link from 'next/link'

export function WardSelection() {
  const { wardList, loading, error } = useAllWardsData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="text-lg text-gray-600">Loading wards...</p>
              <p className="text-sm text-gray-500">ওয়ার্ড লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-4 bg-red-100 rounded-full inline-block">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Failed to Load Data</h2>
              <p className="text-gray-600">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            ওয়ার্ড নির্বাচন করুন
          </h2>
          <p className="text-gray-600">Select a Ward</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {wardList.map((ward) => (
            <Link key={ward.wardNo} href={`/ward/${ward.wardNo}`}>
              <div className="group p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
                    Ward {ward.wardNo}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {ward.wardName}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{ward.totalVoters} voters</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            ভোটার তথ্য সিস্টেম • Voter Information System
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}
