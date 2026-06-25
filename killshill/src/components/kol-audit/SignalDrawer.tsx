"use client"

import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { DirectionBadge, StatusBadge } from "@/components/ui/badge"
import { useKolStore } from "@/store/kolStore"
import type { Signal } from "@/types"

function formatPrice(price: number, symbol: string): string {
  if (symbol.includes("USDT")) {
    if (price >= 1000) return price.toFixed(2)
    if (price >= 1) return price.toFixed(4)
    return price.toFixed(4)
  }
  return price.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

function formatROI(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

function SignalRow({ signal }: { signal: Signal }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono font-medium text-zinc-100">{signal.symbol}</span>
        <div className="flex gap-1.5">
          <DirectionBadge direction={signal.direction} />
          <StatusBadge status={signal.status} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-zinc-500">Entry</span>
        <span className="text-right font-mono tabular-nums text-zinc-300">
          ${formatPrice(signal.entry_price, signal.symbol)}
        </span>
        <span className="text-zinc-500">Target</span>
        <span className="text-right font-mono tabular-nums text-zinc-300">
          ${formatPrice(signal.target_price, signal.symbol)}
        </span>
        <span className="text-zinc-500">Stop Loss</span>
        <span className="text-right font-mono tabular-nums text-red-400">
          ${formatPrice(signal.stop_loss, signal.symbol)}
        </span>
        <span className="text-zinc-500">ROI</span>
        <span
          className={`text-right font-mono tabular-nums ${
            signal.roi_pct >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {formatROI(signal.roi_pct)}
        </span>
      </div>
    </div>
  )
}

export function SignalDrawer() {
  const drawerOpen = useKolStore((s) => s.drawerOpen)
  const closeDrawer = useKolStore((s) => s.closeDrawer)
  const selectedKolId = useKolStore((s) => s.selectedKolId)
  const kols = useKolStore((s) => s.kols)
  const signals = useKolStore((s) => s.signals)

  const kol = useMemo(
    () => kols.find((k) => k.id === selectedKolId),
    [kols, selectedKolId],
  )

  const latestSignals = useMemo(
    () =>
      signals
        .filter((s) => s.kol_id === selectedKolId)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 10),
    [signals, selectedKolId],
  )

  return (
    <Sheet open={drawerOpen} onOpenChange={closeDrawer}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader className="mb-6">
          {kol && (
            <>
              <SheetTitle className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                  src={kol.avatar}
                  alt={kol.handle}
                  className="h-6 w-6 rounded-full"
                />
                {kol.handle}
              </SheetTitle>
              <SheetDescription>
                {kol.name} &middot; {latestSignals.length} recent signal
                {latestSignals.length !== 1 ? "s" : ""}
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {latestSignals.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">No signals found</p>
        ) : (
          <div className="space-y-3">
            {latestSignals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
