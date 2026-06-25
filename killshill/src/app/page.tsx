"use client"

import { useCallback } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useKolData } from "@/hooks/useKolData"
import { useKolStore } from "@/store/kolStore"
import { Button } from "@/components/ui/button"
import { FiltersBar } from "@/components/kol-audit/FiltersBar"
import { LeaderboardTable } from "@/components/kol-audit/LeaderboardTable"
import { KolCards } from "@/components/kol-audit/KolCards"
import { SignalDrawer } from "@/components/kol-audit/SignalDrawer"
import { LoadingSkeleton } from "@/components/kol-audit/LoadingSkeleton"
import { EmptyState } from "@/components/kol-audit/EmptyState"
import { ErrorState } from "@/components/kol-audit/ErrorState"

export default function Home() {
  const { fetchData, loading, error, hasData } = useKolData()
  const kols = useKolStore((s) => s.kols)
  const refreshing = useKolStore((s) => s.refreshing)
  const searchQuery = useKolStore((s) => s.searchQuery)
  const minAccuracy = useKolStore((s) => s.minAccuracy)
  const lastUpdated = useKolStore((s) => s.lastUpdated)

  const filteredCount = kols.filter((k) => {
    if (searchQuery && !k.handle.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (minAccuracy > 0 && k.accuracy_pct < minAccuracy) return false
    return true
  }).length

  const handleRefresh = useCallback(async () => {
    try {
      await fetchData(true)
      toast.success("Data refreshed")
    } catch {
      toast.error("Refresh failed")
    }
  }, [fetchData])

  const firstLoad = loading && !hasData

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              KOL Audit
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {kols.length > 0 ? (
                <>
                  {kols.length} KOL{ kols.length !== 1 ? "s" : "" } tracked
                  {filteredCount < kols.length && (
                    <span className="text-zinc-600">
                      {" "}({filteredCount} shown)
                    </span>
                  )}
                </>
              ) : (
                "Loading KOL data..."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="hidden text-xs text-zinc-600 sm:block">
                Updated {format(lastUpdated, "MMM d, HH:mm")}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`mr-1.5 h-3.5 w-3.5 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {hasData && !error && (
          <div className="mt-4">
            <FiltersBar />
          </div>
        )}
      </header>

      <main>
        {firstLoad && <LoadingSkeleton />}

        {error && <ErrorState message={error} onRetry={() => fetchData(false)} />}

        {!firstLoad && !error && hasData && filteredCount === 0 && (
          <EmptyState />
        )}

        {!firstLoad && !error && hasData && filteredCount > 0 && (
          <>
            <div className="hidden md:block">
              <LeaderboardTable />
            </div>
            <div className="md:hidden">
              <KolCards />
            </div>
          </>
        )}
      </main>

      <SignalDrawer />
    </div>
  )
}
