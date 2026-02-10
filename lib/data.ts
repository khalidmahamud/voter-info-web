import type { VoterData, VoterRecord, VoterStats, AllWardsData, WardVoterData, WardInfo } from './types'
import { bengaliToArabic } from './utils'

/**
 * Load all wards data from public JSON file
 */
export async function loadAllWardsData(): Promise<AllWardsData> {
  try {
    const response = await fetch('/voter_data.json')
    if (!response.ok) {
      throw new Error(`Failed to load voter data: ${response.statusText}`)
    }
    const data = await response.json()

    if (data && Array.isArray(data.wards) && data.wards.length > 0) {
      return data as AllWardsData
    }

    throw new Error('Invalid data format')
  } catch (error) {
    console.error('Error loading voter data:', error)
    throw error
  }
}

/**
 * Get a specific ward's data by ward number
 */
export function getWardData(allData: AllWardsData, wardNo: number): WardVoterData | null {
  return allData.wards.find(w => w.wardNo === wardNo) ?? null
}

/**
 * Get list of ward metadata for selection page
 */
export function getWardList(allData: AllWardsData): (WardInfo & { totalVoters: number })[] {
  return allData.wards.map(w => ({
    wardNo: w.wardNo,
    wardName: w.wardName,
    totalVoters: w.female.length + w.male.length,
  }))
}

/**
 * Combine male and female voters into a single array
 */
export function getAllVoters(data: VoterData): VoterRecord[] {
  return [...data.female, ...data.male]
}

/**
 * Calculate statistics from voter data
 */
export function calculateStats(data: VoterData): VoterStats {
  const allVoters = getAllVoters(data)

  // Count unique occupations
  const occupationCounts: Record<string, number> = {}
  allVoters.forEach((voter) => {
    const occupation = voter.occupation.trim()
    occupationCounts[occupation] = (occupationCounts[occupation] || 0) + 1
  })

  const uniqueOccupations = Object.keys(occupationCounts).sort((a, b) =>
    occupationCounts[b] - occupationCounts[a]
  )

  // Calculate age distribution
  const currentYear = new Date().getFullYear()
  const ageDistribution: { range: string; count: number }[] = []
  const ageRanges = [
    { range: '18-25', min: 18, max: 25 },
    { range: '26-35', min: 26, max: 35 },
    { range: '36-45', min: 36, max: 45 },
    { range: '46-55', min: 46, max: 55 },
    { range: '56-65', min: 56, max: 65 },
    { range: '66+', min: 66, max: 200 },
  ]

  ageRanges.forEach(({ range, min, max }) => {
    const count = allVoters.filter((voter) => {
      const dob = parseDateOfBirth(voter.dob)
      if (!dob) return false
      const age = currentYear - dob.getFullYear()
      return age >= min && age <= max
    }).length
    ageDistribution.push({ range, count })
  })

  return {
    total: allVoters.length,
    male: data.male.length,
    female: data.female.length,
    uniqueOccupations,
    occupationCounts,
    ageDistribution,
  }
}

/**
 * Parse date of birth string (handles both Bengali and Arabic numerals)
 * Format: DD/MM/YYYY
 */
export function parseDateOfBirth(dobString: string): Date | null {
  try {
    // Convert Bengali numerals to Arabic
    const normalized = bengaliToArabic(dobString)

    // Parse DD/MM/YYYY format
    const parts = normalized.split('/')
    if (parts.length !== 3) return null

    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
    const year = parseInt(parts[2], 10)

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null

    return new Date(year, month, day)
  } catch (error) {
    console.error('Error parsing date of birth:', dobString, error)
    return null
  }
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}

/**
 * Filter voters by gender
 */
export function filterByGender(
  data: VoterData,
  gender: 'all' | 'female' | 'male'
): VoterRecord[] {
  if (gender === 'all') return getAllVoters(data)
  return data[gender]
}

/**
 * Filter voters by occupation
 */
export function filterByOccupation(
  voters: VoterRecord[],
  occupations: string[]
): VoterRecord[] {
  if (occupations.length === 0) return voters
  return voters.filter((voter) => occupations.includes(voter.occupation))
}

/**
 * Filter voters by address (partial match)
 */
export function filterByAddress(
  voters: VoterRecord[],
  addressQuery: string
): VoterRecord[] {
  if (!addressQuery.trim()) return voters
  const query = addressQuery.trim().toLowerCase()
  return voters.filter((voter) =>
    voter.address.toLowerCase().includes(query)
  )
}

/**
 * Filter voters by birth year range
 */
export function filterByBirthYear(
  voters: VoterRecord[],
  yearRange: [number, number] | null
): VoterRecord[] {
  if (!yearRange) return voters

  const [minYear, maxYear] = yearRange
  return voters.filter((voter) => {
    const dob = parseDateOfBirth(voter.dob)
    if (!dob) return false
    const birthYear = dob.getFullYear()
    return birthYear >= minYear && birthYear <= maxYear
  })
}
