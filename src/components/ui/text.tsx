import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ============================================
 * TEXT COMPONENT - Amphibia Design System
 * ============================================
 * 
 * Standardized typography component that enforces
 * the design system's type scale.
 * 
 * Usage:
 *   <Text variant="title-1">Page Title</Text>
 *   <Text variant="body">Regular text</Text>
 *   <Text variant="caption" color="muted">Timestamp</Text>
 */

const textVariants = cva("", {
  variants: {
    variant: {
      // Large titles - hero sections, main headings (30px)
      display: "text-3xl font-bold tracking-tight",
      
      // Primary section titles (24px)
      "title-1": "text-2xl font-semibold tracking-tight",
      
      // Secondary headings, card titles (20px)
      "title-2": "text-xl font-semibold",
      
      // Subsection headers, important labels (18px)
      "title-3": "text-lg font-medium",
      
      // Emphasized body text, list item titles (16px)
      headline: "text-base font-semibold",
      
      // Standard body text (14px)
      body: "text-sm font-normal",
      
      // Secondary info, descriptions (14px muted)
      subhead: "text-sm font-normal text-muted-foreground",
      
      // Labels, timestamps, metadata (12px)
      caption: "text-xs font-normal",
      
      // Smallest text - badges, counters (10px)
      footnote: "text-[10px] font-medium uppercase tracking-wider",
    },
    color: {
      default: "",
      primary: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-emerald-500",
      warning: "text-amber-500",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
  },
});

// Element mapping for semantic HTML
const variantElementMap = {
  display: "h1",
  "title-1": "h2",
  "title-2": "h3",
  "title-3": "h4",
  headline: "p",
  body: "p",
  subhead: "p",
  caption: "span",
  footnote: "span",
} as const;

type TextColor = "default" | "primary" | "muted" | "destructive" | "success" | "warning";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    Omit<VariantProps<typeof textVariants>, "color"> {
  as?: keyof JSX.IntrinsicElements;
  truncate?: boolean;
  lines?: 1 | 2 | 3;
  textColor?: TextColor;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant = "body",
      textColor,
      align,
      weight,
      as,
      truncate,
      lines,
      children,
      ...props
    },
    ref
  ) => {
    // Use provided element or semantic default
    const Element = (as ||
      variantElementMap[variant || "body"]) as keyof JSX.IntrinsicElements;

    // Line clamping classes
    const lineClampClass = lines
      ? `line-clamp-${lines}`
      : truncate
      ? "truncate"
      : "";

    return React.createElement(
      Element,
      {
        ref,
        className: cn(
          textVariants({ variant, color: textColor, align, weight }),
          lineClampClass,
          className
        ),
        ...props,
      },
      children
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants };
