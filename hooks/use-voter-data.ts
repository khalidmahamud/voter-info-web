'use client'

import { useState, useEffect, useMemo } from 'react'
import type { AllWardsData, WardVoterData, VoterStats, WardInfo } from '@/lib/types'
import { loadAllWardsData, getWardData, getWardList, calculateStats } from '@/lib/data'

// Module-level cache so data is fetched only once across all hook instances
let cachedData: AllWardsData | null = null
let fetchPromise: Promise<AllWardsData> | null = null

function fetchAllWardsData(): Promise<AllWardsData> {
  if (cachedData) return Promise.resolve(cachedData)
  if (!fetchPromise) {
    fetchPromise = loadAllWardsData().then(data => {
      cachedData = data
      return data
    }).catch(err => {
      fetchPromise = null
      throw err
    })
  }
  return fetchPromise
}

export interface UseAllWardsDataReturn {
  allData: AllWardsData | null
  wardList: (WardInfo & { totalVoters: number })[]
  loading: boolean
  error: Error | null
}

/**
 * Hook to load all wards data (for ward selection page)
 */
export function useAllWardsData(): UseAllWardsDataReturn {
  const [allData, setAllData] = useState<AllWardsData | null>(cachedData)
  const [loading, setLoading] = useState(!cachedData)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (cachedData) {
      setAllData(cachedData)
      setLoading(false)
      return
    }

    let isMounted = true

    fetchAllWardsData()
      .then(data => {
        if (isMounted) {
          setAllData(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
          setLoading(false)
        }
      })

    return () => { isMounted = false }
  }, [])

  const wardList = useMemo(() => {
    if (!allData) return []
    return getWardList(allData)
  }, [allData])

  return { allData, wardList, loading, error }
}

export interface UseWardDataReturn {
  data: WardVoterData | null
  stats: VoterStats | null
  wardName: string | null
  loading: boolean
  error: Error | null
}

/**
 * Hook to load a specific ward's data (for ward detail pages)
 */
export function useWardData(wardNo: number): UseWardDataReturn {
  const { allData, loading: allLoading, error: allError } = useAllWardsData()

  const wardData = useMemo(() => {
    if (!allData) return null
    return getWardData(allData, wardNo)
  }, [allData, wardNo])

  const stats = useMemo(() => {
    if (!wardData) return null
    return calculateStats(wardData)
  }, [wardData])

  const error = useMemo(() => {
    if (allError) return allError
    if (!allLoading && allData && !wardData) {
      return new Error(`Ward ${wardNo} not found`)
    }
    return null
  }, [allError, allLoading, allData, wardData, wardNo])

  return {
    data: wardData,
    stats,
    wardName: wardData?.wardName ?? null,
    loading: allLoading,
    error,
  }
}
