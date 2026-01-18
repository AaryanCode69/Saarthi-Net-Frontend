import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FiltersPanel } from "@/components/dashboard/FiltersPanel";
import { MapContainer } from "@/components/dashboard/MapContainer";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { LegendStrip } from "@/components/dashboard/LegendStrip";

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
          <InsightsPanel />
        </div>
      </div>

      {/* Bottom Legend Strip */}
      <LegendStrip />
    </div>
  );
};

export default Index;
