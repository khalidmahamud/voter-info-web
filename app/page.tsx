'use client'

import { useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { StatsCards } from '@/components/stats/stats-cards'
import { SearchBar } from '@/components/search/search-bar'
import { FilterPanel } from '@/components/search/filter-panel'
import { ActiveFilters } from '@/components/search/active-filters'
import { VoterTable } from '@/components/table/voter-table'
import { ExportButton } from '@/components/table/export-button'
import { useVoterData } from '@/hooks/use-voter-data'
import { useFilterStore } from '@/store/filter-store'
import { createSearchIndex, searchVoters } from '@/lib/search'
import {
  getAllVoters,
  filterByGender,
  filterByOccupation,
} from '@/lib/data'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Loader2, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { data, stats, loading, error } = useVoterData()
  const { gender, selectedOccupations, searchQuery } = useFilterStore()

  // Create search index
  const searchIndex = useMemo(() => {
    if (!data) return null
    const allVoters = getAllVoters(data)
    return createSearchIndex(allVoters)
  }, [data])

  // Apply filters and search
  const filteredVoters = useMemo(() => {
    if (!data) return []

    let result = filterByGender(data, gender)

    // Apply occupation filter
    if (selectedOccupations.length > 0) {
      result = filterByOccupation(result, selectedOccupations)
    }

    // Apply search if query is valid
    if (searchQuery && searchQuery.trim().length >= 2 && searchIndex) {
      const searchResults = searchVoters(searchIndex, searchQuery)
      const searchedIds = new Set(searchResults.map(r => r.item.voter_no))
      result = result.filter(voter => searchedIds.has(voter.voter_no))
    }

    return result
  }, [data, gender, selectedOccupations, searchQuery, searchIndex])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-12" />
          <Skeleton className="h-32" />
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="text-lg text-gray-600">Loading voter data...</p>
              <p className="text-sm text-gray-500">ভোটার তথ্য লোড হচ্ছে...</p>
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
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Link to Statistics Page */}
        <div className="flex justify-center">
          <Link href="/stats">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-800">
                পরিসংখ্যান ও বিশ্লেষণ • View Stats
              </span>
            </div>
          </Link>
        </div>

        {/* Search and Filter Panel */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <SearchBar />
          <FilterPanel stats={stats} />
        </div>

        {/* Active Filters */}
        <ActiveFilters />

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results: {filteredVoters.length} voters
            </h2>
            <p className="text-sm text-gray-600">
              ফলাফল: {filteredVoters.length} জন ভোটার
            </p>
          </div>
          <ExportButton data={filteredVoters} />
        </div>

        {/* Voter Table */}
        <VoterTable data={filteredVoters} />
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
  );
}
