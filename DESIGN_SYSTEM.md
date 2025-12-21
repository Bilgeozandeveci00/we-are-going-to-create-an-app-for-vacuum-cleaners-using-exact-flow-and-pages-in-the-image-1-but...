# Amphibia Design System

A comprehensive design system for the Amphibia Robot Vacuum app, inspired by Apple's Human Interface Guidelines and adapted for mobile-first dark theme interfaces.

---

## 📋 Table of Contents

1. [Core Principles](#core-principles)
2. [Typography](#typography)
3. [Icon Sizes](#icon-sizes)
4. [Spacing](#spacing)
5. [Border Radius](#border-radius)
6. [Colors](#colors)
7. [Animation](#animation)
8. [Components](#components)
9. [Formatting Rules](#formatting-rules)

---

## Core Principles

### Design Philosophy

1. **Clarity** - Content is always legible. Every element serves a purpose.
2. **Deference** - The UI helps users understand content without competing with it.
3. **Depth** - Visual layers and motion convey hierarchy and interaction.
4. **Consistency** - Use standardized tokens. Never arbitrary values.

### Golden Rules

- ✅ Use design tokens from `src/lib/design-tokens.ts`
- ✅ Use `<Text>` component for all text
- ✅ Use `<Icon>` component for all icons
- ✅ Use formatting utilities from `src/lib/format.ts`
- ❌ Never use arbitrary colors (use semantic tokens)
- ❌ Never use arbitrary font sizes (use typography scale)
- ❌ Never use arbitrary icon sizes (use size variants)

---

## Typography

### Type Scale (8 Levels)

| Variant   | Size  | Weight   | Use Case                              |
|-----------|-------|----------|---------------------------------------|
| display   | 30px  | Bold     | Hero titles, main headings            |
| title-1   | 24px  | Semibold | Page titles, primary sections         |
| title-2   | 20px  | Semibold | Card titles, secondary headings       |
| title-3   | 18px  | Medium   | Subsection headers, important labels  |
| headline  | 16px  | Semibold | Emphasized body, list item titles     |
| body      | 14px  | Normal   | Standard body text                    |
| subhead   | 14px  | Normal   | Secondary info (muted)                |
| caption   | 12px  | Normal   | Labels, timestamps, metadata          |
| footnote  | 10px  | Medium   | Badges, counters (uppercase)          |

### Usage

```tsx
import { Text } from "@/components/ui/text";

// Page title
<Text variant="title-1">Device Control</Text>

// Card heading
<Text variant="title-2">Quick Clean</Text>

// Body text
<Text variant="body">Select rooms to clean.</Text>

// Muted caption
<Text variant="caption" color="muted">Last cleaned 2 hours ago</Text>

// Emphasized text
<Text variant="body" weight="semibold">Important info</Text>
```

### Rules

1. Use only the defined 8 typography levels
2. Never use arbitrary `text-[size]` values
3. Use semantic color props (`color="muted"`) not utility classes
4. Headlines should use `font-semibold`, not `font-bold`
5. Only `display` variant uses `font-bold`

---

## Icon Sizes

### Size Scale (6 Levels)

| Size | Pixels | Tailwind   | Use Case                          |
|------|--------|------------|-----------------------------------|
| xs   | 12px   | w-3 h-3    | Inline badges, caption text       |
| sm   | 16px   | w-4 h-4    | List items, body text inline      |
| md   | 20px   | w-5 h-5    | Buttons, navigation (DEFAULT)     |
| lg   | 24px   | w-6 h-6    | Card headers, section icons       |
| xl   | 32px   | w-8 h-8    | Feature icons, hero sections      |
| 2xl  | 48px   | w-12 h-12  | Large illustrations, empty states |

### Usage

```tsx
import { Icon } from "@/components/ui/icon";
import { Battery, Home, Settings } from "lucide-react";

// Default (20px)
<Icon icon={Home} />

// Small (16px)
<Icon icon={Battery} size="sm" />

// Large with color (24px)
<Icon icon={Settings} size="lg" color="primary" />

// Extra large (32px)
<Icon icon={Home} size="xl" color="muted" />
```

### Rules

1. Always use `<Icon>` wrapper - never raw Lucide components in new code
2. Button icons: use `md` (20px)
3. Inline text icons: use `sm` (16px)
4. Card header icons: use `lg` (24px)
5. Decorative/hero icons: use `xl` or `2xl`

---

## Spacing

### 4px Grid System

| Token | Tailwind | Pixels | Use Case                    |
|-------|----------|--------|-----------------------------|
| 2XS   | gap-0.5  | 2px    | Tight grouping              |
| XS    | gap-1    | 4px    | Inline elements             |
| SM    | gap-2    | 8px    | Related items               |
| MD    | gap-3    | 12px   | Default component spacing   |
| LG    | gap-4    | 16px   | Section spacing             |
| XL    | gap-6    | 24px   | Major sections              |
| 2XL   | gap-8    | 32px   | Page sections               |

### Rules

1. Stick to the 4px grid
2. ❌ Avoid: `gap-5`, `gap-7`, `gap-9` (not on grid)
3. ✅ Use: `gap-4`, `gap-6`, `gap-8` (on grid)
4. Page horizontal padding: `px-4` (16px)
5. Card internal padding: `p-4` (16px)
6. List item vertical padding: `py-3` (12px)

---

## Border Radius

### Standardized Radii

| Token | Tailwind    | Pixels | Use Case                    |
|-------|-------------|--------|-----------------------------|
| FULL  | rounded-full| 50%    | Pills, avatars, toggles     |
| 2XL   | rounded-2xl | 16px   | Cards, sheets, modals       |
| XL    | rounded-xl  | 12px   | Large buttons, containers   |
| LG    | rounded-lg  | 8px    | Buttons, inputs             |
| MD    | rounded-md  | 6px    | Small elements, chips       |
| SM    | rounded-sm  | 4px    | Subtle rounding             |

### Rules

1. Cards always use `rounded-2xl`
2. Buttons use `rounded-lg` (default) or `rounded-full` (pill)
3. Sheets/modals use `rounded-t-3xl` (top corners only)
4. Input fields use `rounded-lg`

---

## Colors

### Semantic Color Usage

| Purpose            | Token                    | CSS Variable          |
|--------------------|--------------------------|------------------------|
| Primary action     | `text-primary`           | --primary             |
| Secondary text     | `text-muted-foreground`  | --muted-foreground    |
| Destructive        | `text-destructive`       | --destructive         |
| Success            | `text-emerald-500`       | (direct)              |
| Warning            | `text-amber-500`         | (direct)              |
| Background         | `bg-background`          | --background          |
| Card               | `bg-card`                | --card                |
| Elevated card      | `bg-card-elevated`       | --card-elevated       |
| Border             | `border-border`          | --border              |

### Rules

1. ❌ Never use: `text-white`, `text-black`, `bg-gray-*`
2. ✅ Always use semantic tokens
3. Primary color (teal): HSL 174 72% 50%
4. Status colors are the exception (emerald, amber, red)

---

## Animation

### Duration Scale

| Name   | Duration | Use Case                        |
|--------|----------|---------------------------------|
| MICRO  | 150ms    | Hover, press states             |
| FAST   | 200ms    | Toggles, switches               |
| NORMAL | 300ms    | Default transitions             |
| SLOW   | 500ms    | Emphasis, reveals               |
| SLOWER | 700ms    | Page transitions                |

### Spring Presets (Framer Motion)

```tsx
import { SpringPreset } from "@/lib/design-tokens";

// Snappy - UI interactions
<motion.div transition={SpringPreset.SNAPPY} />

// Smooth - Standard animations
<motion.div transition={SpringPreset.SMOOTH} />

// Bouncy - Playful elements
<motion.div transition={SpringPreset.BOUNCY} />

// Gentle - Subtle motion
<motion.div transition={SpringPreset.GENTLE} />
```

### Rules

1. Use spring physics for interactive elements
2. Use ease-out for enter animations
3. Use ease-in for exit animations
4. Micro-interactions: 150ms
5. Standard transitions: 200-300ms
6. Loading/progress: linear easing

---

## Components

### Card Presets

```tsx
import { ComponentPreset } from "@/lib/design-tokens";

// Standard card
<div className={ComponentPreset.CARD}>...</div>

// Elevated card
<div className={ComponentPreset.CARD_ELEVATED}>...</div>

// Glass card
<div className={ComponentPreset.CARD_GLASS}>...</div>

// Interactive card
<div className={ComponentPreset.CARD_INTERACTIVE}>...</div>
```

### Button Hierarchy

1. **Primary** - Main actions, one per view
2. **Secondary** - Supporting actions
3. **Ghost** - Tertiary actions, navigation
4. **Destructive** - Dangerous actions (delete, cancel)

### Sheet Sizes

| Size   | Max Height | Use Case                    |
|--------|------------|-----------------------------|
| SMALL  | 40vh       | Confirmations, simple forms |
| MEDIUM | 60vh       | Standard sheets             |
| LARGE  | 85vh       | Complex content             |
| FULL   | 100dvh     | Full-screen modals          |

---

## Formatting Rules

### Time Display

| Context           | Format           | Example      |
|-------------------|------------------|--------------|
| Estimated time    | `{n} min`        | "45 min"     |
| Long duration     | `{h}h {m}m`      | "1h 30m"     |
| Countdown         | `{m}:{ss}`       | "2:05"       |
| Time of day       | `{h}:{mm} AM/PM` | "2:30 PM"    |
| Relative          | `{n} {unit} ago` | "2 hours ago"|

### Usage

```tsx
import { 
  formatEstimatedTime, 
  formatCountdown,
  formatDuration 
} from "@/lib/format";

// Estimated: "45 min"
formatEstimatedTime(45)

// Countdown: "2:05"
formatCountdown(125)

// Duration: "1h 30m"
formatDuration(5400)
```

### Rules

1. ❌ Never use `~` prefix (e.g., "~45 min")
2. ✅ Clean format: "45 min"
3. Use "min" not "mins" or "minutes"
4. Use "h" and "m" for compact duration
5. Battery percentage: whole numbers only

---

## File Structure

```
src/
├── lib/
│   ├── design-tokens.ts  # All design system constants
│   ├── format.ts         # Formatting utilities
│   └── utils.ts          # General utilities (cn, etc.)
├── components/
│   └── ui/
│       ├── text.tsx      # Typography component
│       ├── icon.tsx      # Icon wrapper component
│       └── ...           # Other shadcn components
```

---

## Quick Reference

```tsx
// Typography
<Text variant="title-1">Title</Text>
<Text variant="body" color="muted">Description</Text>

// Icons
<Icon icon={Home} size="md" />
<Icon icon={Battery} size="sm" color="primary" />

// Formatting
formatEstimatedTime(45)  // "45 min"
formatCountdown(125)     // "2:05"
formatPercentage(85)     // "85%"

// Tokens
import { Typography, IconSize, Spacing } from "@/lib/design-tokens";
```

---

*Last updated: 2024*
*Amphibia Robot Vacuum App Design System v1.0*
