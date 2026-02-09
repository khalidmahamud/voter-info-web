'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useFilterStore } from '@/store/filter-store'
import { FilterX } from 'lucide-react'
import type { VoterStats } from '@/lib/types'

interface FilterPanelProps {
  stats: VoterStats | null
}

export function FilterPanel({ stats }: FilterPanelProps) {
  const {
    gender,
    selectedOccupations,
    setGender,
    toggleOccupation,
    clearFilters,
  } = useFilterStore()

  const topOccupations = stats?.uniqueOccupations.slice(0, 15) || []

  const hasActiveFilters = gender !== 'all' || selectedOccupations.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
        {/* Gender Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            লিঙ্গ (Gender):
          </label>
          <Select value={gender} onValueChange={(value) => setGender(value as any)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল (All)</SelectItem>
              <SelectItem value="male">পুরুষ (Male)</SelectItem>
              <SelectItem value="female">মহিলা (Female)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2 w-full sm:w-auto"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Occupation Filter */}
      {topOccupations.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            পেশা (Occupation):
          </label>
          <div className="flex flex-wrap gap-2">
            {topOccupations.map((occupation) => {
              const isSelected = selectedOccupations.includes(occupation)
              const count = stats?.occupationCounts[occupation] || 0

              return (
                <Badge
                  key={occupation}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors px-3 py-1.5"
                  onClick={() => toggleOccupation(occupation)}
                >
                  {occupation} ({count})
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
