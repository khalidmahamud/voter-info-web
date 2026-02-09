'use client'

import { useState, useEffect } from 'react'
import type { VoterData, VoterStats } from '@/lib/types'
import { loadVoterData, calculateStats } from '@/lib/data'

export interface UseVoterDataReturn {
  data: VoterData | null
  stats: VoterStats | null
  loading: boolean
  error: Error | null
}

/**
 * Custom hook to load and manage voter data
 */
export function useVoterData(): UseVoterDataReturn {
  const [data, setData] = useState<VoterData | null>(null)
  const [stats, setStats] = useState<VoterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const voterData = await loadVoterData()

        if (!isMounted) return

        setData(voterData)

        // Calculate statistics
        const voterStats = calculateStats(voterData)
        setStats(voterStats)

      } catch (err) {
        if (!isMounted) return

        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Failed to load voter data:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, stats, loading, error }
}
