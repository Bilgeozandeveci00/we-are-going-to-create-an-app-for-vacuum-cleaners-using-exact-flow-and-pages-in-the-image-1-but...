/**
 * ============================================
 * AMPHIBIA DESIGN SYSTEM - Design Tokens
 * ============================================
 * 
 * This file contains all design system constants.
 * Import these tokens instead of using arbitrary values.
 * 
 * RULES:
 * 1. Never use arbitrary values - always use these tokens
 * 2. Typography must use the defined scale
 * 3. Icons must use standard sizes
 * 4. Spacing follows 4px grid (0.25rem increments)
 */

// ============================================
// TYPOGRAPHY SCALE
// ============================================
// 8 levels based on Apple HIG, adapted for mobile-first

export const Typography = {
  // Large titles - hero sections, main headings
  DISPLAY: 'text-3xl font-bold tracking-tight', // 30px
  
  // Primary section titles
  TITLE_1: 'text-2xl font-semibold tracking-tight', // 24px
  
  // Secondary headings, card titles
  TITLE_2: 'text-xl font-semibold', // 20px
  
  // Subsection headers, important labels
  TITLE_3: 'text-lg font-medium', // 18px
  
  // Emphasized body text, list item titles
  HEADLINE: 'text-base font-semibold', // 16px
  
  // Standard body text
  BODY: 'text-sm font-normal', // 14px
  
  // Secondary info, descriptions
  SUBHEAD: 'text-sm font-normal text-muted-foreground', // 14px muted
  
  // Labels, timestamps, metadata
  CAPTION: 'text-xs font-normal text-muted-foreground', // 12px
  
  // Smallest text - badges, counters
  FOOTNOTE: 'text-[10px] font-medium uppercase tracking-wider', // 10px
} as const;

export type TypographyVariant = keyof typeof Typography;

// ============================================
// ICON SIZES
// ============================================
// 5 standardized sizes for consistency

export const IconSize = {
  // Inline with caption text, badges
  XS: 'w-3 h-3', // 12px
  
  // Inline with body text, list items
  SM: 'w-4 h-4', // 16px
  
  // Default - buttons, navigation
  MD: 'w-5 h-5', // 20px
  
  // Card icons, section headers
  LG: 'w-6 h-6', // 24px
  
  // Feature icons, hero sections
  XL: 'w-8 h-8', // 32px
  
  // Large illustrations, empty states
  '2XL': 'w-12 h-12', // 48px
} as const;

export type IconSizeVariant = keyof typeof IconSize;

// Numeric values for programmatic use
export const IconSizePx = {
  XS: 12,
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 32,
  '2XL': 48,
} as const;

// ============================================
// SPACING SCALE
// ============================================
// 4px grid system - use only these values

export const Spacing = {
  NONE: 'gap-0',     // 0px
  '2XS': 'gap-0.5',  // 2px - tight grouping
  XS: 'gap-1',       // 4px - inline elements
  SM: 'gap-2',       // 8px - related items
  MD: 'gap-3',       // 12px - default spacing
  LG: 'gap-4',       // 16px - section spacing
  XL: 'gap-6',       // 24px - major sections
  '2XL': 'gap-8',    // 32px - page sections
} as const;

// Padding variants
export const Padding = {
  XS: 'p-1',   // 4px
  SM: 'p-2',   // 8px
  MD: 'p-3',   // 12px
  LG: 'p-4',   // 16px
  XL: 'p-6',   // 24px
} as const;

// ============================================
// BORDER RADIUS
// ============================================
// Standardized radii by component type

export const Radius = {
  // Pills, badges, small buttons
  FULL: 'rounded-full',
  
  // Large cards, modals, sheets
  '2XL': 'rounded-2xl', // 16px
  
  // Cards, containers
  XL: 'rounded-xl', // 12px
  
  // Buttons, inputs
  LG: 'rounded-lg', // 8px
  
  // Small elements, chips
  MD: 'rounded-md', // 6px
  
  // Subtle rounding
  SM: 'rounded-sm', // 4px
} as const;

// ============================================
// BUTTON SIZES
// ============================================

export const ButtonSize = {
  SM: 'h-8 px-3 text-xs',
  MD: 'h-10 px-4 text-sm',
  LG: 'h-12 px-6 text-base',
  XL: 'h-14 px-8 text-lg',
  ICON_SM: 'h-8 w-8',
  ICON_MD: 'h-10 w-10',
  ICON_LG: 'h-12 w-12',
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================
// Consistent timing across the app

export const Duration = {
  // Micro-interactions (hover, press)
  MICRO: 150,
  
  // Standard transitions
  FAST: 200,
  
  // Default animation
  NORMAL: 300,
  
  // Emphasis animations
  SLOW: 500,
  
  // Page transitions
  SLOWER: 700,
} as const;

// Framer Motion spring presets
export const SpringPreset = {
  SNAPPY: { type: 'spring' as const, stiffness: 400, damping: 30 },
  SMOOTH: { type: 'spring' as const, stiffness: 300, damping: 25 },
  BOUNCY: { type: 'spring' as const, stiffness: 500, damping: 20 },
  GENTLE: { type: 'spring' as const, stiffness: 200, damping: 20 },
} as const;

// ============================================
// SHEET/MODAL SIZES
// ============================================

export const SheetSize = {
  // Small dialogs, confirmations
  SMALL: 'max-h-[40vh]',
  
  // Standard sheets
  MEDIUM: 'max-h-[60vh]',
  
  // Tall sheets
  LARGE: 'max-h-[85vh]',
  
  // Full screen
  FULL: 'h-[100dvh]',
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
// Layering system

export const ZIndex = {
  BASE: 0,
  ELEVATED: 10,
  DROPDOWN: 50,
  STICKY: 100,
  OVERLAY: 200,
  MODAL: 300,
  TOAST: 400,
  TOOLTIP: 500,
} as const;

// ============================================
// COLOR SEMANTICS
// ============================================
// Use these class names for semantic coloring

export const SemanticColor = {
  // Actions
  PRIMARY_ACTION: 'text-primary',
  SECONDARY_ACTION: 'text-muted-foreground',
  DESTRUCTIVE_ACTION: 'text-destructive',
  
  // Status
  SUCCESS: 'text-emerald-500',
  WARNING: 'text-amber-500',
  ERROR: 'text-destructive',
  INFO: 'text-primary',
  
  // Text
  TEXT_PRIMARY: 'text-foreground',
  TEXT_SECONDARY: 'text-muted-foreground',
  TEXT_DISABLED: 'text-muted-foreground/50',
  
  // Backgrounds
  BG_PRIMARY: 'bg-primary',
  BG_SECONDARY: 'bg-secondary',
  BG_CARD: 'bg-card',
  BG_ELEVATED: 'bg-card-elevated',
} as const;

// ============================================
// COMPONENT PRESETS
// ============================================

export const ComponentPreset = {
  // Standard card styling
  CARD: 'bg-card rounded-2xl border border-border/50 p-4',
  
  // Elevated card with glow
  CARD_ELEVATED: 'bg-card-elevated rounded-2xl border border-border/50 p-4 shadow-lg',
  
  // Glass card
  CARD_GLASS: 'glass-card rounded-2xl border border-border/30 p-4',
  
  // Interactive card
  CARD_INTERACTIVE: 'bg-card rounded-2xl border border-border/50 p-4 transition-colors hover:bg-card-elevated active:scale-[0.98]',
  
  // Section container
  SECTION: 'space-y-3',
  
  // List item
  LIST_ITEM: 'flex items-center justify-between py-3 border-b border-border/30 last:border-0',
} as const;
