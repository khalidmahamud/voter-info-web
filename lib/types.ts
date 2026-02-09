/**
 * TypeScript interfaces for Voter Information System
 * Data structure from voter_data.json
 */

/**
 * Individual voter record
 */
export interface VoterRecord {
  sl_no: string          // Serial number (mixed Bengali/Arabic numerals)
  name: string           // Full name in Bengali
  voter_no: string       // 13-digit voter ID (mixed numerals)
  father_name: string    // Father's name in Bengali
  mother_name: string    // Mother's name in Bengali
  occupation: string     // Occupation in Bengali
  dob: string           // Date of birth DD/MM/YYYY (mixed numerals)
  address: string       // Full address in Bengali
}

/**
 * Root data structure containing male and female voter arrays
 */
export interface VoterData {
  female: VoterRecord[]  // Female voters (1,052 records)
  male: VoterRecord[]    // Male voters (1,253 records)
}

/**
 * Gender type for filtering
 */
export type Gender = 'all' | 'female' | 'male'

/**
 * Filter state for the application
 */
export interface FilterState {
  gender: Gender
  occupation: string[]
  searchQuery: string
  addressFilter: string
  birthYearRange: [number, number] | null
}

/**
 * Search result from Fuse.js
 */
export interface SearchResult {
  item: VoterRecord
  score?: number
  matches?: Array<{
    key: string
    indices: [number, number][]
  }>
}

/**
 * Table column definition
 */
export interface ColumnDef {
  id: string
  header: string
  accessorKey: keyof VoterRecord
  cell?: (row: VoterRecord) => React.ReactNode
  enableSorting?: boolean
  enableHiding?: boolean
}

/**
 * Pagination state
 */
export interface PaginationState {
  pageIndex: number
  pageSize: number
}

/**
 * Sort state
 */
export interface SortState {
  id: string
  desc: boolean
}

/**
 * Statistics for voter data
 */
export interface VoterStats {
  total: number
  male: number
  female: number
  uniqueOccupations: string[]
  occupationCounts: Record<string, number>
  ageDistribution: {
    range: string
    count: number
  }[]
}

/**
 * Export options
 */
export type ExportFormat = 'csv' | 'json'

export interface ExportOptions {
  format: ExportFormat
  includeHeaders: boolean
  filename: string
}
