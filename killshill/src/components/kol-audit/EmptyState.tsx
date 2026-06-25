import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKolStore } from "@/store/kolStore"

export function EmptyState() {
  const clearFilters = useKolStore((s) => s.clearFilters)

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <SearchX className="mb-4 h-12 w-12 text-zinc-600" />
      <h3 className="mb-1 text-lg font-medium text-zinc-300">No KOLs found</h3>
      <p className="mb-6 text-sm text-zinc-500">
        Try adjusting your search or accuracy filter
      </p>
      <Button variant="outline" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  )
}
