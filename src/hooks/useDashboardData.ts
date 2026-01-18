/**
 * Dashboard Data Hooks
 * 
 * React Query hooks for fetching dashboard intelligence data.
 * These hooks handle loading states, error handling, and cache management.
 */

import { useQuery } from "@tanstack/react-query";
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
 */
export function useMigrationData({ district, period, enabled = true }: UseDashboardDataParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.migration(district, period),
    queryFn: () => fetchMigrationData({ district, period }),
    select: transformMigrationData,
    enabled: enabled && !!district && !!period,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching peri-urban growth data
 */
export function usePeriUrbanData({ district, period, enabled = true }: UseDashboardDataParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.periUrban(district, period),
    queryFn: () => fetchPeriUrbanData({ district, period }),
    select: transformPeriUrbanData,
    enabled: enabled && !!district && !!period,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching digital exclusion risk data
 */
export function useDigitalRiskData({ district, period, enabled = true }: UseDashboardDataParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.digitalRisk(district, period),
    queryFn: () => fetchDigitalRiskData({ district, period }),
    select: transformDigitalRiskData,
    enabled: enabled && !!district && !!period,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================
// COMBINED HOOK
// ============================================================

/**
 * Combined hook for all dashboard data
 * Fetches all three data sources in parallel
 */
export function useDashboardData({ district, period }: UseDashboardDataParams) {
  const migration = useMigrationData({ district, period });
  const periUrban = usePeriUrbanData({ district, period });
  const digitalRisk = useDigitalRiskData({ district, period });

  return {
    migration,
    periUrban,
    digitalRisk,
    isLoading: migration.isLoading || periUrban.isLoading || digitalRisk.isLoading,
    isError: migration.isError || periUrban.isError || digitalRisk.isError,
  };
}
