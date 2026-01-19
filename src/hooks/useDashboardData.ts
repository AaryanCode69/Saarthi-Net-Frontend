/**
 * Dashboard Data Hooks
 * 
 * React Query hooks for fetching dashboard intelligence data.
 * These hooks handle loading states, error handling, and cache management.
 * 
 * PHASE 5: Demo Hardening
 * - Enhanced cache configuration for stability
 * - Preserves last known good data on errors
 * - Minimal retry attempts for quick failure
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import {
  fetchMigrationData,
  fetchPeriUrbanData,
  fetchDigitalRiskData,
} from "@/api";
import type {
  MigrationApiResponse,
  PeriUrbanApiResponse,
  DigitalRiskApiResponse,
} from "@/api";
import type {
  MigrationData,
  PeriUrbanData,
  DigitalExclusionData,
} from "@/mock/dashboardData";
import {
  CACHE_STALE_TIME_MS,
  CACHE_TIME_MS,
  API_RETRY_COUNT,
  API_RETRY_DELAY_MS,
  FALLBACK_MIGRATION_DATA,
  FALLBACK_PERIURBAN_DATA,
  FALLBACK_DIGITAL_EXCLUSION_DATA,
} from "@/config/demoDefaults";

// ============================================================
// QUERY KEYS
// ============================================================

export const dashboardQueryKeys = {
  migration: (district: string, period: string) =>
    ["migration", district, period] as const,
  periUrban: (district: string, period: string) =>
    ["periUrban", district, period] as const,
  digitalRisk: (district: string, period: string) =>
    ["digitalRisk", district, period] as const,
};

// ============================================================
// DATA TRANSFORMERS
// ============================================================

/**
 * Transform API response to component-compatible format
 * No computation - only field mapping and formatting
 */
function transformMigrationData(response: MigrationApiResponse): MigrationData {
  const totalMovement = response.inflow + response.outflow;
  return {
    netMigrationPercent: response.netMigrationPercent,
    trend: response.netMigrationPercent >= 0 ? "up" : "down",
    topSourceDistrict: response.topSourceDistrict,
    totalMovement: totalMovement.toLocaleString(),
    inflow: response.inflow,
    outflow: response.outflow,
  };
}

function transformPeriUrbanData(response: PeriUrbanApiResponse): PeriUrbanData {
  return {
    alertStatus: response.alertStatus === "ALERT" ? "Detected" : "None",
    growthIndex: response.growthIndex,
    affectedZones: response.affectedZones,
    explanation: response.alertStatus === "ALERT"
      ? `Elevated growth pattern identified in ${response.affectedZones} peripheral zone${response.affectedZones > 1 ? "s" : ""} of ${response.district} district.`
      : null,
  };
}

function transformDigitalRiskData(response: DigitalRiskApiResponse): DigitalExclusionData {
  const riskLevelMap: Record<string, "Low" | "Medium" | "High"> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  return {
    aadhaarCoverage: response.aadhaarCoverage,
    digitalUsability: response.digitalUsability,
    riskLevel: riskLevelMap[response.riskLevel] || null,
    atRiskPopulation: response.atRiskPopulation.toLocaleString(),
  };
}

// ============================================================
// HOOKS
// ============================================================

interface UseDashboardDataParams {
  district: string;
  period: string;
  enabled?: boolean;
}

/**
 * Hook for fetching migration intelligence data
 * Preserves last known good data on errors
 */
export function useMigrationData({ district, period, enabled = true }: UseDashboardDataParams) {
  const lastGoodDataRef = useRef<MigrationData | null>(null);
  
  const query = useQuery({
    queryKey: dashboardQueryKeys.migration(district, period),
    queryFn: () => fetchMigrationData({ district, period }),
    select: transformMigrationData,
    enabled: enabled && !!district && !!period,
    staleTime: CACHE_STALE_TIME_MS,
    gcTime: CACHE_TIME_MS,
    retry: API_RETRY_COUNT,
    retryDelay: API_RETRY_DELAY_MS,
    placeholderData: (previousData) => previousData,
  });

  // Track last good data for failure recovery
  useEffect(() => {
    if (query.data && !query.isError) {
      lastGoodDataRef.current = query.data;
    }
  }, [query.data, query.isError]);

  return {
    ...query,
    // Provide last known good data or fallback on error
    data: query.isError ? (lastGoodDataRef.current ?? FALLBACK_MIGRATION_DATA as MigrationData) : query.data,
    lastGoodData: lastGoodDataRef.current,
  };
}

/**
 * Hook for fetching peri-urban growth data
 * Preserves last known good data on errors
 */
export function usePeriUrbanData({ district, period, enabled = true }: UseDashboardDataParams) {
  const lastGoodDataRef = useRef<PeriUrbanData | null>(null);
  
  const query = useQuery({
    queryKey: dashboardQueryKeys.periUrban(district, period),
    queryFn: () => fetchPeriUrbanData({ district, period }),
    select: transformPeriUrbanData,
    enabled: enabled && !!district && !!period,
    staleTime: CACHE_STALE_TIME_MS,
    gcTime: CACHE_TIME_MS,
    retry: API_RETRY_COUNT,
    retryDelay: API_RETRY_DELAY_MS,
    placeholderData: (previousData) => previousData,
  });

  // Track last good data for failure recovery
  useEffect(() => {
    if (query.data && !query.isError) {
      lastGoodDataRef.current = query.data;
    }
  }, [query.data, query.isError]);

  return {
    ...query,
    data: query.isError ? (lastGoodDataRef.current ?? FALLBACK_PERIURBAN_DATA as PeriUrbanData) : query.data,
    lastGoodData: lastGoodDataRef.current,
  };
}

/**
 * Hook for fetching digital exclusion risk data
 * Preserves last known good data on errors
 */
export function useDigitalRiskData({ district, period, enabled = true }: UseDashboardDataParams) {
  const lastGoodDataRef = useRef<DigitalExclusionData | null>(null);
  
  const query = useQuery({
    queryKey: dashboardQueryKeys.digitalRisk(district, period),
    queryFn: () => fetchDigitalRiskData({ district, period }),
    select: transformDigitalRiskData,
    enabled: enabled && !!district && !!period,
    staleTime: CACHE_STALE_TIME_MS,
    gcTime: CACHE_TIME_MS,
    retry: API_RETRY_COUNT,
    retryDelay: API_RETRY_DELAY_MS,
    placeholderData: (previousData) => previousData,
  });

  // Track last good data for failure recovery
  useEffect(() => {
    if (query.data && !query.isError) {
      lastGoodDataRef.current = query.data;
    }
  }, [query.data, query.isError]);

  return {
    ...query,
    data: query.isError ? (lastGoodDataRef.current ?? FALLBACK_DIGITAL_EXCLUSION_DATA as DigitalExclusionData) : query.data,
    lastGoodData: lastGoodDataRef.current,
  };
}

// ============================================================
// COMBINED HOOK
// ============================================================

/**
 * Combined hook for all dashboard data
 * Fetches all three data sources in parallel
 * 
 * PHASE 5: Enhanced with granular loading states
 */
export function useDashboardData({ district, period }: UseDashboardDataParams) {
  const migration = useMigrationData({ district, period });
  const periUrban = usePeriUrbanData({ district, period });
  const digitalRisk = useDigitalRiskData({ district, period });

  // Granular loading state for better UX messaging
  const loadingCount = [migration.isLoading, periUrban.isLoading, digitalRisk.isLoading].filter(Boolean).length;
  const isPartiallyLoading = loadingCount > 0 && loadingCount < 3;
  const isFullyLoading = loadingCount === 3;

  return {
    migration,
    periUrban,
    digitalRisk,
    isLoading: migration.isLoading || periUrban.isLoading || digitalRisk.isLoading,
    isPartiallyLoading,
    isFullyLoading,
    isError: migration.isError || periUrban.isError || digitalRisk.isError,
    // Check if any data is available (for initial load detection)
    hasAnyData: !!(migration.data || periUrban.data || digitalRisk.data),
  };
}

// ============================================================
// GLOBAL STATE INTEGRATED HOOK
// ============================================================

import { useFilterParams } from "@/store/filters";

/**
 * Dashboard data hook that automatically reads from global filter state.
 * This is the preferred hook for components that need dashboard data.
 * 
 * Data flow:
 * Global Filter State → API Fetch Layer → Insight Panels (render only)
 */
export function useDashboardDataFromGlobalState() {
  const { district, period } = useFilterParams();
  return useDashboardData({ district, period });
}
