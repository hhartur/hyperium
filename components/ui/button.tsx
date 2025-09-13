import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

Slot.displayName = "Slot"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLElement,
  ButtonProps
>(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    outline: 'border border-input bg-background hover:bg-muted hover:text-foreground',
    secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
    ghost: 'hover:bg-muted hover:text-foreground',
    link: 'text-primary-600 underline-offset-4 hover:underline',
  }
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref as any}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
