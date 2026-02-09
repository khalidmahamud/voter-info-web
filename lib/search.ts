import Fuse, { type IFuseOptions, type FuseResult, type RangeTuple } from 'fuse.js'
import type { VoterRecord } from './types'
import { normalizeVoterNumber } from './utils'

/**
 * Fuse.js configuration for searching voter records
 * Optimized for Bengali Unicode text and fuzzy matching
 */
export const fuseOptions: IFuseOptions<VoterRecord> = {
  keys: [
    { name: 'name', weight: 2 },           // Prioritize name matches
    { name: 'voter_no', weight: 1.5 },     // Voter ID important
    { name: 'father_name', weight: 1 },
    { name: 'mother_name', weight: 1 },
    { name: 'address', weight: 0.5 },      // Address less important
    { name: 'occupation', weight: 0.3 },
  ],
  threshold: 0.3,                           // Fuzzy matching tolerance (0.0 = perfect match, 1.0 = match anything)
  distance: 100,                            // Maximum distance for fuzzy matching
  ignoreLocation: true,                     // Search full strings, not just specific locations
  minMatchCharLength: 2,                    // Minimum 2 characters to trigger search
  useExtendedSearch: true,                  // Enable advanced search patterns
  includeScore: true,                       // Include relevance scores
  includeMatches: true,                     // Include match locations for highlighting
  findAllMatches: false,                    // Return best match per item
  shouldSort: true,                         // Sort results by relevance
}

/**
 * Create a Fuse.js search index from voter records
 */
export function createSearchIndex(records: VoterRecord[]): Fuse<VoterRecord> {
  // Normalize voter numbers for consistent searching
  const normalizedRecords = records.map((record) => ({
    ...record,
    voter_no_normalized: normalizeVoterNumber(record.voter_no),
  }))

  return new Fuse(normalizedRecords, fuseOptions)
}

/**
 * Perform search on voter records
 */
export function searchVoters(
  fuse: Fuse<VoterRecord>,
  query: string
): FuseResult<VoterRecord>[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  // Normalize the query for voter numbers
  const normalizedQuery = normalizeVoterNumber(query.trim())

  // Search
  return fuse.search(normalizedQuery)
}

/**
 * Get match indices for highlighting
 * Returns array of [start, end] tuples for matched text
 */
export function getMatchIndices(
  matches: readonly RangeTuple[] | undefined
): [number, number][] {
  if (!matches || matches.length === 0) {
    return []
  }
  return matches.map(([start, end]) => [start, end])
}
