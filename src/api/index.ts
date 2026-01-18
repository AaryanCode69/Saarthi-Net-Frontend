/**
 * API Service Layer - Barrel Export
 * 
 * Central export point for all API services and types.
 */

// API fetch functions
export { fetchMigrationData } from "./migration";
export { fetchPeriUrbanData } from "./periUrban";
export { fetchDigitalRiskData } from "./digitalRisk";

// Types
export type {
  ApiRequestParams,
  MigrationApiResponse,
  PeriUrbanApiResponse,
  DigitalRiskApiResponse,
  ApiError,
} from "./types";

// Config
export { API_BASE_URL } from "./config";
