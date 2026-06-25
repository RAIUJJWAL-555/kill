"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKolStore } from "@/store/kolStore"
import { SparklineCell } from "./SparklineCell"
import type { Kol } from "@/types"

function formatROI(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

function KolCard({ kol, rank, roiValues }: { kol: Kol; rank: number; roiValues: number[] }) {
  const openDrawer = useKolStore((s) => s.openDrawer)

  return (
    <div
      onClick={() => openDrawer(kol.id)}
      className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:bg-zinc-800/30"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm tabular-nums text-zinc-500">#{rank}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kol.avatar}
          alt={kol.handle}
          className="h-10 w-10 rounded-full bg-zinc-800"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-100">
              {kol.handle}
            </span>
            {kol.verified && (
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                ✓
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500">{kol.name}</span>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-500">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-zinc-500">Accuracy</span>
          <p className="font-mono tabular-nums text-zinc-100">
            {kol.accuracy_pct.toFixed(1)}%
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Signals</span>
          <p className="font-mono tabular-nums text-zinc-300">
            {kol.total_signals}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Avg ROI</span>
          <p
            className={`font-mono tabular-nums ${
              kol.avg_roi_pct >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatROI(kol.avg_roi_pct)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Last Signal</span>
          <p className="font-mono tabular-nums text-zinc-400">
            {format(new Date(kol.last_signal_at), "MMM d, HH:mm")}
          </p>
        </div>
      </div>

      {roiValues.length > 0 && (
        <div className="mt-2">
          <SparklineCell kolId={kol.id} roiValues={roiValues} />
        </div>
      )}
    </div>
  )
}

export function KolCards() {
  const kols = useKolStore((s) => s.kols)
  const signals = useKolStore((s) => s.signals)
  const searchQuery = useKolStore((s) => s.searchQuery)
  const minAccuracy = useKolStore((s) => s.minAccuracy)
  const sort = useKolStore((s) => s.sort)

  const filteredKols = useMemo(() => {
    let result = [...kols]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((k) => k.handle.toLowerCase().includes(q))
    }

    if (minAccuracy > 0) {
      result = result.filter((k) => k.accuracy_pct >= minAccuracy)
    }

    if (sort.field) {
      result.sort((a, b) => {
        const aVal = a[sort.field!]
        const bVal = b[sort.field!]
        return sort.direction === "desc" ? bVal - aVal : aVal - bVal
      })
    }

    return result
  }, [kols, searchQuery, minAccuracy, sort])

  const roiMap = useMemo(() => {
    const map: Record<string, number[]> = {}
    for (const signal of signals) {
      if (!map[signal.kol_id]) map[signal.kol_id] = []
      map[signal.kol_id].push(signal.roi_pct)
    }
    for (const key of Object.keys(map)) {
      map[key] = map[key].slice(-10)
    }
    return map
  }, [signals])

  return (
    <div className="space-y-3">
      {filteredKols.map((kol, idx) => (
        <KolCard
          key={kol.id}
          kol={kol}
          rank={idx + 1}
          roiValues={roiMap[kol.id] || []}
        />
      ))}
    </div>
  )
}
