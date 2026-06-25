"use client"

import { useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useKolStore } from "@/store/kolStore"
import { Search } from "lucide-react"

export function FiltersBar() {
  const searchQuery = useKolStore((s) => s.searchQuery)
  const minAccuracy = useKolStore((s) => s.minAccuracy)
  const setSearchQuery = useKolStore((s) => s.setSearchQuery)
  const setMinAccuracy = useKolStore((s) => s.setMinAccuracy)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setSearchQuery(value)
      }, 250)
    },
    [setSearchQuery],
  )

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search by handle..."
          defaultValue={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap text-xs text-zinc-400">
          Min accuracy: {minAccuracy}%
        </span>
        <Slider
          value={[minAccuracy]}
          onValueChange={([v]) => setMinAccuracy(v)}
          min={0}
          max={100}
          step={1}
          className="w-32"
        />
      </div>
    </div>
  )
}
