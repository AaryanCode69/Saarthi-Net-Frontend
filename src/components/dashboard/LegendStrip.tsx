// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface LegendItem {
  id: string;
  label: string;
  description: string;
  colorClass: string;
}

export interface LegendStripProps {
  // TODO: Accept legend items from backend when available
  // legendItems?: LegendItem[];
  disclaimerText?: string;
}

// Static legend items with plain-language explanations - UI configuration only
const defaultLegendItems: LegendItem[] = [
  { 
    id: "migration", 
    label: "Migration Pressure", 
    description: "Population movement intensity",
    colorClass: "legend-dot-migration" 
  },
  { 
    id: "periurban", 
    label: "Peri-Urban Growth", 
    description: "Rural-to-urban transition zones",
    colorClass: "legend-dot-periurban" 
  },
  { 
    id: "exclusion", 
    label: "Digital Access Risk", 
    description: "Low connectivity or identity coverage",
    colorClass: "legend-dot-exclusion" 
  },
];

const defaultDisclaimer = "All insights are derived from anonymized, aggregated identity metadata.";

// ============================================================
// MAIN COMPONENT
// ============================================================

export function LegendStrip({ disclaimerText = defaultDisclaimer }: LegendStripProps) {
  return (
    <footer className="h-14 px-6 bg-card border-t border-border flex items-center justify-between animate-fade-in">
      {/* Legend Items */}
      <div className="flex items-center gap-8">
        {defaultLegendItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 group cursor-default transition-transform duration-200 hover:scale-105"
          >
            <span className={`${item.colorClass} transition-transform duration-200 group-hover:scale-125`} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground transition-colors duration-200">
                {item.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground italic">
        {disclaimerText}
      </p>
    </footer>
  );
}
