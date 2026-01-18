/**
 * Digital Risk API Service
 * 
 * Fetches digital exclusion risk data from the backend.
 * GET /api/digital-risk?district={district}&period={period}
 */

import { buildApiUrl, apiFetch } from "./config";
import type { DigitalRiskApiResponse, ApiRequestParams } from "./types";

/**
 * Fetch digital exclusion risk data for a specific district and time period
 * 
 * @param params - District and period parameters
 * @returns Promise resolving to digital risk data
 */
export async function fetchDigitalRiskData(
  params: ApiRequestParams
): Promise<DigitalRiskApiResponse> {
  const url = buildApiUrl("/api/digital-risk", {
    district: params.district,
    period: params.period,
  });

  return apiFetch<DigitalRiskApiResponse>(url);
}
