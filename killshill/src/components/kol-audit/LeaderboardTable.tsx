"use client"

import { useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react"
import { useKolStore } from "@/store/kolStore"
import { Button } from "@/components/ui/button"
import { SparklineCell } from "./SparklineCell"
import type { Kol } from "@/types"

const columnHelper = createColumnHelper<Kol>()

function formatROI(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function LeaderboardTable() {
  const kols = useKolStore((s) => s.kols)
  const signals = useKolStore((s) => s.signals)
  const searchQuery = useKolStore((s) => s.searchQuery)
  const minAccuracy = useKolStore((s) => s.minAccuracy)
  const sort = useKolStore((s) => s.sort)
  const setSort = useKolStore((s) => s.setSort)
  const openDrawer = useKolStore((s) => s.openDrawer)

  const filteredKols = useMemo(() => {
    let result = kols

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((k) => k.handle.toLowerCase().includes(q))
    }

    if (minAccuracy > 0) {
      result = result.filter((k) => k.accuracy_pct >= minAccuracy)
    }

    return result
  }, [kols, searchQuery, minAccuracy])

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

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "rank",
        header: "#",
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-zinc-500">
            {row.index + 1}
          </span>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("handle", {
        header: "KOL",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
              src={row.original.avatar}
              alt={row.original.handle}
              className="h-8 w-8 flex-shrink-0 rounded-full bg-zinc-800"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-zinc-100">
                  {row.original.handle}
                </span>
                {row.original.verified && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500">{row.original.name}</span>
            </div>
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("accuracy_pct", {
        header: "Accuracy",
        cell: ({ getValue }) => (
          <span className="font-mono tabular-nums text-zinc-100">
            {getValue().toFixed(1)}%
          </span>
        ),
      }),
      columnHelper.accessor("total_signals", {
        header: "Signals",
        cell: ({ getValue }) => (
          <span className="font-mono tabular-nums text-zinc-300">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("avg_roi_pct", {
        header: "Avg ROI",
        cell: ({ getValue }) => {
          const v = getValue()
          return (
            <span
              className={`font-mono tabular-nums ${
                v >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatROI(v)}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: "sparkline",
        header: "Trend",
        cell: ({ row }) => (
          <SparklineCell
            kolId={row.original.id}
            roiValues={roiMap[row.original.id] || []}
          />
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("last_signal_at", {
        header: "Last Signal",
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums text-zinc-400">
            {format(new Date(getValue()), "MMM d, HH:mm")}
          </span>
        ),
        enableSorting: false,
      }),
      columnHelper.display({
        id: "action",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDrawer(row.original.id)}
            className="text-zinc-500 hover:text-zinc-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ),
        enableSorting: false,
      }),
    ],
    [openDrawer, roiMap],
  )

  const sortingState = useMemo(
    () =>
      sort.field
        ? [{ id: sort.field, desc: sort.direction === "desc" }]
        : [],
    [sort],
  )

  const handleSortingChange = useCallback(
    (updater: unknown) => {
      const newState =
        typeof updater === "function"
          ? updater(sortingState)
          : updater
      const newSort = (newState as Array<{ id: string; desc: boolean }>)[0]
      if (newSort) {
        setSort({
          field: newSort.id as "accuracy_pct" | "total_signals" | "avg_roi_pct",
          direction: newSort.desc ? "desc" : "asc",
        })
      } else {
        setSort({ field: null, direction: "desc" })
      }
    },
    [sortingState, setSort],
  )

  // TanStack Table returns functions that can't be memoized; this is expected and safe
  const table = useReactTable({
    data: filteredKols,
    columns,
    state: {
      sorting: sortingState,
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: false,
  })

  const handleRowClick = (kolId: string) => {
    openDrawer(kolId)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-zinc-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 ${
                    header.column.getCanSort()
                      ? "cursor-pointer select-none hover:text-zinc-300"
                      : ""
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                  colSpan={header.colSpan}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <>
                        {{
                          asc: <ArrowUp className="h-3 w-3" />,
                          desc: <ArrowDown className="h-3 w-3" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpDown className="h-3 w-3 opacity-30" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.original.id)}
              className="cursor-pointer border-b border-zinc-800/50 transition-colors last:border-0 hover:bg-zinc-800/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
