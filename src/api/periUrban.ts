/**
 * Peri-Urban API Service
 * 
 * Fetches peri-urban growth intelligence data from the backend.
 * GET /api/peri-urban?district={district}&period={period}
 */

import { buildApiUrl, apiFetch } from "./config";
import type { PeriUrbanApiResponse, ApiRequestParams } from "./types";

/**
 * Fetch peri-urban growth data for a specific district and time period
 * 
 * @param params - District and period parameters
 * @returns Promise resolving to peri-urban data
 */
export async function fetchPeriUrbanData(
  params: ApiRequestParams
): Promise<PeriUrbanApiResponse> {
  const url = buildApiUrl("/api/peri-urban", {
    district: params.district,
    period: params.period,
  });

  return apiFetch<PeriUrbanApiResponse>(url);
}
