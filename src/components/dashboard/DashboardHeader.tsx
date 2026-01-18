import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
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

export function DashboardHeader({
  selectedDistrict,
  onDistrictChange,
  selectedTimeRange,
  onTimeRangeChange,
}: DashboardHeaderProps) {
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
        <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
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
        <Select value={selectedDistrict} onValueChange={onDistrictChange}>
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
