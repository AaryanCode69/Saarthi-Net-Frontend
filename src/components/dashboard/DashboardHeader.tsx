import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtOptions, timeRangeOptions, DistrictOption, TimeRangeOption } from "@/mock/dashboardData";
import { useFilters } from "@/store/filters";

interface DashboardHeaderProps {
  /** Optional: Override district options from backend */
  districts?: DistrictOption[];
  /** Optional: Override time range options from backend */
  timeRanges?: TimeRangeOption[];
}

export function DashboardHeader({
  districts = districtOptions,
  timeRanges = timeRangeOptions,
}: DashboardHeaderProps) {
  // Use global filter state
  const { state, setDistrict, setPeriod } = useFilters();

  return (
    <header className="dashboard-header sticky top-0 z-50 h-14 px-6 flex items-center justify-between shadow-sm">
      {/* Left: Branding */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold tracking-tight">Saarthi Net</h1>
        <p className="text-xs opacity-80">Data Intelligence for Migration & Digital Inclusion</p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Time Range Selector */}
        <Select value={state.period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36 h-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm">
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

        {/* District Selector */}
        <Select value={state.district} onValueChange={setDistrict}>
          <SelectTrigger className="w-40 h-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm">
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
    </header>
  );
}
