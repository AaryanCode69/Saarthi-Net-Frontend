/**
 * API Response Types
 * 
 * These interfaces match the backend API contract exactly.
 * Do NOT modify these without corresponding backend changes.
 */

// ============================================================
// COMMON TYPES
// ============================================================

export interface ApiRequestParams {
  district: string;
  period: string;
}

// ============================================================
// MIGRATION API
// ============================================================

/**
 * GET /api/migration?district={district}&period={period}
 */
export interface MigrationApiResponse {
  district: string;
  netMigrationPercent: number;
  inflow: number;
  outflow: number;
  topSourceDistrict: string;
  heatmap?: unknown; // Reserved for future map integration (GeoJSON FeatureCollection)
}

// ============================================================
// PERI-URBAN API
// ============================================================

/**
 * GET /api/peri-urban?district={district}&period={period}
 */
export interface PeriUrbanApiResponse {
  district: string;
  alertStatus: "ALERT" | "NONE";
  growthIndex: number;
  affectedZones: number;
  zones?: unknown; // Reserved for future map integration (GeoJSON FeatureCollection)
}

// ============================================================
// DIGITAL RISK API
// ============================================================

/**
 * GET /api/digital-risk?district={district}&period={period}
 */
export interface DigitalRiskApiResponse {
  district: string;
  aadhaarCoverage: number;
  digitalUsability: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  atRiskPopulation: number;
}

// ============================================================
// ERROR TYPES
// ============================================================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
