import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — touch-friendly, no cursor desktop-isms, spring-like active states
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none touch-manipulation focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.96] active:not-aria-[haspopup]:brightness-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Solid primary — deep civic blue, trustworthy
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/85",

        // Outlined — for secondary actions
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        // Soft secondary — low-emphasis actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Ghost — transparent, for icon-heavy UIs
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",

        // Destructive — danger/delete actions
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",

        // Text link
        link: "text-primary underline-offset-4 hover:underline",

        // ── Civic CTA variants ──
        // Primary gradient — for hero/main CTA on dark backgrounds
        "liquid-primary":
          "bg-gradient-to-b from-blue-500 to-primary text-white border-x border-t border-b-2 border-blue-400/40 border-b-blue-900/40 shadow-[0_2px_4px_rgba(26,86,219,0.35),0_8px_24px_-4px_rgba(26,86,219,0.50)] hover:shadow-[0_4px_8px_rgba(26,86,219,0.45),0_12px_32px_-4px_rgba(26,86,219,0.70)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all duration-200",

        // Glass — for CTAs on top of imagery/dark backgrounds
        "liquid-glass":
          "bg-white/10 backdrop-blur-xl border border-white/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_8px_24px_-4px_rgba(0,0,0,0.28)] hover:bg-white/18 hover:border-white/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_12px_32px_-4px_rgba(0,0,0,0.38)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all duration-200",

        // Urgent — for SLA breach / urgent-flag actions
        urgent:
          "bg-urgent text-urgent-foreground shadow-sm hover:bg-urgent/90 border-urgent/20",
      },
      size: {
        default: "h-10 gap-2 px-4",        // 40px — comfortable touch
        xs:      "h-7 gap-1 px-2.5 text-xs rounded-lg",
        sm:      "h-9 gap-1.5 px-3.5 text-sm rounded-xl",
        lg:      "h-11 gap-2 px-5",        // 44px — WCAG minimum on coarse
        xl:      "h-14 gap-3 px-8 text-base rounded-2xl",  // 56px hero CTA
        icon:    "size-10 rounded-xl",
        "icon-xs":  "size-7 rounded-lg",
        "icon-sm":  "size-9 rounded-xl",
        "icon-lg":  "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
