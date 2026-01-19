/**
 * Demo Defaults Configuration
 * 
 * Centralized configuration for demo-safe default values.
 * These values ensure the dashboard loads with meaningful data
 * immediately, without requiring any user interaction.
 * 
 * PHASE 5: Demo Hardening & Failure Safety
 */

// ============================================================
// DEFAULT SELECTIONS
// ============================================================

/**
 * Default district to load on app start
 * Selected for having well-populated, reliable data
 */
export const DEFAULT_DISTRICT = "patna";

/**
 * Default time period to load on app start
 * 30 days provides a good balance of data availability
 */
export const DEFAULT_PERIOD = "30d";

/**
 * Default layer visibility configuration
 * Only ONE layer should be active by default for clean initial view
 */
export const DEFAULT_LAYERS = {
  migration: true,
  periUrban: false,
  digitalRisk: false,
} as const;

// ============================================================
// LAYER SAFETY GUARDS
// ============================================================

/**
 * Minimum number of layers that must be visible at any time
 * Prevents demo-breaking scenario where all layers are disabled
 */
export const MIN_VISIBLE_LAYERS = 1;

/**
 * Fallback layer to enable if all layers would be disabled
 * This is the layer that will be force-enabled as a safety net
 */
export const FALLBACK_LAYER = "migration" as const;

// ============================================================
// LOADING STATE MESSAGES
// ============================================================

export const LOADING_MESSAGES = {
  /** Initial load message */
  initial: "Loading district insights…",
  /** Partial data load message */
  partial: "Some insights are still loading…",
  /** API failure message */
  error: "Data temporarily unavailable",
  /** No data available message */
  noData: "No data available for this selection",
} as const;

// ============================================================
// CACHE & RETRY CONFIGURATION
// ============================================================

/**
 * Stale time for React Query cache (5 minutes)
 * Data is considered fresh for this duration
 */
export const CACHE_STALE_TIME_MS = 5 * 60 * 1000;

/**
 * Cache time for React Query (30 minutes)
 * Data remains in cache even if stale
 */
export const CACHE_TIME_MS = 30 * 60 * 1000;

/**
 * Number of retry attempts for failed API calls
 * Set to 1 for quick failure during demo
 */
export const API_RETRY_COUNT = 1;

/**
 * Delay between retry attempts (ms)
 */
export const API_RETRY_DELAY_MS = 1000;

// ============================================================
// FALLBACK DATA
// ============================================================

/**
 * Fallback data to use when API fails
 * Provides meaningful placeholder values for demo continuity
 * 
 * NOTE: These are static fallback values, NOT computed intelligence.
 * Real values come from backend APIs.
 */
export const FALLBACK_MIGRATION_DATA = {
  netMigrationPercent: null,
  trend: null,
  topSourceDistrict: null,
  totalMovement: null,
  inflow: null,
  outflow: null,
} as const;

export const FALLBACK_PERIURBAN_DATA = {
  alertStatus: null,
  growthIndex: null,
  affectedZones: null,
  explanation: null,
} as const;

export const FALLBACK_DIGITAL_EXCLUSION_DATA = {
  aadhaarCoverage: null,
  digitalUsability: null,
  riskLevel: null,
  atRiskPopulation: null,
} as const;

// ============================================================
// VALID COMBINATIONS
// ============================================================

/**
 * Valid time periods for selection
 * Used to validate and guard against invalid combinations
 */
export const VALID_PERIODS = ["7d", "30d", "90d", "1y"] as const;

/**
 * Check if a period value is valid
 */
export function isValidPeriod(period: string): boolean {
  return VALID_PERIODS.includes(period as typeof VALID_PERIODS[number]);
}

/**
 * Ensure period is valid, fallback to default if not
 */
export function ensureValidPeriod(period: string): string {
  return isValidPeriod(period) ? period : DEFAULT_PERIOD;
}
