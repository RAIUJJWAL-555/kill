export interface Kol {
  id: string
  handle: string
  name: string
  avatar: string
  bio: string
  verified: boolean
  total_signals: number
  accuracy_pct: number
  avg_roi_pct: number
  joined_at: string
  last_signal_at: string
}

export type SignalDirection = "BUY" | "SELL"

export type SignalStatus = "OPEN" | "TARGET_HIT" | "STOPLOSS_HIT" | "EXPIRED"

export interface Signal {
  id: string
  kol_id: string
  symbol: string
  direction: SignalDirection
  entry_price: number
  target_price: number
  stop_loss: number
  current_price: number
  status: SignalStatus
  roi_pct: number
  entry_time: string
  expiry_time: string
  created_at: string
}

export type SortField = "accuracy_pct" | "total_signals" | "avg_roi_pct"
export type SortDirection = "asc" | "desc"

export interface SortState {
  field: SortField | null
  direction: SortDirection
}
