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
 * Unified IDF-weighted search.
 *
 * Each query token is searched independently. Every voter gets a composite
 * score = Σ (tokenSpecificity × matchQuality) across all matching tokens.
 *
 * - tokenSpecificity = 1/√(total results for that token)
 *   Rare tokens like "খুরশেদ" (~10 hits) weigh ~10× more than "মোঃ" (~1200 hits).
 *
 * - matchQuality = 1 − fuseScore
 *   Fuse.js field weights (name=5 > father=2 > address=0.5) produce lower
 *   scores for name-field matches, so name matches naturally score highest.
 *
 * This means "খোরশেদ আলম" (name match on 2 rare tokens) ranks above
 * "মোঃ রিদোয়ান হোসেন" (father_name match) even though the latter
 * matches more tokens (including the common "মোঃ").
 *
 * A dynamic cutoff (20% of best score) eliminates noise-only matches.
 */
export function searchVoters(
  fuse: Fuse<VoterRecord>,
  query: string
): FuseResult<VoterRecord>[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  const normalizedQuery = normalizeVoterNumber(query.trim())
  const tokens = normalizedQuery
    .split(/\s+/)
    .filter(t => t.length >= 2)

  if (tokens.length === 0) return []

  // Single token: direct Fuse search is sufficient
  if (tokens.length === 1) {
    return fuse.search(tokens[0])
  }

  // Multi-token: unified IDF-weighted scoring
  const tokenData = tokens.map(token => {
    const results = fuse.search(token)
    return { results, total: results.length }
  })

  // Tighter quality gate per token — rejects loose fuzzy matches
  // like "আবুল" ≈ "আলম" that slip through the global 0.4 threshold
  const TOKEN_QUALITY_CUTOFF = 0.3

  const voterScores = new Map<string, { result: FuseResult<VoterRecord>; score: number }>()

  for (const { results, total } of tokenData) {
    const specificity = total > 0 ? 1 / Math.sqrt(total) : 0

    for (const r of results) {
      if ((r.score ?? 1) > TOKEN_QUALITY_CUTOFF) continue

      const id = r.item.voter_no
      const matchQuality = 1 - (r.score ?? 1)
      const contribution = specificity * matchQuality

      const existing = voterScores.get(id)
      if (existing) {
        existing.score += contribution
        // Keep the result with the best Fuse score for display purposes
        if ((r.score ?? 1) < (existing.result.score ?? 1)) {
          existing.result = r
        }
      } else {
        voterScores.set(id, { result: r, score: contribution })
      }
    }
  }

  // Sort by composite score; apply dynamic cutoff to eliminate noise
  const sorted = [...voterScores.values()].sort((a, b) => b.score - a.score)
  const topScore = sorted[0]?.score ?? 0
  const minScore = topScore * 0.2

  return sorted
    .filter(entry => entry.score >= minScore)
    .map(entry => entry.result)
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
