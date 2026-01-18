import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FiltersPanelProps {
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
  layers: {
    migration: boolean;
    periUrban: boolean;
    digitalExclusion: boolean;
  };
  onLayerToggle: (layer: keyof FiltersPanelProps["layers"]) => void;
}

// Mock district data
const districts = [
  { value: "all", label: "All Districts" },
  { value: "patna", label: "Patna" },
  { value: "gaya", label: "Gaya" },
  { value: "muzaffarpur", label: "Muzaffarpur" },
  { value: "bhagalpur", label: "Bhagalpur" },
  { value: "darbhanga", label: "Darbhanga" },
];

const timeRanges = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
];

export function FiltersPanel({
  selectedDistrict,
  onDistrictChange,
  selectedTimeRange,
  onTimeRangeChange,
  layers,
  onLayerToggle,
}: FiltersPanelProps) {
  return (
    <aside className="filter-panel w-full h-full p-4 flex flex-col gap-6 animate-slide-in-left">
      {/* Section Title */}
      <div className="border-b border-border pb-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Filters</h2>
      </div>

      {/* District Filter */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Label className="data-label">District</Label>
        <Select value={selectedDistrict} onValueChange={onDistrictChange}>
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
        <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
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
            <span className={`legend-dot-migration transition-transform duration-200 ${layers.migration ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${layers.migration ? 'text-foreground' : 'text-muted-foreground'}`}>
              Migration Heatmap
            </span>
          </div>
          <Switch
            checked={layers.migration}
            onCheckedChange={() => onLayerToggle("migration")}
            className="transition-all duration-200"
          />
        </div>

        {/* Peri-Urban Alert Zones Toggle */}
        <div className="layer-toggle-row">
          <div className="flex items-center gap-2">
            <span className={`legend-dot-periurban transition-transform duration-200 ${layers.periUrban ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${layers.periUrban ? 'text-foreground' : 'text-muted-foreground'}`}>
              Peri-Urban Alert Zones
            </span>
          </div>
          <Switch
            checked={layers.periUrban}
            onCheckedChange={() => onLayerToggle("periUrban")}
            className="transition-all duration-200"
          />
        </div>

        {/* Digital Exclusion Risk Toggle */}
        <div className="layer-toggle-row">
          <div className="flex items-center gap-2">
            <span className={`legend-dot-exclusion transition-transform duration-200 ${layers.digitalExclusion ? 'scale-110' : 'scale-100 opacity-50'}`} />
            <span className={`text-sm transition-colors duration-200 ${layers.digitalExclusion ? 'text-foreground' : 'text-muted-foreground'}`}>
              Digital Exclusion Risk
            </span>
          </div>
          <Switch
            checked={layers.digitalExclusion}
            onCheckedChange={() => onLayerToggle("digitalExclusion")}
            className="transition-all duration-200"
          />
        </div>
      </div>
    </aside>
  );
}
