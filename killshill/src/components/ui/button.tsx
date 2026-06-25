import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary"
  size?: "sm" | "md" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const variants: Record<string, string> = {
      default:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm",
      ghost:
        "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
      outline:
        "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
      secondary:
        "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
    }

    const sizes: Record<string, string> = {
      sm: "h-7 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      icon: "h-8 w-8",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
