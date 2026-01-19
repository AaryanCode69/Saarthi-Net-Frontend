import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FiltersPanel } from "@/components/dashboard/FiltersPanel";
import { MapContainer } from "@/components/dashboard/MapContainer";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { LegendStrip } from "@/components/dashboard/LegendStrip";
import { useDashboardDataFromGlobalState } from "@/hooks/useDashboardData";
import {
  MigrationData,
  PeriUrbanData,
  DigitalExclusionData,
} from "@/mock/dashboardData";
import {
  FALLBACK_MIGRATION_DATA,
  FALLBACK_PERIURBAN_DATA,
  FALLBACK_DIGITAL_EXCLUSION_DATA,
  LOADING_MESSAGES,
} from "@/config/demoDefaults";

// Default empty data for when API hasn't returned yet
const emptyMigrationData: MigrationData = FALLBACK_MIGRATION_DATA as MigrationData;
const emptyPeriUrbanData: PeriUrbanData = FALLBACK_PERIURBAN_DATA as PeriUrbanData;
const emptyDigitalExclusionData: DigitalExclusionData = FALLBACK_DIGITAL_EXCLUSION_DATA as DigitalExclusionData;

/**
 * Loading Status Banner
 * 
 * Text-only indicator for loading states (no spinners per Phase 5 rules).
 * Shows appropriate message based on loading state.
 */
function LoadingStatusBanner({
  isFullyLoading,
  isPartiallyLoading,
  hasError,
}: {
  isFullyLoading: boolean;
  isPartiallyLoading: boolean;
  hasError: boolean;
}) {
  // No banner needed if everything is loaded without errors
  if (!isFullyLoading && !isPartiallyLoading && !hasError) {
    return null;
  }

  let message = "";
  let bgColor = "bg-muted";
  
  if (isFullyLoading) {
    message = LOADING_MESSAGES.initial;
    bgColor = "bg-muted";
  } else if (isPartiallyLoading) {
    message = LOADING_MESSAGES.partial;
    bgColor = "bg-muted";
  } else if (hasError) {
    message = LOADING_MESSAGES.error;
    bgColor = "bg-yellow-50 dark:bg-yellow-950/20";
  }

  return (
    <div className={`px-4 py-1.5 text-center text-sm text-muted-foreground ${bgColor}`}>
      {message}
    </div>
  );
}

/**
 * Dashboard Index Page
 * 
 * Data flow:
 * Global Filter State → API Fetch Layer → Insight Panels (render only)
 * 
 * All filter state is managed globally via FilterProvider (in App.tsx).
 * Components read from and write to the global state.
 * 
 * PHASE 5: Demo Hardening
 * - Loads with demo defaults immediately (no user interaction required)
 * - Gracefully handles API failures with text-only indicators
 * - Preserves last known good data on errors
 * - Map remains visible even if data fails
 */
const Index = () => {
  // Fetch dashboard data from backend APIs using global filter state
  // Data automatically refetches when district or period changes
  const { 
    migration, 
    periUrban, 
    digitalRisk,
    isFullyLoading,
    isPartiallyLoading,
    isError,
  } = useDashboardDataFromGlobalState();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Header - Sticky */}
      {/* Reads district/period from global state */}
      <DashboardHeader />

      {/* Loading Status Banner - Text only, no spinners */}
      <LoadingStatusBanner
        isFullyLoading={isFullyLoading}
        isPartiallyLoading={isPartiallyLoading}
        hasError={isError}
      />

      {/* Main Content Area - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters Panel (~20%) */}
        {/* Reads/writes all filters and layers from global state */}
        <div className="w-[20%] min-w-[200px] max-w-[280px] border-r border-border overflow-y-auto">
          <FiltersPanel />
        </div>

        {/* Center - Map Container (~55-60%) */}
        {/* Map is always rendered - never empty even on data failure */}
        <div className="flex-1 p-4 min-w-0">
          <MapContainer />
        </div>

        {/* Right Sidebar - Insights Panel (~20-25%) */}
        {/* Receives data from API via props (render only) */}
        {/* Uses fallback data on errors to prevent empty states */}
        <div className="w-[25%] min-w-[280px] max-w-[360px] border-l border-border overflow-y-auto">
          <InsightsPanel
            migrationData={migration.data ?? emptyMigrationData}
            periUrbanData={periUrban.data ?? emptyPeriUrbanData}
            digitalExclusionData={digitalRisk.data ?? emptyDigitalExclusionData}
            migrationLoading={migration.isLoading}
            periUrbanLoading={periUrban.isLoading}
            digitalRiskLoading={digitalRisk.isLoading}
            migrationError={migration.isError}
            periUrbanError={periUrban.isError}
            digitalRiskError={digitalRisk.isError}
          />
        </div>
      </div>

      {/* Bottom Legend Strip */}
      <LegendStrip />
    </div>
  );
};

export default Index;
