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

// Default empty data for when API hasn't returned yet
const emptyMigrationData: MigrationData = {
  netMigrationPercent: null,
  trend: null,
  topSourceDistrict: null,
  totalMovement: null,
  inflow: null,
  outflow: null,
};

const emptyPeriUrbanData: PeriUrbanData = {
  alertStatus: null,
  growthIndex: null,
  affectedZones: null,
  explanation: null,
};

const emptyDigitalExclusionData: DigitalExclusionData = {
  aadhaarCoverage: null,
  digitalUsability: null,
  riskLevel: null,
  atRiskPopulation: null,
};

/**
 * Dashboard Index Page
 * 
 * Data flow:
 * Global Filter State → API Fetch Layer → Insight Panels (render only)
 * 
 * All filter state is managed globally via FilterProvider (in App.tsx).
 * Components read from and write to the global state.
 */
const Index = () => {
  // Fetch dashboard data from backend APIs using global filter state
  // Data automatically refetches when district or period changes
  const { migration, periUrban, digitalRisk } = useDashboardDataFromGlobalState();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Header - Sticky */}
      {/* Reads district/period from global state */}
      <DashboardHeader />

      {/* Main Content Area - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters Panel (~20%) */}
        {/* Reads/writes all filters and layers from global state */}
        <div className="w-[20%] min-w-[200px] max-w-[280px] border-r border-border overflow-y-auto">
          <FiltersPanel />
        </div>

        {/* Center - Map Container (~55-60%) */}
        {/* Reads layer toggles from global state */}
        <div className="flex-1 p-4 min-w-0">
          <MapContainer />
        </div>

        {/* Right Sidebar - Insights Panel (~20-25%) */}
        {/* Receives data from API via props (render only) */}
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
