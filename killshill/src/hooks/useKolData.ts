"use client"

import { useCallback, useEffect, useRef } from "react"
import { useKolStore } from "@/store/kolStore"
import type { Kol, Signal } from "@/types"

const KOLS_URL =
  "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/kols.json"
const SIGNALS_URL =
  "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/signals.json"

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  return res.json()
}

export function useKolData() {
  const {
    setKols,
    setSignals,
    setLoading,
    setRefreshing,
    setError,
    setLastUpdated,
    loading,
    error,
    kols,
  } = useKolStore()
  const initialFetchDone = useRef(false)

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const [kolsData, signalsData] = await Promise.all([
          fetchJson<Kol[]>(KOLS_URL),
          fetchJson<Signal[]>(SIGNALS_URL),
        ])
        setKols(kolsData)
        setSignals(signalsData)
        setLastUpdated(new Date())
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch data"
        setError(message)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [setKols, setSignals, setLoading, setRefreshing, setError, setLastUpdated],
  )

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchData(false)
    }
  }, [fetchData])

  return {
    fetchData,
    loading,
    error,
    hasData: kols.length > 0,
  }
}
