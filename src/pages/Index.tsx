import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FiltersPanel } from "@/components/dashboard/FiltersPanel";
import { MapContainer } from "@/components/dashboard/MapContainer";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { LegendStrip } from "@/components/dashboard/LegendStrip";
import { useDashboardData } from "@/hooks/useDashboardData";
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

const Index = () => {
  // State for filters
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  // State for layer toggles
  const [layers, setLayers] = useState({
    migration: true,
    periUrban: true,
    digitalExclusion: false,
  });

  const handleLayerToggle = (layer: keyof typeof layers) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  // Fetch dashboard data from backend APIs
  const { migration, periUrban, digitalRisk } = useDashboardData({
    district: selectedDistrict,
    period: selectedTimeRange,
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Header - Sticky */}
      <DashboardHeader
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
      />

      {/* Main Content Area - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters Panel (~20%) */}
        <div className="w-[20%] min-w-[200px] max-w-[280px] border-r border-border overflow-y-auto">
          <FiltersPanel
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
            layers={layers}
            onLayerToggle={handleLayerToggle}
          />
        </div>

        {/* Center - Map Container (~55-60%) */}
        <div className="flex-1 p-4 min-w-0">
          <MapContainer layers={layers} />
        </div>

        {/* Right Sidebar - Insights Panel (~20-25%) */}
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
