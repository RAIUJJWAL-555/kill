import { create } from "zustand"
import type { SortState, Kol, Signal } from "@/types"

interface KolStore {
  kols: Kol[]
  signals: Signal[]
  loading: boolean
  refreshing: boolean
  error: string | null
  lastUpdated: Date | null

  searchQuery: string
  minAccuracy: number
  sort: SortState

  selectedKolId: string | null
  drawerOpen: boolean

  setKols: (kols: Kol[]) => void
  setSignals: (signals: Signal[]) => void
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setError: (error: string | null) => void
  setLastUpdated: (date: Date) => void
  setSearchQuery: (query: string) => void
  setMinAccuracy: (value: number) => void
  setSort: (sort: SortState) => void
  setSelectedKolId: (id: string | null) => void
  setDrawerOpen: (open: boolean) => void
  openDrawer: (kolId: string) => void
  closeDrawer: () => void
  clearFilters: () => void
}

export const useKolStore = create<KolStore>((set) => ({
  kols: [],
  signals: [],
  loading: true,
  refreshing: false,
  error: null,
  lastUpdated: null,

  searchQuery: "",
  minAccuracy: 0,
  sort: { field: null, direction: "desc" },

  selectedKolId: null,
  drawerOpen: false,

  setKols: (kols) => set({ kols }),
  setSignals: (signals) => set({ signals }),
  setLoading: (loading) => set({ loading }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setError: (error) => set({ error }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMinAccuracy: (minAccuracy) => set({ minAccuracy }),
  setSort: (sort) => set({ sort }),
  setSelectedKolId: (selectedKolId) => set({ selectedKolId }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  openDrawer: (kolId) => set({ selectedKolId: kolId, drawerOpen: true }),
  closeDrawer: () => set({ selectedKolId: null, drawerOpen: false }),
  clearFilters: () =>
    set({ searchQuery: "", minAccuracy: 0, sort: { field: null, direction: "desc" } }),
}))
