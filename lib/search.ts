import Fuse, { type IFuseOptions, type FuseResult, type RangeTuple } from 'fuse.js'
import type { VoterRecord } from './types'
import { normalizeVoterNumber } from './utils'

/**
 * Fuse.js configuration for searching voter records
 * Optimized for Bengali Unicode text and fuzzy matching
 */
export const fuseOptions: IFuseOptions<VoterRecord> = {
  keys: [
    { name: 'name', weight: 5 },           // Highest priority: name matches first
    { name: 'voter_no', weight: 1.5 },
    { name: 'father_name', weight: 2 },    // Second priority: parent names
    { name: 'mother_name', weight: 2 },
    { name: 'address', weight: 0.5 },      // Third priority: address
    { name: 'occupation', weight: 0.3 },
  ],
  threshold: 0.4,                           // Slightly relaxed for broader matches
  distance: 200,                            // Allow matching across longer strings
  ignoreLocation: true,                     // Search full strings, not just specific locations
  minMatchCharLength: 2,                    // Minimum 2 characters to trigger search
  useExtendedSearch: true,                  // Enable advanced search patterns
  includeScore: true,                       // Include relevance scores
  includeMatches: true,                     // Include match locations for highlighting
  findAllMatches: true,                     // Find all possible matches within an item
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
 * Perform a comprehensive multi-pass search on voter records.
 * Pass 1: Full query (highest relevance — exact/close matches)
 * Pass 2: Individual word tokens, ranked by how many tokens each voter matches.
 *         e.g. "খুরশেদ আলম" (2 token hits) ranks above "মোঃ" only (1 token hit).
 * Results are deduplicated, with full-query matches always ranked first.
 */
export function searchVoters(
  fuse: Fuse<VoterRecord>,
  query: string
): FuseResult<VoterRecord>[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  const normalizedQuery = normalizeVoterNumber(query.trim())

  // Pass 1: search with the full query
  const fullResults = fuse.search(normalizedQuery)
  const fullResultIds = new Set<string>(fullResults.map(r => r.item.voter_no))

  // Pass 2: split into tokens, search each, and score by token hit count
  const tokens = normalizedQuery
    .split(/\s+/)
    .filter(t => t.length >= 2)

  if (tokens.length <= 1) {
    // Single token — full results already cover everything
    return fullResults
  }

  // Track how many tokens each voter matched + best Fuse score
  const tokenHits = new Map<string, { result: FuseResult<VoterRecord>; hitCount: number; bestScore: number }>()

  for (const token of tokens) {
    for (const r of fuse.search(token)) {
      const id = r.item.voter_no
      if (fullResultIds.has(id)) continue // already in pass 1 results

      const existing = tokenHits.get(id)
      if (existing) {
        existing.hitCount++
        existing.bestScore = Math.min(existing.bestScore, r.score ?? 1)
      } else {
        tokenHits.set(id, { result: r, hitCount: 1, bestScore: r.score ?? 1 })
      }
    }
  }

  // Sort token results: more token hits first, then by Fuse score (lower = better)
  const tokenResults = [...tokenHits.values()]
    .sort((a, b) => b.hitCount - a.hitCount || a.bestScore - b.bestScore)
    .map(entry => entry.result)

  return [...fullResults, ...tokenResults]
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
