import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZoomIn, ZoomOut, Locate, Layers } from "lucide-react";
import { useFilters, LayerState } from "@/store/filters";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/** GeoJSON Feature for type-safe property access */
interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSON.Geometry;
  properties: Record<string, unknown>;
}

/** GeoJSON FeatureCollection */
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface MapContainerProps {
  /** Optional: Override layer state for testing. If not provided, uses global state. */
  layersOverride?: LayerState;
  /** Optional: District for map centering */
  district?: string;
  /** Optional: Period for data context (informational only) */
  period?: string;
  /** GeoJSON data for migration heatmap layer */
  migrationGeoJSON?: GeoJSONFeatureCollection | null;
  /** GeoJSON data for peri-urban alert layer */
  periUrbanGeoJSON?: GeoJSONFeatureCollection | null;
  /** GeoJSON data for digital exclusion overlay */
  digitalRiskGeoJSON?: GeoJSONFeatureCollection | null;
  /** Callback when district is clicked (for selection) */
  onDistrictClick?: (districtName: string) => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 20.5937];
const INDIA_ZOOM = 4.5;

// Layer IDs
const LAYER_IDS = {
  migration: "migration-layer",
  migrationSource: "migration-source",
  periUrban: "peri-urban-layer",
  periUrbanSource: "peri-urban-source",
  periUrbanOutline: "peri-urban-outline-layer",
  digitalRisk: "digital-risk-layer",
  digitalRiskSource: "digital-risk-source",
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate bounds from GeoJSON FeatureCollection
 */
function getBoundsFromGeoJSON(
  geojson: GeoJSONFeatureCollection
): mapboxgl.LngLatBoundsLike | null {
  if (!geojson.features || geojson.features.length === 0) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const processCoordinates = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    } else {
      coords.forEach(processCoordinates);
    }
  };

  geojson.features.forEach((feature) => {
    if (feature.geometry && "coordinates" in feature.geometry) {
      processCoordinates(feature.geometry.coordinates);
    }
  });

  if (minLng === Infinity) return null;

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

// ============================================================
// MAIN COMPONENT
// ============================================================

/**
 * Map Container - Mapbox GL JS map visualization
 *
 * Renders GeoJSON layers based on global filter state and layer toggles.
 * This component ONLY renders data - no intelligence computation.
 */
export function MapContainer({
  layersOverride,
  district,
  migrationGeoJSON,
  periUrbanGeoJSON,
  digitalRiskGeoJSON,
  onDistrictClick,
}: MapContainerProps) {
  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Global filter state
  const { state, setFocusedDistrict, clearFocusedDistrict } = useFilters();
  const layers = layersOverride ?? state.layers;

  // Local state
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<{
    name: string;
    value: string;
    layerType: "migration" | "periUrban" | "digitalRisk";
  } | null>(null);

  // Count active layers for display
  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  // ============================================================
  // TOOLTIP METRIC BASED ON ACTIVE LAYER
  // ============================================================

  const getTooltipMetric = useCallback(
    (
      props: Record<string, unknown>,
      layerType: "migration" | "periUrban" | "digitalRisk"
    ): string => {
      switch (layerType) {
        case "migration": {
          const value = props.netMigrationPercent ?? props.migrationIndex;
          if (value === null || value === undefined) return "Migration: --";
          const numValue = Number(value);
          const sign = numValue >= 0 ? "+" : "";
          return `Net Migration: ${sign}${numValue}%`;
        }
        case "periUrban": {
          const value = props.growthIndex;
          if (value === null || value === undefined) return "Growth Index: --";
          return `Growth Index: ${Number(value).toFixed(2)}`;
        }
        case "digitalRisk": {
          const value = props.riskLevel ?? props.riskScore;
          if (value === null || value === undefined) return "Risk Level: --";
          return `Risk Level: ${value}`;
        }
        default:
          return "--";
      }
    },
    []
  );
  // MAP INITIALIZATION (ONCE)
  // ============================================================

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn("Mapbox token not configured. Set VITE_MAPBOX_TOKEN in .env.local");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      minZoom: 3,
      maxZoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ============================================================
  // LAYER: MIGRATION HEATMAP
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = LAYER_IDS.migrationSource;
    const layerId = LAYER_IDS.migration;

    // Remove existing layer and source
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!migrationGeoJSON || migrationGeoJSON.features.length === 0) return;

    // Add source
    map.addSource(sourceId, {
      type: "geojson",
      data: migrationGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add fill layer with color scale (blue → red)
    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "migrationIndex"], 0],
          -1, "#2166ac",  // Strong blue (outflow)
          -0.5, "#67a9cf",
          0, "#f7f7f7",   // Neutral
          0.5, "#ef8a62",
          1, "#b2182b",   // Strong red (inflow)
        ],
        "fill-opacity": 0.6,
      },
      layout: {
        visibility: layers.migration ? "visible" : "none",
      },
    });

    // Hover handlers for tooltip
    map.on("mouseenter", layerId, (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const districtName = String(props.name || props.district || "Unknown");
        setHoveredFeature({
          name: districtName,
          value: getTooltipMetric(props, "migration"),
          layerType: "migration",
        });
        setFocusedDistrict(districtName);
      }
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      setHoveredFeature(null);
      clearFocusedDistrict();
    });

    // Click handler for district selection
    map.on("click", layerId, (e) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const districtName = String(props.name || props.district || "");
        if (districtName && onDistrictClick) {
          onDistrictClick(districtName);
        }
      }
    });
  }, [mapLoaded, migrationGeoJSON, layers.migration, getTooltipMetric, setFocusedDistrict, clearFocusedDistrict, onDistrictClick]);

  // ============================================================
  // LAYER: PERI-URBAN ALERT
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = LAYER_IDS.periUrbanSource;
    const layerId = LAYER_IDS.periUrban;
    const outlineId = LAYER_IDS.periUrbanOutline;

    // Remove existing layers and source
    if (map.getLayer(outlineId)) map.removeLayer(outlineId);
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!periUrbanGeoJSON || periUrbanGeoJSON.features.length === 0) return;

    // Add source
    map.addSource(sourceId, {
      type: "geojson",
      data: periUrbanGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add fill layer (orange highlighting)
    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": "#f97316", // Orange
        "fill-opacity": 0.4,
      },
      layout: {
        visibility: layers.periUrban ? "visible" : "none",
      },
    });

    // Add outline layer for emphasis
    map.addLayer({
      id: outlineId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": "#ea580c", // Darker orange
        "line-width": 2,
      },
      layout: {
        visibility: layers.periUrban ? "visible" : "none",
      },
    });

    // Hover handlers
    map.on("mouseenter", layerId, (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const zoneName = String(props.name || props.zone || "Zone");
        setHoveredFeature({
          name: zoneName,
          value: getTooltipMetric(props, "periUrban"),
          layerType: "periUrban",
        });
        setFocusedDistrict(zoneName);
      }
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      setHoveredFeature(null);
      clearFocusedDistrict();
    });

    // Click handler for district selection
    map.on("click", layerId, (e) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const zoneName = String(props.name || props.zone || "");
        if (zoneName && onDistrictClick) {
          onDistrictClick(zoneName);
        }
      }
    });
  }, [mapLoaded, periUrbanGeoJSON, layers.periUrban, getTooltipMetric, setFocusedDistrict, clearFocusedDistrict, onDistrictClick]);

  // ============================================================
  // LAYER: DIGITAL EXCLUSION OVERLAY
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = LAYER_IDS.digitalRiskSource;
    const layerId = LAYER_IDS.digitalRisk;

    // Remove existing layer and source
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!digitalRiskGeoJSON || digitalRiskGeoJSON.features.length === 0) return;

    // Add source
    map.addSource(sourceId, {
      type: "geojson",
      data: digitalRiskGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add fill layer with color scale (green → red for risk)
    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "riskScore"], 0],
          0, "#22c55e",   // Green (low risk)
          0.5, "#eab308", // Yellow (medium)
          1, "#ef4444",   // Red (high risk)
        ],
        "fill-opacity": 0.45, // Lower opacity than migration
      },
      layout: {
        visibility: layers.digitalRisk ? "visible" : "none",
      },
    });

    // Hover handlers
    map.on("mouseenter", layerId, (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const districtName = String(props.name || props.district || "Unknown");
        setHoveredFeature({
          name: districtName,
          value: getTooltipMetric(props, "digitalRisk"),
          layerType: "digitalRisk",
        });
        setFocusedDistrict(districtName);
      }
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      setHoveredFeature(null);
      clearFocusedDistrict();
    });

    // Click handler for district selection
    map.on("click", layerId, (e) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        const districtName = String(props.name || props.district || "");
        if (districtName && onDistrictClick) {
          onDistrictClick(districtName);
        }
      }
    });
  }, [mapLoaded, digitalRiskGeoJSON, layers.digitalRisk, getTooltipMetric, setFocusedDistrict, clearFocusedDistrict, onDistrictClick]);

  // ============================================================
  // LAYER VISIBILITY CONTROL
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Migration layer
    if (map.getLayer(LAYER_IDS.migration)) {
      map.setLayoutProperty(
        LAYER_IDS.migration,
        "visibility",
        layers.migration ? "visible" : "none"
      );
    }

    // Peri-urban layers
    if (map.getLayer(LAYER_IDS.periUrban)) {
      map.setLayoutProperty(
        LAYER_IDS.periUrban,
        "visibility",
        layers.periUrban ? "visible" : "none"
      );
    }
    if (map.getLayer(LAYER_IDS.periUrbanOutline)) {
      map.setLayoutProperty(
        LAYER_IDS.periUrbanOutline,
        "visibility",
        layers.periUrban ? "visible" : "none"
      );
    }

    // Digital risk layer
    if (map.getLayer(LAYER_IDS.digitalRisk)) {
      map.setLayoutProperty(
        LAYER_IDS.digitalRisk,
        "visibility",
        layers.digitalRisk ? "visible" : "none"
      );
    }
  }, [mapLoaded, layers]);

  // ============================================================
  // DISTRICT FOCUS BEHAVIOR
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !district) return;

    // Find bounds from any available GeoJSON that matches district
    const findDistrictBounds = (): mapboxgl.LngLatBoundsLike | null => {
      const sources = [migrationGeoJSON, periUrbanGeoJSON, digitalRiskGeoJSON];
      
      for (const geojson of sources) {
        if (!geojson) continue;
        
        const districtFeatures = geojson.features.filter((f) => {
          const name = f.properties?.name || f.properties?.district;
          return name?.toLowerCase() === district.toLowerCase();
        });

        if (districtFeatures.length > 0) {
          return getBoundsFromGeoJSON({
            type: "FeatureCollection",
            features: districtFeatures,
          });
        }
      }
      return null;
    };

    const bounds = findDistrictBounds();
    if (bounds) {
      map.fitBounds(bounds, {
        padding: 50,
        duration: 1000, // Smooth transition
        maxZoom: 10,
      });
    }
  }, [mapLoaded, district, migrationGeoJSON, periUrbanGeoJSON, digitalRiskGeoJSON]);

  // ============================================================
  // ZOOM CONTROLS
  // ============================================================

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleResetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      duration: 1000,
    });
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  // Show placeholder if no token
  if (!MAPBOX_TOKEN) {
    return (
      <div className="map-container w-full h-full rounded-md flex flex-col relative overflow-hidden animate-scale-in">
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/50">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Map Not Configured</p>
              <p className="text-sm text-muted-foreground">
                Set VITE_MAPBOX_TOKEN in .env.local
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container w-full h-full rounded-md flex flex-col relative overflow-hidden animate-scale-in">
      {/* Mapbox Container */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-1">
        <button
          className="map-control-btn"
          title="Zoom In"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button
          className="map-control-btn"
          title="Zoom Out"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
        <button
          className="map-control-btn mt-2"
          title="Reset View"
          onClick={handleResetView}
        >
          <Locate className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Tooltip - Shows on hover */}
      {hoveredFeature && (
        <div className="absolute left-4 bottom-4 bg-card border border-border rounded-md p-3 shadow-sm max-w-xs transition-all duration-200">
          <p className="text-sm font-medium text-foreground">{hoveredFeature.name}</p>
          <p className="text-xs text-muted-foreground">{hoveredFeature.value}</p>
        </div>
      )}

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
            <span
              className="legend-dot-migration animate-scale-in"
              title="Migration"
            />
          )}
          {layers.periUrban && (
            <span
              className="legend-dot-periurban animate-scale-in"
              title="Peri-Urban"
            />
          )}
          {layers.digitalRisk && (
            <span
              className="legend-dot-exclusion animate-scale-in"
              title="Digital Exclusion"
            />
          )}
        </div>
      </div>
    </div>
  );
}
