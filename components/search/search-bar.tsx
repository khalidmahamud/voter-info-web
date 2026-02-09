'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filter-store'

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localQuery)
    }, 300)

    return () => clearTimeout(timeout)
  }, [localQuery, setSearchQuery])

  // Sync with store
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="নাম, ভোটার নম্বর, বা ঠিকানা দিয়ে খুঁজুন... (Search by name, voter ID, or address)"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocalQuery('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {localQuery && localQuery.length > 0 && localQuery.length < 2 && (
        <p className="text-sm text-gray-500 mt-1">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  )
}
