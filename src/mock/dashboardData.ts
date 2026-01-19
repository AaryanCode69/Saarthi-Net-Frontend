/**
 * Centralized Mock Data for Saarthi Net Dashboard
 * 
 * This file contains all temporary/placeholder data used across dashboard components.
 * All values are intentionally set to null to indicate they will be replaced by backend API responses.
 * 
 * TODO: Replace with backend API response when integration is ready
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface MigrationData {
  netMigrationPercent: number | null;
  trend: "up" | "down" | null;
  topSourceDistrict: string | null;
  totalMovement: string | null;
  inflow: number | null;
  outflow: number | null;
}

export interface PeriUrbanData {
  alertStatus: "Detected" | "None" | null;
  growthIndex: number | null;
  affectedZones: number | null;
  explanation: string | null;
}

export interface DigitalExclusionData {
  aadhaarCoverage: number | null;
  digitalUsability: number | null;
  riskLevel: "Low" | "Medium" | "High" | null;
  atRiskPopulation: string | null;
}

export interface DistrictOption {
  value: string;
  label: string;
}

export interface TimeRangeOption {
  value: string;
  label: string;
}

// ============================================================
// MOCK DATA - All values null for integration readiness
// ============================================================

/**
 * Migration data placeholder
 * TODO: Replace with backend API response
 */
export const mockMigrationData: MigrationData = {
  netMigrationPercent: null,
  trend: null,
  topSourceDistrict: null,
  totalMovement: null,
  inflow: null,
  outflow: null,
};

/**
 * Peri-Urban growth data placeholder
 * TODO: Replace with backend API response
 */
export const mockPeriUrbanData: PeriUrbanData = {
  alertStatus: null,
  growthIndex: null,
  affectedZones: null,
  explanation: null,
};

/**
 * Digital exclusion risk data placeholder
 * TODO: Replace with backend API response
 */
export const mockDigitalExclusionData: DigitalExclusionData = {
  aadhaarCoverage: null,
  digitalUsability: null,
  riskLevel: null,
  atRiskPopulation: null,
};

// ============================================================
// FILTER OPTIONS - Static UI data (not from backend)
// ============================================================

/**
 * District filter options
 * These are static UI options, not intelligence data
 */
export const districtOptions: DistrictOption[] = [
  { value: "all", label: "All Districts" },
  { value: "patna", label: "Patna" },
  { value: "gaya", label: "Gaya" },
  { value: "muzaffarpur", label: "Muzaffarpur" },
  { value: "bhagalpur", label: "Bhagalpur" },
  { value: "darbhanga", label: "Darbhanga" },
];

/**
 * Time range filter options
 * These are static UI options, not intelligence data
 */
export const timeRangeOptions: TimeRangeOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Safely formats a value for display, returning "--" if null/undefined
 */
export function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "--";
  }
  return String(value);
}

/**
 * Formats a value with loading state awareness
 */
export function formatValueWithLoading(
  value: string | number | null | undefined,
  isLoading?: boolean
): string {
  if (isLoading) return "Loading…";
  if (value === null || value === undefined) return "Not available";
  return String(value);
}

/**
 * Safely formats a percentage value for display
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "--";
  }
  return `${value}%`;
}

/**
 * Formats a percentage with loading state awareness
 */
export function formatPercentWithLoading(
  value: number | null | undefined,
  isLoading?: boolean
): string {
  if (isLoading) return "Loading…";
  if (value === null || value === undefined) return "Not available";
  return `${value}%`;
}

/**
 * Safely formats a number with sign (e.g., +12.4%)
 */
export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "--";
  }
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

/**
 * Formats a signed percentage with loading state awareness
 */
export function formatSignedPercentWithLoading(
  value: number | null | undefined,
  isLoading?: boolean
): string {
  if (isLoading) return "Loading…";
  if (value === null || value === undefined) return "Not available";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

/**
 * Safely formats an index value (e.g., 0.73)
 */
export function formatIndex(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "--";
  }
  return value.toFixed(2);
}

/**
 * Formats an index with loading state awareness
 */
export function formatIndexWithLoading(
  value: number | null | undefined,
  isLoading?: boolean
): string {
  if (isLoading) return "Loading…";
  if (value === null || value === undefined) return "Not available";
  return value.toFixed(2);
}
