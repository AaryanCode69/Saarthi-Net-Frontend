import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { districtOptions, timeRangeOptions, DistrictOption, TimeRangeOption } from "@/mock/dashboardData";
import { useFilters, LayerState } from "@/store/filters";
import { MIN_VISIBLE_LAYERS } from "@/config/demoDefaults";

interface FiltersPanelProps {
  /** Optional: Override district options from backend */
  districts?: DistrictOption[];
  /** Optional: Override time range options from backend */
  timeRanges?: TimeRangeOption[];
}

/**
 * Check if a layer is the only active layer (can't be disabled)
 */
function isOnlyActiveLayer(layers: LayerState, layerKey: keyof LayerState): boolean {
  const activeCount = Object.values(layers).filter(Boolean).length;
  return layers[layerKey] && activeCount <= MIN_VISIBLE_LAYERS;
}

export function FiltersPanel({
  districts = districtOptions,
  timeRanges = timeRangeOptions,
}: FiltersPanelProps) {
  // Use global filter state
  const { state, setDistrict, setPeriod, toggleLayer } = useFilters();

  // Check if each layer is the only one active (guards against all-off state)
  const isMigrationOnlyActive = isOnlyActiveLayer(state.layers, "migration");
  const isPeriUrbanOnlyActive = isOnlyActiveLayer(state.layers, "periUrban");
  const isDigitalRiskOnlyActive = isOnlyActiveLayer(state.layers, "digitalRisk");

  return (
    <aside className="filter-panel w-full h-full p-4 flex flex-col gap-6 animate-slide-in-left">
      {/* Section Title */}
      <div className="border-b border-border pb-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Filters</h2>
      </div>

      {/* District Filter */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Label className="data-label">District</Label>
        <Select value={state.district} onValueChange={setDistrict}>
          <SelectTrigger className="w-full h-9 text-sm transition-all duration-200 hover:border-primary/50">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.value} value={district.value}>
                {district.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Range Filter */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Label className="data-label">Time Range</Label>
        <Select value={state.period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full h-9 text-sm transition-all duration-200 hover:border-primary/50">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Label className="data-label">Map Layers</Label>
        
        {/* Migration Heatmap Toggle */}
        <div className="layer-toggle-row">
          <div className="flex items-center gap-2">
            <span className={`legend-dot-migration transition-transform duration-200 ${state.layers.migration ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${state.layers.migration ? 'text-foreground' : 'text-muted-foreground'}`}>
              Migration Heatmap
            </span>
          </div>
          <Switch
            checked={state.layers.migration}
            onCheckedChange={() => toggleLayer("migration")}
            disabled={isMigrationOnlyActive}
            className={`transition-all duration-200 ${isMigrationOnlyActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Peri-Urban Alert Zones Toggle */}
        <div className="layer-toggle-row">
          <div className="flex items-center gap-2">
            <span className={`legend-dot-periurban transition-transform duration-200 ${state.layers.periUrban ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${state.layers.periUrban ? 'text-foreground' : 'text-muted-foreground'}`}>
              Peri-Urban Alert Zones
            </span>
          </div>
          <Switch
            checked={state.layers.periUrban}
            onCheckedChange={() => toggleLayer("periUrban")}
            disabled={isPeriUrbanOnlyActive}
            className={`transition-all duration-200 ${isPeriUrbanOnlyActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Digital Exclusion Risk Toggle */}
        <div className="layer-toggle-row">
          <div className="flex items-center gap-2">
            <span className={`legend-dot-exclusion transition-transform duration-200 ${state.layers.digitalRisk ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${state.layers.digitalRisk ? 'text-foreground' : 'text-muted-foreground'}`}>
              Digital Exclusion Risk
            </span>
          </div>
          <Switch
            checked={state.layers.digitalRisk}
            onCheckedChange={() => toggleLayer("digitalRisk")}
            disabled={isDigitalRiskOnlyActive}
            className={`transition-all duration-200 ${isDigitalRiskOnlyActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </aside>
  );
}
