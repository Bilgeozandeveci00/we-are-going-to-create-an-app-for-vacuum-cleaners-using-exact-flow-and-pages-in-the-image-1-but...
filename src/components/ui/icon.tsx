import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * ============================================
 * ICON COMPONENT - Amphibia Design System
 * ============================================
 * 
 * Standardized icon wrapper that enforces consistent sizing.
 * 
 * Usage:
 *   <Icon icon={Battery} size="md" />
 *   <Icon icon={Home} size="lg" color="primary" />
 *   <Icon icon={Settings} size="sm" className="opacity-50" />
 */

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      // 12px - Inline with caption text, badges
      xs: "w-3 h-3",
      
      // 16px - Inline with body text, list items
      sm: "w-4 h-4",
      
      // 20px - Default: buttons, navigation
      md: "w-5 h-5",
      
      // 24px - Card icons, section headers
      lg: "w-6 h-6",
      
      // 32px - Feature icons, hero sections
      xl: "w-8 h-8",
      
      // 48px - Large illustrations, empty states
      "2xl": "w-12 h-12",
    },
    color: {
      default: "",
      primary: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-emerald-500",
      warning: "text-amber-500",
      foreground: "text-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

// Numeric values for programmatic use
export const iconSizePx = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

type IconColor = "default" | "primary" | "muted" | "destructive" | "success" | "warning" | "foreground";
type IconSizeVariant = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface IconProps
  extends Omit<LucideProps, "size" | "ref" | "color"> {
  icon: LucideIcon;
  size?: IconSizeVariant;
  iconColor?: IconColor;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideIcon, size, iconColor, className, ...props }, ref) => {
    return (
      <LucideIcon
        ref={ref}
        className={cn(iconVariants({ size, color: iconColor }), className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";

export { Icon, iconVariants };
