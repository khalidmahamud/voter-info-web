'use client'

import { Header } from '@/components/layout/header'
import { VoterCharts } from '@/components/charts/voter-charts'
import { useWardData } from '@/hooks/use-voter-data'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface WardStatsPageProps {
  wardNo: number
}

export function WardStatsPage({ wardNo }: WardStatsPageProps) {
  const { stats, wardName, loading, error } = useWardData(wardNo)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="text-lg text-gray-600">Loading statistics...</p>
              <p className="text-sm text-gray-500">পরিসংখ্যান লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
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

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header wardName={wardName ?? undefined} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4">
          <Link href={`/ward/${wardNo}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              পরিসংখ্যান ও বিশ্লেষণ
            </h1>
            <p className="text-sm text-gray-600">
              {wardName ? `${wardName} • ` : ''}Statistics & Analysis
            </p>
          </div>
        </div>

        {/* Charts and Visualizations */}
        <VoterCharts stats={stats} />
      </main>

      {/* Footer */}
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
