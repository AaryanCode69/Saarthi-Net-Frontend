import { ZoomIn, ZoomOut, Locate, Layers } from "lucide-react";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface MapLayers {
  migration: boolean;
  periUrban: boolean;
  digitalExclusion: boolean;
}

export interface MapContainerProps {
  layers: MapLayers;
  // TODO: Add these props when backend integration is ready
  // geoJsonData?: unknown;
  // selectedRegion?: string;
  // onRegionSelect?: (regionId: string) => void;
  // tooltipData?: unknown;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

/**
 * Map Container - Visual placeholder for map visualization
 * 
 * NOTE: This is a UI placeholder only. No map library or GIS logic is implemented.
 * TODO: Replace with actual map implementation when backend provides GeoJSON data
 */
export function MapContainer({ layers }: MapContainerProps) {
  // Count active layers for display
  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="map-container w-full h-full rounded-md flex flex-col relative overflow-hidden animate-scale-in">
      {/* Map Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">Interactive Map</p>
            <p className="text-sm text-muted-foreground">Map visualization will render here</p>
          </div>
          {activeLayerCount > 0 && (
            <p className="text-xs text-muted-foreground animate-fade-in">
              {activeLayerCount} layer{activeLayerCount > 1 ? "s" : ""} active
            </p>
          )}
        </div>
      </div>

      {/* Zoom Controls - UI only, no functionality */}
      {/* TODO: Connect zoom controls when map library is integrated */}
      <div className="absolute right-4 top-4 flex flex-col gap-1">
        <button className="map-control-btn" title="Zoom In">
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button className="map-control-btn" title="Zoom Out">
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
        <button className="map-control-btn mt-2" title="My Location">
          <Locate className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Tooltip Overlay Placeholder */}
      {/* TODO: Replace with dynamic tooltip from backend data */}
      <div className="absolute left-4 bottom-4 bg-card border border-border rounded-md p-3 shadow-sm max-w-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Hover Tooltip</p>
        <p className="text-sm text-foreground">Location details will appear here on interaction</p>
      </div>

      {/* Active Layers Indicator */}
      <div className="absolute left-4 top-4 bg-card border border-border rounded-md px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Active Layers: {activeLayerCount}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          {layers.migration && (
            <span className="legend-dot-migration animate-scale-in" title="Migration" />
          )}
          {layers.periUrban && (
            <span className="legend-dot-periurban animate-scale-in" title="Peri-Urban" />
          )}
          {layers.digitalExclusion && (
            <span className="legend-dot-exclusion animate-scale-in" title="Digital Exclusion" />
          )}
        </div>
      </div>
    </div>
  );
}
