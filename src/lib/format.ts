/**
 * ============================================
 * FORMAT UTILITIES - Amphibia Design System
 * ============================================
 * 
 * Standardized formatting functions for consistent
 * display of time, numbers, and other values.
 * 
 * RULES:
 * 1. Estimated times: "{number} min" (no ~ prefix)
 * 2. Countdown: "{m}:{ss}" format
 * 3. Duration: "{h}h {m}m" for hours, "{m} min" for under an hour
 * 4. Percentages: "{number}%" (no decimals unless needed)
 */

// ============================================
// TIME FORMATTING
// ============================================

/**
 * Format estimated time (for display before action)
 * @example formatEstimatedTime(45) → "45 min"
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${Math.round(minutes)} min`;
}

/**
 * Format countdown time (for active timers)
 * @example formatCountdown(125) → "2:05"
 */
export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/**
 * Format duration from seconds
 * @example formatDuration(3665) → "1h 1m"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

/**
 * Format time of day
 * @example formatTimeOfDay(new Date()) → "2:30 PM"
 */
export function formatTimeOfDay(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format relative time
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) → "1 hour ago"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format percentage
 * @example formatPercentage(85) → "85%"
 * @example formatPercentage(85.5, 1) → "85.5%"
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format area in square meters/feet
 * @example formatArea(25) → "25 m²"
 */
export function formatArea(sqMeters: number): string {
  return `${Math.round(sqMeters)} m²`;
}

/**
 * Format distance
 * @example formatDistance(1500) → "1.5 km"
 * @example formatDistance(500) → "500 m"
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

// ============================================
// BATTERY FORMATTING
// ============================================

/**
 * Get battery status text
 * @example getBatteryStatus(85) → { text: "85%", level: "high" }
 */
export function getBatteryStatus(percent: number): {
  text: string;
  level: "critical" | "low" | "medium" | "high" | "full";
} {
  const text = `${Math.round(percent)}%`;

  if (percent <= 10) return { text, level: "critical" };
  if (percent <= 20) return { text, level: "low" };
  if (percent <= 50) return { text, level: "medium" };
  if (percent <= 90) return { text, level: "high" };
  return { text, level: "full" };
}

/**
 * Estimate battery usage for cleaning
 * @param minutes - Estimated cleaning time
 * @param drainRate - Battery drain per minute (default: 0.65%)
 */
export function estimateBatteryUsage(
  minutes: number,
  drainRate = 0.65
): number {
  return Math.round(minutes * drainRate);
}

/**
 * Calculate remaining battery after task
 */
export function calculateRemainingBattery(
  currentPercent: number,
  taskMinutes: number,
  drainRate = 0.65
): number {
  const usage = estimateBatteryUsage(taskMinutes, drainRate);
  return Math.max(0, currentPercent - usage);
}
