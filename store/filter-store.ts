import { create } from 'zustand'
import type { Gender } from '@/lib/types'

interface FilterStore {
  // Filter state
  gender: Gender
  selectedOccupations: string[]
  searchQuery: string
  addressFilter: string
  birthYearRange: [number, number] | null

  // Pagination
  pageIndex: number
  pageSize: number

  // Column visibility
  hiddenColumns: Set<string>

  // Actions
  setGender: (gender: Gender) => void
  setSelectedOccupations: (occupations: string[]) => void
  toggleOccupation: (occupation: string) => void
  setSearchQuery: (query: string) => void
  setAddressFilter: (filter: string) => void
  setBirthYearRange: (range: [number, number] | null) => void

  setPageIndex: (index: number) => void
  setPageSize: (size: number) => void

  toggleColumnVisibility: (columnId: string) => void
  resetColumnVisibility: () => void

  clearFilters: () => void
  clearAll: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Initial state
  gender: 'all',
  selectedOccupations: [],
  searchQuery: '',
  addressFilter: '',
  birthYearRange: null,

  pageIndex: 0,
  pageSize: 25,

  hiddenColumns: new Set(),

  // Actions
  setGender: (gender) =>
    set({ gender, pageIndex: 0 }),

  setSelectedOccupations: (occupations) =>
    set({ selectedOccupations: occupations, pageIndex: 0 }),

  toggleOccupation: (occupation) =>
    set((state) => {
      const occupations = new Set(state.selectedOccupations)
      if (occupations.has(occupation)) {
        occupations.delete(occupation)
      } else {
        occupations.add(occupation)
      }
      return { selectedOccupations: Array.from(occupations), pageIndex: 0 }
    }),

  setSearchQuery: (query) =>
    set({ searchQuery: query, pageIndex: 0 }),

  setAddressFilter: (filter) =>
    set({ addressFilter: filter, pageIndex: 0 }),

  setBirthYearRange: (range) =>
    set({ birthYearRange: range, pageIndex: 0 }),

  setPageIndex: (index) =>
    set({ pageIndex: index }),

  setPageSize: (size) =>
    set({ pageSize: size, pageIndex: 0 }),

  toggleColumnVisibility: (columnId) =>
    set((state) => {
      const hidden = new Set(state.hiddenColumns)
      if (hidden.has(columnId)) {
        hidden.delete(columnId)
      } else {
        hidden.add(columnId)
      }
      return { hiddenColumns: hidden }
    }),

  resetColumnVisibility: () =>
    set({ hiddenColumns: new Set() }),

  clearFilters: () =>
    set({
      gender: 'all',
      selectedOccupations: [],
      addressFilter: '',
      birthYearRange: null,
      pageIndex: 0,
    }),

  clearAll: () =>
    set({
      gender: 'all',
      selectedOccupations: [],
      searchQuery: '',
      addressFilter: '',
      birthYearRange: null,
      pageIndex: 0,
      pageSize: 25,
      hiddenColumns: new Set(),
    }),
}))
