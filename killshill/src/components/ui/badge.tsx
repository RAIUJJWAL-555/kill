import { cn } from "@/lib/utils"
import type { SignalDirection, SignalStatus } from "@/types"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "danger" | "warning" | "neutral"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-zinc-800 text-zinc-100",
    outline: "border border-zinc-700 text-zinc-300",
    success: "bg-emerald-900/60 text-emerald-400 border border-emerald-700/50",
    danger: "bg-red-900/60 text-red-400 border border-red-700/50",
    warning: "bg-amber-900/60 text-amber-400 border border-amber-700/50",
    neutral: "bg-zinc-900/60 text-zinc-400 border border-zinc-700/50",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

function DirectionBadge({ direction }: { direction: SignalDirection }) {
  return (
    <Badge variant={direction === "BUY" ? "success" : "danger"}>
      {direction}
    </Badge>
  )
}

const statusVariants: Record<SignalStatus, "success" | "danger" | "warning" | "neutral"> = {
  TARGET_HIT: "success",
  STOPLOSS_HIT: "danger",
  OPEN: "warning",
  EXPIRED: "neutral",
}

function StatusBadge({ status }: { status: SignalStatus }) {
  const labels: Record<SignalStatus, string> = {
    TARGET_HIT: "Target Hit",
    STOPLOSS_HIT: "Stop Loss",
    OPEN: "Open",
    EXPIRED: "Expired",
  }

  return <Badge variant={statusVariants[status]}>{labels[status]}</Badge>
}

export { Badge, DirectionBadge, StatusBadge }
