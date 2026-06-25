import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="mb-1 text-lg font-medium text-zinc-300">Failed to load data</h3>
      <p className="mb-6 max-w-md text-sm text-zinc-500">{message}</p>
      <Button variant="default" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}
