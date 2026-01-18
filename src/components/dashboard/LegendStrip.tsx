// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface LegendItem {
  id: string;
  label: string;
  colorClass: string;
}

export interface LegendStripProps {
  // TODO: Accept legend items from backend when available
  // legendItems?: LegendItem[];
  disclaimerText?: string;
}

// Static legend items - UI configuration only
const defaultLegendItems: LegendItem[] = [
  { id: "migration", label: "Migration", colorClass: "legend-dot-migration" },
  { id: "periurban", label: "Peri-Urban Zones", colorClass: "legend-dot-periurban" },
  { id: "exclusion", label: "Digital Exclusion", colorClass: "legend-dot-exclusion" },
];

const defaultDisclaimer = "Insights are derived from anonymized, aggregated identity metadata.";

// ============================================================
// MAIN COMPONENT
// ============================================================

export function LegendStrip({ disclaimerText = defaultDisclaimer }: LegendStripProps) {
  return (
    <footer className="h-12 px-6 bg-card border-t border-border flex items-center justify-between animate-fade-in">
      {/* Legend Items */}
      <div className="flex items-center gap-6">
        {defaultLegendItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 group cursor-default transition-transform duration-200 hover:scale-105"
          >
            <span className={`${item.colorClass} transition-transform duration-200 group-hover:scale-125`} />
            <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground">
        {disclaimerText}
      </p>
    </footer>
  );
}
