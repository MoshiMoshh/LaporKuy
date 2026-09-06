import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — modern squircle geometry, tactile touch response, spring active scale
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all duration-150 outline-none select-none touch-manipulation focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.96] active:not-aria-[haspopup]:brightness-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Solid primary civic blue
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/85",

        // Outlined squircle
        outline:
          "border-border bg-card hover:bg-muted hover:text-foreground shadow-xs dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        // Soft secondary squircle
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Ghost squircle
        ghost:
          "hover:bg-muted/80 hover:text-foreground dark:hover:bg-muted/50",

        // Destructive
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",

        // Text link
        link: "text-primary underline-offset-4 hover:underline",

        // ── Signature Orange Report Action Button (Liquid-Primary) ──
        // Glowing orange gradient — high visibility action CTA
        "liquid-primary":
          "bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 text-white border-x border-t border-b-2 border-orange-300/60 border-b-orange-800/60 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.45),0px_3px_6px_0px_rgba(249,115,22,0.35),0px_10px_28px_-4px_rgba(249,115,22,0.55)] hover:brightness-110 hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.6),0px_4px_8px_0px_rgba(249,115,22,0.45),0px_14px_34px_-4px_rgba(249,115,22,0.7)] active:shadow-none active:scale-[0.96] transition-all duration-200",

        // Glass squircle — for secondary hero CTA
        "liquid-glass":
          "bg-white/10 backdrop-blur-xl border border-white/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_8px_24px_-4px_rgba(0,0,0,0.28)] hover:bg-white/18 hover:border-white/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_12px_32px_-4px_rgba(0,0,0,0.38)] active:shadow-none active:scale-[0.96] transition-all duration-200",

        // Urgent SLA button
        urgent:
          "bg-urgent text-urgent-foreground shadow-sm hover:bg-urgent/90 border-urgent/20",
      },
      size: {
        // Modern squircle proportions — solid height, not flat/pipih
        default: "h-11 gap-2 px-5 rounded-2xl",
        xs:      "h-8 gap-1 px-3 text-xs rounded-xl",
        sm:      "h-9 gap-1.5 px-4 text-sm rounded-xl",
        lg:      "h-12 gap-2.5 px-6 text-sm rounded-2xl",
        xl:      "h-14 gap-3 px-8 text-base rounded-2xl",
        // Square tile buttons (persegi)
        icon:    "size-11 rounded-2xl",
        "icon-xs": "size-8 rounded-xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-2xl",
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
