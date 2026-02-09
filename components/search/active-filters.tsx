'use client'

import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useFilterStore } from '@/store/filter-store'

export function ActiveFilters() {
  const {
    gender,
    selectedOccupations,
    searchQuery,
    setGender,
    toggleOccupation,
    setSearchQuery,
  } = useFilterStore()

  const activeFilters = []

  if (gender !== 'all') {
    activeFilters.push({
      type: 'gender',
      label: gender === 'male' ? 'পুরুষ (Male)' : 'মহিলা (Female)',
      onRemove: () => setGender('all'),
    })
  }

  if (searchQuery && searchQuery.length >= 2) {
    activeFilters.push({
      type: 'search',
      label: `Search: "${searchQuery}"`,
      onRemove: () => setSearchQuery(''),
    })
  }

  selectedOccupations.forEach((occupation) => {
    activeFilters.push({
      type: 'occupation',
      label: occupation,
      onRemove: () => toggleOccupation(occupation),
    })
  })

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${index}`}
          variant="secondary"
          className="gap-2 pr-1 pl-3 py-1.5"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
