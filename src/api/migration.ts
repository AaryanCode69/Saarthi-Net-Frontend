/**
 * Migration API Service
 * 
 * Fetches migration intelligence data from the backend.
 * GET /api/migration?district={district}&period={period}
 */

import { buildApiUrl, apiFetch } from "./config";
import type { MigrationApiResponse, ApiRequestParams } from "./types";

/**
 * Fetch migration data for a specific district and time period
 * 
 * @param params - District and period parameters
 * @returns Promise resolving to migration data
 */
export async function fetchMigrationData(
  params: ApiRequestParams
): Promise<MigrationApiResponse> {
  const url = buildApiUrl("/api/migration", {
    district: params.district,
    period: params.period,
  });

  return apiFetch<MigrationApiResponse>(url);
}
