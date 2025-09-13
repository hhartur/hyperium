import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-muted hover:bg-muted/80 text-muted-foreground',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-input hover:bg-muted hover:text-foreground',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }